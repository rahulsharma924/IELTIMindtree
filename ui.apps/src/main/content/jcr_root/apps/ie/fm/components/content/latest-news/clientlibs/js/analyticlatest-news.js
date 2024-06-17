document.querySelector("body").addEventListener(
    'click', 
    function(e) { 
        var anchor = e.target.closest('a');
        var label="";
        var category= "";
        var categoryText= "";
        if(
            anchor !== null && 
            anchor.closest('.analyticlatestnews')!=null
        ) {  
            categoryText = anchor.parentElement.previousSibling.previousSibling.childNodes[1].childNodes[1].nextElementSibling.nextElementSibling.textContent.trim();
            label= anchor.textContent.trim(); 
            category= "Latest news - " + categoryText + " - " + pageName + " page";        
          }  
          ctalinkDataLayerCall(label,category); 
    }, false);	