$(document).ready(function () {
  // Populate Country List
  let shoppingCartCountryRFQ = $("#country-rfq");
  let shoppingCartStateRFQ = $("#state-rfq");
  if (shoppingCartCountryRFQ.length > 0) {
    shoppingCartCountryRFQ.countryList(countriesList);
  }
  // Populate State List based on country selection
  $(shoppingCartCountryRFQ).change(function (event) {
    let $currEvent = $(event.currentTarget);
    let selectCountry = $currEvent.val();
    shoppingCartStateRFQ.stateFilter(countriesList, selectCountry);
  });

  // RFQ Form Validation Action
  const $rfqModalSave = $(".rfqModal-save-btn");
  $rfqModalSave.on("click", function () {
    validatePdpRFQ();
  });
  $(".note-closeIcon-wrap i").click(function () {
    $(".note-rfq").addClass("d-none");
  });
});


/* Disabled and enabled button functionality for forms (RFQ)*/
function manageEnableBtn(txt) {
  var bt = document.querySelector(".rfqModal-save-btn");
  if (bt) {
    if (txt.value != "") {
      bt.disabled = false;
    } else {
      bt.disabled = true;
    }
  }
}

/* Validations functions */
function validatePdpFirstNameRFQ() {
  let $fnameEle = $("#firstName-rfq");
  let $fnameErrEle = $("#firstName-rfq-msg");
  let fname = $fnameEle.val();
  return formValidation.validateFirstName($fnameErrEle,fname);

  // if (fname == "" || fname.length == 0) {
  //   $fnameErrEle.text(ValidationData.enterFirstName);
  //   $fnameErrEle.focus();
  //   return false;
  // } else if (fname.length > 20) {
  //   $fnameErrEle.text(ValidationData.maxChar20);
  //   $fnameErrEle.focus();
  //   return false;
  // } else if (!regexFname.test(fname)) {
  //   $fnameErrEle.text("") ;
  //   return true;
  // } else if (regexFname.test(fname)) {
  //   $fnameErrEle.text(ValidationData.notValidName);
  //   return false;
  // } else {
  //   $fnameErrEle.text("");
  //   return true;
  // }
}

function validatePdpLastNameRFQ() {
  let $lnameEle = $("#lastName-rfq");
  let $lnameErrEle = $("#lastName-rfq-msg");

  let lname = $lnameEle.val();
  // let regexLname = /[^a-zA-Z\-]/;

  return formValidation.validateLastName($lnameErrEle,lname)

  // if (lname == "" || lname.length == 0) {
  //   $lnameErrEle.text(ValidationData.enterLastName);
  //   $lnameErrEle.focus();
  //   return false;
  // } else if (lname.length > 30) {
  //   $lnameErrEle.text(ValidationData.maxChar30);
  //   $lnameErrEle.focus();
  //   return false;
  // } else if (!regexLname.test(lname)) {
  //   $lnameErrEle.text("");
  //   return true;
  // } else if (regexLname.test(lname)) {
  //   $lnameErrEle.text(ValidationData.notValidName);
  //   $lnameErrEle.focus();
  //   return false;
  // } else {
  //   $lnameErrEle.text("");
  //   return true;
  // }
}

function validatePdpCompanyRFQ() {
  let $cnameEle = $("#company-rfq");
  let $cnameErrEle = $("#company-rfq-msg");

  let cname = $cnameEle.val();
  if (cname.length > 40) {
    $cnameErrEle.text(ValidationData.maxChar40);
    return false;
  } else {
    return formValidation.validateCompany($cnameErrEle,cname);
  }
}

function validatePdpJobTitleRFQ() {
  let $jnameEle = $("#jobTitle-rfq");
  let $jnameErrEle = $("#jobTitle-rfq-msg");
  let jname = $jnameEle.val();
  return formValidation.validateJobTitle($jnameErrEle, jname);

  // if (jname.length > 40) {
  //   $jnameErrEle.text(ValidationData.maxChar40);
  //   return false;
  // } else {
  //   $jnameErrEle.text("");
  //   return true;
  // }
}

function validatePdpEmailRFQ() {
  let email = $("#email-rfq").val();
  let $emailErrEle = $("#email-rfq-msg");
  return formValidation.validateEmail($emailErrEle, email);
  // const emailRegexp = new RegExp(
  //   /^[a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1}([a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1})*[a-zA-Z0-9]@[a-zA-Z0-9][-\.]{0,1}([a-zA-Z][-\.]{0,1})*[a-zA-Z0-9]\.[a-zA-Z0-9]{1,}([\.\-]{0,1}[a-zA-Z]){0,}[a-zA-Z0-9]{0,}$/i
  // );
  // if (email == "" || email.length == 0) {
  //   $emailErrEle.text(ValidationData.enterEmailAddress);
  //   return false;
  // }
  // if (emailRegexp.test(email)) {
  //   $emailErrEle.text("");
  //   return true;
  // } else {
  //   $emailErrEle.text(ValidationData.enterValidEmailAddress);
  //   return false;
  // }
}

function validatePdpPhoneNumberRFQ() {
  let phoneNumber = $("#contact-rfq").val();
  let $phoneNumErr = $("#contact-rfq-msg");
   var phoneno = /^[\d +/()-]{1,20}$/;
  if (!phoneNumber.match(phoneno)) {
    $phoneNumErr.text(ValidationData.notValidPhone);
    return false;
  }
  return formValidation.validatePhoneNumber($phoneNumErr, phoneNumber);
  //   var phoneno = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  // var phoneno = /^[\d +/()-]{1,20}$/;

  // if (phoneNumber == "" || phoneNumber.length == 0) {
  //   $phoneNumErr.text(ValidationData.enterPhone);
  //   return false;
  // }
  // if (phoneNumber.length < 10) {
  //   $phoneNumErr.text(ValidationData.minPhonelength);
  //   return false;
  // }
  // if (phoneNumber.length > 20) {
  //   $phoneNumErr.text(ValidationData.maxChar20);
  //   return false;
  // }
  // if (!phoneNumber.match(phoneno)) {
  //   $phoneNumErr.text(ValidationData.notValidPhone);
  //   return false;
  // }else {
  //   $phoneNumErr.text("");
  //   return true;
  // }
}

function validatePdpShippingAddressOneRFQ() {
  let shippingAddressone = $("#shippingAdd-rfq").val();
  //var regName = ^[a-zA-Z0-9\s\,\''\-]*$;
  let $shipping1ErrEle = $("#shippingAdd-rfq-msg");

  return formValidation.validateAddressOne($shipping1ErrEle, shippingAddressone);

  // if (shippingAddressone == "" || shippingAddressone.length == 0) {
  //   $shipping1ErrEle.text(ValidationData.enterShippingAddress);
  //   return false;
  // }

  // if (shippingAddressone.length > 50) {
  //   $shipping1ErrEle.text(ValidationData.maxChar50);
  //   return false;
  // } else {
  //   $shipping1ErrEle.text("");
  //   return true;
  // }
}

function validatePdpShippingAddressTwoRFQ() {
  let shippingAddresstwo = $("#shippingAdd2-rfq").val();
  let $shipping2ErrEle = $("#shippingAdd2-rfq-msg");

  return formValidation.validateAddressTwo($shipping2ErrEle, shippingAddresstwo);
  // if (shippingAddresstwo.length > 50) {
  //   $shipping2ErrEle.text(ValidationData.maxChar50);
  //   return false;
  // } else {
  //   $shipping2ErrEle.text("");
  //   return true;
  // }
}

function validatePdpCityRFQ() {
  let cityShippingName = $("#city-rfq").val();
  let $cityErrEle = $("#city-rfq-msg");

  return formValidation.validateCity($cityErrEle, cityShippingName);
  // let regName = /[^a-zA-Z\- ]/;

  // if (cityShippingName == "" || cityShippingName.length == 0) {
  //   $cityErrEle.text(ValidationData.enterCity);
  //   return false;
  // }
  // if (cityShippingName.length > 30) {
  //   $cityErrEle.text(ValidationData.maxChar30);
  //   return false;
  // }
  // if (regName.test(cityShippingName)) {
  //   $cityErrEle.text(ValidationData.notValidCity);
  //   return false;
  // } else {
  //   $cityErrEle.text("");
  //   return true;
  // }
}

function validatePdpZipCodeRFQ() {
  let zippcode = $("#zipcode-rfq").val();
  let $countryEle = $("#country-rfq :selected");
  let optionShippingIndex = $countryEle.val();
  let $errorMessage = $("#zipcode-rfq-msg");

  return formValidation.validateZipCode($errorMessage,zippcode,optionShippingIndex);
 
  // if ((zippcode == "" || zippcode.length == 0) && optionShippingIndex == 0) {
  //   $errorMessage.text(ValidationData.enterZipcode);
  //   $errorMessage.classList.add("d-none");
  // } else if (zippcode == "" || zippcode.length == 0) {
  //   $errorMessage.text(ValidationData.enterZipcode);
  //   $errorMessage.classList.add("d-none");
  // } else if (optionShippingIndex == "US") {
  //     const zipRegex = new RegExp(/^[0-9 \-]{1,10}$/);
  //     if (zipRegex.test(zippcode) && (zippcode.length <= 10)) {
  //       if (zippcode.length == 5) {
  //         $errorMessage.text("");
  //         return true;
  //       } else if (zippcode.substring(5, 6) == "-" && zippcode.substring(6).length == 4) {
  //         $errorMessage.text("");
  //         return true;
  //       } else {
  //         $errorMessage.text(ValidationData.notValidZipOrPost);
  //         return false;
  //       }
  //     }
  //     else {
  //       $errorMessage.text(ValidationData.notValidZipOrPost);
  //       return false;
  //   }
  // } else if (optionShippingIndex == "CA") {

  //   $errorMessage.text("");
  //   //ANA NAN
  //   // const zipRegex = new RegExp (/[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d/);
  //   const zipRegex = new RegExp(/[A-Za-z][0-9][A-Za-z] ?[0-9][A-Za-z][0-9]/);
  //   if (zipRegex.test(zippcode) && zippcode.length == 7) {
  //     $errorMessage.text("");
  //     return true;
  //   } else {
  //     $errorMessage.text(ValidationData.notValidZipOrPost);
  //     return false;
  //   }
  // } else if (optionShippingIndex != "CA" && optionShippingIndex != "US") {
  //   //const zipRegex1 = new RegExp(/^(?![a-zA-Z]*$)(?![0-9-\s]*$)[a-zA-Z0-9]{1,10}$/);
  //   const zipRegex1 = new RegExp(/^[a-zA-Z0-9 ]{1,10}$/);
  //   if (zipRegex1.test(zippcode)) {
  //     $errorMessage.text("");
  //     return true;
  //   } else {
  //     $errorMessage.text(ValidationData.notValidZipOrPost);
  //     return false;
  //   }
  // } else {
  //   $errorMessage.text("");
  //   return true;
  // }
}

function validatePdpCountryRFQ() {
  let $countryEle = $("#country-rfq");
  // let $countryErrEle = $("#country-rfq-msg");
  let optionShippingIndex = $countryEle.val();
  return formValidation.validateCountryaddress($countryEle, optionShippingIndex);
  
  // if (optionShippingIndex == 0) {
  //   $countryErrEle.text(ValidationData.enterCountry);
  //   return false;
  // } else {
  //   $countryErrEle.text("");
  //   return true;
  // }
}

function validatePdpStateRFQ() {
  let $stateEle = $("#state-rfq");
  let optionShippingIndex = $stateEle.val();
  
  return formValidation.validateStatename($stateEle, optionShippingIndex);
  // if (optionShippingIndex == 0 || optionShippingIndex === undefined) {
  //   $stateErrEle.text(ValidationData.enterState);
  //   return false;
  // } else {
  //   $stateErrEle.text("");
  //   return true;
  // }
}

//order summary details in popup

function thankupopup_email() {
  $("#rfqSaveModal").hide();
}

$("#country-rfq").change(function () {
  var addcountrySelected = document.getElementById("country-rfq");
  var optionSelIndex =
    addcountrySelected.options[addcountrySelected.selectedIndex].value;
  $("#zipcode-rfq").val("");
  $("#zipcode-rfq").removeAttr("maxlength");
  if (optionSelIndex == "CA") {
    $("#zipcode-rfq").attr("maxlength", "7");
  } else if (optionSelIndex == "US") {
    $("#zipcode-rfq").attr("maxlength", "10");
  } else {
    $("#zipcode-rfq").attr("maxlength", "10");
  }
});

/* RFQ Zipcode format and validation starts*/
// $("#zipcode-rfq").keyup(function (e) {
//   var addcountrySelected = document.getElementById("country-rfq");
//   var optionSelIndex =
//     addcountrySelected.options[addcountrySelected.selectedIndex].value;
//   let valofinput = e.target;

//   if (optionSelIndex == "CA") {
//     let trimmed = valofinput.value.replace(/\s+/g, "");
//     if (trimmed.length > 6) {
//       trimmed = trimmed.substr(0, 6);
//     }

//     trimmed = trimmed.replace(/' '/g, "");
//     let numbers = [];
//     numbers.push(trimmed.substr(0, 3));

//     if (trimmed.substr(3, 3) !== "") numbers.push(trimmed.substr(3, 3));

//     valofinput.value = numbers.join(" ");
//   }
//   if (optionSelIndex == "US") {
//     let trimmed = valofinput.value.replace(/\s+/g, "");
//     //if (trimmed.length > 11) {
//     //trimmed = trimmed.substr(0, 10);
//     //}
//     trimmed = trimmed.replace('-', "");
//     if (trimmed.length > 5) {
//       let subData = trimmed.substring(0, 5) + "-" + trimmed.substring(5)
//       valofinput.value = subData;
      
//     }
//   } else {
//     valofinput.value = valofinput.value;
//   }
// });

/* RFQ Zipcode format and validation ends*/

function validatePdpRFQ() {
  let isFnameValid = validatePdpFirstNameRFQ();
  let isLnameValid = validatePdpLastNameRFQ();
  let isCompanyValid = validatePdpCompanyRFQ();
  let isJobValid = validatePdpJobTitleRFQ();
  let isEmailValid = validatePdpEmailRFQ();
  let isPhoneValid = validatePdpPhoneNumberRFQ();
  let isShip1AddrValid = validatePdpShippingAddressOneRFQ();
  let isShip2AddrValid = validatePdpShippingAddressTwoRFQ();
  let isCityValid = validatePdpCityRFQ();
  let isCountryValid = validatePdpCountryRFQ();
  let isZipValid = validatePdpZipCodeRFQ();
  let isStateValid = validatePdpStateRFQ();
  let isCaptchaValid = formValidation.validate_form();  
  if (isFnameValid && isLnameValid && isCompanyValid && isJobValid && 
    isEmailValid && isPhoneValid  && isShip1AddrValid && 
    isShip2AddrValid && isCityValid  && isCountryValid && isZipValid &&
    isStateValid && isCaptchaValid) {
    sendPDPIEEmail();
  }
}
