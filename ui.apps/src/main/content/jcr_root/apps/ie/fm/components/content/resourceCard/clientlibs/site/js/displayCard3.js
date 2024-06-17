$(document).ready(function() {
    var columCount = $(".prouct-item").length;

    if(columCount>4)
    {
      $(".prouct-item").removeClass("col-md-3").addClass("col-md-4");

      $(".prouct-item").css({ marginBottom : "30px"} );

    }
});
//analytic code to capture data on technical articles page
document.querySelector("body").addEventListener(
  'click', 
  function(e) { 
      var anchor = e.target.closest('a');
      var istechnicalresourcespage = window.location.href.includes("technical_resources.html");
      var docname="";
      var doctype= "";
      var docid= "";
      if(
          anchor !== null && 
          anchor.closest('.analyticwhitepaper')!=null && istechnicalresourcespage
      ) {  
        docid = anchor.textContent.trim() + " - " + anchor.parentElement.previousSibling.previousSibling.previousSibling.previousSibling.textContent.trim()
        docname = anchor.href.split("/").pop()
        doctype= anchor.href.split("/").pop().split(".").pop() 
        parameter=docname + "@@" + doctype + "@@" + "" + "@@" + "" + "@@" + "Technical-Resources" + "@@" + "";
        parameterArray = parameter.split("@@"); 
        dcat= "White Papers - Technical Resources";
        documentDLCall(parameterArray,"Click",dcat,docid);       
        } 
        else if(
          anchor !== null && 
          anchor.closest('.analyticbrouchers')!=null && istechnicalresourcespage
      ) {  
        docid = anchor.textContent.trim() + " - " + anchor.parentElement.previousSibling.previousSibling.previousSibling.previousSibling.textContent.trim()
        docname = anchor.href.split("/").pop()
        doctype= anchor.href.split("/").pop().split(".").pop() 
        parameter=docname + "@@" + doctype + "@@" + "" + "@@" + "" + "@@" + "Technical-Resources" + "@@" + "";
        parameterArray = parameter.split("@@"); 
        dcat= "Brouchers - Technical Resources";
        documentDLCall(parameterArray,"Click",dcat,docid); 
          //downloadDLCall("Brouchers - Technical Resources", docid, docname, doctype, "Technical-Resources")      
        } 
        else if(
          anchor !== null && 
          anchor.closest('.analyticviewallbtn')!=null && 
          anchor.parentElement.parentElement.parentElement.id=="WhitePaperInfo"
      ) {  
          label= anchor.textContent.trim(); 
          category= "White Papers - " + pageName + " page"; 
          ctalinkDataLayerCall(label,category);     
        } 
        else if(
          anchor !== null && 
          anchor.closest('.analyticviewallbtn')!=null && 
          anchor.parentElement.parentElement.parentElement.id=="BrochureInfo"
      ) {  
          label= anchor.textContent.trim(); 
          category= "Brouchers - " + pageName + " page"; 
          ctalinkDataLayerCall(label,category);     
        }           
         
  }, false);