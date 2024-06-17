document.addEventListener(
  "DOMContentLoaded",
  function () {
    setTimeout(function () {
      analyticsOrderSummaryData();
    }, 6000);
  },
  false
);

function analyticsOrderSummaryData() {
  let itemsObj = "",
    purchaseDetailObj = "";
  let pageCategory = "checkout-success",
    itemsArr = [];
  let totalBeforeTax = "",
    estimatedTaxToBeCollected = "",
    total_amount = "",
    shippingAndHandling = "",
    shippingAmt = "",
    handlingAmt = "",
    estDelDate = "",
    orderNum = "";
  let paymentMethod = "",
    shippingMethod = "",
    shippingPostalcode = "",
    shippingState = "",
    shippingCity = "",
    shippingCountry = "",
    priceamt = "";
  estimatedTaxToBeCollected = $("#estimatedTax").text().trim();
  total_amount = $("#orderTotal").text().trim();
  shippingAndHandling = $("#estimatedShippingCharge").text().trim();
  totalBeforeTax = $("#totalBeforeTax").text().trim();
  orderNum = $("#orderNum").text().trim();
  let element = $("#analytics-productDetails")[0];
  let productDetails = "";
  let prodArray = "";
  if (typeof element.value != "undefined" && element.value !== "") {
    productDetails = element.value;
    prodArray = JSON.parse(productDetails);
  }
  let shippingInfoArr = "",
    shippingAddressArr = "",
    analyticsPaymentArr = "";
  if (element.hasAttribute("analytics-shippinginfo")) {
    shippingInfoArr = JSON.parse(
      element.getAttribute("analytics-shippinginfo")
    );
  }
  if (element.hasAttribute("analytics-address")) {
    shippingAddressArr = JSON.parse(element.getAttribute("analytics-address"));
  }
  if (element.hasAttribute("analytics-paymentinfo")) {
    analyticsPaymentArr = JSON.parse(
      element.getAttribute("analytics-paymentinfo")
    );
  }
  let items = document.querySelectorAll(".analyticssummaryprod");
  if (
    prodArray !== null &&
    items !== null &&
    prodArray !== undefined &&
    items !== undefined
  ) {
    for (i = 0; i < prodArray.length; i++) {
      if (prodArray[i].price !== null && prodArray[i].price !== undefined) {
        priceamt = (prodArray[i].price.value.centAmount / 100).toFixed(2);
      }
      let prodName = prodArray[i].name["en"]
        ? prodArray[i].name["en"]
        : prodArray[i].name["en-US"];
      let qty_num = prodArray[i].quantity ? prodArray[i].quantity : "";
      let total_qty = "",
        PurchaseOrders = "";
      for (let k = 0; k < prodArray.length; k++) {
        let qty = Number(prodArray[k].quantity);
        total_qty = qty + Number(total_qty);
        let prod_order =
          prodArray[k].variant?.sku ||
          prodArray[k].custom?.fields?.masterSku ||
          "";
        PurchaseOrders = prod_order + "|" + PurchaseOrders;
      }
      let lastLetter = PurchaseOrders.charAt(PurchaseOrders.length - 1);
      if (lastLetter.indexOf("|") !== -1) {
        PurchaseOrders = PurchaseOrders.substring(0, PurchaseOrders.length - 1);
      }
      let singleProductTotalAmt = (
        prodArray[i].totalPrice.centAmount / 100
      ).toFixed(2);
      shippingMethod = shippingInfoArr.shippingMethodName
        ? shippingInfoArr.shippingMethodName
        : "";
      shippingPostalcode = shippingAddressArr.postalCode
        ? shippingAddressArr.postalCode
        : "";
      shippingState = shippingAddressArr.state ? shippingAddressArr.state : "";
      shippingCity = shippingAddressArr.city ? shippingAddressArr.city : "";
      shippingCountry = shippingAddressArr.country
        ? shippingAddressArr.country
        : "";
      paymentMethod = analyticsPaymentArr.payments[0].obj?.interfaceId
        ? analyticsPaymentArr.payments[0].obj?.interfaceId
        : "";
      let analytics_prod_detail = "",
        productType = "",
        prod_sku = "",
        prod_id = "";
      if (
        items[i].getAttribute("data-analytics-prod-detail") !== null &&
        items[i].getAttribute("data-analytics-prod-detail") !== undefined
      ) {
        analytics_prod_detail = items[i].getAttribute(
          "data-analytics-prod-detail"
        );
      }

      if (
        prodArray[i].productType !== null &&
        prodArray[i].productType !== undefined
      ) {
        productType = prodArray[i].productType.id;
      }

      if (prodArray[i].variant !== null && prodArray[i].variant !== undefined) {
        prod_sku = prodArray[i].variant.sku;
      }

      if (
        prodArray[i].productId !== null &&
        prodArray[i].productId !== undefined
      ) {
        prod_id = prodArray[i].productId;
      }
      itemsObj =
        prod_sku +
        "@@" +
        prodName +
        "@@" +
        prod_id +
        "@@" +
        priceamt +
        "@@" +
        shippingAndHandling +
        "@@" +
        shippingAmt +
        "@@" +
        handlingAmt +
        "@@" +
        singleProductTotalAmt +
        "@@" +
        estimatedTaxToBeCollected +
        "@@" +
        total_amount +
        "@@" +
        estDelDate +
        "@@" +
        productType +
        "@@" +
        qty_num +
        "@@" +
        analytics_prod_detail;
      purchaseDetailObj =
        orderNum +
        "@@" +
        PurchaseOrders +
        "@@" +
        total_qty +
        "@@" +
        total_amount +
        "@@" +
        paymentMethod +
        "@@" +
        shippingMethod +
        "@@" +
        shippingPostalcode +
        "@@" +
        shippingState +
        "@@" +
        shippingCity +
        "@@" +
        shippingCountry;
      itemsArr.push(itemsObj);
    }
    purchaseDataLayer(itemsArr, purchaseDetailObj, pageCategory);
  }
}
//analytic code to track cta on checkout success page
document.querySelector("body").addEventListener(
  "click",
  function (e) {
    var buttonElement = e.target.closest("button");
    var label = "";
    var category = "";
    if (
      buttonElement !== null &&
      buttonElement.closest(".analyticcheckoutsuccess") != null &&
      buttonElement.closest(".analyticemailpopup") == null
    ) {
      if (buttonElement.closest(".analyticcheckoutsuccessprint") != null) {
        doccat =
          buttonElement.textContent.trim() +
          " - Order summary - Checkout Success";
        docid = "Print - Order summary";
        docname = "Print - Order summary";
        doctype = "Print";
        parameter =
          docname +
          "@@" +
          doctype +
          "@@" +
          "" +
          "@@" +
          "" +
          "@@" +
          "Checkout Success" +
          "@@" +
          "";
        parameterArray = parameter.split("@@");
        documentDLCall(parameterArray, "Click", doccat, docid);
      } else {
        label = buttonElement.textContent.trim();
        category = "Checkout success page";
        ctalinkDataLayerCall(label, category);
      }
    }
  },
  false
);

function analyticEmailSent(status, counter) {
  if (status != "" && counter == 1) {
    const fname = "Email order confirmation",
      faction = "Email order confirmation details",
      fstatus = status;
    formEmailCartDLcall(fname, faction, fstatus);
  }
}
