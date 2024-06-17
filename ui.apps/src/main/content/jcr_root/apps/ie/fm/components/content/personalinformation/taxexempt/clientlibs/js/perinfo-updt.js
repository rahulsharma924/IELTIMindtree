(function ($) {
  function updatePersonalInformationCallToCT(
    firstName,
    lastName,
    phoneNumber,
    email,
    company,
    contactByEmail
  ) {
    $.ajax({
      url: "/bin/updatepersonalinfo",
      data: {
        contact: phoneNumber,
        lastName: lastName,
        email: email,
        firstName: firstName,
        company: company,
        contactByEmail: contactByEmail,
        CTCustomerToken: window.isCustomerToken(),
        bearerToken: window.getbearerToken()
      },
      success: function (updateRes, textstatus, xhr) {
        if (updateRes != null && updateRes != "") {
          if (
            xhr.status == 200 &&
            updateRes.statusCode != 400 &&
            updateRes.statusCode != 401
          ) {
            let existingCookiesData =
              $.fn.cookiesRead().logedInCookiesData() || {};
            existingCookiesData.customer = updateRes;
            commonUtility().customerInfoTTL(existingCookiesData);
            $(".info-loader-cls").addClass("d-none");
            $(".info-updated-block").removeClass("d-none");
            // window.location.href = "/"; // Redirect to home page after updated the details
          }
        }
      },
      error: function (error) {
        window.errorModule.showErrorPopup(error);
      }
    });
  }

  window.updatePersonalInformationCallToCT =
    updatePersonalInformationCallToCT || {};
})(jQuery);
