// DEBUG = true;
var token = ajaxToken();

$(function() {
	currpage  = "out";
	currtitle = "Output";
    nr    = 16;
    hlCol = -1;

    //            0   1   2   3
	colType   = ['S','S','S','I'];
	colName	  = "bid,att,val,pmk";	// pmk MUST be last

    inpMust   = [ 'att', 'Key missing',
                  'val', 'Value missing'
				];
				  
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

});

function setWhereCond() {
    where = " WHERE true";
	setCond();
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

