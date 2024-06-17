(function ($) {
  if (!$) {
    return;
  }
  const cookiesInfo = $.fn.cookiesRead() || false;
  if (cookiesInfo.refreshToken()) {
    const refreshToken = cookiesInfo.refreshToken() || "",
      bearerToken = window.getbearerToken() || "";
    if (!cookiesInfo.logedInCookiesData()) {
      // If customer token expired
      window.getAPIModule
        .getRefreshToken({ refreshToken, bearerToken })
        .done(function (data) {
          if (data && !data.errors?.length) {
            commonUtility().customerInfoTTL(data);
            refreshLogin();
          }
        })
        .fail(function (error) {
          window.errorModule.showErrorPopup(error);
        });
    } else {
      refreshLogin();
    }
  }
  /**
   * refreshLogin() // if user enabled the remember password, then this method will be call before login
   */
  function refreshLogin() {
    const HOST_NAME = window.location;
    if (HOST_NAME.href.includes("sign-in")) {
      if (HOST_NAME.hostname === "localhost") {
        let url = HOST_NAME.href.replace("sign-in", "homepage");
        HOST_NAME.href = url;
      } else {
        HOST_NAME.href = "/";
      }
    }
  }
})(jQuery);
function signinSpecific(email, pwd, isCreateAccount) {
  const endPoint = $.fn.getAPIEndpoint(),
    redirectURL = endPoint?.damEndpoint?.redirectURL;
  const isRememberMe = $("#rememberme").is(":checked");
  let loginDetails = {};
  let $email = $("#signinemail").val();
  let $pwd = $("#signinpwd").val();

  if (isCreateAccount && email && pwd) {
    loginDetails.email = email;
    loginDetails.pwd = pwd;
  } else {
    loginDetails.email = $email;
    loginDetails.pwd = $pwd;
  }

  const urlCheck = window.location.href;
  if (urlCheck.includes("checkout") || $.fn.cookiesRead().isGuestUserToken()) {
    const customerToken = window.isCustomerToken();
    $.ajax({
      type: "POST",
      url: "/bin/checkoutLogin",
      data: {
        CTCustomerToken: customerToken,
        email: loginDetails.email,
        password: loginDetails.pwd,
        bearertoken: window.getbearerToken()
      },
      success: function (loginResponse, textstatus, xhr) {
        if (loginResponse != null && loginResponse != "") {
          if (loginResponse?.errors) {
            if (loginResponse.statusCode == 403)
              window.errorModule.showErrorPopup(loginResponse);
            else errorPopup(loginResponse);
            console.error(loginResponse?.message);
          }

          if (
            xhr.status === 200 &&
            loginResponse.statusCode !== 401 &&
            loginResponse.statusCode !== 400
          ) {
            commonUtility().customerInfoTTL(loginResponse, isRememberMe);

            // Delete guestUser Token from cookies after successful login
            document.cookie =
              "anonymousCustomerInfo=; expires=Thu, 28 Dec 2022 00:00:00 UTC;path=/;";

            // Redirect URL after login account
            if (urlCheck.includes("checkout")) {
              window.location.href = redirectURL.shippingInformation;
            } else {
              getPathHelper();
            }
          }
        }
      },
      error: function (error) {
        window.errorModule.showErrorPopup(error);
      }
    });
  } else {
    $.ajax({
      type: "POST",
      url: "/bin/signin",
      data: {
        email: loginDetails.email,
        pwd: loginDetails.pwd,
        bearerToken: window.getbearerToken()
      },
      success: function (loginResponse, textstatus, xhr) {
        if (loginResponse != null && loginResponse != "") {
          if (loginResponse?.errors) {
            if (loginResponse.statusCode == 403)
              window.errorModule.showErrorPopup(loginResponse);
            else errorPopup(loginResponse);
            // code for analytic sign-in failure
            analyticSigninDatCapture("false", "Invalid Login", "");
          }

          if (
            xhr.status === 200 &&
            loginResponse.statusCode !== 401 &&
            loginResponse.statusCode !== 400
          ) {
            //method for customerInfo cookie with ttl for 48 hrs
            commonUtility().customerInfoTTL(loginResponse, isRememberMe);
            // code for analytic sign-in success
            let loggedinUserID = analyticGetUserID();
            analyticSigninDatCapture("true", "", loggedinUserID);
            // Redirect URL after created account
            if (isCreateAccount) {
              urlRedirect(redirectURL);
            } else {
              //redirect user to his active place
              getPathHelper();
            }

            //redirect user to his active place
          }
        }
      },
      error: function (error) {
        window.errorModule.showErrorPopup(error);
      }
    }).fail(function (error) {
      window.errorModule.showErrorPopup(error);
    });
  }
}
/**
 * urlRedirect() / Redirect URl after create account successfully
 */
function urlRedirect(redirectURL) {
  let urlCheck = window.location.href;
  if (urlCheck.includes("checkout")) {
    window.location.href = redirectURL.shippingInformation;
  } else if (urlCheck.includes("personal-information")) {
    window.location.href = redirectURL.personalInformation;
  } else {
    window.location.href = redirectURL.successAccountCreated;
  }
}

/**
 * getPathHelper()
 */
function getPathHelper() {
  const pathToReturn = getPath("returnToPath");
  if (pathToReturn) {
    window.location.href = pathToReturn;
  } else {
    window.location.href = window.location.origin;
  }
}
//code for analytic sign in success or failure capture
function analyticSigninDatCapture(status, error = "", uid) {
  let fn = "Login",
    fa = "User Login",
    id,
    userid,
    webid;
  if (uid != "") {
    id = uid.split("@@");
    userid = id[0];
    webid = id[1].split("-")[0];
  } else {
    userid = "";
    webid = "";
  }

  let formName = fn,
    formAction = fa,
    formError = error,
    formStatus = status;
  formDataLayerCall(userid, formName, formError, formAction, formStatus, webid);
}
//code for get user id from user cookie
function analyticGetUserID() {
  const cookiesInfo = $.fn.cookiesRead().logedInCookiesData() || [];

  let customerId = cookiesInfo?.customer.id || "";
  let customerWebId = cookiesInfo?.customer.key;

  return customerId + "@@" + customerWebId;
}

/* Error Popup*/ // After Enter Invalid email and password this popup will be displayed
function errorPopup(loginResponse) {
  const loginError = loginResponse.errors[0];
  const errorMessage = $(".login__error--field").data(),
    errorDiscriptionClass = ".error__discription",
    errorTitleClass = ".error__title";
  const modalPopDiv = document.createElement("div");

  modalPopDiv.innerHTML = `<div id="login-error-popup" class="login-error-popup d-none">
                        <div class="modal-content-filter">
                           <div class="modal-header-filter">
                              <div class="icon"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i></div>
                              <div class="filter-text">
                                    <span class="txt-bold error__title"></span>
                              </div>
                              <p class="error__discription d-none"></p>
                              <span class="close" data-dismiss="modal" aria-label="Close">
                              <i class="fa fa-close"></i>
                              </span>
                           </div>
                        </div>
                     </div>`;

  document.body.appendChild(modalPopDiv);
  const $loginErrorPopupSelector = $("#login-error-popup");
  if (
    loginError.code === "ACCOUNT_LOCKED" &&
    loginError.remainingAttempts === 0
  ) {
    $loginErrorPopupSelector.addClass("show__account--error--message");
    $loginErrorPopupSelector
      .find(errorTitleClass)
      .text(errorMessage.accountLockedTitle);
    $loginErrorPopupSelector
      .find(errorDiscriptionClass)
      .html(
        `${errorMessage.accountLockedDiscription} please <a class="error__discription--link" href="/${errorMessage.accountResetPasswordLink}">reset password</a>`
      );
    $loginErrorPopupSelector.find(errorDiscriptionClass).removeClass("d-none");
  } else if (
    loginError.code === "INVALID_CREDENTIALS" &&
    loginError.remainingAttempts === 2
  ) {
    $loginErrorPopupSelector.addClass("show__account--error--message");
    $loginErrorPopupSelector
      .find(errorTitleClass)
      .text(errorMessage.invalidLoginTitle);
    $loginErrorPopupSelector
      .find(errorDiscriptionClass)
      .html(`${errorMessage.invalidLoginDiscription}`);
    $loginErrorPopupSelector.find(errorDiscriptionClass).removeClass("d-none");
  } else {
    $loginErrorPopupSelector
      .find(errorTitleClass)
      .text(errorMessage.invalidLoginTitle);
    $loginErrorPopupSelector.find(errorDiscriptionClass).empty();
  }
  // Reset Email and password after invalid login
  $("#signinemail").val("");
  $("#signinpwd").val("");
  $loginErrorPopupSelector.removeClass("d-none").css("display", "block");
  $("html, body").animate(
    { scrollTop: ($loginErrorPopupSelector.offset().top = 0) },
    0.05
  );

  $(".modal-header-filter .close").on("click", function () {
    $(".login-error-popup").hide();
  });
}
