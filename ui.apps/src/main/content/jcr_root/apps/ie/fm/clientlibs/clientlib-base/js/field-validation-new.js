// This file created for TEMP, Once all validation part done, will update this with old one

let ValidationData,
  utilityMessageLabel,
  countriesList,
  key1,
  countriesData,
  stateLists,
  key2;

$(document).ready(function () {
  // Utility JSON
  window.getUTILITYModule
    .getUtility()
    .done(function (data) {
      ValidationData = data[0].messages;
      utilityMessageLabel = data[0].labels;
      utilityMessage = data[0];
    })
    .fail(function (error) {});
});

// Country List
window.getAPIModule
  .getCountryList()
  .done(function (data) {
    countriesList = data;
    const $createAccountCountry = $("#country");
    if ($createAccountCountry.length) {
      $createAccountCountry.countryList(countriesList);
    }
  })
  .fail(function (error) {});
//ValidationErrorMsg();

let formValidation = (function () {
  const validateSignEmail = (emailId) => {
    let email = emailId;
    const emailRegexp = new RegExp(regexPattern.EMAIL);
    if (email == "" || email.length == 0) {
      $("#signinemailMsg").text(ValidationData.emailNotBeBlank);
      return false;
    }
    if (emailRegexp.test(email)) {
      $("#signinemailMsg").text("");
      return true;
    } else {
      $("#signinemailMsg").text(ValidationData.notValidEmail);
      return false;
    }
  };

  const validateSignInPwd = (pwd) => {
    if (pwd == "") {
      $("#signinpwdMsg").text(ValidationData.passwordNotBlank);
      $("#signinpwdMsg").css("display", "block");
      return false;
    }
    if (pwd.length < utilityMessageLabel.passwordMinLength) {
      $("#signinpwdMsg").text(ValidationData.minPasswordlength);
      $("#signinpwdMsg").css("display", "block");
      return false;
    }
    if (pwd.length > utilityMessageLabel.passwordMaxLength) {
      $("#signinpwdMsg").text(ValidationData.maxPasswordlength);
      $("#signinpwdMsg").css("display", "block");
      return false;
    }
    if (pwd !== "") {
      $("#signinpwdMsg").text("");
      // Added display none for mobileView
      if ($(window).width() < 833) {
        $("#signinpwdMsg").css("display", "none");
      }
      return true;
    }
  };

  const validateFirstName = ($errorMessage, firstName) => {
    let regName = regexPattern.NAME;

    if (firstName == "" || firstName.length == 0) {
      $errorMessage.text(ValidationData.fnameNotBeBlank);
      return false;
    }
    if (firstName.length > 30) {
      $errorMessage.text(ValidationData.maxChar30);
      return false;
    }
    if (!regName.test(firstName)) {
      $errorMessage.text("");
      return true;
    }
    if (regName.test(firstName)) {
      $errorMessage.text(ValidationData.notValidFname);
      return false;
    } else {
      $errorMessage.text("");
      return true;
    }
  };

  const validateLastName = ($errorMessage, lastName) => {
    let regName = regexPattern.NAME;

    if (lastName == "" || lastName.length == 0) {
      $errorMessage.text(ValidationData.lnameNotBeBlank);
      return false;
    }
    if (lastName.length > 30) {
      $errorMessage.text(ValidationData.maxChar30);
      return false;
    }
    if (!regName.test(lastName)) {
      $errorMessage.text("");
      return true;
    }
    if (regName.test(lastName)) {
      $errorMessage.text(ValidationData.notValidLname);
      return false;
    } else {
      $errorMessage.text("");
      return true;
    }
  };

  const validatePhoneNumber = ($errorMessage, phoneNumber) => {
    const phoneNo = new RegExp(regexPattern.PHONE);
    if (phoneNumber == "" || phoneNumber.length == 0) {
      $errorMessage.text(ValidationData.enterPhone);
      return false;
    }
    if (phoneNumber.length < 10) {
      $errorMessage.text(ValidationData.minPhonelength);
      return false;
    }

    if (phoneNumber.length > 20) {
      $errorMessage.text(ValidationData.maxChar20);
      return false;
    }
    if (!phoneNumber.match(phoneNo)) {
      $errorMessage.text(ValidationData.notValidPhone);
      return false;
    } else {
      $errorMessage.text("");
      return true;
    }
  };

  const validateEmail = ($errorMessage, emailId) => {
    const emailRegexp = new RegExp(regexPattern.EMAIL);
    if (emailId == "" || emailId.length == 0) {
      $errorMessage.text(ValidationData.emailNotBeBlank);
      if ($errorMessage.hasClass("mailmessage")) {
        $errorMessage.addClass("ie-error-medium");
      }
      return false;
    }
    if (emailRegexp.test(emailId)) {
      $errorMessage.text("");
      if ($errorMessage.hasClass("mailmessage")) {
        $errorMessage.removeClass("ie-error-medium");
      }

      return true;
    } else {
      $errorMessage.text(ValidationData.notValidEmail);
      return false;
    }
  };

  const validateCompany = ($errorMessage, companyName) => {
    let regName = regexPattern.CITY_CMP_NAME;
    if (companyName == "" || companyName.length == 0) {
      $errorMessage.text(ValidationData.companyNotBlank);
      return false;
    }
    if (!regName.test(companyName)) {
      $errorMessage.text("");
      return true;
    }
    if (!regName.test(companyName)) {
      $errorMessage.text(ValidationData.notValidCompany);
      return false;
    } else {
      $errorMessage.text("");
      return true;
    }
  };
  const validatePerCompany = ($errorMessage, companyName) => {
    let regName = regexPattern.SPECIALCHAR;
    if (companyName.length > utilityMessageLabel.companyNameMaxLength) {
      $("#companyMsg").text(ValidationData.maxChar40);
      return false;
    } else if (regName.test(companyName)) {
      $("#companyMsg").text(ValidationData.enterValidCompanyName);
      return false;
    } else {
      $("#companyMsg").text("");
      return true;
    }
  };
  const validateAccCompany = ($errorMessage, companyNames) => {
    let regName = regexPattern.SPECIALCHAR;
    if (companyNames.length > utilityMessageLabel.companyNameMaxLength) {
      $errorMessage.text(ValidationData.maxChar40);
      //$("#companYMsg").text(ValidationData.maxChar40);
      return false;
    } else if (regName.test(companyNames)) {
      $errorMessage.text(ValidationData.enterValidCompanyName);
      return false;
    } else {
      $errorMessage.text("");
      $("#companYMsg").text("");
      return true;
    }
  };

  const validateIndustry = (industryoption) => {
    if (industryoption == "Select") {
      $("#industryMsg").text(ValidationData.industryNotSelected);
      return false;
    } else {
      $("#industryMsg").text("");
      return true;
    }
  };

  const validateEnterPwd = (pw1) => {
    let urlParams = new URLSearchParams(window.location.search);
    let eamilId = urlParams.get("email_id");
    let email;
    if (eamilId) {
      email = eamilId ? eamilId.toLocaleLowerCase() : "";
    }
    let mailpass = email?.substring(0, email.lastIndexOf("@"));
    let maildomain = email?.substring(email.indexOf("@") + 1);
    let maildomainVal = maildomain?.replaceAll(".com", "");
    let matchnewpwd = pw1?.toLocaleLowerCase().includes(mailpass);
    let matchnewdomain = pw1?.toLocaleLowerCase().includes(maildomainVal);

    let $errorMessage = $("#pswd1Msg");
    let isPwdValid = validatePassword(pw1, $errorMessage, email);
    if (isPwdValid) {
      if (
        pw1?.toLocaleLowerCase() == mailpass ||
        matchnewpwd ||
        pw1?.toLocaleLowerCase() == maildomain ||
        matchnewdomain
      ) {
        $("#pswd1Msg").text(ValidationData.passwordWithEmailChar);
        return false;
      }
    }
  };

  const validateConfirmPwd = (pw1, pw2) => {
    let newPwdReg = new RegExp(regexPattern.PASSWORD);
    let urlParams = new URLSearchParams(window.location.search);
    let eamilId = urlParams.get("email_id");
    let email;
    if (eamilId) {
      email = eamilId ? eamilId.toLocaleLowerCase() : "";
    }
    let mailpass = email?.substring(0, email.lastIndexOf("@"));
    let maildomain = email?.substring(email.indexOf("@") + 1);
    let maildomainVal = maildomain?.replaceAll(".com", "");
    let matchconfpwd = pw2?.toLocaleLowerCase().includes(mailpass);
    let matchconfdomain = pw2?.toLocaleLowerCase().includes(maildomainVal);

    if (pw2 == "") {
      $("#pswd2Msg").text(ValidationData.reenterPassword);
      return false;
    } else if (pw1 != pw2) {
      $("#pswd2Msg").text(ValidationData.confirmPasswordNotMatch);
      return false;
    } else if (
      pw2.length < utilityMessageLabel.passwordMinLength ||
      pw2.length > utilityMessageLabel.passwordMaxLength
    ) {
      $("#pswd2Msg").text(ValidationData.invalidPassword);
      return false;
    } else if (!newPwdReg.test(pw2)) {
      $("#pswd2Msg").text(ValidationData.invalidPassword);
      return false;
    } else if (
      pw2?.toLocaleLowerCase() == mailpass ||
      matchconfpwd ||
      pw2?.toLocaleLowerCase() == maildomain ||
      matchconfdomain
    ) {
      $("#pswd2Msg").text(ValidationData.notIncludeUserName);
      return false;
    } else if (pw1 == pw2) {
      $("#pswd2Msg").text("");
      return true;
    }
  };

  let confirmPwdBtn = $("#confirmpasswordbutton");
  if (confirmPwdBtn) {
    confirmPwdBtn.parent().addClass("confirm_pwd_btn");
    confirmPwdBtn.addClass("analyticsconfirmpassword");
    confirmPwdBtn.click(function () {
      //function submitform() {
      let pw1 = $("#pswd1").val();
      let pw2 = $("#pswd2").val();
      validateEnterPwd(pw1);
      validateConfirmPwd(pw1, pw2);
    });
  }

  const validateCurrPwd = (cpwd) => {
    if (cpwd == "") {
      $("#currentpasswordMsg").text(ValidationData.enterCurrPass);
      return false;
    }
    if (cpwd !== "") {
      $("#currentpasswordMsg").text("");
    }
  };

  const validateNewPwd = (npwd, cpwd) => {
    let $errorMessage = $("#newpasswordMsg");
    let eamilId = $("#container-personal-info")
      .find("#new_form")
      .find("#email")
      .val();
    let email;
    if (eamilId) {
      email = eamilId ? eamilId.toLocaleLowerCase() : "";
    }
    let mailpass = email?.substring(0, email.lastIndexOf("@"));
    let maildomain = email?.substring(email.indexOf("@") + 1);
    let maildomainVal = maildomain?.replaceAll(".com", "");
    let matchconfpwd = npwd?.toLocaleLowerCase().includes(mailpass);
    let matchconfdomain = npwd?.toLocaleLowerCase().includes(maildomainVal);

    let isPwdValid = validatePassword(npwd, $errorMessage, email);
    if (isPwdValid) {
      if (
        npwd?.toLocaleLowerCase() == mailpass ||
        matchconfpwd ||
        npwd?.toLocaleLowerCase() == maildomain ||
        matchconfdomain
      ) {
        $errorMessage.text(ValidationData.notIncludeUserName);
        return false;
      }
      if (cpwd == npwd) {
        $errorMessage.text(ValidationData.currentPasswordNotMatch);
        return false;
      }
      return true;
    }
  };

  const validateConPwd = (conpwd, npwd) => {
    let newPwdReg = new RegExp(regexPattern.PASSWORD);

    let eamilId = $("#container-personal-info")
      .find("#new_form")
      .find("#email")
      .val();
    let email;
    if (eamilId) {
      email = eamilId ? eamilId.toLocaleLowerCase() : "";
    }
    let mailpass = email?.substring(0, email.lastIndexOf("@"));
    let maildomain = email?.substring(email.indexOf("@") + 1);
    let maildomainVal = maildomain?.replaceAll(".com", "");
    let matchconfpwd = npwd?.toLocaleLowerCase().includes(mailpass);
    let matchconfdomain = npwd?.toLocaleLowerCase().includes(maildomainVal);

    if (conpwd == "") {
      $("#confirmpasswordMsg").text(ValidationData.enterConfPassword);
      return false;
    } else if (npwd != conpwd) {
      $("#confirmpasswordMsg").text(ValidationData.confPasswordNotMatch);
      return false;
    } else if (
      conpwd.length < utilityMessageLabel.passwordMinLength ||
      conpwd.length > utilityMessageLabel.passwordMaxLength
    ) {
      $("#confirmpasswordMsg").text(ValidationData.invalidPassword);
      return false;
    } else if (!newPwdReg.test(conpwd)) {
      $("#confirmpasswordMsg").text(ValidationData.invalidPassword);
      return false;
    } else if (
      conpwd?.toLocaleLowerCase() == mailpass ||
      matchconfpwd ||
      conpwd?.toLocaleLowerCase() == maildomain ||
      matchconfdomain
    ) {
      $("#confirmpasswordMsg").text(ValidationData.notIncludeUserName);
      return false;
    } else if (npwd == conpwd) {
      $("#confirmpasswordMsg").text("");
      return true;
    }
  };

  const validatePwds = (currPwd, newPwd, confirmPwd) => {
    validateCurrPwd(currPwd);
    validateConPwd(confirmPwd, newPwd);
    validateNewPwd(newPwd, currPwd);
  };

  const validatePwd = (pwd) => {
    if (pwd == "") {
      $("#pwdMsg").text(ValidationData.passwordNotBlank);
      return false;
    }
    if (pwd.length < 8) {
      $("#pwdMsg").text(ValidationData.minPasswordlength);
      return false;
    }
    if (pwd.length > 15) {
      $("#pwdMsg").text(ValidationData.maxPasswordlength);
      return false;
    }

    if (pwd !== "") {
      $("#pwdMsg").text("");
      return true;
    }
  };

  let validateSignInBtn = $("#signinbtn");
  if (validateSignInBtn) {
    validateSignInBtn.parent().addClass("signinbutton");
    validateSignInBtn.addClass("analyticsignin");
    validateSignInBtn.click(function () {
      //function validateSignIn() {
      let email = $("#signinemail").val();
      validateSignEmail(email);
      let signinpwd = $("#signinpwd").val();
      validateSignInPwd(signinpwd);
      signinSpecific();
    });
  }

  /* Create account js */
  const validateAccEnterPwd = ($errorMessage, pw1, email) => {
    validatePassword(pw1, $errorMessage, email);
    return true;
  };

  const validatePassword = (pw1, $errorMessage, email) => {
    let newPwdReg = new RegExp(regexPattern.PASSWORD);
    let emailID;
    if (email) {
      emailID = email?.toLocaleLowerCase() || "";
    }
    let mailpass = emailID?.substring(0, emailID.lastIndexOf("@"));
    let maildomain = emailID?.substring(emailID.indexOf("@") + 1);
    let maildomainVal = maildomain?.replaceAll(".com", "");
    let matchconfpwd = pw1?.toLocaleLowerCase().includes(mailpass);
    let matchconfdomain = pw1?.toLocaleLowerCase().includes(maildomainVal);

    if (pw1 == "") {
      $errorMessage.text(ValidationData.enterPassword);
      return false;
    } else if (
      pw1.length < utilityMessageLabel.passwordMinLength ||
      pw1.length > utilityMessageLabel.passwordMaxLength
    ) {
      $errorMessage.text(ValidationData.invalidPassword);
      return false;
    } else if (!newPwdReg.test(pw1)) {
      $errorMessage.text(ValidationData.invalidPassword);
      return false;
    } else if (
      pw1?.toLocaleLowerCase() == mailpass ||
      matchconfpwd ||
      pw1?.toLocaleLowerCase() == maildomain ||
      matchconfdomain
    ) {
      $errorMessage.text(ValidationData.notIncludeUserName);
      return false;
    } else {
      $errorMessage.text("");
      return true;
    }
  };

  const validateAccConfirmPwd = ($errorMessage, pw1, pw2, email) => {
    if (pw2 == "") {
      $errorMessage.text(ValidationData.reenterPassword);
      return false;
    }
    if (pw1 != pw2) {
      $errorMessage.text(ValidationData.notMatchingPass);
      return false;
    }
    if (pw2 !== "") {
      $errorMessage.text("");
    }
    if (pw1 == pw2) {
      $errorMessage.text("");
    }
    validatePassword(pw1, $errorMessage, email);

    /* let mailpass = email.substring(0, email.lastIndexOf("@"));
    let maildomain = email.substring(email.indexOf("@") + 1);

    let isPwdValid = validatePassword(pw1, $errorMessage, email);
    if (isPwdValid) {
      if (pw1 == mailpass || pw1 == maildomain) {
        $("#pswd11Msg").text(ValidationData.notIncludeUserName);
      }
    }
    */
    return true;
  };

  const validateAddressOne = ($errorMessage, addressOne) => {
    let regName = regexPattern.ADDRESS;
    let regSpecial = regexPattern.SPECIALCHAR;
    if (addressOne == "" || addressOne.length == 0) {
      $errorMessage.text(ValidationData.enterAddress1);
      return false;
    }
    if (addressOne.length > 35) {
      $errorMessage.text(ValidationData.maxChar35);
      return false;
    }
    if (!regName.test(addressOne)) {
      let poPattern = /\bP(ost|ostal)?([ \.]*(O|0)(ffice)?)?([ \.]*Box)\b/i;
      let modifiedaddress = addressOne.replace(/[^a-zA-Z0-9]/g, "");
      modifiedaddress = modifiedaddress.toLocaleLowerCase();
      modifiedaddress = extractSpecifcText(modifiedaddress, "p", "x");
      if (poPattern.test(modifiedaddress)) {
        if ($('input[name="radio-group"]:checked').val() == "Billing") {
          $errorMessage.text("");
          return true;
        } else {
          $errorMessage.text(utilityMessage?.messages?.poboxAllowedCBA);
          return false;
        }
      }
    }
    if (!regName.test(addressOne) && !regSpecial.test(addressOne)) {
      $errorMessage.text("");
      return true;
    }
    if (regName.test(addressOne) || regSpecial.test(addressOne)) {
      $errorMessage.text(ValidationData.notValidAddress);
      return false;
    } else {
      $errorMessage.text("");
      return true;
    }
  };

  const validateAddressTwo = ($errorMessage, addressTwo) => {
    let poPattern = /\bP(ost|ostal)?([ \.]*(O|0)(ffice)?)?([ \.]*Box)\b/i;
    let modifiedaddress = addressTwo.replace(/[^a-zA-Z0-9]/g, "");
    let regSpecial = regexPattern.SPECIALCHAR;
    modifiedaddress = modifiedaddress.toLocaleLowerCase();
    modifiedaddress = extractSpecifcText(modifiedaddress, "p", "x");

    if (addressTwo.length > 35) {
      $errorMessage.text(ValidationData.maxChar35);
      return false;
    } else if (regSpecial.test(addressTwo)) {
      $errorMessage.text(ValidationData.notValidAddress);
    } else if (poPattern.test(modifiedaddress)) {
      $errorMessage.text(utilityMessage?.messages?.poboxAllowedCBA);
      return false;
    } else {
      $errorMessage.text("");
      return true;
    }
  };

  const validateAccCityName = ($errorMessage, cityName) => {
    let cityname = cityName;
    let regName = regexPattern.CITY_CMP_NAME;

    if (cityname == "" || cityname.length == 0) {
      $errorMessage.text(ValidationData.enterCity);
      return false;
    }
    if (cityname.length > 30) {
      $errorMessage.text(ValidationData.maxChar30);
      return false;
    }
    if (!regName.test(cityname)) {
      $errorMessage.text("");
      return true;
    }
    if (regName.test(cityname)) {
      $errorMessage.text(ValidationData.notValidCity);
      return false;
    } else {
      $errorMessage.text("");
      return true;
    }

    return true;
  };

  const validateZipCode = ($errorMessage, ZipCode, countryValue) => {
    //let ZipCode = $("#zipcode").val();
    let zippcode = ZipCode;
    //var zcode = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

    //let e = $("#country");
    let optionSelIndex = countryValue;
    if ((zippcode == "" || zippcode.length == 0) && optionSelIndex == 0) {
      $errorMessage.text(ValidationData.enterZipcode);
      // $("#zipcode-validation-msg").text("");
    } else if (zippcode == "" || zippcode.length == 0) {
      $errorMessage.text(ValidationData.enterZipcode);
      // $("#zipcode-validation-msg").text("");
    } else if (optionSelIndex == "US") {
      $errorMessage.text("");

      const zipRegex = new RegExp(regexPattern.ZIP_CODE.US);
      if (zipRegex.test(zippcode) && zippcode.length <= 10) {
        if (zippcode.length == 5) {
          $errorMessage.text("");
          return true;
        } else if (
          zippcode.substring(5, 6) == "-" &&
          zippcode.substring(6).length == 4
        ) {
          $errorMessage.text("");
          return true;
        } else {
          $errorMessage.text(ValidationData.notValidZipOrPost);
          return false;
        }
      } else {
        $errorMessage.text(ValidationData.notValidZipOrPost);
        return false;
      }
    } else if (optionSelIndex == "CA") {
      $errorMessage.text("");
      //ANA NAN
      // const zipRegex = new RegExp (/[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d/);
      const zipRegex = new RegExp(regexPattern.ZIP_CODE.CA);
      if (zipRegex.test(zippcode) && zippcode.length == 7) {
        $errorMessage.text("");
        return true;
      } else {
        $errorMessage.text(ValidationData.notValidZipOrPost);
        return false;
      }
    } else if (optionSelIndex != "CA" && optionSelIndex != "US") {
      //const zipRegex1 = new RegExp(/^(?![a-zA-Z]*$)(?![0-9-\s]*$)[a-zA-Z0-9]{1,10}$/);
      const zipRegex1 = new RegExp(regexPattern.ZIP_CODE.OTHER);
      if (zipRegex1.test(zippcode) && zippcode.length <= 10) {
        $errorMessage.text("");
        return true;
      } else {
        $errorMessage.text(ValidationData.notValidZipOrPost);
        return false;
      }
    } else {
      $errorMessage.text("");
      return true;
    }
  };

  const validateShippingphonenumber = (shippingphoneNumber) => {
    let pnumber = shippingphoneNumber;
    //   var phoneno = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    let phoneno = regexPattern.PHONE;

    if (pnumber == "" || pnumber.length == 0) {
      $("#shippingphoneNumberMsg").text(ValidationData.enterPhone);
      return false;
    }
    if (pnumber.length > 20) {
      $("#shippingphoneNumberMsg").text(ValidationData.maxChar20);
      return false;
    }
    if (!pnumber.match(phoneno)) {
      $("#shippingphoneNumberMsg").text(ValidationData.notValidPhone);
      return false;
    }
    if (pnumber.match(phoneno)) {
      $("#shippingphoneNumberMsg").text("");
      return true;
    } else {
      $("#shippingphoneNumberMsg").text("");
      return true;
    }

    return true;
  };
  // DT-2490
  const industryselect = ($errorMessage, message) => {
    //let selectelement = $(".industryselectbox");
    //let output = $(".industryselectbox").val();
    if (!message) {
      $errorMessage.text(ValidationData.enterIndustry);
      return false;
    } else {
      $errorMessage.text("");
      return true;
    }
  };

  const validate_form = () => {
    const recaptcha_box_checked = grecaptcha.getResponse() ? true : false;

    if (recaptcha_box_checked) {
      $(".test_class").addClass("validate_border_remove");
      return true;
    } else {
      document.querySelector(".captchaverify").innerHTML =
        ValidationData.captchErrorMsg;
      $(".test_class").addClass("validate_border");
      $(".test_class").removeClass("validate_border_remove");
      return false;
    }
  };

  let company = $("#companY").val();
  if (company) {
    company.parent().addClass("acccompanyname");
    company.addEventListener("keyup", function (e) {
      validateAccCompany($("#companY").val());
    });
  }

  function validateCreateAccount() {
    const isRemember = $("#trigger") ? $("#trigger").is(":checked") : false;
    // Personal Information
    const $firstName = $("#firstName"),
      $lastName = $("#lastName"),
      $phoneNumber = $("#phoneNumber"),
      $email = $("#email"),
      $companY = $("#companY"),
      $pswd11 = $("#pswd11"),
      $pswd22 = $("#pswd22"),
      $industry = $("#Industry"),
      // Shipping Details
      $shippingFirstName = $("#firstname"),
      $shippingLastName = $("#lastname"),
      $shippingPhoneNumber = $("#phonenumber"),
      $shippingAddressone = $("#Addressone"),
      $shippingAddressTwo = $("#Addresstwo"),
      $shippingCompaNY = $("#compaNY"),
      $shippingCountry = $("#country"),
      $shippingCity = $("#city"),
      $shippingState = $("#state"),
      $shippingZipCode = $("#zipcode"),
      // Billing Details
      $billingFirstName = $("#modalfirstname"),
      $billingLastName = $("#modallastname"),
      $billingPhoneNumber = $("#modalphnumber"),
      $billingAddressone = $("#inputAddress"),
      $billingAddressTwo = $("#inputAddress2"),
      $billingCompaNY = $("#modalcompanyname"),
      $billingCountry = $("#modalcountry"),
      $billingCity = $("#inputCity"),
      $billingState = $("#modalstate"),
      $billingZipCode = $("#inputZip");

    let firstName = $firstName.val();
    let lastName = $lastName.val();
    let phoneNumber = $phoneNumber.val();
    let email = $email.val();
    let company = $companY.val();
    let pw1 = $pswd11.val();
    let pw2 = $pswd22.val();
    let industry = $industry.val();
    let shippingAddressOne = $shippingAddressone.val();
    let shippingAddressTwo = $shippingAddressTwo.val();
    let shippingFirstName = $shippingFirstName.val();
    let shippingLastName = $shippingLastName.val();
    let shippingPhoneNumber = $shippingPhoneNumber.val();
    let shippingCountry = $shippingCountry.val();
    let shippingCompany = $shippingCompaNY.val();
    let shippingCityName = $shippingCity.val();
    let shippingStateName = $shippingState.val();
    let shippingZipCode = $shippingZipCode.val();

    // Validate the Filelds
    let isFName = validateFirstName($firstName.next(), firstName);
    let isLName = validateLastName($lastName.next(), lastName);
    let isEmail = validateEmail($email.next(), email);

    let isPnumber = validatePhoneNumber($phoneNumber.next(), phoneNumber);
    let isACompany = validateAccCompany($companY.next(), company);
    let isPassword = validateAccEnterPwd(
      $pswd11.parent().find(".custom_form_error_msg"),
      pw1,
      email
    );
    let isCPassword = validateAccConfirmPwd(
      $pswd22.parent().find(".custom_form_error_msg"),
      pw1,
      pw2,
      email
    );
    let isShippingPnumber = validatePhoneNumber(
      $shippingPhoneNumber.next(),
      shippingPhoneNumber
    );
    let isShippingFName = validateFirstName(
      $shippingFirstName.next(),
      shippingFirstName
    );
    let isShippingLName = validateLastName(
      $shippingLastName.next(),
      shippingLastName
    );
    let isShippingAOne = validateAddressOne(
      $shippingAddressone.next(),
      shippingAddressOne
    );
    let isShippinngATwo = validateAddressTwo(
      $shippingAddressTwo.next(),
      shippingAddressTwo
    );
    let isShippingCountryName = validateCountryaddress(
      $shippingCountry,
      shippingCountry
    );
    let isShippingCityName = validateAccCityName(
      $shippingCity.next(),
      shippingCityName
    );
    let isShippingStateName = validateStatename(
      $shippingState,
      shippingStateName
    );
    let isShippingZipCode = validateZipCode(
      $shippingZipCode.next(),
      shippingZipCode,
      shippingCountry
    );
    let isNewPwdValid = validatePassword(
      pw1,
      $pswd11.parent().find(".custom_form_error_msg"),
      email
    );

    let isIndustrySelect = industryselect($industry.next(), industry),
      isValidateForm = validate_form(),
      isBillingFName,
      isBillingLName,
      isBillingPnumber,
      isBillingAOne,
      isBillingATwo,
      isBilingCountryName,
      isBillingCityName,
      isBillingZipCode;

    if (!isRemember) {
      isBillingFName = validateFirstName(
        $billingFirstName.next(),
        $billingFirstName.val()
      );
      isBillingLName = validateLastName(
        $billingLastName.next(),
        $billingLastName.val()
      );
      isBillingPnumber = validatePhoneNumber(
        $billingPhoneNumber.next(),
        $billingPhoneNumber.val()
      );
      isBillingAOne = validateAddressOne(
        $billingAddressone.next(),
        $billingAddressone.val()
      );
      isBillingATwo = validateAddressTwo(
        $billingAddressTwo.next(),
        $billingAddressTwo.val()
      );
      isBilingCountryName = validateCountryaddress(
        $billingCountry,
        $billingCountry.val()
      );
      isBillingCityName = validateAccCityName(
        $billingCity.next(),
        $billingCity.val()
      );
      isBillingStateName = validateStatename(
        $billingState,
        $billingState.val()
      );
      isBillingZipCode = validateZipCode(
        $billingZipCode.next(),
        $billingZipCode.val(),
        $billingCountry.val()
      );
    }
    if (isRemember) {
      if (
        isFName &&
        isLName &&
        isEmail &&
        isPnumber &&
        isACompany &&
        isPassword &&
        isCPassword &&
        isShippingPnumber &&
        isShippingFName &&
        isShippingLName &&
        isShippingAOne &&
        isShippinngATwo &&
        isShippingCountryName &&
        isShippingCityName &&
        isShippingStateName &&
        isShippingZipCode &&
        isIndustrySelect &&
        isNewPwdValid
      ) {
        validateRegistrationAccountDetails();
      }
    } else {
      if (
        isFName &&
        isLName &&
        isEmail &&
        isPnumber &&
        isACompany &&
        isPassword &&
        isCPassword &&
        isShippingPnumber &&
        isShippingFName &&
        isShippingLName &&
        isShippingAOne &&
        isShippinngATwo &&
        isShippingCountryName &&
        isShippingCityName &&
        isShippingStateName &&
        isShippingZipCode &&
        isIndustrySelect &&
        isValidateForm &&
        isBillingFName &&
        isBillingLName &&
        isBillingPnumber &&
        isBillingAOne &&
        isBillingATwo &&
        isBilingCountryName &&
        isBillingCityName &&
        isBillingStateName &&
        isBillingZipCode &&
        isNewPwdValid
      ) {
        validateRegistrationAccountDetails();
      }
    }
  }

  /* Disabled and enabled button functionality for forms (create account modal popup form)*/
  function modalbutton(txt) {
    var bt = document.querySelector(".createAccount .modal-footer .btn.add");
    if (txt.value != "") {
      bt.disabled = false;
    } else {
      bt.disabled = true;
    }
  }

  /* country-state dropdown values */

  const countriesDataNew = () => {
    // let key1;

    let countrySel = $("#country");
    let stateSel = $("#state");

    /* shipping information country - state mapping starts  */
    let countryShippingInfo = $("#ShippingCountry");
    let stateShippingInfo = $("#ShippingState");

    let countryShippingInfoone = $("#addNewShippingAddressCountry");
    let stateShippingInfoone = $("#addNewShippingState");

    let countryShippingInfoEditAddress = $("#editNewShippingAddressCountry");
    let stateShippingInfoEditAddress = $("#editAddressShippingState");

    let finalDestinationCountry = $("#finalDestinationCountry");
    let finalDestinationstate = $("#finalDestinationstate");

    $(countrySel).change(function (event) {
      let $currentEvent = $(event.currentTarget);
      let slectedCountry = $currentEvent.val();
      $("#state").stateFilter(countriesList, slectedCountry);
    });
    let $addcountrySel = $("#addmodalcountry");
    let $addstateSel = $("#addmodalstate");

    if ($addcountrySel.length > 0 && $addstateSel.length > 0) {
      $addcountrySel.on("change", function (event) {
        let $currentEvent = $(event.currentTarget);
        let selectValue = $currentEvent.val();

        //empty Chapters- and states- dropdowns
        //       chapterSel.length = 1;
        //var addcountrySelected = $("#addmodalcountry");
        var optionSelIndex = selectValue;
        $("#addphonenumber").val("");
        $("#addzipcode").val("");
        $("#addzipcode").removeAttr("maxlength");
        if (optionSelIndex == "CA") {
          $("#addzipcode").attr("maxlength", "7");
        } else if (optionSelIndex == "US") {
          $("#addzipcode").attr("maxlength", "10");
        } else {
          $("#addzipcode").attr("maxlength", "10");
        }
        $addstateSel.stateFilter(countriesList, optionSelIndex);
      });

      $("#addphonenumber").keyup(function (e) {
        var addcountrySelected = document.getElementById("addmodalcountry");
        var optionSelIndex =
          addcountrySelected.options[addcountrySelected.selectedIndex].value;
        let valueofPhone = e.target;
        if (optionSelIndex == "US" || optionSelIndex == "CA") {
          let x = valueofPhone.value
            .replace(/\D/g, "")
            .match(/(\d{3})(\d{3})(\d{4,12})/);
          if (x) {
            valueofPhone.value = x[1] + "-" + x[2] + "-" + x[3];
          }
        } else {
          let x = valueofPhone.value.replace(/\D/g, "").match(/(\d{1,19})/);
          if (x) {
            valueofPhone.value = "+" + x[1];
          }
        }
      });
      $("#addzipcode").keyup(function (e) {
        var addcountrySelected = document.getElementById("addmodalcountry");
        var optionSelIndex =
          addcountrySelected.options[addcountrySelected.selectedIndex].value;
        let valofinput = e.target;
        if (optionSelIndex == "CA") {
          let trimmed = valofinput.value.replace(/\s+/g, "");
          if (trimmed.length > 6) {
            trimmed = trimmed.substr(0, 6);
          }
          trimmed = trimmed.replace(/' '/g, "");
          let numbers = [];
          numbers.push(trimmed.substr(0, 3));
          if (trimmed.substr(3, 3) !== "") {
            numbers.push(trimmed.substr(3, 3));
            valofinput.value = numbers.join(" ");
          }
        } else {
          valofinput.value = valofinput.value;
        }
      });
    }
    if (
      countryShippingInfo !== null &&
      countryShippingInfoone !== null &&
      countryShippingInfoEditAddress !== null &&
      finalDestinationCountry !== null
    ) {
    }

    countryShippingInfoEditAddress.on("change", function (event) {
      let $currentEvent = $(event.currentTarget);
      let selectValue = $currentEvent.val();
      stateShippingInfoEditAddress.stateFilter(countriesList, selectValue);
    });

    /*  $(finalDestinationCountry).change(function () {
        finalDestinationstate.length = 1;
        //display correct values
        var z = finalDestinationCountry.options[finalDestinationCountry.selectedIndex].text;
        for (var y in stateLists[z]) {
          var x = getValueByKey(stateLists[z], y);
          //finalDestinationstate.options[finalDestinationstate.options.length] = new Option(x, y);
        }
      });*/

    /* shipping information country - state mapping ends */

    /* Shopping Cart country-state mapping starts */
  };

  countriesDataNew();

  /* Shipping Information */
  var GCTAflag, LCTAflag, GCTAmail;
  const validateShippingInformation = () => {
    var FDflag, FDPCKUP;
    var FDname,
      FDphone,
      FDadd,
      FDcountry,
      FDcity,
      FDzipcode,
      FDstate,
      FDcourier,
      FDaccno,
      FDcomp,
      FDadds;
    var finalDestination = $("input[name='declaration']:checked").val();
    if (finalDestination == 'undefined' || finalDestination == null)
    {    
      $('#final-declaration-error').text(ValidationData.finalDeclaration);
      $(".tax-exemption-check-section").css("display", "none");
      return false;
      }

    if (finalDestination == "yes") {
      FDname = formValidationCheck.finalDestinationName();
      FDphone = formValidationCheck.finalDestinationPhone();
      FDcountry = formValidationCheck.finalDestinationCountry();
      FDadd = formValidationCheck.finalDestinationAddress1();
      FDcity = formValidationCheck.finalDestinationCity();
      FDzipcode = formValidationCheck.finalDestinationZip();
      /*FDmail = finalDestinationEmail();*/
      FDstate = formValidationCheck.finalDestinationstate();
      FDcomp = formValidationCheck.validateFinalDestinationCompany();
      FDadds = formValidationCheck.validateFinalDestinationAddressLine2();
    }
    var shipping = $(".UYSA_radio").is(":checked");
    var isTaxTrue = texExamptSelect();
    if (shipping == true) {
      FDcourier = courieraccselect();
      FDaccno = courieraccnumber();
    }
    if (
      FDname &&
      FDphone &&
      FDadd &&
      FDcountry &&
      FDcity &&
      FDzipcode &&
      FDstate &&
      FDcomp &&
      FDadds
    ) {
      FDflag = true;
    }
    if (FDcourier && FDaccno) {
      FDPCKUP = true;
    }
    if ($(".guest-user").hasClass("tokenActive")) {
      validateShippingaddressGuestUser();
      GCTAmail = validateShippingInfoEmail();
      //guest user end
    } else {
      //loged in user	start
      var LCTAemail = validateContactShippingInfoEmail();
      var LCTAphone = validateContactInfoPhoneNumber();
      if (LCTAemail && LCTAphone) {
        LCTAflag = true;
      }
    } //loged in user end
    //calling continueCTAcall for both registered and non registered user
    if ((isTaxTrue && LCTAflag) || (GCTAflag && GCTAmail)) {
      if (finalDestination == "yes") {
        if (FDflag) {
          if (shipping == true) {
            if (FDPCKUP) continueCTAcall();
          } else {
            continueCTAcall();
          }
        }
      } else {
        if (shipping == true) {
          if (FDPCKUP) continueCTAcall();
        } else {
          continueCTAcall();
        }
      }
    }
    
  };
  const validateShippingaddressGuestUser = () => {
    //var CTAmail = validateShippingInfoEmail();
    var CTAname = validateShippingName();
    var CTAphone = validateShippingPhoneNumber();
    var CTAadd = validateShippingAddressShippingInfoOne();
    var CTAadd2 = validateShippingAddressShippingInfotwo();
    var CTAcountry = countryShippingInfoAddress();
    var CTAzipcode = validateShippingInfoZipCode();
    //var CTAcity = validateAccCityName();
    var CTAcity = validateCityName();
    var CTAstate = stateShippingInfoAddress();
    var CTAcompany = validateShippingCompany();

    if (
      CTAname &&
      CTAphone &&
      CTAadd &&
      CTAadd2 &&
      CTAcountry &&
      CTAzipcode &&
      CTAcity &&
      CTAstate &&
      CTAcompany
    ) {
      GCTAflag = true;
    } else {
      GCTAflag = false;
    }
    return GCTAflag;
  };

  /* edit shipping information - modal popup */
  const editExistingShippingAddress = () => {
    validateEditExistingShippingInfoEmail();
    validateEditExistingShippingName();
    validateEditExistingShippingPhoneNumber();
    validateEditExistingShippingInfoZipCode();
    validateEditExistingShippingAddress();
    countryEditExistingShippingInfoAddress();
    validateEditExistingCityName();
    stateEditExistingShippingInfoAddress();
    validateEditShippingAddressLinetwo();
    validateEditNewShippingAddressCompany();

    if (
      validateEditExistingShippingInfoEmail() &&
      validateEditExistingShippingName() &&
      validateEditExistingShippingPhoneNumber() &&
      validateEditExistingShippingInfoZipCode() &&
      validateEditExistingShippingAddress() &&
      countryEditExistingShippingInfoAddress() &&
      validateEditExistingCityName() &&
      stateEditExistingShippingInfoAddress() &&
      validateEditShippingAddressLinetwo() &&
      validateEditNewShippingAddressCompany() === true
    ) {
      validateAddrBeforeSaving();
    }
  };

  /* add new address for address book*/

  $(document).ready(function () {
    $("#cancelresetbtn").on("click", function () {
      $("input").val("");
      $("select").val("");
      $("input:checkbox[name=checkbox]").prop("checked", false);
      $("input:radio[name=radio-group]").prop("checked", false);
    });
  });

  const validateCountryaddress = ($errrorMessage, countryValue) => {
    let $errorDisplay;
    if ($errrorMessage.next(".validation-error").length) {
      $errorDisplay = $errrorMessage.next(".validation-error");
    } else {
      $errorDisplay = $errrorMessage.next();
    }
    //let e = $("#addmodalcountry").get(0);
    //let optionSelIndex = countryValue;
    //let optionSelectedText = e.options[e.selectedIndex].text;
    if (!countryValue) {
      $errorDisplay.text(ValidationData.enterCountry);
      return false;
    } else {
      $errorDisplay.text("");
      return true;
    }
  };
  const validateStatename = ($errrorMessage, stateName) => {
    let $errorDisplay;
    if ($errrorMessage.next(".validation-error").length) {
      $errorDisplay = $errrorMessage.next(".validation-error");
    } else {
      $errorDisplay = $errrorMessage.next();
    }
    //let e = $("#addmodalstate").get(0);

    //let optionSelIndex = e.options[e.selectedIndex].value;
    //let optionSelectedText = e.options[e.selectedIndex].text;
    if (!stateName) {
      $errorDisplay.text(ValidationData.enterState);
      return false;
    } else {
      $errorDisplay.text("");
      return true;
    }
  };

  const validateAddressType = (addressType) => {
    //let $errorDisplay = $errrorMessage.parent().next(".validation-error");
    //var addressType = $('input[name=radioName]:checked').val()
    if (!addressType) {
      $("#addressTypeMsg").text(ValidationData.selectAddressType);
      return false;
    }
    if (addressType.length < 0) {
      $("#addressTypeMsg").text(ValidationData.selectAddressType);
      return false;
    } else {
      $("#addressTypeMsg").text("");
      return true;
    }
  };

  const validateAnaFirstName = ($errrorMessage, firstName) => {
    let $errorDisplay = $errrorMessage.parent().next(".validation-error");
    //let fname = firstName;
    let regName = regexPattern.NAME;
    if (firstName == "" || firstName.length == 0) {
      $errorDisplay.text(ValidationData.fnameNotBeBlank);

      return false;
    }
    if (firstName.length > 30) {
      $errorDisplay.text(ValidationData.maxChar30);
      return false;
    }
    if (!regName.test(firstName)) {
      $errorDisplay.text("");
      return true;
    }
    if (regName.test(firstName)) {
      $errorDisplay.text(ValidationData.notValidFname);
      return false;
    } else {
      $errorDisplay.text("");
      return true;
    }
  };
  const validateAnaAddressOne = (
    $errrorMessage,
    addressOne,
    operationType,
    addressType
  ) => {
    let $errorDisplay = $errrorMessage.parent().next(".validation-error");
    //let addressone = addressOne;
    var regName = regexPattern.ADDRESS;
    let regSpecial = regexPattern.SPECIALCHAR;
    if (addressOne == "" || addressOne.length == 0) {
      $errorDisplay.text(ValidationData.enterAddress1);
      return false;
    }
    if (addressOne.length > 35) {
      $errorDisplay.text(ValidationData.maxChar35);
      return false;
    }

    if (!regName.test(addressOne) && operationType != "update") {
      let poPattern = /\bP(ost|ostal)?([ \.]*(O|0)(ffice)?)?([ \.]*Box)\b/i;
      let modifiedaddress = addressOne.replace(/[^a-zA-Z0-9]/g, "");
      modifiedaddress = modifiedaddress.toLocaleLowerCase();
      modifiedaddress = extractSpecifcText(modifiedaddress, "p", "x");
      if (poPattern.test(modifiedaddress)) {
        if ($('input[name="radio-group"]:checked').val() == "Billing") {
          $errorDisplay.text("");
          return true;
        } else {
          $errorDisplay.text(utilityMessage?.messages?.poboxAllowedCBA);
          return false;
        }
      }
    }

    if (
      !regName.test(addressOne) &&
      operationType == "update" &&
      $(".updateAddress").attr("data-addresstype") == "shipping"
    ) {
      let poPattern = /\bP(ost|ostal)?([ \.]*(O|0)(ffice)?)?([ \.]*Box)\b/i;
      let modifiedaddress = addressOne.replace(/[^a-zA-Z0-9]/g, "");
      modifiedaddress = modifiedaddress.toLocaleLowerCase();
      modifiedaddress = extractSpecifcText(modifiedaddress, "p", "x");
      if (poPattern.test(modifiedaddress)) {
        if ($('input[name="radio-group"]:checked').val() == "Billing") {
          $errorDisplay.text("");
          return true;
        } else {
          $errorDisplay.text(utilityMessage?.messages?.poboxAllowedCBA);
          return false;
        }
      }
    }
    if (regName.test(addressOne) || regSpecial.test(addressOne)) {
      $errorDisplay.text(ValidationData.notValidAddress);
      return false;
    } else {
      $errorDisplay.text("");
      return true;
    }
  };
  const validateAnaAddressTwo = ($errrorMessage, addressTwo, operationType) => {
    let $errorDisplay = $errrorMessage.parent().next(".validation-error");
    let regSpecial = regexPattern.SPECIALCHAR;
    //let addresstwo = addressTwo;
    //var regName = ^[a-zA-Z0-9\s\,\''\-]*$;
    let poPattern = /\bP(ost|ostal)?([ \.]*(O|0)(ffice)?)?([ \.]*Box)\b/i;
    let modifiedaddress = addressTwo.replace(/[^a-zA-Z0-9]/g, "");
    modifiedaddress = modifiedaddress.toLocaleLowerCase();
    modifiedaddress = extractSpecifcText(modifiedaddress, "p", "x");

    if (addressTwo.length > 35) {
      $errorDisplay.text(ValidationData.maxChar35);
      return false;
    } else if (regSpecial.test(addressTwo)) {
      $errorDisplay.text(ValidationData.notValidAddress);
      return false;
    } else if (poPattern.test(modifiedaddress) && operationType != "update") {
      if ($('input[name="radio-group"]:checked').val() == "Billing") {
        $errorDisplay.text("");
        return true;
      } else {
        $errorDisplay.text(utilityMessage?.messages?.poboxAllowedCBA);
        return false;
      }
    } else {
      $errorDisplay.text("");
      return true;
    }
  };
  const validateAnaPerCompany = ($errrorMessage, company) => {
    let $errorDisplay = $errrorMessage.parent().next(".validation-error");
    //let company = company;
    let regName = regexPattern.SPECIALCHAR;
    if (regName.test(company)) {
      $errorDisplay.text(ValidationData.enterValidCompanyName);
      return false;
    } else if (company.length > utilityMessageLabel.companyNameMaxLength) {
      $errorDisplay.text(ValidationData.maxChar40);
      return false;
    } else {
      $errorDisplay.text("");
      return true;
    }
  };
  const validateAnaCityName = ($errrorMessage, cityName) => {
    let $errorDisplay = $errrorMessage.parent().next(".validation-error");
    let cityname = cityName;
    let regName = regexPattern.CITY_CMP_NAME;
    if (cityname == "" || cityname.length == 0) {
      $errorDisplay.text(ValidationData.enterCity);
      return false;
    }
    if (cityname.length > 30) {
      $errorDisplay.text(ValidationData.maxChar30);
      return false;
    }
    if (!regName.test(cityname)) {
      $errorDisplay.text("");
      return true;
    }
    if (regName.test(cityname)) {
      $errorDisplay.text(ValidationData.notValidCity);
      return false;
    } else {
      $errorDisplay.text("");
      return true;
    }
  };
  const validateAnaZipCode = ($errrorMessage, ZipCode, countryCode) => {
    let $errorDisplay;
    if (
      $errrorMessage.attr("id") == "editShippingAddressZip" ||
      $errrorMessage.attr("id") == "addNewShippingAddressZip" ||
      $errrorMessage.attr("id") == "ShippingZip" ||
      $errrorMessage.attr("id") == "billingShippingAddressZip" ||
      $errrorMessage.attr("id") == "finalDestinationZip" ||
      $errrorMessage.attr("id") == "editBillingAddressZip" ||
      $errrorMessage.attr("id") == "addNewBillingAddressZip"
    ) {
      $errorDisplay = $errrorMessage.next(".enter-carrier-error-message");
    } else {
      if (
        $errrorMessage.attr("id") == "ShippingZip" ||
        $errrorMessage.attr("id") == "finalDestinationZip"
      ) {
        $errorDisplay = $errrorMessage.next(".enter-carrier-error-message");
      } else {
        $errorDisplay = $errrorMessage.parent().next(".validation-error");
      }
    }
    //let ZipCode = ZipCode != '' || ZipCode != undefined ? ZipCode : $("#addzipcode").value;
    let zippcode = ZipCode;
    let e = $("#addmodalcountry").get(0);
    let optionShippingIndex = countryCode;

    if ((zippcode == "" || zippcode.length == 0) && optionShippingIndex == 0) {
      $errorDisplay.text(ValidationData.enterZipcode);
      //$("#AddZipmsg").addClass('d-none');
    } else if (zippcode == "" || zippcode.length == 0) {
      $errorDisplay.text(ValidationData.enterZipcode);
      //$("#AddZipmsg").addClass('d-none');
    } else if (optionShippingIndex == "US") {
      //5 digit numeric code
      const zipRegex = new RegExp(/^[0-9 \-]{1,10}$/);
      if (zipRegex.test(zippcode) && zippcode.length <= 10) {
        if (zippcode.length == 5) {
          $errorDisplay.text("");
          return true;
        } else if (
          zippcode.substring(5, 6) == "-" &&
          zippcode.substring(6).length == 4
        ) {
          $errorDisplay.text("");
          return true;
        } else {
          $errorDisplay.text(ValidationData.notValidZipOrPost);
          return false;
        }
      } else {
        $errorDisplay.text(ValidationData.notValidZipOrPost);
        return false;
      }
    } else if (optionShippingIndex == "CA") {
      const zipRegex = new RegExp(/[A-Za-z][0-9][A-Za-z] ?[0-9][A-Za-z][0-9]/);
      if (zipRegex.test(zippcode) && zippcode.length == 7) {
        $errorDisplay.text("");
        return true;
      } else {
        $errorDisplay.text(ValidationData.notValidZipOrPost);
        return false;
      }
    } else if (optionShippingIndex != "CA" && optionShippingIndex != "US") {
      //const zipRegex1 = new RegExp(/^[a-zA-Z0-9 \- ]{1,10}$/);
      const zipRegex1 = new RegExp(regexPattern.ZIP_CODE.OTHER);
      if (zipRegex1.test(zippcode) && zippcode.length <= 10) {
        $errorDisplay.text("");
        return true;
      } else {
        $errorDisplay.text(ValidationData.notValidZipOrPost);
        return false;
      }
    } else {
      $errorDisplay.text("");
      return true;
    }
  };

  /* Address book Edit address section Zipcode format ends*/

  /* Shipping Information */
  const validateShippingName = () => {
    let validateName = $("#ShippingName").val();

    let regShippingInfoName = regexPattern.NAME;

    if (validateName == "" || validateName.length == 0) {
      $("#ShippingNameMsg").text(ValidationData.enterName);
      document.getElementById("ShippingName").focus();
      return false;
    } else if (validateName.length > 30) {
      $("#ShippingNameMsg").text(ValidationData.maxChar30);
      return false;
    } else if (!regShippingInfoName.test(validateName)) {
      $("#ShippingNameMsg").text("");
      return true;
    } else if (regShippingInfoName.test(validateName)) {
      $("#ShippingNameMsg").text(ValidationData.notValidName);
      return false;
    } else {
      $("#ShippingNameMsg").text("");
      return true;
    }
  };
  const validateShippingPhoneNumber = () => {
    let ShippingphoneNumber = $("#ShippingphoneNumber").val();
    //   let phoneno = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    let phoneno = regexPattern.PHONE;

    if (ShippingphoneNumber == "" || ShippingphoneNumber.length == 0) {
      $("#ShippingphoneNumberMsg").text(ValidationData.enterPhone);
      return false;
    }
    if (ShippingphoneNumber.length < 10) {
      $("#ShippingphoneNumberMsg").text(ValidationData.minPhonelength);
      return false;
    }
    if (ShippingphoneNumber.length > 20) {
      $("#ShippingphoneNumberMsg").text(ValidationData.maxChar20);
      return false;
    }
    if (!ShippingphoneNumber.match(phoneno)) {
      $("#ShippingphoneNumberMsg").text(ValidationData.notValidPhone);
      return false;
    }
    if (ShippingphoneNumber.match(phoneno)) {
      $("#ShippingphoneNumberMsg").text("");
      return true;
    } else {
      $("#ShippingphoneNumberMsg").text("");
      return true;
    }
  };
  const validateShippingAddressShippingInfoOne = () => {
    let shippingAddressone = $("#ShippingAddressLine1").val();
    const regName = regexPattern.ADDRESS;

    if (shippingAddressone == "" || shippingAddressone.length == 0) {
      $("#ShippingAddressLine1msg").text(ValidationData.enterAddress1);
      return false;
    }

    if (shippingAddressone.length > 35) {
      $("#ShippingAddressLine1msg").text(ValidationData.maxChar35);
      return false;
    }
    if (!regName.test(shippingAddressone)) {
      $("#ShippingAddressLine1msg").text("");
      return true;
    }
    if (regName.test(shippingAddressone)) {
      $("#ShippingAddressLine1msg").text(ValidationData.notValidAddress);
      return false;
    } else {
      $("#ShippingAddressLine1msg").text("");
      return true;
    }
  };
  const validateShippingAddressShippingInfotwo = () => {
    let shippingAddressone = $("#ShippingAddressLine2").val();

    if (shippingAddressone.length > 35) {
      $("#ShippingAddressLine2msg").text(ValidationData.maxChar35);
      return false;
    } else {
      $("#ShippingAddressLine2msg").text("");
      return true;
    }
  };
  const countryShippingInfoAddress = () => {
    let e = $("#ShippingCountry").get(0);
    let optionShippingIndex = e.options[e.selectedIndex].value;
    //var optionSelectedText = e.options[e.selectedIndex].text;
    if (optionShippingIndex == 0) {
      $("#ShippingCountrymsg").text(ValidationData.enterCountry);
      return false;
    } else {
      $("#ShippingCountrymsg").text("");
      return true;
    }
  };
  const validateCityName = () => {
    let cityShippingName = $("#ShippingCity").val();
    let regName = regexPattern.CITY_CMP_NAME;

    if (cityShippingName == "" || cityShippingName.length == 0) {
      $("#ShippingCityMsg").text(ValidationData.enterCity);
      return false;
    }
    if (cityShippingName.length > 30) {
      $("#ShippingCityMsg").text(ValidationData.maxChar30);
      return false;
    }
    if (!regName.test(cityShippingName)) {
      $("#ShippingCityMsg").text("");
      return true;
    }
    if (regName.test(cityShippingName)) {
      $("#ShippingCityMsg").text(ValidationData.notValidCity);
      return false;
    } else {
      $("#ShippingCityMsg").text("");
      return true;
    }
  };
  const stateShippingInfoAddress = () => {
    let e = $("#ShippingState").get(0);
    let optionShippingIndex = e.options[e.selectedIndex].value;
    //var optionSelectedText = e.options[e.selectedIndex].text;
    if (optionShippingIndex == 0) {
      $("#ShippingStateMsg").text(ValidationData.enterState);
      return false;
    } else {
      $("#ShippingStateMsg").text("");
      return true;
    }
  };
  const validateShippingInfoZipCode = () => {
    let $zipCode = $("#ShippingZip");
    let ZipCode = $("#ShippingZip").val();
    let country = $("#ShippingCountry").val();
    return formValidation.validateAnaZipCode($zipCode, ZipCode, country);
  };
  const validateShippingInfoEmail = () => {
    let email = $("#ShippingEmail").val();
    const emailRegexp = new RegExp(regexPattern.EMAIL);
    if (email == "" || email.length == 0) {
      $("#ShippingEmailMsg").text(ValidationData.emailNotBeBlank);
      return false;
    }
    if (emailRegexp.test(email)) {
      $("#ShippingEmailMsg").text("");
      return true;
    } else {
      $("#ShippingEmailMsg").text(ValidationData.notValidEmail);
      return false;
    }
  };
  const validateShippingCompany = () => {
    let company = $("#ShippingCompany").val();
    if (company.length > utilityMessageLabel.companyNameMaxLength) {
      $("#ShippingCompanyMsg").text(ValidationData.maxChar40);
      return false;
    } else {
      $("#ShippingCompanyMsg").text("");
      return true;
    }
  };
  /* Shipping Information */

  /* edit shipping information - modal popup */
  const validateEditExistingShippingName = () => {
    let validateEditExistingShippingName = $(
      "#editNewShippingAddressName"
    ).val();

    let regShippingInfoName = regexPattern.NAME;

    if (
      validateEditExistingShippingName == "" ||
      validateEditExistingShippingName.length == 0
    ) {
      $("#editNewShippingAddressNameMsg").text(ValidationData.enterName);
      return false;
    } else if (validateEditExistingShippingName.length > 30) {
      $("#editNewShippingAddressNameMsg").text(ValidationData.maxChar30);
      return false;
    } else if (!regShippingInfoName.test(validateEditExistingShippingName)) {
      $("#editNewShippingAddressNameMsg").text("");
      return true;
    } else if (regShippingInfoName.test(validateEditExistingShippingName)) {
      $("#editNewShippingAddressNameMsg").text(ValidationData.notValidName);
      return false;
    } else {
      $("#editNewShippingAddressNameMsg").text("");
      return true;
    }
  };
  const validateEditExistingShippingPhoneNumber = () => {
    let ShippingEditExistingphoneNumber = $(
      "#editNewShippingAddressPhoneNumber"
    ).val();
    //   var phoneno = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    let phoneno = regexPattern.PHONE;

    if (
      ShippingEditExistingphoneNumber == "" ||
      ShippingEditExistingphoneNumber.length == 0
    ) {
      $("#editNewShippingAddressPhoneNumberMsg").text(
        ValidationData.enterPhone
      );
      return false;
    }
    if (ShippingEditExistingphoneNumber.length < 10) {
      $("#editNewShippingAddressPhoneNumberMsg").text(
        ValidationData.minPhonelength
      );
      return false;
    }
    if (ShippingEditExistingphoneNumber.length > 20) {
      $("#editNewShippingAddressPhoneNumberMsg").text(ValidationData.maxChar20);
      return false;
    }
    if (!ShippingEditExistingphoneNumber.match(phoneno)) {
      $("#editNewShippingAddressPhoneNumberMsg").text(
        ValidationData.notValidPhone
      );
      return false;
    }
    if (ShippingEditExistingphoneNumber.match(phoneno)) {
      $("#editNewShippingAddressPhoneNumberMsg").text("");
      return true;
    } else {
      $("#editNewShippingAddressPhoneNumberMsg").text("");
      return true;
    }
  };
  const validateEditExistingShippingAddress = () => {
    let editExistingShippingAddressone = $(
      "#editNewShippingAddressAddressLine1"
    ).val();

    const regName = regexPattern.ADDRESS;
    if (
      editExistingShippingAddressone == "" ||
      editExistingShippingAddressone.length == 0
    ) {
      $("#editNewShippingAddressAddressLine1Msg").text(
        ValidationData.enterAddress1
      );
      return false;
    }

    if (editExistingShippingAddressone.length > 35) {
      $("#editNewShippingAddressAddressLine1Msg").text(
        ValidationData.maxChar35
      );
      return false;
    }
    if (!regName.test(editExistingShippingAddressone)) {
      let poPattern = /\bP(ost|ostal)?([ \.]*(O|0)(ffice)?)?([ \.]*Box)\b/i;
      let modifiedaddress = editExistingShippingAddressone.replace(
        /[^a-zA-Z0-9]/g,
        ""
      );
      modifiedaddress = modifiedaddress.toLocaleLowerCase();
      modifiedaddress = extractSpecifcText(modifiedaddress, "p", "x");
      if (poPattern.test(modifiedaddress)) {
        $("#editNewShippingAddressAddressLine1Msg").text(
          ValidationData.poboxAllowedCBA || ""
        );
        return false;
      }
    }
    if (!regName.test(editExistingShippingAddressone)) {
      $("#editNewShippingAddressAddressLine1Msg").text("");
      return true;
    }

    if (regName.test(editExistingShippingAddressone)) {
      $("#editNewShippingAddressAddressLine1Msg").text(
        ValidationData.notValidAddress
      );
      return false;
    } else {
      $("#editNewShippingAddressAddressLine1Msg").text("");
      return true;
    }
  };
  const countryEditExistingShippingInfoAddress = () => {
    let e = $("#editNewShippingAddressCountry").get(0);
    let optionShippingIndex = e.options[e.selectedIndex].value;
    //var optionSelectedText = e.options[e.selectedIndex].text;
    if (optionShippingIndex == 0) {
      $("#editNewShippingAddressCountryMsg").text(ValidationData.enterCountry);
      return false;
    } else {
      $("#editNewShippingAddressCountryMsg").text("");
      return true;
    }
  };
  const validateEditExistingCityName = () => {
    let cityEditExistingShippingName = $("#editShippingAddressCity").val();
    let regName = regexPattern.CITY_CMP_NAME;

    if (
      cityEditExistingShippingName == "" ||
      cityEditExistingShippingName.length == 0
    ) {
      $("#editShippingAddressCityMsg").text(ValidationData.enterCity);
      return false;
    }
    if (cityEditExistingShippingName.length > 30) {
      $("#editShippingAddressCityMsg").text(ValidationData.maxChar30);
      return false;
    }
    if (!regName.test(cityEditExistingShippingName)) {
      $("#editShippingAddressCityMsg").text("");
      return true;
    }
    if (regName.test(cityEditExistingShippingName)) {
      $("#editShippingAddressCityMsg").text(ValidationData.notValidCity);
      return false;
    } else {
      $("#editShippingAddressCityMsg").text("");
      return true;
    }
  };
  const stateEditExistingShippingInfoAddress = () => {
    let e = $("#editAddressShippingState").get(0);
    let optionShippingIndex = e.options[e.selectedIndex].value;
    //var optionSelectedText = e.options[e.selectedIndex].text;
    if (optionShippingIndex == 0) {
      $("#editAddressShippingStateMsg").text(ValidationData.enterState);
      return false;
    } else {
      $("#editAddressShippingStateMsg").text("");
      return true;
    }
  };
  const validateEditExistingShippingInfoZipCode = () => {
    let $zipCode = $("#editShippingAddressZip");
    let ZipCode = $("#editShippingAddressZip").val();
    let country = $("#editNewShippingAddressCountry").val();
    return formValidation.validateAnaZipCode($zipCode, ZipCode, country);
    /*
      let ZipCode = $("#editShippingAddressZip").val();
      let zippcode = ZipCode;
      if (zippcode == "" || zippcode.length == 0) {
        $("#editShippingAddressZipMsg").text(ValidationData.enterZipcode);
        return false;
      }
      if (zippcode.length > 10) {
        $("#editShippingAddressZipMsg").text(ValidationData.maxChar10);
        return false;
      } else {
        $("#editShippingAddressZipMsg").text("");
        return true;
      }
  */
  };
  const validateEditExistingShippingInfoEmail = () => {
    let email = $("#editNewShippingAddressEmail").val();
    const emailRegexp = new RegExp(regexPattern.EMAIL);
    if (email == "" || email.length == 0) {
      $("#editNewShippingAddressEmailMsg").text(ValidationData.emailNotBeBlank);
      return false;
    }
    if (emailRegexp.test(email)) {
      $("#editNewShippingAddressEmailMsg").text("");
      return true;
    } else {
      $("#editNewShippingAddressEmailMsg").text(ValidationData.enterZipcode);
      return false;
    }
  };
  const validateEditShippingAddressLinetwo = () => {
    let editShippingAddressLine2 = $("#editShippingAddressLine2").val();
    let poPattern = /\bP(ost|ostal)?([ \.]*(O|0)(ffice)?)?([ \.]*Box)\b/i;
    let modifiedaddress = editShippingAddressLine2.replace(/[^a-zA-Z0-9]/g, "");
    let regSpecial = regexPattern.SPECIALCHAR;

    modifiedaddress = modifiedaddress.toLocaleLowerCase();
    modifiedaddress = extractSpecifcText(modifiedaddress, "p", "x");
    if (editShippingAddressLine2.length > 35) {
      $("#editShippingAddressLine2Msg").text(ValidationData.maxChar35);
      return false;
    } else if (regSpecial.test(editShippingAddressLine2)) {
      $("#editShippingAddressLine2Msg").text(ValidationData.notValidAddress);
      return false;
    } else if (poPattern.test(modifiedaddress)) {
      $("#editShippingAddressLine2Msg").text(
        ValidationData?.poboxAllowedCBA || ""
      );
      return false;
    } else {
      $("#editShippingAddressLine2Msg").text("");
      return true;
    }
  };
  const validateEditNewShippingAddressCompany = () => {  
    let editNewShippingAddressCompany = $(
      "#editNewShippingAddressCompany"
    ).val();
    let regSpecial = regexPattern.SPECIALCHAR;

    if (
      editNewShippingAddressCompany.length >
      utilityMessageLabel.companyNameMaxLength
    ) {
      $("#editNewShippingAddressCompanyMsg").text(ValidationData.maxChar40);
      return false;
    } else if (regSpecial.test(editNewShippingAddressCompany)) {
      $("#editNewShippingAddressCompanyMsg").text(ValidationData.notValidName);
      return false;
    } else {
      $("#editNewShippingAddressCompanyMsg").text("");
      return true;
    }
  };
  /* edit shipping information - modal popup */

  /* Contact Information validations */
  const validateContactShippingInfoEmail = () => {
    let email = $("#contactInfoEmail").val();
    const emailRegexp = new RegExp(regexPattern.EMAIL);
    if (email == "" || email.length == 0) {
      $("#ShippingContactEmailMsg").text(ValidationData.emailNotBeBlank);
      return false;
    }
    if (emailRegexp.test(email)) {
      $("#ShippingContactEmailMsg").text("");
      return true;
    } else {
      $("#ShippingContactEmailMsg").text(ValidationData.notValidEmail);
      return false;
    }
  };
  const validateContactInfoPhoneNumber = () => {
    let ShippingphoneNumber = $("#contactInfoPhoneNumber").val();
    //   let phoneno = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    let phoneno = regexPattern.PHONE;

    if (ShippingphoneNumber == "" || ShippingphoneNumber.length == 0) {
      $("#ShippingContactInfoPhoneNumMsg").text(ValidationData.enterPhone);
      return false;
    }
    if (ShippingphoneNumber.length < 10) {
      $("#ShippingContactInfoPhoneNumMsg").text(ValidationData.minPhonelength);
      return false;
    }
    if (ShippingphoneNumber.length > 20) {
      $("#ShippingContactInfoPhoneNumMsg").text(ValidationData.maxChar20);
      return false;
    }
    if (!ShippingphoneNumber.match(phoneno)) {
      $("#ShippingContactInfoPhoneNumMsg").text(ValidationData.notValidPhone);
      return false;
    }
    if (ShippingphoneNumber.match(phoneno)) {
      $("#ShippingContactInfoPhoneNumMsg").text("");
      return true;
    } else {
      $("#ShippingContactInfoPhoneNumMsg").text("");
      return true;
    }
  };
  /* Contact Information validations */

  /* DT-602 validationfunction */
  const texExamptSelect = () => {
    let isTax = $("input[id='taxCheck']:checked").val();
    let isTaxBox = $("#taxNumber").val();

    if ($("#taxExemptionCheck").is(":visible") == true) {
      let $taxerrorMsg = $("#taxExemptionCheck").find(
        ".enter-carrier-error-message"
      );
      if ($("#taxNumber").is(":visible") == true) {
        let regSpecial = regexPattern.SPECIALCHAR;
        if (isTax !== undefined && isTax !== "") {
          if (
            isTaxBox == "" ||
            taxNumber.value.length < 3 ||
            regSpecial.test(isTaxBox)
          ) {
            $taxerrorMsg.text(
              utilityMessage?.messages?.enterValidTaxExemptCertificateNo
            );
            return false;
          } else if (taxNumber.value.length > 35) {
            $taxerrorMsg.text(
              utilityMessage?.messages?.enterValidTaxExemptCertificateNo
            );
          } else {
            $taxerrorMsg.text("");
            return true;
          }
        }
      } else {
        $taxerrorMsg.text("");
        return true;
      }
    } else {
      $("#taxExemptionCheck").find(".enter-carrier-error-message").text("");
      return true;
    }
  };
  /* DT-602 validationfunction */
  const courieraccselect = () => {
    let selectelement = document.querySelector("#select-box-account");
    let output = selectelement.options[selectelement.selectedIndex].value;
    if (output == "Select") {
      $("#shippingaccountmsg").text(ValidationData.selectShippingAccount);
      return false;
    } else {
      $("#shippingaccountmsg").text("");
      return true;
    }
  };

  const courieraccnumber = () => {
    let courieraccnumber = $("#carrier-acc-number").val();
    let selectedValue = $("#select-box-account").val();
    let hasSelect = selectedValue ? selectedValue.toLocaleLowerCase() : "";
    let caraccno =
      hasSelect === "fedex"
        ? regexPattern.ONLY_NUMBER
        : regexPattern.NUMBER_CHARACTER;
    if (courieraccnumber == "" || courieraccnumber.length == 0) {
      $("#shippingaccountnumbermsg").text(ValidationData.enterCarrierAccount);
      return false;
    }
    if (courieraccnumber.length < 4) {
      $("#shippingaccountnumbermsg").text(ValidationData.enterCarrierAccount);
      return false;
    }
    if (!courieraccnumber.match(caraccno)) {
      $("#shippingaccountnumbermsg").text(
        ValidationData.NotValidCarrierAccount
      );
      return false;
    } else {
      $("#shippingaccountnumbermsg").text("");
      return true;
    }
  };
  /* DT-602 validation end */

  const validateAnaPhoneNumber = ($errrorMessage, Phonenumber) => {
    let $errorDisplay = $errrorMessage.parent().next(".validation-error");
    let pnumber = Phonenumber;
    //let phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    let phoneno = regexPattern.PHONE;
    if (!pnumber) {
      $errorDisplay.text(ValidationData.enterPhone);
      return false;
    }
    if (pnumber.length < 10) {
      $errorDisplay.text(ValidationData.minPhonelength);
      return false;
    }
    if (!pnumber.match(phoneno)) {
      $errorDisplay.text(ValidationData.notValidPhone);
      return false;
    }
    if (pnumber.match(phoneno)) {
      $errorDisplay.text("");
      return true;
    } else {
      $errorDisplay.text("");
      return true;
    }
  };

  $("saveaddresspopup").click(function () {
    $.ajax({
      url: "respurce path",
      success: function (result) {
        "on success return message";
      }
    });
  });

  // Attribute set in zipcode input box after based on country selection
  const zipCodeMaxLengthSet = ($country, $zipCode) => {
    const countryValue = $country.val();
    if (
      $zipCode.selector !== "#editShippingAddressZip" &&
      $zipCode.selector !== "#editBillingAddressZip" &&
      $zipCode.selector !== undefined
    ) {
      $zipCode.val("");
    }

    $zipCode.removeAttr("maxlength");
    if (countryValue == "CA") {
      $zipCode.attr("maxlength", "7");
    } else if (countryValue == "US") {
      $zipCode.attr("maxlength", "10");
    } else {
      $zipCode.attr("maxlength", "10");
    }
  };

  // zipCode value formate changed
  const zipCodeValueFormate = ($country, event) => {
    let optionSelIndexforzipcode = $country.val();
    let valofinput = event.target;

    if (optionSelIndexforzipcode == "CA") {
      let trimmed = valofinput.value.replace(/\s+/g, "");
      if (trimmed.length > 6) {
        trimmed = trimmed.substr(0, 6);
      }
      trimmed = trimmed.replace(/' '/g, "");
      let numbers = [];
      numbers.push(trimmed.substr(0, 3));

      if (trimmed.substr(3, 3) !== "") numbers.push(trimmed.substr(3, 3));
      valofinput.value = numbers.join(" ");
    }
    if (optionSelIndexforzipcode == "US") {
      let trimmed = valofinput.value.replace(/\s+/g, "");
      trimmed = trimmed.replace("-", "");
      if (trimmed.length > 5) {
        let subData = trimmed.substring(0, 5) + "-" + trimmed.substring(5);
        valofinput.value = subData;
      }
    } else {
      valofinput.value = valofinput.value;
    }
    /* add new address for address book ends here*/
  };

  const validateJobTitle = ($jnameErrEle, jname) => {
    if (jname.length > 40) {
      $jnameErrEle.text(ValidationData.maxChar40);
      return false;
    } else {
      $jnameErrEle.text("");
      return true;
    }
  };
  const validateCity = ($cityErrEle, cityShippingName) => {
    let regName = /[^a-zA-Z\- ]/;
    if (cityShippingName == "" || cityShippingName.length == 0) {
      $cityErrEle.text(ValidationData.enterCity);
      return false;
    }
    if (cityShippingName.length > 30) {
      $cityErrEle.text(ValidationData.maxChar30);
      return false;
    }
    if (regName.test(cityShippingName)) {
      $cityErrEle.text(ValidationData.notValidCity);
      return false;
    } else {
      $cityErrEle.text("");
      return true;
    }
  };
  /* RFQ onclick Button validations */

  function validateAllRFQ() {
    rfqModalFormValidation.validateFirstNameRFQ();
    rfqModalFormValidation.validateLastNameRFQ();
    rfqModalFormValidation.validateCompanyRFQ();
    rfqModalFormValidation.validateJobTitleRFQ();
    rfqModalFormValidation.validateEmailRFQ();
    rfqModalFormValidation.validatePhoneNumberRFQ();
    rfqModalFormValidation.validateShippingAddressOneRFQ();
    rfqModalFormValidation.validateShippingAddressTwoRFQ();
    rfqModalFormValidation.validateCityRFQ();
    rfqModalFormValidation.validateCountryRFQ();
    rfqModalFormValidation.validateZipCodeRFQ();
    rfqModalFormValidation.validateStateRFQ();
    validate_form();
    if (
      rfqModalFormValidation.validateFirstNameRFQ() &&
      rfqModalFormValidation.validateLastNameRFQ() &&
      rfqModalFormValidation.validateCompanyRFQ() &&
      rfqModalFormValidation.validateJobTitleRFQ() &&
      rfqModalFormValidation.validateJobTitleRFQ() &&
      rfqModalFormValidation.validateEmailRFQ() &&
      rfqModalFormValidation.validatePhoneNumberRFQ() &&
      rfqModalFormValidation.validateShippingAddressOneRFQ() &&
      rfqModalFormValidation.validateShippingAddressTwoRFQ() &&
      rfqModalFormValidation.validateCityRFQ() &&
      rfqModalFormValidation.validateCountryRFQ() &&
      rfqModalFormValidation.validateZipCodeRFQ() &&
      rfqModalFormValidation.validateStateRFQ() &&
      validate_form()
    ) {
      $(".rfqModal-confirmation").removeClass("d-none");
      sendIEEmail();
    }
  }
  return {
    validateFirstName: validateFirstName,
    validateLastName: validateLastName,
    validatePhoneNumber: validatePhoneNumber,
    validateEmail: validateEmail,
    validateCompany: validateCompany,
    validatePerCompany: validatePerCompany,
    validateJobTitle: validateJobTitle,
    validateAddressType: validateAddressType,
    validateAddressOne: validateAddressOne,
    validateAddressTwo: validateAddressTwo,
    validateCity: validateCity,
    validateZipCode: validateZipCode,
    validateAnaFirstName: validateAnaFirstName,
    validateAnaPerCompany: validateAnaPerCompany,
    validateAnaAddressOne: validateAnaAddressOne,
    validateAnaAddressTwo: validateAnaAddressTwo,
    validateAnaCityName: validateAnaCityName,
    validateAnaZipCode: validateAnaZipCode,
    validateAnaPhoneNumber: validateAnaPhoneNumber,
    validateCountryaddress: validateCountryaddress,
    validateStatename: validateStatename,
    validateAllRFQ: validateAllRFQ,
    validateShippingInformation: validateShippingInformation,
    editExistingShippingAddress: editExistingShippingAddress,
    validateCreateAccount: validateCreateAccount,
    validatePwds: validatePwds,
    zipCodeMaxLengthSet: zipCodeMaxLengthSet,
    zipCodeValueFormate: zipCodeValueFormate,
    manage: manage,
    validate_form: validate_form,
    validatePassword: validatePassword,
    validateNewPwd: validateNewPwd
  };
})(jQuery);

/* Disabled and enabled button functionality for forms (create account form)*/
function manage(txt) {
  var bt = document.querySelector(".cmp-button");
  if (txt.value != "") {
    bt.disabled = false;
    $(".cmp-button").removeClass("hold-cmp-btn");
  } else {
    bt.disabled = true;
  }
}

/*Disabled and enabled button functionality for forms (rfq-cart)* */
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

function extractSpecifcText(strToParse, strStart, strFinish) {
  if (strToParse.match(strStart + "(.*?)" + strFinish) != null) {
    return strToParse.match(strStart + "(.*?)" + strFinish)[0];
  }
}
