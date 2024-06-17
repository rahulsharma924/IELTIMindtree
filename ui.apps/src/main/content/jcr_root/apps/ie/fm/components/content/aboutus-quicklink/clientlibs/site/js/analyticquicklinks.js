//analytic code to capture cta on about us quick links
document.querySelector("body").addEventListener(
    "click",
    function (e) {
        var hyperlinkElement = e.target.closest("a");
        var label = "";
        var category = "";
        var spanElement = e.target.closest("span");
        if (
            spanElement !== null &&
            spanElement.closest(".analyticaboutus-quicklinks") != null
        ) {
            label = spanElement.parentElement.textContent.trim() + " - arrow"; 
        } 
        else if(
            hyperlinkElement !== null &&
            hyperlinkElement.closest(".analyticaboutus-quicklinks") != null
        ) {
            label = hyperlinkElement.textContent.trim() + " - text";   
        } 
        category = "Quick links - who-we-are page";
        ctalinkDataLayerCall(label, category);
    },
  false
);

