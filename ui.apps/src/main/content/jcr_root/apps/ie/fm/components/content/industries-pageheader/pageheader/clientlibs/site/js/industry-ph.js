
function indusbtn(){
    $(".industry-ph-sectext").toggleClass("industry-ph-showmore").toggleClass("industry-ph-showless");
	var text=$("#industry-ph-btntoggle").text();
    if(text == "Show Less"){
		$("#industry-ph-btntoggle").text("Show More");
    }
    else
    {
		$("#industry-ph-btntoggle").text("Show Less");
    }
}
function indusredline1(){
	$("#ph-suborder-id1>a").addClass('industry-redline');
    $("#ph-order").removeClass('ph-order-padding');
    $("#ph-suborder-id2>a").removeClass('industry-redline');
    $("#ph-suborder-id3>a").removeClass('industry-redline');
}

function indusredline2(){
    $("#ph-suborder-id2>a").addClass('industry-redline');
    $("#ph-order").removeClass('ph-order-padding');
    $("#ph-suborder-id1>a").removeClass('industry-redline');
    $("#ph-suborder-id3>a").removeClass('industry-redline');

}

function indusredline3(){
	$("#ph-suborder-id3>a").addClass('industry-redline');
    $("#ph-order").removeClass('ph-order-padding');
    $("#ph-suborder-id1>a").removeClass('industry-redline');
    $("#ph-suborder-id2>a").removeClass('industry-redline');
}

const mq = window.matchMedia("(max-width: 991px)");
if (mq.matches) {
  $(window).scroll(function () {
    if ($(this).scrollTop() > 1) {
      $(".industry-main-header").css("display", "none");
      $(".ph-alignCenter").css("display", "none");
      $(".MyAccountModalMenuIcon").css("display", "block");
    } else {
      $(".industry-main-header").css("display", "block");
      $(".ph-alignCenter").css("display", "block");
      $(".MyAccountModalMenuIcon ").css("display", "none");
    }
  });
}

