$(window).load(function() {
    $('#g-signout').hide();
    renderGoogleButton();
});

function renderGoogleButton() {
    gapi.signin2.render('g-signin', {
        'scope': 'profile email',
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': onSuccess,
        'onfailure': onFailure
    });
}

function onSuccess(googleUser) {
    var profile = googleUser.getBasicProfile();
    var id_token = googleUser.getAuthResponse().id_token;

    $.ajax("/ajax", {
        method: "POST",
        data: id_token,
        dataType: "json",
        success: function(data, status, jqXHR) {
            console.log(data);
            console.log(status);
            $('#g-signout').show();
            $('#section-login').css('opacity', '0');
        }
    });

}

function onFailure(error) {
    console.log(error);
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        $('#g-signout').hide();
        $('#section-login').css('opacity', '1');
    });
}