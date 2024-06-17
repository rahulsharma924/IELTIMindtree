(function ($) {
  function zipCheck() {
    let zipC = $(".order-country-input #zip").val();
    if (
      /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zipC) &&
      $("#zip").val() !== ""
    ) {
      $(".select-estimate .zip-button").removeClass("zip-button-grey");
      $(".select-estimate .zip-button").addClass("zip-button-red");
    } else {
      $(".select-estimate .zip-button").removeClass("zip-button-red");
      $(".select-estimate .zip-button").addClass("zip-button-grey");
      $(".confirm-pd-20 .delivery-details").hide();
    }
  }

  function zipValidate(overSized) {
    let zip = $(".order-country-input #zip").val();
    $(".select-estimate .zip-button").removeClass("zip-button-red");
    $(".select-estimate .zip-button").addClass("zip-button-incative");
    $(".cart__loader").removeClass("d-none");
    $(".confirm-pd-20 .delivery-details").hide();
    $(".confirm-pd-20 .delivery-error").hide();
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
        $(".modal-spinner-cls").addClass("hide");
        window.errorModule.checkError(validateAddrResponse);
        if (validateAddrResponse?.coordinates) {
          $(".confirm-pd-20 .delivery-error").hide();
          if (overSized != undefined && overSized != null && overSized != "") {
            getCallusModal();
          } else {
            getProdDelDate(zip);
          }
        } else {
          $(".cart__loader").addClass("d-none");
          $(".select-estimate .zip-button").removeClass("zip-button-grey");
          $(".select-estimate .zip-button").removeClass("zip-button-grey zip-button-incative");
          $(".select-estimate .zip-button").addClass("zip-button-red");
          $(".confirm-pd-20 .delivery-details").hide();
          $(".confirm-pd-20 .delivery-error").show();
        }
      },
      error: function (error) {
        window.errorModule.showErrorPopup(error);
      }
    });
  }

  // function for getting the delivery date
  function getProdDelDate(zip) {
    let prd_dtl = $olccProduct.lengthQntyUnit();
    let queryObject = {
      transitTimeRequired: true,
      customCAProduct: {
        masterSku: $olccProduct.skuValue,
        uom: prd_dtl.unit,
        length: prd_dtl.length,
        quantity: prd_dtl.quantity
      },
      address: {
        zipcode: zip,
        country: "US"
      }
    };
    $.ajax({
      url:
        "/bin/olcc/getProductDeliveryRates?bearerToken=" +
        window.getbearerToken() +
        "&jsonData=" +
        JSON.stringify(queryObject),
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "application/json"
      },
      success: function (response) {
        $(".modal-spinner-cls").addClass("hide");
        parseAndGetDelDate(response);
        $(".cart__loader").addClass("d-none");
        $(".select-estimate .zip-button").removeClass("zip-button-grey zip-button-incative");
        $(".select-estimate .zip-button").addClass("zip-button-red");
      }
    });
  }
  //function for delivery date
  function parseAndGetDelDate(response) {
    if (response.errors !== undefined && response.errors !== null) {
      if (response.errors[0].code === "OVERWEIGHT") {
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
  window.$olccDeliveryFnc = {
    zipCheck,
    zipValidate
  };
})(jQuery);
