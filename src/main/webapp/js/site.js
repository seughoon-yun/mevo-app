$(document).ready(function() {
    $(".button-collapse").sideNav();
    $('.side-nav li a').click(function() {
        
        // If it's an app pane activator, select the right pane
        if ($(this).hasClass("app-pane-activator")) {
            $('.app-pane-activator').removeClass("active");
            $(this).addClass("active");
            var targetPane = $(this).attr('href');
            $('.app-pane').removeClass("active");
            $(targetPane).addClass("active");
        }
        
        // For all links, close the side nav if we are on mobile
        if ($(window).width() < 993) {
            $('.button-collapse').sideNav('hide');
        }
    });
});