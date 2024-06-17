function updatePasswordCallToCT() {
  var obj = {};
  obj.currentpwd = $("#currentpassword").val();
  obj.newpwd = $("#newpassword").val();
  obj.cfrpwd = $("#confirmpassword").val();
  let email = $("#container-personal-info")
    .find("#new_form")
    .find("#email")
    .val();
  let newPassword = $("#newpassword").val();
  let $errorMessage = $("#newpasswordMsg");
  let isNewPwdValid = formValidation.validatePassword(
    newPassword,
    $errorMessage,
    email
  );
  let isCurrentPwdMatchwithNewPwd = formValidation.validateNewPwd(
    obj.newpwd,
    obj.currentpwd
  );
  if (
    isNewPwdValid === true &&
    obj.currentpwd !== "" &&
    obj.newpwd !== "" &&
    obj.cfrpwd !== "" &&
    obj.newpwd === obj.cfrpwd &&
    isCurrentPwdMatchwithNewPwd === true
  ) {
    $.ajax({
      type: "POST",
      url: "/bin/changepassword",
      data: {
        CTCustomerToken: window.isCustomerToken(),
        currentPassword: obj.currentpwd,
        newPassword: obj.newpwd,
        bearertoken: window.getbearerToken()
      },
      success: function (loginResponse, textstatus, xhr) {
        if (loginResponse != null && loginResponse != "") {
          //window.errorModule.checkError(loginResponse);
          if (xhr.status == 200 && loginResponse.statusCode != 400) {
            let resobj = JSON.parse(JSON.stringify(loginResponse));
            let customertTokenVal = resobj.customertoken;
            const cookie = $.fn.cookiesRead().logedInCookiesData() || {};
            const oldCookieVal = cookie ? cookie?.customer : [];
            let tokenUpdateObject = {
              customertoken: customertTokenVal,
              customer: oldCookieVal
            };
            commonUtility().customerInfoTTL(tokenUpdateObject);

            const modalPopDiv = document.createElement("div");

            modalPopDiv.innerHTML = `<div id="passwordChangeSuccess" class="password-change-success">
                                                    <div class="modal-content-filter">
                                                        <div class="modal-header-filter col-12">
                                                            <div class="txt">
                                                                   Update Password
                                                            </div>
                                                        </div>
                                                        <div class="modal-body-filter col-12">
                                                            <div class="txt">Password updated successfully!</div>
                                                        </div>
                                                        <div class="modal-footer-filter col-12">
                                                            <button class="ie-primary-btn continue">Continue</button>
                                                        </div>
                                                    </div>
                    
                                                </div>`;
            document.body.appendChild(modalPopDiv);
            $(".modal-footer-filter .continue").on("click", function () {
              $(".password-change-success").hide();
              $("#currentpassword").val("");
              $("#newpassword").val("");
              $("#confirmpassword").val("");
            });
          } else {
            const modalPopDiv = document.createElement("div");

            modalPopDiv.innerHTML = `<div id="passwordChangeSuccess" class="password-change-success">
                                                        <div class="modal-content-filter">
                                                            <div class="modal-header-filter col-12">
                                                                <div class="txt">
                                                                       Update Password
                                                                </div>
                                                            </div>
                                                            <div class="modal-body-filter col-12">
                                                                <div class="txt">Password update failed!</div>
                                                            </div>
                                                            <div class="modal-footer-filter col-12">
                                                                <button class="ie-primary-btn continue">Continue</button>
                                                            </div>
                                                        </div>
                        
                                                    </div>`;
            document.body.appendChild(modalPopDiv);
            $(".modal-footer-filter .continue").on("click", function () {
              $(".password-change-success").hide();
              $("#currentpassword").val("");
              $("#newpassword").val("");
              $("#confirmpassword").val("");
            });
          }
        }
      },
      error: function (error) {
        window.errorModule.showErrorPopup(error);
      }
    });
  }
}
function showConfirmPassword() {
  var x = document.getElementById("confirmpassword");
  if (x.type === "password") {
    x.type = "text";
    $(".pi-confirmpassword.fa-thin.fa-eye-slash").removeClass("fa-eye-slash");
    $(".pi-confirmpassword.fa-thin").addClass("fa-eye");
  } else {
    x.type = "password";
    $(".pi-confirmpassword.fa-thin.fa-eye").removeClass("fa-eye");
    $(".pi-confirmpassword.fa-thin").addClass("fa-eye-slash");
  }
}
