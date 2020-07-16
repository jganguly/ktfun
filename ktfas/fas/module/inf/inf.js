// DEBUG = true;
var token = ajaxToken();

$(function() {
	currpage  = "inf";
	currtitle = "Infer";

    setDiv('uid','User-ID: ' + '<span style="color:cyan">' + sessionStorage.getItem('uid') + '</span>');
    setDiv('rol','Role: '    + '<span style="color:cyan">' + sessionStorage.getItem('rol') + '</span>');
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
            message("Inference completed<BR>Please see OUTPUT tab");
        })
        .done(function () {
        });

//    window.location.href = "http://localhost:8080/static/module/out/out.html";
//            console.log(obj)
    return;
}
