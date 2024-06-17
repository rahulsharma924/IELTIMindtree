/* var myText = document.getElementsByClassName("blog-description");
var limit = 187;
myText.addEventListener("input",function(){

    var textLength = myText.value.length;

    if(textLength > limit){
        myText.concat("...")
    }
}); */


$(document).ready(function(){
$(".blog-heading-publish-wrapper").each( function(){
 var headHeight = $(this).height();
 var descriptionHeight =  $(this).siblings(".blog-description-wrapper").height();
if(headHeight > 48){
 $(this).siblings(".blog-description-wrapper").css("height",descriptionHeight - 31);
 $(this).siblings(".blog-description-wrapper").children(".blog-description").children("p").css("-webkit-line-clamp", "6");
}
else{
  $(this).siblings(".blog-description-wrapper").css("height",descriptionHeight);
}
  })
 $(".blog-post-card-label").each( function(){
  var lablesHeight = $(this).height();
  var descHeight =  $(this).siblings(".blog-heading-description-wrapper").children(".blog-description-wrapper").height();
  $(this).siblings(".blog-heading-description-wrapper").children(".blog-description-wrapper").css("height",descHeight-lablesHeight);
  if(lablesHeight > 0 && lablesHeight < 22){
  $(this).siblings(".blog-heading-description-wrapper").children(".blog-description-wrapper").children(".blog-description").children("p").css("-webkit-line-clamp", "5");
  }
  else if(lablesHeight > 20 && lablesHeight < 51){
    $(this).siblings(".blog-heading-description-wrapper").children(".blog-description-wrapper").children(".blog-description").children("p").css("-webkit-line-clamp", "4");
  }
  else if(lablesHeight > 51){
    $(this).siblings(".blog-heading-description-wrapper").children(".blog-description-wrapper").children(".blog-description").children("p").css("-webkit-line-clamp", "3");
  }
 })
});

 

$(".blog-post-card-wrapper").slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    dots: false,
    infinite: false,
    responsive: [
      {
        breakpoint: 1201,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: false,
          dots: false,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: false,
          dots: true,
          arrows: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: false,
          dots: true,
          arrows: true,
        },
      },
      {
        breakpoint: 972,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: false,
          dots: true,
          arrows: true,
        },
      },
      {
        breakpoint: 833,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: false,
          dots: true,
          arrows: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
          arrows: true,
        },
      },
      {
        breakpoint: 545,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
          arrows: true,
        },
      },
      {
        breakpoint: 362,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
          arrows: true,
        },
      },
      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
    ],
  });
 /* $(document).ready(function () {
    var maxcharLength = 200;
    $(".blogPostBrocherDesc").each(function () {
      var myStrleng = $(this).text();
      if ($.trim(myStrleng).length > maxcharLength) {
        var newStrleng = myStrleng.substring(0, maxcharLength);
        var removedStr = myStrleng.substring(
          maxcharLength,
          $.trim(myStrleng).length
        );
        $(this).empty().html(newStrleng);
        $(this).append("...");
      }
    });
  });*/