const mediaQuery = window.matchMedia('(max-width: 833px)');

if (mediaQuery.matches) {
$(document).ready(function(){
$(".footerLinks h4.dropArrow").click(function() {
    $("h4.dropArrow").removeClass("active");
    $(".footerLinks ul").slideUp();
    if (!$(this).next().is(":visible")) {
        $(this).next().slideDown();
        $(this).addClass("active");
    }
})
});
}