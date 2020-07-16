// DEBUG = true;
var token = ajaxToken();

$(function() {
	currpage  = "usr";
	currtitle = "User";
    nr    = 15;
    hlCol = -1;

    //            0   1   2
	colType   = ['S','S','I'];
	colName	  = "uid,rol,pmk";	// pmk MUST be last

    inpMust   = [ 'uid', 'User ID missing',
                  'rol', 'Role missing',
				];
				  
	initPage();	// createInp, hlCol, setAC, setDiv, sql
	orderby = " ORDER BY uid ";
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
    sql = "SELECT pmk FROM fas.usr WHERE "          +
          "uid=" + "'" + get('uid') + "'" ;
    lid = ajaxSelect(sql,"String").rows[0][0];
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

