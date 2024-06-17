//anaytic code to track cta on tools & resources 
document.querySelector("body").addEventListener(
    "click",
    function (e) {
      var hyperlinkElement = e.target.closest("a");
      var label = "";
      var category = "";
      if (
        hyperlinkElement !== null &&
        hyperlinkElement.closest(".analyticRFconverterstoolsandresources") != null
      ) {
        label = hyperlinkElement.textContent.trim(); 
        category = "RF converters & caluculators - " + pageName + " page";
      } 
      ctalinkDataLayerCall(label, category);
    },
    false
  );