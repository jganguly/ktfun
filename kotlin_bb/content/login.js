// DEBUG = true;
$(function() {

});

function login() {
    var obj;
    var uid = get('uid');
    var pwd = get('pwd');

    alert(uid);
    alert(pwd);

    $.ajaxSetup({async: false, type: 'POST', dataType: 'JSON'});
    $.post('/login/post', {'uid':uid, 'pwd':pwd},
        function (data) {

            var rol  = data['rol'];
            var tok  = data['tok'];    // token

            sessionStorage.setItem('uid',uid)
            sessionStorage.setItem('rol',rol)
            sessionStorage.setItem('tok',tok)

            var url  = data['url'];    // url
            window.location.href = url;
//            alert(url);
        })
        .done(function () {
        });

    return obj;
}
