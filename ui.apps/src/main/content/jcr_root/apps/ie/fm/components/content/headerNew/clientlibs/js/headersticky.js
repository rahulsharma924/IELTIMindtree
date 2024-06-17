$(function () {
  const mediaQuery = window.matchMedia("(min-width: 833px)");
  if (mediaQuery.matches) {
    $(".compMicrolinks.Search").click(function (e) {
      e.preventDefault();
      $("#megamenu-container").removeClass("animateUp");
      $("#megamenu-container").addClass("animateDown");
      $(".compSearchbox").addClass("animateRight");
      $("#main-header").removeClass("sticky");
    });
  } else {
    $(".compMicrolinks.Search").click(function (e) {
      e.preventDefault();
      $(".global-search").addClass("mobSticky-search");
      $("body").addClass("disable-scroll");
    });
    $(".close-search-box").click(function () {
      $(".global-search").removeClass("mobSticky-search");
      $("body").removeClass("disable-scroll");
    });
  }
});
