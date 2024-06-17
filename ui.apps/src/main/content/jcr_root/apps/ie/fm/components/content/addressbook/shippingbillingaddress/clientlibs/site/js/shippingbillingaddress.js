// Appending My account content to modal on mobile and tablet view starts
const myaccountleftnavdata = window.matchMedia("(max-width: 833px)");
if (myaccountleftnavdata.matches) {
  // If media query matches
  const myAccountModalBody = document.getElementById(
    "MyAccountMobilerespModal"
  );
  const myAccountuserDetails = document.getElementById("useraccdetails");
  const myAccountForm = document.querySelector("#myaccount-container-left");
  if (myAccountuserDetails && myAccountForm) {
    myAccountModalBody.appendChild(myAccountForm);
    myAccountModalBody.insertBefore(myAccountuserDetails, myAccountForm);
  }
}
// Appending My account content to modal on mobile and tablet view ends
