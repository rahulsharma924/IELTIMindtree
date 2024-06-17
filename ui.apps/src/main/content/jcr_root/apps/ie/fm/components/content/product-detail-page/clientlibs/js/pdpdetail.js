(function () {
  let colorCodeArr = [],
    allData = [];
  function utilitiyValues() {
    window.getUTILITYModule
      .getUtility()
      .done(function (response) {
        allData = response ? response[0] : [];
        //colorCodeArr = allData.colorCode;
      })

      .fail(function (error) {});
  }
  function readMoreNew() {
    let showChar;
    let width = $(window).width();
    if (width <= 832) {
      showChar = 90;
    } else {
      showChar = 200;
    }

    let ellipsestext = "...";
    let moretext =
      "Expand <i class='fa-regular fa-circle-plus font-16' aria-hidden='true'></i>";

    let lesstext =
      "Collapse<i class='fa fa-minus-circle' aria-hidden='true'></i>";

    $(".pdp-morenew").each(function () {
      let content = $(this).html();
      let contentText = $(this).text();
      if (content.length > showChar) {
        let c = contentText.substr(0, showChar);
        let h = content.substr(showChar, content.length - showChar);

        let html = `<p>${c}<span class="moreellipses">${ellipsestext}</span></p>
        <div class="morecontent"><div>${content}</div><a title="Read More"  class="morelink ie-withIcon-link">${moretext}</a></div>`;

        $(this).html(html);
      }
    });
    $("a.morelink").on("click", function () {
      if ($(this).hasClass("less")) {
        $(this).removeClass("less");
        $(this).html(moretext);
      } else {
        $(this).addClass("less");
        $(this).html(lesstext);
      }
      $(this).parent().prev().toggle();
      $(this).prev().toggle();
      return false;
    });
  }

  function accordionMobile() {
    setTimeout(function () {
      $(".accord-key-title").click(function () {
        $(this).toggleClass("open");
        $(".accord-key-desc").toggleClass("open").toggle(300);
        $(".accord-key-links").toggleClass("open").toggle(300);
      });
      $(".accord-compli-title").click(function () {
        $(this).toggleClass("open");
        $(".accord-compli-desc").toggleClass("open").toggle(300);
        $(".accord-compli-links").toggleClass("open").toggle(300);
      });
    }, 800);
    let shipDate = (document.getElementById("shipmentDate").innerHTML =
      estimatedShipment.getEstimatedShipmentDate());
    $(".shipment-date").each(function () {
      $(this).html(shipDate);
    });
  }

  /*
   *quantityUpdate() : Update quanty value after clicking on + and -
   */
  function quantityUpdate() {
    let $qty, plus, minus, oldValue, newValue;
    $qty = $(".pdp__quantityupdate");
    if ($qty) {
      // Plus Update
      $qty.find(".button-plus").on("click", function () {
        plus = Number($qty.find(".input-plus-minus").val());
        if (plus > 0 && plus < 99999) {
          newValue = plus + 1;
          $qty.find(".input-plus-minus").val(newValue);
          $(".add_to_cart--pdp").attr("data-cartqty", newValue);
          if ($(".pdp__quantityupdate").hasClass("ctQty-update")) {
            $pdpCustomVariant.ctPriceQtyUpdate(newValue);
          } else {
            quantityPriceUpdate(newValue);
          }
        }
      });
      // Minus Update
      $qty.find(".button-minus").on("click", function () {
        minus = Number($qty.find(".input-plus-minus").val());
        if (minus > 1 && minus <= 99999) {
          newValue = minus - 1;
          $qty.find(".input-plus-minus").val(newValue);
          $(".add_to_cart--pdp").attr("data-cartqty", newValue);
          //quantityPriceUpdate(newValue);
          $pdpCustomVariant.ctPriceQtyUpdate(newValue);
        }
        if ($(".pdp__quantityupdate").hasClass("ctQty-update")) {
          $pdpCustomVariant.ctPriceQtyUpdate(newValue);
        } else {
          quantityPriceUpdate(newValue);
        }
      });
      //Manual entry
      $qty.find(".input-plus-minus").on("input", function () {
        oldValue = Number($qty.find(".input-plus-minus").val());
        if (oldValue >= 1 && oldValue <= 99999) {
          $(".add_to_cart--pdp").attr(
            "data-cartqty",
            $qty.find(".input-plus-minus").val()
          );
          if ($(".pdp__quantityupdate").hasClass("ctQty-update")) {
            $pdpCustomVariant.ctPriceQtyUpdate(oldValue);
          } else {
            quantityPriceUpdate(oldValue);
          }
        }
      });
    }
  }

  function zipCheck(isCustom) {
    $(".confirm-pd-20  .delivery-details").hide();
    $(".confirm-pd-20  .delivery-error").hide();
    if (isCustom == "false") {
      let zipC = $(".order-country-input #zipS").val();
      if (/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zipC)) {
        $(".select-estimate .standard-shipment .zip-button").removeClass(
          "zip-button-grey zip-button-incative"
        );
        $(".select-estimate .standard-shipment .zip-button").addClass(
          "zip-button-red"
        );
      } else {
        $(".select-estimate .standard-shipment .zip-button").removeClass(
          "zip-button-red"
        );
        $(".select-estimate .standard-shipment .zip-button").addClass(
          "zip-button-grey"
        );
      }
    }
    if (isCustom == "true") {
      let zipC = $(".order-country-input #zipC").val();
      if (/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zipC)) {
        $(".select-estimate .custom-shipment .zip-button").removeClass(
          "zip-button-grey zip-button-incative"
        );
        $(".select-estimate .custom-shipment .zip-button").addClass(
          "zip-button-red"
        );
      } else {
        $(".select-estimate .custom-shipment .zip-button").removeClass(
          "zip-button-red"
        );
        $(".select-estimate .custom-shipment .zip-button").addClass(
          "zip-button-grey"
        );
      }
    }
  }

  function zipValidate(overSized, isCustom) {
    let zip;
    $(".confirm-pd-20  .delivery-details").hide();
    $(".confirm-pd-20  .delivery-error").hide();
    if (isCustom == "false") {
      zip = $(".order-country-input #zipS").val();
      $(".select-estimate .standard-shipment .zip-button").removeClass(
        "zip-button-red"
      );
      $(".select-estimate .standard-shipment .zip-button").addClass(
        "zip-button-incative"
      );
    }
    if (isCustom == "true") {
      zip = $(".order-country-input #zipC").val();
      $(".select-estimate .custom-shipment .zip-button").removeClass(
        "zip-button-red"
      );
      $(".select-estimate .custom-shipment .zip-button").addClass(
        "zip-button-incative"
      );
    }
    $(".cart__loader").removeClass("d-none");

    $.ajax({
      type: $.fn.getAPIEndpoint().requestType.POST,
      url: $.fn.getAPIEndpoint().VALIDATE_ADDRESS_GUEST,
      data: {
        jsonData: JSON.stringify({
          address: { country: "US", postalCode: zip }
        }),
        bearerToken: window.getbearerToken()
      },
      success: function (validateAddrResponse) {
        //window.errorModule.checkError(validateAddrResponse);
        if (validateAddrResponse?.coordinates) {
          $(".confirm-pd-20 .delivery-error").hide();

          if (overSized != undefined && overSized != null && overSized != "") {
            getCallusModal();
          } else if (isCustom == "false") {
            let skuId = $(".order-items-price #pdpSku").text();
            let prodQty = $(".pdp__quantityupdate #pdpProdQty").val();
            getProdDelDate(skuId, prodQty, zip);
          } else if (isCustom == "true") {
            let skuId = $(".base-sku").text();
            let length = $("#input-custom-select").val();
            let uom = $("#customunitselect  option:selected").val();
            let prodQty = $(".pdp__quantityupdate #pdpProdQty").val();

            getProdDelDateForCustom(zip, prodQty, skuId, uom, length);
          }
        } else {
          $(".select-estimate .zip-button").removeClass(
            "zip-button-grey zip-button-incative"
          );
          $(".select-estimate .zip-button").addClass("zip-button-red");
          $(".confirm-pd-20 .delivery-details").hide();
          $(".cart__loader").addClass("d-none");
          $(".confirm-pd-20 .delivery-error").show();
        }
      },
      error: function (error) {
        window.errorModule.showErrorPopup(error);
      }
    });
  }

  // function for getting the delivery date
  function getProdDelDate(skuId, prodQty, zip) {
    $.ajax({
      type: $.fn.getAPIEndpoint().requestType.POST,
      url: $.fn.getAPIEndpoint().GET_PRODUCT_DELDATE,
      data: {
        bearerToken: window.getbearerToken(),
        transitTime: "true",
        zipcode: zip,
        skuId: skuId,
        countryCode: "US",
        prodQty: prodQty
      },
      success: function (response) {
        //window.errorModule.checkError(response);
        parseAndGetDelDate(response);
        $(".select-estimate .zip-button").removeClass(
          "zip-button-grey zip-button-incative"
        );
        $(".select-estimate .zip-button").addClass("zip-button-red");
      },
      error: function (error) {
        window.errorModule.showErrorPopup(error);
      }
    });
  }

  // function for getting the confirmed shipment for custom length products
  function getProdDelDateForCustom(zip, prodQty, skuId, uom, length) {
    $.ajax({
      type: $.fn.getAPIEndpoint().requestType.POST,
      url: $.fn.getAPIEndpoint().GET_PRODUCT_DELDATE_CUST,
      data: {
        bearerToken: window.getbearerToken(),
        transitTime: "true",
        countryCode: "US",
        zipcode: zip,
        prodQty: prodQty,
        masterSku: skuId,
        uom: uom,
        length: length
      },
      success: function (response) {
        //window.errorModule.checkError(response);
        parseAndGetDelDate(response);
        $(".select-estimate .zip-button").removeClass(
          "zip-button-grey zip-button-incative"
        );
        $(".select-estimate .zip-button").addClass("zip-button-red");
      },
      error: function (error) {
        window.errorModule.showErrorPopup(error);
      }
    });
  }
  //function for delivery date
  function parseAndGetDelDate(response) {
    if (response.errors !== undefined && response.errors !== null) {
      if (response.errors[0].code === "OVERWEIGHT") {
        $(".cart__loader").addClass("d-none");
        $(".confirm-pd-20 .deliver-error").hide();
        $(".confirm-pd-20 .deliver-callus").show();
        const $callusPopup = $(".pdp-callus");
        if ($callusPopup.length) {
          $(document).on("click", function () {
            $callusPopup.hide();
          });
          const $clsBtn = $(".pdp-callus__close");
          if ($clsBtn.length) {
            $($clsBtn).on("click", function () {
              $callusPopup.hide();
            });
          }
          $callusPopup.click(function (e) {
            e.stopPropagation();
          });
        }
      }
    } else {
      $(".confirm-pd-20 .deliver-error").hide();
      $(".confirm-pd-20 .deliver-valid").show();
      $(".cart__loader").addClass("d-none");
      $("#delEst").text(estimatedShipment.getEstimatedShipmentDate());
    }
  }

  function getCallusModal() {
    $(".cart__loader").addClass("d-none");
    $(".confirm-pd-20 .deliver-error").hide();
    $(".confirm-pd-20 .deliver-callus").show();
    const $callusPopup = $(".pdp-callus");
    if ($callusPopup.length) {
      $(document).on("click", function () {
        $callusPopup.hide();
      });
      const $clsBtn = $(".pdp-callus__close");
      if ($clsBtn.length) {
        $($clsBtn).on("click", function () {
          $callusPopup.hide();
        });
      }
      $callusPopup.click(function (e) {
        e.stopPropagation();
      });
    }
  }

  function imgChanged() {
    $(".img-in-col").click(function (element) {
      let picSrc = element.target.getAttribute("data-picsrc1");
      document.getElementById("img-to-be-changed").src = picSrc;
    });
  }
  function enlarge() {
    var urlOfImage = document.getElementById("img-to-be-changed").src;
    var modal = document.getElementById("myModal");
    document.getElementById("img1").src = urlOfImage;
    modal.style.display = "block";
    var span = document.getElementsByClassName("pdpclose")[0];
    span.onclick = function () {
      modal.style.display = "none";
    };
  }
  function downloadAll() {
    $(".downl-anch").click(function () {
      let urlList = "";
      $(".modal-body")
        .find("a")
        .each(function () {
          if ($(this).attr("href").startsWith("https")) {
            if (!urlList.includes($(this).attr("href"))) {
              urlList = urlList + $(this).attr("href") + ",";
            }
          }
        });
      let zip = new JSZip();
      let urls = urlList.split(",");
      let count = 0;
      let zipFilename = "pdfs.zip";
      Array.from(urls).forEach(function (url) {
        let filename = "filename";
        JSZipUtils.getBinaryContent(url, function (err, data) {
          if (err) {
            console.log("Error");
          } else {
            let filename = url.replace(/.*\//g, "");
            zip.file(filename, data, { binary: true, createFolders: true });
            count++;
            if (count == urls.length) {
              zip
                .generateAsync({
                  type: "blob"
                })
                .then(function (blob) {
                  saveAs(blob, zipFilename);
                });
            }
          }
        });
      });
    });
  }

  function getSeoName(sku) {
    const { algoliasearch } = window;
    let client = algoliasearch(algId, algApi);
    let index = client.initIndex(indexInuse);
    return index.getObjects([sku], {
      attributesToRetrieve: [
        "hierarchicalCategories",
        "seoName",
        "categorySEOURL"
      ]
    });
  }
  function selectLengthColor() {
    $("#select-length").on("change", function () {
      let selectvalue = $(this).val();
      /* const onlyNumbers = selectvalue.replace(/\D/g, "");
      const onlyCharacter = selectvalue.replace(/\d+/g, "").trim();
      $(".orignal-sku").hide();
      $(".newSelected-sku").show();
      $(".custom-sku").hide();
      $(".base-sku").show();


     /*  let currentColor = $("#color-value").text();
      $("#color-value").empty();

      Object.keys(colorCodeArr).forEach(item => {
       if (currentColor == colorCodeArr[item].color) {
        $("#color-value").append("/"+colorCodeArr[item].code);
        }
        else{}
      }); 

        $("#length-value").empty();
        if (onlyNumbers != "0") {
          if (onlyCharacter == "cm") {
             $("#length-value").append("-",onlyNumbers,"CM");
          }
          else {
            $("#length-value").append("-",onlyNumbers);
          }
        } else {
          $("#length-value").empty();
        } */
      let finalValue = selectvalue;
      getSeoName(finalValue).then(function (response) {
        if (response.results[0] !== null) {
          let variantUrl = SeoUrl(response.results[0]);
          location.assign(variantUrl);
        } else {
          console.log("Invalid Sku");
        }
      });
    });
    /* $("#select-color").on("change", function () {
      $(".orignal-sku").hide();
      $(".newSelected-sku").show();
      let selectvalue = $(this).val();
      $("#color-value").empty();
      Object.keys(colorCodeArr).forEach(item => {
       if (selectvalue == colorCodeArr[item].color) {
        $("#color-value").append("/"+colorCodeArr[item].code);
        }
        else{}
      });
      let finalValue = $(".newSelected-sku").text();
      getSeoName(finalValue).then(function (response) {
                if (response.results[0] !== null) {
                  let variantUrl = SeoUrl(response.results[0]);
                  location.assign(variantUrl);
                }
                else {
                  console.log("Invalid Sku");
                }

              });
    }); */
  }
  function addToCartCustom() {
    var currencyValue = "USD";
    var skuValue1 = $(".base-sku").text();
    var quantity = $("#pdpProdQty").val();
    var unitOfMeasurement = $("#customunitselect").val().toUpperCase();
    var length = $("#input-custom-select").val();
    var cusTocken = window.isCustomerToken() || "";
    var bearerToken = window.getbearerToken();
    var testingPrice = "na";
    if ($("#assembly_testing").prop("checked") == true) {
      testingPrice = {
        sku: "VNATEST",
        amount: $("#assembly_testing_value").val()
      };
    }
    //cableAssemblyTesting:JSON.stringify(testingPrice)
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
                  // $(document).trigger("custom-cart-response", loginResponse);
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
                    rfcaTestingVal,
                    pageCategory;
                  analyticCustomItem = "";
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

  //analytics code to get product details on pdp page
  function getPdpAnalyticsDetails() {
    var productDetailsVal = document.querySelector(
      "#analyticspdpproddetails"
    ).value;
    let prodDetArr;
    if (productDetailsVal != "" && productDetailsVal != undefined) {
      prodDetArr = productDetailsVal.split("@@");
      for (i = 0; i < prodDetArr.length; i++) {
        if (prodDetArr[i] === "undefined") {
          prodDetArr[i] = "";
        }
      }
    }
    plpProductDLCall(prodDetArr, "pdp");
  }
  function showRfqPopup() {
    $("#rfqModal").modal("show");
    populatePdpRFQ();
  }

  function getProductDetailsForRFQ() {
    let $prodSkuEle = $(".pricing-tiersku");
    let prodSku = $prodSkuEle.find("#pdpSku").text();

    let prodPrice = "-";

    let $prodNameEle = $(".main-title-description");
    let prodName = $prodNameEle.find(".pdpheader-title").text();

    let prodQty = "-";

    let $prodImgEle = $(".product_card");
    let prodImgSrc = $prodImgEle.find(".plp-img-src").attr("src");

    return {
      prodSku: prodSku,
      prodPrice: prodPrice,
      prodName: prodName,
      prodQty: prodQty,
      prodImgSrc: prodImgSrc
    };
  }

  function rfq_ordersummary() {
    let $minipopParent = $(".popItem_wrapper");
    let $popItem = $minipopParent.find(".order-cal-table-rfq-body");
    let $dataFillup = $minipopParent.find(".data__fillup");

    let prodDetails = getProductDetailsForRFQ();

    let prodSku = prodDetails.prodSku;
    let prodPrice = prodDetails.prodPrice;
    let prodName = prodDetails.prodName;
    let prodQty = prodDetails.prodQty;
    let prodImgSrc = prodDetails.prodImgSrc;

    let subtotal = "-";

    $popItem
      .find(".productImg-wrapper img")
      .attr("src", prodImgSrc)
      .attr("alt", prodSku);

    $popItem
      .find(".product-content-wrapper")
      .find(".varient_sku")
      .html(`SKU: <span class="bolder-txt">${prodSku}</span>`);

    let $skuTitle = `<a href="product-details.html#TEST013">${prodName}</a>`;
    $popItem.find(".varient_name").html($skuTitle);
    $popItem.find(".pop_quantity").text(prodQty);
    $popItem.find(".pop_price").text(prodPrice);
    $popItem.find(".pop_total").text(subtotal);
    $dataFillup.append($popItem);
    if (
      $(
        ".form-details-rfq input.form-control, .form-details-rfq select.form-control"
      ).val() !== ""
    ) {
      $(".rfqModal-save-btn").attr("disabled", false);
    }
    $minipopParent.find(".pop_totalprice").text(subtotal);
  }
  function populatePdpRFQ() {
    const userInfo = $.fn.cookiesRead(),
      customerToken = $.fn.cookiesRead().customerToken(),
      userData = userInfo ? userInfo.logedInCookiesData() : [];

    if (customerToken != null || customerToken != undefined) {
      var firstName = "";
      var lastName = "";
      var companyName = "";
      var email = "";
      var contactNum = "";
      var custAddress = "";
      var shippingAdd1 = "";
      var shippingAdd2 = "";
      var city = "";
      var country = "";
      var state = "";
      var postalcode = "";

      if (userData) {
        //if (document.cookie.length != 0) {

        firstName = userData?.customer?.firstName;
        lastName = userData?.customer?.lastName;
        companyName = userData?.customer?.companyName;
        email = userData?.customer?.email;
        contactNum = userData?.customer?.custom?.fields?.contact;

        custAddress = userData?.customer?.defaultShippingAddressId;
        for (n = 0; n < userData?.customer?.addresses.length; n++) {
          if (custAddress === userData.customer.addresses[n].id) {
            shippingAdd1 = userData?.customer?.addresses[n].streetNumber;
            shippingAdd2 = userData?.customer?.addresses[n].streetName;
            city = userData?.customer?.addresses[n].city;
            country = userData?.customer?.addresses[n].country;
            state = userData?.customer?.addresses[n].state;
            postalcode = userData?.customer?.addresses[n].postalCode;
          }
        }
        //}
      }
      var rfqfirstname = $("#firstName-rfq");

      if (firstName !== "" && $("#firstName-rfq") != null) {
        $("#firstName-rfq").val(firstName);
      }
      if (lastName !== "" && $("#lastName-rfq") != null) {
        $("#lastName-rfq").val(lastName);
      }
      if (
        companyName !== "" &&
        $("#company-rfq") != null &&
        companyName !== "NA"
      ) {
        $("#company-rfq").val(companyName);
      }
      if (email !== "" && $("#email-rfq") != null) {
        $("#email-rfq").val(email);
      }
      if (contactNum !== "" && $("#contact-rfq") != null) {
        $("#contact-rfq").val(contactNum);
      }
      if (shippingAdd1 !== "" && $("#shippingAdd-rfq") != null) {
        $("#shippingAdd-rfq").val(shippingAdd1);
      }
      if (
        shippingAdd2 !== "" &&
        shippingAdd2 !== "NA" &&
        $("#shippingAdd2-rfq") != null
      ) {
        $("#shippingAdd2-rfq").val(shippingAdd2);
      }
      if (city !== "" && $("#city-rfq") != null) {
        $("#city-rfq").val(city);
      }
      if (country !== "" && $("#country-rfq") != null) {
        $("#country-rfq").val(country);
        $("#country-rfq option[value=" + country + "]").attr(
          "selected",
          "selected"
        );
        $("#country-rfq").trigger("change");
      }
      if (postalcode !== "" && $("#zipcode-rfq") != null) {
        $("#zipcode-rfq").val(postalcode);
      }
      if (state !== "" && $("#state-rfq") != null) {
        $("#state-rfq").val(state);
      }

      //}
    }
    rfq_ordersummary();
  }
  function setEvents() {
    $(".input-plus-minus")
      .off("blur")
      .on("blur", function () {
        if ($(this).val() < 1 || $(this).val() > 99999 || $(this).val() == "")
          $(this).val(1);
      });
  }
  //Dynamic breadcrumb
  function breadcrumbCSR(data) {
    let linkLvl0, linkLvl1, linkLvl2;
    let customlink = $("#iebreadcrumb").attr("data-customcable");
    let customl0 = $("#iebreadcrumb").attr("data-customl0");
    let customl1 = $("#iebreadcrumb").attr("data-customl1");
    let customl2 = $("#iebreadcrumb").attr("data-customl2");
    let breadcrumbLvl0, breadcrumbLvl1, breadcrumbLvl2, slug0, slug1, slug2;
    let origin = window.origin;
    let breadcrumbAll = $(".category3").text();
    let splitBreadcrumb = breadcrumbAll.split(">");
    if (splitBreadcrumb[0] != undefined) {
      breadcrumbLvl0 = splitBreadcrumb[0].trim();
    }
    if (splitBreadcrumb[1] != undefined) {
      breadcrumbLvl1 = splitBreadcrumb[1].trim();
    }
    if (splitBreadcrumb[2] != undefined) {
      breadcrumbLvl2 = splitBreadcrumb[2].trim();
    }

    $.each(data, (index, item) => {
      if (breadcrumbLvl0 == item.category.name.trim()) {
        slug0 = item.category.seoName;
        let lvl1Arr = item.category.childCategories;
        if (lvl1Arr != null && lvl1Arr != undefined) {
          lvl1Arr.forEach((item) => {
            if (breadcrumbLvl1 == item.name.trim()) {
              slug1 = item.seoName;
              let lvl2Arr = item.childCategories;
              if (lvl2Arr != null && lvl2Arr != undefined) {
                lvl2Arr.forEach((item) => {
                  if (breadcrumbLvl2 == item.name.trim()) {
                    slug2 = item.seoName;
                  } else {
                  }
                });
              } else {
              }
            }
          });
        } else {
        }
      } else {
      }
    });
    if (slug0 == null || slug0.length <= 0 || slug0 == "undefined") {
      if (breadcrumbLvl0 == customl0) {
        slug0 = customlink;
        linkLvl0 = `${origin}/${customlink}.html`;
      }
      if (breadcrumbLvl1 == customl1) {
        slug1 = customlink;
        linkLvl1 = `${origin}/${customlink}.html`;
      }
      if (breadcrumbLvl2 == customl2) {
        slug2 = customlink;
        linkLvl2 = `${origin}/${customlink}.html`;
      }
    } else {
      linkLvl0 = `${origin}/category/${slug0}.html`;
      linkLvl1 = `${origin}/category/${slug0}/${slug1}.html`;
      linkLvl2 = `${origin}/category/${slug0}/${slug1}/${slug2}.html`;
    }

    $(".category3").empty();
    if (splitBreadcrumb.length == 3) {
      if (slug0 != undefined && slug1 != undefined && slug2 != undefined) {
        $(".category3").append(
          ` <a href="${linkLvl0}">${splitBreadcrumb[0]}</a> <i class="fa fa-angle-right" aria-hidden="true"></i> <a href="${linkLvl1}">${splitBreadcrumb[1]}</a> <i class="fa fa-angle-right" aria-hidden="true"></i> <a href="${linkLvl2}">${splitBreadcrumb[2]}</a> <i class="fa fa-angle-right" aria-hidden="true"></i> `
        );
      } else {
        $(".category3").append(
          ` ${splitBreadcrumb[0]} <i class="fa fa-angle-right" aria-hidden="true"></i> ${splitBreadcrumb[1]} <i class="fa fa-angle-right" aria-hidden="true"></i> ${splitBreadcrumb[2]} <i class="fa fa-angle-right" aria-hidden="true"></i> `
        );
      }
    } else if (splitBreadcrumb.length == 2) {
      if (slug0 != undefined && slug1 != undefined) {
        $(".category3").append(
          ` <a href="${linkLvl0}">${splitBreadcrumb[0]}</a> <i class="fa fa-angle-right" aria-hidden="true"></i> <a href="${linkLvl1}">${splitBreadcrumb[1]}</a> <i class="fa fa-angle-right" aria-hidden="true"></i> `
        );
      } else {
        $(".category3").append(
          ` ${splitBreadcrumb[0]} <i class="fa fa-angle-right" aria-hidden="true"></i> ${splitBreadcrumb[1]} <i class="fa fa-angle-right" aria-hidden="true"></i> `
        );
      }
    } else if (splitBreadcrumb.length == 1 && !splitBreadcrumb) {
      if (slug0 != undefined) {
        $(".category3").append(
          ` <a href="${linkLvl0}">${slug0}</a> <i class="fa fa-angle-right" aria-hidden="true"></i> `
        );
      } else {
        $(".category3").append(
          ` ${slug0} <i class="fa fa-angle-right" aria-hidden="true"></i> `
        );
      }
    } else {
      console.log("No category Breadcrumb");
    }
  }
  function replacementSKU() {
    let finalValue = $("#replacementSku").text();
    if (finalValue !== "") {
      getSeoName(finalValue).then(function (response) {
        if (response.results[0] !== null) {
          let variantUrl = SeoUrl(response.results[0]);
          $("#replacementSku").empty();
          $("#replacementSku").append(
            `<a class="ie-secondary-link color-replacementSku" href=${variantUrl}>${finalValue}</a>`
          );
        } else {
          console.log("Invalid Sku");
        }
      });
    }
  }
  function productSchema() {
    let imageUrlList = [];
    $(".pdp-thumbnails .plp-img-src").each(function (i, ele) {
      imageUrlList.push(`"${window.location.origin + $(ele).attr("src")}"`);
    });
    let sku = $("#pdpSku").text();
    let name = $(".pdpheader-title").text().trim();
    let highPrice = $(
      ".pricetire .order-details:first-child .order-items-price"
    )
      .text()
      .replaceAll("$", "")
      .replaceAll(",", "");
    let lastLength =
      $(".pricetire .order-details .order-items-price").length - 1;
    let lowPrice = $(
      ".pricetire .order-details:nth-child(" +
        lastLength +
        ") .order-items-price"
    )
      .text()
      .replaceAll("$", "")
      .replaceAll(",", "");
    let qtyAvailable = $(".quantity-div .order-items-price").text();
    let descParentClone = $(".pdpheader-desc").clone();
    descParentClone.children().remove().text();
    let lessText = descParentClone.text();
    let moreText = $(".pdpheader-desc")
      .children(":not(.moreellipses)")
      .children(":not(.morelink)")
      .text();
    let description = lessText + moreText;
    let scriptTag = `<script type="application/ld+json" id="product-schema">
   {
   "@context":"https://schema.org/",
   "@type":"Product",
   "name":"${name}",
   "mpn":"${sku}",
   "sku":"${sku}",
   "description":"${description}",
   "image":[${imageUrlList}],
   "brand":{
   "@type":"Brand",
   "name":"Fairview Microwave, Inc."
   },
   "offers":{
   "@type":"AggregateOffer","offerCount":"${qtyAvailable}","lowPrice":"${lowPrice}","highPrice":"${highPrice}","priceCurrency":"USD","availability":"https://schema.org/InStock","url":"[${window.location.href}]"
   }
   }
   </script>`;
    $("head").eq(0).append(scriptTag);
  }

  //function to get price and inventory from CT
  function getSkuPriceInventory() {
    let sku = $(".item-sku-ct").data("sku"),
      currency = $(".item-sku-ct").data("currency"),
      pricingTierBySKU,
      indexWithoutCustomerGroup,
      pricesGroup,
      itemPrice,
      formattedItemPrice,
      formattedItemPriceDiscount,
      itemPriceDiscount,
      itemInventory,
      formatteditemInventory,
      inventoryOutputHTML,
      priceOutputHTML,
      pdpPriceTier,
      isCustomerGroup;
    $.ajax({
      type: $.fn.getAPIEndpoint().requestType.GET,
      url: $.fn.getAPIEndpoint().PDP_PRICE_INVENTORY,
      data: {
        bearerToken: window.getbearerToken(),
        CTCustomerToken: window.isCustomerToken() || "",
        Currency: currency,
        SKU: sku
      },
      //success: function (response) {
      success: function (response, textstatus, xhr) {
        if (xhr.status == 200 && response.statusCode != 404) {
          pricingTierBySKU = getPricingTierBySKU(response, sku);
          pricesGroup = pricingTierBySKU?.prices;
          //find index from prices which is not customergroup
          indexWithoutCustomerGroup = Object.keys(pricesGroup).find(
            (key) => key !== "customerGroup"
          );
          itemPrice =
            pricesGroup.length > 0
              ? pricesGroup[indexWithoutCustomerGroup].value?.centAmount / 100
              : `NA`;
          itemPriceDiscount = pricingTierBySKU?.price
            ? pricingTierBySKU?.price?.value?.centAmount / 100
            : `NA`;
          formattedItemPrice = window.$algoliaWidget.formatPrice(itemPrice);
          formattedItemPriceDiscount =
            window.$algoliaWidget.formatPrice(itemPriceDiscount);

          itemInventory = pricingTierBySKU?.availability?.availableQuantity;
          formatteditemInventory =
            window.priceFormate.formatNumber(itemInventory);

          isCustomerGroup = pricingTierBySKU?.price?.customerGroup;

          if (isCustomerGroup !== undefined) {
            $(".price-details-info").addClass("dist-price-added");
            displayDiscountLabel();
          }

          inventoryOutputHTML = inventoryHTML(formatteditemInventory);
          priceOutputHTML = priceHTML(
            itemPrice,
            formattedItemPriceDiscount,
            formattedItemPrice,
            isCustomerGroup
          );
          pdpPriceTier = getPricingTiers(
            pricingTierBySKU,
            isCustomerGroup,
            formattedItemPrice,
            formattedItemPriceDiscount
          );

          //append the output to html
          updatedHTMLOutput("item-inventory-ct", inventoryOutputHTML, "html");
          updatedHTMLOutput("item-price-ct", priceOutputHTML, "html");
          updatedHTMLOutput("ct-price-tier", pdpPriceTier, "append");

          qtyPriceTierData(pricingTierBySKU);
        }
      },
      error: function (error) {
        window.errorModule.showErrorPopup(error);
      }
    });
  }

  //display call us if zero inventory
  function inventoryHTML(inventory) {
    let contactData = $(".item-inventory-ct").data("tel") || "",
      outofstocktext = $(".item-inventory-ct").data("outofstocktext") || "";
    return `              
      ${
        parseInt(inventory) > 0
          ? inventory
          : `<a class="call-link" href="tel:${contactData}" title="${contactData}">${outofstocktext}</a>`
      }              
  `;
  }

  //display price from CT, in case of customergroup display discount price
  function priceHTML(
    price,
    formattedItemPriceDiscount,
    formattedItemPrice,
    isCustomerGroup
  ) {
    if (isCustomerGroup !== undefined) {
      return `${
        price > 0 && price !== undefined
          ? "$" + formattedItemPriceDiscount
          : `NA`
      }`;
    } else {
      return `              
    ${
      price > 0 && price !== undefined ? "$" + formattedItemPrice : `NA`
    }              
`;
    }
  }

  //function to add discount column label heading
  function displayDiscountLabel() {
    let discLabel = $("#priceChart").attr("data-discountLabel");
    $(".price-details-info")
      .find(">.order-details")
      .append(
        '<span class="order-items-price qnty discount-column">' +
          discLabel +
          "</span>"
      );
  }

  //pricing tier by SKU
  function getPricingTierBySKU(response, sku) {
    let pricingTier = response.allVariants.find(
      (variant) => variant.sku === sku
    );
    if (!pricingTier) {
      return false;
    }
    return pricingTier;
  }

  //pricing tier data format from CT response
  function getPricingTiers(
    pricingTierBySKU,
    isCustomerGroup,
    formattedItemPrice,
    formattedItemPriceDiscount
  ) {
    let firstTierMinValue, isPrice, isPrices;
    if (!pricingTierBySKU.hasOwnProperty("prices")) {
      return false;
    }

    const pricingTiersHTML = [];
    isPrice = pricingTierBySKU?.price;
    isPrices = pricingTierBySKU?.prices;
    if (isCustomerGroup !== undefined) {
      firstTierMinValue =
        isPrices.length > 0 ? isPrice?.tiers[0].minimumQuantity : `NA`;
    } else {
      firstTierMinValue =
        isPrices.length > 0 ? isPrices[0]?.tiers[0].minimumQuantity : `NA`;
    }
    const minQuantity =
      isPrice?.tiers !== undefined || isPrices[0]?.tiers[0] !== undefined
        ? firstTierMinValue
        : 0;
    if (minQuantity > 1 && isCustomerGroup !== undefined) {
      pricingTiersHTML.push(
        `<div class="order-details pd-price"><span class="order-items-name font-normal">1-${
          minQuantity - 1
        }</span><span class="order-items-price font-normal">$${formattedItemPrice}</span>
        </span><span class="order-items-price font-normal">$${formattedItemPriceDiscount}</span></div>`
      );
    } else if (minQuantity > 1 && isCustomerGroup === undefined) {
      pricingTiersHTML.push(
        `<div class="order-details pd-price"><span class="order-items-name font-normal">1-${
          minQuantity - 1
        }</span><span class="order-items-price font-normal">$${formattedItemPrice}</span></div>`
      );
    }
    if (isPrices.length > 0) {
      tierToAppend(
        pricingTierBySKU,
        pricingTiersHTML,
        isPrices,
        isCustomerGroup
      );
    }

    return pricingTiersHTML.join("");
  }

  //function to get tier for both guest and discount group user
  const tierToAppend = (
    pricingTierBySKU,
    pricingTiersHTML,
    isPrices,
    isCustomerGroup
  ) => {
    pricingTiersHTML.push(
      ...isPrices[0].tiers.map((tier, index, tiers) => {
        const nextTier = tiers[index + 1];
        const discountTier = isCustomerGroup
          ? pricingTierBySKU?.price?.tiers[index]
          : "";
        let tierRange,
          tierPrice,
          discountPrice,
          formattedTierPrice,
          formattedTierPriceHTML;

        if (nextTier) {
          tierRange = `<span class="order-items-name font-normal">${
            tier.minimumQuantity
          }-${nextTier.minimumQuantity - 1}</span>`;
          tierPrice = tier.value.centAmount / 100;

          formattedTierPrice =
            "$" + window.$algoliaWidget.formatPrice(tierPrice);
          formattedTierPriceHTML = `<span class="order-items-price font-normal">${formattedTierPrice}</span>`;
          discountPrice =
            discountTier?.value?.centAmount !== undefined
              ? `<span class="order-items-price font-normal">${
                  "$" +
                  window.$algoliaWidget.formatPrice(
                    discountTier?.value?.centAmount / 100
                  )
                }</span>`
              : "";
        } else {
          tierRange = `
        <span class="order-items-name font-normal">${tier.minimumQuantity}+</span>`;
          tierPrice = tier.value.centAmount / 100;
          formattedTierPrice =
            "$" + window.$algoliaWidget.formatPrice(tierPrice);
          formattedTierPriceHTML = `<span class="order-items-lastvalue hidden-elem">${formattedTierPrice}</span><span class="order-items-price font-normal">Please call for quote</span>`;
          discountPrice = "";
        }

        if (discountTier) {
          return `<div class="order-details pd-price">${tierRange}${formattedTierPriceHTML}${discountPrice}</div>`;
        } else {
          return `<div class="order-details pd-price">${tierRange}${formattedTierPriceHTML}</div>`;
        }
      })
    );
  };

  //function to display html output using class, function output and method
  const updatedHTMLOutput = (className, content, method = "append") => {
    const $element = $(`.${className}`);

    if ($element.length) {
      if (method === "append") {
        $element.append(content);
      } else if (method === "html") {
        $element.html(content);
      } else {
        console.log(
          `Invalid method "${method}". Please use 'append' or 'html'.`
        );
      }
    } else {
      console.log(`Element with class "${className}" not found.`);
    }
  };

  let updatedQtyPriceArrData;
  //function to get price tier data from CT response
  function qtyPriceTierData(pricingTierBySKU) {
    let qtyPriceTierArr,
      firstItemPrice,
      formattedFirstItemPrice,
      pricesArr,
      indexWithNormalPrice;

    pricesArr =
      pricingTierBySKU?.prices.length > 0 ? pricingTierBySKU?.prices : [];
    indexWithNormalPrice = Object.keys(pricesArr).find(
      (key) => key !== "customerGroup"
    );

    qtyPriceTierArr =
      pricingTierBySKU?.prices.length > 0
        ? pricesArr[indexWithNormalPrice].tiers
        : [];
    firstItemPrice =
      pricingTierBySKU?.prices.length > 0
        ? pricesArr[indexWithNormalPrice].value.centAmount / 100
        : "";
    formattedFirstItemPrice =
      firstItemPrice !== null
        ? "$" + window.$algoliaWidget.formatPrice(firstItemPrice)
        : `NA`;

    const createRangeAndPriceArray = (data) => {
      const updatedQtyPriceArr = [];

      // Dynamic calculation for the first minquantity range
      const firstMinQuantityEnd =
        data.length > 0 ? data[0].minimumQuantity - 1 : "";
      updatedQtyPriceArr.push([
        `1-${firstMinQuantityEnd}`,
        formattedFirstItemPrice
      ]);

      // Iterate over the original array
      if (data.length > 0) {
        data.forEach((item, index) => {
          const minQuantityStart = item.minimumQuantity;
          const minQuantityEnd =
            index < data.length - 1
              ? data[index + 1].minimumQuantity - 1
              : "99999";

          // Push the new object into the new array
          updatedQtyPriceArr.push([
            `${minQuantityStart}-${minQuantityEnd}`,
            "$" + window.$algoliaWidget.formatPrice(item.value.centAmount / 100)
          ]);
        });
      }

      return updatedQtyPriceArr;
    };
    //array data for quantity price update functionality
    updatedQtyPriceArrData = createRangeAndPriceArray(qtyPriceTierArr);
  }

  function pdpAlgoliaevent() {
    $(".std-btn-event").on("click", function () {
      const pdpSku = $(".add_to_cart--pdp").data("sku");
      aa("convertedObjectIDs", {
        eventName: "Product Added to Cart",
        index: indexInuse,
        userToken: $algolia.algoliaUserToken(),
        objectIDs: [pdpSku]
      });
    });
  }
  function pdpAlgoliaeventCustom() {
    $(".custom-btn-event").on("click", function () {
      const pdpSkuCustom = $(".custom-sku").length
        ? $(".custom-sku").text()
        : "";
      aa("convertedObjectIDs", {
        eventName: "Product Added to Cart",
        index: indexInuse,
        userToken: $algolia.algoliaUserToken(),
        objectIDs: [pdpSkuCustom]
      });
    });
  }

  function quantityPriceUpdate(value) {
    const between = (x, min, max) => {
      return x >= min && x <= max;
    };
    updatedQtyPriceArrData.forEach((item) => {
      if (between(value, item[0].split("-")[0], item[0].split("-")[1])) {
        $(".pricingtierprice").text(item[1]);
      }
    });
  }

  window.$pdpGlobal = {
    readMoreNew,
    accordionMobile,
    quantityUpdate,
    zipCheck,
    zipValidate,
    getProdDelDate,
    parseAndGetDelDate,
    getSkuPriceInventory,
    imgChanged,
    downloadAll,
    selectLengthColor,
    enlarge,
    utilitiyValues,
    getPdpAnalyticsDetails,
    addToCartCustom,
    setEvents,
    breadcrumbCSR,
    showRfqPopup,
    getProductDetailsForRFQ,
    replacementSKU,
    productSchema,
    pdpAlgoliaevent,
    pdpAlgoliaeventCustom
  };
})();

$(document).ready(function () {
  $pdpGlobal.getSkuPriceInventory();
  $pdpGlobal.readMoreNew();
  $pdpGlobal.accordionMobile();
  $pdpGlobal.quantityUpdate();
  $pdpGlobal.imgChanged();
  $pdpGlobal.downloadAll();
  $pdpGlobal.selectLengthColor();
  $pdpGlobal.utilitiyValues();
  $pdpGlobal.getPdpAnalyticsDetails();
  $pdpGlobal.setEvents();
  window.getAPIModule
    .getCategoriesJson()
    .done(function (data) {
      $pdpGlobal.breadcrumbCSR(data);
    })
    .fail(function (error) {});
  $pdpGlobal.replacementSKU();
  $pdpGlobal.pdpAlgoliaevent();
  $pdpGlobal.pdpAlgoliaeventCustom();
});
