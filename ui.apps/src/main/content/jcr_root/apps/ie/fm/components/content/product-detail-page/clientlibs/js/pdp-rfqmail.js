  function sendPDPIEEmail() {
  let productDetails = $pdpGlobal.getProductDetailsForRFQ();
  let listOfItems = [];
  let totalPrice = productDetails.prodPrice;
  let item = {
    name: productDetails.prodName,
    image:
          `https://www.fairviewmicrowave.com/images/Product/Large/${productDetails.prodSku}.jpg` ||
          "",
    sku: productDetails.prodSku
   };
  listOfItems.push(item);
  cartRfqEmail(listOfItems, totalPrice);
  }
  
  function cartRfqEmail(listOfItems, totalPrice) {
    var hostName = window.location.hostname;
    var pageURL=window.location.href;
    var name=$("#firstName-rfq").val() +" "+ $("#lastName-rfq").val();
    var obj = {};
    obj.emailId = $("#email-rfq").val();
    const data = {
      email: obj.emailId,
      cartresponse: JSON.stringify(listOfItems),
      customername: name,
      linkurl:pageURL, 
      domainname: hostName
    };
    window.getAPIModule
      .getSendEmailRfq(data)
      .done(function (response) {
        //window.errorModule.checkError(response);
        if (response && !response.error) {
          $("#rfqModal").removeClass("show");
          $(".rfqModal-confirmation").modal("show");
          $(".rfqModal-confirmation .btn-close").on("click", function () {
            $(".rfqModal-confirmation").modal("hide");
          });
          $(".rfqModal-confirmation .rfqModal-close-link").on("click", function () {
            $(".rfqModal-confirmation").modal("hide");
          });
        }
      })
      .fail(function (error) {
        window.errorModule.showErrorPopup(error)
      });
  }
  