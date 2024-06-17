$(document).ready(function () {
  if ($.fn.slick && $.fn.slick !== undefined) {
    $(".related_article_slide").slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      dots: true,
      arrows: true,
      infinite: false,
      responsive: [
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 2
          }
        },
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 1
          }
        }
      ]
    });
  }

  //same height headings for slider title
  if (window.innerWidth > 833) {
    var largest = 0;
    $(".related_article_desc").each(function () {
      var findHeight = $(this).find("h3.blog-article_section_title").height();
      if (findHeight > largest) {
        largest = findHeight;
      }
    });
    $(".related_article_desc")
      .find("h3.blog-article_section_title")
      .css({ height: largest + "px" });
  }
});
