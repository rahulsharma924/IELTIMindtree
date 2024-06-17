$(document).ready(function () {
  // Utility JSON
  let utilityResponseShipping;

  window.getUTILITYModule
    .getUtility()
    .done(function (data) {
      utilityResponseShipping = data[0];
    })
    .fail(function (error) {});

  /* Shipping Information */
  //zip validation
  const $shippingInfoCountryCR = $("#editNewShippingAddressCountry"),
    $shippingInfoZipCodeCR = $("#editShippingAddressZip"),
    $addnewAddCountryCR = $("#addNewShippingAddressCountry"),
    $addnewAddZipCodeCR = $("#addNewShippingAddressZip"),
    $finalAddCountryCR = $("#finalDestinationCountry"),
    $finalAddZipCodeCR = $("#finalDestinationZip"),
    $shippingGuestCountryCR = $("#ShippingCountry"),
    $shippingGuestZipCodeCR = $("#ShippingZip");

  // Shipping Address
  if ($shippingInfoCountryCR && $shippingInfoZipCodeCR) {
    $shippingInfoCountryCR.on("change", function () {
      formValidation.zipCodeMaxLengthSet(
        $shippingInfoCountryCR,
        $shippingInfoZipCodeCR
      );
    });
    $shippingInfoZipCodeCR.on("keyup", function (e) {
      formValidation.zipCodeValueFormate($shippingInfoCountryCR, e);
    });
  }
  if ($addnewAddCountryCR && $addnewAddZipCodeCR) {
    $addnewAddCountryCR.on("change", function () {
      formValidation.zipCodeMaxLengthSet(
        $addnewAddCountryCR,
        $addnewAddZipCodeCR
      );
    });
    $addnewAddZipCodeCR.on("keyup", function (e) {
      formValidation.zipCodeValueFormate($addnewAddCountryCR, e);
    });
  }
  if ($shippingGuestCountryCR && $shippingGuestZipCodeCR) {
    $shippingGuestCountryCR.on("change", function () {
      formValidation.zipCodeMaxLengthSet(
        $shippingGuestCountryCR,
        $shippingGuestZipCodeCR
      );
    });
    $shippingGuestZipCodeCR.on("keyup", function (e) {
      formValidation.zipCodeValueFormate($shippingGuestCountryCR, e);
    });
  }
  if ($finalAddCountryCR && $finalAddZipCodeCR) {
    $finalAddCountryCR.on("change", function () {
      formValidation.zipCodeMaxLengthSet(
        $finalAddCountryCR,
        $finalAddZipCodeCR
      );
    });
    $finalAddZipCodeCR.on("keyup", function (e) {
      formValidation.zipCodeValueFormate($finalAddCountryCR, e);
    });
  }

  function validateShippingName() {
    var validateName = $("#ShippingName").val();
    var regShippingInfoName = /[^a-zA-Z\- ]/;
    if (validateName == "" || validateName.length == 0) {
      $("#ShippingNameMsg").text(utilityResponseShipping.messages.enterName);
      $("#ShippingName").focus();
      return false;
    } else if (validateName.length > 20) {
      $("#ShippingNameMsg").text(utilityResponseShipping.messages.maxChar20);
      return false;
    } else if (!regShippingInfoName.test(validateName)) {
      $("#ShippingNameMsg").text("");
      return true;
    } else if (regShippingInfoName.test(validateName)) {
      $("#ShippingNameMsg").text(utilityResponseShipping.messages.notValidName);
      return false;
    } else {
      $("#ShippingNameMsg").text("");
      return true;
    }
  }
  function validateShippingPhoneNumber() {
    var ShippingphoneNumber = $("#ShippingphoneNumber").val();
    //   var phoneno = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    var phoneno = /^[\d +/()-]{1,20}$/;

    if (ShippingphoneNumber == "" || ShippingphoneNumber.length == 0) {
      $("#ShippingphoneNumberMsg").text(
        utilityResponseShipping.messages.enterPhone
      );
      return false;
    }
    if (ShippingphoneNumber.length < 10) {
      $("#ShippingphoneNumberMsg").text(
        utilityResponseShipping.messages.maxChar10
      );
      return false;
    }
    if (ShippingphoneNumber.length > 20) {
      $("#ShippingphoneNumberMsg").text(
        utilityResponseShipping.messages.maxChar20
      );
      return false;
    }
    if (!ShippingphoneNumber.match(phoneno)) {
      $("#ShippingphoneNumberMsg").text(
        utilityResponseShipping.messages.notValidPhone
      );
      return false;
    }
    if (ShippingphoneNumber.match(phoneno)) {
      $("#ShippingphoneNumberMsg").text("");
      return true;
    } else {
      $("#ShippingphoneNumberMsg").text("");
      return true;
    }
  }
  function validateShippingAddressShippingInfoOne() {
    var shippingAddressone = $("#ShippingAddressLine1").val();
    //var regName = ^[a-zA-Z0-9\s\,\''\-]*$;

    if (shippingAddressone == "" || shippingAddressone.length == 0) {
      $("#ShippingAddressLine1msg").text(
        utilityResponseShipping.messages.enterAddress1
      );
      return false;
    }

    if (shippingAddressone.length > 35) {
      $("#ShippingAddressLine1msg").text(
        utilityResponseShipping.messages.maxChar35
      );
      return false;
    } else {
      $("#ShippingAddressLine1msg").text("");
      return true;
    }
  }
  function validateShippingAddressShippingInfotwo() {
    var shippingAddressone = $("#ShippingAddressLine2").val();

    if (shippingAddressone.length > 35) {
      $("#ShippingAddressLine2msg").text(
        utilityResponseShipping.messages.maxChar35
      );
      return false;
    } else {
      $("#ShippingAddressLine2msg").text("");
      return true;
    }
  }
  function countryShippingInfoAddress() {
    var e = $("#ShippingCountry");
    var optionShippingIndex = e[0].selectedIndex;
    //var optionSelectedText = e.options[e.selectedIndex].text;
    if (optionShippingIndex == 0 || optionShippingIndex == "select") {
      $("#ShippingCountrymsg").text(
        utilityResponseShipping.messages.enterCountry
      );
      return false;
    } else {
      $("#ShippingCountrymsg").text("");
      return true;
    }
  }
  function validateCityName() {
    var cityShippingName = $("#ShippingCity").val();
    var regName = /[^a-zA-Z\- ]/;

    if (cityShippingName == "" || cityShippingName.length == 0) {
      $("#ShippingCityMsg").text(utilityResponseShipping.messages.enterCity);
      return false;
    }
    if (cityShippingName.length > 30) {
      $("#ShippingCityMsg").text(utilityResponseShipping.messages.maxChar30);
      return false;
    }
    if (!regName.test(cityShippingName)) {
      $("#ShippingCityMsg").text("");
      return true;
    }
    if (regName.test(cityShippingName)) {
      $("#ShippingCityMsg").text(utilityResponseShipping.messages.notValidCity);
      return false;
    } else {
      $("#ShippingCityMsg").text("");
      return true;
    }
  }
  function stateShippingInfoAddress() {
    var e = $("#ShippingState");
    var optionShippingIndex = e[0].selectedIndex;
    //var optionSelectedText = e.options[e.selectedIndex].text;
    if (optionShippingIndex == 0 || optionShippingIndex == "select") {
      $("#ShippingStateMsg").text(utilityResponseShipping.messages.enterState);
      return false;
    } else {
      $("#ShippingStateMsg").text("");
      return true;
    }
  }

  function validateShippingInfoEmail() {
    var email = $("#ShippingEmail").val();
    const emailRegexp = new RegExp(
      /^[a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1}([a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1})*[a-zA-Z0-9]@[a-zA-Z0-9][-\.]{0,1}([a-zA-Z][-\.]{0,1})*[a-zA-Z0-9]\.[a-zA-Z0-9]{1,}([\.\-]{0,1}[a-zA-Z]){0,}[a-zA-Z0-9]{0,}$/i
    );
    if (email == "" || email.length == 0) {
      $("#ShippingEmailMsg").text(
        utilityResponseShipping.messages.emailNotBeBlank
      );
      return false;
    }
    if (emailRegexp.test(email)) {
      $("#ShippingEmailMsg").text("");
      return true;
    } else {
      $("#ShippingEmailMsg").text(
        utilityResponseShipping.messages.notValidEmail
      );
      return false;
    }
  }
  function validateShippingCompany() {
    var company = $("#ShippingCompany").val();
    if (company.length > utilityResponseShipping.labels.companyNameMaxLength) {
      $("#ShippingCompanyMsg").text(utilityResponseShipping.messages.maxChar40);
      return false;
    } else {
      $("#ShippingCompanyMsg").text("");
      return true;
    }
  }
  /* Shipping Information */

  /* new shipping information - modal popup */
  function validateEditShippingName() {
    var validateEditShippingName = $("#addNewShippingAddressName").val();

    var regShippingInfoName = regexPattern.NAME;

    if (
      validateEditShippingName == "" ||
      validateEditShippingName.length == 0
    ) {
      $("#addNewShippingAddressNameMsg").text(
        utilityResponseShipping.messages.enterName
      );
      return false;
    } else if (validateEditShippingName.length > 30) {
      $("#addNewShippingAddressNameMsg").text(
        utilityResponseShipping.messages.maxChar30
      );
      return false;
    } else if (!regShippingInfoName.test(validateEditShippingName)) {
      $("#addNewShippingAddressNameMsg").text("");
      return true;
    } else if (regShippingInfoName.test(validateEditShippingName)) {
      $("#addNewShippingAddressNameMsg").text(
        utilityResponseShipping.messages.notValidName
      );
      return false;
    } else {
      $("#addNewShippingAddressNameMsg").text("");
      return true;
    }
  }
  function validateEditShippingPhoneNumber() {
    var ShippingEditphoneNumber = $("#addNewShippingAddressPhoneNumber").val();
    //   var phoneno = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    // var phoneno = /^[\d +/()-]{1,20}$/;

    const phoneno = regexPattern.PHONE;

    if (ShippingEditphoneNumber == "" || ShippingEditphoneNumber.length == 0) {
      $("#addNewShippingAddressPhoneNumberMsg").text(
        utilityResponseShipping.messages.enterPhone
      );
      return false;
    }
    if (ShippingEditphoneNumber.length < 10) {
      $("#addNewShippingAddressPhoneNumberMsg").text(
        utilityResponseShipping.messages.maxChar10
      );
      return false;
    }
    if (ShippingEditphoneNumber.length > 20) {
      $("#addNewShippingAddressPhoneNumberMsg").text(
        utilityResponseShipping.messages.maxChar20
      );
      return false;
    }
    if (!ShippingEditphoneNumber.match(phoneno)) {
      $("#addNewShippingAddressPhoneNumberMsg").text(
        utilityResponseShipping.messages.notValidPhone
      );
      return false;
    }
    if (ShippingEditphoneNumber.match(phoneno)) {
      $("#addNewShippingAddressPhoneNumberMsg").text("");
      return true;
    } else {
      $("#addNewShippingAddressPhoneNumberMsg").text("");
      return true;
    }
  }
  function validateEditShippingAddress() {
    let regSpecial = regexPattern.SPECIALCHAR;
    var editShippingAddressone = $("#addNewShippingAddressAddressLine1").val();

    const addressRegex = regexPattern.ADDRESS;

    if (editShippingAddressone == "" || editShippingAddressone.length == 0) {
      $("#addNewShippingAddressAddressLine1Msg").text(
        utilityResponseShipping.messages.enterAddress1
      );
      return false;
    }

    if (editShippingAddressone.length > 35) {
      $("#addNewShippingAddressAddressLine1Msg").text(
        utilityResponseShipping.messages.maxChar35
      );
      return false;
    }
    if (!addressRegex.test(editShippingAddressone)) {
      let poPattern = /\bP(ost|ostal)?([ \.]*(O|0)(ffice)?)?([ \.]*Box)\b/i;
      let modifiedaddress = editShippingAddressone.replace(/[^a-zA-Z0-9]/g, "");
      modifiedaddress = modifiedaddress.toLocaleLowerCase();
      modifiedaddress = extractSpecifcText(modifiedaddress, "p", "x");
      if (poPattern.test(modifiedaddress)) {
        $("#addNewShippingAddressAddressLine1Msg").text(
          utilityResponseShipping?.messages?.poboxAllowedCBA
        );
        return false;
      }
    }
    if (!addressRegex.test(editShippingAddressone)) {
      $("#addNewShippingAddressAddressLine1Msg").text("");
      return true;
    }

    if (
      addressRegex.test(editShippingAddressone) ||
      regSpecial.test(editShippingAddressone)
    ) {
      $("#addNewShippingAddressAddressLine1Msg").text(
        utilityResponseShipping.messages.notValidAddress
      );
      return false;
    } else {
      $("#addNewShippingAddressAddressLine1Msg").text("");
      return true;
    }
  }
  function countryEditShippingInfoAddress() {
    var e = $("#addNewShippingAddressCountry");
    var optionShippingIndex = e[0].selectedIndex;
    //var optionSelectedText = e.options[e.selectedIndex].text;
    if (optionShippingIndex == 0 || optionShippingIndex == "select") {
      $("#addNewShippingAddressCountryMsg").text(
        utilityResponseShipping.messages.enterCountry
      );
      return false;
    } else {
      $("#addNewShippingAddressCountryMsg").text("");
      return true;
    }
  }
  function validateEditCityName() {
    var cityEditShippingName = $("#addNewShippingAddressCity").val();
    var regName = regexPattern.CITY_CMP_NAME;

    if (cityEditShippingName == "" || cityEditShippingName.length == 0) {
      $("#addNewShippingAddressCityMsg").text(
        utilityResponseShipping.messages.enterCity
      );
      return false;
    }
    if (cityEditShippingName.length > 30) {
      $("#addNewShippingAddressCityMsg").text(
        utilityResponseShipping.messages.maxChar30
      );
      return false;
    }
    if (!regName.test(cityEditShippingName)) {
      $("#addNewShippingAddressCityMsg").text("");
      return true;
    }
    if (regName.test(cityEditShippingName)) {
      $("#addNewShippingAddressCityMsg").text(
        utilityResponseShipping.messages.notValidCity
      );
      return false;
    } else {
      $("#addNewShippingAddressCityMsg").text("");
      return true;
    }
  }
  function validateEditShippingInfoCityName() {
    var cityEditShippingName = $("#addNewShippingAddressCity").val();
    var regName = regexPattern.CITY_CMP_NAME;

    if (cityEditShippingName == "" || cityEditShippingName.length == 0) {
      $("#addNewShippingAddressCityMsg").text(
        utilityResponseShipping.messages.enterCity
      );
      return false;
    }
    if (cityEditShippingName.length > 30) {
      $("#addNewShippingAddressCityMsg").text(
        utilityResponseShipping.messages.maxChar30
      );
      return false;
    }
    if (!regName.test(cityEditShippingName)) {
      $("#addNewShippingAddressCityMsg").text("");
      return true;
    }
    if (regName.test(cityEditShippingName)) {
      $("#addNewShippingAddressCityMsg").text(
        utilityResponseShipping.messages.notValidCity
      );
      return false;
    } else {
      $("#addNewShippingAddressCityMsg").text("");
      return true;
    }
  }
  function stateEditShippingInfoAddress() {
    // var e = $("#addNewShippingState");
    // var optionShippingIndex = e[0].selectedIndex;
    var optionShippingIndex = $("#addNewShippingState :selected").val();
    //var optionSelectedText = e.options[e.selectedIndex].text;
    if (optionShippingIndex == 0 || optionShippingIndex == "select") {
      $("#addNewShippingStateMsg").text(
        utilityResponseShipping.messages.enterState
      );
      return false;
    } else {
      $("#addNewShippingStateMsg").text("");
      return true;
    }
  }
  function validateEditShippingInfoZipCode() {
    let $zipCode = $("#addNewShippingAddressZip");
    let ZipCode = $("#addNewShippingAddressZip").val();
    let country = $("#addNewShippingAddressCountry").val();
    return formValidation.validateAnaZipCode($zipCode, ZipCode, country);
  }
  function validateAddShippingAddressLinetwo() {
    var addShippingAddressLine2 = $("#addShippingAddressLine2").val();
    let poPattern = /\bP(ost|ostal)?([ \.]*(O|0)(ffice)?)?([ \.]*Box)\b/i;
    let modifiedaddress = addShippingAddressLine2.replace(/[^a-zA-Z0-9]/g, "");
    modifiedaddress = modifiedaddress.toLocaleLowerCase();
    modifiedaddress = extractSpecifcText(modifiedaddress, "p", "x");
    let regSpecial = regexPattern.SPECIALCHAR;

    if (addShippingAddressLine2.length > 35) {
      $("#addShippingAddressLine2Msg").text(
        utilityResponseShipping.messages.maxChar35
      );
      return false;
    } else if (regSpecial.test(addShippingAddressLine2)) {
      $("#addShippingAddressLine2Msg").text(
        utilityResponseShipping.messages.notValidAddress
      );
      return false;
    } else if (poPattern.test(modifiedaddress)) {
      $("#addShippingAddressLine2Msg").text(
        utilityResponseShipping?.messages?.poboxAllowedCBA
      );
      return false;
    } else {
      $("#addShippingAddressLine2Msg").text("");
      return true;
    }
  }
  function validateAddNewShippingAddressCompany() {
    let regName = regexPattern.SPECIALCHAR;
    var addNewShippingAddressCompany = $("#addNewShippingAddressCompany").val();
    if (
      addNewShippingAddressCompany.length >
      utilityResponseShipping.labels.companyNameMaxLength
    ) {
      $("#addNewShippingAddressCompanyMsg").text(
        utilityResponseShipping.messages.maxChar40
      );
      return false;
    } else if (regName.test(addNewShippingAddressCompany)) {
      $("#addNewShippingAddressCompanyMsg").text(
        ValidationData.enterValidCompanyName
      );
      return false;
    } else {
      $("#addNewShippingAddressCompanyMsg").text("");
      return true;
    }
  }
  /* new shipping information - modal popup */

  /* edit shipping information - modal popup */
  function validateEditExistingShippingName() {
    var validateEditExistingShippingName = $(
      "#editNewShippingAddressName"
    ).val();

    var regShippingInfoName = regexPattern.NAME;

    if (
      validateEditExistingShippingName == "" ||
      validateEditExistingShippingName.length == 0
    ) {
      $("#editNewShippingAddressNameMsg").text(
        utilityResponseShipping.messages.enterName
      );
      return false;
    } else if (validateEditExistingShippingName.length > 20) {
      $("#editNewShippingAddressNameMsg").text(
        utilityResponseShipping.messages.maxChar20
      );
      return false;
    } else if (!regShippingInfoName.test(validateEditExistingShippingName)) {
      $("#editNewShippingAddressNameMsg").text("");
      return true;
    } else if (regShippingInfoName.test(validateEditExistingShippingName)) {
      $("#editNewShippingAddressNameMsg").text(
        utilityResponseShipping.messages.notValidName
      );
      return false;
    } else {
      $("#editNewShippingAddressNameMsg").text("");
      return true;
    }
  }
  function validateEditExistingShippingPhoneNumber() {
    var ShippingEditExistingphoneNumber = $(
      "#editNewShippingAddressPhoneNumber"
    ).val();
    //   var phoneno = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    var phoneno = /^[\d +/()-]{1,20}$/;

    if (
      ShippingEditExistingphoneNumber == "" ||
      ShippingEditExistingphoneNumber.length == 0
    ) {
      $("#editNewShippingAddressPhoneNumberMsg").text(
        utilityResponseShipping.messages.enterPhone
      );
      return false;
    }
    if (ShippingEditExistingphoneNumber.length < 10) {
      $("#editNewShippingAddressPhoneNumberMsg").text(
        utilityResponseShipping.messages.maxChar10
      );
      return false;
    }
    if (ShippingEditExistingphoneNumber.length > 20) {
      $("#editNewShippingAddressPhoneNumberMsg").text(
        utilityResponseShipping.messages.maxChar20
      );
      return false;
    }
    if (!ShippingEditExistingphoneNumber.match(phoneno)) {
      $("#editNewShippingAddressPhoneNumberMsg").text(
        utilityResponseShipping.messages.notValidPhone
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
  }
  function validateEditExistingShippingAddress() {
    var editExistingShippingAddressone = $(
      "#editNewShippingAddressAddressLine1"
    ).val();
    //var regName = ^[a-zA-Z0-9\s\,\''\-]*$;

    if (
      editExistingShippingAddressone == "" ||
      editExistingShippingAddressone.length == 0
    ) {
      $("#editNewShippingAddressAddressLine1Msg").text(
        utilityResponseShipping.messages.enterAddress1
      );
      return false;
    }

    if (editExistingShippingAddressone.length > 35) {
      $("#editNewShippingAddressAddressLine1Msg").text(
        utilityResponseShipping.messages.maxChar35
      );
      return false;
    } else {
      $("#editNewShippingAddressAddressLine1Msg").text("");
      return true;
    }
  }
  function countryEditExistingShippingInfoAddress() {
    var e = $("#editNewShippingAddressCountry");
    var optionShippingIndex = $(
      "#editNewShippingAddressCountry :selected"
    ).val();
    //var optionSelectedText = e.options[e.selectedIndex].text;
    if (optionShippingIndex == 0 || optionShippingIndex == "select") {
      $("#editNewShippingAddressCountryMsg").text(
        utilityResponseShipping.messages.enterCountry
      );
      return false;
    } else {
      $("#editNewShippingAddressCountryMsg").text("");
      return true;
    }
  }
  function validateEditExistingCityName() {
    var cityEditExistingShippingName = $("#editShippingAddressCity").val();
    var regName = /[^a-zA-Z\- ]/;

    if (
      cityEditExistingShippingName == "" ||
      cityEditExistingShippingName.length == 0
    ) {
      $("#editShippingAddressCityMsg").text(
        utilityResponseShipping.messages.enterCity
      );
      return false;
    }
    if (cityEditExistingShippingName.length > 30) {
      $("#editShippingAddressCityMsg").text(
        utilityResponseShipping.messages.maxChar30
      );
      return false;
    }
    if (!regName.test(cityEditExistingShippingName)) {
      $("#editShippingAddressCityMsg").text("");
      return true;
    }
    if (regName.test(cityEditExistingShippingName)) {
      $("#editShippingAddressCityMsg").text(
        utilityResponseShipping.messages.notValidCity
      );
      return false;
    } else {
      $("#editShippingAddressCityMsg").text("");
      return true;
    }
  }
  function stateEditExistingShippingInfoAddress() {
    var e = $("#editAddressShippingState");
    var optionShippingIndex = $("#editAddressShippingState :selected").val();
    //var optionSelectedText = e.options[e.selectedIndex].text;
    if (optionShippingIndex == 0 || optionShippingIndex == "select") {
      $("#editAddressShippingStateMsg").text(
        utilityResponseShipping.messages.enterState
      );
      return false;
    } else {
      $("#editAddressShippingStateMsg").text("");
      return true;
    }
  }
  function validateEditExistingShippingInfoZipCode() {
    let $zipCode = $("#editShippingAddressZip");
    let ZipCode = $("#editShippingAddressZip").val();
    let country = $("#editNewShippingAddressCountry").val();
    return formValidation.validateAnaZipCode($zipCode, ZipCode, country);
  }
  function validateEditExistingShippingInfoEmail() {
    var email = $("#editNewShippingAddressEmail").val();
    const emailRegexp = new RegExp(
      /^[a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1}([a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1})*[a-zA-Z0-9]@[a-zA-Z0-9][-\.]{0,1}([a-zA-Z][-\.]{0,1})*[a-zA-Z0-9]\.[a-zA-Z0-9]{1,}([\.\-]{0,1}[a-zA-Z]){0,}[a-zA-Z0-9]{0,}$/i
    );
    if (email == "" || email.length == 0) {
      $("#editNewShippingAddressEmailMsg").text(
        utilityResponseShipping.messages.emailNotBeBlank
      );
      return false;
    }
    if (emailRegexp.test(email)) {
      $("#editNewShippingAddressEmailMsg").text("");
      return true;
    } else {
      $("#editNewShippingAddressEmailMsg").text(
        utilityResponseShipping.messages.notValidEmail
      );
      return false;
    }
  }
  function validateEditShippingAddressLinetwo() {
    var editShippingAddressLine2 = $("#editShippingAddressLine2").val();
    if (editShippingAddressLine2.length > 35) {
      $("#editShippingAddressLine2Msg").text(
        utilityResponseShipping.messages.maxChar35
      );
      return false;
    } else {
      $("#editShippingAddressLine2Msg").text("");
      return true;
    }
  }
  function validateEditNewShippingAddressCompany() {
    var editNewShippingAddressCompany = $(
      "#editNewShippingAddressCompany"
    ).val();
    if (
      editNewShippingAddressCompany.length >
      utilityResponseShipping.labels.companyNameMaxLength
    ) {
      $("#editNewShippingAddressCompanyMsg").text(
        utilityResponseShipping.messages.maxChar40
      );
      return false;
    } else {
      $("#editNewShippingAddressCompanyMsg").text("");
      return true;
    }
  }
  /* edit shipping information - modal popup */

  /* Contact Information validations */
  function validateContactShippingInfoEmail() {
    var email = $("#contactInfoEmail").val();
    const emailRegexp = new RegExp(
      /^[a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1}([a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1})*[a-zA-Z0-9]@[a-zA-Z0-9][-\.]{0,1}([a-zA-Z][-\.]{0,1})*[a-zA-Z0-9]\.[a-zA-Z0-9]{1,}([\.\-]{0,1}[a-zA-Z]){0,}[a-zA-Z0-9]{0,}$/i
    );
    if (email == "" || email.length == 0) {
      $("#ShippingContactEmailMsg").text(
        utilityResponseShipping.messages.emailNotBeBlank
      );
      return false;
    }
    if (emailRegexp.test(email)) {
      $("#ShippingContactEmailMsg").text("");
      return true;
    } else {
      $("#ShippingContactEmailMsg").text(
        utilityResponseShipping.messages.notValidEmail
      );
      return false;
    }
  }
  function validateContactInfoPhoneNumber() {
    var ShippingphoneNumber = $("#contactInfoPhoneNumber").val();
    //   var phoneno = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    var phoneno = /^[\d +/()-]{1,20}$/;

    if (ShippingphoneNumber == "" || ShippingphoneNumber.length == 0) {
      $("#ShippingContactInfoPhoneNumMsg").text(
        utilityResponseShipping.messages.enterPhone
      );
      return false;
    }
    if (ShippingphoneNumber.length < 10) {
      $("#ShippingContactInfoPhoneNumMsg").text(
        utilityResponseShipping.messages.maxChar10
      );
      return false;
    }
    if (ShippingphoneNumber.length > 20) {
      $("#ShippingContactInfoPhoneNumMsg").text(
        utilityResponseShipping.messages.maxChar20
      );
      return false;
    }
    if (!ShippingphoneNumber.match(phoneno)) {
      $("#ShippingContactInfoPhoneNumMsg").text(
        utilityResponseShipping.messages.notValidPhone
      );
      return false;
    }
    if (ShippingphoneNumber.match(phoneno)) {
      $("#ShippingContactInfoPhoneNumMsg").text("");
      return true;
    } else {
      $("#ShippingContactInfoPhoneNumMsg").text("");
      return true;
    }
  }
  /* Contact Information validations */

  /* Final destination */
  function finalDestinationName() {
    var validateName = $("#finalDestinationName").val();

    var regShippingInfoName = regexPattern.NAME;

    if (validateName == "" || validateName.length == 0) {
      $("#finalDestinationNameMsg").text(
        utilityResponseShipping.messages.enterName
      );
      return false;
    } else if (validateName.length > 30) {
      $("#finalDestinationNameMsg").text(
        utilityResponseShipping.messages.maxChar30
      );
      return false;
    } else if (!regShippingInfoName.test(validateName)) {
      $("#finalDestinationNameMsg").text("");
      return true;
    } else if (regShippingInfoName.test(validateName)) {
      $("#finalDestinationNameMsg").text(
        utilityResponseShipping.messages.notValidName
      );
      return false;
    } else {
      $("#finalDestinationNameMsg").text("");
      return true;
    }
  }
  function finalDestinationPhone() {
    var ShippingphoneNumber = $("#finalDestinationPhone").val();
    const phoneno = new RegExp(regexPattern.PHONE);

    if (ShippingphoneNumber == "" || ShippingphoneNumber.length == 0) {
      $("#finalDestinationPhoneMsg").text(
        utilityResponseShipping.messages.enterPhone
      );
      return false;
    }
    if (ShippingphoneNumber.length < 10) {
      $("#finalDestinationPhoneMsg").text(
        utilityResponseShipping.messages.maxChar10
      );
      return false;
    }
    if (ShippingphoneNumber.length > 20) {
      $("#finalDestinationPhoneMsg").text(
        utilityResponseShipping.messages.maxChar20
      );
      return false;
    }
    if (!ShippingphoneNumber.match(phoneno)) {
      $("#finalDestinationPhoneMsg").text(
        utilityResponseShipping.messages.notValidPhone
      );
      return false;
    }
    if (ShippingphoneNumber.match(phoneno)) {
      $("#finalDestinationPhoneMsg").text("");
      return true;
    } else {
      $("#finalDestinationPhoneMsg").text("");
      return true;
    }
  }
  function finalDestinationAddress1() {
    var shippingAddressone = $("#finalDestinationAddress1").val();
    //var regName = ^[a-zA-Z0-9\s\,\''\-]*$;
    const regName = regexPattern.ADDRESS;
    if (shippingAddressone == "" || shippingAddressone.length == 0) {
      $("#finalDestinationAddress1msg").text(
        utilityResponseShipping.messages.enterAddress1
      );
      return false;
    }

    if (shippingAddressone.length > 35) {
      $("#finalDestinationAddress1msg").text(
        utilityResponseShipping.messages.maxChar35
      );
      return false;
    }

    if (!regName.test(shippingAddressone)) {
      $("#finalDestinationAddress1msg").text("");
      return true;
    }
    if (regName.test(shippingAddressone)) {
      $("#finalDestinationAddress1msg").text(
        utilityResponseShipping.messages.notValidAddress
      );
      return false;
    } else {
      $("#finalDestinationAddress1msg").text("");
      return true;
    }
  }
  function finalDestinationZip() {
    let $zipCode = $("#finalDestinationZip");
    let ZipCode = $("#finalDestinationZip").val();
    let country = $("#finalDestinationCountry").val();
    return formValidation.validateAnaZipCode($zipCode, ZipCode, country);
  }
  function finalDestinationCountry() {
    var e = $("#finalDestinationCountry");
    var zipcodeValue = $("#finalDestinationZip").val();
    var optionShippingIndex = $("#finalDestinationCountry :selected").val();
    //var optionSelectedText = e.options[e.selectedIndex].text;

    if (optionShippingIndex == 0 || optionShippingIndex == "select") {
      $("#finalDestinationCountrymsg").text(
        utilityResponseShipping.messages.enterCountry
      );
      return false;
    } else if (optionShippingIndex == "DM" || optionShippingIndex == "SV") {
      $("#finalDestinationZiplengthmsg").text("");
      $("#finalDestinationCountrymsg").text("");
      //10 digit numeric with -
      const zipRegex = new RegExp(/^(?![0-9]*$)[0-9\-]{1,10}$/);
      if (zipRegex.test(zipcodeValue) && zipcodeValue.length == 10) {
        $("#finalDestinationZipmsg").text("");
        return true;
      } else {
        $("#finalDestinationZipmsg").removeClass("d-none");
        $("#finalDestinationZipmsg").text(
          utilityResponseShipping.messages.notValidZipOrPost
        );
        return false;
      }
    } else if (
      optionShippingIndex == "US" ||
      optionShippingIndex == "AS" ||
      optionShippingIndex == "BH" ||
      optionShippingIndex == "BT" ||
      optionShippingIndex == "CR" ||
      optionShippingIndex == "HR" ||
      optionShippingIndex == "BS" ||
      optionShippingIndex == "DE" ||
      optionShippingIndex == "FR" ||
      optionShippingIndex == "MX"
    ) {
      $("#finalDestinationZiplengthmsg").text("");
      $("#finalDestinationCountrymsg").text("");
      //5 digit numeric code
      const zipRegex = new RegExp(/^[0-9]{5}$/);
      if (zipRegex.test(zipcodeValue) && zipcodeValue.length == 5) {
        $("#finalDestinationZipmsg").text("");
        return true;
      } else {
        $("#finalDestinationZipmsg").removeClass("d-none");
        $("#finalDestinationZipmsg").text(
          utilityResponseShipping.messages.notValidZipOrPost
        );
        return false;
      }
    } else if (optionShippingIndex == "AO" || optionShippingIndex == "BF") {
      $("#finalDestinationZiplengthmsg").text("");
      $("#finalDestinationCountrymsg").text("");
      //6 digit alphanumeric
      const zipRegex = new RegExp(/^(?![0-9]*$)(?![a-zA-Z]*$)[a-zA-Z0-9]+$/);
      if (zipRegex.test(zipcodeValue) && zipcodeValue.length == 6) {
        $("#finalDestinationZipmsg").text("");
        return true;
      } else {
        $("#finalDestinationZipmsg").removeClass("d-none");
        $("#finalDestinationZipmsg").text(
          utilityResponseShipping.messages.notValidZipOrPost
        );
        return false;
      }
    } else if (
      optionShippingIndex == "BW" ||
      optionShippingIndex == "AI" ||
      optionShippingIndex == "AZ" ||
      optionShippingIndex == "GH"
    ) {
      $("#finalDestinationZiplengthmsg").text("");
      $("#finalDestinationCountrymsg").text("");
      //6 digit alphanumeric with space
      const zipRegex = new RegExp(
        /^(?![0-9]*$)(?![a-zA-Z]*$)(?![0-9\s]*$)(?![a-zA-Z\s]*$)(?![a-zA-Z0-9]*$)([a-zA-Z0-9\s]{6})$/
      );
      if (zipRegex.test(zipcodeValue) && zipcodeValue.length == 6) {
        $("#finalDestinationZipmsg").text("");
        return true;
      } else {
        $("#finalDestinationZipmsg").removeClass("d-none");
        $("#finalDestinationZipmsg").text(
          utilityResponseShipping.messages.notValidZipOrPost
        );
        return false;
      }
    } else if (
      optionShippingIndex == "BY" ||
      optionShippingIndex == "CN" ||
      optionShippingIndex == "CO" ||
      optionShippingIndex == "EC" ||
      optionShippingIndex == "GY" ||
      optionShippingIndex == "TJ" ||
      optionShippingIndex == "TT" ||
      optionShippingIndex == "KH" ||
      optionShippingIndex == "DZ" ||
      optionShippingIndex == "IN"
    ) {
      $("#finalDestinationZiplengthmsg").text("");
      $("#finalDestinationCountrymsg").text("");
      //6 digit numeric
      const zipRegex = new RegExp(/^[0-9]{6}$/);
      if (zipRegex.test(zipcodeValue) && zipcodeValue.length == 6) {
        $("#finalDestinationZipmsg").text("");
        return true;
      } else {
        $("#finalDestinationZipmsg").removeClass("d-none");
        $("#finalDestinationZipmsg").text(
          utilityResponseShipping.messages.notValidZipOrPost
        );
        return false;
      }
    } else if (optionShippingIndex == "GR" || optionShippingIndex == "BJ") {
      $("#finalDestinationZiplengthmsg").text("");
      $("#finalDestinationCountrymsg").text("");
      //6 digit numeric with space
      const zipRegex = new RegExp(/^(?![0-9]*$)([0-9\s]{1,6})$/);
      if (zipRegex.test(zipcodeValue) && zipcodeValue.length == 6) {
        $("#finalDestinationZipmsg").text("");
        return true;
      } else {
        $("#finalDestinationZipmsg").removeClass("d-none");
        $("#finalDestinationZipmsg").text(
          utilityResponseShipping.messages.notValidZipOrPost
        );
        return false;
      }
    } else if (optionShippingIndex == "BN" || optionShippingIndex == "IO") {
      $("#finalDestinationZiplengthmsg").text("");
      $("#finalDestinationCountrymsg").text("");
      //7 digit alphanumeric with "-" in between
      const zipRegex = new RegExp(
        /^(?![0-9-]*$)(?![a-zA-Z-]*$)(?![a-zA-Z0-9]*$)([a-zA-Z0-9-]{7})$/
      );
      if (zipRegex.test(zipcodeValue) && zipcodeValue.length == 7) {
        $("#finalDestinationZipmsg").text("");
        return true;
      } else {
        $("#finalDestinationZipmsg").removeClass("d-none");
        $("#finalDestinationZipmsg").text(
          utilityResponseShipping.messages.notValidZipOrPost
        );
        return false;
      }
    } else if (
      optionShippingIndex == "TC" ||
      optionShippingIndex == "BB" ||
      optionShippingIndex == "CL" ||
      optionShippingIndex == "TU"
    ) {
      $("#finalDestinationZiplengthmsg").text("");
      $("finalDestinationCountrymsg").text("");
      //7 digit alphanumeric with a space
      const zipRegex = new RegExp(
        /^(?![0-9\s]*$)(?![a-zA-Z\s]*$)(?![a-zA-Z0-9]*$)[a-zA-Z0-9\s]+$/
      );
      if (zipRegex.test(zipcodeValue) && zipcodeValue.length == 7) {
        $("#finalDestinationZipmsg").text("");
        return true;
      } else {
        $("#finalDestinationZipmsg").removeClass("d-none");
        $("#finalDestinationZipmsg").text(
          utilityResponseShipping.messages.notValidZipOrPost
        );
        return false;
      }
    } else if (optionShippingIndex == "KY") {
      $("#finalDestinationZiplengthmsg").text("");
      $("#finalDestinationCountrymsg").text("");
      //8 digit alphnumeic with - and space
      const zipRegex = new RegExp(
        /^(?![0-9-\s]*$)(?![a-zA-Z-\s]*$)(?![a-zA-Z0-9]*$)(?![a-zA-Z0-9\s]*$)(?![a-zA-Z0-9-]*$)([a-zA-Z0-9-\s]{1,8})$/
      );
      if (zipRegex.test(zipcodeValue) && zipcodeValue.length == 8) {
        $("#finalDestinationZipmsg").text("");
        return true;
      } else {
        $("#finalDestinationZipmsg").removeClass("d-none");
        $("#finalDestinationZipmsg").text(
          utilityResponseShipping.messages.notValidZipOrPost
        );
        return false;
      }
    } else if (optionShippingIndex == "BM") {
      $("#finalDestinationZiplengthmsg").text("");
      $("#finalDestinationCountrymsg").text("");
      //AA NN
      const zipRegex = new RegExp(/[A-Za-z]{2} \d{2}/);
      if (zipRegex.test(zipcodeValue) && zipcodeValue.length == 5) {
        $("#finalDestinationZipmsg").text("");
        return true;
      } else {
        $("#finalDestinationZipmsg").removeClass("d-none");
        $("#finalDestinationZipmsg").text(
          utilityResponseShipping.messages.notValidZipOrPost
        );
        return false;
      }
    } else if (optionShippingIndex == "CA") {
      $("#finalDestinationZiplengthmsg").text("");
      $("#finalDestinationCountrymsg").text("");
      //ANA NAN
      const zipRegex = new RegExp(/[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d/);
      if (zipRegex.test(zipcodeValue) && zipcodeValue.length == 7) {
        $("#finalDestinationZipmsg").text("");
        return true;
      } else {
        $("#finalDestinationZipmsg").removeClass("d-none");
        $("#finalDestinationZipmsg").text(
          utilityResponseShipping.messages.notValidZipOrPost
        );
        return false;
      }
    } else if (
      optionShippingIndex == "DK" ||
      optionShippingIndex == "AT" ||
      optionShippingIndex == "BD" ||
      optionShippingIndex == "BG" ||
      optionShippingIndex == "CV" ||
      optionShippingIndex == "CX" ||
      optionShippingIndex == "CD" ||
      optionShippingIndex == "CG" ||
      optionShippingIndex == "CY" ||
      optionShippingIndex == "GE" ||
      optionShippingIndex == "GL" ||
      optionShippingIndex == "GW" ||
      optionShippingIndex == "SJ" ||
      optionShippingIndex == "TN" ||
      optionShippingIndex == "UZ" ||
      optionShippingIndex == "CV" ||
      optionShippingIndex == "ET" ||
      optionShippingIndex == "AF" ||
      optionShippingIndex == "AL" ||
      optionShippingIndex == "AM" ||
      optionShippingIndex == "AU" ||
      optionShippingIndex == "BE" ||
      optionShippingIndex == "BO" ||
      optionShippingIndex == "CC"
    ) {
      $("#finalDestinationZiplengthmsg").text("");
      $("#finalDestinationCountrymsg").text("");
      //4 digit numeric
      const zipRegex = new RegExp(/^[0-9]{4}$/);
      if (zipRegex.test(zipcodeValue) && zipcodeValue.length == 4) {
        $("#finalDestinationZipmsg").text("");
        return true;
      } else {
        $("#finalDestinationZipmsg").removeClass("d-none");
        $("#finalDestinationZipmsg").text(
          utilityResponseShipping.messages.notValidZipOrPost
        );
        return false;
      }
    } else if (
      optionShippingIndex == "EH" ||
      optionShippingIndex == "YU" ||
      optionShippingIndex == "AQ" ||
      optionShippingIndex == "BA"
    ) {
      $("#finalDestinationZiplengthmsg").text("");
      $("#finalDestinationCountrymsg").text("");
      //5 digit numeric
      const zipRegex = new RegExp(/^[0-9]{1,5}$/);
      if (zipRegex.test(zipcodeValue) && zipcodeValue.length == 5) {
        $("#finalDestinationZipmsg").text("");
        return true;
      } else {
        $("#finalDestinationZipmsg").removeClass("d-none");
        $("#finalDestinationZipmsg").text(
          utilityResponseShipping.messages.notValidZipOrPost
        );
        return false;
      }
    } else if (optionShippingIndex == "AD" || optionShippingIndex == "AR") {
      $("#finalDestinationZiplengthmsg").text("");
      $("#finalDestinationCountrymsg").text("");
      //5 digit alpha numeric
      const zipRegex = new RegExp(/^(?![0-9]*$)(?![a-zA-Z]*$)[a-zA-Z0-9]+$/);
      if (zipRegex.test(zipcodeValue) && zipcodeValue.length == 5) {
        $("#finalDestinationZipmsg").text("");
        return true;
      } else {
        $("#finalDestinationZipmsg").removeClass("d-none");
        $("#finalDestinationZipmsg").text(
          utilityResponseShipping.messages.notValidZipOrPost
        );
        return false;
      }
    } else if (optionShippingIndex == "SE" || optionShippingIndex == "CZ") {
      $("#finalDestinationZiplengthmsg").text("");
      $("#finalDestinationCountrymsg").text("");
      // 5 digit numeric with space
      const zipRegex = new RegExp(/^(?![0-9]*$)([0-9\s]{5})$/);
      if (zipRegex.test(zipcodeValue) && zipcodeValue.length == 5) {
        $("#finalDestinationZipmsg").text("");
        return true;
      } else {
        $("#finalDestinationZipmsg").removeClass("d-none");
        $("#finalDestinationZipmsg").text(
          utilityResponseShipping.messages.notValidZipOrPost
        );
        return false;
      }
    } else if (optionShippingIndex == "UK" || optionShippingIndex == "SZ") {
      $("#finalDestinationZiplengthmsg").text("");
      $("#finalDestinationCountrymsg").text("");
      //4 digit alphanumeric
      const zipRegex = new RegExp(/^(?![0-9]*$)(?![a-zA-Z]*$)[a-zA-Z0-9]+$/);
      if (zipRegex.test(zipcodeValue) && zipcodeValue.length == 4) {
        $("#finalDestinationZipmsg").text("");
        return true;
      } else {
        $("#finalDestinationZipmsg").removeClass("d-none");
        $("#finalDestinationZipmsg").text(
          utilityResponseShipping.messages.notValidZipOrPost
        );
        return false;
      }
    } else if (optionShippingIndex == "FO") {
      $("#finalDestinationZiplengthmsg").text("");
      $("#finalDestinationCountrymsg").text("");
      //3 digit numeric
      const zipRegex = new RegExp(/^[0-9]{1,3}$/);
      if (zipRegex.test(zipcodeValue) && zipcodeValue.length == 3) {
        $("#finalDestinationZipmsg").text("");
        return true;
      } else {
        $("#finalDestinationZipmsg").removeClass("d-none");
        $("#finalDestinationZipmsg").text(
          utilityResponseShipping.messages.notValidZipOrPost
        );
        return false;
      }
    } else if (optionShippingIndex == "BR") {
      $("#finalDestinationZiplengthmsg").text("");
      $("#finalDestinationCountrymsg").text("");
      //NNNNN-NNN
      const zipRegex = new RegExp(/^[0-9]{5}-[0-9]{3}$/);
      if (zipRegex.test(zipcodeValue) && zipcodeValue.length == 9) {
        $("#finalDestinationZipmsg").text("");
        return true;
      } else {
        $("#finalDestinationZipmsg").removeClass("d-none");
        $("#finalDestinationZipmsg").text(
          utilityResponseShipping.messages.notValidZipOrPost
        );
        return false;
      }
    } else if (optionShippingIndex == "BB") {
      $("#zipcodelength-rfq-msg").text("");
      $("#country-rfq-msg").text("");
      //7 digit alpanumeric
      const zipRegex = new RegExp(/^(?![0-9]*$)(?![a-zA-Z]*$)[a-zA-Z0-9]+$/);
      if (zipRegex.test(zipcodeValue) && zipcodeValue.length == 7) {
        $("#zipcode-rfq-msg").text("");
        return true;
      } else {
        $("#zipcode-rfq-msg").removeClass("d-none");
        $("#zipcode-rfq-msg").text(
          utilityResponseShipping.messages.notValidZipOrPost
        );
        return false;
      }
    } else {
      $("#finalDestinationCountrymsg").text("");
      return true;
    }
  }
  function finalDestinationCity() {
    var cityShippingName =
      document.forms["validateShippingDetails"]["finalDestinationCity"].value;
    var regName = /[^a-zA-Z\- ]/;

    if (cityShippingName == "" || cityShippingName.length == 0) {
      $("#finalDestinationCitymsg").text(
        utilityResponseShipping.messages.enterCity
      );
      return false;
    }
    if (cityShippingName.length > 30) {
      $("#finalDestinationCitymsg").text(
        utilityResponseShipping.messages.maxChar30
      );
      return false;
    }
    if (!regName.test(cityShippingName)) {
      $("#finalDestinationCitymsg").text("");
      return true;
    }
    if (regName.test(cityShippingName)) {
      $("#finalDestinationCitymsg").text(
        utilityResponseShipping.messages.notValidCity
      );
      return false;
    } else {
      $("#finalDestinationCitymsg").text("");
      return true;
    }
  }
  function finalDestinationstate() {
    // var e = $("#finalDestinationstate");
    // var optionShippingIndex = e[0].selectedIndex;
    //var optionSelectedText = e.options[e.selectedIndex].text;
    var optionShippingIndex = $("#finalDestinationstate :selected").val();
    if (optionShippingIndex == 0 || optionShippingIndex == "select") {
      $("#finalDestinationstatemsg").text(
        utilityResponseShipping.messages.enterState
      );
      return false;
    } else {
      $("#finalDestinationstatemsg").text("");
      return true;
    }
  }
  /*function finalDestinationEmail() {
		var email = $("#finalDestinationEmail").val();
		let existEmail = $("#contactInfoEmail").val();
		let existEmailGuest = $("#ShippingEmail").val();
		const emailRegexp = new RegExp(
			/^[a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1}([a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1})*[a-zA-Z0-9]@[a-zA-Z0-9][-\.]{0,1}([a-zA-Z][-\.]{0,1})*[a-zA-Z0-9]\.[a-zA-Z0-9]{1,}([\.\-]{0,1}[a-zA-Z]){0,}[a-zA-Z0-9]{0,}$/i
		);
		if (email == "" || email.length == 0) {
			$("#finalDestinationEmailMsg").text(utilityResponseShipping.messages.emailNotBeBlank)
			return false;
		}
		if (email == existEmail || email == existEmailGuest) {
			$("#finalDestinationEmailMsg").text("utilityResponseShipping.messages.emailAlreadyUsed);
			return false;
		}
		if (emailRegexp.test(email)) {
			$("#finalDestinationEmailMsg").text("");
			return true;
		} else {
			$("#finalDestinationEmailMsg").text(utilityResponseShipping.messages.notValidEmail)
			return false;
		}
	
	}*/
  function validateFinalDestinationCompany() {
    var company = $("#finalDestinationCompany").val();
    if (company.length > utilityResponseShipping.labels.companyNameMaxLength) {
      $("#finalDestinationCompanyNameMsg").text(
        utilityResponseShipping.messages.maxChar40
      );
      return false;
    } else {
      $("#finalDestinationCompanyNameMsg").text("");
      return true;
    }
  }
  function validateFinalDestinationAddressLine2() {
    var company = $("#finalDestinationAddress2").val();
    if (company.length > 35) {
      $("#finalDestinationAddress2msg").text(
        utilityResponseShipping.messages.maxChar35
      );
      return false;
    } else {
      $("#finalDestinationAddress2msg").text("");
      return true;
    }
  }

  /* Final destination */

  /* DT-602 validationfunction */
  function courieraccselect() {
    var selectelement = $("#select-box-account");
    var output = $("#select-box-account").val();
    if (output == "Select") {
      $("#shippingaccountmsg").text(
        utilityResponseShipping.messages.selectShippingAccount
      );
      return false;
    } else {
      $("#shippingaccountmsg").text("");
      return true;
    }
  }

  function courieraccnumber() {
    var courieraccnumber = $("#carrier-acc-number").val();
    var caraccno = /^[\d +/()-]{1,20}$/;
    if (courieraccnumber == "" || courieraccnumber.length == 0) {
      $("#shippingaccountnumbermsg").text(
        utilityResponseShipping.messages.enterCarrierAccount
      );
      return false;
    }
    if (courieraccnumber.length < 4) {
      $("#shippingaccountnumbermsg").text(
        utilityResponseShipping.messages.NotValidCarrierAccount
      );
      return false;
    }
    if (!courieraccnumber.match(caraccno)) {
      $("#shippingaccountnumbermsg").text(
        utilityResponseShipping.messages.NotValidCarrierAccount
      );
      return false;
    }
    if (courieraccnumber.match(caraccno)) {
      $("#shippingaccountnumbermsg").text("");
      return true;
    } else {
      $("#shippingaccountnumbermsg").text("");
      return true;
    }
  }
  /* DT-602 validation end */
  let formValidationCheck = {};
  formValidationCheck.validateEditShippingName = validateEditShippingName;
  formValidationCheck.validateEditShippingPhoneNumber =
    validateEditShippingPhoneNumber;
  formValidationCheck.validateEditShippingAddress = validateEditShippingAddress;
  formValidationCheck.countryEditShippingInfoAddress =
    countryEditShippingInfoAddress;
  formValidationCheck.validateEditShippingInfoCityName =
    validateEditShippingInfoCityName;
  formValidationCheck.stateEditShippingInfoAddress =
    stateEditShippingInfoAddress;
  formValidationCheck.validateEditShippingInfoZipCode =
    validateEditShippingInfoZipCode;
  formValidationCheck.validateAddShippingAddressLinetwo =
    validateAddShippingAddressLinetwo;
  formValidationCheck.validateAddNewShippingAddressCompany =
    validateAddNewShippingAddressCompany;

  formValidationCheck.finalDestinationName = finalDestinationName;
  formValidationCheck.finalDestinationPhone = finalDestinationPhone;
  formValidationCheck.finalDestinationCountry = finalDestinationCountry;
  formValidationCheck.finalDestinationAddress1 = finalDestinationAddress1;
  formValidationCheck.finalDestinationCity = finalDestinationCity;
  formValidationCheck.finalDestinationZip = finalDestinationZip;
  formValidationCheck.finalDestinationstate = finalDestinationstate;
  formValidationCheck.validateFinalDestinationCompany =
    validateFinalDestinationCompany;
  formValidationCheck.validateFinalDestinationAddressLine2 =
    validateFinalDestinationAddressLine2;

  window.formValidationCheck = formValidationCheck || {};
});
