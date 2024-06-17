$(document).ready(function() {
    $('.browseLink-text-child').bind('click', function() {
      window.location = $(this).find('a').attr('href');
    });
});

document.querySelector("body").addEventListener(
  "click",
  function (e) {
    var hyperlinkElement = e.target.closest("a");
    var label = "";
    var category = "";
    var iElement = e.target.closest("i");
    if (
      hyperlinkElement !== null &&
      hyperlinkElement.closest(".analyticsupportFAQ") != null
    ) {
      label = hyperlinkElement.textContent.trim() + " - text"; 
      category = "Browse other FAQ topics - " + currentPageName + " page";
    } 
    else if(
      iElement !== null &&
      iElement.closest(".analyticsupportFAQ") != null
    ) {
      label = iElement.previousElementSibling.firstChild.nextSibling.textContent.trim() + " - arrow";
      category = "Browse other FAQ topics - " + currentPageName + " page";
    } 
    ctalinkDataLayerCall(label, category);
  },
  false
);