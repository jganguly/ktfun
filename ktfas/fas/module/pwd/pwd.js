// DEBUG = true;
var token = ajaxToken();

$(function() {
	currpage  = "pwd";
	currtitle = "Password";
	set('uid',sessionStorage.getItem('uid'));
});

function updpwd() {

    if (get('pw1') == "") {
        message("Please enter current password");
        return;
    }

    if (get('pw2') == "") {
        message("Please enter new password");
        return;
    }

    if (get('pw2').length < 8) {
        message("Password length needs to be at least 8 characters");
        return;
    }


    if (get('pw1') != get('pw2')) {
        message('Passwords do not match');
        return
    }

    var s = "UPDATE fas.usr SET pwd=" + "'" + get('pw2') + "'" + " WHERE uid=" + "'" + get('uid') + "'";
//    alert(s);
    ajaxCrud(s);
    message("Password Updated");
    return;

}





