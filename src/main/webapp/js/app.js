$(document).ready(function() {
    $('input.user').keyup(function() {
        if (dataChanged()) {
            console.log("something changed!");
        } else {
            console.log("everything is the same");
        }
    });
});

$(window).load(function() {
    $('#g-signout').hide();
    renderGoogleButton();
});

function loadData(user) {
    console.log("starting the app");
    $('input.user').each(function() {
        var $this = $(this);
        var key = $this.data("field");
        var value = user[key];
        console.log(key + " " + value);
        if (value != undefined) {
            $this.data("initial", value);
            $this.val(value);
        }
    });
    console.log("app is up!");
}

function dataChanged() {
    var changed = false;
    $('input.user').each(function() {
        if ($(this).val() != $(this).data("initial")) {
            changed = true;
            return false;
        }
    });
    return changed;
}

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
    
    $('body').removeClass("logged-out").addClass("loading");

    $.ajax("/ajax", {
        method: "POST",
        data: id_token,
        dataType: "json",
        success: function(user, status, jqXHR) {
            console.log(user);
            console.log(status);
            console.log(jqXHR.status);
            loadData(user);
            // Show modal if we have a new user
            if (jqXHR.status == 201) {
                $('#modal-welcome-name').text(user.first_name);
                $('#modal-welcome').openModal({
                    dismissible: false
                });
            }
            $('body').removeClass("loading").addClass("logged-in");
            $('#g-signout').show();
            $('#login').fadeOut();
        }
    });
}

function onFailure(error) {
    console.log(error);
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        $('body').removeClass("logged-in").addClass("logged-out");
        $('#g-signout').hide();
        $('#login').fadeIn();
    });
}