// DEBUG = true;
var token = ajaxToken();

$(function() {
	currpage  = "inf";
	currtitle = "Infer";

    setDiv('uid','User-ID: ' + '<span style="color:cyan">' + sessionStorage.getItem('uid') + '</span>');
    setDiv('rol','Role: '    + '<span style="color:cyan">' + sessionStorage.getItem('rol') + '</span>');

    get_list_att();
});

function ajaxInfer() {

    rst = get('rst');
    bid = get('bid');

    if (bid == "") {
        message("Batch ID of Input Data missing");
        return;
    }
    var check = chkNum('id_tbx_bid');
    if (!check)
        return;

    var obj;
    $.ajaxSetup({async: false, type: 'POST', dataType: 'JSON'});
    $.post('http://localhost:8080/infer', {'rst':rst, 'bid':bid, 'tok':tok_cli},
        function (data) {
            obj = data
//            console.log(obj)
        })
        .done(function () {
        });

    //rete(obj);

    message("Inference completed<BR>Please see OUTPUT tab");
    //    window.location.href = "http://localhost:8080/static/module/out/out.html";

}

function rete(obj) {

    var rul = obj['rul']['rows'];
    var dat = obj['dat']['rows'];

    console.log('Rule');
    for (var i=0; i<rul.length; i++)
        console.log(rul[i]);
    console.log('Data');
    for (var i=0; i<dat.length; i++)
        console.log(dat[i]);


    var s = "DELETE FROM fas.out WHERE oid=" + "'" + bid + "'";
    ajaxCrud(s,tok_cli);
    var s = "DELETE FROM fas.log WHERE bid=" + "'" + bid + "'";
    ajaxCrud(s,tok_cli);

    var out = [];
    var tst = 1;
    
    var ncon = 0;
    con = { }


    //
    //Pattern Match
    //
    console.log("Pattern Match");
    while (true) {
        for (var i=0; i<rul.length; i++) {

            if ( (rul[i][3] != true) && (rul[i][3] != false) ) {

                var str = rul[i][1].toString();
                console.log(str);

                // pattern match with available dat
                for (var j=0; j<dat.length; j++) {
                    var att = dat[j][1].toString();
                    var val = dat[j][2].toString();
                    var tmp = str.replace(new RegExp(att, 'g'), val);
                    str = tmp;
                }

                // if predicates in string contains "proc_", procedure calls are required
                console.log(str);
                var s  = str.replace(/\(/g,'').replace(/\)/g,'');
                var as = s.split(' ');

                var pred = "";
                var sym  = "";
                var val  = "";
                for (var k=0; k<as.length; k++) {
                    if (as[k].includes("proc_")) {
                        var sym = as[k].substr(5);
                        var asym = sym.split(".");
                        proc = asym[0] + asym[1].charAt(0).toUpperCase() + asym[1].substr(1);

                        var val = ajaxProc(proc,"");
                        var str = str.replace(new RegExp("proc_"+sym, 'g'), val["val"]);
                        console.log(str);
                    }
                }

                try {   // try to evaluate str
                    console.log(str);
                    var res = eval(str);
                    console.log(res);

                    if (res == true) {  // if true, push the consequences to the dat
                        console.log("->",rul[i][2]);
                        con = con2obj(bid,rul[i][2]);
                        dat.push(con);
                        out.push(con);
                    }

                    rul[i][3] = res;  // evaluated to true or false
                    rul[i][4] = tst;
                    insLog(i,rul,dat);
                    tst++;
                }
                catch (err) {
                    console.log("eval failed");
                }
            }

        }

        if (out.length == ncon) 
            break;
        else
            ncon = out.length;
    }

    debug(dat,rul,out);

    return obj;
}


function ajaxProc(proc,ctx) {
    var obj = null

    var url = "http://localhost:8080/" + proc;
    $.ajaxSetup({async: false, type: 'POST', dataType: 'JSON'});
    $.post('http://localhost:8080/carAcc', {'tok':tok_cli, 'ctx':ctx},
        function (data) {
            obj = data;
        })
        .done(function () {
        });
    return obj;
}

function con2obj(bid,con) { // input is a predicate, returns a JSON object
    var acon = con.split("=");
    acon[0] = acon[0].trim();
    acon[1] = acon[1].trim();

    con = { }
    con[0] = bid;
    con[1] = acon[0];
    con[2] = acon[1];

    if (typeof(con[2]) == "string")
        var s = "INSERT INTO fas.out (oid,att,val) VALUES(" + "'"+bid+"'," + "'"+con[1]+"'," + '"'+con[2]+'"' + ")";
    else
        var s = "INSERT INTO fas.out (oid,att,val) VALUES(" + "'"+bid+"'," + "'"+con[1]+"'," + con[2] + ")";

    console.log(s);
    ajaxCrud(s,tok_cli);

    return con;
}

function insLog(i,rul,dat) {
    var s = "INSERT INTO fas.log (bid,rid,ant,con,res,tst) VALUES(";
    s = s + '"' + dat[i][0] + '",';
    s = s + '"' + rul[i][0] + '",';

    s = s + '"' + rul[i][1] + '",';
    s = s + '"' + rul[i][2] + '",';

    s = s + '"' + rul[i][3] + '",';
    s = s +       rul[i][4] + ')';

    console.log(s);
    ajaxCrud(s,tok_cli);
}

function debug(dat,rul,out) {
    console.log('Final Data');
    for (var i=0; i<dat.length; i++)
        console.log(dat[i]);

    console.log('Output');
    for (var i=0; i<out.length; i++)
        console.log(out[i]);

    console.log('Rule Status');
    for (var i=0; i<rul.length; i++)
        console.log(rul[i]);
}





function get_list_att() {

    att = get('rst');
    aatt = att.split(' ');

    var s = "SELECT DISTINCT(ant) FROM fas.rul WHERE ant LIKE " + "'%" + aatt[0] + "%'";
    for (var i=1; i<aatt.length; i++) {
        s = s + " AND ant LIKE " + "'%" + aatt[i] + "%' "
    }
    s = s + " ORDER BY ant";
    // alert(s);
    list_att = ["VPS","FOC","PC","VC"];
    var obj = ajaxSelect(s,"String");
    var nrow = obj.nrow;

    for (var i=0; i<nrow; i++) {
//        console.log(obj.rows[i][0]);
        if ($.inArray(obj.rows[i][0], list_att) == -1)
            list_att.push(obj.rows[i][0]);
    }
//    console.log(list_att);
    list_att = ["VPS","VPS, VC, PC"];

    var inp = "#id_tbx_rst";
    $(inp).autocomplete(
        {
            source: function(requestObj, responseFunc) {
                var matchArry = list_att.slice(); // Copy the array
                var srchTerms = $.trim(requestObj.term).split(/\s+/);
                // For each search term, remove non-matches.
                $.each(srchTerms, function(J, term) {
                    var regX = new RegExp(term, "i");
                    matchArry = $.map(matchArry, function(item) {
                        return regX.test(item) ? item : null;
                    });
                });
                // Return the match results.
                responseFunc(matchArry);
            },
            open: function(event, ui) {
                // This function provides no hooks to the results list, so we have to trust the selector, for now.
                var resultsList = $("li.ui-menu-item");
//                console.log(resultsList);
                var srchTerm = $.trim($("#id_tbx_ant").val()).split(/\s+/).join('|');
                // Loop through the results list and highlight the terms.
                resultsList.each(function() {
                    var jThis = $(this);
                    var regX = new RegExp('(' + srchTerm + ')', "ig");
                    var oldTxt = jThis.text();
                    jThis.html(oldTxt.replace(regX, '<span class="srchHilite">$1</span>'));
                });
            },
            minLength: 0,
            max: 6,
            highlightItem: true,
            multiple: true,
            multipleSeparator: " ",
        }).focus(function () {
        $(this).autocomplete('search', $(this).val());
    });
//    console.log(list_att);

}