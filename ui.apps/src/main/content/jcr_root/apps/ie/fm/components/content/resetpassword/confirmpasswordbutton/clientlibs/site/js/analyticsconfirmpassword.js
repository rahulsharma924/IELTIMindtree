
//code for confirm password functionality analytic tracking
document.querySelector("body").addEventListener('click', function(e) {        
    var buttonElement = e.target.closest('button');  
    var formName = "Confirm Password";
    var formAction="Reset password";
    var webId = "";
	var customerId = "";
    if(buttonElement !== null && buttonElement.value !== null && buttonElement.closest('.analyticsconfirmpassword')!=null){
        var formError="";
        var formStatus="";   
        var enterPasswordError=document.getElementById('pswd1Msg').innerText;
        var confirmPasswordError= document.getElementById('pswd2Msg').innerText;      
        if(enterPasswordError!="" && confirmPasswordError!=""){          
          formError=enterPasswordError+"|"+confirmPasswordError;
          formStatus="false"; 
          formResetPasswordDLCall(formName, formError, formAction, formStatus, webId, customerId)
        }
        else if(enterPasswordError!="" || confirmPasswordError!=""){         
          enterPasswordError!="" ? formError=formError+enterPasswordError : formError=formError;
          confirmPasswordError!="" ? formError=formError+confirmPasswordError : formError=formError;
          formStatus="false"; 
          formResetPasswordDLCall(formName, formError, formAction, formStatus, webId, customerId)
        }                
        return false;
    }else{
      return true;
    }        
  }, false);
 