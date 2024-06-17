let pdpCustomMessages;
(function () {
  let ctPriceValue = [];
  function quantityPriceUpdateCT(value) {
    const between = (x, min, max) => {
      return x >= min && x <= max;
    };
    ctPriceValue = [];
    value.forEach((item) => {
      ctPriceValue.push(item);
    });
  }

  function ctPriceQtyUpdate(qty) {
    for (const item of ctPriceValue) {
      if (qty >= item.minimumQuantity) {
        // matchingPriceData = item;
        let displayPrice = item.price.toLocaleString("en-us", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
        $(".pricingtierprice").text("$" + displayPrice);
      } else {
        break;
      }
    }
  }

  function customButtonDisabled() {
    let lengthInput = $("#input-custom-select").val();
    if (lengthInput.length > 0) {
      $(".calculate-btn").removeClass("ie-btn-disabled d-none");
      $(".calculate-btn").attr("disabled", false);
    } else {
      $(".calculate-btn").addClass("ie-btn-disabled");
      $(".calculate-btn").attr("disabled", true);
    }
  }
  function customlengthselect() {
    // to hide the previous/stale shipment confirmation date estimation
    $(".confirm-pd-20  .delivery-details").hide();
    $(".confirm-pd-20  .delivery-error").hide();

    let lengthinp = $("#input-custom-select").val();
    let selectCustom = $("#customunitselect").val();
    if (selectCustom == "CM") {
      lengthinp = lengthinp * 0.3937;
    } else if (selectCustom == "FT") {
      lengthinp = lengthinp * 12;
    } else if (selectCustom == "M") {
      lengthinp = lengthinp * 39.36;
    } else {
      lengthinp = lengthinp;
    }
    if (lengthinp == "") {
      $(".custom-btn").addClass("ie-btn-disabled");
      $(".custom-btn").attr("disabled", true);
      $(".minimuminch").addClass("errorInch");
      $(".minimuminch").text(pdpCustomMessages?.messages?.minimalLengthSix);
    } else if (lengthinp < 6) {
      $(".minimuminch").addClass("errorInch");
      $(".minimuminch").text(pdpCustomMessages?.messages?.minimalLengthSix);
    } else {
      init();
      $(".add_to_cart.add_to_cart--pdp-std").addClass("d-none");
      $(".custom-btn").removeClass("ie-btn-disabled d-none");
      $(".custom-btn").attr("disabled", false);
      $(".minimuminch").removeClass("errorInch");
      $(".minimuminch").text(pdpCustomMessages?.messages?.minimumSixInches);

      $(".standard-shipment").addClass("d-none");
      $(".custom-shipment").removeClass("d-none");
    }
  }

  function init() {
    const skuValue = $(".base-sku").text();
    let length = $("#input-custom-select").val();
    let unit = $("#customunitselect  option:selected").val();
    let bearertoken = window.getbearerToken();
    getProductPriceData("USD", skuValue, 1, unit, length);
  }

  function getProductPriceData(
    currency,
    skuValue,
    quantity,
    unitOfMeasurement,
    length
  ) {
    var form = new FormData();
    var queryObject = {
      currency: currency,
      masterSku: skuValue,
      quantity: quantity,
      unitOfMeasurement: unitOfMeasurement,
      length: length
    };
    form.append("jsonData", JSON.stringify(queryObject));
    form.append("bearertoken", window.getbearerToken());
    form.append("CTCustomerToken", window.isCustomerToken());
    getData(
      "/bin/calculateCustomLengthPrice",
      "POST",
      "setPriceContent",
      form,
      false,
      "multipart/form-data",
      false
    );
  }

  function getData(
    url,
    method,
    functionName,
    querydata,
    processData,
    mimeType,
    contentType
  ) {
    var DataObject = {
      url: url,
      method: method,
      timeout: 0,
      data: querydata,
      processData: processData,
      mimeType: mimeType,
      contentType: contentType,
      bearertoken: window.getbearerToken()
    };
    $.ajax(DataObject).done(function (response) {
      var data = response;
      setPriceContent(data);
    });
  }
  function setPriceContent(data) {
    try {
      var priceData = JSON.parse(data);
      var content = "";
      priceData.priceTiers.map(function (ele, i, arr) {
        if (arr.length - 1 !== i) {
          const [minQuantity, maxQuantity] = getMinMaxQuantity(
            ele,
            priceData.priceTiers,
            i
          );
          content += priceDom(
            minQuantity,
            maxQuantity,
            setPriceWithCurrency(ele.currency, ele.price),
            setPriceWithCurrency(ele.currency, ele.discountedPrice),
            i,
            "price_text"
          );
        }
      });

      quantityPriceUpdateCT(priceData.priceTiers);
      var minQuantity =
        priceData.priceTiers[priceData.priceTiers.length - 1].minimumQuantity +
        "+";
      content += priceDom(
        minQuantity,
        "",
        pdpCustomMessages?.labels?.pleaseCallForQuote,
        undefined,
        priceData.priceTiers.length - 1,
        "desktop_price_text"
      );
      $(".pricetire").html(content);
      if (priceData.priceTiers[0].discountedPrice !== undefined) {
        $(".price-details-info").addClass("dist-price-added");
        if ($(".price-details-info .discount-column").length <= 0)
          addDiscountLabel();
        $(".discount-column").show();
      } else {
        $(".price-details-info").removeClass("dist-price-added");
        $(".discount-column").hide();
      }

      //reset quantity to 1
      $("#pdpProdQty").val("1");
      $(".base-sku").hide();
      $(".orignal-sku").hide();
      $(".newSelected-sku").hide();
      $(".custom-sku").show();
      $(".quantity-div").removeClass("d-none");
      $(".price-div").removeClass("d-none");
      $(".price-details-info").removeClass("d-none");
      $(".price-text-info").removeClass("d-none");
      $(".custom-sku").html(priceData.sku);
      //add class to identify CT response
      $(".pdp__quantityupdate").addClass("ctQty-update");
      let formatedPrice = priceData.customLengthUnitPrice.toLocaleString(
        "en-us",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }
      );
      $(".pricingtierprice").html("$" + formatedPrice);
      let standardLengthValue = $("#select-length").val();
      if (
        standardLengthValue != pdpCustomMessages?.labels?.selectLength &&
        standardLengthValue != undefined
      ) {
        $("#select-length")
          .append(`<option class="ais-SortBy-option" value="${pdpCustomMessages?.labels?.selectLength}" selected="selected">
                                              ${pdpCustomMessages?.labels?.selectLength}
                                          </option>`);
      }
    } catch (error) {
      let errorData = JSON.parse(data);
      if (errorData?.errors[0]?.code == "CUSTOM_SKU_EXISTS") {
        $(".minimuminch").text(errorData?.errors[0]?.message);
        $(".minimuminch").addClass("errorInch");
      }
    }
  }
  function priceDom(
    minQuantity,
    maxQuantity,
    price,
    discountedPrice,
    index,
    className
  ) {
    var content = "";
    content += '<div class="order-details pd-price ' + className + '">';
    content +=
      '<span class="order-items-name font-normal">' +
      minQuantity +
      maxQuantity +
      "</span>";
    content +=
      '<span class="order-items-price font-normal" id="price_' +
      index +
      '">' +
      price +
      "</span>";
    if (discountedPrice != undefined) {
      content +=
        '<span class="order-items-price font-normal" id="disc_price_' +
        index +
        '">' +
        discountedPrice +
        "</span>";
    }
    content += "</div>";
    return content;
  }

  function getMinMaxQuantity(obj, priceArray, index) {
    var minQuantity;
    var maxQuantity;
    if (index < priceArray.length - 1) {
      minQuantity = obj.minimumQuantity + "-";
      maxQuantity = priceArray[index + 1].minimumQuantity - 1;
    }
    return [minQuantity, maxQuantity];
  }

  function setPriceWithCurrency(currency, priceValue) {
    var userLang = navigator.language || navigator.userLanguage;
    var price = Intl.NumberFormat(userLang, {
      style: "currency",
      currency: currency
    });
    if (typeof priceValue === "number") {
      return price.format(priceValue);
    } else {
      return priceValue;
    }
  }

  window.$pdpCustomVariant = {
    customlengthselect,
    init,
    getProductPriceData,
    getData,
    priceDom,
    getMinMaxQuantity,
    setPriceWithCurrency,
    customButtonDisabled,
    ctPriceQtyUpdate
  };
})();
/* function addDiscountLabel() {
  const discountLabel = $("#priceChart").attr("data-discountLabel");
  $(".price-details-info")
    .find(">.order-details")
    .append(
      '<span class="order-items-price qnty discount-column">' +
        discountLabel +
        "</span>"
    );
} */
$(document).ready(function () {
  //reading utility json
  window.getUTILITYModule
    .getUtility()
    .done(function (data) {
      pdpCustomMessages = data[0];
    })
    .fail(function (error) {});

  //Window.onload = getDiscountPrice();

  //adding Discount offer to the items in PDP
  function getDiscountPrice() {
    if (getDiscountOffer()) {
      $.ajax({
        url: "/bin/discountFactor",
        data: {
          CTCustomerToken: window.isCustomerToken(),
          bearerToken: window.getbearerToken(),
          SKU: $("#pdpSku").text()
        },
        success: function (response) {
          /* window.getAPIModule
              .getUtility()
              .done(function (errResponse) {
                labelData = errResponse ? errResponse[0] : [];
              }).fail(function (error) { });*/
          //rf-cable-assemblies
          //window.errorModule.checkError(response);
          var tiers,
            indexPrice,
            isBaseSKU = false;
          if (response.statusCode !== 401) {
            var isCustomerGroupNotNull = response.masterVariant.price;
            if (
              isCustomerGroupNotNull !== undefined &&
              isCustomerGroupNotNull !== ""
            ) {
              tiers = response.masterVariant.price.tiers;
              indexPrice = (
                response.masterVariant.price.value.centAmount / 100
              ).toFixed(2);
            } else {
              if (response.variants !== "" && response.variants !== undefined) {
                $.each(response.variants, function (index, item) {
                  if (item.sku == $("#pdpSku").text()) {
                    tiers = item.price.tiers;
                    indexPrice = (item.price.value.centAmount / 100).toFixed(2);
                    isBaseSKU = false;
                  } else if ($("#pdpSku").text() == $(".base-sku").text()) {
                    $(".price-details-info").removeClass("dist-price-added");
                    isBaseSKU = true;
                  }
                });
              }
            }

            //Reading discount label attribute from html
            if (!isBaseSKU) {
              if (
                (isCustomerGroupNotNull !== "" &&
                  isCustomerGroupNotNull !== undefined) ||
                (response.variants !== "" && response.variants !== undefined)
              ) {
                $(".price-details-info").addClass("dist-price-added");
                //addDiscountLabel();
                $(".pricetire")
                  .find(".order-details.pd-price")
                  .eq(0)
                  .append(
                    '<span class="order-items-price font-normal">$' +
                      indexPrice +
                      "</span>"
                  );
                var tiersLength = tiers.length - 1;
                $.each(tiers, function (index, item) {
                  var discountPrice = (item.value.centAmount / 100).toFixed(2);
                  let matchIndex = index + 1;
                  if (matchIndex <= tiersLength) {
                    $(".pricetire")
                      .find(".order-details.pd-price")
                      .eq(matchIndex)
                      .append(
                        '<span class="order-items-price font-normal">$' +
                          discountPrice +
                          "</span>"
                      );
                  }
                });
              }
            }
          }
        },
        error: function (error) {
          window.errorModule.showErrorPopup(error);
        }
      });
    } else {
      $(".price-details-info").removeClass("dist-price-added");
    }
  }

  //var isNotRFCable = currentPDPURL.includes("rf-cable-assemblies");
  function getDiscountOffer() {
    const logedinUserData = $.fn.cookiesRead().logedInCookiesData() || [];
    if (!logedinUserData) {
      return;
    }
    if (logedinUserData?.customer?.customerGroup) {
      return true;
    } else {
      return false;
    }
  }
});
