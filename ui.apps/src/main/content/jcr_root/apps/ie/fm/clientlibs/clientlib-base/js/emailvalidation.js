$(document).ready(function () {
  // Reset Password: Send Button
  const $sendEmailBtn = $("#sendEmailButton");
  if (!$sendEmailBtn) {
    return;
  }
  $(".custom_input_field.reset-passwd-email").focus(function() {
    $sendEmailBtn.removeClass('disabled');
  });
  if ($sendEmailBtn) {
    $sendEmailBtn
      .parent()
      .parent()
      .addClass(
        "sendemailbutton aem-GridColumn--default--none aem-GridColumn aem-GridColumn--default--3 aem-GridColumn--offset--default--0"
      );
    $sendEmailBtn.addClass(
      "cmp-button custom_email_button analyticssendemailbutton"
    );
    $sendEmailBtn.click(function () {
      //function submitEmail() {      
      $sendEmailBtn.addClass('disabled');
      let email = $("#resetpwdemail").val();
      let isEmailValid = formValidation.validateEmail($("#emailMsg"), email);
	  let isValidateForm = formValidation.validate_form();
      if(isEmailValid && isValidateForm){
      emailCTValidation();
      }
    });
  }
  const faqViewAllBtn = document.getElementById("faq_viewall");
  if (faqViewAllBtn) {
    faqViewAllBtn.parentNode.classList.add("signinbutton");
  }
});
function emailCTValidation() {
  var obj = {};
  var errormessage = "";
  var formStatus = "";
  var customerId = "";
  obj.emailId = $("#resetpwdemail").val();
  $.ajax({
    type: "POST",
    url: "/bin/EmailValidation",
    data: { email: obj.emailId, bearerToken: window.getbearerToken() },
    success: function (loginResponse, textstatus, xhr) {
    //  window.errorModule.checkError(loginResponse);
      if (loginResponse != null && loginResponse != "") {
        if (xhr.status == 200 && loginResponse.statusCode != 404) {
          //alert(JSON.stringify(loginResponse));
          $("#sendEmailButton").addClass('disabled');
          var tvalue = JSON.stringify(loginResponse.value);
          var tokenId = tvalue.replaceAll('"', "");
          customerId = loginResponse.customerId ? loginResponse.customerId : "";
          sendemailToReceipients(obj.emailId, tokenId, customerId);
        } else {          
          //$("#emailMsg").text() == "" ? $("#emailMsg").text(utilityMessage.messages.nonRegisteredEmail) : $("#emailMsg").text() == "";
          $("#sendEmailButton").addClass('disabled');          
          window.location.href ="/content/fm/en/reset-password/email-sent.html";
		      errormessage = loginResponse.message;
          formStatus = "false";
          analyticsSendEmailStatus(formStatus, errormessage);
        }
      }
    },
    error: function (error) {
      errormessage = "Error in Email Validation service";
      formStatus = "false";
      analyticsSendEmailStatus(formStatus, errormessage);
      window.errorModule.showErrorPopup(error);
    }
  });
}

function sendemailToReceipients(emailId, tokenId, customerId) {
 // var subjectLine ="Subject: RF Microwave Components: Fairview Microwave Inc. Password";
  var hostName = window.location.hostname;
  var formStatus,errormessage;
  $.ajax({
    type: "POST",
    url: "/bin/sendemail",
    data: {
      email: emailId,
      CTTokenValue: tokenId,
      domainname: hostName
    },
    success: function (loginResponse, textstatus, xhr) {
      if (loginResponse != null && loginResponse != "") {
       // window.errorModule.checkError(loginResponse);
        if (xhr.status == 200 && loginResponse.statusCode != 400) {
          formStatus = "true";
          analyticsSendEmailStatus(formStatus, (errormessage = ""), customerId);
          window.location.href =
            "/content/fm/en/reset-password/email-sent.html";
        } else {
          errormessage = loginResponse.message;
          formStatus = "false";
          analyticsSendEmailStatus(formStatus, errormessage);
        }
      }
    },
    error: function (error) {
      var errormessage = "Error in Send Email service";
      formStatus = "false";
      analyticsSendEmailStatus(formStatus, errormessage);
      window.errorModule.showErrorPopup(error);
    }
  });
}

//code for analytics email success or failure
function analyticsSendEmailStatus(formStatus, errormessage, customerId) {
  const formName = "Send Email";
  const formAction = "Send Email";
  const formError = errormessage;
  customerId = customerId ? customerId : "";
  const webId="";
  formResetPasswordDLCall(formName,formError,formAction,formStatus,webId,customerId);
}
