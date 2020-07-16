// DEBUG = true;

var token = ajaxToken();

$(function() {
	currpage  = "rul";
	currtitle = "Rules";
    nr    = 8;
    hlCol = -1;

    //            0   1   2   3   4
	colType   = ['S','S','S','S','I'];
	colName	  = "rid,ant,con,rem,pmk";	// pmk MUST be last

    inpMust   = [ 'rid', 'Type missing',
                  'ant', 'IF condition  missing',
                  'con', 'Then condition missing'
				];

	autoPopList = ["cnd"];

	initPage();	// createInp, hlCol, setAC, setDiv, sql
	orderby = " ORDER BY rid ";
    ajaxPopTab();

    try {
        if (rol.toLowerCase() == "readonly") {
            $("#id_but_ins").attr("disabled", true);
            $("#id_but_upd").attr("disabled", true);
            $("#id_but_del").attr("disabled", true);
        }
        else {
            $("#id_but_ins").attr("disabled", false);
            $("#id_but_upd").attr("disabled", false);
            $("#id_but_del").attr("disabled", false);        
        }
    }
    catch (err) { } 

    // $("#id_but_del").attr("disabled", true);

    get_list_rul("#id_sea_2",  "SELECT DISTINCT(ant) FROM fas.rul")
//    get_list_rul("#id_sea_3",  "SELECT DISTINCT(con) FROM fas.rul")
});



function setWhereCond() {
    where = " WHERE true";
	setCond();
}


function getLID() { // Customize for each page
    var sql, lid;

    sql = "SELECT pmk FROM fas.rul WHERE "         + 
          "rid=" + "'" + get('rid') + "'" + " AND " +
          "ant=" + "'" + get('ant') + "'" + " AND " +
          "con=" + "'" + get('con') + "'" ;
    lid = ajaxSelect(sql,"String,String,String").rows[0][0];
    return (lid);
}


function highlight(j,cell) {
    if (j == hlCol) {

        if (cell[j].innerHTML.toLowerCase() == "draft")  {
            cell[j].style.color      = 'blue';
            cell[j].style.fontWeight = 'bold';
            cell[j].style.fontStyle  = 'normal';  
        }        
        else if (cell[j].innerHTML.toLowerCase() == "final")  {
            cell[j].style.color      = 'green';
            cell[j].style.fontWeight = 'bold';
            cell[j].style.fontStyle  = 'normal';  
        }        
        else {
            cell[j].style.color      = 'white';
            cell[j].style.fontWeight = 'bold';
            cell[j].style.fontStyle  = 'normal';
        }    
    }

}


function view_rule() {
    if (hlrowno == -1) {
        message("Please select a row to view");
        return;
    }

    var rem2 = get('ant').replace(/\\/g, "");
    var rem3 = rem2.replace(/\n/g, "<BR>");
    var rem4 = rem3.replace(/\'/g, "'");

    $("#id_div_msg").dialog( "option", "width", 800 );
    $("#id_div_msg").dialog( "option", "height", 450 );
    $("#id_div_msg").dialog( "option", "title", "Remark" );

    if (rem4 != "")
        message(rem4);
}



function get_list_rul(inp,s) {

    if (inp.indexOf(2) != -1) {
        var aatt = get('ant').split(' ');
        s = s + " WHERE ant LIKE " + "'%" + aatt[0] + "%'";
        for (var i=1; i<aatt.length; i++) {
            s = s + " AND ant LIKE " + "'%" + aatt[i] + "%' "
        }
        s = s + " ORDER BY ant";            // alert(s);
    }
//    if (inp.indexOf(3) != -1) {
//        var aatt = get('con').split(' ');
//        s = s + " WHERE con LIKE " + "'%" + aatt[0] + "%'";
//        for (var i=1; i<aatt.length; i++) {
//            s = s + " AND con LIKE " + "'%" + aatt[i] + "%' "
//        }
//        s = s + " ORDER BY con";            // alert(s);
//    }

    list_att = [];
    var obj = ajaxSelect(s,"String");   // console.log(s);
    var nrow = obj.nrow;                // console.log(nrow);   console.log(obj.rows);

    for (var i=0; i<nrow; i++) {
        if ($.inArray(obj.rows[i][0], list_att) == -1)
            list_att.push(obj.rows[i][0]);
    }
//    console.log(list_att);

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
                var srchTerm = $.trim($(inp).val()).split(/\s+/).join('|');
                // Loop through the results list and highlight the terms.
                resultsList.each(function() {
                    var jThis = $(this);
                    var regX = new RegExp('(' + srchTerm + ')', "ig");
                    var oldTxt = jThis.text();
                    jThis.html(oldTxt.replace(regX, '<span class="srchHilite">$1</span>'));
                });
            },
            minLength: 0,
            max: 120,
            highlightItem: true,
            multiple: true,
            multipleSeparator: " ",
        }).focus(function () {
        $(this).autocomplete('search', $(this).val());

        sea(2);
    });
}
