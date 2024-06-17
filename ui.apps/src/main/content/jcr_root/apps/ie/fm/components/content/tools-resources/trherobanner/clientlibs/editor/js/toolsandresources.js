const mq = window.matchMedia("(max-width: 991px)");
if (mq.matches) {
  $(window).scroll(function () {
    if ($(this).scrollTop() > 50) {
      $("#tr-title-resources").css("display", "none");
      $(".MyAccountModalMenuIcon").css("display", "block");
    } else {
      $("#tr-title-resources").css("display", "block");
      $(".MyAccountModalMenuIcon ").css("display", "none");
    }
  });
}
$(window).scroll(function() {
  var $height = $(window).scrollTop(); 
 if($height > 50) {
   $('.tools-res_container').addClass('tr_fixedElement');
 } else {
   $('.tools-res_container').removeClass('tr_fixedElement');
 }
});