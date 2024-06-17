//code for send email functionality analytics tracking
document.querySelector("body").addEventListener('click', function(e) {       
  let buttonElement = e.target.closest('button');  
  let fn = "Send Email";
  let fa = "Send Email";
  if(buttonElement !== null && buttonElement.value !== null && buttonElement.closest('.analyticssendemailbutton')!=null){                
      var formName=fn;
      var formAction=fa;
      var formError="";
      var formStatus="";   
      var emailError=document.getElementById('emailMsg').innerText; 
      var webId="";    
      let customerId="";
      if(emailError!=""){
        formError=emailError;
        formStatus="false"; 
        formResetPasswordDLCall(formName,formError,formAction,formStatus,webId,customerId);
      }          
      return false;
  }else{
    return true;
  }        
}, false);
