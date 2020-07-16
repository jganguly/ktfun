// DEBUG = true;
var tok_cli = sessionStorage.getItem('tok');
var token = ajaxToken();

$(function() {

	currpage  = "log";
	currtitle = "Log";
    nr    = 16;
    hlCol =  5;

    //            0   1   2   3   4   5
	colType   = ['S','S','S','S','S','I'];
	colName	  = "bid,rid,ant,con,res,pmk";	// pmk MUST be last

	initPage();	// createInp, hlCol, setAC, setDiv, sql
	orderby = " ORDER BY bid, lup asc ";
    ajaxPopTab();

});

function setWhereCond() {
    where = " WHERE true";
	setCond();
}

function highlight(j,cell) {
    if (j == hlCol) {

        if (cell[j].innerHTML.toLowerCase() == "true")  {
            cell[j].style.color      = 'blue';
            cell[j].style.fontWeight = 'bold';
            cell[j].style.fontStyle  = 'normal';  
        }        
        else if (cell[j].innerHTML.toLowerCase() == "false")  {
            cell[j].style.color      = 'red';
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

