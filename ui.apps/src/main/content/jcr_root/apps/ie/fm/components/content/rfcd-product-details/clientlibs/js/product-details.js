(function ($) {
  const skuValue = window.location.hash.split("#")[1] || "FMC5427/0071";
  let connector1 = "",
    connector2 = "",
    cable = "",
    filename = "",
    priceData = "",
    labelText = "",
    messageText = "",
    productDetail = {
      Name: " ",
      Id: " ",
      unitPrice: " ",
      startingPrice: " ",
      length: " ",
      color: " ",
      bestSellerRank: " ",
      inventory: " ",
      category: "Custom Cable Assembly Product",
      type: ""
    };

  $(document).ready(function () {
    $(".cmp-breadcrumb__item--active").children("span").text("");
    init();
    window.getUTILITYModule
    .getUtility()
    .done(function (data) {
      callUtiltyLabels(data[0]);
      setEvents();
    })
    .fail(function (error) {});
  });

  function callUtiltyLabels(utilityMessage) {
    $olccProduct.labelText = utilityMessage.labels;
    $olccProduct.messageText = utilityMessage.messages;
    setDomLabels();
  }

  function init() {
    var bearertoken = window.getbearerToken();
    getData(
      "/bin/olcc/getCableAssembly?sku=" +
        skuValue +
        "&bearertoken=" +
        bearertoken,
      "GET",
      "setContent"
    );
  }

  function lengthQntyUnit() {
    let length = $("#input_field_length").val();
    let quantity = $("#qty_number").val();
    let unit = $("#unit").val().toUpperCase();
    return { length, quantity, unit };
  }

  function fetchPriceData() {
    $(".modal-spinner-cls").removeClass("hide");
    $(".price-details-info").show();
    let prd_dtl = $olccProduct.lengthQntyUnit();
    $olccProduct.productDetail.length = prd_dtl.length;
    getProductPriceData(
      "USD",
      skuValue,
      prd_dtl.quantity,
      prd_dtl.unit,
      prd_dtl.length
    );
  }

  function fetchData() {
    fetchPriceData();
    $olccDeliveryFnc.zipCheck();
    if ($(".zip-button").hasClass("zip-button-red"))
      $olccDeliveryFnc.zipValidate();
  }

  function getProductPriceData(
    currency,
    skuValue,
    quantity,
    unitOfMeasurement,
    length
  ) {
    let form = new FormData();
    let queryObject = {
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
    contentType,
    headerObj
  ) {
    let DataObject = {
      url: url,
      method: method,
      timeout: 0,
      data: querydata,
      processData: processData,
      mimeType: mimeType,
      contentType: contentType,
      headers: headerObj
    };
    $.ajax(DataObject).done(function (response) {
      var data = response;
      window.errorModule.checkError(response,true);
      try {
        $olccProduct[functionName](data);
        let sku = $("#sku-number").text();
        let startingPrice = $("#price_0").text();
        let productLength = $olccProduct.productDetail.length;
        let prodColor = $("#cable_color").text();
        let productName = $olccProduct.productDetail.Name;
        let price = data;
        let productPrice = JSON.parse(price).customLengthUnitPrice;
        rfcaProductDatalayer(
          sku,
          startingPrice,
          productPrice,
          productLength,
          prodColor,
          productName
        );
      } catch (error) {
        data.message != undefined
          ? console.log(data.message)
          : console.log(error);
      }
    }).fail(function (error) {
      window.errorModule.showErrorPopup(error);
    });
  }

  function setContent(data) {
    addProductDetails(data);
    $keySpecs.keySpecDom(data, [
      "connector1",
      "connector2",
      "cable",
      "assemblyOptions"
    ]);
    setOnLoad();
    setEvents();
    setAttrCartButton();
    setPDFMergeParameters(data);
    getOlccAnalyticsDetails();
  }

  function setDomLabels() {
    let labelText = $olccProduct.labelText;
    let messageText = $olccProduct.messageText;
    $("#pin_label1").text(labelText.confirmShippingDate);
    $("#pin_label2").text(labelText.shippingASP);
    $(".pdp-callus-contlab").text(messageText.deliveryCallUsLabel);
    $(".pdp-callus-num")
      .text(messageText.callUsPhoneNum)
      .attr("href", "tel:" + messageText.callUsPhoneNum);
    $(".delivery-error").text(messageText.notValidPostalCode);
    $("#zip").attr("placeholder", messageText.enterPostalCode);
    $(".quantity_label").text(labelText.quantity);
    $("#testing_label").text(labelText.rfCableAssmblyTesting);
    $("#color_label").text(labelText.color);
    $("#length_label").text(labelText.length);
    $(".minimum_value").text(labelText.minimumInchInfo);
    $("#unit_label").text(labelText.unit);
    $(".price_label").text(labelText.price);
    $(".discount_label").text(labelText.distcountPrice);
    $("#sku_label").text(labelText.sku);
    $(".read_text").text(labelText.expand);
    $("#download_Merged_PDF").text(labelText.downloadDatasheet);
    $(".cart-button").text(labelText.addToCart);
    $(".key-title").text(labelText.keySpecifications);
    $("#input_field_length").attr("placeholder", labelText.enterLength);
    $(".cancel_click").text(
      labelText.cancel.charAt(0).toUpperCase() +
        labelText.cancel.slice(1).toLowerCase()
    );
    $(".add_click").text(labelText.add);
    addOptionsToUnitField(labelText);
   
  }
  function addOptionsToUnitField(labelText){
    let optionTemplate = "";
    let template = $(".unit_field").clone();
    labelText.unitOptions.map((ele,i) => {
      let optionText=ele.text
      $(template).find("option").attr({
        value: optionText,
        "data-instruction": ele.message,
        id: "unit-option-" + (i + 1),
      }).text(optionText);
      optionTemplate += $(template).html()
    })
    $(".unit_field").html(optionTemplate)
  }
  function setPDFMergeParameters(data) {
    connector1 = data.connector1.pn;
    connector2 = data.connector2.pn;
    cable = data.cable.pn;
    mergedPdfUpload(connector1, connector2, cable);
  }

  function setPriceContent(data) {
    priceData = JSON.parse(data);
    $(".modal-spinner-cls").addClass("hide");
    $("#sku-number").html(priceData.sku).attr("data-sku", priceData.sku);
    setPriceDom();
  }

  function setAttrCartButton() {
    let productDetail = $olccProduct.productDetail;
    $(".cart-button").attr("data-cartqty", $("#qty_number").val());
    $(".cart-button").attr("data-sku", skuValue);
    $(".cart-button").attr("data-currency", "USD");
    productDetail.Id = "";
    productDetail.bestSellerRank = "";
    productDetail.inventory = "";

    productDetail.unitPrice = ""; //Receive (Need to fetch from calculacustomlenght API)
    productDetail.startingPrice = ""; //Receiving from browser
    productDetail.length = ""; //Receiveing (whatever user has added)
    //var data_analyticcartprod = skuValue + "@@" + productDetail.Name + "@@" + productDetail.Id + "@@" + productDetail.unitPrice + "@@" + productDetail.startingPrice + "@@" + productDetail.length + "@@" + productDetail.color + "@@" + productDetail.bestSellerRank + "@@" + productDetail.inventory + "@@" + productDetail.category + "@@RF Cable Designer";
    let data_analyticcartprod = "";
    $(".cart-button").attr("data-analyticcartprod", data_analyticcartprod);
  }

  function setPriceDom() {
    let content = "";
    for (i = 0; i <= priceData.priceTiers.length - 2; i++) {
      let ele = priceData.priceTiers[i];
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
    let minQuantity =
      priceData.priceTiers[priceData.priceTiers.length - 1].minimumQuantity +
      "+";
    content += priceDom(
      minQuantity,
      "",
      $olccProduct.labelText.pleaseCallForQuote,
      undefined,
      priceData.priceTiers.length,
      "desktop_price_text"
    );
    content += priceDom(
      minQuantity,
      "",
      "Call",
      undefined,
      priceData.priceTiers.length + 1,
      "mobile_price_text"
    );
    $(".price_details").html(content);
    if (priceData.priceTiers[0].discountedPrice != undefined)
      $(".price-details-info .pd-price").addClass("with_discount");
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
      " " +
      maxQuantity +
      "</span>";
    content +=
      '<span class="order-items-price font-normal" id="price_' +
      index +
      '">' +
      price +
      "</span>";
    if (discountedPrice != undefined) {
      $(".price-details-info .discount_label").show();
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

  function getMinMaxQuantity(obj, priceArray, index) {
    minQuantity = obj.minimumQuantity + " -";
    maxQuantity = priceArray[index + 1].minimumQuantity - 1;
    return [minQuantity, maxQuantity];
  }

  function addProductDetails(data) {
    $olccProduct.productDetail.Name = data.name["en-US"] || data.name.en;
    $(".pdpheader-title").html(data.name["en-US"] || data.name.en);
    $(".mob-pdpheader-title").html(data.name["en-US"] || data.name.en);
    $("#sku-number").html(data.sku).attr("data-sku", data.sku);
    $(".pdpheader-desc").html(data.description["en-US"] || data.description.en);
    $(".cmp-breadcrumb__item--active")
      .children("span")
      .text(data.name["en-US"] || data.name.en);
  }

  function isEllipsisActive($jQueryObject) {
    return $jQueryObject.height() < $jQueryObject[0].scrollHeight;
  }
  function setOnLoad() {
    $(".modal-spinner-cls").addClass("hide");
    if (isEllipsisActive($(".pdpheader-desc"))) $(".morecontent").show();
  }

  function checkLengthQtyValue() {
    if ($("#input_field_length").val() == "" || $("#qty_number").val() == "") {
      return true;
    }
  }

  function updateLength(selectField) {
    let currentOption = selectField.find("option:selected")
    let currentId = currentOption.attr("id").split("-")[2]
    let currentOptionObj=$olccProduct.labelText.unitOptions[currentId-1]
    $(".minimum_value").text(currentOptionObj.message);
    if (
      $("#unit").val() == currentOptionObj.text &&
      (Number($("#input_field_length").val()) < Number(currentOptionObj.minValue) || $("#input_field_length").val == "")
    ) {
      $("#input_field_length").val(currentOptionObj.minValue);
    }
  }

  function addToCartFn() {
    $olccProduct.productDetail.length = $("#input_field_length").val();
    var currencyValue = "USD";
    var skuValue1 = skuValue;
    var quantity = $("#qty_number").val();
    var unitOfMeasurement = $("#unit").val().toUpperCase();
    var length = $("#input_field_length").val();
    var cusTocken = window.isCustomerToken() || "";
    var bearerToken = window.getbearerToken();
    var testingPrice = "na";
    if ($("#assembly_testing").prop("checked") == true) {
      testingPrice = {
        sku: "VNATEST",
        amount: $("#assembly_testing_value").val()
      };
    }

    if (
      currencyValue != null &&
      currencyValue != "undefined" &&
      currencyValue != ""
    ) {
      if (skuValue1 != null && skuValue1 != "undefined" && skuValue1 != "") {
        if (quantity != null && quantity != "undefined" && quantity != "") {
          $.ajax({
            type: "PUT",
            url: "/bin/olcc/addcustomlengthtocart",
            data: {
              CTCustomerToken: cusTocken,
              currency: currencyValue,
              unitOfMeasurement: unitOfMeasurement,
              length: length,
              masterSku: skuValue1,
              quantity: quantity,
              bearertoken: bearerToken,
              cableAssemblyTesting: JSON.stringify(testingPrice)
            },
            success: function (loginResponse, textstatus, xhr) {
              window.errorModule.checkError(loginResponse);
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

                  // $(document).trigger("custom-cart-response", loginResponse);
                  $(document).trigger(
                    $.fn.getAPIEndpoint().customEvent.SHOPPING_CART_RESPONSE,
                    loginResponse?.cart
                  );
                  $(".cart-button").blur();
                  //code for analytic add to cart datalayer call
                  let analyticCustomItem = "";
                  analyticCustomItem = loginResponse?.cart?.customLineItems;
                  productAddedSKU = skuValue1;
                  addTocartProductArr = [];
                  productLength = "";
                  if (
                    $("#input_field_length") != undefined &&
                    $("#input_field_length") != null
                  ) {
                    productLength = $("#input_field_length").val();
                  }

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
                  if (
                    $("#assembly_testing") != undefined &&
                    $("#assembly_testing") != null
                  ) {
                    rfcaTestingVal = $("#assembly_testing").prop("checked");
                  }
                  pageCategory = "RF Cable Designer";
                  //addToCartAllProdDL(analyticCustomItem,color,startingPrice,pageCategory,rfcaTestingVal)
                  addToCartAllProdDL(
                    addTocartProductArr,
                    quantity,
                    rfcaTestingVal,
                    pageCategory
                  );
                }
              } else {
                console.log(loginResponse);
              }
            },
            error: function (error) {
              window.errorModule.showErrorPopup(error);
            }
          });
        }
      }
    }
  }

  function getOlccAnalyticsDetails() {
    let productDetail = $olccProduct.productDetail;
    let productDetailsVal =
      skuValue +
      "@@" +
      productDetail.Name +
      "@@" +
      productDetail.Id +
      "@@" +
      productDetail.unitPrice +
      "@@" +
      productDetail.startingPrice +
      "@@" +
      productDetail.length +
      "@@" +
      productDetail.color +
      "@@" +
      productDetail.bestSellerRank +
      "@@" +
      productDetail.inventory +
      "@@" +
      productDetail.category +
      "@@" +
      productDetail.type;
    let prodDetArr = [];
    if (productDetailsVal != "" && productDetailsVal != undefined) {
      prodDetArr = productDetailsVal.split("@@");
      for (i = 0; i < prodDetArr.length; i++) {
        if (prodDetArr[i] === "undefined") {
          prodDetArr[i] = "";
        }
      }
    }
    olccProductDLCall(prodDetArr, "RF Cable Designer");
  }

  function setEvents() {
    $("a.morelink")
      .off("click")
      .on("click", function () {
        if (
          $(this).find(".read_text").text() == $olccProduct.labelText.expand
        ) {
          $(this).find(".read_text").text($olccProduct.labelText.readLess);
          $(".desc").addClass("show_all");
        } else {
          $(this).find(".read_text").text($olccProduct.labelText.expand);
          $(".desc").removeClass("show_all");
        }
      });

    $(".accord-key-title")
      .off("click")
      .on("click", function () {
        $(".accord-key-desc").toggleClass("open");
      });

    $("#input_field_length")
      .off("blur")
      .on("blur", function (e) {
        updateLength($("#unit"));
        $(".cart-button").removeClass("disable");
        fetchData();
      });
    $("#qty_number")
      .off("keydown")
      .on("keydown", function (e) {
        if (e.keyCode === 190 || e.keyCode === 110) {
          e.preventDefault();
        }
      });
    $("#qty_number")
      .off("blur")
      .on("blur", function (e) {
        if ($(this).val() < 1 || $(this).val() > 9999 || $(this).val() == "")
          $(this).val(1);
        if (checkLengthQtyValue()) return;
        fetchData();
      });

    $("#unit")
      .off("change")
      .on("change", function () {
        if (checkLengthQtyValue()) return;
        updateLength($(this));
        fetchData();
      });
    $(".inc_dec_click")
      .off("click")
      .on("click", function () {
        var value = $("#qty_number").val();
        var target = $(this).attr("id");
        value = isNaN(value) ? 0 : value;
        target == "increase" ? value++ : value--;
        if (value < 1 || value > 9999) return;
        $("#qty_number").val(value);
        if (checkLengthQtyValue()) return;
        fetchData();
      });
    $(".add_click")
      .off("click")
      .on("click", function () {
        $("#assembly_testing").trigger("click");
        $("#testingPrice").modal("hide");
      });

    $(".product-details .cart-button")
      .off("click")
      .on("click", function () {
        addToCartFn();
      });

    $("#download_PDF_datasheet").hide();
  }

  function mergedPdfUpload(connector1, connector2, cable) {
    let mergedPdfFileName = skuValue.replace(/[^\w ]/g, "-") + ".pdf";
    $.ajax({
      url: "/bin/olcc/mergedPdfUpload",
      type: "POST",
      data: {
        mergedFileName: mergedPdfFileName,
        connector1: connector1 + ".pdf",
        connector2: connector2 + ".pdf",
        cable: cable + ".pdf"
      },
      success: function (mergedPdfUploadResponse, textstatus, xhr) {
        window.errorModule.checkError(mergedPdfUploadResponse);
        if (
          xhr.status == 200 &&
          mergedPdfUploadResponse.statusCode != 401 &&
          mergedPdfUploadResponse.statusCode != 400
        ) {
          filename = mergedPdfUploadResponse.fileName;
          $("#download_Merged_PDF").attr(
            "href",
            "/content/dam/infinite-electronics/product-assets/fairview-microwave/olcc-datasheets/" + filename
          );
          $("#download_PDF_datasheet").show();
        }
      },
      error: function (req, status, err) {
        console.log("Something went wrong", status, err);
        $("#download_PDF_datasheet").hide();
        window.errorModule.showErrorPopup(err);
      }
    });
  }
  document.querySelector("body").addEventListener(
    "click",
    function (e) {
      let productDetail = $olccProduct.productDetail;
      let anchor = e.target.closest("a");
      let prodNamedetails = productDetail.Name;
      let prodcatdetails = productDetail.category;
      let doccat = "";
      let docname = "";
      let doctype = "";
      let docid = "";
      if (
        anchor !== null &&
        anchor.closest(".analyticolccdownloadbtn") != null
      ) {
        doccat = "Datasheet";
        docid = "Datasheet";
        docname = anchor.href.split("/").pop().replace(".pdf", "");
        doctype = "Datasheet PDF";
        parameter =
          docname +
          "@@" +
          doctype +
          "@@" +
          prodNamedetails +
          "@@" +
          prodcatdetails +
          "@@" +
          "RF Cable Designer" +
          "@@" +
          "";
        parameterArray = parameter.split("@@");
        documentDLCall(parameterArray, "Click", doccat, docid);
      }
    },
    false
  );
  function enlarge() {
    var urlOfImage = document.getElementById("imgToBeChanged").src;
    var modal = document.getElementById("myModal");
    document.getElementById("img1").src = urlOfImage;
    modal.style.display = "block";
    var span = document.getElementsByClassName("pdpclose")[0];
    span.onclick = function() {
      modal.style.display = "none";
    }
  }
  window.$olccProduct = {
    setContent,
    setPriceContent,
    lengthQntyUnit,
    enlarge,
    productDetail,
    labelText,
    messageText,
    skuValue: skuValue
  };
})(jQuery);
