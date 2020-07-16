var DEBUG = false;

var root = 'fas';
var path = '/' + root + '/libphp/';
var loc;
var pmk, nam, ema, mob, pwd;
var currpage, pagetitle, colName, colType, sql, typ;     			   // Page name = Table name
var inpName = [], inpMust = [];
var nr, hlColor = '#ED0B00', bgColor1 = 'black', bgColor2 = 'black';
var hlCol, hlrowno = -1, prrowno = -1;							   // hlrowno 2 .. 13, 0=header, 1=search
var where = "", cond = "", orderby = "", limit = " LIMIT 0," + nr;
var page = 0;
var sortOrder = "DESC";
var autoPopList = [];
var nrow;

hlColor = 'lime';

var tok_cli = sessionStorage.getItem('tok');

function initPage() {
    loc = window.location.toString();
    createInp();
    autoPop(autoPopList);

    sql = "SELECT " + colName + " FROM " + root + "." + currpage;
    getTypStr();

}

function getTypStr() {
    typ = ""
    var t
    for (var i=0; i<colType.length; i++) {
        if (colType[i] == 'I') 
            t = "Int";
        if (colType[i] == 'M') 
            t = "Float";
        if (colType[i] == 'N') 
            t = "Float";
        if (colType[i] == 'S') 
            t = "String";
        if (colType[i] == 'D') 
            t = "Date";

        if (i < colType.length - 1)
            typ = typ + t + ","
        else
            typ = typ + t;
    }
}

function ajaxToken() {
    $.ajaxSetup({async: false, type: 'POST', dataType: 'JSON'});
    $.post('http://localhost:8080/token', {'tok':tok_cli},
        function (data) {
            var token = data['token'];

            if (!token)
                window.location.href = "/static/module/login/login.html";
        })
        .done(function () {
        });
    return;
}


function ajaxSelect(sql,typ) {
    var obj = null;
    // showWait();
    $.ajaxSetup({async: false, type: 'POST', dataType: 'JSON'});
    $.post('http://localhost:8080/select', {'sql': sql,'typ' : typ, 'tok':tok_cli},
        function (data) {
            var ncol = data['ncol'];
            var nrow = data['nrow']; 
            var rows = data['rows']; 
            var ntot = data['ntot']; 

            obj = {'ncol':ncol, 'nrow':nrow, 'rows':rows, 'ntot':ntot};
        })
        .done(function () {
            // hideWait();
        });

    return obj;
}

function ajaxCrud(sql) {
    var nins = 0, sql_error;
    // showWait();
    $.ajaxSetup({async: false, type: 'POST', dataType: 'JSON'});
    $.post('http://localhost:8080/crud', {'sql': sql, 'tok':tok_cli},
        function (data) {
            nins = data['nins'];
        })
        .done(function () {
            // hideWait();
        });
    return (nins);
}



function createInp() {
    var c = colName.split(',');
    for (var i = 0; i < c.length; i++)
        inpName[i] = c[i].trim();

    var hid = null;
    for (var i = 0; i < inpName.length; i++) {
        if ((document.getElementById('id_tbx_' + inpName[i]) == null) &&
            (document.getElementById('id_sel_' + inpName[i]) == null) &&
            (document.getElementById('id_tar_' + inpName[i]) == null))
        {
            hid = document.createElement('input');
            hid.setAttribute("id", "id_hid_" + inpName[i]);
            hid.setAttribute("type", "hidden");
            document.body.appendChild(hid);
        }
    }
}

function setInpVal(rowno) { 			// Increase by 2 within function
    clsTop();
    for (var i = 0; i < inpName.length; i++) {
        var colPos = getColPos(inpName[i]);			//alert('*** ' + inpName[i] + ' : ' + colPos + ' : ' + getCell(rowno,colPos+1));
        set(inpName[i], getCell(rowno, colPos+1));	// +1 because of Sel column
    }
}

function getColPos(inp) {				// Get column position for an inpName
    col = colName.split(',');
    hlColor

    for (var i = 0; i < col.length; i++) {
        col[i] = col[i].trim();
        if (col[i] == inp)
            return (i)
    }
}

function getCell(r, c) {				// r is rowno, c is colno. Increase r by 2 before passing to the argument to account header and search rows
    try {
        return ( document.getElementById('id_table').rows[r+2].cells[c].innerHTML.replace(/&amp;/g, '&') );
    }
    catch (err) {
        return ""
    }
}


// selRow()  -> clsTop()     -> unHilRow()  -> onUnSelRowSetSel() -> setInpVal(r) -> hilRow(r) -> onSelRowSetSel();
// clf()     -> resetSel() [if page is rev] -> cls() -> clsTop()
function selRow(r) {
    r = r-1;
    var elem = 'id_cbx_' + r.toString();
    // alert(r + " *** " + elem + "***" + document.getElementById(elem).checked);

    if (document.getElementById('id_cbx_' + r).checked == false) {

        if (document.getElementById('id_cbx_' + r).style.visibility == "visible" ) {

            document.getElementById('id_cbx_' + r).checked = true;
            hilRow(r);                  // increased by 2 to account for table header + Search in hilRow
            setInpVal(r);

            for (j = 0; j <= colType.length; j++) {
                document.getElementById('id_table').rows[prrowno + 2].cells[j].style.backgroundColor = "rgba(0,0,0,0.0)";
            }
            if (prrowno != -1) {
                // alert('id_cbx_' + (prrowno));
                document.getElementById('id_cbx_' + (prrowno)).checked = false;
            }

            prrowno = r;
            onSelRowSetSel();
        }
    }
    else if (document.getElementById('id_cbx_' + r).checked == true) {
        document.getElementById('id_cbx_' + r).checked = false;
        unHilRow();
        prrowno = -1;
        onUnSelRowSetSel();
        clsTop();
    }
}

function getRowFromLid(lid) {   // returns 1 to nr; selRow takes this return value to highlight the row.find
    for (var i=0; i<nr; i++) {
        if (lid == document.getElementById('id_table').rows[i+2].cells[ncol]) {
            return(i+1);
        }
    }
    return(-1);
}

function hilRow(rowno) {
    try {
        for (var j = 0; j <= colType.length; j++)
            document.getElementById('id_table').rows[rowno+2].cells[j].style.backgroundColor = hlColor;
        hlrowno = rowno;
    }
    catch (err) {
    }
}

function unHilRow() {

    var elem = document.getElementById('id_cbx_' + prrowno.toString());
    try {
        elem.checked = false;   // uncheck
    }
    catch (err) { }

    for (j = 0; j <= colType.length; j++) {
        document.getElementById('id_table').rows[prrowno + 2].cells[j].style.backgroundColor = "rgba(0,0,0,0.0)";
    }

    hlrowno = -1;           
    prrowno = -1;
}

function onSelRowSetSel() {            // Can be overridden in .js files
}

function onUnSelRowSetSel() {
}          // Can be overridden in .js files


function clsTab() {         // unhighlight, cleartable
    if (colType.length != document.getElementById('id_table').rows[0].cells.length - 1) { // Error, mismatch between DB Cols and HTML Cols
        var msg = 'Check colType in .js file and c in gen.py' + 
                  'Cols in HTML Table=' + document.getElementById('id_table').rows[0].cells.length + '\n' +
                  'Cols in DB Table=' + colType.length + '\n' +
                  'nc_HTML_Table = nc_DB_Table + 1 (due to Sel Col)';
        alert(msg);
        return;
    }

    try {
        for (i = 2; i <= nr+1; i++) {     // nr rows: 2..11 corresponding to cbx 0..9
            var id = 'id_cbx_' +(i - 2).toString();
            document.getElementById(id).style.visibility = 'hidden';        // hide checkbox
            for (j = 0; j < colType.length; j++) {
                document.getElementById('id_table').rows[i].cells[(j + 1)].innerHTML = '';   // clear table
            }
        }
    }
    catch (err) { }
}


function setCond() {
    cond = "";

    var c   = colName.split(',');

    for (var i = 0; i < c.length; i++)
        c[i] = c[i].trim();
    
    for (var i = 0; i < c.length; i++) {
        
        var getsea = "get(" + parseInt(i + 1) + ")";
        var ar = eval(getsea);

        var ar = ar.split(',');
        var l=-999999999999;
        var u= 999999999999;

        if ( ar.length == 1) {  // If nothing has been entered in search box, i.e., [""], length = 1
            if (colType[i] == 'S') {     // string
                if (ar[0] != "") {
                    var x =  ar[0].trim();
                    if (x[0] == "!") {
                        cond = cond + " AND " + c[i] + ' NOT LIKE ' + "'%" + x.substr(1) + "%'" + " ";
                    }
                    else {
                        cond = cond + " AND " + c[i] + ' LIKE ' + "'%" + ar[0] + "%'" + " ";
                    }
                }
            }
            else if ( colType[i] == 'D') {
                cond = cond + " AND " + c[i] + ' >= '   + "'"  + ar[0] + "'" + " ";                
            }
            else if ( (colType[i] == 'M') || (colType[i] == 'N') || (colType[i] == 'I') || (colType[i] == 'F')) {
                if (ar[0] == "")
                    ar[0] = l;
                // alert("***"+ar[0]);
                cond = cond + " AND " + c[i] + ' >= '   +  ar[0] + " ";                
            }            
        }
        else {

            if (ar[0] != "") {
                l = ar[0];
            }
            if (ar[1] != "") {
                u = ar[1];
            }

            if (colType[i] == 'D') {    // date
                l = new Date(l);
                l = "'" + l.toISOString().slice(0,19).replace('T',' ') + "'";

                u = new Date(u);
                u = "'" + u.toISOString().slice(0,19).replace('T',' ') + "'";
            }

            else if ( (colType[i] == 'N') || (colType[i] == 'M') || (colType[i] == 'I') || (colType[i] == 'F') ) {  
                cond = cond + " AND " + c[i] + ' >= ' + l + " AND " + c[i] + " <= " + u + " ";
            }

            else if (colType[i] == 'S') {
                cond = cond + " AND ("; 
                for (var n=0; n<ar.length; n++) {

                    if ( n == (ar.length - 1)) {
                            cond = cond + c[i] + ' LIKE ' + "'%" + ar[n].trim() + "%'" ;
                    }
                    else {
                            cond = cond + c[i] + ' LIKE ' + "'%" + ar[n].trim() + "%'" + " OR ";
                    }
                }
                cond = cond + ")"; 
            }
        }
    }   

    // alert(cond);
}


function ajaxPopTab() { // values in table cannot be

    clsTab();
    setWhereCond();
    var L1 = page * nr;
    var L2 = (page + 1) * nr;
    limit = 'LIMIT ' + L1 + ', ' + L2;
    var sqls = sql + ' ' + where + ' ' + cond + ' ' + orderby + ' ' + limit;
    getTypStr();

    if (DEBUG)
        alert(sqls);

    var obj = ajaxSelect(sqls,typ,tok_cli);
//    console.log(sqls);
//    console.log(typ);
//    console.log(obj);
    var nrow = obj['nrow']; // same as obj.nrow
    var ncol = obj['ncol'];
    var rows = obj['rows'];
    var ntot = obj['ntot'];

    // uid = obj.uid;
    // rol = obj.rol;
    
    // console.log(obj);
    setDiv('uid','User-ID: ' + '<span style="color:cyan">' + sessionStorage.getItem('uid') + '</span>');
    setDiv('rol','Role: '    + '<span style="color:cyan">' + sessionStorage.getItem('rol') + '</span>');

    var L2 = Math.min(nrow, nr);

    for (i = 0; i < L2; i++) {                                                                      // Populate the table

        document.getElementById('id_cbx_' + i).style.visibility = 'visible';                        // Set checkbox visible
        var cell = document.getElementById('id_table').rows[i + 2].cells;                           // Get cells for that row

        for (j = 0; j < colType.length; j++) {                  // Set all the Cells in Table

            if (colType[j] == 'S') {                            // Column shifts by 1, 1st column is checkbox, String
                // var x = rows[key].replace(/\n/g,'<BR>');        // Textarea Replace \n with <BR>
                // var x2 = x.replace(/'/g,"\'");                  // Textarea Replace \n with <BR>
                // cell[(j + 1)].innerHTML = x2;                   // Text format colType = 0 = String
                // console.log(x2);
                cell[(j + 1)].innerHTML = rows[i][j];            // Text format colType = 0 = String
            }
            else if (colType[j] == 'D') {                  
                if ( rows[j] != '0000-00-00') {       // rows[key] = rows[key].split(' ')[0];     // format '2014-04-15 00:00:00'
                    cell[(j + 1)].innerHTML = rows[i][key].substring(0,16);
                }
                else
                    cell[j + 1].innerHTML = '';
            }
            else if (colType[j] == 'N')                         
                cell[j + 1].innerHTML = parseFloat(rows[i][j]).toLocaleString("en-IN", {maximumFractionDigits: 0});

            else if (colType[j] == 'M')                         
                cell[j + 1].innerHTML = parseFloat(rows[i][j]).toLocaleString("en-IN", {minimumFractionDigits: 2}, {maximumFractionDigits: 2});

            else if (colType[j] == 'I')                         
                cell[(j + 1)].innerHTML = parseInt(rows[i][j]);

            else if (colType[j] == 'F') {                       
                cell[(j + 1)].innerHTML = parseFloat(rows[i][j]).toFixed(2);
            }

            highlight(j,cell);  // Overriden in currpage
        }
    }

    if (ntot != undefined) {
        if (ntot % nr !=0) {
            setDiv('num', " <span style='color:white;'>" + currtitle + ": " + "</span>" + "<span style='color:cyan;'>" + ntot + " Rec, Page " + (page + 1) + " of " + parseInt(Math.floor(ntot / nr) + 1) + "</span>");   // Display page num
        }
        else
            setDiv('num', " <span style='color:white;'>" + currtitle + ": " + "</span>" + "<span style='color:cyan;'>" + ntot + " Rec, Page " + (page + 1) + " of " + parseInt(Math.floor(ntot / nr) )    + "</span>");   // Display page num

    }
    else
        setDiv('num', " <span style='color:white;'>" + currtitle + ": " + "</span>" + "<span style='color:cyan;'>" + "0 Rec, Page 1 of 1" + "</span>");       // Display page num

}

// Dummy
function highlight(j,cell) {

}


function sortColumn(col) {
    if (col == '')
        return;

    clsTop();

    if (sortOrder.toLowerCase() == "asc") {
        sortOrder = "desc";
        orderby = " ORDER BY " + currpage + "." + col + " " + sortOrder + ' ';
        ajaxPopTab();
        return;
    }

    if (sortOrder.toLowerCase() == "desc") {
        sortOrder = "asc";
        orderby = " ORDER BY " + currpage + "." + col + " " + sortOrder + ' ';
        ajaxPopTab();
        return;
    }
}




function cls() {					     // clsTop + clsTab (through ajaxPopTab)
    unHilRow();
    clsTop();         
    page = 0;
    setCond();  
    ajaxPopTab();      			    // needed for vis module
    location.reload();
}

function clsTop() {				         // clears inpName at top
    for (i = 0; i < inpName.length; i++) {
        set(inpName[i], '');
    }
    onUnSelRowSetSel();
}

function clf() { 						 // clear search filter, invoked when the gif image is clicked
    for (i = 1; i <= 16; i++) {
        try {
            set(i, '');
        } catch (err) { }
    } 

    cls();
}

function sea() {						// invoked onchange sea fields
    clsTop();        
    page = 0;
    var L1 = page * nr;
    var L2 = (page + 1) * nr;
    limit = ' LIMIT ' + L1 + ', ' + L2;

    unHilRow();
    ajaxPopTab();
    onSelRowSetSel();

}




function nxt() {
    unHilRow();

    page = page + 1;
    var L1 = page * nr;
    var L2 = (page + 1) * nr;
    limit = 'LIMIT ' + L1 + ', ' + L2;
    var sqls = sql + ' ' + where + ' ' + cond + ' ' + orderby + ' ' + limit;

    nrow = ajaxSelect(sqls,typ,tok_cli).nrow;

    if (nrow == 0) {
        page = page - 1;
        message("At End of List");
        return;
    }
    else {
        clsTop();
        ajaxPopTab();
    }
}

function prv() {

    unHilRow();

    if (page == 0) {
        message("At beginning of list");
        return;
    }
    else {
        clsTop();
        page = page - 1;
        var L1 = page * nr;
        var L2 = (page + 1) * nr;
        limit = 'LIMIT ' + L1 + ', ' + L2;
        ajaxPopTab();
    }
}


function isEmpty() {
    var val;
    for (i = 0; i < inpMust.length; i = i + 2) {
        if (get(inpMust[i]) == "") {
            message(inpMust[i + 1]);
            return (true);
        }
    }
    return (false);
}

function createSqlIns() {

    var sqlIns = "INSERT INTO " + root + '.' + currpage + "(";
    for (i = 0; i < inpName.length-1; i++) {      // pmk is always last
        if (i != inpName.length - 2)
            sqlIns = sqlIns + inpName[i] + ",";
        else
            sqlIns = sqlIns + inpName[i] + ") VALUES(";
    }

    var val = "";
    for (i = 0; i < inpName.length-1; i++) {      // pmk is always last

        if ( inpName[i] != "lup") {
            var val = "";
            var ct = colType[getColPos(inpName[i])];

            if ( (ct == 'S') || (ct == 'D') || (ct == 'R') )
                val = "'" + get(inpName[i]) + "'";
            else                                      // 'I', 'F', 'N','M'
                val = strToNumber(get(inpName[i]));

            if ( (i != (inpName.length - 2)) )
                sqlIns = sqlIns + val + ",";
            else                                      // any other
                sqlIns = sqlIns + val;
        }
    }

    sqlIns = sqlIns + ");";
    // console.log(sqlIns);
    return (sqlIns);
}

function createSqlUpd() {

    var val = "";
    var sqlUpd = "UPDATE " + root + "." + currpage + " SET lup=NOW(), ";

    for (i = 0; i < inpName.length-1; i++) {  // pmk is always last
        var ct = colType[getColPos(inpName[i])];
            
        if ( (ct == 'S') || (ct == 'D') ) {
            val = get(inpName[i]);
            val = "'" + val + "'";
        }
        else    // 'I', 'F', 'N','M'
            val = strToNumber(get(inpName[i]));

        if ( (i != (inpName.length - 2)) )
            sqlUpd = sqlUpd + inpName[i] + "=" + val + ",";
        else
            sqlUpd = sqlUpd + inpName[i] + "=" + val;
    }

    sqlUpd = sqlUpd + " WHERE pmk=" + "'" + get('pmk') + "'";
    // console.log(sqlUpd);

    return (sqlUpd);
}



function findRowNo(lid) {
    var index = getColPos('pmk') + 1;

    pmk = lid;			// insert

    var sqlcount = "SELECT COUNT(pmk) FROM " + root + "." + currpage;
    // alert(sqlcount);
    var ntotal = ajaxSelect(sqlcount,"Int",tok_cli).rows[0][0];
    var npage = Math.ceil(ntotal / nr);
    // alert(ntotal);
    // alert(npage);
    // console.log(lid,ntotal,npage);

    // relies on the page global variable to locate the right page; ajaxPopTab() uses page
    for (page = 0; page < npage; page++) {  
        ajaxPopTab();
        for (var i = 0; i < nr; i++) {
            // console.log(pmk + ' : ' + getCell(i,index) );
            if (pmk == getCell(i, index)) {
                // console.log("Matched");
                var found = i;
                setInpVal(found);
                unHilRow();
                document.getElementById('id_cbx_' + found).checked = true;
                hilRow(found);
                prrowno = found;
                return (i)
            }
        }
    }
}

function getLID() { // Dummy

}


function insRec() {

    if (isEmpty())
        return;

    var sqlIns = createSqlIns();
    if (DEBUG)
        alert(sqlIns);
    var nins = ajaxCrud(sqlIns,tok_cli);


    if (nins == 1) {
        ajaxPopTab();
        var lid = getLID();
        findRowNo(lid);

        if ( (currpage == "brd") || (currpage == "uml") || (currpage == "doc")) {
            onSelRowSetSel();
        }
        if (currpage == "usr") {
            message("User created with NO password.<BR>User should set password first time after logging in.<BR>Password should be at least 8 characters long.");
        }
    }
    else
        message("Error Creating Record");
}

function updRec() {

    if (hlrowno == -1) { 							// No Record Selected
        message('No Record Selected');
        return;
    }

//    if ( (sessionStorage.getItem('rol').toLowerCase() != 'admin') ) {
//        message("You are not the owner of this record");
//        return;
//    }

    if (isEmpty())
        return;         


    var sqlUpd = createSqlUpd();
    if (DEBUG)
        alert(sqlUpd);    
    var nupd = ajaxCrud(sqlUpd,tok_cli);



    if (nupd == 1) {
        var pmk = getCell(prrowno, 1);

        ajaxPopTab();
        var lid = getLID();
        findRowNo(lid);
    }
    else {
        // message("Error Updating Record");
    }
}

function delRec() {

    if (hlrowno == -1) {    // No Record Selected
        message('No Record Selected');
        return;
    }

//    if ( (sessionStorage.getItem('rol').toLowerCase() != 'admin') ) {
//        message("You are not the owner of this record");
//        return;
//    }

    var sqlDel = "DELETE FROM " + root + '.' + currpage + " WHERE pmk=" + "'" + get('pmk') + "'";
    if (DEBUG)
        alert(sqlDel);
    var ndel = ajaxCrud(sqlDel,tok_cli);

    clsTop();
    page = 0;
    cond = " ";
    ajaxPopTab();

    if (currpage == "sta")
        onUnSelRowSetSel();

    unHilRow();
}


function get(id) {
    try {
            elem = document.getElementById('id_tbx_' + id);
            return (elem.value).replace(/'/g, "\\'");
        } catch (err) {
    }
    try {
            elem = document.getElementById('id_sel_' + id);
            return (elem.value);
        } catch (err) {
    }
    try {
            elem = document.getElementById('id_tar_' + id);
            return (elem.value).replace(/'/g, "\\'");
        } catch (err) {
    } // Escape "'" in textarea
    try {
            elem = document.getElementById('id_sea_' + id);
            return (elem.value);
        } catch (err) {
    }
    try {
            elem = document.getElementById('id_hid_' + id);
            return (elem.value);
        } catch (err) {
    }
}

function set(id, value) {
    var tmp1,tmp2;
    tmp1 = value;

    tmp2 = tmp1.replace(/<br>/g, '\n');
    // tmp1 = tmp2.replace(/'/g, "\'");
    tmp1 = tmp2.replace(/\\/g, "");

    tmp2 = tmp1.replace(/&lt;/g,'<'); 
    tmp1 = tmp2.replace(/&gt;/g,'>'); 

    value = tmp1;

    try {
            elem = document.getElementById('id_tbx_' + id);
            elem.value = value;
        } catch (err) {
    }
    try {
            elem = document.getElementById('id_sel_' + id);
            if (value == '')
                elem.selectedIndex = 0;
            else 
                elem.value = value;
        } catch (err) {
    }
    try {
            elem = document.getElementById('id_tar_' + id);
            elem.value = value;
        } catch (err) {
    }
    try {
        elem = document.getElementById('id_anc_' + id);
        elem.innerHTML = value;
    } catch (err) {
}    
    try {
            elem = document.getElementById('id_sea_' + id);
            elem.value = value;
        } catch (err) {
    }
    try {
            elem = document.getElementById('id_hid_' + id);
            elem.value = value;
        } catch (err) {
    }
}

function setSel(id, listVal) {
    id = 'id_sel_' + id;
    if (document.getElementById(id) == null)
        alert('Error: ' + id + ' Not Found');

    var n = document.getElementById(id).options.length = listVal.length;
    for (i = 0; i < n; i++) {
        document.getElementById(id).options[i].text = listVal[i];
        document.getElementById(id).options[i].value = listVal[i];
    }
}


function setDiv(id, value) {
    id = 'id_div_' + id;
    if (document.getElementById(id) == null)
        alert('Error: ' + id + ' Not Found');
    else
        document.getElementById(id).innerHTML = value;
}


function chkNum(id) {  				    // Check if it is a number

    var numbers = /^[0-9,.,-]+$/;  		// Digits and comma allowed

    value = document.getElementById(id).value;

    if (!value.match(numbers)) {
        message("Please Enter a Number");
        document.getElementById(id).focus();
        return false;
    }

    return true;
}

function today() {						// return format "2013-6-28 21:15"
    var dt = new Date().toISOString().substring(0, 10);
    return (dt);
}


function timeDiff(dt1, dt2) {     
    var dt1 = new Date(dt1);
    var dt2 = new Date(dt2);
    var td = dt2.getTime() - dt1.getTime();
    // var diffDays = td / (1000 * 3600 * 24); 
    return (td);
}


function ts() {							// current time in long seconds
    return new Date().getTime();
}

function strToMoney(str) {
    if ((str == '') || (str == null))
        return (0);
    num = parseFloat(str.replace(/,/g, ''));
    num = parseFloat(num).toLocaleString("en-IN", {minimumFractionDigits: 2});
    return (num);
}

function strToNumber(str) {
    if ((str == '') || (str == null))
        return (0);
    num = parseFloat(str.replace(/,/g, ''));
    return (num);
}

function strToDate(str) {
    if ((str == '') || (str == null))
        return ('0001-01-01');
    else
        return (str);
}

function padNum(str,len, pre) { 

    if (str == null)
        return;

    var gap = len - str.length;

    str = parseFloat(str).toLocaleString("en-IN", {minimumFractionDigits: pre, maximumFractionDigits: pre});

    for (var i=0; i< gap; i++) {
        str = "&nbsp;&nbsp;&nbsp;" + str; 
    }

  return(str);
}


// Autocomplete for dates and input fields other than id_tbx_itm
function autoPop(inpList) {

    // Dates
    try {
        // $("#id_tbx_dat").datepicker({dateFormat: 'yy-mm-dd'});  // Date
        $("#id_tbx_dos").datepicker({dateFormat: 'yy-mm-dd'});  // Date of Start
        $("#id_tbx_doe").datepicker({dateFormat: 'yy-mm-dd'});  // Date of Start
        $("#id_tbx_doj").datepicker({dateFormat: 'yy-mm-dd'});  // Date of Joining
        // $("#id_tbx_dom").datepicker({dateFormat: 'yy-mm-dd'});  // Date of Maturity
        // $("#id_tbx_dop").datepicker({dateFormat: 'yy-mm-dd'});  // Date of Purchase
        // $("#id_tbx_due").datepicker({dateFormat: 'yy-mm-dd'});  // Due Date
    } catch (err) { }

    var sql;
    if (currpage != "rul") {
        var cn = "";
        for (var i = 0; i < inpList.length; i++) {
            cn = cn + inpList[i] + ",";
        }
        var cn = cn + 'pmk ';
        sql = "SELECT DISTINCT " + cn +  "FROM " + root + "." + currpage;
    }
    else {
        sql = "SELECT DISTINCT cnd FROM fas.aut";
    }
    var typ = "String,String,String";
    var obj = ajaxSelect(sql,typ,tok_cli);
    var nrow = obj.nrow;
    var arow = obj.rows;

    for (var i = 0; i < inpList.length; i++) {
        var aut = [];
        for (var j=0; j<nrow; j++) {
            if ( !aut.includes(arow[j][0]) ) {
                aut.push(arow[j][0]);
            }
        }
        aut.sort();

        var inp = "id_tbx_" + inpList[i];
        if (document.getElementById(inp) != null) {
            $('#'+inp).autocomplete(
                {
                    source: aut,
                    minLength: 0,
                    max: 6,
                    highlightItem: true,
                    multiple: true,
                    multipleSeparator: " ",
                }).focus(function () {
                $(this).autocomplete('search', $(this).val());
            });

        }
    }
}


function showWait() {
    var img = document.getElementById('id_img_wai');
    if (document.getElementById('id_img_wai') != null)
        img.style.visibility = 'visible';
}

function hideWait() {
    var img = document.getElementById('id_img_wai');
    if (document.getElementById('id_img_wai') != null)
        img.style.visibility = 'hidden';
}




/** Function calls, no confirmation messages **/
$(function () {
    $(" #id_but_cls").click(function () {
        cls();
    })
});
$(function () {
    $("#id_but_nxt").click(function () {
        nxt();
    })
});
$(function () {
    $("#id_but_pre").click(function () {
        prv();
    })
});



/** Function calls, requires confirmation messages **/

// ins
$(function () {
    $("#id_but_ins").click(function () {
        $("#id_div_ins").dialog("open");
    })
});

$(function () {
    $("#id_div_ins").dialog(ok_cancel_ins);
});

var ok_cancel_ins = {
    autoOpen: false, resizable: false, width: 300, height: 200, modal: true,
    buttons: {
        "OK": {
            text: "OK", id: "id_ok_ins",
            click: function () {
                $(this).dialog("close");
                insRec();
            }
        },
        "Cancel": {
            text: "Cancel", id: "id_cancel_ins",
            click: function () {
                $(this).dialog("close");
                unHilRow();
                clsTop();
            }
        }
    }
};


// upd
$(function () {
    $("#id_but_upd").click(function () {
        $("#id_div_upd").dialog("open");
    });
});

$(function () {
    $("#id_div_upd").dialog(ok_cancel_upd);
});

var ok_cancel_upd = {
    autoOpen: false, resizable: false, width: 300, height: 200, modal: true,
    buttons: {
        "OK": {
            text: "OK", id: "id_ok_upd",
            click: function () {
                $(this).dialog("close");
                updRec();
            }
        },
        "Cancel": {
            text: "Cancel", id: "id_cancel_upd",
            click: function () {
                $(this).dialog("close");
                unHilRow();
                clsTop();
            }
        }
    }
};


//del
$(function () {
    $("#id_but_del").click(function () {
        $("#id_div_del").dialog("open");
    })
});

$(function () {
    $("#id_div_del").dialog(ok_cancel_del);
});

var ok_cancel_del = {
    autoOpen: false, resizable: false, width: 300, height: 200, modal: true,
    buttons: {
        "OK": {
            text: "OK", id: "id_ok_del",
            click: function () {
                $(this).dialog("close");
                delRec();
            }
        },
        "Cancel": {
            text: "Cancel", id: "id_cancel_del",
            click: function () {
                $(this).dialog("close");
                unHilRow();
                clsTop();
            }
        }
    }
};





/** Function Calls - Messages **/

$(function () {
    $("#id_div_msg").dialog({
        autoOpen: false, resizable: false, width: 300, height: 200, modal: true,
        buttons: {
            "OK": {
                text: "OK", id: "id_ok_msg",
                click: function () {
                    $(this).dialog("close");
                }
            }
        }
    });
});

function message(msg) {
    setDiv('msg', msg);
    $("#id_div_msg").dialog("open");
}





/** jQuery Tooltip **/
$(function () {
    $(document).tooltip({
        position: {
            my: "center bottom-20",
            at: "center top",
            using: function (position, feedback) {
                $(this).css(position);
                $("<div>")
                    .addClass("arrow")
                    .addClass(feedback.vertical)
                    .addClass(feedback.horizontal)
                    .appendTo(this);
            }
        }
    });
});



document.onkeydown = function (e) {			// Do not use "onkeypress"
    e = e || window.event;
    var cmd_held = event.metaKey;

    // CHROME    
    if ( navigator.userAgent.indexOf("Chrome") != -1) { // will also work for Safari
        var key = event.keyCode || event.charCode || 0;
        key = String.fromCharCode((96 <= key && key <= 105) ? key-48 : key).toLowerCase();
        // alert(key);

        if (sessionStorage.getItem('uid') == 'jganguly') {
            if(cmd_held && event.key.toLowerCase() == "j") {
                insRec();
            }
            if(cmd_held && event.key.toLowerCase() == "u") {
                updRec();
            }
            if(cmd_held && event.key.toLowerCase() == "k") {
                delRec();
            }
        }

        if(cmd_held && key == "9") {
           nxt();
        }
        if(cmd_held && key == "8") {
           prv();       
        }
        
        if(cmd_held && key == "e") {
           toggle_expand();       
        }

        if(cmd_held && key == "b") {
            if (currpage == "rul" ) {
                view_rule();
            }
        }

    }


    try {
        var selectedID = document.activeElement.id;
//         alert(selectedID);
    }
    catch (err) { }


    if (prrowno != -1) {

        if (selectedID != "") 
            return; 

        if ((e.keyCode == 40) && (hlrowno != -1)) {	// Down arrow
            x = prrowno;
            if (( x == (nr - 1) ) || (x == (nrow - 1)))
                return;
            clsTop();
            unHilRow();			// unhighlight and continue
            setInpVal(x + 1);
            hilRow(x + 1);		// increase by 2 to account for table header + Search
            document.getElementById('id_cbx_' + (x + 1)).checked = true;
            prrowno = x + 1;
        }

        if ((e.keyCode == 38) && (hlrowno != -1)) {
            x = prrowno;
            if ((x == 0) || (x == -1))
                return;
            clsTop();
            unHilRow();			// unhighlight and continue
            setInpVal(x - 1);
            hilRow(x - 1);		// increase by 2 to account for table header + Search
            document.getElementById('id_cbx_' + (x - 1)).checked = true;
            prrowno = x - 1;
        }
    }

};




