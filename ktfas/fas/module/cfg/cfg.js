// DEBUG = true;
var token = ajaxToken();

$(function() {
	currpage  = "cfg";
	currtitle = "Config";
    nr    = 15;

    //            0   1   2   3
	colType   = ['S','S','S','I'];
	colName	  = "cid,att,val,pmk";	// pmk MUST be last

    inpMust   = [ 'cid', 'Config ID missing',
                  'att', 'Key missing',
                  'val', 'Value missing'
				];
				  
	autoPopList = ['att','val'];

	initPage();	// createInp, hlCol, setAC, setDiv, sql
	orderby = " ORDER BY cid ";
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
});

function setWhereCond() {
    where = " WHERE true";
	setCond();
}

function getLID() { // Customize for each page
    var sql, lid;
    sql = "SELECT pmk FROM fas.cfg WHERE "         +
          "cid=" + "'" + get('cid') + "'" + " AND " +
          "att=" + "'" + get('att') + "'" + " AND " +
          "val=" + "'" + get('val') + "'" ;
    lid = ajaxSelect(sql,"String,String,String").rows[0][0];
    return (lid);
}

