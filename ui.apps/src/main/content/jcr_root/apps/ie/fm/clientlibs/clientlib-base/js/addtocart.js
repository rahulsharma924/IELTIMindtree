/**
 * @param {*} AddTocart Functinality Added here
 */
var amtValonKey;
var jsonOfCountries;
// Country List
window.getAPIModule.getCountryList().done(function (data) {
  jsonOfCountries = data ? data : [];
});

/**
 * addplus() // increase cart quantity after clicknk on plus (+)
 * @param {CurrentEvent} event
 */
function addplus(event) {
  let isitemcustom = $(event).attr("data-isitemcustom");
  let isShoppingCartPage = $(event).parents().hasClass("shopping__cart");

  var amount = Number($(event).siblings(".qty_num").val());
  let getParentID = $(event).closest(".relatedProducts").length;
  if (getParentID > 0) {
    var maxValueOfProd = $(event).siblings(".qty_num").attr("dat-avail");
  } else {
    var maxValueOfProd = 99999;
  }
  var isDepleted = $(event).siblings(".qty_num").attr("algolio_isdiscontinued");
  var algoliaInven = Number(
    $(event).siblings(".qty_num").attr("algolio_inven")
  );

  if (isDepleted !== undefined && algoliaInven !== undefined) {
    if (isDepleted === "true") {
      maxValueOfProd = algoliaInven;
    }
  }
  if (amount < maxValueOfProd) {
    amount++;
    $(event).siblings(".qty_num").val(amount);
    $(event)
      .parent(".qty")
      .siblings(".cart-button")
      .attr("data-cartqty", amount);
  }
  $(event).parent(".qty").siblings(".cart-button").attr("data-cartqty", amount);
  // Only Applied changes for Shopping Cart page, if same functionality required the please add one more condition
  if (isShoppingCartPage) {
    disablePlusMinus(event);
    cartPageCartUpdate(event, isitemcustom);
  }
}

/**
 * addminus() // decrease cart quantity after clicknk on minus (-)
 * @param {CurrentEvent} event
 */
function addminus(event) {
  let isitemcustom = $(event).attr("data-isitemcustom");
  let isShoppingCartPage = $(event).parents().hasClass("shopping__cart");

  var amount = Number($(event).siblings(".qty_num").val());
  if (amount > 1) {
    amount--;
    $(event).siblings(".qty_num").val(amount);
    $(event)
      .parent(".qty")
      .siblings(".cart-button")
      .attr("data-cartqty", amount);
  }
  $(event).parent(".qty").siblings(".cart-button").attr("data-cartqty", amount);
  // Only Applied changes for Shopping Cart page, if same functionality required the please add one more condition

  if (isShoppingCartPage) {
    disablePlusMinus(event);
    cartPageCartUpdate(event, isitemcustom);
  }
}

/**
 * addSummaryKey()
 * @param {CurrentEvent} event
 */
function addSummaryKey(event) {
  amtValonKey = $(event).val();
}

/**
 * addSummary()
 * @param {CurrentEvent} event
 */
function addSummary(event) {
  let isitemcustom = $(event).attr("data-isitemcustom");
  var amount = Number($(event).val());
  if (amount > 99999 || amount < 1) {
    $(event).val(amtValonKey);
  }
  $(event).parent(".qty").siblings(".cart-button").attr("data-cartqty", amount);
  cartPageCartUpdate(event, isitemcustom);
}

/**
 * changeQuantityAttribute()
 * @param {CurrentEvent} event
 */
function changeQuantityAttribute(event) {
  let qtyOfSku = Number($(event).val());
  if (qtyOfSku >= 1 && qtyOfSku <= 99999) {
    $(event)
      .parent(".qty")
      .siblings(".cart-button")
      .attr("data-cartqty", qtyOfSku);
  } else {
    $(event).val("");
  }
}

function checkValidationQuantity(event) {
  if ($(event).val() < 1 || $(event).val() > 99999 || $(event).val() == "")
    $(event).val(1);
}

/**
 * addtocartSpecific() // Add item in cart
 * @param {CurrentEvent} event
 */

function addtocartSpecific(event) {
  var currencyValue = event.getAttribute("data-currency") || "USD";
  var skuValue = event.getAttribute("data-sku");
  var quantity = event.getAttribute("data-cartqty") || 1;
  var cusToken = window.isCustomerToken();
  if (!skuValue) {
    return;
  }

  const data = {
    CTCustomerToken: cusToken,
    currency: currencyValue,
    sku: skuValue,
    quantity: quantity,
    bearertoken: window.getbearerToken()
  };
  // CAll addToCart Method
  window.getAPIModule
    .addToCart(data)
    .done(function (result) {
      if (result && (!result?.errors || result.statusCode !== 400)) {
        // Add anonymous token for guest user
        if (!cusToken) {
          guestUserTTL(result);
        }
        // Update MiniCart
        $(document).trigger(
          $.fn.getAPIEndpoint().customEvent.SHOPPING_CART_RESPONSE,
          result?.cart
        );
        // Removing the focus of button after adding the item to the cart
        if ($(".cart-button").length) {
          $(".cart-button").blur();
        }
        //analytics code here
        let orderbtn = event.className.includes("analytic-reorder-btn");
        let reorderProductArr = [];
        if (orderbtn) {
          customlineitems = result.cart.customLineItems;
          lineitems = result.cart.lineItems;
          if (customlineitems?.length > 0 || lineitems?.length > 0) {
            reorderProductArr = [...customlineitems, ...lineitems];
          }
          addToCartAllProdDL(
            reorderProductArr,
            (quantity = ""),
            (rfcaTesting = ""),
            (pageCategory = "order-history-details")
          );
        } else {
          var productVal = event.getAttribute("data-analyticcartprod");
          if (productVal) {
            let productDetailsArray = productVal.split("@@");
            for (let i = 0; i < productDetailsArray.length; i++) {
              if (productDetailsArray[i] === "undefined") {
                productDetailsArray[i] = "";
              }
            }
            addToCartDataLayer(skuValue, quantity, productDetailsArray, "plp");
          }
        }
      }
      //window.errorModule.checkError(result);
    })
    .fail(function (error) {
      console.log(error);
      window.errorModule.showErrorPopup(error);
    });
}

//add to cart for custom Length
function addToCartCustomLength(event) {
  let currencyValue = "USD",
    masterSKU = event.getAttribute("data-master-sku"),
    quantity = event.getAttribute("data-cartqty") || 1,
    unitOfMeasurement = "IN",
    cusTocken = window.isCustomerToken() || "",
    length = event.getAttribute("data-length"),
    bearerToken = window.getbearerToken(),
    testingPrice = "na";

  if (
    currencyValue != null &&
    currencyValue != "undefined" &&
    currencyValue != ""
  ) {
    if (masterSKU != null && masterSKU != "undefined" && masterSKU != "") {
      $.ajax({
        type: "PUT",
        url: "/bin/olcc/addcustomlengthtocart",
        data: {
          CTCustomerToken: cusTocken,
          currency: currencyValue,
          unitOfMeasurement: unitOfMeasurement,
          length: length,
          masterSku: masterSKU,
          quantity: quantity,
          bearertoken: bearerToken,
          cableAssemblyTesting: JSON.stringify(testingPrice)
        },
        success: function (loginResponse, textstatus, xhr) {
          //window.errorModule.checkError(loginResponse);
          if (
            loginResponse != null &&
            loginResponse != "" &&
            !loginResponse.errors &&
            !loginResponse.error
          ) {
            if (xhr.status == 200 && loginResponse.statusCode != 404) {
              //var skuidvalue = JSON.parse(localStorage.getItem('skuids'));
              // Add anonymous token
              if (!cusTocken) {
                document.cookie =
                  "anonymousCustomerInfo=" +
                  JSON.stringify(loginResponse.anonymousToken) +
                  ";path=/";
              }
              // Updated the Cart Item
              if (loginResponse.cart?.lineItems.length) {
                $(".cart-container .cart-counter").text(
                  loginResponse.cart?.lineItems.length
                );
              }
              // Update MiniCart
              $(document).trigger(
                $.fn.getAPIEndpoint().customEvent.SHOPPING_CART_RESPONSE,
                loginResponse?.cart
              );
              $(".cart-button").blur();
              //code for analytic add to cart datalayer call
              let analyticCustomItem,
                productAddedSKU,
                addTocartProductArr,
                productLength,
                productarraySlug,
                rfcaTestingVal = false,
                pageCategory;
              analyticCustomItem = "";
              analyticCustomItem = loginResponse?.cart?.customLineItems;
              productAddedSKU = masterSKU;
              addTocartProductArr = [];
              productLength = length || "";

              for (i = 0; i < analyticCustomItem.length; i++) {
                productarraySlug = "";
                productarraySlug = analyticCustomItem[i].slug;
                if (
                  productarraySlug.search(
                    productAddedSKU + "-" + productLength
                  ) != "-1"
                ) {
                  addTocartProductArr.push(analyticCustomItem[i]);
                }
              }
              pageCategory = "RF Cable Designer";
              addToCartAllProdDL(
                addTocartProductArr,
                quantity,
                rfcaTestingVal,
                pageCategory
              );
            }
          }
        },
        error: function (error) {
          window.errorModule.showErrorPopup(error);
        }
      });
    }
  }
}

//  Expired Time Added in Cookies.
function guestUserTTL(result) {
  let now = new Date();
  let time = now.getTime();
  let hour = result?.tokenExpiryInMillis / (1000 * 60 * 60) || 48;
  let expireTime = time + 1000 * 60 * 60 * hour;
  now.setTime(expireTime);
  let expires = "expires=" + now.toUTCString();
  document.cookie =
    "anonymousCustomerInfo=" +
    JSON.stringify(result.anonymousToken) +
    ";" +
    expires +
    ";path=/;";
}
// Print
function printToDOMATC(id, value) {
  if (id && value) {
    var element = document.getElementById(id);
    if (element) {
      element.innerHTML = value;
    }
  }
}

/**
 * cartPageCartUpdate() // Update call
 * @param {CurreEvent} event
 * @param {Boolean} isitemcustom
 */
function cartPageCartUpdate(event, isitemcustom) {
  const endPoint = $.fn.getAPIEndpoint(),
    SHOPPING_CART_UPDATE = endPoint.customEvent.SHOPPING_CART_UPDATE;
  let qunatity, lineItemId;
  if ($(event).hasClass("qty_num")) {
    qunatity = $(event).val();
    lineItemId = $(event).attr("data-lineitemid");
  } else {
    qunatity = $(event).siblings(".qty_num").val();
    lineItemId = $(event).siblings(".qty_num").attr("data-lineitemid");
  }

  const data = {
    qnty: qunatity,
    id: lineItemId,
    isCustomLineItem: isitemcustom
  };
  window.getAPIModule
    .updateCart(data)
    .done(function (result) {
      if (result && !result.errors) {
        updateOrderSummaryAfterPlusMinus(result, isitemcustom, event);
        $(document).trigger(SHOPPING_CART_UPDATE, result);
      }
    })
    .fail(function (error) {
      console.log(error);
      enablePlusMinus(event);
    });
}
/**
 * updateOrderSummaryAfterPlusMinus() // Update orderSummary after getting update response
 * @param {Object} resp
 * @param {Boolean} isitemcustom
 */
function updateOrderSummaryAfterPlusMinus(resp, isitemcustom, event) {
  const usd = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  //updating total of all the items in the cart after clicking '+' or '-'
  if (isitemcustom == "false") {
    for (let itm in resp.lineItems) {
      const $this = $(".cart_container_details .card_box")
        .find(`[data-lineitem-id='${resp.lineItems[itm].id}']`)
        .closest(".single_product_details");
      $this.find(".second_div input.qty_num").val(resp.lineItems[itm].quantity);
      $this
        .find(".second_div .single_pr_price")
        .text(usd.format(resp.lineItems[itm].price.value.number));
      $this
        .find(".second_div .single_product_total_amount p")
        .text(usd.format(resp.lineItems[itm].totalPrice.number));
    }
  } else {
    for (let itm in resp.customLineItems) {
      let price =
        "$" + window.priceFormate.formatPrice(resp.customLineItems[itm].money);
      const $this = $(".cart_container_details .card_box")
        .find(`[data-lineitem-id='${resp.customLineItems[itm].id}']`)
        .closest(".single_product_details");
      $this
        .find(".second_div input.qty_num")
        .val(resp.customLineItems[itm].quantity);
      $this.find(".second_div .single_pr_price").text(price);
      $this
        .find(".second_div .single_product_total_amount p")
        .text(usd.format(resp.customLineItems[itm].totalPrice.number));
    }
  }

  //updating the items subtotal and total before tax which we got from CT response

  let totalFromResponse = window.priceFormate.formatPrice(resp.totalPrice);

  // if shipping charge is present subtract
  if (resp.shippingInfo?.shippingRate) {
    totalFromResponse = String(
      parseFloat(totalFromResponse.replaceAll(",", "")) -
        parseFloat(
          window.priceFormate.formatPrice(resp.shippingInfo.shippingRate.price)
        )
    );
  }

  //if handling charge is present subtract

  totalFromResponse = String(
    (
      parseFloat(totalFromResponse.replaceAll(",", "")) -
      parseFloat(getHandlingChargeFromResponseATC(resp))
    ).toFixed(2)
  );

  $(".right_side_content #subtotal").text(
    "$" + window.priceFormate.formateCheckout(totalFromResponse)
  );
  $("#totalBeforeTax.cart_order_summary_right").text(
    "$" + window.priceFormate.formateCheckout(totalFromResponse)
  );

  //update the calculation for estimated total if the estimated tax and shipping and handling cost is present

  //need to make an ajax call for shipping and handling charge
  //need to make ajax call for getting the estimated tax

  const validZipCode = $("#postal_code_input").val(),
    selectedCountry = $("#select_box_country").val();
  let currentCountry = selectedCountry;
  if (currentCountry && validZipCode) {
    taxCalculation(currentCountry, validZipCode, event);
  } else {
    enablePlusMinus(event);
    $("#total_amount.cart_order_summary_right").text(
      "$" + window.priceFormate.formateCheckout(totalFromResponse)
    );
  }
}

/**
 * taxtCalculation() Tax and shiiping handling after click on plus(+) and minus (-)
 * @param {String} countryCode
 * @param {Number} zipCode
 */
function taxCalculation(countryCode, zipCode, event) {
  let taxEstimation, deliveryEstimation, handlingCharge, estShipDate;

  getDeliveryEstimationsPlusMinus(countryCode, zipCode)
    .done(function (data) {
      window.errorModule.checkError(data);
      if (data.errors && data.errors.length) {
        enablePlusMinus(event);
        return;
      }
      deliveryEstimation = parseDeliveryEstimationResponsePlusMinus(data);

      getTaxEstimationPlusMinus(countryCode, zipCode).then(function (result) {
        taxEstimation = parseTaxEstimationResponsePlusMinus(result);
        let estimatedTotal = 0.0;

        //if delivery estimation is present
        if (deliveryEstimation !== false) {
          //if handling charge is present add it to the delivery estimation
          handlingCharge = $("#estShipHandCost").attr("data-handlingcharge");
          if (handlingCharge != "0.00") {
            let shippingCharges = Number(deliveryEstimation);
            deliveryEstimation = (
              parseFloat(shippingCharges) + parseFloat(handlingCharge)
            ).toFixed(2);
          }
          estShipDate = estimatedShipment.getEstimatedShipmentDate();
          estimatedTotal = (
            parseFloat(estimatedTotal) + Number(deliveryEstimation)
          ).toFixed(2);
          deliveryEstimation = "$" + deliveryEstimation;
        } else {
          deliveryEstimation = "Unavailable";
          estShipDate = "Unavailable";
        }
        // if tax estimation is  present
        if (taxEstimation !== false) {
          let removedCommataxEstimation = taxEstimation.replaceAll(",", "");
          estimatedTotal = (
            parseFloat(estimatedTotal) + Number(removedCommataxEstimation)
          ).toFixed(2);
          taxEstimation = "$" + taxEstimation;
        } else {
          taxEstimation = "Unavailable";
        }
        printToDOMATC("estimatedTaxToBeCollected", taxEstimation);
        printToDOMATC("estShipHandCost", deliveryEstimation);
        printToDOMATC("estDelDate", estShipDate);
        updateEstimatedTotalAfterPlusMinus(estimatedTotal);
        enablePlusMinus(event);
      });
    })
    .fail(function (error) {
      console.log(error);
      window.errorModule.showErrorPopup(error);
    });
}
/**
 * updateEstimatedTotalAfterPlusMinus() // Updated estimiated tax
 * @param {Object} sumOfEstTaxAndEstShipHand
 */
function updateEstimatedTotalAfterPlusMinus(sumOfEstTaxAndEstShipHand) {
  const totalB4TaxEle = document.getElementById("totalBeforeTax").innerHTML,
    totalB4Tax = totalB4TaxEle.replaceAll(",", "").replace("$", "");
  let estimatedTotal = (
    parseFloat(sumOfEstTaxAndEstShipHand) + parseFloat(totalB4Tax)
  ).toFixed(2);
  printToDOMATC(
    "total_amount",
    "$" + window.priceFormate.formateCheckout(estimatedTotal)
  );
}

/**
 * getDeliveryEstimationsPlusMinus() // Call getDeliveryRate API
 * @param {String} countryCodeParam
 * @param {String} zipCodeParam
 */
function getDeliveryEstimationsPlusMinus(countryCodeParam, zipCodeParam) {
  const data = {
    CTCustomerToken: window.isCustomerToken(),
    transitTimeRequired: true,
    zipcode: zipCodeParam,
    country: countryCodeParam,
    bearertoken: window.getbearerToken()
  };

  return window.getAPIModule
    .getDeliveryRate(data)
    .done(function (response) {
      return response;
    })
    .fail(function (error) {
      return error;
    });
}
/**
 * getTaxEstimationPlusMinus() Calculate Tax Estimation
 * @param {String} countryCodeParam
 * @param {String} postalCodeParam
 * @returns
 */
function getTaxEstimationPlusMinus(countryCodeParam, postalCodeParam) {
  const data = {
    CTCustomerToken: window.isCustomerToken(),
    postalCode: postalCodeParam,
    countryCode: countryCodeParam,
    bearertoken: window.getbearerToken()
  };

  return window.getAPIModule
    .getCalculatedTax(data)
    .done(function (response) {
      return response;
    })
    .fail(function (error) {
      return error;
    });
}
/**
 * parseDeliveryEstimationResponsePlusMinus()
 * @param {Object} data
 */
function parseDeliveryEstimationResponsePlusMinus(data) {
  let shippingAndHand,
    shippingAndHandlingF = Number.MAX_VALUE,
    shippingAndHandlingU = Number.MAX_VALUE;

  if (
    data.statusCode === 500 ||
    data.statusCode === 404 ||
    data.statusCode === 400 ||
    data.statusCode === 409 ||
    (data.FEDEX === undefined && data.UPS === undefined)
  ) {
    return false;
  }
  if (data?.FEDEX !== undefined) {
    if (data?.UPS === undefined && data?.FEDEX.statusCode === 500) {
      return false;
    }
    if (data?.FEDEX.statusCode !== 500) {
      let rateReplyDetails = data?.FEDEX?.output?.rateReplyDetails;
      shippingAndHandlingF = Number(
        rateReplyDetails[0].ratedShipmentDetails[0].totalNetFedExCharge
      );
      for (let detail of rateReplyDetails) {
        if (
          Number(detail.ratedShipmentDetails[0].totalNetFedExCharge) <=
          shippingAndHandlingF
        ) {
          shippingAndHandlingF = Number(
            detail.ratedShipmentDetails[0].totalNetFedExCharge
          );
        }
      }
    }
  }
  if (data?.UPS !== undefined) {
    if (data?.FEDEX === undefined && data?.UPS?.statusCode === 500) {
      return false;
    }
    if (data.UPS.statusCode !== 500) {
      let rateReplyDetails = data?.UPS?.RateResponse?.RatedShipment;
      shippingAndHandlingU = Number(
        rateReplyDetails[0].TotalCharges?.MonetaryValue
      );
      for (let detail of rateReplyDetails) {
        if (
          Number(detail?.TotalCharges?.MonetaryValue) <= shippingAndHandlingU
        ) {
          shippingAndHandlingU = Number(detail?.TotalCharges?.MonetaryValue);
        }
      }
    }
  }

  if (shippingAndHandlingU <= shippingAndHandlingF) {
    shippingAndHand = shippingAndHandlingU;
  } else {
    shippingAndHand = shippingAndHandlingF;
  }

  return parseFloat(shippingAndHand).toFixed(2);
}
/**
 * parseTaxEstimationResponsePlusMinus()
 * @param {Object} result
 * @returns
 */
function parseTaxEstimationResponsePlusMinus(result) {
  if (
    result.statusCode !== 400 &&
    result.statusCode !== 500 &&
    result.statusCode !== 409 &&
    result.statusCode !== 404
  ) {
    return priceFormate.formatPrice(result?.taxedPrice?.totalTax);
  } else {
    return false;
  }
}
/**
 * disablePlusMinus()
 */
function disablePlusMinus(event) {
  $(event).parent().find(".cart-qty-plus").css("pointerEvents", "none");
  $(event).parent().find(".cart-qty-minus").css("pointerEvents", "none");

  $(event)
    .parents(".shopping__cart")
    .find(".cart__loader")
    .removeClass("d-none");
}
/**
 * enablePlusMinus()
 */
function enablePlusMinus(event) {
  $(event).parent().find(".cart-qty-plus").css("pointerEvents", "auto");
  $(event).parent().find(".cart-qty-minus").css("pointerEvents", "auto");
  $(event).parents(".shopping__cart").find(".cart__loader").addClass("d-none");
}

/**
 * getHandlingChargeFromResponseATC()
 * @param {Object} resp
 * @returns
 */
function getHandlingChargeFromResponseATC(resp) {
  if (resp.customLineItems) {
    const $CLI = resp.customLineItems;
    for (let cli of $CLI) {
      if (cli.slug && cli.slug == "WireTransfer_HandlingCharge") {
        return priceFormate.formatPrice(cli.totalPrice);
      }
    }
  }
  return "0.00";
}
