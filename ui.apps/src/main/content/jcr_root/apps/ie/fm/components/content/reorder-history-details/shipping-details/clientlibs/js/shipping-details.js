$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search),
    orderId = urlParams.get("order_id"),
    customer_token = window.isCustomerToken(),
    logedInUserData = $.fn.cookiesRead().logedInCookiesData() || {},
    $component = $(".shipping__details"),
    templateHandlerbar = $component.find(".shippng__details--handlerbar"),
    DATA = {
      order_id: orderId,
      customer_token: customer_token,
      bearertoken: window.getbearerToken()
    };
  // Api Response
  window.getAPIModule.getOrderHistoryDetails(DATA).then((data) => {
    if (data && !data.statusCode) {
      appendPaymentDetails(
        data,
        logedInUserData,
        $component,
        templateHandlerbar
      );
      appendSpecialInstructions(data);
    }
  });
});
function appendPaymentDetails(
  data,
  logedInUserData,
  $component,
  templateHandlerbar
) {
  let shippingDetails = {};
  if (data.shippingAddress) {
    var shippingInfo = data.shippingAddress;
    shippingDetails.firstName = shippingInfo.firstName || "";
    shippingDetails.lastName = shippingInfo.lastName || "";
    shippingDetails.streetNumber = shippingInfo.streetNumber || "";
    shippingDetails.streetName = shippingInfo.streetName || "";
    shippingDetails.city = shippingInfo.city || "";
    shippingDetails.state = shippingInfo.state || "";
    shippingDetails.postalCode = shippingInfo.postalCode || "";
    shippingDetails.country = shippingInfo.country || "";
  }
  if (data.billingAddress) {
    var billingInfo = data.billingAddress;
    shippingDetails.billFirstName = billingInfo.firstName || "";
    shippingDetails.billLastName = billingInfo.lastName || "";
    shippingDetails.billStreetNumber = billingInfo.streetNumber || "";
    shippingDetails.billStreetName = billingInfo.streetName || "";
    shippingDetails.billCity = billingInfo.city || "";
    shippingDetails.billState = billingInfo.state || "";
    shippingDetails.billPostalCode = billingInfo.postalCode || "";
    shippingDetails.billCountry = billingInfo.country || "";
  }
  if (logedInUserData) {
    shippingDetails.userfirstName = logedInUserData.customer.firstName || "";
    shippingDetails.userLastName = logedInUserData.customer.lastName || "";
    shippingDetails.userEmail = logedInUserData.customer.email || "";
    if (data?.shippingInfo?.shippingMethodName.indexOf("NOSHIPPING") > -1) {
      shippingDetails.shippingMethodName = "No shipping method";
    } else {
      shippingDetails.shippingMethodName =
        data?.shippingInfo?.shippingMethodName || "";
    }
  }
  let dataHandlerbar = templateHandlerbar.html();
  let template = window.Handlebars.compile(dataHandlerbar);

  $component.append(template(shippingDetails));
}
function appendSpecialInstructions(data){
$('.order__instruction').find('.order__instruction--dis').text(data?.custom?.fields?.instructions);
}