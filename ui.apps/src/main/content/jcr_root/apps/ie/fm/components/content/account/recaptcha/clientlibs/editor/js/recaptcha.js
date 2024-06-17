
  const secretKey = document.getElementById("secretKey");
  var RC2KEY = secretKey.getAttribute("data-googleKey");
  var doSubmit = false;
  function reCaptchaVerify(response) {
    if (response === document.querySelector(".g-recaptcha-response").value) {
      doSubmit = true;

      if (typeof $olccCreateAssembly.checkTheStatus != "undefined" && $olccCreateAssembly.checkTheStatus != null) {
        $olccCreateAssembly.checkTheStatus.postCaptcha();
      }

      $("#response-div").css("display", "none");

      $(".test_class").addClass("validate_border_remove");
    }
  }

  function reCaptchaExpired() {
    /* do something when it expires */
    document.querySelector(".captchaverify").innerHTML =
      "Verification expired. Re-check the box.";
    $("#response-div").css("display", "none");
  }

  function reCaptchaCallback() {
    grecaptcha.render("rcaptcha", {
      sitekey: RC2KEY,
      callback: reCaptchaVerify,
      "expired-callback": reCaptchaExpired
    });
  }

  /*$( '#save' ).click(function(){
  var $captcha = $( '#recaptcha' ),
      response = grecaptcha.getResponse();
  
  if (response.length === 0) {
    $( '#response-div').text( "reCAPTCHA is mandatory" );
    if( !$captcha.hasClass( "error" ) ){
      $captcha.addClass( "error" );
    }
  } else {
    $( '#response-div' ).text('');
    $captcha.removeClass( "error" );
    alert( 'reCAPTCHA marked' );
  }
})*/

