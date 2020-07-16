// DEBUG = true;
var token = ajaxToken();

$(function() {
    document.body.style.background = "white";

    	var jsonObj = {};
    	var jsonViewer = new JSONViewer();
    	document.querySelector("#json").appendChild(jsonViewer.getContainer());

    	var textarea = document.querySelector("textarea");
    	var loadJsonBtn = document.querySelector("button.load-json");

//    	loadJsonBtn.addEventListener("click", function() {
    	    var obj = ajaxDict();
    	    var jsonStr = obj['dic'];
            document.getElementById("id_tar_dic").value = jsonStr;
            jsonObj = JSON.parse(jsonStr);
    		jsonViewer.showJSON(jsonObj);
    		console.log(jsonStr);
//    	});
});

function ajaxDict() {
    var obj;
    $.ajaxSetup({async: false, type: 'POST', dataType: 'JSON'});
    $.post('http://localhost:8080/dict', {'tok':tok_cli},
        function (data) {
            obj = data
        })
        .done(function () {
        });

    return obj;
}