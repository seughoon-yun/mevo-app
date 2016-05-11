$(document).ready(function() {
    $('.side-nav a').click(function() {
        $('.side-nav a').removeClass("active");
        $(this).addClass("active");
        var targetPane = $(this).attr('href');
        $('.app-pane').removeClass("active");
        $(targetPane).addClass("active");
    });
});