$(document).ready(function() {

  $('.secondaryNavigation .secondaryNavigation_links:first-child .secondaryNavigation_link').addClass('secNav_active');
  $('.secondaryNavigation_links .secondaryNavigation_link').click(function(){
    $('.secondaryNavigation_links .secondaryNavigation_link').removeClass('secNav_active');
    $(this).addClass('secNav_active');
    var activeTab = $(this).find('a').attr('href');
    $(activeTab).fadeIn();
    return false;
  });

  $(".close_popup").on("click",function(){
    $("#secondaryNav_model").modal("hide")
  });


  var headerHeight = $("#main-header").height();
  var bannerHeight =   $('#tool_resources_banner, #industrial_autiomation_banner').height();
  var breadcrumbHeight = $('.breadcrumb').height();

    //Desktop View on scroll hide banner & secondary navigation
  const dq = window.matchMedia("(min-width: 992px)");
  if (dq.matches) {
    $("<div id='filler'></div>").insertAfter("#tool_resources_banner, #industrial_autiomation_banner");

    $(window).scroll(function() {
      var $height = $(window).scrollTop();
          if($height > 100) {
            $('#tool_resources_banner, #industrial_autiomation_banner').addClass('fixedElement');
            $('#filler').css("paddingTop", bannerHeight);
          } else {
            $('#tool_resources_banner, #industrial_autiomation_banner').removeClass('fixedElement');
            $('#filler').css("paddingTop", 0); 
          }
    });

    var scrollHeight1 =  headerHeight + bannerHeight + breadcrumbHeight;
    var scrollHeight2 =  headerHeight + bannerHeight - 45;

    scrollToSection(scrollHeight1, scrollHeight2);
  }

  //MobileView on scroll hide banner & secondary navigation
  const mq = window.matchMedia("(max-width: 991px)");
  if (mq.matches) {
    $(window).scroll(function () {
      if ($(this).scrollTop() > 100) {
        $('#tool_resources_banner, #industrial_autiomation_banner').addClass('fixedElement');
        $(".bannerforcontact").css("display", "none");
        $(".secondaryNavigation").css("display", "none");
        $(".secondaryNav_hamburger").css("display", "block");
      } else {
        $('#tool_resources_banner, #industrial_autiomation_banner').removeClass('fixedElement');
        $(".bannerforcontact").css("display", "block");  
        $(".secondaryNavigation").css("display", "block");
        $(".secondaryNav_hamburger ").css("display", "none");
      }
    });

    var scrollHeight1 =  headerHeight + bannerHeight + breadcrumbHeight - 20;
    var scrollHeight2 =  headerHeight;

    scrollToSection(scrollHeight1, scrollHeight2);
  }
  scrollToSection2();
});


function scrollToSection(scrollHeight1, scrollHeight2) {
  $(".secondaryNavigation a, .model_secondaryNavigation a").each(function() {   
  var $this = $(this);
  $this.click(function(e){
    e.preventDefault();
    let scrollHeight = scrollHeight1;
     if ($('#tool_resources_banner').hasClass('fixedElement')){
        scrollHeight = scrollHeight2;
     }      
    var $id = $this.attr("href");
    $('html, body').animate({
      scrollTop: $($id).offset().top - scrollHeight     
    });
    $("#secondaryNav_model").modal("hide");     
  })  
 });  
}

function scrollToSection2() {
    var curLoc = window.location.href;
    let cid = curLoc.substring( curLoc.indexOf('html/') + 5);
    var aLink = '#"+cid+"';
    if (cid && cid.length > 1) {
      $( ".secondarynavigation .secondaryNavigation_links a[href=aLink]" ).trigger('click');
    } 
  }
