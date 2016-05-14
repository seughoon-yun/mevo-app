$(document).ready(function() {
    $(".button-collapse").sideNav();
    $('.side-nav a').click(function() {
        $('.side-nav a').removeClass("active");
        $(this).addClass("active");
        var targetPane = $(this).attr('href');
        $('.app-pane').removeClass("active");
        $(targetPane).addClass("active");
        if ($(window).width() < 993) {
            console.log("closing nav");
            $('.button-collapse').sideNav('hide');
        }
    });
});