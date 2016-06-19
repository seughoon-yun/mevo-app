var intercomLoaded = false;
var googleMapsLoaded = false;

$(document).ready(function() {
    
    $(".button-collapse").sideNav();

    $('#input_date_of_birth').pickadate({
        selectYears: true,
        selectYears: 100,
        max: true,
        format: 'dd-mm-yyyy',
        onClose: function() {
            $('#input_date_of_birth').keyup();
        }
    });

    $('#input_licence_expiry_date').pickadate({
        monthsFull: ['01 - Jan', '02 - Feb', '03 - Mar', '04 - Apr', '05 - May', '06 - Jun', '07 - Jul', '08 - Aug', '09 - Sep', '10 - Oct', '11 - Nov', '12 - Dec'],
        selectYears: true,
        selectYears: 15,
        min: true,
        format: 'dd-mm-yyyy',
        onClose: function() {
            $('#input_licence_expiry_date').keyup();
        }
    });


    $('.side-nav li a').click(function() {

        // If it's an app pane activator, select the right pane
        if ($(this).hasClass("app-pane-activator")) {
            $('.app-pane-activator').removeClass("active");
            $(this).addClass("active");
            var targetPane = $(this).attr('href');
            $('.app-pane').removeClass("active");
            $(targetPane).addClass("active");
            $('ul.tabs').tabs();
        }

        // For all links, close the side nav if we are on mobile
        if ($(window).width() < 993) {
            $('.button-collapse').sideNav('hide');
        }
    });

    window.onbeforeunload = function() {
        if ($('#account').hasClass("changed")) {
            return "There are unsaved changes!"
        }
    }
});

$(window).load(function() {
    console.log("Intercom: " + intercomLoaded);
    console.log("Google Maps: " + googleMapsLoaded);
});