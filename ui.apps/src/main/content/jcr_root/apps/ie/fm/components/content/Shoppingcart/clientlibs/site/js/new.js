let customerGlobalToken = "";
let customerBearerToken = "";
$(document).ready(function () {
  let i = 1;
  $(".addanother_receipent_button").click(function () {
    if ($("#anor-emailmodal-body").children().length < 2) {
      $("#anor-emailmodal-body").append(
        '<div class="email-notification-address-block deleteIcon"><p>Add recipient email address</p><input type="email" class="email-notification-address" id="adder' +
          i +
          '" aria-describedby="emailNotification" placeholder="" onkeyup="anorenableBtn(this)"><i class="fa-light fa-check d-none"></i><i class="fa-light fa-trash trash-img" onclick="anordeleteBlock(this)"></i><p class="ie-error-medium validateOrderConfirmationEmailMsg" id="validateOrderConfirmationEmailMsg' +
          i +
          '"></p></div>'
      );
      i < 3 ? (i = i + 1) : (i = 2);
    }
    if ($("#anor-emailmodal-body").children().length >= 2) {
      $("button.addanother_receipent_button").prop("disabled", "true");
      //$("button.add-more-emails").blur();
    }
  });
  /* checkout success - order confirmation */
  let validation1 = false;
  let validation2 = false;
  let validation3 = false;
  let emailArray = [];
  let sendEmail1 = false;
  let sendEmail2 = false;
  let sendEmail3 = false;
  var autoEmail = false;
  customerGlobalToken = window.isCustomerToken();
  customerBearerToken = window.getbearerToken();
  const emailRegexp = new RegExp(
    /^[a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1}([a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1})*[a-zA-Z0-9]@[a-zA-Z0-9][-\.]{0,1}([a-zA-Z][-\.]{0,1})*[a-zA-Z0-9]\.[a-zA-Z0-9]{1,}([\.\-]{0,1}[a-zA-Z]){0,}[a-zA-Z0-9]{0,}$/i
  );
  $("#eocsendbtn").click(function () {
    customerGlobalToken = window.isCustomerToken();
    customerBearerToken = window.getbearerToken();
    var analyticCallCount = 0;
    emailArray = [];
    if ($("#email").val() != null) {
      var email1 = $("#email").val();
      validation1 = validateOrderConfirmationEmail(email1);
      if (validation1) {
        emailArray.push(email1);
        sendEmail1 = true;
        $("#email + .fa-light.fa-check.d-none").removeClass("d-none");
      } else {
        analyticCallCount++;
        analyticEmailSent("false", analyticCallCount);
      }
    }
    if ($("#adder1").val() != null) {
      const email2 = $("#adder1").val();
      const email1 = $("#email").val();
      const email3 = $("#adder2").val();

      validation2 = validateOrderConfirmationEmail2(email1, email2, email3);
      validation3 = validateOrderConfirmationEmail3(email1, email2, email3);
      if (validation2 || validation3) {
        if (validation2) {
          $(
            "#notification-email-address2 + .fa-light.fa-check.d-none"
          ).removeClass("d-none");
          emailArray.push(email2);
          sendEmail2 = true;
        } else {
          analyticCallCount++;
          analyticEmailSent("false", analyticCallCount);
          return validation2;
        }
        if (validation3) {
          emailArray.push(email3);
          sendEmail3 = true;
          $(
            "#notification-email-address3 + .fa-light.fa-check.d-none"
          ).removeClass("d-none");
        } else {
          analyticCallCount++;
          analyticEmailSent("false", analyticCallCount);
          return validation3;
        }
      } else {
        analyticCallCount++;
        analyticEmailSent("false", analyticCallCount);
      }
    }
    if ($("#adder2").val() != null) {
      const email2 = $("#adder1").val();
      const email1 = $("#email").val();
      const email3 = $("#adder2").val();
      validation3 = validateOrderConfirmationEmail3(email1, email2, email3);
      if (validation3) {
        sendEmail3 = true;
        $("#adder2 + .fa-light.fa-check.d-none").removeClass("d-none");
        
      } else {
        analyticCallCount++;
        analyticEmailSent("false", analyticCallCount);
        return;
      }
    }
    /*if(sendEmail1 && (email2 == null || email2 =="" || email3 =="" || email3 == null )){
       getOrderDetailsAndSendEmail(emailArray,autoEmail);
    }
    if(sendEmail1 && sendEmail2 && (email3 == null || email3 =="")){
       getOrderDetailsAndSendEmail(emailArray,autoEmail);
    }
    if(sendEmail1 && sendEmail2 && sendEmail3){
       getOrderDetailsAndSendEmail(emailArray,autoEmail);
    } */
  });
});

$(".email-confirmation-msg i.fa-duotone.fa-xmark").click(function () {
  $(".email-confirmation-msg").addClass("d-none");
});

$(".right_text_email").on("click", function () {
  $("#email").val("");
});

$("#eoccancelbutton").on("click", function () {
  location.reload();
});

function anordeleteBlock(removeBlock) {
  //var removeBlock = document.querySelector('.email-notification-address-block.deleteIcon');
  //removeBlock.remove(this);
  $(removeBlock).parent().remove();
  $("button.addanother_receipent_button").prop("disabled", false);
}

/* Disabled and enabled button functionality*/
function anorenableBtn(txt) {
  var bt = document.querySelector(".btn.send-btn-enabled");
  if (txt.value != "") {
    bt.disabled = false;
  } else {
    bt.disabled = true;
    $(".email-address-block .fa-light.fa-check").addClass("d-none");
  }
}

/* Email validations */
function validateOrderConfirmationEmail(email1) {
  if (document.querySelector(".email").value != null) {
    var email1 = document.querySelector(".email").value;
  }
  document.querySelector("#errormsg").innerHTML = "";

  const emailRegexp = new RegExp(
    /^[a-zA-Z0-9][\_\.\|]{0,1}([a-zA-Z0-9][\_\.\|]{0,1})*[a-zA-Z0-9]@[a-zA-Z0-9][-\.]{0,1}([a-zA-Z][-\.]{0,1})*[a-zA-Z0-9]\.[a-zA-Z0-9]{1,}([\.\-]{0,1}[a-zA-Z]){0,}[a-zA-Z0-9]{0,}$/i
  );
  if (email1 == "" || email1.length == 0) {
    document.querySelector(".errormsg").innerHTML = utilityMessage.messages.enterEmailAddress;
    return false;
  }
  if (emailRegexp.test(email1)) {
    document.querySelector(".errormsg").innerHTML = "";
    //document.querySelector(".fa-light.fa-check.d-none").classList.remove("d-none");
    $("#email + .fa-light.fa-check.d-none").removeClass("d-none");
    return true;
  } else {
    document.querySelector(".errormsg").innerHTML =
      utilityMessage?.messages?.enterValidEmailAddress || "";
    $("#email + .fa-light.fa-check").addClass("d-none");
    return false;
  }

  return true;
}

function validateOrderConfirmationEmail2(email1, email2, email3) {
  document.querySelector("#validateOrderConfirmationEmailMsg1").innerHTML = "";

  const emailRegexp = new RegExp(
    /^[a-zA-Z0-9][\_\.\|]{0,1}([a-zA-Z0-9][\_\.\|]{0,1})*[a-zA-Z0-9]@[a-zA-Z0-9][-\.]{0,1}([a-zA-Z][-\.]{0,1})*[a-zA-Z0-9]\.[a-zA-Z0-9]{1,}([\.\-]{0,1}[a-zA-Z]){0,}[a-zA-Z0-9]{0,}$/i
  );
  if (email2 == "" || email2.length == 0) {
    document.querySelector("#validateOrderConfirmationEmailMsg1").innerHTML =
      utilityMessage?.messages?.enterEmailAddress || "";
    return false;
  }

  if (emailRegexp.test(email2)) {
    document.querySelector("#validateOrderConfirmationEmailMsg1").innerHTML =
      "";
    if (email1 == email2) {
      document.querySelector("#validateOrderConfirmationEmailMsg1").innerHTML =
        utilityMessage?.messages?.enterAdditionalEmail || "";
      $("#adder1 + .fa-light.fa-check").addClass("d-none");
      return false;
    } else if (email1 == email3 || email2 == email3) {
      document.querySelector("#validateOrderConfirmationEmailMsg2").innerHTML =
        utilityMessage?.messages?.enterAdditionalEmail || "";
      $("#adder1 + .fa-light.fa-check").addClass("d-none");
      return false;
    }
    $("#adder1 + .fa-light.fa-check.d-none").removeClass("d-none");
    return true;
  } else {
    document.querySelector("#validateOrderConfirmationEmailMsg1").innerHTML =
      utilityMessage?.messages?.enterValidEmailAddress || "";
    $("#adder1 + .fa-light.fa-check").addClass("d-none");
    return false;
  }

  return true;
}
function validateOrderConfirmationEmail3(email1, email2, email3) {
  //   document.querySelector("#validateOrderConfirmationEmailMsg2").innerHTML = "";

  const emailRegexp = new RegExp(
    /^[a-zA-Z0-9][\_\.\|]{0,1}([a-zA-Z0-9][\_\.\|]{0,1})*[a-zA-Z0-9]@[a-zA-Z0-9][-\.]{0,1}([a-zA-Z][-\.]{0,1})*[a-zA-Z0-9]\.[a-zA-Z0-9]{1,}([\.\-]{0,1}[a-zA-Z]){0,}[a-zA-Z0-9]{0,}$/i
  );

  if (email3 == "") {
    document.querySelector("#validateOrderConfirmationEmailMsg2").innerHTML =
      utilityMessage?.messages?.enterEmailAddress || "";
    return false;
  }

  if (emailRegexp.test(email3)) {
    document.querySelector("#validateOrderConfirmationEmailMsg2").innerHTML =
      "";
    if (email1 == email3 || email2 == email3) {
      document.querySelector("#validateOrderConfirmationEmailMsg2").innerHTML =
        utilityMessage?.messages?.enterAdditionalEmail || "";
      $("#adder2 + .fa-light.fa-check").addClass("d-none");
      return false;
    }
    $("#adder2 + .fa-light.fa-check.d-none").removeClass("d-none");
    return true;
  } else {
    if (email3 != null || email3 != undefined) {
      document.querySelector("#validateOrderConfirmationEmailMsg2").innerHTML =
        utilityMessage?.messages?.enterValidEmailAddress || "";
      $("#adder2 + .fa-light.fa-check").addClass("d-none");
      return false;
    }
    return true;
  }
  return true;
}
