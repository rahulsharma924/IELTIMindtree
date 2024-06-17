$(document).ready(function () {
  // Hide Some Labels
  $("form.createAccount .accemail .cmp-form-text p.mailmessage").hide();

  $(
    "form.createAccount .accphonenumber .cmp-form-text p.phonenumbermessage"
  ).css("display", "none");

  /*  $("form.createAccount .accenterpassword .cmp-form-text ul").css(
    "display",
    "none"
  );*/
  const countryShiMsg = $("#countryshippingmsg"),
    stateShiMsg = $("#stateshippingmsg");
  if (countryShiMsg && stateShiMsg) {
    countryShiMsg.removeAttr("style").addClass("ie-error-medium");
    stateShiMsg.removeAttr("style").addClass("ie-error-medium");
  }

  const endPoint = $.fn.getAPIEndpoint(),
    redirectURL = endPoint?.damEndpoint?.redirectURL;

  let $modalCountry,
    $modalState,
    countriesList,
    $modalInputZipCode,
    $shippingCountryCR,
    $shippingZipCodeCR;
  $modalCountry = $("#modalcountry");
  $modalState = $("#modalstate");
  $modalInputZipCode = $("#inputZip");
  $shippingCountryCR = $("#country");
  $shippingZipCodeCR = $("#zipcode");

  // Shipping Address
  if ($shippingCountryCR && $shippingZipCodeCR) {
    $shippingCountryCR.on("change", function () {
      formValidation.zipCodeMaxLengthSet(
        $shippingCountryCR,
        $shippingZipCodeCR
      );
    });

    $shippingZipCodeCR.on("keyup", function (e) {
      formValidation.zipCodeValueFormate($shippingCountryCR, e);
    });
  }

  // Billing Address
  if ($modalCountry && $modalInputZipCode) {
    $modalCountry.on("change", function () {
      formValidation.zipCodeMaxLengthSet($modalCountry, $modalInputZipCode);
    });

    $modalInputZipCode.on("keyup", function (e) {
      formValidation.zipCodeValueFormate($modalCountry, e);
    });
  }
  // Country List
  window.getAPIModule
    .getCountryList()
    .done(function (data) {
      countriesList = data;
      if ($modalCountry.length) {
        $modalCountry.countryList(countriesList);
      }
    })
    .fail(function (error) {});

  $modalCountry.on("change", function (event) {
    let $currentEvent = $(event.currentTarget);
    let selectValue = $currentEvent.val();
    $modalState.stateFilter(countriesList, selectValue);
  });

  function validateRegistrationAccountDetails() {
    let isSameShippingAddress = $("#trigger")
      ? $("#trigger").is(":checked")
      : false;
    let isEmailChecked = $("#contactpreference")
      ? $("#contactpreference").is(":checked")
      : false;
    var obj = {};
    //var emailcheck = $("#contactpreference").val();

    // Personal Information
    obj.email = $("#email").val();
    obj.pwd = $("#pswd22").val();
    obj.fname = $("#firstName").val();
    obj.lname = $("#lastName").val();
    obj.name = obj.fname + " " + obj.lname;
    obj.company = $("#companY").val() || "NA";

    obj.contact = $("#phoneNumber").val();
    //obj.industry= $("#form-options-1332489536").val();
    obj.industry = "Industry" || $("#Industry").val();

    // Shipping Address

    obj.shippingFirstName = $("#firstname").val();
    obj.shippingLastName = $("#lastname").val();
    obj.shippingName = obj.shippingFirstName + " " + obj.shippingLastName;
    obj.shippingCompanyName = $("#compaNY").val() || "NA";

    obj.shippingPhoneNumber = $("#phonenumber").val();
    obj.shippingCountry = $("#country").val();
    obj.shippingAddress1 = $("#Addressone").val();
    obj.shippingAddress2 = $("#Addresstwo").val() || "NA";
    obj.shippingCity = $("#city").val();
    obj.shippingState = $("#state").val();

    obj.shippingZipCode = $("#zipcode").val();

    if (isSameShippingAddress) {
      obj.billingFirstName = obj.shippingFirstName;
      obj.billingLastName = obj.shippingLastName;
      obj.billingCompanyName = obj.shippingCompanyName;

      obj.billingCountry = obj.shippingCountry;
      obj.billingPhoneNumber = obj.shippingPhoneNumber;
      obj.billingAddress = obj.shippingAddress1;
      obj.billingAddress2 = obj.shippingAddress2;

      obj.billingCity = obj.shippingCity;
      obj.billingState = obj.shippingState;
      obj.billingZipCode = obj.shippingZipCode;
    } else {
      obj.billingFirstName = $("#modalfirstname").val();
      obj.billingLastName = $("#modallastname").val();
      obj.billingCompanyName = $("#modalcompanyname").val() || "NA";

      obj.billingCountry = $("#modalcountry").val();

      obj.billingPhoneNumber = $("#modalphnumber").val();
      obj.billingAddress = $("#inputAddress").val();
      obj.billingAddress2 = $("#inputAddress2").val() || "NA";

      obj.billingCity = $("#inputCity").val();
      obj.billingState = $("#modalstate").val();

      obj.billingZipCode = $("#inputZip").val();
    }

    var accountDetails = {
      email: obj.email,
      password: obj.pwd,
      firstName: obj.fname,
      lastName: obj.lname,
      company: obj.company,
      contact: obj.contact,
      industry: obj.industry,
      contactByEmail: isEmailChecked,
      billingAddresses: [
        {
          name: obj.name,
          company: obj.billingCompanyName,
          country: obj.billingCountry,
          phone: obj.billingPhoneNumber,
          line1: obj.billingAddress,
          line2: obj.billingAddress2,
          city: obj.billingCity,
          state: obj.billingState,
          zipcode: obj.billingZipCode,
          isDefault: true
        }
      ],
      shippingAddresses: [
        {
          name: obj.shippingName,
          company: obj.shippingCompanyName,
          country: obj.shippingCountry,
          phone: obj.shippingPhoneNumber,
          line1: obj.shippingAddress1,
          line2: obj.shippingAddress2,
          city: obj.shippingCity,
          state: obj.shippingState,
          zipcode: obj.shippingZipCode,
          isDefault: true
        }
      ]
    };
    //wait untill to validate user data
    $(".cmp-button").addClass("hold-cmp-btn");
    var registrationData = JSON.stringify(accountDetails);
    var urlCheck = window.location.href;
    if (urlCheck.includes("checkout")) {
      window.location.href = redirectURL.createAccountGuestRegister;
    }
    if (urlCheck.includes("guestregister")) {
      var tvalue = window.isCustomerToken();
      const data = {
        CTCustomerToken: tvalue,
        registration: registrationData,
        bearertoken: window.getbearerToken()
      };
      // Guest User Registration API Call
      window.getAPIModule
        .getGuestUserRegistration(data)
        .done(function (response) {
          checkoutGuestRegistration(response, obj);
        })
        .fail(function (error) {
          window.errorModule.showErrorPopup(error);
        });
    } else {
      const data = {
        registration: registrationData,
        bearerToken: window.getbearerToken()
      };
      // New User Registration API Call
      window.getAPIModule
        .getNewUserRegistration(data)
        .done(function (response) {
          newUserRegistration(response, obj);
        })
        .fail(function (error) {
          window.errorModule.showErrorPopup(error);
        });
    }
  }

  /**
   * newUserRegistration() // New User Create
   * @param {Object} createAccountResponse // user Registration Response
   * @param {Object} obj // Create Account Data
   */
  function newUserRegistration(createAccountResponse, obj) {
    if (
      createAccountResponse &&
      (!createAccountResponse?.errors ||
        createAccountResponse.statusCode !== 400)
    ) {
      //code for analytic create account success
      userDetails = analyticGetUserDetails(createAccountResponse);
      analyticCreateAccountData("true", "", userDetails);
      sendEmailToAccount(obj.email, obj.pwd);

      //}
    } else {
      $(".mailmessage").hide();
      document.getElementById("emailMsg").innerHTML =
        createAccountResponse.message;
      //revoke user submission
      $(".cmp-button").removeClass("hold-cmp-btn");
      // code for analytic create account failure
      analyticCreateAccountData("false", createAccountResponse.message, "");
    }
   // window.errorModule.checkError(createAccountResponse);
  }

  /**
   * checkoutGuestRegistration() // Create Account as Guest User
   * @param {Object} guestUserResponse // Guest User Registration Response
   * @param {Object} obj // Create Account Data
   */
  function checkoutGuestRegistration(guestUserResponse, obj) {
    if (guestUserResponse && guestUserResponse !== "") {
      if (
        guestUserResponse.statusCode != 401 &&
        guestUserResponse.statusCode != 400
      ) {
        //code for analytic create account success
        userDetails = analyticGetUserDetails(guestUserResponse);

        analyticCreateAccountData("true", "", userDetails);
        sendEmailToGuestAccount(obj.email, obj.pwd);
      }
      if (guestUserResponse.statusCode === 400) {
        $(".mailmessage").hide();
        document.getElementById("emailMsg").innerHTML =
          guestUserResponse.message;

        // code for analytic create account failure
        analyticCreateAccountData("false", guestUserResponse.message, "");
      }
    //  window.errorModule.checkError(guestUserResponse);
    }
  }
  /**
   * sendEmailToAccount() // Send Email to User after success full account created
   * @param {String} emailId
   * @param {String} pwd
   */
  function sendEmailToAccount(emailId, pwd) {
    var hostName = window.location.hostname;

    const data = {
      email: emailId,
      domainname: hostName
    };
    // Create Account
    window.getAPIModule
      .getCreateAccountEmail(data)
      .done(function (response) {
        createAccountEmail(response, pwd, emailId);
      })
      .fail(function (error) {
        //allow user to resubmit
        $(".cmp-button").removeClass("hold-cmp-btn");
      });
  }
  // Create Account Email
  function createAccountEmail(emailResponse, pwd, emailId) {
    if (emailResponse && emailResponse !== "") {
      if (emailResponse.statusCode != 400) {
        signinSpecific(emailId, pwd, true); // pass true for create account check
      }
    }
  }
  /**
   * sendEmailToGuestAccount() Send Email to Guest User After success full account created
   * @param {String} emailId
   * @param {String} pwd
   */
  function sendEmailToGuestAccount(emailId, pwd) {
    var hostName = window.location.hostname;
    const data = {
      email: emailId,
      domainname: hostName
    };
    //Create Account Email API CAll for GUEST USER
    window.getAPIModule
      .getCreateAccountEmail(data)
      .done(function (response) {
        createAccountEmailGuest(response, pwd, emailId);
      })
      .fail(function (error) {});
  }
  // Create Account Email
  function createAccountEmailGuest(emailResponse, pwd, emailId) {
    if (emailResponse && emailResponse !== "") {
      if (emailResponse.statusCode !== 400) {
        signinSpecific(emailId, pwd, true); // pass true for create account check
      }
    }
  }
  //code for get user id from user cookie
  function analyticGetUserDetails(response) {
    const accountResponse =
      response?.customerSignInResult?.customer?.addresses[0] || [];
    if (!accountResponse) {
      return;
    } else {
      //var country = accountResponse.country

      return `
        ${
          response?.customerSignInResult?.customer.custom.fields
            .industries[0] || ""
        }@@${accountResponse?.country || ""}@@${accountResponse?.city || ""}@@${
        accountResponse?.state || ""
      }@@${accountResponse?.postalCode || ""}`;
    }
  }

  //code to capture analytic success or failure
  function analyticCreateAccountData(status, error = "", userDetails) {
    var fn = "Create Account";
    var fa = "Create Account";
    if (userDetails != "") {
      userDetails = userDetails.trim();
    } else {
      userDetails = "";
    }
    formName = fn;
    formAction = fa;
    formError = error;
    formStatus = status;
    formCreatAccountDLCall(
      userDetails,
      formName,
      formError,
      formAction,
      formStatus
    );
  }
  window.validateRegistrationAccountDetails =
    validateRegistrationAccountDetails || {};
});
