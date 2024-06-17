$(document).ready(function () {
  const userInfo = $.fn.cookiesRead().logedInCookiesData() || {},
    userInfoData = userInfo ? userInfo?.customer : [];
  if (userInfoData) {
    if ($("#firstName") != null) {
      $("#firstName").val(userInfoData.firstName);
    }
    if ($("#lastName") != null) {
      $("#lastName").val(userInfoData.lastName);
    }
    if ($("#company") != null && userInfoData.companyName !== "NA") {
      $("#company").val(userInfoData.companyName);
    }
    if ($("#email") != null) {
      $("#email").val(userInfoData.email);
    }
    if ($("#phoneNumber") != null) {
      $("#phoneNumber").val(userInfoData?.custom?.fields?.contact);
    }
    if ($(".subscribe-block") != null) {
      let contactByEmail = userInfoData?.custom?.fields?.contactByEmail;
      if (contactByEmail) {
        $(".personalinfo_input").prop("checked", true);
      } else {
        $(".personalinfo_input").prop("checked", false);
      }
    }
  }
  // Account => Personal Information
  // Save Button
  const $saveButton = $("#save");
  if (!$saveButton) {
    return;
  }
  $("#container-personal-info").find("input").removeAttr("onkeyup");
  $saveButton.parent().addClass("custom_save_btn");
  if ($saveButton.find(".custom_save_btn")) {
    $saveButton.parent().parent().addClass("custom__save--button");
  }
  $saveButton.on("click", function (e) {
    const $currentTarget = $(e.currentTarget);
    const $rootElement = $currentTarget.parents("#container-personal-info");
    if (!$rootElement) {
      return;
    }

    let firstName = $rootElement.find("#firstName").val(),
      lastName = $rootElement.find("#lastName").val(),
      phoneNumber = $rootElement.find("#phoneNumber").val(),
      email = $rootElement.find("#email").val(),
      company = $rootElement.find("#company").val(),
      contactByEmail = $("#checkbox").is(":checked");

    if (
      formValidation.validateFirstName(
        $rootElement.find("#firstName").next(),
        firstName
      ) &&
      formValidation.validateLastName(
        $rootElement.find("#lastName").next(),
        lastName
      ) &&
      formValidation.validatePhoneNumber(
        $rootElement.find("#phoneNumber").next(),
        phoneNumber
      ) &&
      formValidation.validateEmail($rootElement.find("#email").next(), email) &&
      formValidation.validatePerCompany(
        $rootElement.find("#company").next(),
        company
      )
    ) {
      $(".info-updated-block").addClass("d-none");
      $(".info-loader-cls").removeClass("d-none");
      $("#SavedModal").modal("show");
      updatePersonalInformationCallToCT(
        firstName,
        lastName,
        phoneNumber,
        email,
        company,
        contactByEmail
      );
    }
  });
  // Personal Information: Change Password Save
  const $changePwdBtn = $("#chngepwdsave");
  if (!$changePwdBtn) {
    return;
  }

  if ($changePwdBtn) {
    $changePwdBtn.parent().addClass("custom_save_btn");
    $changePwdBtn
      .parent()
      .parent()
      .removeClass("button aem-GridColumn aem-GridColumn--default--5");
    $changePwdBtn
      .parent()
      .parent()
      .addClass(
        "changepasswordbutton aem-GridColumn--default--none aem-GridColumn aem-GridColumn--offset--default--0 aem-GridColumn--default--1"
      );

    $changePwdBtn.click(function () {
      // function updatePassword() {
      let currPwd = $("#currentpassword").val();
      let newPwd = $("#newpassword").val();
      let confirmPwd = $("#confirmpassword").val();

      formValidation.validatePwds(currPwd, newPwd, confirmPwd);
      updatePasswordCallToCT();
    });
  }

  // Personal Information: Cancel the form
  const $clearPersonalInformationBtn = $("#cancel");
  if (!$clearPersonalInformationBtn) {
    return;
  }
  if ($clearPersonalInformationBtn) {
    $clearPersonalInformationBtn.parent().addClass("custom_cancel_btn");
    $clearPersonalInformationBtn
      .parent()
      .parent()
      .removeClass("button aem-GridColumn aem-GridColumn--default--5");
    $clearPersonalInformationBtn
      .parent()
      .parent()
      .addClass(
        "personalinformationbutton aem-GridColumn--default--none aem-GridColumn aem-GridColumn--offset--default--0 aem-GridColumn--default--1"
      );
    $clearPersonalInformationBtn.click(function () {
      //function clearPersonalInformationFields() {
      $("#firstName").val("");
      $("#lastName").val("");
      $("#phoneNumber").val("");
      $("#company").val("");
      $("#industryoption").selectedIndex = 0;
    });
  }

  // Personal Information : Password Cancel Button
  const $pwdCancelBtn = $("#pwdcancelbutton");
  if (!$pwdCancelBtn) {
    return;
  }
  if ($pwdCancelBtn) {
    $pwdCancelBtn.parent().addClass("custom_cancel_btn");
    $pwdCancelBtn
      .parent()
      .parent()
      .removeClass("button aem-GridColumn aem-GridColumn--default--5");
    $pwdCancelBtn
      .parent()
      .parent()
      .addClass(
        "passwordcancelbutton aem-GridColumn--default--none aem-GridColumn aem-GridColumn--offset--default--0 aem-GridColumn--default--1"
      );
    $pwdCancelBtn.click(function () {
      $("#currentpassword").val("");
      $("#newpassword").val("");
      $("#confirmpassword").val("");
    });
  }
  // personalInfo Subscribe
  const $personalinfo = $(".personalinfo_input");
  if (!$personalinfo) {
    return;
  }
});
