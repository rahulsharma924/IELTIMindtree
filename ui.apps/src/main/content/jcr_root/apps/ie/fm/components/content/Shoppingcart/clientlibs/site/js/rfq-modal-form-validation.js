var $popParent;
//let mesageText = utilityMessage.messages;
$(document).ready(function () {
  let mesageText;
  // Populate Country List
  let shoppingCartCountryRFQ = $("#country-rfq");
  let shoppingCartStateRFQ = $("#state-rfq");
  window.getUTILITYModule
  .getUtility()
  .done(function (data) {
    mesageText = data[0].messages;
  })
  .fail(function (error) {});
 
  window.getAPIModule
    .getCountryList()
    .done(function (data) {
      countriesList = data;
      if (shoppingCartCountryRFQ.length > 0) {
        shoppingCartCountryRFQ.countryList(countriesList);
      }
    })
    .fail(function (error) {});
  // Populate State List based on country selection
  $(shoppingCartCountryRFQ).change(function (event) {
    let $currEvent = $(event.currentTarget);
    let selectCountry = $currEvent.val();
    shoppingCartStateRFQ.stateFilter(countriesList, selectCountry);
  });

  // RFQ Form Validation Action
  const $rfqModalSave = $(".rfqModal-save-btn");
  $rfqModalSave.on("click", function () {
    formValidation.validateAllRFQ();
  });
  $(".note-closeIcon-wrap i").click(function () {
    $(".note-rfq").addClass("d-none");
  });
  $(".right_text_rfq").on("click", function () {
    setTimeout(function () {
      $popParent = $(".email-order-cal-table-rfq");
      $(".data__fillup").empty();
      //$("#country-rfq").val(item.country).change();
      rfq_ordersummary();
    }, 100);
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
        for (let n = 0; n < userData?.customer?.addresses.length; n++) {
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
      if (companyName !== "" && $("#company-rfq") != null && companyName !== "NA") {
        $("#company-rfq").val(companyName);
      }
      // if (companyName !== "" && $("#jobTitle-rfq") != null) {
      //   $("#jobTitle-rfq").val(companyName);
      // }
      if (email !== "" && $("#email-rfq") != null) {
        $("#email-rfq").val(email);
      }
      if (contactNum !== "" && $("#contact-rfq") != null) {
        $("#contact-rfq").val(contactNum);
      }
      if (shippingAdd1 !== "" && $("#shippingAdd-rfq") != null) {
        $("#shippingAdd-rfq").val(shippingAdd1);
      }
      if (shippingAdd2 !== "" && shippingAdd2 !== "NA"  && $("#shippingAdd2-rfq") != null) {
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
  });




/* Validations functions */
function validateFirstNameRFQ() {
  var validateName = $("#firstName-rfq").val();

  var regShippingInfoName = regexPattern.NAME;

  if (validateName == "" || validateName.length == 0) {
    document.getElementById("firstName-rfq-msg").innerHTML = mesageText?.enterFirstName;
    document.getElementById("firstName-rfq").focus();
    return false;
  } else if (validateName.length > 30) {
    document.getElementById("firstName-rfq-msg").innerHTML = mesageText?.maxChar30;
    return false;
  } else if (!regShippingInfoName.test(validateName)) {
    document.getElementById("firstName-rfq-msg").innerHTML = "";
    return true;
  } else if (regShippingInfoName.test(validateName)) {
    document.getElementById("firstName-rfq-msg").innerHTML = mesageText?.notValidName;
    return false;
  } else {
    document.getElementById("firstName-rfq-msg").innerHTML = "";
    return true;
  }
}

function validateLastNameRFQ() {
  var validateName = $("#lastName-rfq").val();

  var regShippingInfoName = regexPattern.NAME;

  if (validateName == "" || validateName.length == 0) {
    document.getElementById("lastName-rfq-msg").innerHTML = mesageText?.enterLastName;
    document.getElementById("lastName-rfq").focus();
    return false;
  } else if (validateName.length > 30) {
    document.getElementById("lastName-rfq-msg").innerHTML = mesageText?.maxChar30;
    return false;
  } else if (!regShippingInfoName.test(validateName)) {
    document.getElementById("lastName-rfq-msg").innerHTML = "";
    return true;
  } else if (regShippingInfoName.test(validateName)) {
    document.getElementById("lastName-rfq-msg").innerHTML = mesageText?.notValidName;
    return false;
  } else {
    document.getElementById("lastName-rfq-msg").innerHTML = "";
    return true;
  }
}

function validateCompanyRFQ() {
  var company = $("#company-rfq").val();
  if (company.length > 40) {
    document.getElementById("company-rfq-msg").innerHTML = mesageText?.maxChar40;
    return false;
  } else {
    document.getElementById("company-rfq-msg").innerHTML = "";
    return true;
  }
}

function validateJobTitleRFQ() {
  var company = $("#jobTitle-rfq").val();
  if (company.length > 40) {
    document.getElementById("jobTitle-rfq-msg").innerHTML = mesageText?.maxChar40;
    return false;
  } else {
    document.getElementById("jobTitle-rfq-msg").innerHTML = "";
    return true;
  }
}

function validateEmailRFQ() {
  // let mesageText = utilityMessage.messages;
  var email = $("#email-rfq").val();
  const emailRegexp = new RegExp(
    /^[a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1}([a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1})*[a-zA-Z0-9]@[a-zA-Z0-9][-\.]{0,1}([a-zA-Z][-\.]{0,1})*[a-zA-Z0-9]\.[a-zA-Z0-9]{1,}([\.\-]{0,1}[a-zA-Z]){0,}[a-zA-Z0-9]{0,}$/i
  );
  if (email == "" || email.length == 0) {
    document.getElementById("email-rfq-msg").innerHTML = mesageText?.enterEmailAddress;
    return false;
  }
  if (emailRegexp.test(email)) {
    document.getElementById("email-rfq-msg").innerHTML = "";
    return true;
  } else {
    document.getElementById("email-rfq-msg").innerHTML = mesageText?.enterValidEmailAddress;
    return false;
  }
}

function validatePhoneNumberRFQ() {
  var phoneNumber = $("#contact-rfq").val();
  //   var phoneno = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  var phoneno = /^[\d +/()-]{1,20}$/;

  if (phoneNumber == "" || phoneNumber.length == 0) {
    document.getElementById("contact-rfq-msg").innerHTML = mesageText?.enterPhone;
    return false;
  }
  if (phoneNumber.length < 10) {
    document.getElementById("contact-rfq-msg").innerHTML = mesageText?.minPhonelength;
    return false;
  }
  if (phoneNumber.length > 20) {
    document.getElementById("contact-rfq-msg").innerHTML = mesageText?.maxChar20;
    return false;
  }
  if (!phoneNumber.match(phoneno)) {
    document.getElementById("contact-rfq-msg").innerHTML = mesageText?.notValidPhone;
    return false;
  }
  if (phoneNumber.match(phoneno)) {
    document.getElementById("contact-rfq-msg").innerHTML = "";
    return true;
  } else {
    document.getElementById("contact-rfq-msg").innerHTML = "";
    return true;
  }
}

function validateShippingAddressOneRFQ() {
  var shippingAddressone = $("#shippingAdd-rfq").val();
  //var regName = ^[a-zA-Z0-9\s\,\''\-]*$;
  let regName = regexPattern.ADDRESS;
  if (shippingAddressone == "" || shippingAddressone.length == 0) {
    document.getElementById("shippingAdd-rfq-msg").innerHTML = mesageText?.validShippingAddress;
    return false;
  }

  if (shippingAddressone.length > 35) {
    document.getElementById("shippingAdd-rfq-msg").innerHTML = mesageText?.maxChar35;
    return false;
  } 
  if(!regName.test(shippingAddressone)){
    document.getElementById("shippingAdd-rfq-msg").innerHTML = "";
    return true;
  }
  if(regName.test(shippingAddressone)){
    document.getElementById("shippingAdd-rfq-msg").innerHTML = mesageText?.notValidAddress;
    return false;
  }
  else {
    document.getElementById("shippingAdd-rfq-msg").innerHTML = "";
    return true;
  }
}

function validateShippingAddressTwoRFQ() {
  var shippingAddresstwo = $("#shippingAdd2-rfq").val();

  if (shippingAddresstwo.length > 35) {
    document.getElementById("shippingAdd2-rfq-msg").innerHTML = mesageText?.maxChar35;
    return false;
  } else {
    document.getElementById("shippingAdd2-rfq-msg").innerHTML = "";
    return true;
  }
}

function validateCityRFQ() {
  var cityShippingName = $("#city-rfq").val();
  var regName = /[^a-zA-Z\- ]/;

  if (cityShippingName == "" || cityShippingName.length == 0) {
    document.getElementById("city-rfq-msg").innerHTML = mesageText?.enterCity;
    return false;
  }
  if (cityShippingName.length > 30) {
    document.getElementById("city-rfq-msg").innerHTML = mesageText?.maxChar30;
    return false;
  }
  if (!regName.test(cityShippingName)) {
    document.getElementById("city-rfq-msg").innerHTML = "";
    return true;
  }
  if (regName.test(cityShippingName)) {
    document.getElementById("city-rfq-msg").innerHTML = mesageText?.notValidCity;
    return false;
  } else {
    document.getElementById("city-rfq-msg").innerHTML = "";
    return true;
  }
}

function validateZipCodeRFQ() {
  let ZipCode = $("#zipcode-rfq").val();
  let zippcode = ZipCode;
  let e = document.getElementById("country-rfq");
  let $errorMessage = $("#zipcode-rfq-msg");
  let optionShippingIndex = e.options[e.selectedIndex].value;
  if ((zippcode == "" || zippcode.length == 0) && optionShippingIndex == 0) {
    $errorMessage.text(ValidationData.enterZipcode);
    $errorMessage.classList.add("d-none");
  } else if (zippcode == "" || zippcode.length == 0) {
    $errorMessage.text(ValidationData.enterZipcode);
    $errorMessage.classList.add("d-none");
  } else if (optionShippingIndex == "US") {
      const zipRegex = new RegExp(/^[0-9 \-]{1,10}$/);
      if (zipRegex.test(zippcode) && (zippcode.length <= 10)) {
        if (zippcode.length == 5) {
          $errorMessage.text("");
          return true;
        } else if (zippcode.substring(5, 6) == "-" && zippcode.substring(6).length == 4) {
          $errorMessage.text("");
          return true;
        } else {
          $errorMessage.text(ValidationData.notValidZipOrPost);
          return false;
        }
      }
      else {
        $errorMessage.text(ValidationData.notValidZipOrPost);
        return false;
    }
  } else if (optionShippingIndex == "CA") {

    $errorMessage.text("");
    //ANA NAN
    // const zipRegex = new RegExp (/[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d/);
    const zipRegex = new RegExp(/[A-Za-z][0-9][A-Za-z] ?[0-9][A-Za-z][0-9]/);
    if (zipRegex.test(zippcode) && zippcode.length == 7) {
      $errorMessage.text("");
      return true;
    } else {
      $errorMessage.text(ValidationData.notValidZipOrPost);
      return false;
    }
  } else if (optionShippingIndex != "CA" && optionShippingIndex != "US") {
    //const zipRegex1 = new RegExp(/^[a-zA-Z0-9 \- ]{1,10}$/);
    const zipRegex1 = new RegExp(regexPattern.ZIP_CODE.OTHER);
    if (zipRegex1.test(zippcode)) {
      $errorMessage.text("");
      return true;
    } else {
      $errorMessage.text(ValidationData.notValidZipOrPost);
      return false;
    }
  } else {
    $errorMessage.text("");
    return true;
  }
}

function validateCountryRFQ() {
  var e = document.getElementById("country-rfq");
  var optionShippingIndex = e.options[e.selectedIndex].value;
  // var zipcodeValue = $("#zipcode-rfq").val();
  //var optionSelectedText = e.options[e.selectedIndex].text;
  if (optionShippingIndex == 0) {
    document.getElementById("country-rfq-msg").innerHTML = mesageText?.enterCountry;
    return false;
  } else {
    document.getElementById("country-rfq-msg").innerHTML = "";
    return true;
  }
}

function validateStateRFQ() {
  var e = document.getElementById("state-rfq");
  var optionShippingIndex = e.options[e.selectedIndex].value;
  //var optionSelectedText = e.options[e.selectedIndex].text;
  if (optionShippingIndex == 0) {
    document.getElementById("state-rfq-msg").innerHTML = mesageText?.enterState;
    return false;
  } else {
    document.getElementById("state-rfq-msg").innerHTML = "";
    return true;
  }
}

//order summary details in popup
function rfq_ordersummary() {
  window.getAPIModule
    .getActiveCart()
    .done(function (response) {
      //window.errorModule.checkError(response);
      if (response && !response.error) {
        rfq_popupinfo(response);
      }
    })
    .fail(function (error) {
      window.errorModule.showErrorPopup(error)
    });
}
function rfq_popupinfo(data) {
  var listOfpopItems = [];
  var $minipopParent = $(".popItem_wrapper");

  var $popItems = $minipopParent.find(".order-cal-table-rfq-body");
  var $dataFillup = $minipopParent.find(".data__fillup");

  var client = algoliasearch(algId, algApi);
  var indexImg = client.initIndex(indexInuse);

  let manualTotalPrice = 0;
  $.each(data.lineItems, function (index, item) {
    // Image, Name, SKU, Quantity, Subtotal Price
    var lineItem_quantity = item.quantity;
    var lineItem_price = (item.price.value.centAmount / 100).toFixed(2);
    var lineItem_subtotalPrice = (item.totalPrice.centAmount / 100).toFixed(2);
    var $popItem = $popItems.clone(true);

    var prodColor, prodLength;

    var analyticsbestSellerRank = "";
    var analyticsColor = "";
    var analyticslength = "";
    var analyticscategory = "";
    var analyticsstartingPrice = "";
    indexImg.getObject(item.variant.sku).then((content) => {
      let assets = content.assets
      let imgurl = "";
      if (assets && assets.length) {
        imgurl = window.imageURL.createImageURL({ assets });
      } else {
        imgurl = "/content/dam/infinite-electronics/images/fairview-microwave/application-images/olcc/NewRFProduct.jpg";
      }
      $popItem
        .find(".productImg-wrapper img")
        .attr(
          "src",
          imgurl
          // content.assets && content.assets.length ? content.assets[1].url : ""
        )
        .attr("alt", item.variant.sku);
        if (
          item.variant.sku != undefined &&
          item.variant.sku != null &&
          item.variant.sku != ""
        ) {
          $popItem
            .find(".product-content-wrapper")
            .find(".varient_sku")
            .html(
              `SKU: <span class="bolder-txt">${item.variant.sku}</span>`
            );
        }
      
      var skuTitle = item.name["en"] || item.name["en-US"];

      var t = JSON.stringify(listOfpopItems);

      var $skuTitle = `<a href="product-details.html#${item.variant.sku}">${skuTitle}</a>`;
      $popItem.find(".varient_name").html($skuTitle);
      $popItem.find(".pop_quantity").text(lineItem_quantity);
      $popItem.find(".pop_price").text("$"+priceFormate.formateCheckout(lineItem_price));
      $popItem.find(".pop_total").text("$"+priceFormate.formateCheckout(lineItem_subtotalPrice));
      $popItem.removeClass("d-none");
      $dataFillup.append($popItem);
      manualTotalPrice += Number((lineItem_subtotalPrice.replaceAll(",", "")));
    $minipopParent
      .find(".pop_totalprice")
      .text(priceFormate.formateCheckout(manualTotalPrice));
    });
  });
  if (
    $(
      ".form-details-rfq input.form-control, .form-details-rfq select.form-control"
    ).val() !== ""
  ) {
    $(".rfqModal-save-btn").attr("disabled", false);
  }
 
}
function thankupopup_email() {
  $("#rfqSaveModal").modal("hide");
}

$("#country-rfq").change(function () {
  
  let optionSelIndex = $("#country-rfq").val();
  
  $("#zipcode-rfq").val("");
  $("#zipcode-rfq").removeAttr("maxlength");
  if (optionSelIndex == "CA") {
    $("#zipcode-rfq").attr("maxlength", "7");
  } else if (optionSelIndex == "US") {
    $("#zipcode-rfq").attr("maxlength", "10");
  } else {
    $("#zipcode-rfq").attr("maxlength", "10");
  }
});

/* RFQ Zipcode format and validation starts*/
$("#zipcode-rfq").keyup(function (e) {
  var addcountrySelected = document.getElementById("country-rfq");
  var optionSelIndex =
    addcountrySelected.options[addcountrySelected.selectedIndex].value;
  let valofinput = e.target;

  if (optionSelIndex == "CA") {
    let trimmed = valofinput.value.replace(/\s+/g, "");
    if (trimmed.length > 6) {
      trimmed = trimmed.substr(0, 6);
    }

    trimmed = trimmed.replace(/' '/g, "");
    let numbers = [];
    numbers.push(trimmed.substr(0, 3));

    if (trimmed.substr(3, 3) !== "") numbers.push(trimmed.substr(3, 3));

    valofinput.value = numbers.join(" ");
  }
  if (optionSelIndex == "US") {
    let trimmed = valofinput.value.replace(/\s+/g, "");
    //if (trimmed.length > 11) {
    //trimmed = trimmed.substr(0, 10);
    //}
    trimmed = trimmed.replace('-', "");
    if (trimmed.length > 5) {
      let subData = trimmed.substring(0, 5) + "-" + trimmed.substring(5)
      valofinput.value = subData;
      
    }
  } else {
    valofinput.value = valofinput.value;
  }
});
let rfqModalFormValidation = {}
rfqModalFormValidation.validateFirstNameRFQ = validateFirstNameRFQ;
rfqModalFormValidation.validateLastNameRFQ = validateLastNameRFQ;
rfqModalFormValidation.validateCompanyRFQ = validateCompanyRFQ;
rfqModalFormValidation.validateJobTitleRFQ = validateJobTitleRFQ;
rfqModalFormValidation.validateEmailRFQ = validateEmailRFQ;
rfqModalFormValidation.validatePhoneNumberRFQ = validatePhoneNumberRFQ;
rfqModalFormValidation.validateShippingAddressOneRFQ = validateShippingAddressOneRFQ;
rfqModalFormValidation.validateShippingAddressTwoRFQ = validateShippingAddressTwoRFQ;
rfqModalFormValidation.validateCityRFQ = validateCityRFQ;
rfqModalFormValidation.validateCountryRFQ = validateCountryRFQ;
rfqModalFormValidation.validateZipCodeRFQ = validateZipCodeRFQ;
rfqModalFormValidation.validateStateRFQ = validateStateRFQ;
window.rfqModalFormValidation = rfqModalFormValidation || {}
/* RFQ Zipcode format and validation ends*/
});