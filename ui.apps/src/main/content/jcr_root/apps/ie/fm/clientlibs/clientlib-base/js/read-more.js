(function ($) {
  var utilityReadMoreMsg = window.utilityMessage ? window.utilityMessage : {};
  if ($) {    
    readMoreContent();
  }

// Configure/customize these variables.
function readMoreContent() {
  var width = $(window).width();
  if (width <= 832) {
    var showChar = 90;
  } else {
    var showChar = 200;
  }

  var ellipsestext = "...";
  var moretext = utilityReadMoreMsg?.labels?.readMore || "Read More";
  var lesstext = utilityReadMoreMsg?.labels?.readLess || "Read Less";

  $(".more").each(function () {
    var content = $(this).html();
    let regexContent = /[a-zA-Z0-9]/
    if(!regexContent.test(content)) return false;
    const matches = [];
    content.replace(/<p>(.*?)<\/p>/g, function () {    
    matches.push(arguments[1]);
    });
    let getContentCount = 0;
    const childContent = Object.keys(matches)
    for (let i=0; i<childContent.length; i++){
      getContentCount += matches[childContent[i]].length
    }
    if(getContentCount < showChar) return false
    const firstParagraph = (matches.length) ?  matches[0] : ""
    
    if(firstParagraph.length < showChar ) {
        var c = content.substr(0, showChar);
        var h = content.substr(showChar, content.length - showChar);
        var html =
        c +
        '<span class="moreellipses">' +
        ellipsestext +
        '<a href="javascript:void(0)" class="morelink a-show-more">' +
        moretext +
        '</a></span><span class="morecontent"><span>' +
        h +
        '</span></span>';
        $(this).html(html);
    }else{
      let splitFirstPara = firstParagraph.substr(0, showChar)
      + '<span class="moreellipses">' +
      ellipsestext +
      '<a href="javascript:void(0)" class="morelink a-show-more">' +
      moretext +
      '</a></span><span class="morecontent"><span>' +
      firstParagraph.substring(200, firstParagraph.length-1);
      matches[0] = splitFirstPara;
      $(this).html('');
      for(var i=0; i<matches.length; i++){   
        $(this).append('<p>'+matches[i]+'</p>');  
      }  
    }    
    $(this).find('p:gt(0)').addClass('more-content');
    let lessPara = '<span class="less-para">&nbsp;<a href="javascript:void(0)" class="morelink a-show-less">' +
      lesstext +
      '</a></span>'
    if ($(this).find('.less-para').length <= 0) {
      $(this).find('p.more-content').length > 0 ? $(this).find('p.more-content:last-child').append(lessPara) : $(this).find('p').append(lessPara);
    }
  });
  
  $('p.more-content').each(function(){
     if($(this).find('a').hasClass('a-show-more')) $(this).addClass('rareContent');    
  });
  var checkReamMoreDiv = $('p.more-content').hasClass('rareContent');
  $('.a-show-less, .morecontent span, .more-content').hide();
  if(checkReamMoreDiv) $('.more-content.rareContent').show();
  
  $('.a-show-more').click(function () {
    $('.a-show-less').show();
    $(".moreellipses").hide();
    $(".morecontent span").css({ "display": "initial" });
    $(".more-content").css({ "display": "block" });
    $(".a-show-less").css({ "display": "initial" });
  });
  $('.a-show-less').click(function () {
    $(this).hide();
    $(".moreellipses").show();
    $(".morecontent span").css({ "display": "none" });
    $(".more-content").css({ "display": "none" });
    if(checkReamMoreDiv) $('.more-content.rareContent').show();
    $("html, body").animate(
      { scrollTop: $(".productListpage").offset().top - 120 },
      100
    );
  })
}
})(jQuery);