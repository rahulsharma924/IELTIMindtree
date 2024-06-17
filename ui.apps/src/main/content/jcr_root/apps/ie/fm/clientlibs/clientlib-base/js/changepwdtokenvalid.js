$(document).ready(function() {
    var url = window.location;
    var urlcheck=window.location.href;
    var tokenID = new URLSearchParams(url.search).get('tokenid');
    var bearerTokenVal=window.getbearerToken();
    if(tokenID != "" && urlcheck.includes("reset-password/create-new-password")){
        $.ajax({
            type: "GET",
            url:'/bin/tokenvalidation',
            data: {CTCustomerToken:tokenID, bearertoken: bearerTokenVal},
            success:function(changepwdresponse,textstatus,xhr){
            if(changepwdresponse!=null && changepwdresponse!=""){
                 if(xhr.status == 200 && changepwdresponse.statusCode != 404){
                     //changePasswordBUtton(tokenID);
				 //alert("token response");
                 } 
                if(changepwdresponse.statusCode === 404){
                   const modalPopDiv = document.createElement("div");

                        modalPopDiv.innerHTML =

                            `<div id="Resetpassword" class="reset_password">
                                                    <div class="modal-content-filter">
                                                        <div class="modal-header-filter col-12">
                                                            <div class="txt">
                                                                   Reset Password
                                                            </div>
                                                        </div>
                                                        <div class="modal-body-filter col-12">
                                                            <div class="txt">Your password reset link has been expired. Please try again.</div>
                                                        </div>
                                                        <div class="modal-footer-filter col-12">
															<button type="reset" class="ie-scondary-btn" data-dismiss="modal" aria-label="Cancel" >Cancel</button>
                                                            <button class="continue" id="resetpwdcontinue">Continue</button>
                                                        </div>
                                                    </div>
                    
                                                </div>`;
                        document.body.appendChild(modalPopDiv);
                        $('#resetpwdcontinue').on('click', function () {
                            window.location.href="/content/fm/en/reset-password.html";
                            $(".reset_password").hide();
                        });
                        $('.modal-footer-filter .ie-scondary-btn').on('click', function () {
                             $(".reset_password").hide();
                        });

                    }
                   // window.errorModule.checkError(changepwdresponse);
                 }
            },
            error: function(error){
                window.errorModule.showErrorPopup(error);
            }

    });
    }
});
