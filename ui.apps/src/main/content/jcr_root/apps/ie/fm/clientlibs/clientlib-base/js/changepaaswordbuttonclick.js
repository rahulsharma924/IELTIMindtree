$(document).ready(function() {
            $("#confirmpasswordbutton").click(function(){
                var obj = {};
                obj.pwd2 = $("#pswd2").val();
                obj.pwd1 = $("#pswd1").val();
          var urlParamsval = new URLSearchParams(window.location.search);
    	  var tokenID = urlParamsval.get("tokenid");
    	  var tvalue=tokenID;
		var urlParams = new URLSearchParams(window.location.search);
    var eamilId = urlParams.get("email_id");
    var email;
    if(eamilId) {
        var email = eamilId.toLocaleLowerCase();
    }
    var mailpass = email.substring(0, email.lastIndexOf("@"));
    var maildomain = email.substring(email.indexOf("@") + 1);
    var maildomainVal=maildomain.replaceAll(".com","");
    var errormessage = "";
    var formStatus = "";
    let newPassword = $("#pswd1").val();
    let $errorMessage = $("#pswd1Msg");
    let isNewPwdValid = formValidation.validatePassword(newPassword, $errorMessage, email);
    if (isNewPwdValid === true && (obj.pwd1 === obj.pwd2) && (!obj.pwd1.includes(mailpass) && !obj.pwd1.includes(maildomainVal))) {
                
		    $.ajax({
            type: "POST",
            url:'/bin/EmailChangePassword',
            data: {CTCustomerToken:tvalue, newPassword:obj.pwd1, bearertoken: window.getbearerToken()},
            success:function(loginResponse,textstatus,xhr){
            if(loginResponse!=null && loginResponse!=""){
              //window.errorModule.checkError(loginResponse);
                 if(xhr.status == 200 && loginResponse.statusCode != 404){
                  formStatus = "true";
                  var customerId=loginResponse.id ? loginResponse.id : "";
                  var key=loginResponse.key ? loginResponse.key : "";
                  analyticsConfirmPassword(formStatus,errormessage="",key,customerId);
                  window.location.href="/content/fm/en/reset-password/successful-password-reset.html";
                } else {
                  errormessage = loginResponse.message;
                  formStatus = "false";
                  analyticsConfirmPassword(formStatus,errormessage);
                }
               }
             }, 
             error:function(error){
              errormessage = "Error in Email Change Password service";
              formStatus = "false";
              analyticsConfirmPassword(formStatus,errormessage);
              window.errorModule.showErrorPopup(error);
             }
           });
       }
       });
      
       //code for analytics confirm password button click
      function analyticsConfirmPassword(formStatus,errormessage,key,customerId){
        var formName = "Confirm Password";
        var formAction = "Reset password";
        var formError = errormessage;
        var customerId = customerId ? customerId : "";
        var webId = "";
        if(key!="" && key!=null && key!=undefined){
          webId = key.split("-")[0];
        }
        formResetPasswordDLCall(formName,formError,formAction,formStatus,webId,customerId);
}
  });
