document.querySelector("body").addEventListener(
    'click', 
    function(e) {  
        var anchor = e.target.closest('a');
        var istechnicalresourcespage = window.location.href.includes("technical_resources.html");
        var label="";
        var category= "";
        if(
            anchor !== null && 
            anchor.closest('.analytictechnicalarticles')!=null && istechnicalresourcespage
        ) {  
            label= anchor.textContent.trim() + " - " +anchor.parentElement.previousSibling.previousSibling.previousSibling.previousSibling.textContent.trim(); 
            category= "Technical articles - " + pageName + " page";        
          } 
          else if(
            anchor !== null && 
            anchor.closest('.analyticviewallbtn')!=null && 
            anchor.parentElement.parentElement.parentElement.parentElement.id=="TechnicalResourceInfo"
        ) {  
            label= anchor.textContent.trim(); 
            category= "Technical Articles - " + pageName + " page";      
          }      
          ctalinkDataLayerCall(label,category); 
    }, false);	