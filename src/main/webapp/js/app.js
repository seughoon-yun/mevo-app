var id_token;
var currentUser;
var surveyLink = 'https://mevo.typeform.com/to/HeuuJH?'

$(document).ready(function() {
    $('input.user').keyup(function() {
        setAccountChanged(dataChanged());
    });
});

$(window).load(function() {
    renderGoogleButton();
    //$('#login').fadeOut();
});

function initialiseApp(user, isNewUser) {
    console.log(user);
    currentUser = user;
    loadData(user);
    // Show modal if we have a new user
    if (isNewUser) {
        var createdDate = new Date();
        window.Intercom("boot", {
            app_id: 'ou4uas01',
            name: user.name,
            email: user.email,
            created_at: createdDate
        });
        //$('#modal-welcome').openModal({
        //    dismissible: false
        //});
    } else {
        window.Intercom("boot", {
            app_id: 'ou4uas01',
            email: user.email
        });
    }

    // Make a first name
    var firstname = "there";
    if (user.name) {
        var namepieces = user.name.split(" ");
        if (namepieces[0]) {
            firstname = namepieces[0];
        } else {
            firstname = user.name;
        }
    }

    // Make the survey link
    surveyLink = surveyLink + "firstname=" + firstname + "&email=" + user.email;

    $('.survey-button').attr("href", surveyLink);

    // Check that we're not being blocked by aggressive adblockers
    console.log("Intercom: " + intercomLoaded);
    console.log("Google Maps: " + googleMapsLoaded);
    if(!googleMapsLoaded || !intercomLoaded) {
        $('#modal-blocked').openModal({
            dismissible: false
        });
    } else {
        parseParameters();
        
        $('#login').css('opacity', 0);
        setTimeout(setAppState("logged-in"), 1000);
    }
}

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

    $('input.address').each(function() {
        if ($(this).val() != "") {
            $('input.address').prop("disabled", false);
            return false;
        }
    });
}

function saveData() {
    if (window.currentUser && window.id_token) {

        $('input.user').each(function() {
            var $this = $(this);
            var key = $this.data("field");
            var value = $this.val();
            currentUser[key] = value;
        });

        var payload = {
            token: id_token,
            profile: currentUser
        };

        var payloadString = JSON.stringify(payload);

        setAccountLoading(true);

        $.ajax("/ajax", {
            method: "PUT",
            data: payloadString,
            dataType: "text",
            success: function(user, status, jqXHR) {
                console.log(user);
                setAccountLoading(false);
                $('input.user').each(function() {
                    var $this = $(this);
                    $this.data("initial", $this.val());
                });
                Materialize.toast('Changes saved', 4000);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    }
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
        'onsuccess': onAuthSuccess,
        'onfailure': onAuthFailure
    });
}

function onAuthSuccess(googleUser) {
    var profile = googleUser.getBasicProfile();
    id_token = googleUser.getAuthResponse().id_token;

    setAppState("loading");

    $.ajax("/ajax", {
        method: "POST",
        data: id_token,
        dataType: "json",
        success: function(user, status, jqXHR) {
            var isNewUser = (jqXHR.status == 201);
            initialiseApp(user, isNewUser);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

function onAuthFailure(error) {
    console.log(error);
}

function setAppState(state) {
    $('body').removeClass().addClass(state);
}

function setAccountChanged(changed) {
    if (changed) {
        $('#account').removeClass("no-change").addClass("changed");
    } else {
        $('#account').removeClass("changed").addClass("no-change");
    }
}

function setAccountLoading(loading) {
    if (loading) {
        $('#account').addClass("loading");
    } else {
        $('#account').removeClass("loading");
        setAccountChanged(false);
    }
}

function parseParameters() {
    var pageURL = window.location.href;
    var surveyCompleted = url('?waitlist_survey_completed', pageURL);
    
    if (surveyCompleted === "true") {
        console.log("Survey Completed");
        Intercom('trackEvent', 'survey_completed');
    }
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        window.Intercom("shutdown");
        window.location = "http://mevo.co.nz";
    });
}