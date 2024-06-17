var customFormErrorMsg = {};
$(document).ready(function() {
   //getUtilityErrorMsg();
   $("#literatureemail").click(function(){
   var status = validateFormFileds();
   var obj = {};
   obj.emailId = $("#literatureemailid").val();
   obj.name=$("#plName").val();
   obj.phone=$("#plPhone").val();
   var hostName=window.location.hostname; 
   if (status) {
   $.ajax({
           type: "GET",
          url:'/bin/sendemailliterature',
       data: {email:obj.emailId,name: obj.name, phone: obj.phone,domainname:hostName
               },
         success:function(emailResponse,textstatus,xhr){
            if(emailResponse!=null && emailResponse!=""){
              //window.errorModule.checkError(emailResponse);
              if(xhr.status == 200 && emailResponse.statusCode != 404){
                  $("#getMyFreecopyForm")[0].reset();
              }    
           }
          },
          error: function (error) {
            window.errorModule.showErrorPopup(error);
          }
    });
   }
  });


//get utility json
customFormErrorMsg = window.utilityMessage ? window.utilityMessage : {}; 
});
 function validateFormFileds() {
   var flag;
   var flagName = validateName();
   var flagPhone = validatePhoneNumber();
   var flagEmail = validateEmail();
   if (flagName && flagPhone && flagEmail) {
       flag = true;
       }
   return flag;
}

function validateName() {
   var validateName = $("#plName").val();
   var regInfoName = /[^a-zA-Z\- ]/;
   if (validateName == "" || validateName.length == 0) {
     $("#getMyCopyNameMsg").text(customFormErrorMsg?.messages.enterName);
     return false;
   } else if (validateName.length > 20) {
    $("#getMyCopyNameMsg").text(customFormErrorMsg?.messages.maxChar20);
     return false;
   } else if (!regInfoName.test(validateName)) {
     $("#getMyCopyNameMsg").text("");
     return true;
   } else if (regInfoName.test(validateName)) {
     $("#getMyCopyNameMsg").text(customFormErrorMsg?.messages.notValidName);
     return false;
   } else {
     $("#getMyCopyNameMsg").text("");
     return true;
   }
 }

 function validatePhoneNumber() {
   var phoneNumber = $("#plPhone").val();
   //   var phoneno = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
   var phoneno = /^[\d +/()-]{1,20}$/;
     if (phoneNumber == "" || phoneNumber.length == 0) {
         $("#getMyCopyPhoneMsg").text(customFormErrorMsg?.messages.enterPhone);
         return false;
     }
     if (phoneNumber.length > 15) {
         $("#getMyCopyPhoneMsg").text(customFormErrorMsg?.messages.maxChar15);
         return false;
     }
     if (phoneNumber.length < 10) {
         $("#getMyCopyPhoneMsg").text(customFormErrorMsg?.messages.maxChar10);
         return false;
     }
     if (!phoneNumber.match(phoneno)) {
         $("#getMyCopyPhoneMsg").text(customFormErrorMsg?.messages.notValidPhone);
         return false;
     }
     if (phoneNumber.match(phoneno)) {
         $("#getMyCopyPhoneMsg").text("");
         return true;
     } else {
         $("#billingShippingAddressPhoneNumberMsg").text("");
         return true;
     }
   return true;
 }

 function validateEmail() {
   var email = $("#literatureemailid").val();
   const emailRegexp = new RegExp(
           /^[a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1}([a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1})*[a-zA-Z0-9]@[a-zA-Z0-9][-\.]{0,1}([a-zA-Z][-\.]{0,1})*[a-zA-Z0-9]\.[a-zA-Z0-9]{1,}([\.\-]{0,1}[a-zA-Z]){0,}[a-zA-Z0-9]{0,}$/i
   );
   if (email == "" || email.length == 0) {
           $("#getMyCopyEmailMsg").text(customFormErrorMsg?.messages.emailNotBeBlank);
           return false;
   }
   if (emailRegexp.test(email)) {
           $("#getMyCopyEmailMsg").text("");
           return true;
   } else {
           $("#getMyCopyEmailMsg").text(customFormErrorMsg?.messages.notValidEmail);
           return false;
   }
}