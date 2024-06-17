$(document).ready(function () {
  const $rmaForm = $(".rma__form");
  var partRow = $('*[name^="fairviewMicrowaveReturnMerchPart"]')
    .closest(".grid-layout-col")
    .closest(".row");
  let countryResponse;
  const $countrySelectorRMAForm = $rmaForm.find("#rfCountry"),
    $stateSelectorRMAForm = $rmaForm.find("#rfState"),
    $zipCodeRMAForm = $rmaForm.find("#rfZipcode");
  $(partRow).hide().first().show();

  var counterForProdRows = 1;

  var placeForButton = $("input[name=rfSignForName]")
    .closest(".layout-col")
    .closest(".row");

  $(
    '<div class="row add-btn-row"><div class="grid-layout-col"><div class="layout-col col-sm-6 col-xs-12"><button id="addButton" >Add more</button></div></div></div>'
  ).insertBefore(placeForButton);

  $("#addButton").on("click", function (e) {
    e.preventDefault();
    $(
      `<div class="row act-prod-row rma-form-skuvalue">
    <div class="grid-layout-col">
      <div class="layout-col col-sm-4 col-xs-12">
      <div class="col-sm-12 col-xs-12 rma-no-desk part-num-ip">
                  <span class="rma-label">Part # </span>
                  <button type="button" class="rma-close" aria-label="Close">
                    <i
                      class="fa-regular fa-xmark font-24"
                      aria-hidden="true"
                    ></i>
                  </button>
                </div>
        <div class="elq-field-style form-element-layout row">
          
          <div class="col-sm-12 col-xs-12">
          
                <div class="field-control-wrapper">
                  <input
                    type="text"
                    class="elq-item-input fm-rma-sku"
                    name="fairviewMicrowaveReturnMerchPart${counterForProdRows}SKU"
                    id="rfPartNum_${counterForProdRows}"
                    value=""
                    style="width: 100%"
                  />
                  <p class="error-inval" id="rfqSKUinval_${counterForProdRows}" for="rfPartNum_${counterForProdRows}"></p>
                </div>
          
          </div>
        </div>
      </div>
    </div>
    <div class="grid-layout-col">
      <div class="layout-col col-sm-2 col-xs-12 rmaf-col-1 rmaf-col-2">
      
      <div style="text-align: left" class="col-sm-12 col-xs-12 rma-no-desk">
                    <span class="rma-label">QTY </span>
                  </div>
        <div class="elq-field-style form-element-layout row">
         
          <div class="col-sm-12 col-xs-12">
         
                <div class="field-control-wrapper">
                  <input
                    type="text"
                    class="elq-item-input fm-rma-qty"
                    name="fairviewMicrowaveReturnMerchPart${counterForProdRows}Qty"
                    id="rfQty_${counterForProdRows}"
                    value=""
                    style="width: 100%"
                  />
                </div>
          
          </div>
        </div>
      </div>
    </div>
    <div class="grid-layout-col">
      <div class="layout-col col-md-5 col-sm-5 col-xs-12 rmaf-col-2">
        <div class="elq-field-style form-element-layout row">
        <div style="text-align: left" class="col-sm-12 col-xs-12 rma-no-desk">
        <span class="rma-label"
          >Detailed reason for returns
        </span>
      </div>
          <div class="col-sm-12 col-xs-12">
           
                <div class="field-control-wrapper">
                  <textarea
                    type="text"
                    class="elq-item-input fm-ror"
                    value=""
                    style="width: 100%"
                    id="fmRor_${counterForProdRows}"
                    name="fmReasonForReturn${counterForProdRows}"
                  ></textarea>
                </div>
           
          </div>
        </div>
      </div>
    </div>
    <div class="grid-layout-col rma-no-mobile">
              <div class="layout-col col-md-1 col-sm-1 col-xs-12 rmaf-col-2">
                <div class="elq-field-style form-element-layout row">
                  <button
                    type="button"
                    class="rma-close"
                  
                    aria-label="Close"
                  >
                    <i
                      class="fa-regular fa-xmark font-24"
                      aria-hidden="true"
                    ></i>
                  </button>
                </div>
              </div>
            </div>  
  </div>`
    ).insertAfter(".act-prod-row:last");

    $("#fmRor_" + counterForProdRows).rules("add", {
      required: true,
      maxlength: 200,
      messages: {
        required: validationMessage.enterReasonForReturns,
        maxlength: validationMessage.maxChar200
      }
    });

    $("#rfQty_" + counterForProdRows).rules("add", {
      required: true,
      maxlength: 5,
      messages: {
        required: validationMessage.enterQuantity,
        maxlength: validationMessage.maxQuantity99999
      }
    });
    $("#rfPartNum_" + counterForProdRows).rules("add", {
      required: true,
      maxlength: 200,
      messages: {
        required: validationMessage.enterPartNumber,
        maxlength: validationMessage.maxChar200
      }
    });
    counterForProdRows++;
  });

  $("#rmafForm").on("click", ".rma-close", function () {
    let currentRow = this;

    $("#myModalRMA").on("show.bs.modal", function () {
      // wire up the OK button to dismiss the modal when shown

      $("#myModalRMA .modal-footer .yes-btn").on("click", function () {
        if ($(".act-prod-row").length === 1) {
          if (
            $(".act-prod-row:first")[0] ==
            $(currentRow).closest(".act-prod-row")[0]
          ) {
            $(".act-prod-row:first").find("input:eq(0)").val("");
            $(".act-prod-row:first").find("input:eq(1)").val("");
            $(".act-prod-row:first").find("textarea").val("");
          }
        } else {
          $(currentRow).closest(".act-prod-row").remove();
        }
        // just as an example...
        $("#myModalRMA").modal("hide"); // dismiss the dialog

        currentRow = null;
      });
      $("#myModalRMA .modal-footer .no-btn").on("click", function () {
        $("#myModalRMA").modal("hide"); // dismiss the dialog
        currentRow = null;
      });
    });

    $("#myModalRMA").modal({
      // wire up the actual modal functionality and show the dialog
      backdrop: "static",
      keyboard: true,
      show: true // ensure the modal is shown immediately
    });
  });

  $.validator.methods.email = function (value, element) {
    return (
      this.optional(element) ||
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)
    );
  };

  $.validator.methods.phoneUS = function (value, element) {
    return (
      this.optional(element) ||
      /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value)
    );
  };

  

  $.validator.methods.firstName = function (value, element) {
    let regName = regexPattern.NAME;
    return (
      this.optional(element) ||
      !regName.test(value)
    );
  };

  $.validator.methods.Address1 = function (value, element) {
    let regName = regexPattern.ADDRESS;
    return (
      this.optional(element) ||
      !regName.test(value)
    );
  };

  $.validator.methods.Zipcode = function (value, element) {
    const selectedCountry = $countrySelectorRMAForm.val();
    let rePattern = "";
    if (selectedCountry === "US") {
      rePattern = regexPattern.ZIP_CODE.US;
    } else if (selectedCountry === "CA") {
      rePattern = regexPattern.ZIP_CODE.CA;
    } else {
      rePattern = regexPattern.ZIP_CODE.OTHER;
    }
    return this.optional(element) || rePattern.test(value);
  };

  function setDate() {
    let now = new Date();
    let day = ("0" + now.getDate()).slice(-2);
    let month = ("0" + (now.getMonth() + 1)).slice(-2);
    let today = now.getFullYear() + "-" + month + "-" + day;
    $("#rfDate").val(today);
  }
  setDate();

  let hasUtilityMessage = window.utilityMessage ? window.utilityMessage : {};

  let validationMessage = hasUtilityMessage.messages;

  $("form[name=FairviewMicrowaveRMA]").validate({
    rules: {
      FirstName: {
        required: true,
        maxlength: 30,
        firstName:true
      },
      LastName: {
        required: true,
        maxlength: 30,
        firstName:true
      },
      Company: {
        required: false,
        maxlength: 40
      },
      Title: {
        required: true,
        maxlength: 30
      },
      EmailAddress: {
        required: true,
        email: true
      },
      BusinessPhone: {
        required: true,
        maxlength: 20,
        phoneUS: true
      },
      Address1: {
        required: true,
        maxlength: 35,
        Address1:true
      },
      Address2: {
        required: false,
        maxlength: 35
      },
      City: {
        required: true,
        maxlength: 30
      },
      country: {
        required: true
      },
      stateProv: {
        required: true
      },
      ZipCode: {
        required: true,
        maxlength: 10,
        Zipcode: true
      },
      fairviewMicrowaveReturnMerchSalesInvoi: {
        required: true,
        maxlength: 30
      },
      fairviewMicrowaveReturnMerchPO1: {
        required: false,
        maxlength: 40
      },
      fmReasonForReturn0: {
        required: true,
        maxlength: 200
      },
      fairviewMicrowaveReturnMerchPart0Qty: {
        required: true,
        maxlength: 5
      },
      fairviewMicrowaveReturnMerchPart0SKU: {
        required: true
      },
      rmaReqType_others: {
        required: ":visible",
        maxlength: 30
      },
      fairviewMicrowaveReturnMerchName1: {
        required: true
      },
      fairviewMicrowaveReturnMerchDate1: {
        required: true
      },
      rfSignForName: {
        required: true,
        maxlength: 50
      }
    },
    messages: {
      FirstName: {
        required: validationMessage.enterFirstName || "",
        firstName: validationMessage.notValidName || "",
        maxlength: validationMessage.maxChar30 || ""
      },
      LastName: {
        required: validationMessage.enterLastName || "",
        firstName: validationMessage.notValidName || "",
        maxlength: validationMessage.maxChar30 || ""
      },
      Company: {
        maxlength: validationMessage.maxChar40 || ""
      },
      Title: {
        required: validationMessage.enterJobTitle || "",
        maxlength: validationMessage.maxChar30 || ""
      },
      EmailAddress: {
        required: validationMessage.enterEmailAddress || "",
        email: validationMessage.enterValidEmailAddress || ""
      },
      Address1: {
        required: validationMessage.address1 || "",
        Address1: validationMessage.notValidAddress || "",
        maxlength: validationMessage.maxChar35 || ""
      },
      Address2: {
        required: validationMessage.address2 || "",
        maxlength: validationMessage.maxChar35 || ""
      },
      City: {
        required: validationMessage.enterCity || "",
        maxlength: validationMessage.maxChar30 || ""
      },
      ZipCode: {
        required: validationMessage.notValidZipOrPost || "",
        maxlength: validationMessage.notValidZipOrPost || "",
        Zipcode: validationMessage.notValidZipOrPost || ""
      },
      fairviewMicrowaveReturnMerchSalesInvoi: {
        required: validationMessage.enterFMSales || "",
        maxlength: validationMessage.maxChar30 || ""
      },
      fairviewMicrowaveReturnMerchPO1: {
        maxlength: validationMessage.maxChar40 || ""
      },
      rfSignForName: {
        required: validationMessage.enterName || "",
        maxlength: validationMessage.maxChar50 || "",
        firstName: validationMessage.notValidName || ""
      },
      rmaReqType_others: {
        required: validationMessage.enterOtherNote || "",
        maxlength: validationMessage.maxChar50 || ""
      },
      fmReasonForReturn0: {
        required: validationMessage.enterReasonForReturns || "",
        maxlength: validationMessage.maxChar200 || ""
      },
      fairviewMicrowaveReturnMerchPart0Qty: {
        required: validationMessage.enterQuantity || "",
        maxlength: validationMessage.maxQuantity99999 || ""
      },
      fairviewMicrowaveReturnMerchPart0SKU: {
        required: validationMessage.enterPartNumber || "",
        maxlength: validationMessage.maxChar200 || ""
      },
      BusinessPhone: {
        required: validationMessage.enterPhone || "",
        maxlength: validationMessage.maxChar20 || "",
        phoneUS: validationMessage.notValidPhone || ""
      }
    }
  });

  // Country List
  window.getAPIModule
    .getCountryList()
    .done(function (countriesList) {
      // Create Country Dropdown
      if (countriesList && $countrySelectorRMAForm.length) {
        countryResponse = countriesList;
        $countrySelectorRMAForm.countryList(countriesList);
      }
    })
    .fail(function (error) {
      console.log(error);
    });
  // Zip Code Maximum Length Required based on Country Selection
  if ($countrySelectorRMAForm && $zipCodeRMAForm) {
    $countrySelectorRMAForm.on("change", function () {
      formValidation.zipCodeMaxLengthSet(
        $countrySelectorRMAForm,
        $zipCodeRMAForm
      );
    });
    // Zip Code Formate sets based on Country Selection
    $zipCodeRMAForm.on("keyup", function (e) {
      formValidation.zipCodeValueFormate($countrySelectorRMAForm, e);
    });
  }
  //populating the stateList after country change
  $countrySelectorRMAForm.on("change", function (event) {
    let countryName = $(event.target).val();
    $stateSelectorRMAForm.stateFilter(countryResponse, countryName);
  });

  // show others text box
  var $selectAll = $("#rmafForm input:radio[name=rmaReqType]");
  $selectAll.on("change", function () {
    if ($("#rmafForm input[name='rmaReqType']:checked").val() != "Others") {
      $("#rmafForm #othersTxt").hide();
      $("#rmafForm #othersTxt-error").hide();
    } else {
      $("#rmafForm #othersTxt").show();
    }
  });
});
