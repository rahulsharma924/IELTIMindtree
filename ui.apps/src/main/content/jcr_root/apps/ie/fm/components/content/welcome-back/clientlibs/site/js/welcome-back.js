$(document).ready(function () {
  const customerToken = window.isCustomerToken();
  const isOnlyCustomerToken = window.isOnlyCustomerToken();
    var rviewValue= localStorage.getItem("rviewsArray");
	var offset=0;
    var ordercount;
  if (isOnlyCustomerToken) {
    $.ajax({
      type: "POST",
      url: "/bin/orderhistory",
      data: {
        customer_token: customerToken,
        bearertoken: window.getbearerToken(),
        pageNo: "",
        pageSize: "",
        sortField: "", //
        sortingOrder: "" // asc/desc
      },
      success: function (orderHistoryResponse, textstatus, xhr) {
        if (orderHistoryResponse != null && orderHistoryResponse != "") {
          //window.errorModule.checkError(orderHistoryResponse);
          if (xhr.status == 200) {
            ordercount = orderHistoryResponse.total;
            var previousPageName = document.referrer;
            if (previousPageName.includes("successfullyaccountcreated-createaccount") && rviewValue == null) {
              $(".welcomeBack_main").addClass("hide");
            } else {
              showhidewelcomeback(ordercount, customerToken, rviewValue);
            }
          }
        }
      },
      error: function (error) {
        window.errorModule.showErrorPopup(error);
      }
    });
  }
    if(rviewValue != null && rviewValue != "" && !isOnlyCustomerToken){
        $(".welcomeBack_main").removeClass("hide");
    }
 });

function showhidewelcomeback(ordercount, tvalue, rviewValue) {

    if (tvalue != null && ordercount == 0 && rviewValue != "" && rviewValue != null) {
      $(".welcomeBack_main").removeClass("hide");
      $(".quickreorder_main").addClass("hide");
    }
  }