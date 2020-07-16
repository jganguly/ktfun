// DEBUG = true;
var tok_cli = sessionStorage.getItem('tok');
var token = ajaxToken();

$(function() {

	currpage  = "val";
	currtitle = "Validate";
    nr    = 16;
    hlCol =  4;

    //            0   1   2   3   4   5
	colType   = ['S','S','S','S','I'];
	colName	  = "aoc,cnd,sta,typ,pmk";	// pmk MUST be last

	initPage();	// createInp, hlCol, setAC, setDiv, sql
	orderby = " ORDER BY aoc, cnd ";

    var obj;
    $.ajaxSetup({async: false, type: 'POST', dataType: 'JSON'});
    $.post('http://localhost:8080/validate', {'tok':tok_cli},
        function (data) {
            obj = data
//            message("Validation Completed");
        })
        .done(function () {
        });
    ajaxPopTab();

});

function setWhereCond() {
    where = " WHERE true";
	setCond();
}

function highlight(j,cell) {
    if (j == 3 || j == 4) {

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

