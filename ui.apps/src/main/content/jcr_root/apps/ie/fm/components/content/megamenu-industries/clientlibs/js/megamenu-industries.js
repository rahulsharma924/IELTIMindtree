function onOverlay() {
    $('.megaNavigation').removeClass('opened');
    $('#collapseIndustry').toggleClass('show');
    $('.industries-navigation-btn').toggleClass('collapsed');
    $('#megamenu-desktop .products-btn').removeClass('collapsed');
    $('.industries-navigation-btn a').toggleClass("showBorderBottom");
    if (!$('#megamenu-desktop').hasClass('animateUp')) {
        $('#overlayIndustries').toggleClass("active")
        $('#overlay-products').removeClass('active');
    }
    stickyOverlay();
}
function industryBtnFunct() {
    //$('.industries-navigation-btn a').hasClass("showBorderBottom") ? $('.industries-navigation-btn a').removeClass("showBorderBottom") : $('.industries-navigation-btn a').addClass("showBorderBottom");
    stickyOverlay();
    $('#main-header .cmp-navigation.ie-navigation .cmp-navigation__group .cmp-navigation__item.cmp-navigation__item--active').removeClass('cmp-navigation__item--active');
}
function stickyOverlay() {
    setTimeout(function () {
        $('.products-btn').removeClass('active');
        $('.categoryName').removeClass('show');
        $('.products-table-wrapper').removeClass('show');
        if ($('#megamenu-desktop').hasClass('animateUp')) {
            $('#overlayIndustries').removeClass('active');
            if ($('.industry-dropdowns.collapse').hasClass('show')) {
                $('#overlayIndustries').addClass('active');
                $(".container.responsivegrid.Homepage.Content.Container").addClass("fade-mode");
                $(".container.responsivegrid.Article").addClass("fade-mode");
                $("#collapseIndustry").on("mouseleave", function () {
                    $('#overlayIndustries').removeClass('active');
                    $('#collapseIndustry').removeClass('show');
                    $('.industries-navigation-btn').removeClass('collapsed');
                    $('.industries-navigation-btn a').removeClass('showBorderBottom');
                    $(".container.responsivegrid.Homepage.Content.Container").removeClass("fade-mode");
                    $(".container.responsivegrid.Article").removeClass("fade-mode");
                });
            } else {
                $('#overlayIndustries').removeClass('active');
                $(".container.responsivegrid.Homepage.Content.Container").removeClass("fade-mode");
                $(".container.responsivegrid.Article").removeClass("fade-mode");
            }
        } 
    }, 15);
}

$('#industries').click(function () {
    $('.submenu-mob').toggleClass('d-none');
    $('.productList-display').removeClass('d-block');
    $('.productList-display').toggleClass('d-none');
    $('#industries').addClass('d-block');
    $('.navigation-productsmenu-mob').toggleClass('d-none');
    $('.menu').toggleClass('industries-font-bold');
    $('.back-to-menu-industries').toggleClass('d-none');
});
$('.back-to-menu-industries').click(function () {
    $('#industries').addClass('d-block');
    $('.submenu-mob').addClass('d-none');
    $('.navigation-productsmenu-mob').removeClass('d-none');
    $('.productList-display').removeClass('d-none');
    $('.back-to-menu-industries').addClass('d-none');
    $('.menu').removeClass('industries-font-bold');
});
$('#overlayIndustries').on('mouseover', function () {
    $('#overlayIndustries').removeClass('active');
    $('#collapseIndustry').removeClass('show');
    $('.industries-navigation-btn').removeClass('collapsed');
    $('.industries-navigation-btn a').removeClass('showBorderBottom');
    $(".container.responsivegrid.Homepage.Content.Container").removeClass("fade-mode");
    $(".container.responsivegrid.Article").removeClass("fade-mode");
});
