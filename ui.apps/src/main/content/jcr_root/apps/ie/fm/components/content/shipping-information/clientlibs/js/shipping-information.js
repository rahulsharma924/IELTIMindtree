// checkout page
let tvalue,
  bearerToken,
  lineItemId,
  defaultShippingAddressId,
  cookiphoneNumber,
  email;
var selectedAddId;
let isValidAddress = false;
let ispartiallyValidAddress = false;
let isOverWeightProduct = false;
let recommendedAddress = {};
let address = [];
let otherAddress = [];
let editResponse = [];
let shippingInfoGuestUser = {};
let loggedInUser = $(".logged-in-user").hasClass("tokenActive");
let guestUser = $(".guest-user").hasClass("tokenActive");
let shipAddressEntered = false;
let FedexUpsInfo = {};
let UYSA_methodofshipping = {};
let localSelectedAddr = [];
var globalCentAmout, globalCurrentCountry;
$(document).ready(function (e) {
  // if there is no any token then redirect to empty shopping cart
  commonUtility().redirectToEmptyShoppingCart();
  // if guest user then enabled CTA Button and remove shipping loader by default
  if ($.fn.cookiesRead().isGuestUserToken()) {
    $(".validate__shipping--info").removeClass("button__disabled");
    commonUtility().addClassDnone(".shipping__loader");
  }
  //validate address popup alignement
  $("#addressValidationPopup").on("shown.bs.modal", function (e) {
    $("#editShippingAddressPopup").css("padding-right", "");
    $("#editShippingAddressPopup").css("overflow-y", "hidden");
  });
  $("#addressValidationPopup").on("hidden.bs.modal", function (e) {
    $("#editShippingAddressPopup").removeAttr("style");
  });
  let countriesList;
  localStorage.setItem("selectedAddr", localSelectedAddr);
  // Bind Country Data
  const $countryShippingInfoEditAddress = $("#editNewShippingAddressCountry"),
    $editAddressShipping = $("#editAddressShippingState"),
    $addNewShippingAddress = $("#addNewShippingAddressCountry"),
    $addNewShippingState = $("#addNewShippingState"),
    $shippingCountry = $("#ShippingCountry"),
    $shippingState = $("#ShippingState"),
    $finalDestinationCountry = $("#finalDestinationCountry"),
    $finalDestinationState = $("#finalDestinationstate");
  // Country List
  window.getAPIModule
    .getCountryList()
    .done(function (data) {
      countriesList = data;
      if ($countryShippingInfoEditAddress) {
        $countryShippingInfoEditAddress.countryList(countriesList);
      }
      if ($addNewShippingAddress) {
        $addNewShippingAddress.countryList(countriesList);
      }
      if ($shippingCountry) {
        $shippingCountry.countryList(countriesList);
      }
      if ($finalDestinationCountry) {
        $finalDestinationCountry.countryList(countriesList);
      }
    })
    .fail(function (error) {});

  // Update the State List based on country selection for Shipping Information Edit
  $countryShippingInfoEditAddress.on("change", function (event) {
    let $currentEvent = $(event.currentTarget);
    let selectValue = $currentEvent.val();
    $editAddressShipping.stateFilter(countriesList, selectValue);
  });

  // Update the State List based on country selection for new Address add
  $addNewShippingAddress.on("change", function (event) {
    let $currentEvent = $(event.currentTarget);
    let selectValue = $currentEvent.val();
    $addNewShippingState.stateFilter(countriesList, selectValue);
  });

  // Update the State List based on country selection for shipping country
  $shippingCountry.on("change", function (event) {
    let $currentEvent = $(event.currentTarget);
    let selectValue = $currentEvent.val();
    $shippingState.stateFilter(countriesList, selectValue);
  });

  // Update the State List based on country selection for final destination
  $finalDestinationCountry.on("change", function (event) {
    let $currentEvent = $(event.currentTarget);
    let selectValue = $currentEvent.val();
    $finalDestinationState.stateFilter(countriesList, selectValue);
  });
  $(".clickable").click(function () {
    let $this = $(this);
    if (!$this.hasClass("collapsed")) {
      $this
        .find("i")
        .removeClass("fa fa-chevron-down")
        .addClass("fa fa-chevron-up");
    } else {
      $this
        .find("i")
        .removeClass("fa fa-chevron-up")
        .addClass("fa fa-chevron-down");
    }
  });

  $("input[name='declaration']").click(function () {
    let radioValue = $("input[name='declaration']:checked").val();
    $("#final-declaration-error").text("");
    if (radioValue == "yes") {
      $(".freight-forwarder-yes").show();
      $(".tax-exemption-check-section").hide();
    } else {
      $(".freight-forwarder-yes").hide();
      if (globalCentAmout !== 0 && globalCurrentCountry == "US")
        $(".tax-exemption-check-section").css("display", "block");
      else $(".tax-exemption-check-section").css("display", "none");
    }
  });

  $("#show-more-option-mobile").on("click", function () {
    $("#show-mobile-shipping-method").show();
    $("#show-more-option-mobile").hide();
  });

  //get selected addressID
  setTimeout(function () {
    $(".customRadio").each(function () {
      if ($(this).parent("div").attr("id") == "default_address") {
        if ($(".logged-in-user").hasClass("tokenActive")) {
          //$(this)[0].click();
        }
        selectedAddId = $(this)
          .siblings("div")
          .find(".EditShippingInfo")
          .attr("data-addressid");
      } else {
        if ($(this).is(":checked")) {
          selectedAddId = $(this)
            .siblings("div")
            .find(".EditShippingInfo")
            .attr("data-addressid");
        }
      }
    });

    $(".continue-btn").attr("data-selectedAddId", selectedAddId);
    //loggedIN user start
    if ($(".logged-in-user").hasClass("tokenActive")) {
      //checkout calculated function
      //validateAddressAPIcallRegisteredUser();
    }
    //read method of shipping btn values from json
    $.ajax({
      url: $.fn.getAPIEndpoint().damEndpoint.fedex_ups_card_response,
      success: function (response) {
        FedexUpsInfo.response = response;
      }
    });
    //read method of shipping btn values from json for UYSA
    $.ajax({
      url: $.fn.getAPIEndpoint().damEndpoint.use_your_shipping_acc_response,
      success: function (response) {
        UYSA_methodofshipping.response = response;
      }
    });
    //remove grey color after enter acc no
    $("#select-box-account").change(function () {
      let selectValue = $(this).val() || "";
      if (selectValue !== "Select") {
        $("#carrier-acc-number").removeAttr("disabled");
        if (selectValue.toLowerCase() === "ups") {
          $("#carrier-acc-number").attr("type", "text").val("");
        } else if (selectValue.toLowerCase() === "fedex") {
          $("#carrier-acc-number").attr("type", "number").val("");
        }
      } else {
        $("#carrier-acc-number").attr("disabled", true);
      }
    });
  }, 800);
  //loggedIN user start
  if ($(".logged-in-user").hasClass("tokenActive")) {
    //getting address values from cookie
    getAddressfrmCookie();
    guestUserCArtItem();
    //trigger default address click
    //trigger default address click
    $(".get-taxdetails").trigger("click");
    getTaxDetail.stateInfo($(".get-taxdetails"));
    $(".get-taxdetails").on("click", function () {
      getTaxDetail.stateInfo($(".get-taxdetails"));
    });
  } else {
    //guest user start
    //remove active class on load from MOS
    $(".mathod-of-shipping").find(".shipping-li").removeClass("active");
    //guest user getactivecart servelt
    guestUserCArtItem();

    //#ShippingZip call
    $(".guest-user")
      .find(".form-control")
      .focusout(function () {
        if ($(this).attr("id") == "ShippingZip") {
          shippingInfoGuestUser.name = $(".tokenActive")
            .find("#ShippingName")
            .val();
          shippingInfoGuestUser.company = $(".tokenActive")
            .find("#ShippingCompany")
            .val();
          shippingInfoGuestUser.phone = $(".tokenActive")
            .find("#ShippingphoneNumber")
            .val();
          shippingInfoGuestUser.country = $(".tokenActive")
            .find("#ShippingCountry")
            .val();

          shippingInfoGuestUser.line1 = $(".tokenActive")
            .find("#ShippingAddressLine1")
            .val();
          shippingInfoGuestUser.line2 = $(".tokenActive")
            .find("#ShippingAddressLine2")
            .val();
          shippingInfoGuestUser.city = $(".tokenActive")
            .find("#ShippingCity")
            .val();
          shippingInfoGuestUser.state = $(".tokenActive")
            .find("#ShippingState")
            .val();
          shippingInfoGuestUser.postalCode = $(".tokenActive")
            .find("#ShippingZip")
            .val();
          var onloadAddCheck = false;
          var zipCodeLength = $(".tokenActive")
            .find("#ShippingZip")
            .val().length;
          if (
            shippingInfoGuestUser.line1 != "" &&
            //shippingInfoGuestUser.line2 != "" &&
            shippingInfoGuestUser.city != "" &&
            shippingInfoGuestUser.state != "" &&
            shippingInfoGuestUser.country != "" &&
            shippingInfoGuestUser.postalCode != ""
          ) {
            onloadAddCheck = true;
          } else {
            onloadAddCheck = false;
          }
          var finalshippingInfoGuestUser = {};
          var guestshippingadd = shippingInfoGuestUser;
          delete guestshippingadd["name"];
          delete guestshippingadd["company"];
          delete guestshippingadd["phone"];
          finalshippingInfoGuestUser.address = guestshippingadd;
          if (onloadAddCheck) {
            // ajaxcall for customertoken and defaultaddress
            $.ajax({
              type: $.fn.getAPIEndpoint().requestType.POST,
              url: $.fn.getAPIEndpoint().VALIDATE_ADDRESS_GUEST,
              data: {
                jsonData: JSON.stringify(finalshippingInfoGuestUser),
                bearerToken: window.getbearerToken()
              },
              success: function (validateAddrResponse, statuscode, xhr) {
                let countryCheck = $("#ShippingCountry").val();
                //window.errorModule.checkError(validateAddrResponse);
                if (
                  validateAddrResponse != null &&
                  validateAddrResponse != "" &&
                  validateAddrResponse !== 500
                ) {
                  if (
                    xhr.status == 200 &&
                    validateAddrResponse.statusCode != 401 &&
                    validateAddrResponse.statusCode != 500
                  ) {
                    if (countryCheck === "US") {
                      if (
                        validateAddrResponse.validatedAddresses &&
                        validateAddrResponse.validatedAddresses.length > 0
                      ) {
                        if (
                          validateAddrResponse.validatedAddresses[0]
                            .addressType !== "UnknownAddressType"
                        ) {
                          //show method of shipping
                          isValidAddress = true;
                          $(".shipping-ul").show();
                          onloadAddCheck = false;
                          shipAddressEntered = true;
                          triggerMethodOfShipping();
                        } else {
                          isValidAddress = false;
                          $("#unknownAddresstype").modal("show");
                          $(".shipping-ul").hide();
                        }
                      }
                      // if CT API sends address matched error code then proceed with displaying method of shipping
                      else if (
                        validateAddrResponse.statusCode &&
                        validateAddrResponse.statusCode == 400 &&
                        validateAddrResponse.errors &&
                        validateAddrResponse?.errors[0]?.code ==
                          "ADDRESS_MATCHED"
                      ) {
                        isValidAddress = true;
                        $(".shipping-ul").show();
                        onloadAddCheck = false;
                        shipAddressEntered = true;
                        triggerMethodOfShipping();
                      } else {
                        isValidAddress = false;
                        $("#unknownAddresstype").modal("show");
                        $(".shipping-ul").hide();
                      }
                    } else {
                      //show method of shipping
                      isValidAddress = true;
                      $(".shipping-ul").show();
                      onloadAddCheck = false;
                      shipAddressEntered = true;
                      triggerMethodOfShipping();
                    }
                  } else {
                    if (countryCheck !== "US" && countryCheck !== "CA") {
                      isValidAddress = true;
                      $(".shipping-ul").show();
                      onloadAddCheck = false;
                      shipAddressEntered = true;
                      triggerMethodOfShipping();
                    }
                  }
                } else {
                  $(".shipping-ul").html("");
                }
              },
              error: function (error) {
                window.errorModule.showErrorPopup(error);
              }
            });
          }
        } else {
          /*validateShippingInformation()*/
        }
      });

    //guest user end
  }
  //delete edit address call
  $(".deleteShippingAddressBtn").on("click", function (e) {
    deleteEditAddress(this);
    $("#editShippingAddressPopup").css("padding-right", "");
    $("#deleteConfirm").css("padding-left", "");
    $("#editShippingAddressPopup").css("overflow-y", "hidden");
  });
  // Validate Shipping INFO
  const $validateShippingInfo = $(".validate__shipping--info");
  $validateShippingInfo.on("click", function () {
    formValidation.validateShippingInformation();
  });

  const $editExistingAddress = $(".edit-existing-address");
  $editExistingAddress.on("click", function () {
    formValidation.editExistingShippingAddress();
  });

  $(".add-new-address-btn")
    .off("click")
    .on("click", function () {
      $("#addformid")[0].reset();
      $("#addNewShippingState").html(
        '<option value="" selected="selected">Select</option>'
      );
    });
  $("#addNewShippingAddressPopup").on("hidden.bs.modal", function () {
    clearAddShippingAddressError();
  });
});
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

//default id
function changeAddressValidation(elem) {
  $(".validate__shipping--info").addClass("button__disabled");
  $(".EditShippingInfo").addClass("link__disabled");

  commonUtility().addClassDnone(".shipping-methods-section");
  commonUtility().removeClassDnone(".shipping__loader");

  //isRunning = true;
  let radioID = elem.id === undefined ? elem.attr("id") : elem.id;
  selectedAddId = $("#" + radioID)
    .siblings("div")
    .find(".EditShippingInfo")
    .attr("data-addressid");
  defaultShippingAddressId = selectedAddId;
  validateAddressAPIcallRegisteredUser(elem);
}

/*
Code for validating address
*/
function validateAddressAPIcallRegisteredUser(elem) {
  // ajaxcall for customertoken and defaultaddress
  $.ajax({
    type: $.fn.getAPIEndpoint().requestType.POST,
    url: $.fn.getAPIEndpoint().VALIDATE_ADDRESS,
    data: {
      CTCustomerToken: window.isCustomerToken(),
      bearerToken: window.getbearerToken(),
      addressId: defaultShippingAddressId
    },
    success: function (validateAddrResponse, statuscode, xhr) {
      //window.errorModule.checkError(validateAddrResponse);
      if (
        validateAddrResponse != null &&
        validateAddrResponse != "" &&
        validateAddrResponse != 500
      ) {
        if (
          xhr.status == 200 &&
          validateAddrResponse.statusCode != 401 &&
          validateAddrResponse.statusCode != 500 &&
          validateAddrResponse.statusCode != 400
        ) {
          if (validateAddrResponse.address.country === "US") {
            if (validateAddrResponse.validatedAddresses.length > 0) {
              if (
                validateAddrResponse.validatedAddresses[0].addressType !==
                "UnknownAddressType"
              ) {
                //method of shipping
                isValidAddress = true;
                $(".shipping-ul").show();
                getDeliveryEstimationsForRegUsers(defaultShippingAddressId);
                $(".validate__shipping--info").removeClass("button__disabled");
                enableEditButton(elem);
              } else {
                isValidAddress = false;
                commonUtility().addClassDnone(".shipping__loader");
                $("#unknownAddresstype").modal("show");
                $(".shipping-ul").hide();
                $(".validate__shipping--info").addClass("button__disabled");
                enableEditButton(elem);
              }
            } else {
              isValidAddress = false;
              commonUtility().addClassDnone(".shipping__loader");
              $("#unknownAddresstype").modal("show");
              $(".shipping-ul").hide();
              $(".validate__shipping--info").addClass("button__disabled");
              enableEditButton(elem);
            }
          } else {
            isValidAddress = true;
            enableEditButton(elem);
            $(".shipping-ul").show();
            getDeliveryEstimationsForRegUsers(defaultShippingAddressId);
            $(".validate__shipping--info").removeClass("button__disabled");
          }
        } else {
          if (selectCountry !== "US" && selectCountry !== "CA") {
            //method of shipping
            isValidAddress = true;
            enableEditButton(elem);
            $(".shipping-ul").show();
            getDeliveryEstimationsForRegUsers(defaultShippingAddressId);
            $(".validate__shipping--info").removeClass("button__disabled");
          }
        }
      } else {
        //$(".shipping-ul").html("");
      }
    },
    error: function (error) {
      window.errorModule.showErrorPopup(error);
    }
  });
}
/**
 * enableEditButton() // Enable edit button after address validion either succes or failure
 */
function enableEditButton(elem) {
  if ($(elem).is(":checked")) {
    $(elem).parent().find(".EditShippingInfo").removeClass("link__disabled");
  }
}
function getSelectedAddressId() {
  return $("input[name='selectedAddress']:checked")
    .siblings("div.edit-existing-shipping-address")
    .find(".EditShippingInfo")
    .attr("data-addressid");
}

function getSelIdIsDefault() {
  return $("input[name='selectedAddress']:checked")
    .siblings("div.edit-existing-shipping-address")
    .find(".EditShippingInfo")
    .attr("data-isdefault");
}

function getAddressInfoFromId(addrId) {
  const cookie = $.fn.cookiesRead().logedInCookiesData() || {};
  const customerInfo = cookie ? cookie?.customer : [];
  let data = {};
  for (let item of customerInfo.addresses) {
    if (addrId == item.id) {
      data.city = item.city;
      data.company = item.company !== "NA" ? item.company : "";
      data.country = item.country;
      data.firstName = item.firstName;
      data.lastName = item.lastName;
      data.postalCode = item.postalCode;
      data.state = item.state;
      data.streetName = item.streetName !== "NA" ? item.streetName : "";
      data.streetNumber = item.streetNumber;
      data.phone = item.phone;
      data.isDefault = item.isDefault;
      return data;
    }
  }
}
/**
 * For checking whether the address is already validated.
 * Validated addresses are stored in local storage in the form of their address ids
 * (this is for logged in users)
 * @param {String} addrId
 * @returns {boolean} - returns true if address is validated
 *                    - returns false if address is not validated
 */
function checkIfAddrIdAlreadyClicked(addrId) {
  let listOfIds = localStorage.getItem("selectedAddr");
  let lister = listOfIds.split(",");
  return lister.includes(addrId);
}

/**
 * For displaying recommended address popup after pressing save on address edit popup.
 * It takes the address from the edit address popup and then sends that to the CT address validation API.
 * It checks whether the address from the edit address popup is an exact match with the address sent by the CT API(recommended address) and if it is then proceeds with
 * saving the address, if it is not then it displays the recommended address popup and lets the user to choose the address.
 * If the user selects the recommended address, then recommended address gets populated in the edit address popup.
 * If user selects the original address then edit address popup doesn't get updated.
 *
 */
function displayValidationPopupEditSave() {
  let adl2;
  let adl1;
  let adcity;
  let adstate;
  let adzip;
  let adcountry;
  adcountry = $("#editNewShippingAddressCountry").val();
  adl1 = $("#editNewShippingAddressAddressLine1").val();
  adl2 = $("#editShippingAddressLine2").val();
  adzip = $("#editShippingAddressZip").val();
  adstate = $("#editAddressShippingState").val();
  adcity = $("#editShippingAddressCity").val();
  let currentAddr = {
    address: {
      postalCode: adzip,
      state: adstate,
      city: adcity,
      line1: adl1,
      line2: adl2,
      country: adcountry
    }
  };
  $.ajax({
    type: $.fn.getAPIEndpoint().requestType.POST,
    url: $.fn.getAPIEndpoint().VALIDATE_ADDRESS_GUEST,
    data: {
      jsonData: JSON.stringify(currentAddr),
      bearerToken: window.getbearerToken()
    },
    success: function (response, statuscode, xhr) {
      //window.errorModule.checkError(response);
      if (
        xhr.status === 200 &&
        response &&
        response.statuscode !== 401 &&
        response.statuscode !== 500
      ) {
        if (!doesAddressMatch(response)) {
          if (
            response.validatedAddresses[0].addressType === "UnknownAddressType"
          ) {
            isValidAddress = false;
            $("#editShippingAddressPopup").modal("hide");
            $("#unknownAddresstype").modal("show");
            $(".shipping-ul").hide();
            $(".validate__shipping--info").addClass("button__disabled");
            $("#editShippingAddressPopup")
              .find("#editNewShippingAddressName")
              .attr("data-isValidated", "true");
            return false;
          }

          let cityStateZip = "";
          $("#addressValidationPopup").modal("show");
          recommendedAddress = response?.validatedAddresses[0];
          $(".oriaddr-div").find(".orig-address__addrl1").empty();
          $(".oriaddr-div").find(".orig-address__addrl2").empty();
          $(".oriaddr-div").find(".orig-address__city-state").empty();
          $(".oriaddr-div").find(".orig-address__country").empty();
          if (adl1 && adl1 !== "") {
            $(".oriaddr-div").find(".orig-address__addrl1").text(adl1);
          }
          if (adl2 && adl2 !== "") {
            $(".oriaddr-div").find(".orig-address__addrl2").text(adl2);
          }
          if (adcity && adcity !== "") {
            cityStateZip += adcity + ", ";
          }
          if (adstate && adstate !== "") {
            cityStateZip += adstate + " ";
          }
          if (adzip && adzip !== "") {
            cityStateZip += adzip;
          }
          $(".oriaddr-div")
            .find(".orig-address__city-state")
            .text(cityStateZip);
          if (adcountry && adcountry !== "") {
            $(".oriaddr-div").find(".orig-address__country").text(adcountry);
          }

          $(".recaddr-div").find(".rec-address__addrl1").empty();
          $(".recaddr-div").find(".rec-address__addrl2").empty();
          $(".recaddr-div").find(".rec-address__country").empty();
          $(".recaddr-div").find(".rec-address__city-state").empty();
          let recStateCityZip = "";
          if (
            response?.validatedAddresses[0].line1 &&
            response?.validatedAddresses[0].line1 !== ""
          ) {
            $(".recaddr-div")
              .find(".rec-address__addrl1")
              .text(response?.validatedAddresses[0].line1);
          }
          if (
            response?.validatedAddresses[0].line2 &&
            response?.validatedAddresses[0].line2 !== ""
          ) {
            $(".recaddr-div")
              .find(".rec-address__addrl2")
              .text(response?.validatedAddresses[0].line2);
          }

          if (
            response?.validatedAddresses[0].city &&
            response?.validatedAddresses[0].city !== ""
          ) {
            recStateCityZip += response?.validatedAddresses[0].city + ", ";
          }
          if (
            response?.validatedAddresses[0].region &&
            response?.validatedAddresses[0].region !== ""
          ) {
            recStateCityZip += response?.validatedAddresses[0].region + " ";
          }

          if (
            response?.validatedAddresses[0].postalCode &&
            response?.validatedAddresses[0].postalCode !== ""
          ) {
            recStateCityZip += response?.validatedAddresses[0].postalCode;
          }
          $(".recaddr-div")
            .find(".rec-address__city-state")
            .text(recStateCityZip);
          if (
            response?.validatedAddresses[0].country &&
            response?.validatedAddresses[0].country !== ""
          ) {
            $(".recaddr-div")
              .find(".rec-address__country")
              .text(response?.validatedAddresses[0].country);
          }

          $(".confirm-btn-address").removeClass("continue");
          $(".confirm-btn-address").addClass("edit_save");
          $(".confirm-btn-address").off();
          const $btnConf = $(".confirm-btn-address.edit_save");
          if ($btnConf.length) {
            editSaveOnCnfBtn($btnConf);
          }
        } else {
          saveData();
        }
      }
    },
    error: function (error) {
      window.errorModule.showErrorPopup(error);
    }
  });
}

/**
 * Validates selected/entered address for logged in & guest user, checks whether
 * to display address recommendation popup or not.
 * For validation of address and displaying recommendation popup when user clicks
 * on continue btn for guest and logged in user for the first time.
 * @param {JSON} selAddrInfo        - selected/input address given by the user
 * @param {String} action           - is this getting called for guest user("continue_guest") or logged in user("continue")
 * @param {JSON} addressForCheckout - entire address information needed for the checkout flow
 */
function validateAndDisplayPopup(selAddrInfo, action, addressForCheckout) {
  let adl2;
  let adl1;
  let adcity;
  let adstate;
  let adzip;
  let adcountry;
  if (action === "continue") {
    adl2 = selAddrInfo?.streetName || "";
    adl1 = selAddrInfo?.streetNumber || "";
    adcity = selAddrInfo?.city || "";
    adstate = selAddrInfo?.state || "";
    adzip = selAddrInfo?.postalCode || "";
    adcountry = selAddrInfo?.country || "";
  } else if (action === "guest_continue") {
    adl2 = selAddrInfo.line2;
    adl1 = selAddrInfo.line1;
    adcity = selAddrInfo.city;
    adstate = selAddrInfo.state;
    adzip = selAddrInfo.zipcode;
    adcountry = selAddrInfo.country;
  }
  let currentAddr = {
    address: {
      postalCode: adzip,
      state: adstate,
      city: adcity,
      line1: adl1,
      line2: adl2,
      country: adcountry
    }
  };
  $.ajax({
    type: $.fn.getAPIEndpoint().requestType.POST,
    url: $.fn.getAPIEndpoint().VALIDATE_ADDRESS_GUEST,
    data: {
      jsonData: JSON.stringify(currentAddr),
      bearerToken: window.getbearerToken()
    },
    success: function (response, statuscode, xhr) {
      //window.errorModule.checkError(response);
      if (
        xhr.status === 200 &&
        response &&
        response.statuscode !== 401 &&
        response.statuscode !== 500
      ) {
        if (doesAddressMatch(response)) {
          proceedWithCheckout(addressForCheckout);
        } else {
          if (action === "continue") {
            $("#editShippingAddressPopup").modal("hide");
          }
          let cityStateZip = "";
          $("#addressValidationPopup").modal("show");
          recommendedAddress = response?.validatedAddresses[0];
          $(".oriaddr-div").find(".orig-address__addrl1").empty();
          $(".oriaddr-div").find(".orig-address__addrl2").empty();
          $(".oriaddr-div").find(".orig-address__city-state").empty();
          $(".oriaddr-div").find(".orig-address__country").empty();
          if (adl1 && adl1 !== "") {
            $(".oriaddr-div").find(".orig-address__addrl1").text(adl1);
          }
          if (adl2 && adl2 !== "") {
            $(".oriaddr-div").find(".orig-address__addrl2").text(adl2);
          }
          if (adcity && adcity !== "") {
            cityStateZip += adcity + ", ";
          }
          if (adstate && adstate !== "") {
            cityStateZip += adstate + " ";
          }
          if (adzip && adzip !== "") {
            cityStateZip += adzip;
          }
          $(".oriaddr-div")
            .find(".orig-address__city-state")
            .text(cityStateZip);
          if (adcountry && adcountry !== "") {
            $(".oriaddr-div").find(".orig-address__country").text(adcountry);
          }

          $(".recaddr-div").find(".rec-address__addrl1").empty();
          $(".recaddr-div").find(".rec-address__addrl2").empty();
          $(".recaddr-div").find(".rec-address__country").empty();
          $(".recaddr-div").find(".rec-address__city-state").empty();
          let recStateCityZip = "";
          if (
            response?.validatedAddresses[0].line1 &&
            response?.validatedAddresses[0].line1 !== ""
          ) {
            $(".recaddr-div")
              .find(".rec-address__addrl1")
              .text(response?.validatedAddresses[0].line1);
          }
          if (
            response?.validatedAddresses[0].line2 &&
            response?.validatedAddresses[0].line2 !== ""
          ) {
            $(".recaddr-div")
              .find(".rec-address__addrl2")
              .text(response?.validatedAddresses[0].line2);
          }

          if (
            response?.validatedAddresses[0].city &&
            response?.validatedAddresses[0].city !== ""
          ) {
            recStateCityZip += response?.validatedAddresses[0].city + ", ";
          }
          if (
            response?.validatedAddresses[0].region &&
            response?.validatedAddresses[0].region !== ""
          ) {
            recStateCityZip += response?.validatedAddresses[0].region + " ";
          }

          if (
            response?.validatedAddresses[0].postalCode &&
            response?.validatedAddresses[0].postalCode !== ""
          ) {
            recStateCityZip += response?.validatedAddresses[0].postalCode;
          }
          $(".recaddr-div")
            .find(".rec-address__city-state")
            .text(recStateCityZip);
          if (
            response?.validatedAddresses[0].country &&
            response?.validatedAddresses[0].country !== ""
          ) {
            $(".recaddr-div")
              .find(".rec-address__country")
              .text(response?.validatedAddresses[0].country);
          }
          if (action === "continue") {
            $(".confirm-btn-address").removeClass("edit_save");
            $(".confirm-btn-address").addClass("continue");
            $(".confirm-btn-address").off();
            const $btnConf = $(".confirm-btn-address.continue");
            if ($btnConf.length) {
              contOnConfirmBtn($btnConf);
            }
          } else if (action === "guest_continue") {
            $(".confirm-btn-address").addClass("guest_continue");
            $(".confirm-btn-address").off();
            const $btnConf = $(".confirm-btn-address.guest_continue");
            if ($btnConf.length) {
              onClickGuestContinue($btnConf);
            }
          }
        }
      }
    },
    error: function (error) {
      window.errorModule.showErrorPopup(error);
    }
  });
}
/**
 * For updating the local storage with the address ID of address which is validated
 */
function updateLocalStorageForAddr() {
  let selAddr = getSelectedAddressId();
  let selectedAddr = localStorage.getItem("selectedAddr");
  if (selectedAddr !== "") {
    selectedAddr += ",";
  }
  selectedAddr += selAddr;
  localStorage.removeItem("selectedAddr");
  localStorage.setItem("selectedAddr", selectedAddr);
}

// to update the address after clicking on recommended address
/** * For logged in user-> updating the address recommended by the CT API for the user in CT database (through an AJAX call) as well as in the cookie.
 * This function needs to be called after the recommended address is selected.That recommended address gets updated for the user.
 * @param {HTMLElement} $btnConf - btn to which the onclick event is applied
 *
 */
function contOnConfirmBtn($btnConf) {
  $btnConf.on("click", function () {
    updateLocalStorageForAddr();
    if ($('input[name="oriRecAddr"]:checked').val() === "recAddr") {
      let selAddrId = getSelectedAddressId();
      let addrInfo = getAddressInfoFromId(selAddrId);
      let addrJSON = {};
      addrJSON.name = "";
      if (addrInfo?.city && addrInfo?.city !== "") {
        addrJSON.city =
          recommendedAddress?.city && recommendedAddress.city !== ""
            ? recommendedAddress?.city
            : addrInfo.city;
      }
      if (addrInfo?.company && addrInfo?.company !== "") {
        addrJSON.company = addrInfo.company;
      }
      if (addrInfo?.firstName && addrInfo?.firstName !== "") {
        addrJSON.name = addrInfo.firstName + " ";
      }
      if (addrInfo?.lastName && addrInfo?.lastName !== "") {
        addrJSON.name += addrInfo.lastName;
      }
      if (addrInfo?.phone && addrInfo?.phone !== "") {
        addrJSON.phone = addrInfo.phone;
      }
      if (addrInfo?.streetNumber && addrInfo?.streetNumber !== "") {
        addrJSON.line1 =
          recommendedAddress?.line1 && recommendedAddress.line1 !== ""
            ? recommendedAddress?.line1
            : addrInfo.streetNumber;
      }
      if (addrInfo?.streetName && addrInfo?.streetName !== "") {
        addrJSON.line2 =
          recommendedAddress?.line2 && recommendedAddress.line2 !== ""
            ? recommendedAddress?.line2
            : "";
      }
      if (addrInfo?.postalCode && addrInfo?.postalCode !== "") {
        addrJSON.zipcode =
          recommendedAddress?.postalCode && recommendedAddress.postalCode !== ""
            ? recommendedAddress?.postalCode
            : addrInfo.postalCode;
      }
      if (addrInfo?.state && addrInfo?.state !== "") {
        addrJSON.state =
          recommendedAddress?.region && recommendedAddress.region !== ""
            ? recommendedAddress?.region
            : addrInfo.state;
      }
      if (addrInfo?.country && addrInfo?.country !== "") {
        addrJSON.country =
          recommendedAddress?.country && recommendedAddress.country !== ""
            ? recommendedAddress?.country
            : addrInfo.country;
      }

      addrJSON.isDefault = getSelIdIsDefault();

      let finalAdd = {
        type: "shipping",
        address: addrJSON,
        addressId: selAddrId
      };
      let finalAd1 = JSON.stringify(finalAdd);
      let finalAd2 = finalAd1.replaceAll("[", "");
      let finalAd3 = finalAd2.replaceAll("]", "");
      $.ajax({
        type: $.fn.getAPIEndpoint().requestType.POST,
        url: $.fn.getAPIEndpoint().UPDATE_ADDRESS,
        data: {
          accessToken: window.isCustomerToken(),
          bearerToken: window.getbearerToken(),
          jsonData: finalAd3
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
                let text = {
                  customertoken: getCustomerTokenFromCookie(),
                  customer: JSON.parse(updateAddress.response)
                };
                customerInfo = "";
                document.cookie =
                  "customerInfo=" + JSON.stringify(text) + ";path=/;";
              }
              getAddressfrmCookie();
              markElementFromAddrId(selAddrId);
              selectedAddId = selAddrId;
              validateAddressAPIcallRegisteredUser();
            } else {
              localStorage.removeItem("selectedAddr");
              localStorage.setItem("selectedAddr", "");
            }
          }
        },
        error: function (error) {
          window.errorModule.showErrorPopup(error);
        }
      });
    } else {
      if (!isOverWeightProduct) {
        $errorMsgEle = $(".shippinginfo__method-error");
        $errorMsgEle.addClass("carrier-error");
        if (ispartiallyValidAddress) {
          if ($errorMsgEle) {
            $errorMsgEle.show();
            methodOfShippingOtherMethods();
            ispartiallyValidAddress = true;
          }
        }
      }
    }
  });
}
/* to change the address after selecting recommnded address from 
 recommended address from popup */
/**
 * This is For guest user->for updating the address fields in edit address popup after selecting address recommended by the CT validation API
 * It also checks whether continue btn is clicked already clicked
 * @param {HTMLElement} $btnCont
 */
function onClickGuestContinue($btnCont) {
  $btnCont.on("click", function () {
    if ($('input[name="oriRecAddr"]:checked').val() === "recAddr") {
      let adl1 =
        recommendedAddress.line1 !== "" &&
        recommendedAddress.line1 !== undefined
          ? recommendedAddress.line1
          : $("#ShippingAddressLine1").val();

      let adl2 =
        recommendedAddress.line2 !== "" &&
        recommendedAddress.line2 !== undefined
          ? recommendedAddress.line2
          : "";

      let city =
        recommendedAddress.city !== "" && recommendedAddress.city !== undefined
          ? recommendedAddress.city
          : $("#ShippingCity").val();
      let postalCode =
        recommendedAddress.postalCode !== "" &&
        recommendedAddress.postalCode !== undefined
          ? recommendedAddress.postalCode
          : $("#ShippingZip").val();
      let country =
        recommendedAddress.country !== "" &&
        recommendedAddress.country !== undefined
          ? recommendedAddress.country
          : $("#ShippingCountry").val();
      let state =
        recommendedAddress.region !== "" &&
        recommendedAddress.region !== undefined
          ? recommendedAddress.region
          : $("#ShippingState").val();

      $("#ShippingAddressLine1").val(adl1);
      $("#ShippingAddressLine2").val(adl2);
      $("#ShippingCity").val(city);
      $("#ShippingZip").val(postalCode);
      $("#ShippingCountry").val(country).change();
      $("#ShippingState").val(state).change();
      $("#ShippingZip").click();
      $("#ShippingZip").blur();
    } else {
      if (!isOverWeightProduct) {
        $errorMsgEle = $(".shippinginfo__method-error");
        $errorMsgEle.addClass("carrier-error");
        if (ispartiallyValidAddress) {
          if ($errorMsgEle) {
            $errorMsgEle.show();
            methodOfShippingOtherMethods();
            ispartiallyValidAddress = true;
          }
        }
      }
    }
    $domEle = $(".guest__shipping-name");
    if ($domEle.length) {
      $domEle.attr("data-guestAddrValid", true);
    }
  });
}

/**
 *
 * For guest user, for checking whether continue btn is already clicked or not
 * @returns {boolean} - true if continue btn is already clicked
 *                    - false if continue btn is not clicked
 */
function isGuestAddressValidated() {
  const $domEle = $(".guest__shipping-name");
  if ($domEle.length) {
    if ($domEle.attr("data-guestAddrValid")) {
      return true;
    }
    return false;
  }
}
/**
 * For loggedin user, for marking the selected address
 * @param {String} addrId
 */
function markElementFromAddrId(addrId) {
  let addresses = $("input[name='selectedAddress']");
  for (let addr of addresses) {
    if ($(addr).attr("data-addid") == addrId) {
      $(addr).attr("checked", true);
    }
  }
}
/**
 * For edit save flow
 */
function validateAddrBeforeSaving() {
  let country = $("#editNewShippingAddressCountry").val();
  if (country === "US") {
    // validateAndDisplayPopup(editAddrInfo,"edit_save","");
    displayValidationPopupEditSave();
  } else {
    saveData();
  }
}
// to change the address on popup after selecting recommended address
function editSaveOnCnfBtn($btnConf) {
  $btnConf.on("click", function () {
    if ($('input[name="oriRecAddr"]:checked').val() === "recAddr") {
      let adl1 =
        recommendedAddress.line1 !== "" &&
        recommendedAddress.line1 !== undefined
          ? recommendedAddress.line1
          : $("#editNewShippingAddressAddressLine1").val();

      let adl2 =
        recommendedAddress.line2 !== "" &&
        recommendedAddress.line2 !== undefined
          ? recommendedAddress.line2
          : "";

      let city =
        recommendedAddress.city !== "" && recommendedAddress.city !== undefined
          ? recommendedAddress.city
          : $("#editShippingAddressCity").val();
      let postalCode =
        recommendedAddress.postalCode !== "" &&
        recommendedAddress.postalCode !== undefined
          ? recommendedAddress.postalCode
          : $("#editShippingAddressZip").val();
      let country =
        recommendedAddress.country !== "" &&
        recommendedAddress.country !== undefined
          ? recommendedAddress.country
          : $("#editNewShippingAddressCountry").val();
      let state =
        recommendedAddress.region !== "" &&
        recommendedAddress.region !== undefined
          ? recommendedAddress.region
          : $("#editAddressShippingState").val();
      $("#editShippingAddressPopup").modal("show");
      $("#editNewShippingAddressAddressLine1").val(adl1);
      $("#editShippingAddressLine2").val(adl2);
      $("#editShippingAddressCity").val(city);
      $("#editShippingAddressZip").val(postalCode);
      $("#editNewShippingAddressCountry").val(country).change();
      $("#editAddressShippingState").val(state).change();
    }
    $(".shipping-information").addClass("addr-validation-overflow");
  });
}

/*
  End
*/

//method of shipping

var returnIndex;
function getDeliveryEstimationsForRegUsers(defaultShippingAddressId) {
  $(".shipping-ul").html("");
  $(".shippinginfo__method-error").hide();
  $.ajax({
    type: $.fn.getAPIEndpoint().requestType.POST,
    url: $.fn.getAPIEndpoint().GET_DELIVERY_OPTIONS,
    data: {
      CTCustomerToken: window.isCustomerToken(),
      transitTimeRequired: true,
      addressId: defaultShippingAddressId,
      bearertoken: window.getbearerToken()
    },
    success: function (shippingMethodRespose, statuscode, xhr) {
      if (shippingMethodRespose != null && shippingMethodRespose != "") {
        if (shippingMethodRespose.statusCode == 500) {
          if (
            shippingMethodRespose.errors[0].code === "CARRIER_PROCESSING_ERROR"
          ) {
            ispartiallyValidAddress = true;
          } else {
            ispartiallyValidAddress = false;
          }
        }
        if (
          xhr.status == 200 &&
          shippingMethodRespose.statusCode != 401 &&
          shippingMethodRespose.statusCode != 400
        ) {
          DomBuildforFededUpsMethod(shippingMethodRespose);
        } else if (
          shippingMethodRespose.errors[0].code === "OVERWEIGHT" ||
          shippingMethodRespose.errors[0].code === "OVERSIZED" ||
          shippingMethodRespose.errors[0].code === "ZEROWEIGHT"
        ) {
          //display a message if CT response from
          isOverWeightProduct = true;
          $errorMsgEle = $(".shippinginfo__method-error");
          if ($errorMsgEle) {
            $errorMsgEle.show();
            methodOfShippingOtherMethods();
          }
        } else {
          isOverWeightProduct = false;
        }
      }
    },
    error: function (error) {
      window.errorModule.showErrorPopup(error);
    }
  });
}
// ajaxcall for card update after add and minus
function checkoutPageCardUpdate(event) {
  tvalue = getCustomerTokenFromCookie();
  var qunatity;
  let isCustomLineItem = $(event).attr("data-isitemcustom");
  if ($(event).hasClass("qty_num")) {
    var qunatity = $(event).val();
    lineItemId = $(event).attr("data-lineItemId");
  } else {
    var qunatity = $(event).siblings(".qty_num").val();
    lineItemId = $(event).siblings(".qty_num").attr("data-lineItemId");
  }
  var loggedInUser = $(".logged-in-user").hasClass("tokenActive");
  $.ajax({
    url: $.fn.getAPIEndpoint().UPDATE_CART,
    data:
      loggedInUser == true
        ? {
            CTCustomerToken: window.isCustomerToken(),
            bearerToken: window.getbearerToken(),
            qnty: qunatity,
            id: lineItemId,
            isCustomLineItem: isCustomLineItem
          }
        : {
            CTCustomerToken: window.isCustomerToken(),
            qnty: qunatity,
            bearerToken: window.getbearerToken(),
            id: lineItemId,
            isCustomLineItem: isCustomLineItem
          },
    success: function (cartUpdateResponse, textstatus, xhr) {
      if (cartUpdateResponse != null && cartUpdateResponse != "") {
        // Remove Diable button for Plus and Minius Button
        $(event)
          .parent()
          .find(".cart-qty-plus, .cart-qty-minus")
          .removeClass("curser__none");
        $(event).parent().find(".loader__dots").addClass("d-none");

        if (
          xhr.status == 200 &&
          cartUpdateResponse.statusCode !== 404 &&
          cartUpdateResponse.statusCode !== 401
        ) {
          let shipping = $("input[name='method-of-shipping']:checked").val();
          if ($(".logged-in-user").hasClass("tokenActive")) {
            let selectedAddress = getSelectedAddressId();
            defaultShippingAddressId = selectedAddress;
            if (shipping == "PCKUP") methodOfShippingUseYourShippingAcc();
            else methodOfShippingOtherMethods();
          } else {
            if (shipAddressEntered == true) {
              $("#ShippingZip").trigger("focusout");
              if (shipping == "PCKUP") methodOfShippingUseYourShippingAcc();
              else methodOfShippingOtherMethods();
            } else {
              totalsumGuest(event);
            }
          }
        }
      }
    },
    error: function (error) {
      window.errorModule.showErrorPopup(error);
    }
  });
}

$("#addNewShippingAddressPopup .saveShippingAddressBtn").on(
  "click",
  function () {
    var status = validateNewShippingAddress();
    var e = $("#addNewShippingAddressCountry");
    var optionCountry = $("#addNewShippingAddressCountry").val();
    var i = $("#addNewShippingState");
    var optionState = $("#addNewShippingState :selected").val();
    var name = $("#addNewShippingAddressName").val();
    var company = $("#addNewShippingAddressCompany").val();
    var phoneNumber = $("#addNewShippingAddressPhoneNumber").val();
    var addressOne = $("#addNewShippingAddressAddressLine1").val();
    var addressTwo = $("#addNewShippingAddressPopup")
      .find("#addShippingAddressLine2")
      .val();
    var zipcode = $("#addNewShippingAddressZip").val();
    var state = $("#ShippingState").val();
    var cityName = $("#addNewShippingAddressCity").val();
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
          addressType: "shipping",
          name: name,
          company: company,
          country: optionCountry,
          phone: phoneNumber,
          addressOne: addressOne,
          addressTwo: addressTwo,
          zipcode: zipcode,
          state: optionState,
          city: cityName,
          defaultAddress: "false",
          accessToken: window.isCustomerToken(),
          bearerToken: window.getbearerToken()
        },
        dataType: "json",
        success: function (data) {
          if (data.statusCode == "200") {
            let text = {
              customertoken: data.customertoken,
              customer: JSON.parse(data.response)
            };
            document.cookie =
              "customerInfo=" + JSON.stringify(text) + ";path=/;";
            $("#successfullyAdded").modal("show");
            $("#addNewShippingAddressPopup").modal("hide");
            getAddressfrmCookie();
            $("#addformid")[0].reset();
          } else {
            alert("Unable to Add a Address, Please try again after sometime");
            $("#addNewShippingAddressPopup").modal("hide");
          }
        },
        error: function (error) {
          alert("Unable to Add a Address, Please try again after sometime");
          $("#addNewShippingAddressPopup").modal("hide");
        }
      });
    } else {
      if (status == undefined) {
        $("#addNewShippingAddressPopup").modal("show");
      } else {
        $("#duplicateAddnewAddress").modal("show");
        $("#addNewShippingAddressPopup").modal("hide");
      }
    }
  }
);

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

function validateNewShippingAddress() {
  var flag;
  var flagName = formValidationCheck.validateEditShippingName();
  var flagPhone = formValidationCheck.validateEditShippingPhoneNumber();
  var flagAddress = formValidationCheck.validateEditShippingAddress();
  var flagCountry = formValidationCheck.countryEditShippingInfoAddress();
  var flagCity = formValidationCheck.validateEditShippingInfoCityName();
  var flagState = formValidationCheck.stateEditShippingInfoAddress();
  var flagZipcode = formValidationCheck.validateEditShippingInfoZipCode();
  var flagAddresstwo = formValidationCheck.validateAddShippingAddressLinetwo();
  var flagCompany = formValidationCheck.validateAddNewShippingAddressCompany();
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

function checkOutaddplus(event) {
  // Disable plus button for process update call
  $(event)
    .parent()
    .find(".cart-qty-plus, .cart-qty-minus")
    .addClass("curser__none");
  $(event).parent().find(".loader__dots").removeClass("d-none");

  var amount = Number($(event).siblings(".qty_num").val());
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
  // Disable plus button for process update call
  $(event)
    .parent()
    .find(".cart-qty-plus, .cart-qty-minus")
    .addClass("curser__none");
  $(event).parent().find(".loader__dots").removeClass("d-none");
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
function checkOutaddSummaryKey(event) {
  amtValonKey = $(event).val();
}
function addSummaryCheckout(event) {
  $(event)
    .parent()
    .find(".cart-qty-plus, .cart-qty-minus")
    .addClass("curser__none");
  $(event).parent().find(".loader__dots").removeClass("d-none");
  var amount = Number($(event).val());
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
  checkoutPageCardUpdate(event);
}
function totalsumGuest(event) {
  var getCurCard = $(event)
    .parents(".single_product_details")
    .parent(".card_box");
  var elem = getCurCard.attr("class");
  addTotalSummary = [];
  var curSibSum = 0.0;
  var tlength = document.getElementsByClassName("single_product_total_amount");
  for (var i = 0; i < tlength.length; i++) {
    var curSum = tlength[i].getAttribute("data-totalpriceval");
    curSibSum += parseFloat(curSum);
  }
  curSibSum = curSibSum.toFixed(2);
  $("#subtotal").text("$" + curSibSum);
  $("#totalBeforeTax").text("$" + curSibSum);
  $("#total_amount").text("$" + curSibSum);
}
function closeDeleteCancel() {
  $("#deleteConfirm").hide();
  $("#editShippingAddressPopup").removeAttr("style");
}
function closeDeleteDuplicate() {
  $("#duplicatedAddress").hide();
}

/*** Removing Line item from Cart*/
function removeLineItem(event) {
  let crtLineItemId = $(event).attr("data-lineItem-id");
  let isCustomLineItem = $(event).attr("data-isitemcustom");

  $.ajax({
    url: "/bin/removeproduct",
    data: {
      CTCustomerToken: window.isCustomerToken(),
      bearerToken: window.getbearerToken(),
      id: crtLineItemId,
      isCustomLineItem: isCustomLineItem
    },
    success: function (result) {
      //window.errorModule.checkError(result);
      if (result.statusCode == undefined || result.statusCode == 200) {
        commonUtility().redirectToEmptyShoppingCartWithNoItemsInCard(result);
        orderSummaryDOM(result);
        // Update MiniCart
        $(document).trigger(
          $.fn.getAPIEndpoint().customEvent.SHOPPING_CART_RESPONSE,
          result
        );
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
          removecartDataLayer(productDetailsFinalArray, "shipping-information");
        }
      }
    },
    error: function (error) {
      window.errorModule.showErrorPopup(error);
    }
  });
}

//algolio image url
function algoliaimageurllist() {
  //reading sku image
  setTimeout(function () {
    $(".algoli_img").each(function () {
      var curImg = $(this).attr("data-sku-img");
      $(this).find(".itemImg").attr("src", curImg);
    });
    $(".sku_colr").each(function () {
      var curColr = $(this).attr("algolio_color");
      $(this).text(curColr);
    });
    $(".sku_color_wrapper").each(function () {
      if ($(this).find(".sku_colr").text() !== "")
        $(this).removeClass("d-none");
    });
  }, 1000);
}
let isDefaultAdd, addId;
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
    let companyName = item.company !== "NA" ? item.company : "";
    let streetName = item.streetName !== "NA" ? item.streetName : "";
    var editEmail = $("#contactInfoEmail").val();
    $("#editNewShippingAddressName").val(shipp_fname);
    $("#editNewShippingAddressCompany").val(companyName);
    $("#editNewShippingAddressPhoneNumber").val(item.phone);
    $("#editNewShippingAddressAddressLine1").val(item.streetNumber);
    $("#editShippingAddressLine2").val(streetName);
    $("#editShippingAddressCity").val(item.city);
    $("#editShippingAddressZip").val(item.postalCode);
    $("#editNewShippingAddressEmail").val(editEmail);
    $("#editNewShippingAddressName").attr("data-editID", addId);
    $("#editNewShippingAddressCountry").val(item.country).change();
    $("#editAddressShippingState").val(item.state).change();
  }

  $(".deleteShippingAddressBtn").removeAttr("disabled");
  if (isDefaultAdd == "true") {
    $(".deleteShippingAddressBtn").attr("disabled", "disabled");
    $(".deleteShippingAddressBtn").css("color", "#879096");
  } else {
    $(".deleteShippingAddressBtn").removeAttr("disabled");
    $(".deleteShippingAddressBtn").css("color", "#d83a22");
  }
  $(".deleteShippingAddressBtn").attr("data-isDefaultAdd", isDefaultAdd);
}
function saveData() {
  $("#editShippingAddressPopup")
    .find("#editNewShippingAddressName")
    .removeAttr("data-isValidated");
  var saveResponse = [];
  var datas = {};
  var type = "billing";
  var item;
  var editAddressforSave = {};
  editAddressforSave.name = $("#editNewShippingAddressName").val();
  editAddressforSave.company = $("#editNewShippingAddressCompany").val();
  editAddressforSave.country = $("#editNewShippingAddressCountry").val();
  editAddressforSave.line1 = $("#editNewShippingAddressAddressLine1").val();
  editAddressforSave.line2 = $("#editShippingAddressLine2").val();
  editAddressforSave.zipcode = $("#editShippingAddressZip").val();
  editAddressforSave.state = $("#editAddressShippingState").val();
  editAddressforSave.phone = $("#editNewShippingAddressPhoneNumber").val();
  editAddressforSave.city = $("#editShippingAddressCity").val();
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
  var curEditId = $("#editShippingAddressPopup")
    .find("#editNewShippingAddressName")
    .attr("data-editid");
  $.each(address, function (index, item) {
    if (item.streetNumber == editAddressforSave.line1) var dline1 = true;
    if (item.streetName == editAddressforSave.line2) var dline2 = true;
    if (item.phone == editAddressforSave.phone) var dphone = true;
    if (item.postalCode == editAddressforSave.zipcode) var dpostalcode = true;
    if (dline1 && dline2 && dphone && dpostalcode) {
      if (item.addressId == curEditId) isDuplicate = false;
      else isDuplicate = true;
    }
  });
  if (isDuplicate == false) {
    $.ajax({
      type: $.fn.getAPIEndpoint().requestType.POST,
      url: $.fn.getAPIEndpoint().UPDATE_ADDRESS,
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
              let text = {
                customertoken: getCustomerTokenFromCookie(),
                customer: JSON.parse(updateAddress.response)
              };
              customerInfo = "";
              document.cookie =
                "customerInfo=" + JSON.stringify(text) + ";path=/;";
            }
            $("#editShippingAddressPopup").modal("hide");
            $("#successFullySaved").modal("show");
            $("#successFullySaved").on(
              "click.dismiss.bs.modal",
              '[data-dismiss="modal"]',
              function () {
                getAddressfrmCookie();
                //validateAddressAPIcallRegisteredUser();
              }
            );
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

function editShippingAddressPopup() {
  $("#editNewShippingAddressNameMsg").text("");
  $("#editNewShippingAddressPhoneNumberMsg").text("");
  $("#editNewShippingAddressAddressLine1Msg").text("");
  $("#editNewShippingAddressCountryMsg").text("");
  $("#editShippingAddressCityMsg").text("");
  $("#editAddressShippingStateMsg").text("");
  $("#editShippingAddressZipMsg").text("");
  $("#editNewShippingAddressEmailMsg").text("");
}
function clearAddShippingAddressError() {
  $("#addNewShippingAddressNameMsg").text("");
  $("#addNewShippingAddressPhoneNumberMsg").text("");
  $("#addNewShippingAddressCountryMsg").text("");
  $("#addNewShippingAddressAddressLine1Msg").text("");
  $("#addNewShippingAddressCityMsg").text("");
  $("#addNewShippingStateMsg").text("");
  $("#addNewShippingAddressZipMsg").text("");
  $("#addShippingAddressLine2Msg").text("");
}
let confirmPopupOK = false;
function confirmDeleteAddress() {
  confirmPopupOK = true;
  $("#deleteConfirm").modal("hide");
  $("#deleteConfirm").hide();
  deleteEditAddress();
}
//deleteaddress call

function deleteEditAddress(event) {
  let isDefault = $(event).attr("data-isdefaultadd");
  if (isDefault == "true") {
    alert("Default address can not be deleted.");
    $("#shippingAddressModal").modal("hide");
  } else {
    if (confirmPopupOK != true) {
      $("#deleteConfirm").show();
      $("#deleteConfirm").modal("show");
    } else {
      $.ajax({
        type: "POST",
        url: "/bin/deleteAddress.json",
        data: {
          accessToken: window.isCustomerToken(),
          addressId: addId,
          bearertoken: window.getbearerToken()
        },
        success: function (deleteAddrResponse, statuscode, xhr) {
          if (deleteAddrResponse != null && deleteAddrResponse != "") {
            if (
              xhr.status == 200 &&
              deleteAddrResponse.statusCode != 401 &&
              deleteAddrResponse.statusCode != 400
            ) {
              if (deleteAddrResponse.statusCode == "200") {
                let text = {
                  customertoken: getCustomerTokenFromCookie(),
                  customer: JSON.parse(deleteAddrResponse.response)
                };
                customerInfo = "";
                document.cookie =
                  "customerInfo=" + JSON.stringify(text) + ";path=/;";
              }
              setTimeout(function () {
                confirmPopupOK = false;
                $("#successfullyDeleted").modal("show");
                $("#editShippingAddressPopup").css("padding-right", "");
                $("#successfullyDeleted").css("padding-right", "");
                $("#editShippingAddressPopup").css("overflow-y", "hidden");
                $("#successfullyDeleted").on(
                  "click.dismiss.bs.modal",
                  '[data-dismiss="modal"]',
                  function () {
                    $("#editShippingAddressPopup").modal("hide");
                    $("#editShippingAddressPopup").removeAttr("style");
                    getAddressfrmCookie();
                  }
                );
              }, 10);
            }
          }
        }
      });
    }
  }
}

function getAddressfrmCookie() {
  var slectedState = "";
  var response = getShippingAddCookie("customerInfo");
  var parsedresponse = JSON.parse(response);
  defaultShippingAddressId = parsedresponse.customer.defaultShippingAddressId;
  var customerPhone;
  var curCookieData = parsedresponse.customer;
  $(".other-address").html("");
  const shippingAddressIds = curCookieData.shippingAddressIds;
  const shippingAddressFilter = curCookieData.addresses.filter(function (
    address
  ) {
    return shippingAddressIds.includes(address.id);
  });
  if (shippingAddressFilter.length <= 1) {
    $("#otherAddressAccordion").hide();
    $(".add-new-address").addClass("mt-4");
  } else {
    $("#otherAddressAccordion").show();
    $(".add-new-address").removeClass("mt-4");
  }
  $.each(shippingAddressFilter, function (index, item) {
    if (defaultShippingAddressId === item.id) {
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
      selectCountry = item.country;
      let phoneNum;
      let companyName =
        item.company !== undefined && item.company !== "NA" ? item.company : "";
      let streetName =
        item.streetName !== undefined && item.streetName !== "NA"
          ? item.streetName
          : "";
      if (item.country === "US") {
        phoneNum = window.formatPhonetoUS(item.phone);
      } else {
        phoneNum = item.phone;
      }
      $("#default_address").find(".customRadio").val(stateValue);
      $("#default_address").find(".customRadio").data("country", selectCountry);
      $("#default_address").find(".customer-name").text(shipp_fname);
      $("#default_address").find(".default-addr__company").text(companyName);
      $("#default_address")
        .find(".default-addr__addr1")
        .text(item.streetNumber);
      $("#default_address").find(".default-addr__addr2").text(streetName);
      if (item.country !== "US" && item.country !== "CA") {
        $("#default_address")
          .find(".default-addr__city-state")
          .text(item.city + ", " + item.postalCode);
      } else {
        $("#default_address")
          .find(".default-addr__city-state")
          .text(item.city + ", " + item.state + " " + item.postalCode);
      }
      $("#default_address").find(".default-addr__country").text(item.country);
      $("#default_address").find(".default-addr__phone").text(phoneNum);

      $("#default_address").find(".EditShippingInfo").text("Edit");
      $("#default_address").find(".EditShippingInfo").attr("data-edit", index);
      $("#default_address")
        .find(".EditShippingInfo")
        .attr("data-isdefault", true);
      $("#default_address")
        .find(".EditShippingInfo")
        .attr("data-addressId", item.id);
      $("#default_address")
        .find("> #customRadio")
        .attr("data-country", item.country);
      $("#default_address").find("> #customRadio").attr("value", item.state);
      $("#default_address").find("> #customRadio").attr("data-addid", item.id);
      customerPhone = item.phone;
    } else if (defaultShippingAddressId !== item.id) {
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
      let phoneNum = "";
      let companyName =
        item.company !== undefined && item.company !== "NA" ? item.company : "";
      let streetNumber =
        item.streetNumber !== undefined ? item.streetNumber : "";
      let streetName =
        item.streetName !== undefined && item.streetName !== "NA"
          ? item.streetName
          : "";
      let city = item.city !== undefined ? item.city : "";
      let state =
        item.state !== undefined && item.state !== "NA" ? item.state : "";
      let postalCode = item.postalCode !== undefined ? item.postalCode : "";
      let country = item.country !== undefined ? item.country : "";
      if (item.country === "US") {
        phoneNum = window.formatPhonetoUS(item.phone);
      } else {
        phoneNum = item.phone;
      }
      var otherAddress_container = $(".other-address");
      var populateAddresss =
        '<div class="custom-control custom-radio col-lg-4 mb-4 other-shipping-address"><input type="radio" class="custom-control-input customRadio other-address-radio" id="customRadio' +
        index +
        '" name="selectedAddress" data-addId="' +
        item.id +
        '" value="' +
        stateValue +
        '" data-country="' +
        selectCountry +
        '" onclick="stateInfo(this)"><label class="form-check-label custom-control-label address-details" for="customRadio' +
        index +
        '"> <p class="other-address__fields other-addr__name">' +
        shipp_fname +
        '</p> <p class="other-address__fields other-addr__company"> ' +
        companyName +
        '</p> <p class="other-address__fields other-addr__addr1"> ' +
        streetNumber +
        '</p> <p class="other-address__fields other-addr__addr2"> ' +
        streetName +
        '</p> <p class="other-address__fields other-addr__city-state"> ' +
        city +
        ", " +
        state +
        " " +
        postalCode +
        '</p> <p class="other-address__fields other-addr__country"> ' +
        country +
        '</p> <p class="other-address__fields customer-phone"> ' +
        phoneNum +
        '</p> </label><div class="edit-existing-shipping-address"><a href="#" class="EditShippingInfo link__disabled" aria-label="Edit shipping information" data-toggle="modal" data-edit="' +
        index +
        '" data-isdefault="false" data-addressId="' +
        item.id +
        '" data-target="#editShippingAddressPopup" onclick="editAddress(this)">Edit</a></div></div>';
      otherAddress_container.append(populateAddresss);
    }
  });
  email = curCookieData.email;
  $(".contactInfo #contactInfoEmail").val(email);
  cookiphoneNumber = customerPhone.replace(/\s/g, "");
  $(".contactInfo #contactInfoPhoneNumber").val(cookiphoneNumber);
}

//getting address values from cookie
function getShippingAddCookie(name) {
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

function continueCTAcall() {
  var jsonData = new Object();
  var jsonDataGuesUeser = new Object();
  var shippingAddress = {};
  var shippingMethod = {};
  var finalDestinationAddress = {};
  var shippingAddressGuestUser = {};
  var instructions = $("#form-special").val();
  var taxExempNumber = $("#taxNumber").val();
  var shipping = $("input[name='method-of-shipping']:checked").val();
  var shipping_mos = $("#select-box-account")
    .find(":selected")
    .attr("data-mos");
  var mshipAccNo = $("#carrier-acc-number").val();
  var UYSAcarrier = $("#select-box-account").val();
  shippingAddress.id = getSelectedAddressId();
  var contact;
  if (cookiphoneNumber != "") contact = $("#contactInfoPhoneNumber").val();
  if (email != "") email = email;

  //shippingMethod.method = shipping_mos;
  //shippingMethod.accountNo = mshipAccNo;
  //shippingMethod.carrier = UYSAcarrier;

  if (taxExempNumber != "") taxExempNumber = taxExempNumber;

  var FDDval;
  $(".FDD_radio").each(function () {
    if ($(this).is(":checked") == true) {
      FDDval = $(this).val();
    }
  });

  finalDestinationAddress.state = $("#finalDestinationstate").val();
  finalDestinationAddress.country = $("#finalDestinationCountry").val();
  finalDestinationAddress.line2 = $("#finalDestinationAddress2").val();
  finalDestinationAddress.zipcode = $("#finalDestinationZip").val();
  finalDestinationAddress.line1 = $("#finalDestinationAddress1").val();
  finalDestinationAddress.phone = $("#finalDestinationPhone").val();
  finalDestinationAddress.name = $("#finalDestinationName").val();
  finalDestinationAddress.city = $("#finalDestinationCity").val();
  finalDestinationAddress.company = $("#finalDestinationCompany").val();
  finalDestinationAddress.email = $("#finalDestinationEmail").val();

  var taxApprovedwithNum;
  if ($("#taxNumber").val() != "") {
    taxApprovedwithNum = true;
  } else {
    if ($("#taxApproved").is(":visible")) {
      taxApprovedwithNum = true;
    } else {
      taxApprovedwithNum = false;
    }
  }

  //loggedIN user
  jsonData.isTaxExempt = taxApprovedwithNum;
  jsonData.email = email;
  jsonData.contact = $("#contactInfoPhoneNumber").val();
  jsonData.shippingAddress = shippingAddress;

  if ($(".shippinginfo__method-error").is(":visible")) {
    shippingMethod.carrier = "NOSHIPPING";
    shippingMethod.method = "NOSHIPPING";
    shippingMethod.accountNo = "0";
    jsonDataGuesUeser.shippingMethod = shippingMethod;
    jsonData.shippingMethod = shippingMethod;
  } else {
    shippingMethod.method = shipping_mos;
    shippingMethod.accountNo = mshipAccNo;
    shippingMethod.carrier = UYSAcarrier;
    shippingAddress.id = getSelectedAddressId();
    if (shipping == "PCKUP") {
      jsonData.shippingMethod = shippingMethod;
      jsonDataGuesUeser.shippingMethod = shippingMethod;
    }
  }
  if (FDDval == "yes") {
    jsonData.finalDestinationAddress = finalDestinationAddress;
    jsonDataGuesUeser.finalDestinationAddress = finalDestinationAddress;
  }
  jsonData.instructions = instructions;
  if (taxApprovedwithNum == true) {
    jsonData.taxExemptionNumber = taxExempNumber;
    jsonDataGuesUeser.taxExemptionNumber = taxExempNumber;
  }

  //guest Ueser Payload
  jsonDataGuesUeser.isTaxExempt = taxApprovedwithNum;
  jsonDataGuesUeser.email = $("#ShippingEmail").val();

  shippingAddressGuestUser.name = $("#ShippingName").val();
  shippingAddressGuestUser.company = $("#ShippingCompany").val();
  shippingAddressGuestUser.phone = $("#ShippingphoneNumber").val();
  shippingAddressGuestUser.zipcode = shippingInfoGuestUser.postalCode;
  shippingAddressGuestUser.country = shippingInfoGuestUser.country;
  shippingAddressGuestUser.line1 = shippingInfoGuestUser.line1;
  shippingAddressGuestUser.line2 = shippingInfoGuestUser.line2;
  shippingAddressGuestUser.city = shippingInfoGuestUser.city;
  shippingAddressGuestUser.state = shippingInfoGuestUser.state;

  jsonDataGuesUeser.shippingAddress = shippingAddressGuestUser;
  jsonDataGuesUeser.instructions = instructions;
  var loggedInUser = $(".logged-in-user").hasClass("tokenActive");
  //Optional Values

  // if logged in user then check whether we need to display popup or not
  if (loggedInUser == true) {
    let selAddrId = getSelectedAddressId();
    let selAddrInfo = getAddressInfoFromId(selAddrId);

    if (isValidAddress) {
      if (
        !checkIfAddrIdAlreadyClicked(selAddrId) &&
        selAddrInfo &&
        selAddrInfo.country === "US"
      ) {
        validateAndDisplayPopup(selAddrInfo, "continue", jsonData);
      } else {
        proceedWithCheckout(jsonData);
      }
    } else {
      $("#unknownAddresstype").modal("show");
      $(".shipping-ul").hide();
    }
    //if user not logged in then proceed with checkout payment flow
  } else {
    if (isValidAddress) {
      let guestUserCountry = $(".tokenActive").find("#ShippingCountry").val();
      if (!isGuestAddressValidated() && guestUserCountry === "US") {
        validateAndDisplayPopup(
          jsonDataGuesUeser.shippingAddress,
          "guest_continue",
          jsonDataGuesUeser
        );
      } else {
        shippingInfoGuestUser.name = $(".tokenActive")
          .find("#ShippingName")
          .val();
        shippingInfoGuestUser.company = $(".tokenActive")
          .find("#ShippingCompany")
          .val();
        shippingInfoGuestUser.phone = $(".tokenActive")
          .find("#ShippingphoneNumber")
          .val();
        shippingInfoGuestUser.country = $(".tokenActive")
          .find("#ShippingCountry")
          .val();
        shippingInfoGuestUser.line1 = $(".tokenActive")
          .find("#ShippingAddressLine1")
          .val();
        shippingInfoGuestUser.line2 = $(".tokenActive")
          .find("#ShippingAddressLine2")
          .val();
        shippingInfoGuestUser.city = $(".tokenActive")
          .find("#ShippingCity")
          .val();
        shippingInfoGuestUser.state = $(".tokenActive")
          .find("#ShippingState")
          .val();
        shippingInfoGuestUser.zipcode = $(".tokenActive")
          .find("#ShippingZip")
          .val();
        jsonDataGuesUeser.isTaxExempt = taxApprovedwithNum;
        jsonDataGuesUeser.email = $("#ShippingEmail").val();

        jsonDataGuesUeser.shippingAddress = shippingInfoGuestUser;

        proceedWithCheckout(jsonDataGuesUeser);
      }
    } else {
      $("#unknownAddresstype").modal("show");
      $(".shipping-ul").hide();
    }
  }
}

/**
 * For proceeding to checkout
 * it takes the address JSON information and sends it to the CT API
 * after API responds with success code proceed to payflow-checkout-payment
 * @param {JSON} addressJson - entire address information for checkout
 */
function proceedWithCheckout(addressJson) {
  $.ajax({
    type: $.fn.getAPIEndpoint().requestType.POST,
    url: $.fn.getAPIEndpoint().CHECKOUT_UPDATE_CART,
    data: {
      CTCustomerToken: window.isCustomerToken(),
      jsonData: JSON.stringify(addressJson),
      bearertoken: window.getbearerToken()
    },
    success: function (updateCartResponse, statuscode, xhr) {
      if (updateCartResponse != null && updateCartResponse != "") {
        //window.errorModule.checkError(updateCartResponse);
        if (xhr.status == 200 && updateCartResponse.statusCode != 401) {
          try {
            analyticsCheckoutData();
          } catch (error) {}
          window.location.href = "/content/fm/en/payflow-checkout-payment.html";
        }
      }
    },
    error: function (error) {
      window.errorModule.showErrorPopup(error);
    }
  });
}

/**
 * Analyses validateAddress.guest API
 * Tells whether the address entered by the user is exactly the same as that returned of Avalara API
 * @param {JSON} response - contains either the recommended address or the address matched error code
 * @returns {boolean} - returns true if all fields of address  match
 *                    - returns false if address don't match
 */
function doesAddressMatch(response) {
  if (response?.errors && response?.errors[0].code === "ADDRESS_MATCHED")
    return true;
  return false;
}

function guestUserCArtItem() {
  window.getAPIModule
    .getActiveCart()
    .done(function (response) {
      //window.errorModule.checkError(response);
      if (response && !response.error) {
        //window.errorModule.checkError(response);
        if (response.statusCode == 404 || response.statusCode == 401) {
          window.location.href = "/content/fm/en/shopping-cart-empty.html";
        } else {
          if (response.statusCode !== 401) {
            if (
              response?.lineItems?.length == 0 &&
              response.customLineItems.length == 0
            ) {
              window.location.href = "/content/fm/en/shopping-cart-empty.html";
            } else {
              $(".clear_cart").attr("data-id", response.id);
              $(".clear_cart").attr("data-version", response.version);
              //code for analytic clear cart data tracking
              orderSummaryDOM(response);
            }
          }
        }
      }
    })
    .fail(function (error) {
      window.errorModule.showErrorPopup(error);
    });
}
function orderSummaryDOM(getActiveCart) {
  if (getActiveCart?.errors && getActiveCart?.errors.length) {
    return;
  }
  var viewCardContainer = $(".cartItem_wrapper");
  $(".cartItem_wrapper").html("");
  const totalLineItemsData = [
    ...getActiveCart.lineItems,
    ...getActiveCart.customLineItems
  ];
  let totalLineItems = commonUtility().responseFilter(totalLineItemsData);
  var linItemLength = totalLineItems.length;
  var analyticsbestSellerRank = "";
  var analyticsColor = "";
  var analyticslength = "";
  var analyticscategory = "";
  var analyticsstartingPrice = "";
  var analyticsproductId = "";
  $.each(totalLineItems, function (index, item) {
    var algolio_color;
    var client = algoliasearch(algId, algApi);
    var indexImg = client.initIndex(indexInuse);
    let skuId = commonUtility().getSkuId(item);
    const itemPrice = item?.price?.value || item?.money;
    const itemId = item.id;
    let isItemCustom = "false";
    if (
      typeof item.custom?.fields?.customlength != "undefined" ||
      typeof item.custom?.fields?.sku != "undefined"
    ) {
      isItemCustom = "true";
    }
    if (isItemCustom == "false") {
      indexImg
        .getObjects([skuId], {
          attributesToRetrieve: [
            "name",
            "assets",
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
            $(".sku_img_" + index).attr("data-sku-img", `${getImage(content)}`);
          });

          $(".sku_color_" + index).attr("algolio_color", results[0].color);
          $(".sku_color_" + index).attr("algolio_color", results[0].color);
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
          if (results[0].category != undefined || results[0].category != null) {
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
    }
    lineItemId = item.id;
    var y = item.variant;
    var priceAmt_ch, totalPriceVal_ch, prodName_ch;

    if (item.name.en == undefined) {
      $.each(item.name, function (index, items) {
        prodName_ch = items;
      });
    } else {
      prodName_ch = item.name["en"] || item.name["en-US"];
    }

    priceAmt_ch = (itemPrice.centAmount / 100).toFixed(2);
    totalPriceVal_ch = (item.totalPrice.centAmount / 100).toFixed(2);

    var activeCards = `<div class="row cartItem single_product_details">`;
    activeCards += `<div class="col-lg-3 d-lg-block col-4 col-md-3">`;
    activeCards +=
      `<a href="#" class="sku_img_${index} algoli_img analytics_prod_detail_${index}" aria-label="Product Details" data-analytics-prod-detail><img class="itemImg img-fluid" src="` +
      utilityMessage.dataIMAGE.rfcd_Product_Image +
      `" alt="${item.seoName ? item.seoName : ""} ${brandName} ${
        item.brandSKU ? item.brandSKU : ""
      }" /></a>`;
    activeCards += `<a class="removeItemLink remove_cart_product activeLink" onclick="removeLineItem(this)" data-lineItem-id="${
      item.id
    }" data-isitemcustom="${isItemCustom}" title="remove" href="javascript:void(0)" data-analyticslug="${
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
    activeCards += `<div class="col-lg-9 mb-3 mb-lg-0 col-8  pl-lg-1 p-0""><div class="row"><div class="col-lg-11 pr-lg-0 col-11 itemDescription product_name">`;
    activeCards += `<p class="mt-0">${prodName_ch}</p>`;
    activeCards += `</div></div>`;
    activeCards += `<div class="row quant-section"><div class="col-lg-5 col-md-5">`;
    activeCards += `<div class="itemDetails sku_number"><span>SKU:</span><span> ${skuId}</span></div>`;
    activeCards += `<div class="itemDetails sku_color_wrapper d-none"><span>Color: </span><span class="sku_colr sku_color_${index}"></span></div>`;
    activeCards += `</div>`;
    activeCards += `<div class="cart_quantity_div col-7 col-lg-7"><div class="qty checkout_page"><button class="cart-qty-minus" type="button" onclick="checkOutaddminus(this);" data-isitemcustom="${isItemCustom}"><span class="dec-val"> - </span></button><input type="number" onKeyPress="if(this.value.length==5) return false;" onfocus="checkOutaddSummaryKey(this)"  data-lineItemId="${lineItemId}" class="qty_num checkout__qty__input" name="qty_num" value="${item.quantity}" /><button class="cart-qty-plus" type="button" onclick="checkOutaddplus(this);" data-isitemcustom="${isItemCustom}"><span class="inc-val"> + </span></button><div class="loader__dots d-none"></div></div>`;
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
    //if(item.slug=="WireTransfer_HandlingCharge")activeCards="";
    viewCardContainer.append(activeCards);
  });
  commonUtility().removeClassDnone(".shipping-info-order-summary-details");
  commonUtility().addClassDnone(".loader_wrapper");
  updateOrderSummary(getActiveCart);
  algoliaimageurllist();
  updateQtyOrder();
}
/**
 * updateOrderSummary()'' Update the order summarya after click on plus and minus button
 * @param {Object} response
 */
function updateOrderSummary(response) {
  let orderSummary2;
  orderSummary2 = (response.totalPrice.centAmount / 100).toFixed(2);
  if (response.taxedPrice == "" || response.taxedPrice == undefined) {
    shipp_Etax = "0.00";
  } else {
    shipp_Etax = (response.taxedPrice.totalTax.centAmount / 100).toFixed(2);
  }
  if (response.customLineItems == "" || response.customLineItems == undefined) {
    handlingP = "0.00";
  } else {
    $.each(response.customLineItems, function (index, items) {
      if (items.slug == "WireTransfer_HandlingCharge") {
        handlingP = (items.totalPrice.centAmount / 100).toFixed(2);
      } else if (items == undefined) {
        handlingP = "0.00";
      } else {
        handlingP = "0.00";
      }
    });
  }
  if ($(".logged-in-user").hasClass("tokenActive")) {
    if (response.shippingInfo != undefined) {
      if (response.shippingInfo?.taxedPrice) {
        shipp_val = (
          response.shippingInfo.taxedPrice.totalNet.centAmount / 100
        ).toFixed(2);
      } else {
        shipp_val = "0.00";
      }
    } else {
      shipp_val = "0.00";
    }
  } else {
    if (response.shippingInfo != undefined) {
      shipp_val = (response.shippingInfo.price.centAmount / 100).toFixed(2);
    } else {
      shipp_val = "0.00";
    }
  }
  orderSummaryMarkupUpdate(shipp_val, orderSummary2, shipp_Etax);
}
/**
 * orderSummaryMarkupUpdate() // Update order Summary Markup
 * @param {String} //shipp_val, orderSummary2, shipp_Etax
 */
function orderSummaryMarkupUpdate(shipp_val, orderSummary2, shipp_Etax) {
  $("#shipping_amt").text("$" + window.priceFormate.formateCheckout(shipp_val));
  $("#shipping_amt").attr("data-shipping", shipp_val);
  $("#handling_amt").text("$0.00");
  $("#handling_amt").attr("data-handling", "$0.00");

  $("#subtotal.cart_order_summary_right").text(
    "$" + window.priceFormate.formateCheckout(orderSummary2)
  );
  $("#subtotal.cart_order_summary_right").attr("data-subtotal", orderSummary2);
  $("#totalBeforeTax.cart_order_summary_right").text(
    "$" + window.priceFormate.formateCheckout(orderSummary2)
  );
  $("#totalBeforeTax.cart_order_summary_right").attr(
    "data-tbtax",
    orderSummary2
  );
  $("#estimatedTaxToBeCollected").text(
    "$" + window.priceFormate.formateCheckout(shipp_Etax)
  );
  $("#estimatedTaxToBeCollected").attr("data-eTax", shipp_Etax);
  const tot = $("#totalBeforeTax").attr("data-tbtax"),
    est = $("#estimatedTaxToBeCollected").attr("data-etax"),
    tm = (parseFloat(tot) + parseFloat(est)).toFixed(2);
  $("#total_amount.subtotalValue_checkout").text(
    "$" + window.priceFormate.formateCheckout(tm)
  );
  $("#total_amount.subtotalValue_checkout").attr("data-totalamt" + tm);
  $(".tax-exemption-check-section").css("display", "none");
}
function triggerMethodOfShipping() {
  $(".shipping-ul").html("");
  $(".shippinginfo__method-error").hide();
  var mosGuestuserzipcode = {};
  var address = {};
  address.zipcode = $("#ShippingZip").val();
  address.state = $("#ShippingState").val();
  address.country = $("#ShippingCountry").val();
  mosGuestuserzipcode.transitTimeRequired = "true";
  mosGuestuserzipcode.address = address;
  $.ajax({
    type: $.fn.getAPIEndpoint().requestType.POST,
    url: $.fn.getAPIEndpoint().GET_DELIVERY_OPTIONS_GUEST,
    data: {
      CTCustomerToken: window.isCustomerToken(),
      jsonData: JSON.stringify(mosGuestuserzipcode),
      bearertoken: window.getbearerToken()
    },
    success: function (shippingMethodRespose, statuscode, xhr) {
      if (shippingMethodRespose != null && shippingMethodRespose != "") {
        //window.errorModule.checkError(shippingMethodRespose);
        if (shippingMethodRespose.statusCode == 500) {
          if (
            shippingMethodRespose.errors[0].code === "CARRIER_PROCESSING_ERROR"
          ) {
            ispartiallyValidAddress = true;
          } else {
            ispartiallyValidAddress = false;
          }
        }
        if (
          xhr.status == 200 &&
          shippingMethodRespose.statusCode != 401 &&
          shippingMethodRespose.statusCode != 400
        ) {
          DomBuildforFededUpsMethod(shippingMethodRespose);
          $(".method-shipping-radio").removeAttr("disabled");
        } else if (
          shippingMethodRespose.errors[0].code === "OVERWEIGHT" ||
          shippingMethodRespose.errors[0].code === "OVERSIZED"
        ) {
          isOverWeightProduct = true;
          $errorMsgEle = $(".shippinginfo__method-error");
          if ($errorMsgEle) {
            $errorMsgEle.show();
            methodOfShippingOtherMethods();
          }
        } else {
          isOverWeightProduct = false;
        }
      }
    },
    error: function (error) {
      window.errorModule.showErrorPopup(error);
    }
  });
}

//fedex Ups DOM build
function DomBuildforFededUpsMethod(shippingMethodRespose) {
  $(".shipping-ul").html("");
  const shMethodContainer = $(".shipping-ul");
  let respT = [];
  $.each(shippingMethodRespose, function (index, item) {
    if (index == "FEDEX") {
      if (item.statusCode == undefined) {
        var FEDEXresponse = item.output?.rateReplyDetails;
        $.each(FEDEXresponse, function (index, items) {
          //price format FEDEX
          var displayPrice;
          $.each(items.ratedShipmentDetails, function (index, item) {
            displayPrice = item.totalNetCharge;
          });

          var country_code;
          if ($(".logged-in-user").hasClass("tokenActive")) {
            country_code = $(
              "input.custom-control-input.customRadio[type='radio']:checked"
            ).attr("data-country");
          } else {
            country_code = $("#ShippingCountry").val();
          }
          let fedexResponseObject = shippingMethodTable(
            items.serviceType,
            country_code
          );

          if (fedexResponseObject && Object(fedexResponseObject).length) {
            respT.push({
              ...fedexResponseObject[0],
              displayPrice
            });
          }
        });
      }
    } else {
      if (item.statusCode == undefined) {
        var UPSresponse = item?.RateResponse?.RatedShipment;
        $.each(UPSresponse, function (index, items) {
          var displayPrice = Number(items.TotalCharges?.MonetaryValue);

          items.TimeInTransit?.ServiceSummary?.EstimatedArrival?.Arrival?.Date;

          var country_code;
          if ($(".logged-in-user").hasClass("tokenActive")) {
            country_code = $(
              "input.custom-control-input.customRadio[type='radio']:checked"
            ).attr("data-country");
          } else {
            country_code = $("#ShippingCountry").val();
          }
          let upsResponseObject = shippingMethodTable(
            items.Service.Code,
            country_code
          );

          //method text UPS
          if (upsResponseObject && Object(upsResponseObject).length) {
            respT.push({
              ...upsResponseObject[0],
              displayPrice
            });
          }
        });
      }
    }
  });
  // Bind UI
  let result = respT.reduce(function (arr, o) {
    if (
      !arr[o.method_code] ||
      Number(o.displayPrice) < Number(arr[o.method_code].displayPrice)
    ) {
      arr[o.method_code] = o;
    }
    return arr;
  }, {});
  let indexStart = 0;
  for (var i in result) {
    markupGenerated(result[i], shMethodContainer, indexStart);
    indexStart++;
  }
  var activeMethodLast = `<li class="shipping-li"><div class="custom-control custom-radio"><input type="radio" class="custom-control-input method-shipping-radio UYSA_radio" id="customRadiouy" name="method-of-shipping" value="PCKUP" onclick="activeCheck(this)" /><label class="custom-control-label check-me" for="customRadiouy">Use your shipping account</label></div></li>`;
  shMethodContainer.append(activeMethodLast);
  sortingMOS();
}
/**
 * markup Generated
 * markupGenerated()
 *  @param {Object} response
 *  @param {DOM} shMethodContainer
 * */
function markupGenerated(response, shMethodContainer, index) {
  let activeMethod = `<li class="shipping-li" data-price="${
    response.displayPrice
  }"><div class="custom-control custom-radio"><input type="radio" class="custom-control-input method-shipping-radio" id="customRadiog_ups_${index}" data-acc="ups" data-price="${
    response.displayPrice
  }" data-resCode="${
    response.method_code
  }" name="method-of-shipping" value="${index}" onclick="activeCheck(this)" /><label class="custom-control-label check-me" for="customRadiog_ups_${index}">${
    response.method_text
  } ($${window.priceFormate.formateCheckout(
    response.displayPrice
  )})</label></div></li>`;
  shMethodContainer.append(activeMethod);
}
//activeCheck MOS
function activeCheck(event) {
  $(".shipping-li").removeClass("active");
  $(".method-shipping-radio").removeAttr("disabled");
  if ($(event).is(":checked")) {
    $(event).parents(".shipping-li").addClass("active");
  } else {
    $(event).parents(".shipping-li").removeClass("active");
  }
  var shipping = $("input[name='method-of-shipping']:checked").val();
  if (shipping == "PCKUP") {
    $(".shipping-carrier").css("display", "flex");
  } else {
    $(".shipping-carrier").css("display", "none");
  }
  if ($(".guest-user").hasClass("tokenActive")) {
    if (shipAddressEntered == true) {
      selectionOfMOS();
    } else {
      $(event).prop("checked", false);
      validateShippingaddressGuestUser();
      $(".method-shipping-radio").attr("disabled", "disabled");
      $(".shipping-li").removeClass("active");
    }
  } else {
    selectionOfMOS();
  }
}
//added list style for method of shipping for mobile view
function addListforMobile() {
  $(".shipping-ul .shipping-li").each(function (index, item) {
    if (!$(this).is(":visible")) {
      $(this).addClass("dataDublicate");
      $(".dataDublicate").remove();
    }
  });

  var fullLeng = $(".shipping-ul .shipping-li").length;
  var startPoint = 3;
  $(".shipping-ul li")
    .slice(startPoint, fullLeng - 1)
    .wrapAll("<li><ul id='show-mobile-shipping-method'></ul></li>");
  $("#show-mobile-shipping-method").after(
    '<li class="shipping-li" id="show-more-option-mobile"><span><i class="fa fa-chevron-down"></i> More Shipping Options</span></li>'
  );
}
//selection of methodof shipping options
function selectionOfMOS() {
  var shippingGuest = $(".UYSA_radio").is(":checked");
  if (shippingGuest == true) {
    //guest user method of shipping
    methodOfShippingUseYourShippingAcc();
  } else {
    //guest user method of shipping
    methodOfShippingOtherMethods();
  }
}

//shipping method table info
function shippingMethodTable(shippDesc, country_code) {
  var t = FedexUpsInfo.response;
  var res = [];
  if (!(country_code == "US" || country_code == "CA")) country_code = "IN";
  $.each(t, function (index, items) {
    let item = items[country_code];
    res = item.filter((item) => {
      return Object.keys(item).some((key) => item[key].includes(shippDesc));
    });
  });
  if (res.length == 0) return (returnIndex = "");
  return (returnIndex = res);
}
//filtering mos btns
function sortingMOS() {
  commonUtility().removeClassDnone(".shipping-methods-section");
  commonUtility().addClassDnone(".shipping__loader");

  //sorting price
  $(".shipping-ul li")
    .sort(function (a, b) {
      return (
        parseInt($(a).attr("data-price"), 10) -
        parseInt($(b).attr("data-price"), 10)
      );
    })
    .appendTo(".shipping-ul");
  //default click
  setTimeout(function () {
    $(".shipping-ul li").each(function (index, item) {
      if ($(this).is(":visible")) {
        $(this).find(".method-shipping-radio")[0].click();
        return false;
      }
    });
    //method of shipping design changes for mobile view
    addListforMobile();
    $("#show-more-option-mobile").on("click", function () {
      $("#show-mobile-shipping-method").show();
      $("#show-more-option-mobile").hide();
    });
    //UYSA_methodofshipping dynamic content
    let country_code;
    if ($(".logged-in-user").hasClass("tokenActive")) {
      country_code = $(
        "input.custom-control-input.customRadio[type='radio']:checked"
      ).attr("data-country");
    } else {
      country_code = $("#ShippingCountry").val();
    }
    let useYouraccount = UYSA_methodofshipping.response;

    if (useYouraccount != null && useYouraccount != undefined) {
      let responseData = [];
      if (!(country_code == "US" || country_code == "CA")) country_code = "IN";
      $("#select-box-account").find("option:not(:first)").remove();
      $.each(useYouraccount, function (index, items) {
        let itemCount = items[country_code];
        $.each(itemCount, function (index, item) {
          $("#select-box-account").append(
            '<option data-mos="' +
              item.shippingCode +
              '" value="' +
              item.carrier +
              '">' +
              item.shippingDesc +
              "</option>"
          );
        });
      });
    }
  }, 50);
}
var CTDGuestuser = {};
var CTDLoggedinUser = {};
var shipp_val, shipp_Etax, handlingP;
function methodOfShippingOtherMethods() {
  commonUtility().addClassDnone(".shipping__loader");
  commonUtility().removeClassDnone(".shipping-methods-section");

  CTDGuestuser = {};
  var CTDshippingMethod = {};
  var CTDAddress = {};
  var selectedMOS = $("input[name='method-of-shipping']:checked").attr(
    "data-rescode"
  );
  var selectedMOSAmount = $("input[name='method-of-shipping']:checked").attr(
    "data-price"
  );
  var selectedMOScarrier = $("input[name='method-of-shipping']:checked").attr(
    "data-acc"
  );
  var shipping = $("input[name='method-of-shipping']:checked").val();
  CTDAddress.name = $("#ShippingName").val();
  CTDAddress.company = $("#ShippingCompany").val();
  CTDAddress.country = shippingInfoGuestUser.country;
  CTDAddress.line1 = shippingInfoGuestUser.line1;
  CTDAddress.line2 = shippingInfoGuestUser.line2;
  CTDAddress.city = shippingInfoGuestUser.city;
  CTDAddress.state = shippingInfoGuestUser.state;
  CTDAddress.postalCode = shippingInfoGuestUser.postalCode;
  CTDAddress.isDefault = "true";

  CTDGuestuser.shippingAddress = CTDAddress;
  CTDGuestuser.useYourOwnShippingAccount = "false";
  CTDGuestuser.shippingMethod = CTDshippingMethod;

  //registered User
  var shippingAddress = {};
  shippingAddress.addressId = defaultShippingAddressId;
  if (shipping == "PCKUP") {
    CTDLoggedinUser.useYourOwnShippingAccount = "true";
  } else {
    CTDLoggedinUser.useYourOwnShippingAccount = "false";
    CTDLoggedinUser.shippingMethod = CTDshippingMethod;
  }
  if ($(".shippinginfo__method-error").is(":visible")) {
    CTDLoggedinUser.useYourOwnShippingAccount = "false";
    CTDshippingMethod.carrier = "NOSHIPPING";
    CTDshippingMethod.method = "NOSHIPPING";
    CTDshippingMethod.amount = 0;
  } else {
    CTDshippingMethod.carrier = selectedMOScarrier.toUpperCase();
    CTDshippingMethod.method = selectedMOS;
    CTDshippingMethod.amount = selectedMOSAmount;
  }
  CTDLoggedinUser.shippingAddress = shippingAddress;
  var loggedInUser = $(".logged-in-user").hasClass("tokenActive");
  $.ajax({
    type: $.fn.getAPIEndpoint().requestType.POST,
    url: $.fn.getAPIEndpoint().CHECKOUT_CALCULATE_TAX,
    data:
      loggedInUser == true
        ? {
            CTCustomerToken: window.isCustomerToken(),
            jsonData: JSON.stringify(CTDLoggedinUser),
            bearertoken: window.getbearerToken()
          }
        : {
            CTCustomerToken: window.isCustomerToken(),
            jsonData: JSON.stringify(CTDGuestuser),
            bearertoken: window.getbearerToken()
          },
    success: function (calculateTaxGuestUser) {
      //window.errorModule.checkError(calculateTaxGuestUser);
      if (
        calculateTaxGuestUser?.errors &&
        calculateTaxGuestUser?.errors.length
      ) {
        return;
      }
      updateOrderSummary(calculateTaxGuestUser);
      globalCentAmout = calculateTaxGuestUser.taxedPrice.totalTax.centAmount;
      globalCurrentCountry = calculateTaxGuestUser.shippingAddress.country;
      calculateTaxGuestUser.taxedPrice.totalTax.centAmount !== 0 &&
      calculateTaxGuestUser.shippingAddress.country == "US"
        ? $(".tax-exemption-check-section").css("display", "block")
        : $(".tax-exemption-check-section").css("display", "none");
      let finalDestination = $("input[name='declaration']:checked").val();
      if (finalDestination == "undefined" || finalDestination == null) {
        $(".tax-exemption-check-section").css("display", "none");
      }
    },
    error: function (error) {
      window.errorModule.showErrorPopup(error);
    }
  });
}
function methodOfShippingUseYourShippingAcc() {
  delete CTDGuestuser["shippingMethod"];
  delete CTDLoggedinUser["shippingMethod"];
  CTDGuestuser.useYourOwnShippingAccount = "true";
  CTDLoggedinUser.useYourOwnShippingAccount = "true";
  var shippingAddress = {};
  shippingAddress.addressId = defaultShippingAddressId;
  CTDLoggedinUser.shippingAddress = shippingAddress;
  var loggedInUser = $(".logged-in-user").hasClass("tokenActive");
  $(".tax-exemption-check-section").css("display", "none");
  $.ajax({
    type: $.fn.getAPIEndpoint().requestType.POST,
    url: $.fn.getAPIEndpoint().CHECKOUT_CALCULATE_TAX,
    data:
      loggedInUser == true
        ? {
            CTCustomerToken: window.isCustomerToken(),
            jsonData: JSON.stringify(CTDLoggedinUser),
            bearertoken: window.getbearerToken()
          }
        : {
            CTCustomerToken: window.isCustomerToken(),
            jsonData: JSON.stringify(CTDGuestuser),
            bearertoken: window.getbearerToken()
          },
    success: function (calculateTaxUYSAGuestUser, textstatus, xhr) {
      if (
        calculateTaxUYSAGuestUser != null &&
        calculateTaxUYSAGuestUser != ""
      ) {
        //window.errorModule.checkError(calculateTaxUYSAGuestUser);
        if (xhr.status == 200 && calculateTaxUYSAGuestUser.statusCode != 404) {
          orderSummaryDOM(calculateTaxUYSAGuestUser);
          calculateTaxUYSAGuestUser.taxedPrice.totalTax.centAmount !== 0 &&
          calculateTaxUYSAGuestUser.shippingAddress.country == "US"
            ? $(".tax-exemption-check-section").css("display", "block")
            : $(".tax-exemption-check-section").css("display", "none");
        }
      }
    },
    error: function (error) {
      window.errorModule.showErrorPopup(error);
    }
  });
}

document.querySelector("body").addEventListener(
  "click",
  function (e) {
    var buttonElement = e.target.closest("button");
    var label = "";
    var category = "";
    if (
      buttonElement !== null &&
      buttonElement.closest(".analytic-shippingaddressfooter") != null &&
      buttonElement.textContent.trim() == "Cancel"
    ) {
      label = buttonElement.textContent.trim();
      category = "Edit Address-" + currentPageName;
      ctalinkDataLayerCall(label, category);
    }
  },
  false
);

//analytics code to get the data from elements
function analyticsCheckoutData() {
  var pageCategory = "shipping-information";
  itemsArr = [];
  var step = "2";
  var option = "checkout_process_shipping_information";
  var itemsObj = "";
  var items = document.querySelectorAll(".single_product_details");
  var totalBeforeTax = "";
  var estimatedTaxToBeCollected = "";
  var total_amount = "";
  var shippingAndHandling = "";
  var shippingAmt = "";
  var handlingAmt = "";
  if (document.getElementById("subtotal").textContent.trim() != null) {
    totalBeforeTax = document.getElementById("subtotal").textContent.trim();
  }
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
