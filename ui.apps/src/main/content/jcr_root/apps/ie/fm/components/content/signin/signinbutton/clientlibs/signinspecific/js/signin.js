
//code for sign-in functionality analytic track
document.querySelector("body").addEventListener('click', function(e) {        
    var buttonElement = e.target.closest('button');  
    var fn = "Login";
    var fa="User Login";
    if(buttonElement !== null && buttonElement.value !== null && buttonElement.closest('.analyticsignin')!=null){
		var userid="";    
        var formName=fn;
        var formAction=fa;
        var formError="";
        var formStatus="";   
        var emailError=document.getElementById('signinemailMsg').innerText;
        var pwdError= document.getElementById('signinpwdMsg').innerText;      
        if(emailError!="" && pwdError!=""){          
          formError=formError+emailError+"@@"+pwdError;
          formStatus="false"; 
          formDataLayerCall(userid,formName,formError,formAction,formStatus);
        }
        else if(emailError!="" || pwdError!=""){         
          emailError!="" ? formError=formError+emailError : formError=formError;
          pwdError!="" ? formError=formError+pwdError : formError=formError;
          formStatus="false"; 
          formDataLayerCall(userid,formName,formError,formAction,formStatus);
        }                
        return false;
    }else{
      return true;
    }        
  }, false);
 //analytic code to capture cta on tools&resources
 document.querySelector("body").addEventListener(
  "click",
  function (e) {
    var hyperlinkElement = e.target.closest("a");
    var label = "";
    var category = "";
    if (
      hyperlinkElement !== null &&
      hyperlinkElement.closest(".analyticviewalltoolsandresources") != null
    ) {
      label = hyperlinkElement.childNodes[1].textContent.trim(); 
      category = "FAQ - " + pageName + " page";
    } 
    ctalinkDataLayerCall(label, category);
  },false
);