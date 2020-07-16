// DEBUG = true;
var token = ajaxToken();

$(function() {
	currpage  = "bdg";
	currtitle = "Binding";
    nr    = 15;
    hlCol = -1;

    //            0   1   2   3
	colType   = ['S','S','S','I'];
	colName	  = "bid,sym,url,pmk";	// pmk MUST be last

    inpMust   = [ 'bid', 'Binding ID missing',
                  'sym', 'Symbol missing',
                  'url', 'URL End Point missing'
				];
				  
//	autoPopList = ['att','val'];

	initPage();	// createInp, hlCol, setAC, setDiv, sql
	orderby = " ORDER BY bid ";
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

//    get_list_att()

});

function setWhereCond() {
    where = " WHERE true";
	setCond();
}

function getLID() { // Customize for each page
    var sql, lid;
    sql = "SELECT pmk FROM fas.bdg WHERE "         +
          "bid=" + "'" + get('bid') + "'" + " AND " +
          "sym=" + "'" + get('sym') + "'" + " AND " +
          "url=" + "'" + get('url') + "'" ;
    lid = ajaxSelect(sql,"String,String,String").rows[0][0];
    return (lid);
}
