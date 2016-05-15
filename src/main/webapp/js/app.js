$(document).ready(function() {
    $('input.user').keyup(function() {
        if (dataChanged()) {
            
        } else {
            
        }
    });
});

$(window).load(function() {
    renderGoogleButton();
});

function loadData(user) {
    $('.g-profile').attr('src', user.picture_url)
    $('.g-firstname').text(user.first_name);
    $('.g-fullname').text(user.name);
    $('.g-email').text(user.email);
    
    $('input.user').each(function() {
        var $this = $(this);
        var key = $this.data("field");
        var value = user[key];
        if (value == "") {
            $this.data("initial", "");
        } else if (value == undefined) {
            $this.data("initial", "");
            user[key] = "";
        }else {
            $this.data("initial", value);
            $this.val(value);
        }
    });
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
    
    setState("loading");

    $.ajax("/ajax", {
        method: "POST",
        data: id_token,
        dataType: "json",
        success: function(user, status, jqXHR) {
            console.log(user);
            loadData(user);
            // Show modal if we have a new user
            if (jqXHR.status == 201) {
                $('#modal-welcome').openModal({
                    dismissible: false
                });
            }
            $('#login').css('opacity', 0);
            setTimeout(setState("logged-in"), 1000);
        }
    });
}

function onFailure(error) {
    console.log(error);
}

function setState(state) {
    $('body').removeClass().addClass(state);
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        window.location = "http://mevo.co.nz";
    });
}