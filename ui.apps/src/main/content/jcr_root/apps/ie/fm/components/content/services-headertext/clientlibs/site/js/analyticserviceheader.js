//analytic code to capture cta on tools&resources
document.querySelector("body").addEventListener(
    'click', 
function(e) {  
    var anchor = e.target.closest('a');
    var label="";
    var category= "";
    if(
        anchor !== null && 
        anchor.closest('.analytictoolsandresourcescontactus')!=null
    ) {  
        label= anchor.textContent.trim(); 
        category= "contact us - services - " + pageName + " page";        
    }  
    ctalinkDataLayerCall(label,category); 
}, false);	