$(document).ready(function () {
  var orderId = "";
  var bearertoken = "";
  const url = window.location.href;
  const params = new URLSearchParams(window.location.search);
  orderId = params.get("orderid");
  var estimatedShippingCharge = 0.0;
  estimatedShippingCharge = estimatedShippingCharge.toFixed(2);
  var totalBeforeTax = 0.0;
  totalBeforeTax = totalBeforeTax.toFixed(2);
  var estimatedTax = 0.0;
  estimatedTax = estimatedTax.toFixed(2);
  var orderTotal = 0.0;
  orderTotal = orderTotal.toFixed(2);
  var handling_amt = 0.0;
  var handling_amt = handling_amt.toFixed(2);

  let shippingName = "";
  let shippingadd = "";
  var shippingadd2 = "";
  let shippingemail = "";
  let shippingPhone = "";
  let billingName = "";
  let billingadd = "";
  var billingadd2 = "";
  let billingemail = "";
  let billingPhone = "";
  let shippingMethod = "";
  var paymentMethod = "";
  let subTotal = "";
  let ShippingAmt = "";
  let TaxAmt = "";
  let totalAmt = "";
  let orderNo;
  let orderDate;
  var lineItems = [];
  var color = "";
  var coaxType = "";
  var maxFrequency = "";
  var attenuation = "";
  var flexType = "";
  var impedance = "";
  var noOfShields = "";
  var productsArray = [];
  let autoEmail = false;
  let validation1 = false;
  let validation2 = false;
  let validation3 = false;
  let emailArray = [];
  let sendEmail1 = false;
  let sendEmail2 = false;
  let sendEmail3 = false;

  var autoEmailArray = [];
  var customerToken = getCustomerTokenFromCookie();

  if (customerToken == null || customerToken == undefined) {
    $(".create-account-redirect-section").removeClass("d-none");
  }
  if (orderId != null || orderId != undefined || orderId != "") {
    autoEmail = true;
    getOrderDetailsAndSendEmail(autoEmailArray, autoEmail);
  }

  let addMoreDetail = 2;
  $(".add-more-emails").click(function () {
    if ($("#productList-emailmodal-body").children().length < 2) {
      $("#productList-emailmodal-body").append(
        '<div class="notification-email-address-block deleteIcon"><p>Add recipient email address</p><input type="email" class="notification-email-address" id="notification-email-address' +
          addMoreDetail +
          '" aria-describedby="emailNotification" placeholder="" onkeyup="enableBtn(this)"><i class="fa-light fa-check d-none"></i><i class="fa-light fa-trash trash-img" onclick="deleteBlock(this)"></i><p class="ie-error-medium validateOrderConfirmationEmailMsg" id="validateOrderConfirmationEmailMsg' +
          addMoreDetail +
          '"></p></div>'
      );
      addMoreDetail < 3
        ? (addMoreDetail = addMoreDetail + 1)
        : (addMoreDetail = 2);
    }
    if ($("#productList-emailmodal-body").children().length >= 2) {
      $("button.add-more-emails").prop("disabled", "true");
      //$("button.add-more-emails").blur();
    }
  });

  const emailRegexp = new RegExp(
    /^[a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1}([a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1})*[a-zA-Z0-9]@[a-zA-Z0-9][-\.]{0,1}([a-zA-Z][-\.]{0,1})*[a-zA-Z0-9]\.[a-zA-Z0-9]{1,}([\.\-]{0,1}[a-zA-Z]){0,}[a-zA-Z0-9]{0,}$/i
  );
  $("#ordersumemail").click(function () {
    $("#emailModalPopup").modal();
    $("#emailModalPopup").on("show.bs.modal", function (event) {
      var emailValidation = $("#notification-email-address1").val();
      if (emailValidation != "") {
        document
          .getElementById("sendEmailOnOrderConf")
          .removeAttribute("disabled");
      }
    });
  });
  $("#sendEmailOnOrderConf").click(function () {
    document
      .getElementById("sendEmailOnOrderConf")
      .setAttribute("disabled", "disabled");
    var analyticCallCount = 0;
    emailArray = [];
    if ($("#notification-email-address1").val() != null) {
      var email1 = $("#notification-email-address1").val();
      validation1 = validateOrderConfirmationEmail(email1);
      if (validation1) {
        emailArray.push(email1);
        sendEmail1 = true;
        $(
          "#notification-email-address1 + .fa-light.fa-check.d-none"
        ).removeClass("d-none");
      } else {
        analyticCallCount++;
        analyticEmailSent("false", analyticCallCount);
      }
    }
    if ($("#notification-email-address2").val() != null) {
      var email2 = $("#notification-email-address2").val();
      var email1 = $("#notification-email-address1").val();
      var email3 = $("#notification-email-address3").val();

      validation2 = validateOrderConfirmationEmail2(email1, email2, email3);
      validation3 = validateOrderConfirmationEmail3(email1, email2, email3);
      if (validation2 || validation3) {
        if (validation2) {
          $(
            "#notification-email-address2 + .fa-light.fa-check.d-none"
          ).removeClass("d-none");
          emailArray.push(email2);
          sendEmail2 = true;
        } else {
          analyticCallCount++;
          analyticEmailSent("false", analyticCallCount);
          return validation2;
        }
        if (validation3) {
          emailArray.push(email3);
          sendEmail3 = true;
          $(
            "#notification-email-address3 + .fa-light.fa-check.d-none"
          ).removeClass("d-none");
        } else {
          analyticCallCount++;
          analyticEmailSent("false", analyticCallCount);
          return validation3;
        }
      } else {
        analyticCallCount++;
        analyticEmailSent("false", analyticCallCount);
      }
    }
    if ($("#notification-email-address3").val() != null) {
      var email2 = $("#notification-email-address2").val();
      var email1 = $("#notification-email-address1").val();
      var email3 = $("#notification-email-address3").val();
      validation3 = validateOrderConfirmationEmail3(email1, email2, email3);
      if (validation3) {
        sendEmail3 = true;
        $(
          "#notification-email-address3 + .fa-light.fa-check.d-none"
        ).removeClass("d-none");
      } else {
        analyticCallCount++;
        analyticEmailSent("false", analyticCallCount);
        return;
      }
    }
    getOrderDetailsAndSendEmail(emailArray, autoEmail);
  });
  $(".email-confirmation-msg i.fa-duotone.fa-xmark").click(function () {
    $(".email-confirmation-msg").addClass("d-none");
  });
  function getCustomerTokenFromCookie() {
    var i,
      x,
      y,
      ARRcookies = document.cookie.split(";");
    //var tvalue="";
    for (i = 0; i < ARRcookies.length; i++) {
      x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
      y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
      x = x.replace(/^\s+|\s+$/g, "");
      if (x == "customerInfo") {
        var name = document.cookie.split("customertoken");
        document.token = name[1];
        var s = document.token.split(":");
        document.tokenValue = s[1];
        var s = document.tokenValue.split(",");
        document.tokenFinalValue = s[0];
        var tvalue = document.tokenFinalValue.replaceAll('"', "");
      }
    }
    return tvalue;
  }
  function getOrderDetailsAndSendEmail() {
    $.ajax({
      type: "POST",
      url: "/bin/getorderconfrimationdetails",
      data: {
        CTCustomerToken: window.isCustomerToken(),
        orderId: orderId,
        bearertoken: window.getbearerToken()
      },
      success: function (data) {
        commonUtility().removeClassDnone(
          ".order-placed-confirmation-message-section"
        );
        commonUtility().addClassDnone(".loader_wrapper");

        //window.errorModule.checkError(data);
        getOrderDetails(data);
        appendData1(data);
        if (
          data.custom?.field?.taxexamptionnumber !== undefined &&
          data.taxedPrice["totalTax"]["centAmount"] == 0 &&
          data.billingAddress["country"] == "US"
        ) {
          $(".tax-exemption-section").removeClass("d-none");
        }
        let orderNumber = data.orderNumber;
        document.getElementById("orderNum").innerHTML = " #" + orderNumber;
        if (data.shippingInfo != null || data.shippingInfo != undefined) {
          estimatedShippingCharge = (
            data.shippingInfo["price"]["centAmount"] / 100
          ).toFixed(2);
        }
        if (data.taxedPrice != null || data.taxedPrice != undefined) {
          totalBeforeTax = data.taxedPrice["totalNet"]["centAmount"] / 100;
          estimatedTax = data.taxedPrice["totalTax"]["centAmount"] / 100;
          orderTotal = data.taxedPrice["totalGross"]["centAmount"] / 100;
        }
        if (data.customLineItems != null || data.customLineItems != undefined) {
          var handling = [];
          $.each(data.customLineItems, function (index, item) {
            var data = {};
            data.totalPrice = item.totalPrice;
            data.slug = item.slug;
            handling.push(data);
            if (
              item.slug != undefined &&
              item.slug == "WireTransfer_HandlingCharge"
            ) {
              handling_amt = (
                handling[index].totalPrice.centAmount / 100
              ).toFixed(2);
            }
          });
        }
        estimatedShippingCharge =
          parseFloat(handling_amt) + parseFloat(estimatedShippingCharge);
        estimatedShippingCharge = estimatedShippingCharge.toFixed(2);
        var items = totalBeforeTax - estimatedShippingCharge;
        items = items.toFixed(2);
        // estimatedShippingCharge = estimatedShippingCharge.toFixed(2);
        totalBeforeTax = totalBeforeTax.toFixed(2);
        estimatedTax = estimatedTax.toFixed(2);
        orderTotal = orderTotal.toFixed(2);
        document.getElementById("items").innerHTML =
          window.priceFormate.formateCheckout(items);
        document.getElementById("estimatedShippingCharge").innerHTML =
          window.priceFormate.formateCheckout(estimatedShippingCharge);
        document.getElementById("totalBeforeTax").innerHTML =
          window.priceFormate.formateCheckout(totalBeforeTax);
        document.getElementById("estimatedTax").innerHTML =
          window.priceFormate.formateCheckout(estimatedTax);
        document.getElementById("orderTotal").innerHTML =
          window.priceFormate.formateCheckout(orderTotal);
        const totalLineItemsData = [...data.lineItems, ...data.customLineItems];
        let totalLineItems = commonUtility().responseFilter(totalLineItemsData);
        //code for analytic order confirmation data tracking
        if (totalLineItems != null || totalLineItems != undefined) {
          document.getElementById("analytics-productDetails").value =
            JSON.stringify(totalLineItems);
        }
        if (data.shippingInfo != null || data.shippingInfo != undefined) {
          document
            .getElementById("analytics-productDetails")
            .setAttribute(
              "analytics-shippinginfo",
              JSON.stringify(data.shippingInfo)
            );
        }
        if (data.shippingAddress != null || data.shippingAddress != undefined) {
          document
            .getElementById("analytics-productDetails")
            .setAttribute(
              "analytics-address",
              JSON.stringify(data.shippingAddress)
            );
        }
        if (data.paymentInfo != null || data.paymentInfo != undefined) {
          document
            .getElementById("analytics-productDetails")
            .setAttribute(
              "analytics-paymentinfo",
              JSON.stringify(data.paymentInfo)
            );
        }
        autoEmail = false;
      },
      error: function (error) {
        if (!autoEmail) {
          analyticEmailSent("false", "1");
        }
        window.errorModule.showErrorPopup(error);
      }
    });
  }

  function appendData1(data) {
    let result = "";
    $("#productDetails").html("");
    var analyticsbestSellerRank = "";
    var analyticsColor = "";
    var analyticslength = "";
    var analyticscategory = "";
    var analyticsstartingPrice = "";
    const totalLineItemsData = [...data.lineItems, ...data.customLineItems];
    let totalLineItemsValue =
      commonUtility().responseFilter(totalLineItemsData);
    $.each(totalLineItemsValue, function (index, item) {
      var y = item.variant;
      //algolio product image
      var client = algoliasearch(algId, algApi);
      var indexImg = client.initIndex(indexInuse);
      let skuid = commonUtility().getSkuId(item);
      let isItemCustom = false;
      if (
        typeof item.custom?.fields?.customlength != "undefined" ||
        skuid == "" ||
        typeof item.custom?.fields?.sku != "undefined"
      ) {
        isItemCustom = true;
      }
      if (!isItemCustom) {
        indexImg
          .getObjects([skuid], {
            attributesToRetrieve: [
              "name",
              "assets",
              "color",
              "length",
              "bestSellerRank",
              "category",
              "startingPrice",
              "productId",
              "categorySEOURL"
            ]
          })
          .then(({ results }) => {
            if (results[0] != null || results[0] != undefined) {
              if (
                results[0].bestSellerRank != undefined ||
                results[0].bestSellerRank != null
              ) {
                analyticsbestSellerRank = results[0].bestSellerRank;
              }
              if (results[0].color != undefined || results[0].color != null) {
                analyticsColor = results[0].color;
              }
              if (results[0].length != undefined || results[0].length != null) {
                analyticslength = results[0].length;
              }
              if (
                results[0].category != undefined ||
                results[0].category != null
              ) {
                analyticscategory = results[0].category
                  .toString()
                  .replaceAll(",", "|");
              }
              if (
                results[0].startingPrice != undefined ||
                results[0].startingPrice != null
              ) {
                analyticsstartingPrice = results[0].startingPrice;
              }
            }
            var analyticsproddetails =
              analyticsbestSellerRank +
              "@@" +
              analyticsColor +
              "@@" +
              analyticslength +
              "@@" +
              analyticscategory +
              "@@" +
              analyticsstartingPrice;
            if (results[0] != null || results[0] != undefined) {
              result += getProductString(
                data.lineItems[index]["quantity"],
                data.lineItems[index]["variant"]["sku"],
                data.lineItems[index]["name"]["en"] ||
                  data.lineItems[index]["name"]["en-US"],
                getImage(results[0]),
                analyticsproddetails
              );
            } else {
              result += getProductString(
                data.lineItems[index]["quantity"],
                data.lineItems[index]["variant"]["sku"],
                data.lineItems[index]["name"]["en"] ||
                  data.lineItems[index]["name"]["en-US"],
                "",
                analyticsproddetails
              );
            }
            $("#productDetails").append(result);
            result = "";
          });
      } else {
        result += getProductString(
          item.quantity,
          skuid,
          item.name["en"] || item.name["en-US"],
          utilityMessage.dataIMAGE.rfcd_Product_Image,
          ""
        );
        $("#productDetails").append(result);
        result = "";
      }
    });
  }

  function getProductString(
    quantity,
    sku,
    name,
    urlProd,
    analyticsproddetails
  ) {
    var orderedprodDetailsStr = `
                    <div class="productList-img-description d-flex analyticssummaryprod" data-analytics-prod-detail="${analyticsproddetails}">
                          <div class="img-wrapper">
                              <img src="${urlProd}" class="productList-img" alt="${brandName} ${
      sku ? sku : ""
    }"/>
                          </div>
                          <div class="productList-description">
                              <p class="product-title"><b>${name}</b></p>
                              <p class="product-sku">SKU: <span class="sku-value">${sku}</span></p>
                              <p class="product-quantity">Quantity: <span class="quantity-num">${quantity}</span></p>
                          </div>
                      </div>
          `;
    return orderedprodDetailsStr;
  }
  function getOrderDetails(data) {
    if (data.statusCode != null && data.statusCode != undefined && !autoEmail) {
      if (
        data.statusCode == 400 ||
        data.statusCode == 401 ||
        data.statusCode == 404
      ) {
        analyticEmailSent("false", "1");
      }
    }
    orderNo = data.orderNumber;
    orderDate = commonUtility().dateFormate(
      data?.custom?.fields?.creationDate,
      true
    ); // Show Day also if not then send false

    if (data.shippingAddress != null || data.shippingAddress != undefined) {
      let shippingstreetname = "";
      if (data.shippingAddress?.streetName !== "") {
        shippingstreetname = data.shippingAddress.streetName;
      }
      shippingName =
        data.shippingAddress?.firstName + " " + data.shippingAddress?.lastName;
      shippingadd =
        shippingstreetname &&
        data.shippingAddress?.streetNumber !== "" &&
        data.shippingAddress?.streetNumber !== "NA"
          ? shippingstreetname + "," + " #" + data.shippingAddress.streetNumber
          : shippingstreetname
          ? shippingstreetname
          : data.shippingAddress.streetNumber;

      if (data.shippingAddress?.state !== "NA") {
        shippingadd2 = `${data.shippingAddress?.city}, ${
          data.shippingAddress?.state
        }, ${data.shippingAddress?.country}${" "}${
          data.shippingAddress?.postalCode
        }`;
      } else {
        shippingadd2 = `${data.shippingAddress?.city}, ${
          data.shippingAddress?.country
        }${" "}${data.shippingAddress?.postalCode}`;
      }

      shippingPhone = data.shippingAddress?.phone;
    }
    if (data.customerEmail != null || data.customerEmail != undefined) {
      shippingemail = data.customerEmail;
      billingemail = data.customerEmail;
    }
    if (data.billingAddress) {
      let billingstreetname = "";
      if (data.billingAddress?.streetName !== "") {
        billingstreetname = data.billingAddress.streetName;
      }
      billingName =
        data.billingAddress.firstName + " " + data.billingAddress?.lastName;
      billingadd =
        billingstreetname &&
        data.billingAddress?.streetNumber !== "" &&
        data.billingAddress?.streetNumber !== "NA"
          ? billingstreetname + "," + " #" + data.billingAddress?.streetNumber
          : billingstreetname
          ? billingstreetname
          : data.billingAddress?.streetNumber;

      if (data.billingAddress.state !== "NA") {
        billingadd2 = `${data.billingAddress.city}, ${
          data.billingAddress.state
        }, ${data.billingAddress.country}${" "}${
          data.billingAddress.postalCode
        }`;
      } else {
        billingadd2 = `${data.billingAddress.city}, ${
          data.billingAddress.country
        }${" "}${data.billingAddress.postalCode}`;
      }

      billingPhone = data.billingAddress?.phone;
    }
    if (data.shippingInfo != null || data.shippingInfo != undefined) {
      shippingMethod = data.shippingInfo["shippingMethodName"];
      shippingMethod = shippingMethod.includes("NOSHIPPING")
        ? "NO SHIPPING"
        : shippingMethod;
      ShippingAmt = data.shippingInfo["price"]["centAmount"] / 100;
    }
    if (data.paymentInfo != null || data.paymentInfo != undefined) {
      for (var i = 0; i < data.paymentInfo.payments.length; i++) {
        if (
          data.paymentInfo.payments[i].obj?.interfaceId != null ||
          data.paymentInfo.payments[i].obj?.interfaceId != undefined
        ) {
          paymentMethod = data.paymentInfo.payments[i].obj?.interfaceId;
        } else {
          if (
            data.paymentInfo.payments[i].obj?.paymentMethodInfo != null ||
            data.paymentInfo.payments[i].obj?.paymentMethodInfo != undefined
          ) {
            if (
              data.paymentInfo.payments[i].obj?.paymentMethodInfo?.method ==
              "CC"
            ) {
              paymentMethod = "Credit Card";
            }
          }
        }
      }
      if (paymentMethod.includes("PO")) {
        paymentMethod = "PO";
      }
      if (paymentMethod.includes("WireTransfer")) {
        paymentMethod = "Wire Transfer";
      }
    }
    if (data.totalPrice != null || data.totalPrice != undefined) {
      subTotal = data.totalPrice["centAmount"] / 100;
    }
    if (data.taxedPrice != null || data.taxedPrice != undefined) {
      TaxAmt = data.taxedPrice["totalTax"]["centAmount"] / 100;
      totalAmt = data.taxedPrice["totalGross"]["centAmount"] / 100;
    }
    if (autoEmail && data.customerEmail != null) {
      emailArray.push(data.customerEmail);
    }
    lineItems.length = 0; // Reset Value and Updated with Latest Value;
    const totalItems = [...data.lineItems, ...data.customLineItems];
    let totalLineItems = commonUtility().responseFilter(totalItems);
    $.each(totalLineItems, function (index, item) {
      var y = item.variant;
      productsArray.push(commonUtility().getSkuIdWithoutLength(item));
    });
    var client = algoliasearch(algId, algApi);
    var indexImg = client.initIndex(indexInuse);
    indexImg
      .getObjects(productsArray, {
        attributesToRetrieve: ["keySpecs"]
      })
      .then(({ results }) => {
        var result = "";
        let keyValues = [];
        totalLineItems.map(function (item) {
          if (results != undefined || results != null) {
            result = results.find(function (x) {
              if (x != null && x.objectID) {
                return (
                  x.objectID === commonUtility().getSkuIdWithoutLength(item)
                );
              }
            });
          }
          let keySpecs = [
            "color",
            "Coax Type",
            "Flex Type",
            "Impedance",
            "Attenuation at 1 Ghz.",
            "Frequency, Max",
            "No. of Shields"
          ];
          keyValues.length = 0;
          if (
            (result != null || result != undefined) &&
            result.keySpecs != undefined
          ) {
            keySpecs.map((ele, i) => {
              let obj = result.keySpecs.find((obj, i) => obj.name === ele);
              if (obj === undefined) {
                keyValues[i] = "";
              } else {
                keyValues[i] = obj.value;
              }
            });
          }
          var totalPriceDecimal = item.totalPrice["centAmount"] / 100;
          totalPriceDecimal = totalPriceDecimal.toFixed(2);
          let itemPrice =
            item?.price?.value?.centAmount || item?.money?.centAmount;
          var priceDecimal = itemPrice / 100;
          priceDecimal = priceDecimal.toFixed(2);
          let lineItem = {
            quantity: item.quantity,
            name: item.name["en"] || item.name["en-US"],
            subtotalPrice: totalPriceDecimal,
            price: priceDecimal,
            color: keyValues[0],
            coaxType: keyValues[1],
            flexType: keyValues[2],
            impedence: keyValues[3],
            attenuation: keyValues[4],
            maxfrequency: keyValues[5],
            noOfshields: keyValues[6],
            sku: item?.variant?.sku || item?.custom?.fields?.masterSku
          };
          lineItems.push(lineItem);
        });
        sendEmail(
          emailArray,
          autoEmail,
          shippingName,
          shippingadd,
          shippingadd2,
          shippingemail,
          shippingPhone,
          billingName,
          billingadd,
          billingadd2,
          billingemail,
          billingPhone,
          shippingMethod,
          paymentMethod,
          subTotal,
          ShippingAmt,
          TaxAmt,
          totalAmt,
          lineItems
        );
      });
  }
  function sendEmail(
    emailArray,
    autoEmail,
    shippingName,
    shippingadd,
    shippingadd2,
    shippingemail,
    shippingPhone,
    billingName,
    billingadd,
    billingadd2,
    billingemail,
    billingPhone,
    shippingMethod,
    paymentMethod,
    subTotal,
    ShippingAmt,
    TaxAmt,
    totalAmt,
    lineItems
  ) {
    var hostName = window.location.hostname;
    subTotal = subTotal - ShippingAmt;
    subTotal = subTotal ? subTotal.toFixed(2) : "";
    ShippingAmt = ShippingAmt ? ShippingAmt.toFixed(2) : "";
    TaxAmt = TaxAmt ? TaxAmt.toFixed(2) : "";
    totalAmt = totalAmt ? totalAmt.toFixed(2) : "";
    $.ajax({
      type: "GET",
      url: "/bin/sendemailorderconfirmation",
      data: {
        email: emailArray.join(),
        domainname: hostName,
        shippingName: shippingName,
        shippingadd: shippingadd,
        shippingadd2: shippingadd2,
        shippingemail: shippingemail,
        shippingPhone: shippingPhone,
        billingName: billingName,
        billingadd: billingadd,
        billingadd2: billingadd2,
        billingemail: billingemail,
        billingPhone: billingPhone,
        shippingMethod: shippingMethod,
        paymentMethod: paymentMethod,
        subTotal: subTotal,
        ShippingAmt: ShippingAmt,
        TaxAmt: TaxAmt,
        totalAmt: totalAmt,
        orderNumber: orderNo,
        orderDate: orderDate,
        lineItems: JSON.stringify(lineItems)
      },
      success: function (result) {
        // window.errorModule.checkError(result);

        if (!autoEmail) {
          //code for analytic data tracking success scenario on send email button click
          analyticEmailSent("true", "1");
          $("#emailModalPopup").modal("hide");
          $(".email-confirmation-msg").removeClass("d-none");
          $(".email-confirmation-msg").fadeOut(8000);
          $("#emailModalPopup :input").val("");
          $(".fa-light.fa-check").addClass("d-none");
          emailArray = [];
        }
      },
      error: function (error) {
        alert("404 Bad Request");
        //code for analytic data tracking in failure scenario
        if (!autoEmail) {
          analyticEmailSent("false", "1");
        }
        window.errorModule.showErrorPopup(error);
      }
    });
  }
  /* Email validations */
  function validateOrderConfirmationEmail(email1) {
    if (document.querySelector(".notification-email-address").value != null) {
      var email1 = document.querySelector(".notification-email-address").value;
    }
    document.querySelector("#validateOrderConfirmationEmailMsg").innerHTML = "";
    const emailRegexp = new RegExp(
      /^[a-zA-Z0-9][\_\.\|]{0,1}([a-zA-Z0-9][\_\.\|]{0,1})*[a-zA-Z0-9]@[a-zA-Z0-9][-\.]{0,1}([a-zA-Z][-\.]{0,1})*[a-zA-Z0-9]\.[a-zA-Z0-9]{1,}([\.\-]{0,1}[a-zA-Z]){0,}[a-zA-Z0-9]{0,}$/i
    );
    if (email1 == "" || email1.length == 0) {
      $(".validateOrderConfirmationEmailMsg").text(
        utilityMessage.messages.enterEmailAddress
      );
      return false;
    }
    if (emailRegexp.test(email1)) {
      $(".validateOrderConfirmationEmailMsg").text("");
      $("#notification-email-address1 + .fa-light.fa-check.d-none").removeClass(
        "d-none"
      );
      return true;
    } else {
      $(".validateOrderConfirmationEmailMsg").text(
        utilityMessage.messages.enterValidEmailAddress
      );
      $("#notification-email-address1 + .fa-light.fa-check").addClass("d-none");
      return false;
    }
    return true;
  }
  function validateOrderConfirmationEmail2(email1, email2, email3) {
    $("#validateOrderConfirmationEmailMsg2").text("");
    const emailRegexp = new RegExp(
      /^[a-zA-Z0-9][\_\.\|]{0,1}([a-zA-Z0-9][\_\.\|]{0,1})*[a-zA-Z0-9]@[a-zA-Z0-9][-\.]{0,1}([a-zA-Z][-\.]{0,1})*[a-zA-Z0-9]\.[a-zA-Z0-9]{1,}([\.\-]{0,1}[a-zA-Z]){0,}[a-zA-Z0-9]{0,}$/i
    );
    if (email2 == "" || email2.length == 0) {
      $("#validateOrderConfirmationEmailMsg2").text(
        utilityMessage.messages.enterEmailAddress
      );
      return false;
    }

    if (emailRegexp.test(email2)) {
      $("#validateOrderConfirmationEmailMsg2").text("");
      if (email1 == email2) {
        $("#validateOrderConfirmationEmailMsg2").text(
          utilityMessage.messages.enterAdditionalEmail
        );
        $("#notification-email-address2 + .fa-light.fa-check").addClass(
          "d-none"
        );
        return false;
      } else if (email1 == email3 || email2 == email3) {
        $("#validateOrderConfirmationEmailMsg3").text(
          utilityMessage.messages.enterAdditionalEmail
        );
        $("#notification-email-address2 + .fa-light.fa-check").addClass(
          "d-none"
        );
        return false;
      }
      $("#notification-email-address2 + .fa-light.fa-check.d-none").removeClass(
        "d-none"
      );
      return true;
    } else {
      $("#validateOrderConfirmationEmailMsg2").text(
        utilityMessage.messages.enterValidEmailAddress
      );
      $("#notification-email-address2 + .fa-light.fa-check").addClass("d-none");
      return false;
    }

    return true;
  }
  function validateOrderConfirmationEmail3(email1, email2, email3) {
    const emailRegexp = new RegExp(
      /^[a-zA-Z0-9][\_\.\|]{0,1}([a-zA-Z0-9][\_\.\|]{0,1})*[a-zA-Z0-9]@[a-zA-Z0-9][-\.]{0,1}([a-zA-Z][-\.]{0,1})*[a-zA-Z0-9]\.[a-zA-Z0-9]{1,}([\.\-]{0,1}[a-zA-Z]){0,}[a-zA-Z0-9]{0,}$/i
    );
    if (email3 == "") {
      $("#validateOrderConfirmationEmailMsg3").text(
        utilityMessage.messages.enterEmailAddress
      );
      return false;
    }
    if (emailRegexp.test(email3)) {
      $("#validateOrderConfirmationEmailMsg3").text("");
      if (email1 == email3 || email2 == email3) {
        $("#validateOrderConfirmationEmailMsg3").text(
          utilityMessage.messages.enterAdditionalEmail
        );
        $("#notification-email-address3 + .fa-light.fa-check").addClass(
          "d-none"
        );
        return false;
      }
      $("#notification-email-address3 + .fa-light.fa-check.d-none").removeClass(
        "d-none"
      );
      return true;
    } else {
      if (email3 != null || email3 != undefined) {
        $("#validateOrderConfirmationEmailMsg3").text(
          utilityMessage.messages.enterValidEmailAddress
        );
        $("#notification-email-address3 + .fa-light.fa-check").addClass(
          "d-none"
        );
        return false;
      }
      return true;
    }
    return true;
  }
});
function deleteBlock(removeBlock) {
  //var removeBlock = document.querySelector('.notification-email-address-block.deleteIcon');
  $(removeBlock).parent().remove();
  $("button.add-more-emails").prop("disabled", false);
}
/* Disabled and enabled button functionality*/
function enableBtn(txt) {
  var bt = document.querySelector(".btn.productList-emailmodal-footer-sve-btn");
  if (txt.value != "") {
    bt.disabled = false;
  } else {
    bt.disabled = true;
    $(".notification-email-address-block .fa-light.fa-check").addClass(
      "d-none"
    );
  }
}
