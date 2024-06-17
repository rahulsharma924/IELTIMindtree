$(document).ready(function () {
  $("#signOutBtnTextDesk").click(function () {
    $.ajax({
      type: "POST",
      url: "/bin/logout",
      data: {
        CTCustomerToken: window.isCustomerToken(),
        bearertoken: window.getbearerToken()
      },
      success: function (loginResponse, textstatus, xhr) {
        if (loginResponse == "") {
          //  window.errorModule.checkError(loginResponse);
          if (xhr.status == 200 && loginResponse.statusCode != 400) {
            var pathToReturn = getPath("returnToPath")
              ? getPath("returnToPath")
              : window.location.origin;

            deleteCookie();
            localStorage.removeItem("activecartcount");
            //address book page
            $(
              "#center__layout .shippingbillingaddress .my-address-cards"
            ).empty();

            //personal info page
            $("#new_form").trigger("reset");
            $(".taxexempt #cardList").empty();
            $(".taxexempt #states").empty();
            $(".taxexempt #erpCustId").empty();

            //order history table
            $(".table-data #orderListBody").empty();

            //for products ordered
            $(".product-ordered-section #prodcutorderedlist").empty();

            //for payment methods
            $("#payment_method_contaniner .card_data").empty();

            setTimeout(function () {
              window.location.href = pathToReturn;
            }, 1000);

            window.location.href = pathToReturn;
          }
        }
      },
      error: function (error) {
        window.errorModule.showErrorPopup(error);
      }
    });
  });
});
function deleteCookie() {
  document.cookie = "returnToPath=; path=/;";
  document.cookie =
    "customerInfo=; expires=Thu, 28 Dec 2022 00:00:00 UTC;path=/;";
  document.cookie =
    "refreshToken=; expires=Thu, 28 Dec 2022 00:00:00 UTC;path=/;";
}

function getPath(cookieName) {
  return getCookie(cookieName);
}

function getCookie(cookieName) {
  var pair = document.cookie
    .split("; ")
    .find((x) => x.startsWith(cookieName + "="));
  if (pair) return pair.split("=")[1];
}
