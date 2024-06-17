//analytic code to track faq  on tools&resources
document.querySelector("body").addEventListener(
    "click",
    function (e) {
      var buttonElement = e.target.closest("button");
      if (
        buttonElement !== null &&
        buttonElement.closest(".analyticfaqtoolsandresoures") != null && buttonElement.ariaExpanded=="false"
      ) {
        FAQDataLayerCall(buttonElement.id.split("-")[2], buttonElement.childNodes[1].textContent.trim())
      } 
    },false
  );