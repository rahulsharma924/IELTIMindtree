//analytics code for footer social media link tracking

$(document).ready(function(){
    document.querySelector("body").addEventListener('click', function(e) {
        var catVal = e.target.closest('.analyticssocialmedia');
        var pVal = e.target.closest('a');
        var eciaVal = e.target.closest('.analyticsecia'); 
        var label="";
        var category= "";
        if(pVal !== null && pVal.textContent !== null && pVal.closest('.analyticssocialicons') !== null && catVal !== null){
            var labeltext = pVal.attributes.title.textContent.trim();
            var categorytext = catVal.firstElementChild.textContent.trim().toUpperCase();
            label = "Social Media Footer Links - " + labeltext;
            category = categorytext + " - footer";
        }
        if(eciaVal !==null && eciaVal.children[0] !== null) {
             label = "Organization Link Footer Links - " + eciaVal.children[0].attributes.title.textContent.trim();
             category = "Organization Link Footer Links - " + eciaVal.children[0].attributes.title.textContent.trim();  
        }
        if (label !== null && category !== null) {
            ctalinkDataLayerCall(label,category);
        }
        
         }, false);
    
    });