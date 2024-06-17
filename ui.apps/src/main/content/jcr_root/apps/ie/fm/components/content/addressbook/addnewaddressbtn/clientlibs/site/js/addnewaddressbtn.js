$(document).ready(function () {
  const $component = $(".address__book"),
    myAddressCards = ".my-address-cards",
    cardGridAddress = ".card-grid-address",
    $myAddressCardBilling = $(".my-address-cards.billing"),
    $myAddressCardShipping = $(".my-address-cards.shipping"),
    $editAddressBox = $(".edit_adddress_box");
  var customerId = $.fn.cookiesRead().customerToken() || "",
    countriesData;
  if (customerId != "" && customerId != undefined) {
    const data = {
      accessToken: customerId,
      bearertoken: window.getbearerToken()
    };
    window.getAPIModule
      .getInitialAddress(data)
      .done(function (response) {
        addressFetch(response);
      })
      .fail(function (error) {
        console.error(error);
        window.errorModule.showErrorPopup(error)
      });

    // Country List
    window.getAPIModule
      .getCountryList()
      .done(function (data) {
        countriesData = data;
        const $addModalCountry = $("#addmodalcountry");
        if ($addModalCountry.length) {
          $addModalCountry.countryList(countriesList);
        }
      })
      .fail(function (error) {});
    function addressFetch(data) {
     // window.errorModule.checkError(data);
      if (data.statusCode == "200") {
        let jsonData = data?.response ? JSON.parse(data.response) : [];
        if (!jsonData) {
          return;
        }
        let text = {
          customertoken: data.customertoken,
          customer: jsonData
        };

        document.cookie = "customerInfo=" + JSON.stringify(text) + ";path=/;";
        let billingIds = jsonData.billingAddressIds;
        let shippingIds = jsonData.shippingAddressIds;
        for (var i = 0; i < jsonData.addresses.length; i++) {
          var j = i;

          if (billingIds.indexOf(jsonData.addresses[j].id) > -1) {
            let isDefault =
              jsonData.addresses[j].id == jsonData.defaultBillingAddressId;
            let addressType =
              billingIds.indexOf(jsonData.addresses[j].id) > -1 &&
              shippingIds.indexOf(jsonData.addresses[j].id) > -1
                ? "both"
                : "billing";
            let addressObject = {
              index: i,
              addressType: addressType,
              defaultText: isDefault,
              countryName: window.commonUtility().getCountryNameFromCountryJSON(countriesData,jsonData.addresses[j].country)
            };
            let combineAddressObject = {
              ...jsonData.addresses[j],
              ...addressObject
            };

            $myAddressCardBilling.ieAddressCard(
              $component,
              combineAddressObject
            );
          }
          if (shippingIds.indexOf(jsonData.addresses[j].id) > -1) {
            let isDefault =
              jsonData.addresses[j].id == jsonData.defaultShippingAddressId;
            let addressType =
              billingIds.indexOf(jsonData.addresses[j].id) > -1 &&
              shippingIds.indexOf(jsonData.addresses[j].id) > -1
                ? "both"
                : "shipping";
            let addressObject = {
              index: i + 1,
              addressType: addressType,
              defaultText: isDefault,
              countryName: window.commonUtility().getCountryNameFromCountryJSON(countriesData,jsonData.addresses[j].country)
            };
            let combineAddressObject = {
              ...jsonData.addresses[j],
              ...addressObject
            };

            $myAddressCardShipping.ieAddressCard(
              $component,
              combineAddressObject
            );
          }
        }
        // Wrap card
        var $myAddresscards = $(".my-address-cards");
        if (!$myAddresscards) {
          return;
        }
        $myAddresscards.each(function (index, cards) {
          let $cards = $(cards);
          let $card = $cards.find(".card-grid-address");
          for (let i = 0; i < $card.length; i += 3) {
            $card
              .slice(i, i + 3)
              .wrapAll("<div class='card--grid--row'></div>");
          }
        });

        // Edit User Data
        $(".edit-info").on("click", function () {
          //stateAndCountryDropdown();
          var classList1 = document.getElementsByClassName("card-grid-address");
          for (var element of classList1) {
            element.classList.remove("active-card");
          }
          $(this).parent().addClass("active-card");
          const devicewidthcal = window.matchMedia("(min-width: 768px)");
          if (devicewidthcal.matches) {
            $(this)
              .parents(".card--grid--row")
              .append($(".edit_adddress_box").css("display", "block"));
          } else {
            $editAddressBox.insertAfter($(this).parent());
            $(this)
              .parents(myAddressCards)
              .find(".edit_adddress_box")
              .css("display", "block");
          }
          $(".edit_adddress_box").find(".validation-error").text("");
          let isDefaultAddress = $(this).siblings('.card-title').find('.default-text').length;
          let $parentWrapper = $(this).closest('.card-grid-address');
          $parentWrapper.siblings('.edit_adddress_box').find('.compare-checkbox').prop('checked', false);
          if (isDefaultAddress > 0) {
            $parentWrapper.siblings('.edit_adddress_box').find('#delete_address_btn').attr('disabled', 'disabled');
            $parentWrapper.siblings('.edit_adddress_box').find('.compare-checkbox').attr('disabled', 'disabled');
            $parentWrapper.siblings('.edit_adddress_box').find('.compare-checkbox').prop('checked', true);
          } else {
            $parentWrapper.siblings('.edit_adddress_box').find('#delete_address_btn').removeAttr('disabled');
            $parentWrapper.siblings('.edit_adddress_box').find('.compare-checkbox').removeAttr('disabled');
          }
          stateAndCountryDropdown(
            "addmodalstateUpdate",
            "addmodalcountryUpdate"
          );
          let userData = $(this)
            .parent(cardGridAddress)
            .find(".card-title")
            .data();

          $("#edit_address_bottom")
            .find(".deleteAddress")
            .attr("data-id", userData?.id || "");
          $("#edit_address_bottom")
            .find(".updateAddress")
            .attr("data-id", userData?.id || "");
          $("#edit_address_bottom")
            .find(".updateAddress")
            .attr("data-addressType", userData?.addressType || "");
          $(".edit_adddress_box.arrow--1")
            .find("#editfirstName")
            .val((userData?.firstName || "") +' '+ (userData?.lastName || ""));
          $(".edit_adddress_box.arrow--1")
            .find("#editcompanyname")
            .val(userData?.companyName || "");
          $(".edit_adddress_box.arrow--1")
            .find("#addmodalstateUpdate")
            .val(userData?.country || "");
          $(".edit_adddress_box.arrow--1")
            .find(
              "#addmodalcountryUpdate option[value=" +
                (userData?.country || "") +
                "]"
            )
            .attr("selected", "selected");
          $("#addmodalcountryUpdate").trigger("change");
          $(".edit_adddress_box.arrow--1")
            .find("#addmodalstateUpdate")
            .val(userData?.state || "");
          $(".edit_adddress_box.arrow--1")
            .find(
              "#addmodalstateUpdate option[value=" +
                (userData?.state || "") +
                "]"
            )
            .attr("selected", "selected");
          $(".edit_adddress_box.arrow--1")
            .find("#editcityname")
            .val(userData?.city || "");
          $(".edit_adddress_box.arrow--1")
            .find("#editaddresstwo")
            .val(userData?.addressOne || "");
          $(".edit_adddress_box.arrow--1")
            .find("#editaddressone")
            .val(userData?.addressTwo || "");
          $(".edit_adddress_box.arrow--1")
            .find("#editzipcode")
            .val(userData?.zipCode || "");
          $(".edit_adddress_box.arrow--1")
            .find("#editphonenumber")
            .val(userData?.phone || "");
          //$("#addmodalcountryUpdate").val("United States").attr("selected","selected");
        });

        $(".cancel-mt").on("click", function () {
          var classList1 = document.getElementsByClassName("card-grid-address");
          for (var element of classList1) {
            element.classList.remove("active-card");
          }
          $editAddressBox.css("display", "none");
        });
      }
    }
  }
  const $addressBarPopup = $(".addnewaddress-pop-up"),
    $editAddress = $(".edit_adddress_box");
  $("#addnewaddressbtn").click(function () {
    validateAddaddress($addressBarPopup, "add", "");
  });
  let $myaccCountryCR = $("#addmodalcountryUpdate");
  let $myaccZipCodeCR = $("#editzipcode");

  // Shipping Address
  if ($myaccCountryCR && $myaccZipCodeCR) {
    $myaccCountryCR.on("change", function () {
			formValidation.zipCodeMaxLengthSet(
			  $myaccCountryCR,
			  $myaccZipCodeCR
			);
		  });
      $myaccZipCodeCR.on("keyup", function (e) {
      formValidation.zipCodeValueFormate($myaccCountryCR, e);
    });
  }

  $(".updateAddress").click(function () {
    let addressId = $(this).attr("data-id");
    var addressType = $(this).attr("data-addressType");
    validateAddaddress($editAddress, "update", addressId, addressType);
  });

  $(".deleteAddress").click(function () {
   let addressId = $(this).attr("data-id");
    $.ajax({
      url: "/bin/deleteAddress.json",
      type: "POST",
      data: {
        addressId: addressId,
        accessToken: customerId,
        bearertoken: window.getbearerToken()
      },
      dataType: "json",
      success: function (data) {
        if (data.statusCode == "200") {
          let jsonData = data?.response ? JSON.parse(data.response) : [];
          if (!jsonData) {
            return;
          }
          let text = {
            customertoken: data.customertoken,
            customer: jsonData
          };

          document.cookie = "customerInfo=" + JSON.stringify(text) + ";path=/;";

          $editAddressBox.css("display", "none");
          location.reload();
        } else {
          $editAddressBox.css("display", "none");
        }
      },
      error: function (error) {
        //alert("Cannot Delete Address");
        $editAddressBox.css("display", "none");
      }
    });
  });

  function stateAndCountryDropdown(updateStateId, updateCountryId) {
    $("#" + updateCountryId).empty();
    $("#" + updateStateId).empty();
    var addcountrySel =
      updateCountryId != "" && updateCountryId != undefined
        ? document.getElementById(updateCountryId)
        : document.getElementById("addmodalcountry");
    var addstateSel =
      updateStateId != "" && updateCountryId != undefined
        ? document.getElementById(updateStateId)
        : document.getElementById("addmodalstate");
    if (addcountrySel && addstateSel) {
      for (var x in countriesData) {
        addcountrySel.options[addcountrySel.options.length] = new Option(
          countriesData[x].name,
          countriesData[x].ISO
        );
      }
    }
  }

  $("#addmodalcountryUpdate").on("change", function (event) {
    let $currentEvent = $(event.currentTarget);
    let selectValue = $currentEvent.val();

    //var addcountrySelected = document.getElementById("addmodalcountryUpdate");
    var optionSelIndex = selectValue;
    $("#editzipcode").val("");
    $("#editzipcode").removeAttr("maxlength");
    if (optionSelIndex == "CA") {
      $("#editzipcode").attr("maxlength", "7");
    } else if (optionSelIndex == "US") {
      $("#editzipcode").attr("maxlength", "10");
    } else {
      $("#editzipcode").attr("maxlength", "10");
    }
    $("#addmodalstateUpdate").stateFilter(countriesList, optionSelIndex);
  });

  function validateAddaddress(
    $addressBar,
    operationType,
    addressId,
    addressTypeStatus
  ) {
    var flag = false,
      addressType,
      firstName,
      company,
      addressOne,
      addressTwo,
      cityName,
      ZipCode,
      phone,
      state,
      country,
      updateDefault = $addressBar.find("#default").is(":checked"),
      defaultAddress = $addressBar.find("#defaultid").val(),
      $firstName = $addressBar.find(".first__name"),
      $companyName = $addressBar.find(".company__name"),
      $addressFirstName = $addressBar.find(".address__first--name"),
      $addressSecondName = $addressBar.find(".address__second--name"),
      $cityName = $addressBar.find(".city__name"),
      $zipCode = $addressBar.find(".zip__code"),
      $phoneNumber = $addressBar.find(".phone__number"),
      $stateName = $addressBar.find(".state__name"),
      $countryName = $addressBar.find(".country__name");
    if (operationType === "add") {
      addressType = $addressBar
        .find("input[type='radio'][name='radio-group']:checked")
        .val();
      firstName = $firstName.val();
      company = $companyName.val();
      addressOne = $addressFirstName.val();
      addressTwo = $addressSecondName.val();
      cityName = $cityName.val();
      ZipCode = $zipCode.val();
      phone = $phoneNumber.val();
      state = $stateName.val();
      country = $countryName.val();
    } else {
      addressType = addressTypeStatus;
      firstName = $firstName.val();
      company = $companyName.val();
      addressOne = $addressFirstName.val();
      addressTwo = $addressSecondName.val();
      cityName = $cityName.val();
      ZipCode = $zipCode.val();
      phone = $phoneNumber.val();
      state = $stateName.val();
      country = $countryName.val();
    }

    if (operationType === "add" || operationType === "update") {
      var validateAddressType = formValidation.validateAddressType(addressType);
      var validateName = formValidation.validateAnaFirstName(
        $firstName,
        firstName
      );
      var validateCompany = formValidation.validateAnaPerCompany(
        $companyName,
        company
      );
      var validateAddress1 = formValidation.validateAnaAddressOne(
        $addressFirstName,
        addressOne,
        operationType,
        addressType
      );
      var validateAddress2 = formValidation.validateAnaAddressTwo(
        $addressSecondName,
        addressTwo,
        operationType,
        addressType
      );
      var validateCity = formValidation.validateAnaCityName(
        $cityName,
        cityName
      );
      var validateZipcode = formValidation.validateAnaZipCode(
        $zipCode,
        ZipCode,
        country
      );
      var validatePhoneNumber = formValidation.validateAnaPhoneNumber(
        $phoneNumber,
        phone
      );
      var validateCountry = formValidation.validateCountryaddress(
        $countryName,
        country
      );
      var validateSate = formValidation.validateStatename($stateName, state);
      var defaultAddress = $("#defaultid").is(":checked");
      //var updateDefault = $('#default').is(':checked');
      //var defaultAddress = $("#defaultid").val();
      if (
        validateAddressType &&
        validateName &&
        validateCompany &&
        validateAddress1 &&
        validateAddress2 &&
        validateCity &&
        validateZipcode &&
        validatePhoneNumber &&
        validateCountry &&
        validateSate
      ) {
        flag = true;
      }
    }
     var addressDetails = { 
         "type": addressType,
    	"address": 
            {
        "name": firstName,
        "company": company,
        "country": country,
        "line1": addressOne,
        "line2": addressTwo,
        "zipcode": ZipCode,
        "state": state,
        "city": cityName,
        "phone": phone,
        "isDefault": defaultAddress
    }

     };

    if (flag && operationType == "add") {
      $.ajax({
        url: "/bin/addaddress.json",
        type: "POST",
        data: {
          addressValue: JSON.stringify(addressDetails),
          accessToken: customerId,
          bearertoken: window.getbearerToken()
        },
        dataType: "json",
        success: function (data) {
          if (data.statusCode == "200") {
            let jsonData = data?.response ? JSON.parse(data.response) : [];
            if (!jsonData) {
              return;
            }

            let text = {
              customertoken: data.customertoken,
              customer: jsonData
            };

            document.cookie =
              "customerInfo=" + JSON.stringify(text) + ";path=/;";
            let billingIds =
              jsonData.billingAddressIds != undefined
                ? jsonData.billingAddressIds
                : "";
            let shippingIds =
              jsonData.shippingAddressIds != undefined
                ? jsonData.shippingAddressIds
                : "";
            for (var i = 0; i < jsonData.addresses.length; i++) {
              var j = i;
              if (billingIds.indexOf(jsonData.addresses[j].id) > -1) {
                let isDefault =
                  jsonData.addresses[j].id == jsonData.defaultBillingAddressId;
                let addressType =
                  billingIds.indexOf(jsonData.addresses[j].id) > -1 &&
                  shippingIds.indexOf(jsonData.addresses[j].id) > -1
                    ? "both"
                    : "billing";
                let addressObject = {
                  index: i,
                  addressType: addressType,
                  defaultText: isDefault,
                  countryName: countriesData[jsonData.addresses[j].country]
                };
                let combineAddressObject = {
                  ...jsonData.addresses[j],
                  ...addressObject
                };
                $myAddressCardBilling.ieAddressCard(
                  $component,
                  combineAddressObject
                );
              }
              if (shippingIds.indexOf(jsonData.addresses[j].id) > -1) {
                var isDefault =
                  jsonData.addresses[j].id == jsonData.defaultShippingAddressId;
                var addressType =
                  billingIds.indexOf(jsonData.addresses[j].id) > -1 &&
                  shippingIds.indexOf(jsonData.addresses[j].id) > -1
                    ? "both"
                    : "shipping";
                let addressObject = {
                  index: i,
                  addressType: addressType,
                  defaultText: isDefault,
                  countryName: countriesData[jsonData.addresses[j].country]
                };
                let combineAddressObject = {
                  ...jsonData.addresses[j],
                  ...addressObject
                };
                $myAddressCardShipping.ieAddressCard(
                  $component,
                  combineAddressObject
                );
              }
            }
            //alert("Address added Successfully");
            $("#addnewaddress-popup").hide();
            location.reload();
          } else {
            //alert("Address added Successfully");
            $("#addnewaddress-popup").hide();
            location.reload();
          }
        },
        error: function (error) {
          $("#addnewaddress-popup").hide();
          //alert("Unable to Add a Address, Please try again after sometime");
        }
      });
    } else if (flag && operationType == "update") {
      if (addressType == "both") {
        addressType = "shipping";
      }
      $.ajax({
        url: "/bin/updateNewAddress.json",
        type: "POST",
        data: {
          addressId: addressId,
          addressType: addressType,
          firstName: firstName,
          //"lastName": lastName,
          company: company,
          country: country,
          addressOne: addressOne,
          addressTwo: addressTwo,
          phone: phone,
          zipcode: ZipCode,
          state: state,
          city: cityName,
          defaultAddress: updateDefault,
          accessToken: customerId,
          bearertoken: window.getbearerToken()
        },
        dataType: "json",
        success: function (data) {
          let jsonData = data?.response ? JSON.parse(data.response) : [];
          if (!jsonData) {
            return;
          }
          let text = { customertoken: data.customertoken, customer: jsonData };
          document.cookie = "customerInfo=" + JSON.stringify(text) + ";path=/;";
          if (data.statusCode == "200") {
            let billingIds =
              jsonData.billingAddressIds != undefined
                ? jsonData.billingAddressIds
                : "";
            let shippingIds =
              jsonData.shippingAddressIds != undefined
                ? jsonData.shippingAddressIds
                : "";
            for (var i = 0; i < jsonData.addresses.length; i++) {
              var j = i;
              if (billingIds.indexOf(jsonData.addresses[j].id) > -1) {
                let isDefault =
                  jsonData.addresses[j].id == jsonData.defaultBillingAddressId;
                let addressType =
                  billingIds.indexOf(jsonData.addresses[j].id) > -1 &&
                  shippingIds.indexOf(jsonData.addresses[j].id) > -1
                    ? "both"
                    : "billing";
                let addressObject = {
                  addressType: addressType,
                  defaultText: isDefault,
                  countryName: countriesData[jsonData.addresses[j].country]
                };
                let combineAddressObject = {
                  ...jsonData.addresses[j],
                  ...addressObject
                };
                $myAddressCardBilling.ieAddressCard(
                  $component,
                  combineAddressObject
                );
              }
              if (shippingIds.indexOf(jsonData.addresses[j].id) > -1) {
                let isDefault =
                  jsonData.addresses[j].id == jsonData.defaultShippingAddressId;
                let addressType =
                  billingIds.indexOf(jsonData.addresses[j].id) > -1 &&
                  shippingIds.indexOf(jsonData.addresses[j].id) > -1
                    ? "both"
                    : "shipping";
                let addressObject = {
                  addressType: addressType,
                  defaultText: isDefault,
                  countryName: countriesData[jsonData.addresses[j].country]
                };
                let combineAddressObject = {
                  ...jsonData.addresses[j],
                  ...addressObject
                };
                $myAddressCardShipping.ieAddressCard(
                  $component,
                  combineAddressObject
                );
              }
            }
            // alert("Address updated Successfully");
            $('#AddressSavedModal').modal('show');
            $(".edit_adddress_box.arrow--1").css("display", "none");
           // location.reload();
          } else {
            //alert("Unable Update the Details, Please try after sometine");
            $(".edit_adddress_box.arrow--1").css("display", "none");
          }
        },
        error: function (error) {
          //alert("Unable Update the Details, Please try after sometine");
          $(".edit_adddress_box.arrow--1").css("display", "none");
        }
      });
    } else if (operationType == "add" && flag == false) {
      $("#addnewaddress-popup").show();
    }
  }
  //address-done-cls
  $('.address-done-cls').on('click', function () {
    location.reload();
  });
});
