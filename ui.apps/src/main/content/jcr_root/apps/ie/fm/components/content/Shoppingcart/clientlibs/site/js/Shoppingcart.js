$(document).ready(function () {
  /**
   * @param {Component} $component
   */
  const $component = $(".shopping__cart"),
    $shoppingCartTemplateSelector = $component.find(
      ".shopping__cart--template"
    ),
    postalCodeSelector = "#postal_code_input",
    endPoint = $.fn.getAPIEndpoint();
  // pass component name and template name
  if ($component) {
    $shoppingCartTemplateSelector.ieShoppingCart(
      $component,
      $component.find(".shopping--cart")
    );
  }

  // This method trigger once template generated and append in dom
  $component.on(
    endPoint.customEvent.SHOPPING_CART_FETCH,
    function (e, dataResponse, totalLineItems) {
      cartInfoData(dataResponse, totalLineItems, $component);
      updateQuantity();
    }
  );
  // redirect to empty Shopping cart if no lineItems
  $component.on(endPoint.customEvent.SHOPPING_CART_ERROR, function () {
    window.location.href =
      $.fn.getAPIEndpoint().damEndpoint.redirectURL.emptyShoppingCart;
  });
  // if there is no any token then redirect to empty shopping cart
  commonUtility().redirectToEmptyShoppingCart();
  // Updating the URL.
  if (
    window.location.href.indexOf("checkout") > 1 &&
    $("#signin-createaccount")
  ) {
    $("#signin-createaccount").attr("href", "{guestregister}");
  }

  // Country List
  window.getAPIModule
    .getCountryList()
    .done(function (data) {
      populateCountryList(data, $component);
    })
    .fail(function (error) {
      console.log(error);
    });

  const $countriesForCartPage = $component.find("#select_box_country");
  $countriesForCartPage.change(function () {
    $component.find(postalCodeSelector).prop("disabled", false);
    $component.find(postalCodeSelector).val("");
  });

  // Update Cart Quantity
  function updateQuantity() {
    const $cartButton = $component.find(".shopping__cart--button");
    $cartButton.find(".cart-qty-plus").on("click", function (e) {
      let $currentEvent = $(e.currentTarget);

      addplus($currentEvent);
    });

    $cartButton.find(".cart-qty-minus").on("click", function (e) {
      let $currentEvent = $(e.currentTarget);

      addminus($currentEvent);
    });
  }
});

function populateCountryList(data, $component) {
  let $countriesForCartPage = $component.find("#select_box_country");
  if (data && $countriesForCartPage) {
    $countriesForCartPage.countryList(data);
  }
}

/*
 *checkSCZipCode()
 *Gets triggered during the input event of zipcode field
 *enables/disabled the zipcode tick as per the regex validation of the postal
 *also hides error message during the input event
 */
function checkSCZipCode() {
  const currentCountry = $("#select_box_country").val(),
    $checkBox = $("#check_active_class"),
    zipCode = $("#postal_code_input").val(),
    UNKNOWN = "Unknown";

  // when there's no values in zipcode field and user focuses out
  //->hide postal code error if there's any
  //->disable the zipcode tick

  $("#postal_code_input").focusout(function () {
    if ($("#postal_code_input").val().length == 0) {
      $(".postal_code_error").hide();
      disableSCZipTick();
    }
  });

  // hide the error messages when user is entering the value in zipcode field
  errorMessageAction("none");
  printToDOM("estimatedTaxToBeCollected", "$0.00");
  printToDOM("estShipHandCost", UNKNOWN);
  printToDOM("estDelDate", UNKNOWN);

  if (currentCountry === "US") {
    //validate using US regex

    if (/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zipCode)) {
      $checkBox.addClass("error__check");
      $checkBox.parents().find(".postal_code_error").hide();
    }
    // make checkbox inactive if the USA postal code is invalid
    else {
      $checkBox.removeClass("error__check");
      $checkBox.parents().find(".postal_code_error").show();
    }
    //validating using canada regex
  } else if (currentCountry === "CA") {
    if (
      /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i.test(
        zipCode
      )
    ) {
      $checkBox.addClass("error__check");
      $checkBox.parents().find(".postal_code_error").hide();
      //make the checkbox inactive if canada postal code is regex invalid
    } else {
      $checkBox.removeClass("error__check");
      $checkBox.parents().find(".postal_code_error").hide();
    }
  }
  //for other countries than USA, make the checkbox active during input event
  else {
    $checkBox.addClass("error__check");
    $checkBox.parents().find(".postal_code_error").hide();
  }
}

/*
 * getSCShipHandDateTax()
 * Function which gets called on onclick event of enabled zip code button
 * This triggers ajax calls for getting shipping rate and tax estimations
 */

function getSCShipHandDateTax() {
  var currentCountry = $("#select_box_country").val();
  var zipCode = $("#postal_code_input").val();
  disableTick();
  getEstimations(currentCountry, zipCode);
}

/**
 * getDeliveryEstimations() // Call getDeliveryRate API
 * @param {String} countryCodeParam
 * @param {String} zipCodeParam
 */
function getDeliveryEstimations(countryCodeParam, zipCodeParam) {
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
      //window.errorModule.checkError(response);
      return response;
    })
    .fail(function (error) {
      window.errorModule.showErrorPopup(error);
      return error;
    });
}
/**
 * getTaxEstimation() Calculate Tax Estimation
 * @param {String} countryCodeParam
 * @param {String} postalCodeParam
 * @returns
 */
function getTaxEstimation(countryCodeParam, postalCodeParam) {
  const data = {
    CTCustomerToken: window.isCustomerToken(),
    postalCode: postalCodeParam,
    countryCode: countryCodeParam,
    bearertoken: window.getbearerToken()
  };

  return window.getAPIModule
    .getCalculatedTax(data)
    .done(function (response) {
      //window.errorModule.checkError(response);
      return response;
    })
    .fail(function (error) {
      window.errorModule.showErrorPopup(error);
      return error;
    });
}

function parseDeliveryEstimationResponse(data) {
  var shippingAndHand;

  var shippingAndHandlingF = Number.MAX_VALUE;

  var shippingAndHandlingU = Number.MAX_VALUE;

  if (
    data.statusCode === 500 ||
    data.statusCode === 404 ||
    data.statusCode === 400 ||
    data.statusCode === 409 ||
    (data?.FEDEX === undefined && data?.UPS === undefined)
  ) {
    return false;
  }
  if (data?.FEDEX !== undefined) {
    if (data?.UPS === undefined && data?.FEDEX?.statusCode === 500) {
      return false;
    }
    if (data?.FEDEX?.statusCode !== 500) {
      var rateReplyDetails = data.FEDEX.output.rateReplyDetails;
      //earliestDateF = rateReplyDetails[0].operationalDetail.commitDate;
      shippingAndHandlingF = Number(
        rateReplyDetails[0].ratedShipmentDetails[0].totalNetFedExCharge
      );
      for (var detail of rateReplyDetails) {
        if (
          Number(detail?.ratedShipmentDetails[0].totalNetFedExCharge) <=
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
    if (data?.UPS?.statusCode !== 500) {
      var rateReplyDetails = data?.UPS?.RateResponse?.RatedShipment;
      shippingAndHandlingU = Number(
        rateReplyDetails[0].TotalCharges?.MonetaryValue
      );
      for (var detail of rateReplyDetails) {
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

function parseTaxEstimationResponse(result) {
  if (
    result.statusCode !== 400 &&
    result.statusCode !== 500 &&
    result.statusCode !== 409 &&
    result.statusCode !== 404
  ) {
    return window.priceFormate.formatPrice(result?.taxedPrice?.totalTax);
  } else {
    return false;
  }
}

/**
 * getEstimations() // Calculate Delivery and Tax Estimations
 * @param {String} countryCode
 * @param {String} zipCode
 */
function getEstimations(countryCode, zipCode) {
  var taxEstimation,
    deliveryEstimation,
    handlingCharge,
    estShipDate,
    UNAVAILABLE = "Unavailable";
  getDeliveryEstimations(countryCode, zipCode).then(function (data) {
    if (data.errors && data.errors.length) {
      errorMessageAction("block");
      printToDOM("estShipHandCost", UNAVAILABLE);
      printToDOM("estDelDate", UNAVAILABLE);
      updateEstimatedTotalAfterPincodeTick(0.0);
      enableTick();
      return;
    }
    deliveryEstimation = parseDeliveryEstimationResponse(data);

    getTaxEstimation(countryCode, zipCode).then(function (result) {
      taxEstimation = parseTaxEstimationResponse(result);
      var estimatedTotal = 0.0;

      // if delivery estimation is  present
      if (deliveryEstimation !== false) {
        //if handling charge is present add it to the delivery estimation
        handlingCharge = $("#estShipHandCost").attr("data-handlingcharge");
        if (handlingCharge != "0.00") {
          var shippingCharges = Number(deliveryEstimation);
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
        deliveryEstimation = UNAVAILABLE;
        estShipDate = UNAVAILABLE;
        errorMessageAction("block");
      }

      // if tax estimation is present
      if (taxEstimation !== false) {
        let removedCommataxEstimation = taxEstimation.replaceAll(",", "");
        estimatedTotal = (
          parseFloat(estimatedTotal) + Number(removedCommataxEstimation)
        ).toFixed(2);
        taxEstimation = "$" + taxEstimation;
      } else {
        taxEstimation = UNAVAILABLE;
      }

      //print whatever values we get on the basis of responses to DOM
      printToDOM("estimatedTaxToBeCollected", taxEstimation);
      printToDOM("estShipHandCost", deliveryEstimation);
      printToDOM("estDelDate", estShipDate);
      updateEstimatedTotalAfterPincodeTick(estimatedTotal);
      enableTick();
      errorMessageAction("none");
    });
  });

  // enableTick();
}

function updateEstimatedTotalAfterPincodeTick(sumOfEstTaxAndEstShipHand) {
  var totalB4TaxEle = document.getElementById("totalBeforeTax").innerHTML;
  //var totalB4Tax = parseFloat(totalB4TaxEle.slice(1, totalB4TaxEle.length));
  var totalB4Tax = totalB4TaxEle.replaceAll(",", "").replace("$", "");
  //var totalB4=totalB4Tax.replace(",","");
  var estimatedTotal = (
    parseFloat(sumOfEstTaxAndEstShipHand) + parseFloat(totalB4Tax)
  ).toFixed(2);
  //var estimatedTotal = sumOfEstTaxAndEstShipHand + totalB4Tax;
  //printToDOM("total_amount", "$" + estimatedTotal.toFixed(2));
  printToDOM(
    "total_amount",
    "$" + window.priceFormate.formateCheckout(estimatedTotal)
  );
}

function priceFormatContShopping(price) {
  const formatter = new Intl.NumberFormat("en-US", {
    //style: 'currency',
    //currency: 'USD',
    // These options are needed to round to whole numbers if that's what you want.
    minimumFractionDigits: 2, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    maximumFractionDigits: 2 // (causes 2500.99 to be printed as $2,501)
  });
  return formatter.format(price);

  //return price.toLocaleString("en-us", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function printToDOM(id, value) {
  var element = document.getElementById(id);
  element.innerHTML = value;
}

// make pointer events none and button greyd out also if there's any error for postal code remove that
function disableSCZipTick() {
  $("#check_active_class").removeClass("error__check");
  $("#check_active_class").parents().find(".postal_code_error").hide();
}

function disableTick() {
  $(".shopping__cart").find(".cart__loader").removeClass("d-none");
}

function enableTick() {
  $(".shopping__cart").find(".cart__loader").addClass("d-none");
}

function errorMessageAction(action) {
  const $component = $(".shopping__cart");
  if (action === "none") {
    $component.find(".warning_msgs").addClass("d-none");
  } else {
    $component.find(".warning_msgs").removeClass("d-none");
  }
}

document.querySelector("body").addEventListener(
  "click",
  function (e) {
    var buttonElement = e.target.closest("button");
    var spanElement = e.target.closest("span");
    var anchorElement = e.target.closest("a");
    //debugger;
    var label = "";
    var category = "";
    if (
      buttonElement !== null &&
      buttonElement.closest(".analytic-ContinueShopping") != null &&
      buttonElement.textContent.trim() == "Continue Shopping"
    ) {
      label = buttonElement.textContent.trim();
      category = "My Cart Section-Continue Shopping Page";
      ctalinkDataLayerCall(label, category);
    } else if (
      spanElement !== null &&
      spanElement.closest(".analytic-MyCartSection") !== null
    ) {
      if (spanElement.closest(".analytic-MyCartSection-print") != null) {
        let doccat =
            spanElement.textContent.trim() + " - My Cart - Continue Shopping",
          docid = "Print - My Cart",
          docname = "Print - My Cart",
          doctype = "Print",
          parameter =
            docname +
            "@@" +
            doctype +
            "@@" +
            "" +
            "@@" +
            "" +
            "@@" +
            "Continue Shopping" +
            "@@" +
            "";
        parameterArray = parameter.split("@@");
        documentDLCall(parameterArray, "Click", doccat, docid);
      } else {
        label = spanElement.textContent.trim();
        category = "My Cart Section-Continue Shopping Page";
        ctalinkDataLayerCall(label, category);
      }
    }
    if (
      anchorElement !== null &&
      anchorElement.closest(".analyticscheckoutbutton") != null
    ) {
      analyticsCheckoutData();
    }
  },
  false
);

//analytics code to get the data
function analyticsCheckoutData() {
  var pageCategory = "shopping-cart";
  itemsArr = [];
  var step = "1";
  var option = "checkout_process_continue_shopping";
  var itemsObj = "";
  var productDetails = document.getElementById("analytic-clearcart").value;
  var prodArray = JSON.parse(productDetails);
  var items = document.querySelectorAll(".single_product_details");
  var totalBeforeTax = "";
  var estimatedTaxToBeCollected = "";
  var total_amount = "";
  var estDelDate = "";
  var shippingAndHandling = "";
  var shippingAmt = "";
  var handlingAmt = "";
  var analytics_prod_detail = "";
  if ($("#totalBeforeTax").text().trim() != null) {
    totalBeforeTax = $("#totalBeforeTax").text().trim();
  }
  if ($("#estimatedTaxToBeCollected").text().trim() != null) {
    estimatedTaxToBeCollected = $("#estimatedTaxToBeCollected").text().trim();
  }
  if ($("#total_amount").text().trim() != null) {
    total_amount = $("#total_amount").text().trim();
  }
  if ($("#estDelDate").text().trim() != null) {
    estDelDate = $("#estDelDate").text().trim();
  }
  if ($("#estShipHandCost").text().trim() != null) {
    shippingAndHandling = $("#estShipHandCost").text().trim();
  }
  for (i = 0; i < items.length; i++) {
    if (prodArray[i]?.price !== null && prodArray[i]?.price !== undefined) {
      priceamt = (
        prodArray[i]?.variant?.prices[0]?.value?.centAmount / 100
      ).toFixed(2);
    }
    let prodName = prodArray[i]?.name["en"]
      ? prodArray[i]?.name["en"]
      : prodArray[i]?.name["en-US"];
    let qtyobj = $(".qty_num")[i];
    let qty_num = $(qtyobj).val();

    let singleproductObj = $(".single_product_total_amount")[i];
    let singleProductTotalAmt = $(singleproductObj).text().trim();
    let analyticProdDetails = $(".analytics_prod_detail_" + i);
    let analytics_prod_detailObj = analyticProdDetails[i];
    let analytics_prod_detail = $(analytics_prod_detailObj).attr(
      "data-analytics-prod-detail"
    );
    itemsObj =
      prodArray[i]?.variant?.sku +
      "@@" +
      prodName +
      "@@" +
      prodArray[i]?.productId +
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
      prodArray[i]?.productType?.id +
      "@@" +
      qty_num +
      "@@" +
      analytics_prod_detail;
    itemsArr.push(itemsObj);
  }
  checkoutDataLayer(itemsArr, pageCategory, step, option);
}

function clearCart() {
  var version_value = $(".clear_cart").attr("data-version");
  var crtId = $(".clear_cart").attr("data-id");
  $.ajax({
    type: $.fn.getAPIEndpoint().requestType.POST,
    url: $.fn.getAPIEndpoint().CLEAR_CART,
    data: {
      customer_token: window.isCustomerToken(),
      version: version_value,
      cartID: crtId,
      bearertoken: window.getbearerToken()
    },
    success: function (result) {
      //window.errorModule.checkError(result);
      if (result.statusCode == undefined || result.statusCode == 200) {
        localStorage.removeItem("activecartcount");
        //code for analytic clear cart tracking
        clearCartDataLayer("shopping-cart");
        window.location.href =
          $.fn.getAPIEndpoint().damEndpoint.redirectURL.emptyShoppingCart;
      }
    },
    error: function (error) {
      window.errorModule.showErrorPopup(error);
    }
  });
}

/*** Cart Information data*/
function cartInfoData(data, totalLineItems, $component) {
  const totalLength = totalLineItems;
  $component.find(".mycart_qty").ieHeading(totalLength.length);
  $component.find(".cart_image_section").attr("id", "printview");

  // Remove loader
  $component.removeClass("d-none");
  $(".loader_wrapper").addClass("d-none");
  // Updated the Cart Item
  let productCnt;
  const redirectURL =
    $.fn.getAPIEndpoint().damEndpoint.redirectURL.emptyShoppingCart;

  if (data.statusCode == 404) {
    window.location.href = redirectURL;
  } else {
    if (data.lineItems.length == 0 && data.customLineItems.length == 0) {
      window.location.href = redirectURL;
    } else {
      const screenSize = window.matchMedia("(max-width: 991px)");
      if (screenSize.matches) {
        if (productCnt > 3) {
          $(".card_box").addClass("card__box--scroll");
        }
      } else {
        if (productCnt > 5) {
          $(".card_box").addClass("card__box--scroll");
        }
      }

      $(".clear_cart")
        .attr("data-id", data.id)
        .attr("data-version", data.version);

      //code for analytic clear cart data tracking
      //analytic Data = data;
      //$("#analytic-clearcart").val(JSON.stringify(data.lineItems));
      $("#analytic-clearcart").val(JSON.stringify(totalLength));

      forAddingEventToIpBox();

      var orderSummary = window.priceFormate.formatPrice(data.totalPrice);
      //subtract shipping charges if present
      if (data.shippingInfo?.shippingRate) {
        orderSummary = String(
          parseFloat(
            parseFloat(orderSummary.replaceAll(",", "")) -
              parseFloat(
                window.priceFormate.formatPrice(
                  data.shippingInfo.shippingRate.price
                )
              )
          ).toFixed(2)
        );
      }
      //subtract handling charges if present
      orderSummary = String(
        parseFloat(
          parseFloat(orderSummary.replaceAll(",", "")) -
            parseFloat(getHandlingChargeFromResponse(data))
        ).toFixed(2)
      );

      let updatedPrice = window.priceFormate.formateCheckout(orderSummary);
      $("#subtotal.cart_order_summary_right").text("$" + updatedPrice);
      $("#totalBeforeTax.cart_order_summary_right").text("$" + updatedPrice);
      $("#total_amount.cart_order_summary_right").text("$" + updatedPrice);

      $("#estShipHandCost.cart_order_summary_right").attr(
        "data-handlingCharge",
        getHandlingChargeFromResponse(data)
      );
    }
  }
  if (data.lineItems.length > 1) {
    $(".card_box .single_product_details")
      .last()
      .find(".quantity-dropdown-content")
      .addClass("reverse");
  }

  // Freight Tooltip Message Added , if not message configured then this dev  will be hidden
  const freightToolTipMessage = $component
    .find(".shopping__cart--template")
    .attr("data-freight-label");
  if (freightToolTipMessage) {
    $component
      .find(".freight__message .tooltiptext")
      .text(freightToolTipMessage);
  } else {
    $component.find(".freight__message").addClass("d-none");
  }

  viewcartDataLayer("shopping-cart");
}

/**
 * Removing Line item from Cart
 * @param {Dom Element} event : target element
 */
function removeLineItem(event) {
  var crtLineItemId = $(event).attr("data-lineItem-id");
  let isCustomLineItem = $(event).attr("data-isitemcustom");

  const data = {
    CTCustomerToken: window.isCustomerToken() ? window.isCustomerToken() : "",
    bearerToken: window.getbearerToken() ? window.getbearerToken() : "",
    id: crtLineItemId,
    isCustomLineItem: isCustomLineItem
  };
  // Pass URL and data to call removeCart Api
  window.getAPIModule
    .removeCart(data)
    .done(function (result) {
      if (result && !result.error) {
        // Update Shopping Cart
        $(document).trigger(
          $.fn.getAPIEndpoint().customEvent.SHOPPING_CART_RESPONSE,
          result
        );
        //code for anlaytic data tracking on remove
        const productData = $(event).attr("data-analyticprod"),
          productSlugVal = $(event).attr("data-analyticslug");
        let productDetailsFinalArray = [],
          productDetailsArray = [],
          cabelAssemblyTestArray = [],
          productClickedSlug = "",
          cableAssemblyTest = "";
        if (productData) {
          productDetailsArray = productData.split("@@");
          for (i = 0; i < productDetailsArray.length; i++) {
            if (productDetailsArray[i] === "undefined") {
              productDetailsArray[i] = "";
            }
          }
          productDetailsFinalArray.push(productDetailsArray);
          productSlugVal
            ? (productClickedSlug = productSlugVal.split("_"))
            : (productClickedSlug = "");
          if (isCustomLineItem == "true" && productClickedSlug.length == 2) {
            $.each($(".remove_cart_product"), function () {
              if (
                $(this).attr("data-analyticslug").split("_")[2] ==
                productClickedSlug[1]
              ) {
                cableAssemblyTest = $(this).attr("data-analyticprod");
              }
            });
            if (cableAssemblyTest != "") {
              cabelAssemblyTestArray = cableAssemblyTest.split("@@");
              for (i = 0; i < cabelAssemblyTestArray.length; i++) {
                if (cabelAssemblyTestArray[i] === "undefined") {
                  cabelAssemblyTestArray[i] = "";
                }
              }
              productDetailsFinalArray.push(cabelAssemblyTestArray);
            }
          }
          window.removecartDataLayer(productDetailsFinalArray, "shopping-cart");
        }
      }
    })
    .fail(function (error) {
      window.errorModule.showErrorPopup(error);
    });
}

// Dropdown show/hide after click on input box
function forAddingEventToIpBox() {
  $(".cart_quantity_div .qty").each(function () {
    $(this)
      .find(".qty_num")
      .focusin(function (e) {
        $(this).parent(".qty").siblings(".quantity-dropdown-content").show();
      });
    $(this)
      .find(".qty_num")
      .focusout(function (e) {
        $(this).parent(".qty").siblings(".quantity-dropdown-content").hide();
      });
  });
}

function getHandlingChargeFromResponse(resp) {
  if (resp.customLineItems) {
    var $CLI = resp.customLineItems;
    for (var cli of $CLI) {
      if (cli.slug && cli.slug == "WireTransfer_HandlingCharge") {
        return window.priceFormate.formatPrice(cli.totalPrice);
      }
    }
  }
  return "0.00";
}

function changeValue(event) {
  var isDepleted = $(event).attr("algolio_isdiscontinued");
  var algoliaInven = Number($(event).attr("algolio_inven"));
  var ipValue = Number(event.value);
  if (isDepleted === "true") {
    if (ipValue > algoliaInven) {
      event.value = algoliaInven;
    }
  } else {
    if (String(ipValue).length > 5) {
      event.value = String(ipValue).slice(0, 5);
    }
  }
}
