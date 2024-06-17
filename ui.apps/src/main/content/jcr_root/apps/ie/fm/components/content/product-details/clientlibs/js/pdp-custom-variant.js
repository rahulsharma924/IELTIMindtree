(function () {
  function customlengthselect(input) {
    let lengthinp = $(input).val();
    if (lengthinp == "") {
      $(".custom-btn").addClass("ie-btn-disabled");
      $(".custom-btn").attr("disabled", true);
    }
    else if (lengthinp < 6) {
    } else {
      init();
      $(".custom-btn").removeClass("ie-btn-disabled");
      $(".custom-btn").attr("disabled", false);
    }
  }

  function init() {
    const skuValue = window.location.hash.split("#")[1];
    //const skuValue = $("#basesku").val();
    let length = $("#input-custom-select").val();
    let unit = $("#customunitselect  option:selected").val();
    let bearertoken = window.getbearerToken();
    getData(
      "/bin/olcc/getCableAssembly?sku=" +
        skuValue +
        "&bearertoken=" +
        bearertoken,
      "GET",
      "setContent"
    );
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
      window[functionName](data);
    });
  }
  function setPriceContent(data) {
    try {
      var priceData = JSON.parse(data);
      var content = "";
      priceData.priceTiers.map(function (ele, i) {
        const [minQuantity, maxQuantity] = getMinMaxQuantity(
          ele,
          priceData.priceTiers,
          i
        );
        var price = setPriceWithCurrency(ele);
        content += priceDom(minQuantity, maxQuantity, price);
      });
      var minQuantity =
        priceData.priceTiers[priceData.priceTiers.length - 1].minimumQuantity +
        1 +
        "+";
      content += priceDom(minQuantity, "", "Please call for quote");
      $(".pricetire").html(content);
      $(".pricing-tiersku").html(priceData.sku);
      $(".pricingtierprice").html(priceData.customLengthUnitPrice);
    } catch (error) {
      $(".pricetire").html(`<div class="order-details pd-price">
    <span class="order-items-name font-normal">NA</span>
    <span class="order-items-price font-normal">NA</span>
  </div>`);

      $(".pricingtierpriceNA").html(`NA`);
    }
  }
  function priceDom(minQuantity, maxQuantity, price) {
    var content = "";
    content += '<div class="order-details pd-price">';
    content +=
      '<span class="order-items-name font-normal">' +
      minQuantity +
      " " +
      maxQuantity +
      "</span>";
    content +=
      '<span class="order-items-price font-normal">' + price + "</span>";
    content += "</div>";
    return content;
  }

  function getMinMaxQuantity(obj, priceArray, index) {
    var minQuantity;
    var maxQuantity;
    if (index == 0) {
      minQuantity = obj.minimumQuantity + " -";
      maxQuantity = obj.minimumQuantity;
    } else if (index < priceArray.length && index > 0) {
      minQuantity = priceArray[index - 1].minimumQuantity + 1 + " -";
      maxQuantity = obj.minimumQuantity;
    }
    return [minQuantity, maxQuantity];
  }

  function setPriceWithCurrency(obj) {
    var userLang = navigator.language || navigator.userLanguage;
    var price = Intl.NumberFormat(userLang, {
      style: "currency",
      currency: obj.currency
    });
    return price.format(obj.price);
  }

  //adding Discount offer to the items in PDP
  let currentPDPURL = window.location.href;
  let PDPsku = currentPDPURL.split("#")[1];
  //var isNotRFCable = currentPDPURL.includes("rf-cable-assemblies");
  setTimeout(function () {
    if (getDiscountOffer()) {
      $.ajax({
        url: "/bin/discountFactor",
        data: {
          CTCustomerToken: window.isCustomerToken(),
          bearerToken: window.getbearerToken(),
          SKU: PDPsku
        },
        success: function (response) {
          //window.errorModule.checkError(response);
          window.getUTILITYModule
          .getUtility()
          .done(function (response) {
            labelData = response ? response[0] : [];
          }).fail(function (error) { });
          
          //rf-cable-assemblies
          if (response.statusCode !== 401) {
            var isCustomerGroupNotNull = response.masterVariant.price
            var indexPrice = (response.masterVariant.price.value.centAmount / 100).toFixed(2);
            var tiers = response.masterVariant.price.tiers;
            if (isCustomerGroupNotNull !== "" && isCustomerGroupNotNull !== undefined) {
              $(".price-details-info").addClass("dist-price-added");
              $(".price-details-info")
                .find(">.order-details")
                .append('<span class="order-items-price qnty">'+labelData.labels.distcountPrice+'</span>');
              $(".pricetire")
                .find(".order-details.pd-price")
                .eq(0)
                .append(
                  '<span class="order-items-price font-normal">$' +
                  window.priceFormate.formateCheckout(indexPrice) +
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
                      window.priceFormate.formateCheckout(discountPrice) +
                      "</span>"
                    );
                }
              });
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
  }, 1000);
  function getDiscountOffer() {
    const logedinUserData = $.fn.cookiesRead().logedInCookiesData() || [];
    if (!logedinUserData) {
      return;
    }
    if (logedinUserData?.customer?.customerGroup) {
      return true;
    } else { return false };
  }
  window.$pdpCustomVariant = {
    customlengthselect,
    init,
    getProductPriceData,
    getData,
    setPriceContent,
    priceDom,
    getMinMaxQuantity,
    setPriceWithCurrency,
    getDiscountOffer
  };
})();
