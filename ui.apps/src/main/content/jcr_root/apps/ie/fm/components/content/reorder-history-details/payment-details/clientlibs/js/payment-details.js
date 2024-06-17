$(document).ready(function () {
  let salesTax, subTotalPrice, shippingAndHandlingPrice, res;
  const $component = $(".payment__details");
  const urlParams = new URLSearchParams(window.location.search),
    orderId = urlParams.get("order_id"),
    customer_token = window.isCustomerToken(),
    DATA = {
      order_id: orderId,
      customer_token: customer_token,
      bearertoken: window.getbearerToken()
    };
  // Api Response
  window.getAPIModule.getOrderHistoryDetails(DATA).then((data) => {
    if (data && !data.statusCode) {
      res = data;
      salesTaxes(data);
      subTotal(data);
      shippingAndHandling(data);
      markupGenerate();
    }
  });

  /**
   * Sales Tax
   */

  function salesTaxes(response) {
    if (response && response.taxedPrice?.totalTax) {
      salesTax = Number(formatPrice(response.taxedPrice?.totalTax));
    }
    else {
      salesTax = "";
    }
  }

  /**
   * subtotal totalPrice > (totalNet - ShippingAndHandling)
   */
  function subTotal(response) {
    if (response) {
      subTotalPrice =
        Number(formatPrice(response.taxedPrice?.totalNet || response.totalPrice)) -
        shippingAndHandling(response);
    }
    else {
      subTotalPrice = "";
    }
  }

  /**
   * shipping and handling
   */
  function shippingAndHandling(response) {
    if (response && response.shippingInfo?.price) {
      shippingAndHandlingPrice = Number(
        formatPrice(response.shippingInfo.price)
      );
      if (response.customLineItems && response.customLineItems.length) {
        const index = response.customLineItems.findIndex((object) => {
          return object.slug === "WireTransfer_HandlingCharge";
        });
        index != -1
          ? (shippingAndHandlingPrice =
              shippingAndHandlingPrice + onlyHandling(response, index))
          : shippingAndHandlingPrice;
      }
      return shippingAndHandlingPrice;
    } else {
      return (shippingAndHandlingPrice = 0);
    }
  }

  /**
   * Only Handling
   */
  function onlyHandling(response, index) {
  let handlingPrice;
    return (handlingPrice = Number(
      formatPrice(response.customLineItems[0].money)
    ));
  }

  /**
   * Formate Price
   */
  function formatPrice(price) {
    var divideBy = Math.pow(10, Number(price.fractionDigits));
    return Number(Number(price.centAmount) / divideBy).toFixed(2);
  }

  /**
   * parseFloat number
   */
  function parseFloatNumber(value) {
    return parseFloat(value).toFixed(2);
  }

  /**
   * markupGenerate();
   */
  function markupGenerate() {
    // Binding Data with Dom Element
    var $paymentDetails = $(".payment-details-table");

    if (subTotalPrice) {
      $paymentDetails
        .find(".payment-details__subtotal")
        .text("$" + window.priceFormate.formateCheckout(subTotalPrice));
    }

    if (salesTax) {
      $paymentDetails
        .find(".payment-details__sales-tax")
        .text("$" + window.priceFormate.formateCheckout(salesTax));
    }

    if (shippingAndHandlingPrice) {
      $paymentDetails
        .find(".payment-details__shipping-handling")
        .text("$" + window.priceFormate.formateCheckout(shippingAndHandlingPrice));
    }

    if (subTotalPrice || salesTax || shippingAndHandlingPrice) {
      var totalPrice = 0;
      if(subTotalPrice){
        totalPrice += subTotalPrice;
      }
      if(salesTax){
        totalPrice += salesTax;
      }
      if(shippingAndHandlingPrice){
        totalPrice += Number(shippingAndHandlingPrice);
      }
      totalPrice = window.priceFormate.formateCheckout(totalPrice);
      if (totalPrice) {
        $paymentDetails.find(".payment-details__total").text("$" +totalPrice);
      }
      if ($("#totalPrice")) {
        $("#totalPrice").text(("$"+ totalPrice) || "");
      }
    }

    // Updated payment details.
    if ($(".payment-details__source")) {
      const paymentInfo = res?.paymentInfo?.payments
        ? res.paymentInfo.payments[0]
        : [];
      if (!paymentInfo || !paymentInfo.obj) {
        return;
      }
      const paymentInfoStatus = paymentInfo.obj;
      if (
        paymentInfoStatus &&
        paymentInfoStatus?.interfaceId?.indexOf("PO") > -1 &&
        res.custom?.fields &&
        res.custom?.fields.purchaseOrderNumber
      ) {
        $(".payment-details__source").html(
          "PO : " + res.custom?.fields.purchaseOrderNumber
        );
      } else if (
        paymentInfoStatus &&
        paymentInfoStatus?.interfaceId?.indexOf("WireTransfer") > -1
      ) {
        $(".payment-details__source").html($component.attr("data-label"));
      } else if (
        res.paymentInfo?.payments &&
        res.paymentInfo?.payments.length &&
        res.paymentInfo?.payments[0].obj
      ) {
        if (
          res.paymentInfo?.payments[0].obj.transactions &&
          res.paymentInfo?.payments[0].obj.transactions.length
        ) {
          var fieldsType =
            res.paymentInfo?.payments[0].obj.transactions[0].custom.fields;
          if (fieldsType) {
            if (fieldsType.cardType) {
              $(".payment-details__source").find(".card-logo").html("Card");
            }
            $(".payment-details__source")
              .find(".card-num")
              .text("*** *** *** " + fieldsType.last4Digits);
          }
        } else {
          if (res.paymentInfo?.payments[0].obj.paymentMethodInfo) {
            const paymentName = res.paymentInfo?.payments[0].obj.paymentMethodInfo.name.en
            $(".payment-details__source").html(paymentName);
          }
        }
        
      }
    }
  }
});
