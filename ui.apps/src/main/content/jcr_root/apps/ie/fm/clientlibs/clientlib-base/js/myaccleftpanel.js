$(document).ready(function () {
  if ($("#myaccount-container-left").length) {
    highlightCurrentURL();
  }

  function highlightCurrentURL() {
    var pi = document
      .getElementById("myacclink-subheading-pi")
      .getElementsByTagName("a");

    for (var i = 0; i < pi.length; i++) {
      if (pi[i].href.split("#")[0] == document.location.href.split("#")[0]) {
        pi[i].className = "current";
      }
    }

    var ab = document
      .getElementById("myacclink-subheading-ab")
      .getElementsByTagName("a");

    for (var i = 0; i < ab.length; i++) {
      if (ab[i].href.split("#")[0] == document.location.href.split("#")[0]) {
        ab[i].className = "current";
      }
    }

    var po = document
      .getElementById("myacclink-subheading-po")
      .getElementsByTagName("a");

    for (var i = 0; i < po.length; i++) {
      if (po[i].href.split("#")[0] == document.location.href.split("#")[0]) {
        po[i].className = "current";
      }
    }

    var pm = document
      .getElementById("myacclink-subheading-pm")
      .getElementsByTagName("a");

    for (var i = 0; i < pm.length; i++) {
      if (pm[i].href.split("#")[0] == document.location.href.split("#")[0]) {
        pm[i].className = "current";
      }
    }
  }

  // Appending My account content to modal on mobile and tablet view starts
  const myaccountleftnavdata = window.matchMedia("(max-width: 833px)");
  if (myaccountleftnavdata.matches) {
    // If media query matches
    const myAccountModalBody = document.getElementById(
      "MyAccountMobilerespModal"
    );
    const myAccountuserDetails = document.getElementById("useraccdetails");
    if (myAccountuserDetails) {
      const myAccountForm = document.querySelector("#myaccount-container-left");
      myAccountModalBody.appendChild(myAccountForm);
      myAccountModalBody.insertBefore(myAccountuserDetails, myAccountForm);
    }
  } 
  // Appending My account content to modal on mobile and tablet view ends
  // Utility JSON
  //const utilityResponseLabelMyacc = utilityMessage;
  
 /* var payment_vendor = "Paypal";
  if (payment_vendor == "Paypal" ){
    $("#myacclink-heading-bg").parent('.text').hide();
    $("#myacclink-subheading-pm").parent('.text').hide();
  }*/

});
