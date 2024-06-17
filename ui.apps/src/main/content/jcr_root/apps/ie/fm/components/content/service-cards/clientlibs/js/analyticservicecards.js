//code to track cta on tools & resources page
document.querySelector("body").addEventListener(
    'click', 
  function(e) {  
       var anchor = e.target.closest('a');
       var categoryText = "";
        var label="";
        var category= "";
      if(
          anchor !== null && 
          anchor.closest('.analyticServiceDescription')!=null
      ) {  
          categoryText = anchor.parentElement.parentElement.previousElementSibling.textContent.trim();
          label= anchor.textContent.trim(); 
          category= categoryText + " - services - " + pageName + " page";        
      }  
        ctalinkDataLayerCall(label,category); 
  }, false);	