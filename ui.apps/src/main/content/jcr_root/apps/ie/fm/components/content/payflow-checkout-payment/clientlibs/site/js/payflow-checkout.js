// Cart item and price increment starts here
var customerToken,
  lineItemId,
  defaultShippingAddressId,
  cardToken,
  tvalue,
  getPaymentToken;
var shippingAddress = "";
var friegtAddress = "";
var frieghtAddress_feilds = "";
var finalDestination = "";
var recalculateData = "";
let handlingChargeAdded = false;
var cardData = [];
var handling = [];
var address = [];
var otherAddress = [];
var editResponse = [];
var selectedRadio = "";
var handlingCharge = "";
var totalhand_ch = "";
var handlingCharge = {};
var handling_amt;
var curCookieData, curEditAdd, billingFlag;
var customPaymentErrorMsg = {};
var secureTokenPayload = {};
var payflowinfoEmail,
  shiptoPhoneNum,
  billtoPhoneNum,
  shiptoFirstName,
  billtoFirstName,
  shiptoLastName,
  billtoStreet1,
  billtoStreet,
  billtoCountry,
  billtoCity,
  billtoState,
  billtoZip,
  shiptoCountry,
  shiptoCity,
  shiptoState,
  shiptoStreet,
  shiptoStreet1,
  shiptoZip,
  billtoStreetReg,
  billtoStreet1Reg,
  billtoCountryReg,
  billtoCityReg,
  billtoStateReg,
  billtoZipReg,
  billtoStreetGuest,
  billtoStreet1Guest,
  billtoCountryGuest,
  billtoCityGuest,
  billtoZipGuest,
  billtoStateGuest;

function checkoutPageCardUpdate(event) {
  tvalue = getCustomerTokenFromCookie();
  let isCustomLineItem = $(event).attr("data-isitemcustom");
  var qunatity;
  if ($(event).hasClass("qty_num")) {
    var qunatity = $(event).val();
    lineItemId = $(event).attr("data-lineItemId");
  } else {
    qunatity = $(event).siblings(".qty_num").val();
    lineItemId = $(event).siblings(".qty_num").attr("data-lineItemId");
  }

  $.ajax({
    url: $.fn.getAPIEndpoint().UPDATE_CART,
    data: {
      CTCustomerToken: window.isCustomerToken(),
      bearerToken: window.getbearerToken(),
      qnty: qunatity,
      id: lineItemId,
      isCustomLineItem: isCustomLineItem
    },
    success: function (cartUpdateResponse, textstatus, xhr) {
      if (cartUpdateResponse != null && cartUpdateResponse != "") {
        //window.errorModule.checkError(cartUpdateResponse);
        if (xhr.status == 200 && cartUpdateResponse.statusCode != 404) {
          checkoutCalculatedTax();
        }
      }
    },
    error: function (error) {
      window.errorModule.showErrorPopup(error);
    }
  });
}

function getCustomerTokenFromCookie() {
  var i,
    x,
    y,
    ARRcookies = document.cookie.split(";");
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

function getPaymentCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    var x = ca[i].substr(0, ca[i].indexOf("="));
    x = x.replace(/^\s+|\s+$/g, "");
    if (x == "customerInfo") {
      var name = document.cookie.split("customertoken");
      document.token = name[1];
      var s = document.token.split(":");

      document.tokenValue = s[1];
      var s = document.tokenValue.split(",");
      document.tokenFinalValue = s[0];
      tvalue = document.tokenFinalValue.replaceAll('"', "");
    }
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function reSizeForMobile() {
  if ($(window).width() <= 991) {
    $(".placeorder-btn-block")
      .remove()
      .insertAfter($("#checkout-ordersummary.orderSummary-Sect"));
  } else {
    $(".placeorder-btn-block").remove().insertAfter($("#payment-method"));
  }
}
$(window).resize(function () {
  reSizeForMobile();
});

function purchaseOrderInfo() {
  if (customerToken == null || customerToken == undefined) {
    $(".purchase-orderInfo").hide();
  } else {
    $.ajax({
      type: "POST",
      url: "/bin/customerProfile",
      data: {
        CTCustomerToken: window.isCustomerToken(),
        bearertoken: window.getbearerToken()
      },
      success: function (data) {
        //window.errorModule.checkError(data);
        var user_state = data.custom.fields.usTaxExemptionStates;
        var buyOnTerms = data.custom.fields.buyOnTerms;
        if (buyOnTerms === true) {
          $(".purchase-orderInfo").css("display", "block");
        }
      },
      error: function (error) {
        window.errorModule.showErrorPopup(error);
      }
    });
  }
}

$(document).ready(function () {
  // if there is no any token then redirect to empty shopping cart
  commonUtility().redirectToEmptyShoppingCart();

  let countriesList,
    // Bind Country Data
    $addNewBillingAddressCountry = $("#addNewBillingAddressCountry"),
    $addNewBillingAddressState = $("#addNewBillingAddressState"),
    $editNewBillingAddressCountry = $("#editNewBillingAddressCountry"),
    $editBillingAddressState = $("#editBillingAddressState"),
    $billingShippingAddressCountry1 = $("#billingShippingAddressCountry1"),
    $billingShippingState1 = $("#billingShippingState1");

  // Utility JSON
  window.getUTILITYModule
    .getUtility()
    .done(function (data) {
      customPaymentErrorMsg = data[0].messages;
    })
    .fail(function (error) {});

  // Country List
  window.getAPIModule
    .getCountryList()
    .done(function (data) {
      countriesList = data;
      if ($addNewBillingAddressCountry) {
        $addNewBillingAddressCountry.countryList(countriesList);
      }
      if ($editNewBillingAddressCountry) {
        $editNewBillingAddressCountry.countryList(countriesList);
      }
      if ($billingShippingAddressCountry1) {
        $billingShippingAddressCountry1.countryList(countriesList);
      }
    })
    .fail(function (error) {});

  // Update the State List based on country selection for Shipping Information Edit
  $addNewBillingAddressCountry.on("change", function (event) {
    let $currentEvent = $(event.currentTarget);
    let selectValue = $currentEvent.val();
    $addNewBillingAddressState.stateFilter(countriesList, selectValue);
  });
  $editNewBillingAddressCountry.on("change", function (event) {
    let $currentEvent = $(event.currentTarget);
    let selectValue = $currentEvent.val();
    $editBillingAddressState.stateFilter(countriesList, selectValue);
  });
  $billingShippingAddressCountry1.on("change", function (event) {
    let $currentEvent = $(event.currentTarget);
    let selectValue = $currentEvent.val();
    $billingShippingState1.stateFilter(countriesList, selectValue);
  });
  const $billingAddGuestCountryCR = $("#billingShippingAddressCountry1"),
    $billingAddGuestZipCodeCR = $("#billingShippingAddressZip"),
    $addnewbillingCountryCR = $("#addNewBillingAddressCountry"),
    $addnewbillingZipCodeCR = $("#addNewBillingAddressZip"),
    $editnewbillingCountryCR = $("#editNewBillingAddressCountry"),
    $editnewbillingZipCodeCR = $("#editBillingAddressZip");

  // billing Address
  if ($billingAddGuestCountryCR && $billingAddGuestZipCodeCR) {
    $billingAddGuestCountryCR.on("change", function () {
      formValidation.zipCodeMaxLengthSet(
        $billingAddGuestCountryCR,
        $billingAddGuestZipCodeCR
      );
    });
    $billingAddGuestZipCodeCR.on("keyup", function (e) {
      formValidation.zipCodeValueFormate($billingAddGuestCountryCR, e);
    });
  }
  if ($addnewbillingCountryCR && $addnewbillingZipCodeCR) {
    $addnewbillingCountryCR.on("change", function () {
      formValidation.zipCodeMaxLengthSet(
        $addnewbillingCountryCR,
        $addnewbillingZipCodeCR
      );
    });
    $addnewbillingZipCodeCR.on("keyup", function (e) {
      formValidation.zipCodeValueFormate($addnewbillingCountryCR, e);
    });
  }
  if ($editnewbillingCountryCR && $editnewbillingZipCodeCR) {
    $editnewbillingCountryCR.on("change", function () {
      formValidation.zipCodeMaxLengthSet(
        $editnewbillingCountryCR,
        $editnewbillingZipCodeCR
      );
    });
    $editnewbillingZipCodeCR.on("keyup", function (e) {
      formValidation.zipCodeValueFormate($editnewbillingCountryCR, e);
    });
  }
  $("#placeOrderBtn").show();
  customerToken = getCustomerTokenFromCookie();
  checkoutCalculatedTax();
  shippingAddressInfo(recalculateData);
  //getUtilityJsonMsg();
  //handling_amt = $("#handling_amt").data("handling");
  handling_amt = $("#handling_amt").text().replace("$", "");
  var response = getPaymentCookie("customerInfo");
  var parsedresponse = JSON.parse(response);
  billingFlag = true;
  if (customerToken != null && customerToken != undefined) {
    defaultShippingAddressId = parsedresponse.customer.defaultShippingAddressId;
  }
  if (customerToken == null || customerToken == undefined) {
    $(".save_details").hide();
  }
  reSizeForMobile();
  purchaseOrderInfo();
  showBillingAddress();
  $(".edit_back").click(function () {
    edit_back();
  });

  $(".add-new-address-btn")
    .off("click")
    .on("click", function () {
      $("#addNewformid")[0].reset();
      $("#addNewBillingAddressState").html(
        '<option value="" selected="selected">Select</option>'
      );
    });

  $("#addNewBillingAddressPopup").on("hidden.bs.modal", function () {
    clearAddBillingAddressError();
  });

  const HREF = window.location.href;
  if (HREF && HREF.includes("paypalPayment=failure")) {
    $(".order__id--fail").addClass("show");
  }
});

//goback url
function edit_back() {
  window.history.back();
}

function showBillingAddress() {
  if ($("#billingAddress").not(":checked")) {
    if (customerToken == null || customerToken == undefined) {
      $("#billingAddressPopup").attr("style", "display:block");
      $(".address-book").attr("style", "display:none");
      $(".billing-addressbook").attr("style", "display:none");
      $("#billingShippingAddressName").val("");
      $("#billingShippingAddressCompany").val("");
      $("#billingShippingAddressPhoneNumber").val("");
      $("#billingShippingAddressAddressLine1").val("");
      $("#billingShippingAddressPopup").find("#ShippingAddressLine2").val("");
      $("#billingShippingAddressZip").val("");
      $("#billingShippingState1").val("");
      $("#billingShippingAddressCity").val("");
      $("#billingShippingEmail").val("");
      $("#billingShippingAddressCountry1").val("");
      $("#billingShippingAddressNameMsg").text("");
      $("#billingShippingAddressPhoneNumberMsg").text("");
      $("#billingShippingAddressAddressLine1Msg").text("");
      $("#billingShippingAddressCountry1Msg").text("");
      $("#billingShippingAddressCityMsg").text("");
      $("#billingShippingAddressZipMsg").text("");
      $("#billingShippingState1Msg").text("");
      $(".billing-address-details").attr("style", "display:none");
    } else {
      $(".address-book").attr("style", "display:block");
      billingFlag = true;
      getAddressfrmCookie();
      setTimeout(function () {
        $("#default_address").find("input.customRadio").trigger("click");
      }, 500);
    }
  }
  if ($("#billingAddress").is(":checked")) {
    $("#billingAddressPopup").attr("style", "display:none");
    $(".address-book").attr("style", "display:none");
    $(".billing-addressbook").attr("style", "display:none");
  }
}

$("#billingContinueBtn").click(function (e) {
  if ($(".address-book").find(".customRadio").is(":checked")) {
    addBillingAddressInfo();
    $(".billingadd-block").hide();
  }
});

function addBillingAddressInfo() {
  billingFlag = false;
  $(".address-book").attr("style", "display:none");
  $(".billing-addressbook").attr("style", "display:block");
  var customerEmail = recalculateData.customerEmail;
  $.each(curCookieData.addresses, function (index, item) {
    if (curEditAdd == item.id) {
      city_name = item.city;
      company_name = item.company;
      postal_code = item.postalCode;
      state_value = item.state;
      street_name = item.streetName;
      street_number = item.streetNumber;
      phone_number = item.phone;
      country_value = item.country;
      //read shipping address from cookie
      customer_name = item.firstName + " " + item.lastName;
      customer_addrs = item.city + ", " + item.state + " " + item.postalCode;
      customer_phone = item.phone;
    }
  });
  $(".customerName").text(customer_name);
  $(".customerCompany").text(company_name);
  $(".customerAddress").text(street_number);
  $(".customerAddressline").text(street_name);
  $(".customerCityStateZip").text(customer_addrs);
  $(".customerCountry").text(country_value);
  $(".customerEmail").text(customerEmail);
  $(".customerPhone").text(window.formatPhonetoUS(customer_phone));
  billtoStreetReg = street_number;
  billtoStreet1Reg = street_name;
  billtoCountryReg = country_value;
  billtoCityReg = city_name;
  billtoStateReg = state_value;
  billtoZipReg = postal_code;
}
function clearAddBillingAddressError() {
  $("#addNewBillingAddressNameMsg").text("");
  $("#addNewBillingAddressPhoneNumberMsg").text("");
  $("#addNewBillingAddressCountryMsg").text("");
  $("#addNewBillingAddressAddressLine1Msg").text("");
  $("#addNewBillingAddressCityMsg").text("");
  $("#addNewBillingStateMsg").text("");
  $("#addNewBillingAddressZipMsg").text("");
  $("#addBillingAddressLine2Msg").text("");
}
function saveBillingAddress() {
  $(".billingaddress-label").attr("style", "display:none");
  $(".billing-address").attr("style", "display:none");
}
var customer_name, customer_addrs, customer_phone;
var city_name,
  company_name,
  postal_code,
  state_value,
  street_name,
  street_number,
  phone_number,
  country_value;

function addressInfo(event) {
  curEditAdd = $(event).attr("data-addid");
  isDefaultAdd = $(event).attr("data-isdefault");
  addId = curEditAdd;

  //addBillingAddressInfo(curEditAdd)
}

function editBillingAddress() {
  $("#editNewBillingAddressName").val(customer_name);
  $("#editNewBillingAddressCompany").val(company_name);
  $("#editNewBillingAddressPhoneNumber").val(phone_number);
  $("#editNewBillingAddressAddressLine1").val(street_number);
  $("#editBillingAddressLine2").val(street_name);
  $("#editBillingAddressCity").val(city_name);
  $("#editBillingAddressZip").val(postal_code);
  $("#editNewBillingAddressCountry").val(country_value).change();
  $("#editBillingAddressState").val(state_value).change();
  $("#editNewBillingAddressName").attr("data-editID", addId);
}

function getAddressfrmCookie() {
  var slectedState = "";
  var response = getPaymentCookie("customerInfo");
  var parsedresponse = JSON.parse(response);
  let defaultBillingAddressId = parsedresponse.customer.defaultBillingAddressId,
    otherBillingAddressId = parsedresponse.customer.billingAddressIds;
  var customerPhone;
  curCookieData = parsedresponse.customer;
  $(".other-address").html("");
  const billingAddressIds = curCookieData.billingAddressIds;
  const billingAddressFilter = curCookieData.addresses.filter(function (
    address
  ) {
    return billingAddressIds.includes(address.id);
  });
  $.each(billingAddressFilter, function (index, item) {
    if (defaultBillingAddressId == item.id) {
      var data = {};
      data.city = item.city;
      data.company = item.company;
      data.country = item.country;
      data.firstName = item.firstName;
      data.lastName = item.lastName;
      data.postalCode = item.postalCode;
      data.state = item.state;
      data.streetName = item.streetName;
      data.streetNumber = item.streetNumber;
      data.phone = item.phone;
      data.index = index;
      data.isDefault = "true";
      data.addressId = item.id;
      address.push(data);
      //read shipping address from cookie
      var shipp_fname = item.firstName + " " + item.lastName;
      var shipp_add = item.streetNumber + " " + item.streetName + ", ";
      shipp_add += item.city + ", ";
      shipp_add += item.country + ", " + item.postalCode;
      stateValue = item.state;
      let cityState, billStreetName;
      if (item.country !== "US" && item.country !== "CA") {
        cityState = item.city + ", " + item.postalCode;
      } else {
        cityState = item.city + ", " + item.state + " " + item.postalCode;
      }
      billStreetName =
        item.streetName !== undefined && item.streetName !== "NA"
          ? item.streetName
          : "";
      selectCountry = item.country;
      $("#default_address").find(".customRadio").val(stateValue);
      $("#default_address")
        .find(".customRadio")
        .attr("data-country", selectCountry);
      $("#default_address").find(".customRadio").attr("data-isdefault", true);
      $("#default_address").find(".customRadio").attr("data-addId", item.id);
      $("#default_address").find(".customer-name").text(shipp_fname);
      $("#default_address").find(".customer-company").text(item.company);
      $("#default_address").find(".customer-address").text(item.streetNumber);
      $("#default_address").find(".customer-address-line").text(billStreetName);
      $("#default_address")
        .find(".customer-address-citystatezip")
        .text(cityState);
      $("#default_address")
        .find(".customer-address-country")
        .text(item.country);
      $("#default_address")
        .find(".customer-address-phone")
        .text(window.formatPhonetoUS(item.phone));
      $("#default_address").find(".EditShippingInfo").text("Edit");
      $("#default_address").find(".EditShippingInfo").attr("data-edit", index);
      $("#default_address")
        .find(".EditShippingInfo")
        .attr("data-isdefault", true);
      $("#default_address")
        .find(".EditShippingInfo")
        .attr("data-addressId", item.id);
      customerPhone = item.phone;
    }
    const otherBillingAddDetails = otherBillingAddressId.filter(
      (x) => x === item.id
    );
    if (
      otherBillingAddDetails != defaultBillingAddressId &&
      otherBillingAddDetails == item.id
    ) {
      var data = {};
      data.city = item.city;
      data.company = item.company;
      data.country = item.country;
      data.firstName = item.firstName;
      data.lastName = item.lastName;
      data.postalCode = item.postalCode;
      data.state = item.state;
      data.streetName = item.streetName;
      data.streetNumber = item.streetNumber;
      data.phone = item.phone;
      data.index = index;
      data.isDefault = "false";
      data.addressId = item.id;
      address.push(data);
      var shipp_fname = item.firstName + " " + item.lastName;
      var shipp_add = item.streetNumber + " " + item.streetName + ", ";
      shipp_add += item.city + ", ";
      shipp_add += item.country + ", " + item.postalCode;
      stateValue = item.state;
      selectCountry = item.country;
      let cityZip, billStreetName;
      if (item.country !== "US" && item.country !== "CA") {
        cityZip = item.city + ", " + item.postalCode;
      } else {
        cityZip = item.city + ", " + item.state + " " + item.postalCode;
      }
      billStreetName =
        item.streetName !== undefined && item.streetName !== "NA"
          ? item.streetName
          : "";
      var otherAddress_container = $(".other-address");
      var populateAddresss =
        '<div class="custom-control custom-radio billing-add-types col-lg-4 mb-4" ><input type="radio" class="custom-control-input customRadio " id="customRadioBtn' +
        index +
        '" name="example2" data-addId="' +
        item.id +
        '" value="' +
        stateValue +
        '" data-country="' +
        selectCountry +
        '"  data-isdefault="false" onclick = "addressInfo(this)"><label class="form-check-label custom-control-label address-details" for="customRadioBtn' +
        index +
        '"> <div class="customer-name">' +
        shipp_fname +
        '</div> <div class="customer-company">' +
        item.company +
        '</div> <div class="customer-address"> ' +
        item.streetNumber +
        '</div> <div class="customer-address-line"> ' +
        billStreetName +
        '</div> <div class="customer-address-citystatezip"> ' +
        cityZip +
        '</div> <div class="customer-address-country"> ' +
        item.country +
        '</div> <div class="customer-address-phone"> ' +
        window.formatPhonetoUS(item.phone) +
        '</div> </label><div class="edit-existing-shipping-address edit-billing-add"><a href="#" class="EditShippingInfo" aria-label="Edit shipping information" data-toggle="modal" data-edit="' +
        index +
        '" data-isdefault="false" data-addressId="' +
        item.id +
        '" data-target="#editBillingAddressPopup" onclick="editAddress(this)">Edit</a></div></div>';
      otherAddress_container.append(populateAddresss);
    }
  });
  // $.each(curCookieData.addresses,function(index, item){
  //const otherAddressDetailsIds = otherBillingAddressId.map(address => address);
  //});
  email = curCookieData.email;
  $(".contactInfo #contactInfoEmail").val(email);
  cookiphoneNumber = customerPhone;
  $(".contactInfo #contactInfoPhoneNumber").val(cookiphoneNumber);
}
let isPOvalid;
let $POinfo = $("#PONumber");
function validatePOinfo() {
  let regName = regexPattern.PONumber;
  let regSpecial = regexPattern.SPECIALCHAR;
  selectedRadio = $("input[type='radio'][name='example1']:checked").val();
  if ($POinfo.val() == "" && selectedRadio == "purchaseorder") {
    $(".PO-number .errorMsg").text(customPaymentErrorMsg.enterPurchaseOrderNo);
    return false;
  } else if ($POinfo.val().length > 35) {
    /* Minimum chars allowed is 5 is out of scope as of now
    else if( $POinfo.val().length> 0 && $POinfo.val().length < 5) {      
      $(".PO-number .errorMsg").text(customPaymentErrorMsg.minChar6);
      return false;
    }*/
    $(".PO-number .errorMsg").text(customPaymentErrorMsg.maxChar35);
    return false;
  } else if (
    ($POinfo.val() !== "" && !regName.test($POinfo.val())) ||
    ($POinfo.val() !== "" && regSpecial.test($POinfo.val()))
  ) {
    $(".PO-number .errorMsg").text(customPaymentErrorMsg.notValidPONumber);
    return false;
  } else {
    $(".PO-number .errorMsg").html("");
  }
  if (selectedRadio == "carddetails") {
    payflowCheckout();
  }
  return true;
}
function purchaseOrder() {
  selectedRadio = $("input[type='radio'][name='example1']:checked").val();
  handlingChargeAdded = false;
  handlingPaymentCharge();
  $(".wiretrans-msg-wrapper").hide();
  $("#placeOrderBtn").show();
  $(".purchaseOrder").show();
  $(".card-details").hide();
  $("label.Po-ref-no").text("PO Ref/No");
  //$("#PONumber").val("");
}

function cardDetails() {
  selectedRadio = $("input[type='radio'][name='example1']:checked").val();
  handlingPaymentCharge();
  $(".wiretrans-msg-wrapper").hide();
  $(".card-details").find("iframe").removeAttr("src");
  $(".card-details").show();
  $(".purchaseOrder").hide();
  $("#placeOrderBtn").hide();
  $("#brainTreePay").hide();
  $("#orderNumber").val("");
  $(".errorMsg").html("");
  $("label.Po-ref-no").text("PO Ref/No (Optional)");
  if (!handlingChargeAdded) {
    if ($("#PONumber").val() !== "") {
      if (validatePOinfo()) payflowCheckout();
    } else {
      payflowCheckout();
    }
  }
}

function handlingPaymentCharge() {
  $(".placeorder-btn").removeClass("disabled");
  if (selectedRadio == "savedcard" && handling_amt != 0) {
    handlingCharge = {
      paymentMethod: {
        method: "WireTransfer",
        isHandlingChargeApplicable: false
      }
    };
    applayPaymentcharge();
  }

  if (selectedRadio == "purchaseorder" && handling_amt != 0) {
    handlingCharge = {
      paymentMethod: {
        method: "WireTransfer",
        isHandlingChargeApplicable: false
      }
    };
    applayPaymentcharge();
  }

  if (selectedRadio == "carddetails" && handling_amt != 0) {
    handlingChargeAdded = true;
    handlingCharge = {
      paymentMethod: {
        method: "WireTransfer",
        isHandlingChargeApplicable: false
      }
    };
    applayPaymentcharge();
  }
  if (selectedRadio == "wiretransfer") {
    handlingCharge = {
      paymentMethod: {
        method: "WireTransfer",
        isHandlingChargeApplicable: true,
        amount: 40
      }
    };
    applayPaymentcharge();
  }
}

function applayPaymentcharge() {
  $.ajax({
    type: $.fn.getAPIEndpoint().requestType.POST,
    //url: "/bin/choosePayment",
    url: $.fn.getAPIEndpoint().CHOOSE_PAYMENT,
    data: {
      CTCustomerToken: window.isCustomerToken(),
      bearerToken: window.getbearerToken(),
      jsonData: JSON.stringify(handlingCharge)
    },

    success: function (choosePayment) {
      //window.errorModule.checkError(choosePayment);
      //handlingCharge= choosePayment.customLineItems.totalPrice;
      if (
        choosePayment.customLineItems != undefined &&
        choosePayment.customLineItems.length != 0
      ) {
        $.each(choosePayment.customLineItems, function (index, item) {
          var data = {};
          data.totalPrice = item.totalPrice;
          data.slug = item.slug;
          handling.push(data);
          if (
            item.slug != undefined &&
            item.slug == "WireTransfer_HandlingCharge"
          ) {
            totalhand_ch = (
              handling[index].totalPrice.centAmount / 100
            ).toFixed(2);
            $("#handling_amt").text(
              "$" + window.priceFormate.formateCheckout(totalhand_ch)
            );
            $("#handling_amt").attr("data-handling", totalhand_ch);
            handling_amt = $("#handling_amt").text().replace("$", "");
            checkoutCalculatedTax();
            return false;
          }
        });
      } else {
        $("#handling_amt").text("$" + 0.0);
        $("#handling_amt").attr("data-handling", 0.0);
        handling_amt = $("#handling_amt").text().replace("$", "");
        checkoutCalculatedTax();
      }
    },
    error: function (error) {
      window.errorModule.showErrorPopup(error);
    }
  });
}

function wireTransfer() {
  selectedRadio = $("input[type='radio'][name='example1']:checked").val();
  handlingChargeAdded = false;
  $(".wiretrans-msg-wrapper").show();
  handlingPaymentCharge();
  $("#placeOrderBtn").show();
  $(".card-details").hide();
  $(".purchaseOrder").hide();
  $("#orderNumber").val("");
  $(".errorMsg").html("");
  $("label.Po-ref-no").text("PO Ref/No (Optional)");
  //$("#PONumber").val("");
}

// function checkLength() {
//   var purchaseorder = $("#PONumber").val();
//   if (purchaseorder != "" && purchaseorder.length <= 4) {
//     $(".errorMsg").text(customPaymentErrorMsg.enterPurchaseOrderNo);
//     return false;
//   } else {
//     $(".errorMsg").html("");
//   }
// }

//getTaxWithShippingMethod
function checkoutCalculatedTax() {
  $.ajax({
    type: $.fn.getAPIEndpoint().requestType.POST,
    url: $.fn.getAPIEndpoint().RECALCULATE_TAX,
    data: {
      CTCustomerToken: window.isCustomerToken(),
      bearertoken: window.getbearerToken()
    },
    async: false,
    success: function (reCalculateTax) {
      //window.errorModule.checkError(reCalculateTax);
      recalculateData = reCalculateTax;

      if (reCalculateTax != null && reCalculateTax != "") {
        if (reCalculateTax?.errors && reCalculateTax?.errors.length) {
          return;
        }
        JSON.stringify(reCalculateTax);
        const totalLineItemsData = [
          ...reCalculateTax.lineItems,
          ...reCalculateTax.customLineItems
        ];
        if (!totalLineItemsData.length) {
          removeLoaderFrompayFlowCheckout();
          window.location.href =
            $.fn.getAPIEndpoint().damEndpoint.redirectURL.emptyShoppingCart;
          return;
        }
        let totalLineItems = commonUtility().responseFilter(totalLineItemsData);
        if (reCalculateTax.statusCode == 404) {
          //window.location.href = "/content/fm/en/shopping-cart-empty.html";
        } else {
          if (totalLineItems.length == 0) {
            removeLoaderFrompayFlowCheckout();
            window.location.href =
              $.fn.getAPIEndpoint().damEndpoint.redirectURL.emptyShoppingCart;
          } else {
            var viewCardContainer = $(".cartItem_wrapper");
            $(".cartItem_wrapper").html("");
            var linItemLength = reCalculateTax.lineItems.length;
            var analyticsbestSellerRank = "";
            var analyticsColor = "";
            var analyticslength = "";
            var analyticscategory = "";
            var analyticsstartingPrice = "";
            var analyticsproductId = "";

            $.each(totalLineItems, function (index, item) {
              var avail_ch,
                priceAmt_ch,
                totalPriceVal_ch,
                prodName_ch,
                shipping_ch;
              var client = algoliasearch(algId, algApi);
              let skuId = commonUtility().getSkuId(item);
              //var client = algoliasearch('O0PAXP3VI5', '8efd32c3f11c100327cf727b3cd10f1e');
              var indexImg = client.initIndex(indexInuse);
              var isItemCustom = false;
              if (
                typeof item.custom?.fields?.masterSku != "undefined" ||
                skuId == "" ||
                typeof item.custom?.fields?.sku != "undefined"
              ) {
                isItemCustom = true;
                priceAmt_ch = (item.money.centAmount / 100).toFixed(2);
                prodName_ch = item.name["en"] || item.name["en-US"];
              }
              if (!isItemCustom) {
                indexImg
                  .getObjects([skuId], {
                    attributesToRetrieve: [
                      "name",
                      "assets",
                      "assets.url",
                      "color",
                      "length",
                      "bestSellerRank",
                      "category",
                      "startingPrice",
                      "productId"
                    ]
                  })
                  .then(({ results }) => {
                    results.forEach((content) => {
                      // $(".itemImg").attr("src", `${getImage(content)}`);
                      $(".sku_img_" + index).attr(
                        "data-sku-img",
                        `${getImage(content)}`
                      );
                      $(".sku_img_" + index + " img").attr(
                        "src",
                        `${getImage(content)}`
                      );
                    });
                    if (
                      results[0].bestSellerRank != undefined ||
                      results[0].bestSellerRank != null
                    ) {
                      analyticsbestSellerRank = results[0].bestSellerRank;
                    }
                    if (
                      results[0].color != undefined ||
                      results[0].color != null
                    ) {
                      analyticsColor = results[0].color;
                    }
                    if (
                      results[0].length != undefined ||
                      results[0].length != null
                    ) {
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
                    if (
                      results[0].productId != undefined ||
                      results[0].productId != null
                    ) {
                      analyticsproductId = results[0].productId;
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
                      analyticsstartingPrice +
                      "@@" +
                      analyticsproductId;
                    $(".analytics_prod_detail_" + index).attr(
                      "data-analytics-prod-detail",
                      analyticsproddetails
                    );
                  });
                var y = item.variant;
                $.each(y.attributes, function (index, items) {
                  if (items.name == "name") {
                    prodName_ch = items.value.en;
                  } else {
                    if (index == 0) prodName_ch = items.name;
                  }
                  if (item.name.en == undefined) {
                    $.each(item.name, function (index, items) {
                      prodName_ch = items;
                    });
                  } else {
                    prodName_ch = item.name.en || item.name["en-US"];
                  }
                });
                //$.each(y.prices, function (index, items) {
                priceAmt_ch = (item.price.value.centAmount / 100).toFixed(2);
                //});
              }
              lineItemId = item.id;

              if (item.variant?.availability != undefined) {
                if (item.variant.availability.availableQuantity != undefined) {
                  avail_ch = item.variant.availability.availableQuantity;
                } else {
                  $.each(y.availability, function (index, items) {
                    $.each(items, function (index, item) {
                      if (item.availableQuantity != undefined) {
                        avail_ch = item.availableQuantity;
                      } else {
                        avail_ch = 0;
                      }
                    });
                  });
                }
              } else {
                avail_ch = 0;
              }

              totalPriceVal_ch = (item.totalPrice.centAmount / 100).toFixed(2);
              var orderSummary2 = (
                reCalculateTax.totalPrice.centAmount / 100
              ).toFixed(2);
              if (
                reCalculateTax.customLineItems == "" ||
                reCalculateTax.customLineItems == undefined
              ) {
                totalhand_ch = "0.00";
              } else {
                $.each(reCalculateTax.customLineItems, function (index, items) {
                  if (items.slug == "WireTransfer_HandlingCharge") {
                    totalhand_ch = (items.totalPrice.centAmount / 100).toFixed(
                      2
                    );
                  } else if (items == undefined) {
                    totalhand_ch = "0.00";
                  } else {
                    totalhand_ch = "0.00";
                  }
                });
              }

              $("#subtotal.cart_order_summary_right").text(
                "$" + window.priceFormate.formateCheckout(orderSummary2)
              );
              $("#subtotal.cart_order_summary_right").attr(
                "data-subtotal",
                orderSummary2
              );

              $("#totalBeforeTax.cart_order_summary_right").text(
                "$" + window.priceFormate.formateCheckout(orderSummary2)
              );
              $("#totalBeforeTax.cart_order_summary_right").attr(
                "data-tbtax",
                orderSummary2
              );
              // $("#total_amount.subtotalValue_checkout").text("$" + orderSummary2);
              // $("#total_amount.subtotalValue_checkout").attr("data-totalamt" + orderSummary2);

              var t = 0;
              var curQuan = 0;
              var shipp_amt;
              setTimeout(function () {
                var clength = document.getElementsByClassName("qty_num");
                for (var i = 0; i < clength.length; i++) {
                  t += Number(
                    document.getElementsByClassName("qty_num")[i].value
                  );
                }

                curQuan = t;
              }, 1000);
              var shipp_val;
              if (
                reCalculateTax.shippingInfo != null &&
                reCalculateTax.shippingInfo != undefined
              ) {
                shipp_val = (
                  reCalculateTax.shippingInfo.taxedPrice.totalNet.centAmount /
                  100
                ).toFixed(2);
              } else {
                shipp_val = 0.0;
              }

              var shipp_Etax = (
                reCalculateTax.taxedPrice.totalTax.centAmount / 100
              ).toFixed(2);
              //shipp_amt = (shipp_val / 100).toFixed(2);
              //shipping_ch = ((curQuan) * parseFloat(shipp_val)).toFixed(2);

              $("#shipping_amt").text(
                "$" + window.priceFormate.formateCheckout(shipp_val)
              );
              $("#shipping_amt").attr("data-shipping", shipp_val);
              $("#estimatedTaxToBeCollected").text(
                "$" + window.priceFormate.formateCheckout(shipp_Etax)
              );
              $("#estimatedTaxToBeCollected").attr("data-eTax", shipp_Etax);
              var itemAmt = $("#subtotal.cart_order_summary_right").attr(
                "data-subtotal"
              );
              //var tos = $("#subtotal").attr("data-subtotal");
              var shi = $("#shipping_amt").attr("data-shipping");
              var han = $("#handling_amt").attr("data-handling");
              var item_price = (
                parseFloat(itemAmt) -
                (parseFloat(shi) + parseFloat(totalhand_ch))
              ).toFixed(2);

              $("#subtotal.cart_order_summary_right").text(
                "$" + window.priceFormate.formateCheckout(item_price)
              );
              $("#subtotal.cart_order_summary_right").attr(
                "data-subtotal",
                item_price
              );
              var tbt = (
                parseFloat(item_price) +
                parseFloat(shi) +
                parseFloat(han)
              ).toFixed(2);
              $("#totalBeforeTax").attr("data-tbtax", tbt);
              $("#totalBeforeTax").text(
                "$" + window.priceFormate.formateCheckout(tbt)
              );
              var tot = $("#totalBeforeTax").attr("data-tbtax");
              var est = $("#estimatedTaxToBeCollected").attr("data-etax");
              var tm = (parseFloat(tot) + parseFloat(est)).toFixed(2);
              $("#total_amount.subtotalValue_checkout").text(
                "$" + window.priceFormate.formateCheckout(tm)
              );

              var activeCards = `<div class="row cartItem single_product_details">`;
              activeCards += `<div class="col-lg-3 d-lg-block col-4">`;
              activeCards +=
                `<a href="#" class="sku_img_${index} algoli_img analytics_prod_detail_${index}" aria-label="Product Details" data-analytics-prod-detail><img class="itemImg img-fluid" src="` +
                utilityMessage?.dataIMAGE?.rfcd_Product_Image +
                `" alt="${item.seoName ? item.seoName : ""} ${brandName} ${
                  item.brandSKU ? item.brandSKU : ""
                }" /></a>`;
              activeCards += `<a class="removeItemLink remove_cart_product activeLink" onclick="removeLineItem(this)" data-lineItem-id="${
                item.id
              }" title="remove" href="javascript:void(0)" data-isitemcustom="${isItemCustom}" data-analyticslug="${
                item.slug
              }" data-analyticprod="${
                skuId +
                "@@" +
                prodName_ch.replace(/"/g, "") +
                "@@" +
                item.productId +
                "@@" +
                priceAmt_ch +
                "@@" +
                item.productType?.id +
                "@@" +
                item.quantity
              }">Remove</a>`;
              activeCards += `</div>`;
              activeCards += `<div class="col-lg-9 mb-3 mb-lg-0 col-8  pl-lg-1 p-0""><div class="row"><div class="col-lg-12 col-11 itemDescription product_name">`;
              activeCards += `<p class="mt-0">${prodName_ch}</p>`;
              activeCards += `</div></div>`;
              activeCards += `<div class="row"><div class="col-lg-5 col-md-5 pr-0">`;
              //activeCards += `<div class="itemDetails"><span>${avail_ch} available</span></div>`;
              activeCards += `<div class="itemDetails sku_number"><span>SKU:</span><span> ${skuId}</span></div>`;
              //activeCards += `<div class="itemDetails"><span>Color:</span><span> Blue</span></div>`
              activeCards += `</div>`;
              activeCards += `<div class="cart_quantity_div col-7 col-lg-7"><div class="qty checkout_page"><button class="cart-qty-minus" type="button" onclick="checkOutaddminus(this);" data-isitemcustom="${isItemCustom}"><span class="dec-val"> - </span></button><input type="number" onfocus="checkOutaddSummaryKey(this)"  data-lineItemId="${lineItemId}" class="qty_num checkout__qty__input" name="qty_num" value="${item.quantity}" /><button class="cart-qty-plus" type="button" onclick="checkOutaddplus(this);" data-isitemcustom="${isItemCustom}"><span class="inc-val"> + </span></button></div>`;
              activeCards += `<div id="quantityDropdown" class="quantityDropdown quantity-dropdown-content">`;
              activeCards += `<div class="row">`;
              activeCards += `<table class="table table-bordered">`;
              activeCards += `<thead><tr><th>Quantity</th><th class="align_right_td">Price</th></tr></thead>`;
              activeCards += `<tbody><tr><td>1-1</td><td class="align_right_td">$7,003.65</td></tr><tr><td>2-4</td><td class="align_right_td">$6,723.50</td></tr><tr><td>5-9</td><td class="align_right_td">$6,443.36</td></tr><tr><td>10+</td><td class="align_right_td">Please call for quote</td></tr></tbody>`;
              activeCards += `</table>`;
              activeCards += `</div></div>`;
              activeCards += `<span class="single_product_price">x <span class=\"single_pr_price\">$${window.priceFormate.formateCheckout(
                priceAmt_ch
              )}</span></span></div>`;
              activeCards += `<div class="single_product_total_amount" data-price="${priceAmt_ch}" data-totalpriceval="${totalPriceVal_ch}"><p>$${window.priceFormate.formateCheckout(
                totalPriceVal_ch
              )}</p></div></div>`;
              activeCards += `</div></div>`;
              //$(".cartItem_wrapper").html('');
              viewCardContainer.append(activeCards);
            });
            removeLoaderFrompayFlowCheckout();
            algoliaimageurllist();
            updateQtyOrder();
          }
        }
        if (handlingChargeAdded) {
          if ($("#PONumber").val() !== "") {
            if (validatePOinfo()) payflowCheckout();
          } else {
            payflowCheckout();
          }
        }
      }
    },
    error: function (error) {
      window.errorModule.showErrorPopup(error);
    }
  });
}

function shippingAddressInfo(recalculateData) {
  if (
    recalculateData.shippingInfo != null &&
    recalculateData.shippingInfo != undefined
  ) {
    let upsPrice = recalculateData.shippingInfo.price.number,
      upsGround = recalculateData.shippingInfo.shippingMethodName.split("|");
    $.ajax({
      url: "/content/dam/infinite-electronics/json/fairview-microwave/methodofShipping.json",
      success: function (data) {
        if (upsGround.includes("NOSHIPPING")) {
          $(".upsGround").html("");
          $(".upsAccountNo").html("");
        } else {
          $.each(data, function (key, value) {
            if (upsGround[1] == value.methodName) {
              $(".upsGround").html(
                upsGround[0] +
                  " " +
                  value.chexkoutText +
                  " " +
                  "($" +
                  window.priceFormate.formateCheckout(upsPrice) +
                  ")"
              );
            }
          });
          if (upsGround[2]) {
            $(".upsAccountNo").html(
              upsGround[0] + " " + "Account Number:" + " " + upsGround[2]
            );
          }
        }
      }
    });
  }
  let shippingAddress = recalculateData.shippingAddress;
  var customerEmail = recalculateData.customerEmail;
  friegtAddress = recalculateData.custom;
  if (friegtAddress != undefined) {
    frieghtAddress_feilds = recalculateData.custom.fields;
  }
  if (frieghtAddress_feilds != undefined && friegtAddress != undefined) {
    finalDestination = recalculateData.custom.fields.finalDestinationAddress;
  }
  if (
    finalDestination != undefined &&
    frieghtAddress_feilds != undefined &&
    friegtAddress != undefined
  ) {
    var finalDestinationObject = JSON.parse(finalDestination);
    $("#no-frieght-address").hide();
    payflowinfoFirstName = shippingAddress.firstName;
    payflowinfoLastName = shippingAddress.lastName;
    var shipp_fname =
      shippingAddress.firstName + " " + shippingAddress.lastName;
    var shipp_add =
      shippingAddress.streetNumber + " " + shippingAddress.streetName + " ";
    var shipp_addrs =
      shippingAddress.city +
      ", " +
      shippingAddress.state +
      ", " +
      shippingAddress.postalCode;
    var customer_phone = shippingAddress.phone;
    var destination_fname = finalDestinationObject.name;
    var destination_add =
      finalDestinationObject.line1 + " " + finalDestinationObject.line2 + " ";
    var destination_addrs =
      finalDestinationObject.city +
      ", " +
      finalDestinationObject.state +
      ", " +
      finalDestinationObject.zipcode;
    var customer_ph = finalDestinationObject.phone;
    let customer_phoneNum = "";
    let customer_phoneNumber = "";
    if (shippingAddress.country === "US") {
      customer_phoneNum = window.formatPhonetoUS(customer_ph);
      customer_phoneNumber = window.formatPhonetoUS(customer_phone);
    } else {
      customer_phoneNum = customer_ph;
      customer_phoneNumber = customer_phone;
    }
    if (customerEmail != undefined) {
      $(".selectedAddress").find(".customer-email").text(customerEmail);
      $("#frieghtForward").find(".customer-email").text(customerEmail);
    }
    $(".selectedAddress").find(".customer-name").text(shipp_fname);
    $(".selectedAddress").find(".customer-address").text(shipp_add);
    $(".selectedAddress").find(".customer-addressline").text(shipp_addrs);
    $(".selectedAddress").find(".customer-phone").text(customer_phoneNumber);
    $("#frieghtForward").find(".customer-name").text(destination_fname);
    $("#frieghtForward").find(".customer-address").text(destination_add);
    $("#frieghtForward").find(".customer-addressline").text(destination_addrs);
    $("#frieghtForward").find(".customer-phone").text(customer_phoneNum);
  } else {
    $("#with-frieghtforwarder").hide();
    var shippfname = shippingAddress.firstName + " " + shippingAddress.lastName;
    var shippadd =
      shippingAddress.streetNumber + " " + shippingAddress.streetName + " ";
    var shippaddrs =
      shippingAddress.city +
      " ," +
      shippingAddress.state +
      " ," +
      shippingAddress.postalCode;
    var customer_phone = shippingAddress.phone;

    let streetNumber =
      shippingAddress.streetNumber !== undefined
        ? shippingAddress.streetNumber
        : "";
    let streetName =
      shippingAddress.streetName !== undefined &&
      shippingAddress.streetName !== "NA"
        ? shippingAddress.streetName
        : "";
    let state =
      shippingAddress.state !== undefined && shippingAddress.state !== "NA"
        ? shippingAddress.state
        : "";
    let city = shippingAddress.city !== undefined ? shippingAddress.city : "";
    let postalCode =
      shippingAddress.postalCode !== undefined
        ? shippingAddress.postalCode
        : "";
    let phone =
      shippingAddress.phone !== undefined ? shippingAddress.phone : "";
    let country =
      shippingAddress.country !== undefined ? shippingAddress.country : "";
    let company =
      shippingAddress.company !== undefined ? shippingAddress.company : "";
    let custCityStateZip = city + ", " + state + " " + postalCode;

    $("#shippingInfo").find(".customer-name").text(shippfname);
    $("#shippingInfo").find(".customer-addressline1").text(streetNumber);
    $("#shippingInfo").find(".customer-company").text(company);
    $("#shippingInfo").find(".customer-addressline2").text(streetName);
    $("#shippingInfo").find(".customer-city-state").text(custCityStateZip);
    $("#shippingInfo").find(".customer-country").text(country);
    if (customerEmail !== undefined) {
      $("#shippingInfo").find(".customer-email").text(customerEmail);
    }
    let phoneNum = "";
    if (shippingAddress.country === "US") {
      phoneNum = window.formatPhonetoUS(phone);
    } else {
      phoneNum = phone;
    }
    $("#shippingInfo").find(".customer-phone").text(phoneNum);
  }
}

function removeLineItem(event) {
  //totalsum(event);
  var crtLineItemId = $(event).attr("data-lineItem-id");
  let isCustomLineItem = $(event).attr("data-isitemcustom");
  $.ajax({
    //url: "/bin/removeproduct",
    url: $.fn.getAPIEndpoint().REMOVE_CART,
    data: {
      CTCustomerToken: window.isCustomerToken(),
      bearerToken: window.getbearerToken(),
      id: crtLineItemId,
      isCustomLineItem: isCustomLineItem
    },
    success: function (result) {
      //window.errorModule.checkError(result);
      if (result.statusCode == undefined || result.statusCode == 200) {
        //code for anlaytic data tracking on remove
        productData = $(event).attr("data-analyticprod");
        productSlugVal = $(event).attr("data-analyticslug");
        productDetailsFinalArray = [];
        productDetailsArray = [];
        cabelAssemblyTestArray = [];
        productClickedSlug = "";
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
          removecartDataLayer(
            productDetailsFinalArray,
            "payment-shipping-info"
          );
        }
        location.reload();
      }
    },
    error: function (error) {
      window.errorModule.showErrorPopup(error);
    }
  });
}
function removeLoaderFrompayFlowCheckout() {
  commonUtility().removeClassDnone(".payment-info-order-summary-details");
  commonUtility().addClassDnone(".loader_wrapper");
}
//algolio image url
function algoliaimageurllist() {
  setTimeout(function () {
    $(".sku_colr").each(function () {
      var curColr = $(this).attr("algolio_color");
      $(this).text(curColr);
    });
    $(".sku_color_wrapper").each(function () {
      if ($(this).find(".sku_colr").text() == "") $(this).hide();
    });
  }, 5000);
}

function checkOutaddplus(event) {
  var amount = Number($(event).siblings(".qty_num").val());
  let addTotal;
  if (amount < 99999) {
    amount++;
    $(event).siblings(".qty_num").val(amount);
    $(event)
      .parent(".qty")
      .siblings(".cart-button")
      .attr("data-cartqty", amount);
  }
  $(event).parent(".qty").siblings(".cart-button").attr("data-cartqty", amount);

  var txtRate = $(event)
    .parents(".cart_quantity_div")
    .siblings(".single_product_total_amount")
    .attr("data-price");
  var txtQuantity = $(event).siblings(".qty_num").val();
  addTotal = (parseFloat(txtQuantity) * parseFloat(txtRate)).toFixed(2);
  $(event)
    .parents(".cart_quantity_div")
    .siblings(".single_product_total_amount")
    .find(">p")
    .text("$ " + addTotal);
  $(event)
    .parents(".cart_quantity_div")
    .siblings(".single_product_total_amount")
    .attr("data-totalpriceval", addTotal);
  checkoutPageCardUpdate(event);
}

function checkOutaddminus(event) {
  var amount = Number($(event).siblings(".qty_num").val());
  let addTotal;
  if (amount > 1) {
    amount--;
    $(event).siblings(".qty_num").val(amount);
    $(event)
      .parent(".qty")
      .siblings(".cart-button")
      .attr("data-cartqty", amount);
  }
  $(event).parent(".qty").siblings(".cart-button").attr("data-cartqty", amount);
  var txtRate = $(event)
    .parents(".cart_quantity_div")
    .siblings(".single_product_total_amount")
    .attr("data-price");
  var txtQuantity = $(event).siblings(".qty_num").val();
  addTotal = (parseFloat(txtQuantity) * parseFloat(txtRate)).toFixed(2);
  $(event)
    .parents(".cart_quantity_div")
    .siblings(".single_product_total_amount")
    .find(">p")
    .text("$ " + addTotal);
  $(event)
    .parents(".cart_quantity_div")
    .siblings(".single_product_total_amount")
    .attr("data-totalpriceval", addTotal);
  // totalsum(event);
  checkoutPageCardUpdate(event);
}
//input qty on change function
function updateQtyOrder() {
  const $checkoutQtyInput = $(".checkout__qty__input");
  if ($checkoutQtyInput) {
    $checkoutQtyInput.on("change", function (event) {
      let $currentEvent = $(event.currentTarget);
      addSummaryCheckout($currentEvent);
    });
  }
}
function checkOutaddSummaryKey(event) {
  amtValonKey = $(event).val();
}

function addSummaryCheckout(event) {
  var amount = Number($(event).val());
  let addTotal;
  if (amount > 99999 || amount < 1) {
    $(event).val(amtValonKey);
  }
  $(event).parent(".qty").siblings(".cart-button").attr("data-cartqty", amount);
  var txtRate = $(event)
    .parents(".cart_quantity_div")
    .siblings(".single_product_total_amount")
    .attr("data-price");
  var txtQuantity = $(event).val();
  addTotal = (parseFloat(txtQuantity) * parseFloat(txtRate)).toFixed(2);
  $(event)
    .parents(".cart_quantity_div")
    .siblings(".single_product_total_amount")
    .find(">p")
    .text("$ " + addTotal);
  $(event)
    .parents(".cart_quantity_div")
    .siblings(".single_product_total_amount")
    .attr("data-totalpriceval", addTotal);
  //totalsum(event);
  checkoutPageCardUpdate(event);
}

function selectedCard(elem) {
  cardToken = $(elem).data("token");
  selectedRadio = $("input[type='radio'][name='example1']:checked").val();

  handlingPaymentCharge();
  $("#orderNumber").val("");
  $(".errorMsg").html("");
  $(".card-details").hide();
  $(".purchaseOrder").hide();
}

var jsonData = new Object();
var jsonSecureTokenData = new Object();
function placeOrder() {
  let shippingAddress_guest = recalculateData.shippingAddress;
  var addId = recalculateData.shippingAddress.id;
  var state = shippingAddress_guest.state;
  var country = shippingAddress_guest.country;
  var line2 = shippingAddress_guest.streetName;
  var zipcode = shippingAddress_guest.postalCode;
  var line1 = shippingAddress_guest.streetNumber;
  var phone = shippingAddress_guest.phone;
  var name = shippingAddress_guest.firstName;
  var city = shippingAddress_guest.city;
  var company = shippingAddress_guest.company;
  var paymentMethod = {};
  let POvalue = $POinfo.val();

  if (selectedRadio == "purchaseorder") {
    if (!validatePOinfo()) {
      return false;
    }
    let purchaseorder = $("#PONumber").val();
    if (customerToken == null || customerToken == undefined) {
      if ($("#billingAddress").is(":checked")) {
        paymentMethod = {
          billingAddress: {
            state: state,
            country: country,
            line2: line2,
            zipcode: zipcode,
            line1: line1,
            phone: phone,
            name: name,
            city: city,
            company: company
          },
          purchaseOrderNumber: purchaseorder
        };
      } else {
        paymentMethod = {
          billingAddress: {
            state: billingState,
            country: billingCountry,
            line2: addressTwo,
            zipcode: areaZipcode,
            line1: addressOne,
            phone: phoneNumber,
            name: userName,
            city: cityName,
            company: companyName
          },
          purchaseOrderNumber: purchaseorder
        };
      }
    } else {
      if ($("#billingAddress").is(":checked")) {
        paymentMethod = {
          billingAddress: {
            id: addId
          },
          purchaseOrderNumber: purchaseorder
        };
      } else {
        paymentMethod = {
          billingAddress: {
            id: curEditAdd
          },
          purchaseOrderNumber: purchaseorder
        };
      }
    }
  }
  if (selectedRadio == "wiretransfer") {
    if (!validatePOinfo()) {
      return false;
    }
    if (customerToken == null || customerToken == undefined) {
      if ($("#billingAddress").is(":checked")) {
        paymentMethod = {
          billingAddress: {
            state: state,
            country: country,
            line2: line2,
            zipcode: zipcode,
            line1: line1,
            phone: phone,
            name: name,
            city: city,
            company: company
          },
          wireTransfer: true,
          referenceNumber: $POinfo.val()
        };
      } else {
        paymentMethod = {
          billingAddress: {
            state: billingState,
            country: billingCountry,
            line2: addressTwo,
            zipcode: areaZipcode,
            line1: addressOne,
            phone: phoneNumber,
            name: userName,
            city: cityName,
            company: companyName
          },
          wireTransfer: true,
          referenceNumber: $POinfo.val()
        };
      }
    } else {
      if ($("#billingAddress").is(":checked")) {
        paymentMethod = {
          billingAddress: {
            id: addId
          },
          wireTransfer: true,
          referenceNumber: $POinfo.val()
        };
      } else {
        paymentMethod = {
          billingAddress: {
            id: curEditAdd
          },
          wireTransfer: true,
          referenceNumber: $POinfo.val()
        };
      }
    }
  }

  $.ajax({
    type: "POST",
    url: "/bin/processPayment",
    data: {
      CTCustomerToken: window.isCustomerToken(),
      bearerToken: window.getbearerToken(),
      jsonData: JSON.stringify(paymentMethod)
    },
    success: function (data, statuscode, xhr) {
      if (data != null && data != "") {
        //window.errorModule.checkError(data);
        if (
          xhr.status == 200 &&
          data.statusCode != 401 &&
          data.statusCode != 400
        ) {
          var orderid = data.id;
          if (orderid != null || orderid != undefined) {
            try {
              analyticsCheckoutPayment();
            } catch (error) {
              console.log(error);
            }
            window.location.href =
              "/content/fm/en/checkout-success.html?orderid=" + orderid;
          }
        } else {
          $(".order__id--fail").addClass("show");
          $(".placeorder-btn").blur();
          return false;
        }
        $(".placeorder-btn").blur();
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown, error) {
      $(".placeorder-btn").blur();
      window.errorModule.showErrorPopup(error);
    }
  });
}

//analytics code for tracking data on place order cta success for checkout journey
function analyticsCheckoutPayment() {
  var pageCategory = "checkout-payment";
  itemsArr = [];
  var step = "3";
  var option = "checkout_process_checkout_payment";
  var itemsObj = "";
  var items = document.querySelectorAll(".single_product_details");
  var totalBeforeTax = "";
  var estimatedTaxToBeCollected = "";
  var total_amount = "";
  var shippingAndHandling = "";
  var shippingAmt = "";
  var handlingAmt = "";
  if (
    document.getElementById("estimatedTaxToBeCollected").textContent.trim() !=
    null
  ) {
    estimatedTaxToBeCollected = document
      .getElementById("estimatedTaxToBeCollected")
      .textContent.trim();
  }
  if (document.getElementById("total_amount").textContent.trim() != null) {
    total_amount = document.getElementById("total_amount").textContent.trim();
  }
  if (document.getElementById("shipping_amt").textContent.trim() != null) {
    shippingAmt = document.getElementById("shipping_amt").textContent.trim();
  }
  if (document.getElementById("handling_amt").textContent.trim() != null) {
    handlingAmt = document.getElementById("handling_amt").textContent.trim();
  }
  for (i = 0; i < items.length; i++) {
    var analytics_prod_detail = "";
    analytics_prod_detail = items[i]
      .getElementsByClassName("analytics_prod_detail_" + i)[0]
      .getAttribute("data-analytics-prod-detail");
    var productSku,
      productName,
      productId,
      productPrice,
      shippingAndHandling,
      shippingPrice,
      handlingPrice,
      beforeTaxPrice,
      estimatedTaxCollected,
      totalPrice,
      estimatedDelivery,
      productType,
      quantity;
    productSku = items[i]
      .getElementsByClassName("sku_number")[0]
      .textContent.slice(4)
      .trim()
      ? items[i]
          .getElementsByClassName("sku_number")[0]
          .textContent.slice(4)
          .trim()
      : "";
    productName = items[i]
      .getElementsByClassName("product_name")[0]
      .textContent.trim()
      ? items[i].getElementsByClassName("product_name")[0].textContent.trim()
      : "";
    productPrice = items[i]
      .getElementsByClassName("single_pr_price")[0]
      .textContent.trim()
      ? items[i].getElementsByClassName("single_pr_price")[0].textContent.trim()
      : "";
    productId = analytics_prod_detail.split("@@")[5];
    shippingAndHandling = "";
    shippingPrice = shippingAmt;
    handlingPrice = handlingAmt;
    beforeTaxPrice = items[i]
      .getElementsByClassName("single_product_total_amount")[0]
      .textContent.trim()
      ? items[i]
          .getElementsByClassName("single_product_total_amount")[0]
          .textContent.trim()
      : "";
    estimatedTaxCollected = estimatedTaxToBeCollected;
    totalPrice = total_amount;
    estimatedDelivery = "";
    productType = "";
    quantity = items[i].getElementsByClassName("qty_num")[0].value
      ? items[i].getElementsByClassName("qty_num")[0].value
      : "";
    itemsObj =
      productSku +
      "@@" +
      productName +
      "@@" +
      productId +
      "@@" +
      productPrice +
      "@@" +
      shippingAndHandling +
      "@@" +
      shippingPrice +
      "@@" +
      handlingPrice +
      "@@" +
      beforeTaxPrice +
      "@@" +
      estimatedTaxCollected +
      "@@" +
      totalPrice +
      "@@" +
      estimatedDelivery +
      "@@" +
      productType +
      "@@" +
      quantity +
      "@@" +
      analytics_prod_detail;
    itemsArr.push(itemsObj);
  }
  checkoutDataLayer(itemsArr, pageCategory, step, option);
}

// add billing address.

function getDuplicateAddress(addressOne, addressTwo, zipcode, phoneNumber) {
  var flag = false;
  var i,
    x,
    y,
    ARRcookies = document.cookie.split(";");
  for (i = 0; i < ARRcookies.length; i++) {
    x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
    y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
    x = x.replace(/^\s+|\s+$/g, "");
    if (x == "customerInfo") {
      var jsonObject = JSON.parse(y);
      var addAddressesBox = jsonObject.customer.addresses;
      $.each(addAddressesBox, function (index, item) {
        var addressObject = addAddressesBox[index];
        if (
          addAddressesBox[index].streetName == addressTwo &&
          addAddressesBox[index].streetNumber == addressOne &&
          addAddressesBox[index].postalCode == zipcode &&
          addAddressesBox[index].phone == phoneNumber
        ) {
          flag = false;
        } else {
          flag = true;
        }
      });
    }
  }
  return flag;
}

function validateNewPaymentShippingAddress() {
  var flag;
  var flagName = validateShippingName();
  var flagPhone = validateShippingPhoneNumber();
  var flagAddress = validateShippingAddressShippingInfoOne();
  var flagCountry = countryShippingInfoAddress();
  var flagCity = validateShippingCityName();
  var flagState = stateShippingInfoAddress();
  var flagZipcode = validateShippingInfoZipCode();

  if (
    flagName &&
    flagPhone &&
    flagAddress &&
    flagCountry &&
    flagCity &&
    flagState &&
    flagZipcode
  ) {
    flag = true;
    $("#billingAddressPopup").attr("style", "display:none");

    $(".billing-address-details").attr("style", "display:block");
    $(".billingadd-block").hide();
  }
  return flag;
}
var userName,
  companyName,
  phoneNumber,
  addressOne,
  addressTwo,
  areaZipcode,
  billingState,
  cityName,
  email,
  billingCountry;

function editAddressGuest() {
  $("#billingAddressPopup").attr("style", "display:block");
  $(".billing-address-details").attr("style", "display:none");
  $("#billingShippingAddressName").val(userName);

  $("#billingShippingAddressPhoneNumber").val(phoneNumber);
  $("#billingShippingAddressAddressLine1").val(addressOne);

  $("#billingShippingAddressCity").val(cityName);
  $("#billingShippingAddressZip").val(areaZipcode);

  $("#billingShippingAddressCountry1").val(billingCountry);
  $("#billingShippingEmail").val(email);
}

function validateNewBillingAddress() {
  var flag;
  var flagName = validateBillingName();
  var flagPhone = validateBillingPhoneNumber();
  var flagAddress = validateBillingAddress();
  var flagCountry = countryBillingInfoAddress();
  var flagCity = validateBillingCityName();
  var flagState = stateBillingInfoAddress();
  var flagZipcode = validateEditShippingInfoZipCode();
  var flagAddresstwo = validateAddShippingAddressLinetwo();
  if (
    flagName &&
    flagPhone &&
    flagAddress &&
    flagCountry &&
    flagCity &&
    flagState &&
    flagZipcode &&
    flagAddresstwo
  ) {
    flag = true;
  }
  return flag;
}

$("#addNewBillingAddressPopup .saveBillingAddressBtn").on("click", function () {
  var status = validateNewBillingAddress();
  var e = document.getElementById("addNewBillingAddressCountry");
  var optionCountry = $("#addNewBillingAddressCountry").val();
  //var optionCountry = 'US';
  var i = $("#addNewBillingAddressState");
  var optionState = $("#addNewBillingAddressState").val();
  var name = $("#addNewBillingAddressName").val();
  var company = $("#addNewBillingAddressCompany").val();
  var phoneNumber = $("#addNewBillingAddressPhoneNumber").val();
  var addressOne = $("#addNewBillingAddressAddressLine1").val();
  var addressTwo = $("#addNewBillingAddressPopup")
    .find("#addBillingAddressLine2")
    .val();
  var zipcode = $("#addNewBillingAddressZip").val();
  var state = $("#addNewBillingAddressState").val();
  var cityName = $("#addNewBillingAddressCity").val();
  var country = optionCountry;
  var state = optionState;
  var duplicateStatus = getDuplicateAddress(
    addressOne,
    addressTwo,
    zipcode,
    phoneNumber
  );
  if (status && duplicateStatus) {
    $.ajax({
      url: "/bin/addShippingAddress.json",
      type: "POST",
      data: {
        addressType: "billing",
        name: name,
        company: company,
        country: optionCountry,
        phone: phoneNumber,
        addressOne: addressOne,
        addressTwo: addressTwo,
        zipcode: zipcode,
        state: state,
        city: cityName,
        defaultAddress: "false",
        accessToken: window.isCustomerToken(),
        bearerToken: window.getbearerToken()
      },
      dataType: "json",
      success: function (data) {
        //window.errorModule.checkError(data);
        if (data.statusCode == "200") {
          var text = {
            customertoken: data.customertoken,
            customer: JSON.parse(data.response)
          };
          document.cookie = "customerInfo=" + JSON.stringify(text) + ";path=/;";
          $("#successfullyAdded").modal("show");
          $("#addNewBillingAddressPopup").modal("hide");
          getAddressfrmCookie();
          $("#addNewformid")[0].reset();
        } else {
          $("#addNewBillingAddressPopup").modal("hide");
        }
      },
      error: function (error) {
        $("#addNewBillingAddressPopup").modal("hide");
        window.errorModule.showErrorPopup(error);
      }
    });
  } else {
    if (status == undefined) {
      $("#addNewBillingAddressPopup").modal("show");
    } else {
      $("#duplicateAddnewAddress").modal("show");
      $("#addNewBillingAddressPopup").modal("hide");
    }
  }
});

var isDefaultAdd, addId;
//edit Address
function editAddress(event) {
  var curEditAdd = $(event).attr("data-edit");
  isDefaultAdd = $(event).attr("data-isdefault");
  addId = $(event).attr("data-addressId");
  for (var i = 0; i < address.length; i++) {
    if (address[i].index == curEditAdd) {
      editResponse.push(address[i]);
    }
  }
  for (var i = 0; i < editResponse.length; i++) {
    var item = editResponse[i];
    var shipp_fname = item.firstName + " " + item.lastName;
    var shipp_add = item.streetNumber + " " + item.streetName;
    var editEmail = $("#contactInfoEmail").val();
    $("#editNewBillingAddressName").val(shipp_fname);
    $("#editNewBillingAddressCompany").val(item.company);
    $("#editNewBillingAddressPhoneNumber").val(item.phone);
    $("#editNewBillingAddressAddressLine1").val(item.streetNumber);
    $("#editBillingAddressLine2").val(item.streetName);
    $("#editBillingAddressCity").val(item.city);
    $("#editBillingAddressZip").val(item.postalCode);
    $("#editNewBillingAddressEmail").val(editEmail);
    $("#editNewBillingAddressName").attr("data-editID", addId);
  }

  /*$("#editNewShippingAddressCountry")[0].click();
    $("#editNewShippingAddressCountry").change(function(){
      $("#editNewShippingAddressCountry option:first").attr('selected','selected');
    }).change();*/
  $("#editNewBillingAddressCountry").val(item.country).change();
  $("#editBillingAddressState").val(item.state).change();
  var cooki_stateVal = item.state.toLowerCase();
  $("#editBillingAddressState option").each(function (index, items) {
    //$(this).removeAttr('selected');
    var onscreenstateVal = items.value.toLowerCase();
    if (onscreenstateVal == cooki_stateVal) {
      $(this).attr("selected", "selected");
    }
  });
  $(".deleteBillingAddressBtn").removeAttr("disabled");
  if (isDefaultAdd == "true") {
    $(".deleteBillingAddressBtn").attr("disabled", "disabled");
  } else {
    $(".deleteBillingAddressBtn").removeAttr("disabled");
  }
  $(".deleteBillingAddressBtn").attr("data-isDefaultAdd", isDefaultAdd);
}

function saveData() {
  var saveResponse = [];
  var datas = {};
  var type = "billing";
  var item;
  var editAddressforSave = {};
  editAddressforSave.name = $("#editNewBillingAddressName").val();
  editAddressforSave.company = $("#editNewBillingAddressCompany").val();
  editAddressforSave.country = $("#editNewBillingAddressCountry").val();
  //editAddressforSave.country = "US";
  editAddressforSave.line1 = $("#editNewBillingAddressAddressLine1").val();
  editAddressforSave.line2 = $("#editBillingAddressLine2").val();
  editAddressforSave.zipcode = $("#editBillingAddressZip").val();
  editAddressforSave.state = $("#editBillingAddressState").val();
  //editAddressforSave.state = 'CT';
  editAddressforSave.phone = $("#editNewBillingAddressPhoneNumber").val();
  editAddressforSave.city = $("#editBillingAddressCity").val();
  editAddressforSave.isDefault = isDefaultAdd;
  saveResponse.push(editAddressforSave);
  var obj = {
    type: type,
    address: saveResponse,
    addressId: addId
  };
  var objAdd = JSON.stringify(obj);
  var finalAdd1 = objAdd.replaceAll("[", "");
  var finalAdd = finalAdd1.replaceAll("]", "");
  var isDuplicate = false;
  var curEditId = $("#editBillingAddressPopup")
    .find("#editNewBillingAddressName")
    .attr("data-editid");
  $.each(address, function (index, item) {
    if (item.streetNumber == editAddressforSave.line1) var dline1 = true;
    if (item.streetName == editAddressforSave.line2) var dline2 = true;
    if (item.phone == editAddressforSave.phone) var dphone = true;
    if (item.postalCode == editAddressforSave.zipcode) var dpostalcode = true;
    if (dline1 && dline2 && dphone && dpostalcode) {
      if (item.addressId == curEditId) isDuplicate = false;
      else isDuplicate = true;
    } else {
      //isDuplicate = false;
    }
  });
  if (isDuplicate == false) {
    $.ajax({
      url: "/bin/updateAddress",
      type: "POST",
      data: {
        accessToken: window.isCustomerToken(),
        bearerToken: window.getbearerToken(),
        jsonData: finalAdd
      },
      success: function (updateAddress, statuscode, xhr) {
        if (updateAddress != null && updateAddress != "") {
          //window.errorModule.checkError(updateAddress);
          if (
            xhr.status == 200 &&
            updateAddress.statusCode != 401 &&
            updateAddress.statusCode != 400
          ) {
            if (updateAddress.statusCode == "200") {
              var text = {
                customertoken: getCustomerTokenFromCookie(),
                customer: JSON.parse(updateAddress.response)
              };
              customerInfo = "";
              document.cookie =
                "customerInfo=" + JSON.stringify(text) + ";path=/;";
            }
            $("#editBillingAddressPopup").modal("hide");
            getAddressfrmCookie();
            if (billingFlag == false) {
              addBillingAddressInfo();
            }
          }
        }
      },
      error: function (error) {
        window.errorModule.showErrorPopup(error);
      }
    });
  } else {
    $("#duplicatedAddress").show();
    $("#duplicatedAddress").modal("show");
  }
}

$(".saveShippingAddressBtn").on("click", function () {
  var status = validateNewPaymentShippingAddress();
  var e = $("#billingShippingAddressCountry");
  var optionCountry = $(
    "#billingShippingAddressCountry1 option:selected"
  ).text();
  var optionState = $("#billingShippingState1 option:selected").text();
  userName = $("#billingShippingAddressName").val();
  companyName = $("#billingShippingAddressCompany").val();
  phoneNumber = $("#billingShippingAddressPhoneNumber").val();
  addressOne = $("#billingShippingAddressAddressLine1").val();
  addressTwo = $("#ShippingAddressLine2").val();
  areaZipcode = $("#billingShippingAddressZip").val();
  billingState = $("#billingShippingState1").val();
  cityName = $("#billingShippingAddressCity").val();

  billingCountry = $("#billingShippingAddressCountry1").val();
  if (companyName == undefined) {
    companyName = "";
  }

  if (addressTwo == undefined) {
    addressTwo = "";
  }
  var duplicateStatus = getDuplicateAddress(
    addressOne,
    addressTwo,
    areaZipcode,
    phoneNumber
  );
  $("#customer-name-bill").text(userName);
  $("#customer-company-name-bill").text(companyName);
  $("#address-bill-ship").text(addressOne);
  $("#address2-bill-ship").text(addressTwo);
  $("#address-bill-shipdata").text(
    cityName + ", " + optionState + " " + areaZipcode
  );
  $("#address-bill-country").text(billingCountry);
  $("#phone-bill").text(window.formatPhonetoUS(phoneNumber));
  billtoStreetGuest = addressOne;
  billtoStreet1Guest = addressTwo;
  billtoCountryGuest = billingCountry;
  billtoCityGuest = cityName;
  billtoStateGuest = optionState;
  billtoZipGuest = areaZipcode;
});

function validateShippingName() {
  var validateName = $("#billingShippingAddressName").val();
  var regShippingInfoName = regexPattern.NAME;
  if (validateName == "" || validateName.length == 0) {
    $("#billingShippingAddressNameMsg").text(customPaymentErrorMsg.enterName);
    $("#billingShippingAddressNameMsg").focus();
    return false;
  } else if (validateName.length > 30) {
    $("#billingShippingAddressNameMsg").text(customPaymentErrorMsg.maxChar30);
    return false;
  } else if (!regShippingInfoName.test(validateName)) {
    $("#billingShippingAddressNameMsg").text("");
    return true;
  } else if (regShippingInfoName.test(validateName)) {
    $("#billingShippingAddressNameMsg").text(
      customPaymentErrorMsg.notValidName
    );
    return false;
  } else {
    $("#billingShippingAddressNameMsg").text("");
  }
}

function validateShippingPhoneNumber() {
  var ShippingphoneNumber = $("#billingShippingAddressPhoneNumber").val();
  //   var phoneno = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  var phoneno = /^[\d +/()-]{1,20}$/;

  if (ShippingphoneNumber == "" || ShippingphoneNumber.length == 0) {
    $("#billingShippingAddressPhoneNumberMsg").text(
      customPaymentErrorMsg.enterPhone
    );
    return false;
  }
  if (ShippingphoneNumber.length > 20) {
    $("#billingShippingAddressPhoneNumberMsg").text(
      customPaymentErrorMsg.maxChar20
    );
    return false;
  }
  if (ShippingphoneNumber.length < 10) {
    $("#billingShippingAddressPhoneNumberMsg").text(
      customPaymentErrorMsg.maxChar10
    );
    return false;
  }
  if (!ShippingphoneNumber.match(phoneno)) {
    $("#billingShippingAddressPhoneNumberMsg").text(
      customPaymentErrorMsg.notValidPhone
    );
    return false;
  }
  if (ShippingphoneNumber.match(phoneno)) {
    $("#billingShippingAddressPhoneNumberMsg").text("");
    return true;
  } else {
    $("#billingShippingAddressPhoneNumberMsg").text("");
    return true;
  }
}

function validateShippingAddressShippingInfoOne() {
  var shippingAddressone = $("#billingShippingAddressAddressLine1").val();
  //var regName = ^[a-zA-Z0-9\s\,\''\-]*$;
  let regName = regexPattern.ADDRESS;

  if (shippingAddressone == "" || shippingAddressone.length == 0) {
    $("#billingShippingAddressAddressLine1Msg").text(
      customPaymentErrorMsg.enterAddress1
    );
    return false;
  }

  if (shippingAddressone.length > 35) {
    $("#billingShippingAddressAddressLine1Msg").text(
      customPaymentErrorMsg.maxChar35
    );
    return false;
  }
  if (!regName.test(shippingAddressone)) {
    $("#billingShippingAddressAddressLine1Msg").text("");
    return true;
  }
  if (regName.test(shippingAddressone)) {
    $("#billingShippingAddressAddressLine1Msg").text(
      customPaymentErrorMsg.notValidAddress
    );
    return false;
  } else {
    $("#billingShippingAddressAddressLine1Msg").text("");
    return true;
  }
}

function countryShippingInfoAddress() {
  var e = $("#billingShippingAddressCountry1");
  var optionShippingIndex = $(
    "#billingShippingAddressCountry1 :selected"
  ).val();
  if (optionShippingIndex == 0 || optionShippingIndex == "select") {
    $("#billingShippingAddressCountry1Msg").text(
      customPaymentErrorMsg.enterCountry
    );
    return false;
  } else {
    $("#billingShippingAddressCountry1Msg").text("");
    return true;
  }
}

function validateShippingCityName() {
  var cityShippingName = $("#billingShippingAddressCity").val();
  var regName = /[^a-zA-Z\- ]/;

  if (cityShippingName == "" || cityShippingName.length == 0) {
    $("#billingShippingAddressCityMsg").text(customPaymentErrorMsg.enterCity);
    return false;
  }
  if (cityShippingName.length > 30) {
    $("#billingShippingAddressCityMsg").text(customPaymentErrorMsg.maxChar30);
    return false;
  }
  if (!regName.test(cityShippingName)) {
    $("#billingShippingAddressCityMsg").text("");
    return true;
  }
  if (regName.test(cityShippingName)) {
    $("#billingShippingAddressCityMsg").text(
      customPaymentErrorMsg.notValidCity
    );
    return false;
  } else {
    $("billingShippingAddressCityMsg").text("");
    return true;
  }
  return true;
}

function stateShippingInfoAddress() {
  var e = $("#billingShippingState1");
  var optionShippingIndex = $("#billingShippingState1 :selected").val();
  //var optionShippingIndex = e.options[e.selectedIndex].value;
  //var optionSelectedText = e.options[e.selectedIndex].text;
  if (optionShippingIndex == 0 || optionShippingIndex == "select") {
    $("#billingShippingState1Msg").text(customPaymentErrorMsg.enterState);
    return false;
  } else {
    $("#billingShippingState1Msg").text("");
    return true;
  }
}

function validateShippingInfoZipCode() {
  let $zipCode = $("#billingShippingAddressZip");
  let ZipCode = $("#billingShippingAddressZip").val();
  let country = $("#billingShippingAddressCountry1").val();
  return formValidation.validateAnaZipCode($zipCode, ZipCode, country);

  /*
  var ZipCode = $("#billingShippingAddressZip").val();
  var zippcode = ZipCode;
  var zcode = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

  if (zippcode == "" || zippcode.length == 0) {
    $("#billingShippingAddressZipMsg").text(customPaymentErrorMsg.enterZipcode);
    return false;
  }
  if (zippcode.length > 10) {
    $("#billingShippingAddressZipMsg").text(customPaymentErrorMsg.maxChar10);
    return false;
  } else {
    $("#billingShippingAddressZipMsg").text("");
    return true;
  }
  if (zippcode.match(zcode)) {
    $("#billingShippingAddressZipMsg").text("");
    return true;
  }
  if (!zippcode.match(zcode)) {
    $("#billingShippingAddressZipMsg").text(
      customPaymentErrorMsg.notValidZipOrPost
    );
    return false;
  } else {
    $("#billingShippingAddressZipMsg").text("");
    return true;
  }
  return true;
  */
}

function validateShippingInfoEmail() {
  var email = $("#billingShippingEmail").val();
  const emailRegexp = new RegExp(
    /^[a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1}([a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1})*[a-zA-Z0-9]@[a-zA-Z0-9][-\.]{0,1}([a-zA-Z][-\.]{0,1})*[a-zA-Z0-9]\.[a-zA-Z0-9]{1,}([\.\-]{0,1}[a-zA-Z]){0,}[a-zA-Z0-9]{0,}$/i
  );
  if (email == "" || email.length == 0) {
    $("#billingShippingEmailMsg").text(customPaymentErrorMsg.emailNotBeBlank);
    return false;
  }
  if (emailRegexp.test(email)) {
    $("#billingShippingEmailMsg").text("");
    return true;
  } else {
    $("#billingShippingEmailMsg").text(customPaymentErrorMsg.notValidEmail);
    return false;
  }

  return true;
}

/* edit shipping information - modal popup */

function validateEditExistingBillingName() {
  var validateEditExistingBillingName = $("#editNewBillingAddressName").val();
  var regShippingInfoName = regexPattern.NAME;
  if (
    validateEditExistingBillingName == "" ||
    validateEditExistingBillingName.length == 0
  ) {
    $("#editNewBillingAddressNameMsg").text(customPaymentErrorMsg.enterName);
    return false;
  } else if (validateEditExistingBillingName.length > 30) {
    $("#editNewBillingAddressNameMsg").text(customPaymentErrorMsg.maxChar30);
    return false;
  } else if (!regShippingInfoName.test(validateEditExistingBillingName)) {
    $("#editNewBillingAddressNameMsg").text("");
    return true;
  } else if (regShippingInfoName.test(validateEditExistingBillingName)) {
    $("#editNewBillingAddressNameMsg").text(customPaymentErrorMsg.notValidName);
    return false;
  } else {
    $("#editNewBillingAddressNameMsg").text("");
    return true;
  }
}

function validateEditExistingBillingPhoneNumber() {
  var billingEditExistingphoneNumber = $(
    "#editNewBillingAddressPhoneNumber"
  ).val();
  //   var phoneno = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  var phoneno = /^[\d +/()-]{1,20}$/;

  if (
    billingEditExistingphoneNumber == "" ||
    billingEditExistingphoneNumber.length == 0
  ) {
    $("#editNewBillingAddressPhoneNumberMsg").text(
      customPaymentErrorMsg.enterPhone
    );
    return false;
  }
  if (billingEditExistingphoneNumber.length < 10) {
    $("#editNewBillingAddressPhoneNumberMsg").text(
      customPaymentErrorMsg.maxChar10
    );
    return false;
  }
  if (billingEditExistingphoneNumber.length > 20) {
    $("#editNewBillingAddressPhoneNumberMsg").text(
      customPaymentErrorMsg.maxChar20
    );
    return false;
  }
  if (!billingEditExistingphoneNumber.match(phoneno)) {
    $("#editNewBillingAddressPhoneNumberMsg").text(
      customPaymentErrorMsg.notValidPhone
    );
    return false;
  }
  if (billingEditExistingphoneNumber.match(phoneno)) {
    $("#editNewBillingAddressPhoneNumberMsg").text("");
    return true;
  } else {
    $("#editNewBillingAddressPhoneNumberMsg").text("");
    return true;
  }
}

function validateEditExistingBillingAddress() {
  var editExistingBillingAddressone = $(
    "#editNewBillingAddressAddressLine1"
  ).val();

  let regName = regexPattern.ADDRESS;
  let regSpecial = regexPattern.SPECIALCHAR;

  if (
    editExistingBillingAddressone == "" ||
    editExistingBillingAddressone.length == 0
  ) {
    $("#editNewBillingAddressAddressLine1Msg").text(
      customPaymentErrorMsg.enterAddress1
    );
    return false;
  }

  if (editExistingBillingAddressone.length > 35) {
    $("#editNewBillingAddressAddressLine1Msg").text(
      customPaymentErrorMsg.maxChar35
    );
    return false;
  }
  if (regSpecial.test(editExistingBillingAddressone)) {
    $("#editNewBillingAddressAddressLine1Msg").text(
      customPaymentErrorMsg.notValidAddress
    );
    return false;
  }
  if (!regName.test(editExistingBillingAddressone)) {
    $("#editNewBillingAddressAddressLine1Msg").text("");
    return true;
  }

  if (regName.test(editExistingBillingAddressone)) {
    $("#editNewBillingAddressAddressLine1Msg").text(
      customPaymentErrorMsg.notValidAddress
    );
    return false;
  } else {
    $("#editNewBillingAddressAddressLine1Msg").text("");
    return true;
  }
}

function countryEditExistingBillingInfoAddress() {
  var e = $("#editNewBillingAddressCountry");
  var optionShippingIndex = $("#editNewBillingAddressCountry :selected").val();
  if (optionShippingIndex == 0 || optionShippingIndex == "select") {
    $("#editNewBillingAddressCountryMsg").text(
      customPaymentErrorMsg.enterCountry
    );
    return false;
  } else {
    $("#editNewBillingAddressCountryMsg").text("");
    return true;
  }
}

function validateEditExistingCityName() {
  var cityEditExistingBillingName = $("#editBillingAddressCity").val();
  var regName = /[^a-zA-Z\- ]/;

  if (
    cityEditExistingBillingName == "" ||
    cityEditExistingBillingName.length == 0
  ) {
    $("#editBillingAddressCityMsg").text(customPaymentErrorMsg.enterCity);
    return false;
  }
  if (cityEditExistingBillingName.length > 30) {
    $("#editBillingAddressCityMsg").text(customPaymentErrorMsg.maxChar30);
    return false;
  }
  if (!regName.test(cityEditExistingBillingName)) {
    $("#editBillingAddressCityMsg").text("");
    return true;
  }
  if (regName.test(cityEditExistingBillingName)) {
    $("#editBillingAddressCityMsg").text(customPaymentErrorMsg.notValidCity);
    return false;
  } else {
    $("#editBillingAddressCityMsg").text("");
    return true;
  }
}

function stateEditExistingBillingInfoAddress() {
  var e = $("#editBillingAddressState");
  var optionShippingIndex = $("#editBillingAddressState :selected").val();
  // var optionShippingIndex = e.options[e.selectedIndex].value;
  // var optionSelectedText = e.options[e.selectedIndex].text;
  if (optionShippingIndex == 0 || optionShippingIndex == "select") {
    $("#editAddressBillingStateMsg").text(customPaymentErrorMsg.enterState);
    return false;
  } else {
    $("#editAddressBillingStateMsg").text("");
    return true;
  }
}

function validateEditExistingBillingInfoZipCode() {
  let $zipCode = $("#editBillingAddressZip");
  let ZipCode = $("#editBillingAddressZip").val();
  let country = $("#editNewBillingAddressCountry").val();
  return formValidation.validateAnaZipCode($zipCode, ZipCode, country);
}

function validateEditBillingAddressLinetwo() {
  let regSpecial = regexPattern.SPECIALCHAR;
  var editBillingAddressLine2 = $("#editBillingAddressLine2").val();
  if (editBillingAddressLine2.length > 35) {
    $("#editBillingAddressLine2Msg").text(customPaymentErrorMsg.maxChar35);
    return false;
  } else if (regSpecial.test(editBillingAddressLine2)) {
    $("#editBillingAddressLine2Msg").text(
      customPaymentErrorMsg.notValidAddress
    );
    return false;
  } else {
    $("#editBillingAddressLine2Msg").text("");
    return true;
  }
}

function validateEditNewBillingAddressCompany() {
  let regSpecial = regexPattern.SPECIALCHAR;
  var editNewBillingAddressCompany = $("#editNewBillingAddressCompany").val();
  if (editNewBillingAddressCompany.length > 25) {
    $("#editNewBillingAddressCompanyMsg").text(customPaymentErrorMsg.maxChar25);
    return false;
  } else if (regSpecial.test(editNewBillingAddressCompany)) {
    $("#editNewBillingAddressCompanyMsg").text(
      customPaymentErrorMsg.notValidName
    );
    return false;
  } else {
    $("#editNewBillingAddressCompanyMsg").text("");
    return true;
  }
}

/* edit shipping information - modal popup */
function editExistingBillingAddress() {
  validateEditExistingBillingName();
  validateEditExistingBillingPhoneNumber();
  validateEditExistingBillingAddress();
  validateEditBillingAddressLinetwo();
  validateEditNewBillingAddressCompany();
  countryEditExistingBillingInfoAddress();
  validateEditExistingCityName();
  stateEditExistingBillingInfoAddress();
  validateEditExistingBillingInfoZipCode();

  if (
    validateEditExistingBillingName() &&
    validateEditExistingBillingPhoneNumber() &&
    validateEditExistingBillingAddress() &&
    countryEditExistingBillingInfoAddress() &&
    validateEditExistingCityName() &&
    stateEditExistingBillingInfoAddress() &&
    validateEditExistingBillingInfoZipCode() &&
    validateEditBillingAddressLinetwo() &&
    validateEditNewBillingAddressCompany() === true
  ) {
    saveData();
  }
}
function editShippingAddressPopup() {
  $("#editNewShippingAddressNameMsg").innerHTML = "";
  $("#editNewShippingAddressPhoneNumberMsg").innerHTML = "";
  $("#editNewShippingAddressAddressLine1Msg").innerHTML = "";
  $("#editNewShippingAddressCountryMsg").innerHTML = "";
  $("#editShippingAddressCityMsg").innerHTML = "";
  $("#editAddressShippingStateMsg").innerHTML = "";
  $("#editShippingAddressZipMsg").innerHTML = "";
  $("#editNewShippingAddressEmailMsg").innerHTML = "";
}
/* new shipping information - modal popup */

function validateBillingName() {
  var validateBillingName = $("#addNewBillingAddressName").val();

  var regBillingInfoName = regexPattern.NAME;

  if (validateBillingName == "" || validateBillingName.length == 0) {
    $("#addNewBillingAddressNameMsg").text(customPaymentErrorMsg.enterName);
    return false;
  } else if (validateBillingName.length > 30) {
    $("#addNewBillingAddressNameMsg").text(customPaymentErrorMsg.maxChar30);
    return false;
  } else if (!regBillingInfoName.test(validateBillingName)) {
    $("#addNewBillingAddressNameMsg").text("");
    return true;
  } else if (regBillingInfoName.test(validateBillingName)) {
    $("#addNewBillingAddressNameMsg").text(customPaymentErrorMsg.notValidName);
    return false;
  } else {
    $("#addNewBillingAddressNameMsg").text("");
    return true;
  }
}

function validateBillingPhoneNumber() {
  var billingEditphoneNumber = $("#addNewBillingAddressPhoneNumber").val();
  //   var phoneno = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  var phoneno = /^[\d +/()-]{1,20}$/;

  if (billingEditphoneNumber == "" || billingEditphoneNumber.length == 0) {
    $("#addNewBillingAddressPhoneNumberMsg").text(
      customPaymentErrorMsg.enterPhone
    );
    return false;
  }
  if (billingEditphoneNumber.length < 10) {
    $("#addNewBillingAddressPhoneNumberMsg").text(
      customPaymentErrorMsg.maxChar10
    );
    return false;
  }
  if (billingEditphoneNumber.length > 20) {
    $("#addNewBillingAddressPhoneNumberMsg").text(
      customPaymentErrorMsg.maxChar20
    );
    return false;
  }
  if (!billingEditphoneNumber.match(phoneno)) {
    $("#addNewBillingAddressPhoneNumberMsg").text(
      customPaymentErrorMsg.notValidPhone
    );
    return false;
  }
  if (billingEditphoneNumber.match(phoneno)) {
    $("#addNewBillingAddressPhoneNumberMsg").text("");
    return true;
  } else {
    $("#addNewBillingAddressPhoneNumberMsg").text("");
    return true;
  }
}

function validateBillingAddress() {
  var editBillingAddressone = $("#addNewBillingAddressAddressLine1").val();

  let regName = regexPattern.ADDRESS;

  if (editBillingAddressone == "" || editBillingAddressone.length == 0) {
    $("#addNewBillingAddressAddressLine1Msg").text(
      customPaymentErrorMsg.enterAddress1
    );
    return false;
  }

  if (editBillingAddressone.length > 35) {
    $("#addNewBillingAddressAddressLine1Msg").text(
      customPaymentErrorMsg.maxChar35
    );
    return false;
  }
  if (!regName.test(editBillingAddressone)) {
    $("#addNewBillingAddressAddressLine1Msg").text("");
    return true;
  }
  if (regName.test(editBillingAddressone)) {
    $("#addNewBillingAddressAddressLine1Msg").text(
      customPaymentErrorMsg.notValidAddress
    );
    return false;
  } else {
    $("#addNewBillingAddressAddressLine1Msg").text("");
    return true;
  }
}

function countryBillingInfoAddress() {
  var e = $("#addNewBillingAddressCountry");

  var optionShippingIndex = $("#addNewBillingAddressCountry :selected").val();
  //var optionSelectedText = e.options[e.selectedIndex].text;
  if (optionShippingIndex == 0 || optionShippingIndex == "select") {
    $("#addNewBillingAddressCountryMsg").text(
      customPaymentErrorMsg.enterCountry
    );
    return false;
  } else {
    $("#addNewBillingAddressCountryMsg").text("");
    return true;
  }
}

function validateBillingCityName() {
  var cityBillingName = $("#addNewBillingAddressCity").val();
  var regName = /[^a-zA-Z\- ]/;

  if (cityBillingName == "" || cityBillingName.length == 0) {
    $("#addNewBillingAddressCityMsg").text(customPaymentErrorMsg.enterCity);
    return false;
  }
  if (cityBillingName.length > 30) {
    $("#addNewBillingAddressCityMsg").text(customPaymentErrorMsg.maxChar30);
    return false;
  }
  if (!regName.test(cityBillingName)) {
    $("#addNewBillingAddressCityMsg").text("");
    return true;
  }
  if (regName.test(cityBillingName)) {
    $("#addNewBillingAddressCityMsg").text(customPaymentErrorMsg.notValidCity);
    return false;
  } else {
    $("#addNewBillingAddressCityMsg").text("");
    return true;
  }
}

function stateBillingInfoAddress() {
  var e = $("#addNewBillingAddressState");
  var optionShippingIndex = $("#addNewBillingAddressState :selected").val();
  if (optionShippingIndex == 0 || optionShippingIndex == "select") {
    $("#addNewBillingStateMsg").text(customPaymentErrorMsg.enterState);
    return false;
  } else {
    $("#addNewBillingStateMsg").text("");
    return true;
  }
}

function validateEditShippingInfoZipCode() {
  let $zipCode = $("#addNewBillingAddressZip");
  let ZipCode = $("#addNewBillingAddressZip").val();
  let country = $("#addNewBillingAddressCountry").val();
  return formValidation.validateAnaZipCode($zipCode, ZipCode, country);
}

function validateAddShippingAddressLinetwo() {
  var addBillingAddressLine2 = $("#addBillingAddressLine2").val();
  if (addBillingAddressLine2.length > 35) {
    $("#addBillingAddressLine2Msg").text(customPaymentErrorMsg.maxChar35);
    return false;
  } else {
    $("#addBillingAddressLine2Msg").text("");
    return true;
  }
}

function validateAddNewShippingAddressCompany() {
  var addNewBillingAddressCompany = $("#addNewBillingAddressCompany").val();
  if (addNewBillingAddressCompany.length > 25) {
    $("#addNewBillingAddressCompanyMsg").text(customPaymentErrorMsg.maxChar25);
    return false;
  } else {
    $("#addNewBillingAddressCompanyMsg").text("");
    return true;
  }
}
/* new shipping information - modal popup */
// payflow checout
function payflowCheckout() {
  $(".card-details").append(
    '<div class="fa fa-spinner fa-spin fa-2x payflow-loader"></div>'
  );
  if (selectedRadio == "carddetails") {
    let shippingAddress_guest = recalculateData.shippingAddress;
    let addId = recalculateData.shippingAddress.id;
    let country = shippingAddress_guest.country;
    let state = shippingAddress_guest.state;
    let line2 = shippingAddress_guest.streetName;
    let zipcode = shippingAddress_guest.postalCode;
    let line1 = shippingAddress_guest.streetNumber;
    let phone = shippingAddress_guest.phone;
    let firstName = shippingAddress_guest.firstName;
    let lastName = shippingAddress_guest.lastName;
    let city = shippingAddress_guest.city;
    let company = shippingAddress_guest.company;
    // Guest User
    if (customerToken == null || customerToken == undefined) {
      if ($("#billingAddress").is(":checked")) {
        var paymentMethod = {
          billingAddress: {
            sameAsShipping: true
          }
        };
      } else {
        var paymentMethod = {
          billingAddress: {
            state: billingState,
            country: billingCountry,
            line2: addressTwo,
            zipcode: areaZipcode,
            line1: addressOne,
            phone: phoneNumber,
            name: userName,
            city: cityName,
            company: companyName
          }
        };
      }
      //let spiltName = $('.customer-name').text().split(/\s+/);
      payflowinfoEmail = $(".customer-email").text();
      //shiptoPhoneNum = $(".customer-phone").text();
      shiptoFirstName = firstName;
      shiptoLastName = lastName;
      shiptoStreet = line1;
      shiptoStreet1 = line2;
      shiptoCountry = country;
      shiptoCity = city;
      shiptoState = state;
      shiptoZip = zipcode;
      billtoPhoneNum = phone;
      billtoFirstName = shiptoFirstName;
      billtoLastName = shiptoLastName;
      billtoStreet = shiptoStreet;
      billtoStreet1 = shiptoStreet1;
      billtoCountry = shiptoCountry;
      billtoCity = shiptoCity;
      billtoState = shiptoState;
      billtoZip = shiptoZip;
      if (!$("#billingAddress").is(":checked")) {
        //let spiltNamebill = $('#customer-name-bill').text().split(/\s+/);
        //billtoPhoneNum = $("#phone-bill").text();
        billtoFirstName = userName;
        //billtoLastName = spiltNamebill[1] ? spiltNamebill[1] : "";
        billtoStreet = billtoStreetGuest;
        billtoStreet1 = billtoStreet1Guest;
        billtoCountry = billtoCountryGuest;
        billtoCity = billtoCityGuest;
        billtoState = billtoStateGuest;
        billtoZip = billtoZipGuest;
      }
      // Loggedin User
    } else {
      if ($("#billingAddress").is(":checked")) {
        var paymentMethod = {
          billingAddress: {
            sameAsShipping: true
          }
        };
      } else {
        var paymentMethod = {
          billingAddress: {
            id: curEditAdd
          }
        };
      }
      payflowinfoEmail = $(".customer-email").text();
      shiptoPhoneNum = phone;
      shiptoFirstName = shippingAddress.firstName;
      shiptoLastName = shippingAddress.lastName;
      shiptoStreet = line1;
      shiptoStreet1 = line2;
      shiptoCountry = country;
      shiptoCity = city;
      shiptoState = state;
      shiptoZip = zipcode;
      billtoPhoneNum = shiptoPhoneNum;
      billtoFirstName = shiptoFirstName;
      billtoLastName = shiptoLastName;
      billtoStreet = shiptoStreet;
      billtoStreet1 = shiptoStreet1;
      billtoCountry = shiptoCountry;
      billtoCity = shiptoCity;
      billtoState = shiptoState;
      billtoZip = shiptoZip;
      if (!$("#billingAddress").is(":checked")) {
        let spiltNamebill = $(".customerName").text().split(/\s+/);
        billtoPhoneNum = customer_phone;
        billtoFirstName = spiltNamebill[0];
        billtoLastName = spiltNamebill[1] ? spiltNamebill[1] : "";
        billtoStreet = billtoStreetReg;
        billtoStreet1 = billtoStreet1Reg;
        billtoCountry = billtoCountryReg;
        billtoCity = billtoCityReg;
        billtoState = billtoStateReg;
        billtoZip = billtoZipReg;
      }
    }
  }
  secureTokenPayload.currency = recalculateData.totalPrice.currencyCode;
  secureTokenPayload.returnUrl = "//";
  secureTokenPayload.amt = $("#total_amount")
    .text()
    .replace("$", "")
    .replaceAll(",", "");
  secureTokenPayload.shiptoFirstName = shiptoFirstName;
  secureTokenPayload.shiptoLastName = shiptoLastName;
  secureTokenPayload.shiptoPhoneNum = shiptoPhoneNum;
  secureTokenPayload.shiptoStreet = shiptoStreet;
  secureTokenPayload.shiptoStreet1 = shiptoStreet1;
  secureTokenPayload.shiptoCountry = shiptoCountry;
  secureTokenPayload.shiptoCity = shiptoCity;
  secureTokenPayload.shiptoState = shiptoState;
  secureTokenPayload.shiptoZip = shiptoZip;
  secureTokenPayload.billtoFirstName = billtoFirstName;
  secureTokenPayload.billtoLastName = billtoLastName;
  secureTokenPayload.billtoPhoneNum = billtoPhoneNum;
  secureTokenPayload.billtoStreet = billtoStreet;
  secureTokenPayload.billtoStreet1 = billtoStreet1;
  secureTokenPayload.billtoCountry = billtoCountry;
  secureTokenPayload.billtoCity = billtoCity;
  secureTokenPayload.billtoState = billtoState;
  secureTokenPayload.billtoZip = billtoZip;
  secureTokenPayload.referenceNumber = $("#PONumber").val();
  secureTokenPayload.email = payflowinfoEmail;
  let POrefNo = $("#PONumber").val();
  $.ajax({
    type: "POST",
    url: "/bin/generatesecuretoken",
    data: {
      CTCustomerToken: window.isCustomerToken(),
      bearerToken: window.getbearerToken(),
      jsonData: JSON.stringify(paymentMethod),
      jsonSecureTokenData: JSON.stringify(secureTokenPayload)
    },
    success: function (data, statuscode, xhr) {
      if (data != null && data != "") {
        //window.errorModule.checkError(data);
        if (xhr.status == 200 && data.statusCode != 401) {
          var secureToken = data;
          if (secureToken != null || secureToken != undefined) {
            var splitToken = secureToken.split("&");
            var getSecureToken = splitToken.filter((word) =>
              word.includes("SECURETOKEN")
            );
            getSecureToken[0].split("=");
            let payflowMainHost =
              window.utilityMessage.redirectionURL.payflow_mainHost;
            let payflowMode = window.utilityMessage.redirectionURL.payflow_mode;
            let iframeUrl =
              payflowMainHost +
              "?MODE=" +
              payflowMode +
              "&SECURETOKENID=" +
              getSecureToken[1].split("=")[1] +
              "&SECURETOKEN=" +
              getSecureToken[0].split("=")[1];
            $("#payment-iframe").attr("src", iframeUrl);
            $(".card-details").find(".payflow-loader").remove();
          }
        }
      }
    },
    error: function (error) {
      window.errorModule.showErrorPopup(error);
    }
  });
}
