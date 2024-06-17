(function () {
  function getBreadcrumbData() {
    const breadcrumbId = window.location.hash.split("#")[1];
    let bcontainer = document.querySelector("#iebreadcrumb");
    let client = algoliasearch(algId, algApi);
    let indexImg = client.initIndex(indexInuse);
    indexImg
      .getObject([breadcrumbId], {
        attributesToRetrieve: [
          "name",
          "seoName",
          "hierarchicalCategories",
          "length",
          "categorySEOURL"
        ]
      })
      .then((content) => {
        if (content?.hierarchicalCategories?.lvl2[0]) {
          catName = content.hierarchicalCategories.lvl2[0];
        } else if (content?.hierarchicalCategories?.lvl1[0]) {
          catName = content.hierarchicalCategories.lvl1[0];
        } else if (content?.hierarchicalCategories?.lvl0[0]) {
          catName = content.hierarchicalCategories.lvl0[0];
        }
        let str = `<ul><li class="home"><a href="/content/fm/en/homepage.html" title="Go to Home Page">Home</a><span><i class="fa fa-angle-right" aria-hidden="true"></i></span></li><li class="category3 analyticsprodcategory ${
          content.hierarchicalCategories ? "" : "d-none"
        }"><span>${catName}</span><span><i class="fa fa-angle-right" aria-hidden="true"></i></span></li><li class="category4"><strong><span>${
          content.name
        }</span></strong></li></ul>`;
        bcontainer.innerHTML = str;
      });
  }
  /*
   *quantityUpdate() : Update quanty value after clicking on + and -
   */
  function quantityUpdate() {
    let $qty = $(".pdp__quantityupdate");
    if ($qty) {
      // Plus Update
      $qty.find(".button-plus").on("click", function () {
        let plus = Number($qty.find(".input-plus-minus").val());
        if (plus > 0 && plus < 99999) {
          let newValue = plus + 1;
          $qty.find(".input-plus-minus").val(newValue);
          $(".add_to_cart--pdp").attr("data-cartqty", newValue);
        }
      });
      // Minus Update
      $qty.find(".button-minus").on("click", function () {
        let oldValue = Number($qty.find(".input-plus-minus").val());
        if (oldValue > 1 && oldValue <= 99999) {
          let newValue = oldValue - 1;
          $qty.find(".input-plus-minus").val(newValue);
          $(".add_to_cart--pdp").attr("data-cartqty", newValue);
        }
      });
      //Manual entry
      $qty.find(".input-plus-minus").on("change", function () {
        let oldValue = Number($qty.find(".input-plus-minus").val());
        if (oldValue > 1 && oldValue <= 99999) {
          $(".add_to_cart--pdp").attr(
            "data-cartqty",
            $qty.find(".input-plus-minus").val()
          );
        }
      });
    }
  }
  function readMorePDP() {
    let width = $(window).width();
    if (width <= 832) {
      let showChar = 90;
    } else {
      showChar = 200;
    }

    let ellipsestext = "...";
    let moretext =
      "Expand <i class='fa-regular fa-circle-plus font-16' aria-hidden='true'></i>";

    let lesstext =
      "Collapse<i class='fa fa-minus-circle' aria-hidden='true'></i>";

    $(".more").each(function () {
      let content = $(this).html();
      if (content.length > showChar) {
        let c = content.substr(0, showChar);
        let h = content.substr(showChar, content.length - showChar);

        let html =
          c +
          '<span class="moreellipses">' +
          ellipsestext +
          '</span><span class="morecontent"><span>' +
          h +
          '</span>&nbsp;<a title="Read More"  class="morelink ie-withIcon-link">' +
          moretext +
          "</a></span>";

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
  function imgChanged() {
    $(".imgInCol").click(function (element) {
      let picSrc = element.target.getAttribute("data-picsrc1");
      document.getElementById("imgToBeChanged").src = picSrc;
    });
  }
  function accordMobKeyCompli() {
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
      getEstimatedShipmentDate());
    $(".shipment-date").each(function () {
      $(this).html(shipDate);
    });
  }
  function selectLengthColor() {
    $("#select-length").on("change", function () {
      let selectvalue = $(this).val();
      const onlyNumbers = selectvalue.replace(/\D/g, "");
      $(".orignal-sku").hide();
      $(".newSelected-sku").show();
      if ($(this).val() === "select_custom") {
        $(".custom-selectOption-box").show();
        $("#inputCustom-select").append(
          "<input type='number' onblur='customlengthselect(this)' id='input-custom-select' placeholder='Enter desired length' />"
        );
      } else {
        $(".custom-selectOption-box").hide();
        $("#input-custom-select").remove();
        $("#length-value").empty();
        if (onlyNumbers != "0") {
          $("#length-value").append(onlyNumbers);
        } else {
          $("#length-value").empty();
        }
        let finalValue = $(".newSelected-sku").text();

        let newURL = `${locationUrl}#${finalValue}`;
        // let newURL = "product-details.html#" + finalValue;
        location.assign(newURL);
        location.reload();
      }
    });
    $("#select-color").on("change", function () {
      $(".orignal-sku").hide();
      $(".newSelected-sku").show();
      let selectvalue = $(this).val();
      $("#color-value").empty();
      if (selectvalue == "black") {
        $("#color-value").append("BK");
      } else if (selectvalue == "blue") {
        $("#color-value").append("BL");
      } else if (selectvalue == "green") {
        $("#color-value").append("GR");
      } else if (selectvalue == "orange") {
        $("#color-value").append("OR");
      } else if (selectvalue == "pink") {
        $("#color-value").append("PK");
      }
      let finalValue = $(".newSelected-sku").text();
      let newURL = `${locationUrl}#${finalValue}`;
      // let newURL = "product-details.html#" + finalValue;
      location.assign(newURL);
      location.reload();
    });
  }

  function zipCheck() {
    let zipC = $(".order-country-input #zip").val();
    if (/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zipC)) {
      $(".select-estimate .zip-button").removeClass("zip-button-grey");
      $(".select-estimate .zip-button").addClass("zip-button-red");
    } else {
      $(".select-estimate .zip-button").removeClass("zip-button-red");
      $(".select-estimate .zip-button").addClass("zip-button-grey");
    }
  }

  function zipValidate(overSized) {
    let zip = $(".order-country-input #zip").val();
    $(".select-estimate .zip-button").removeClass("zip-button-red");
    $(".select-estimate .zip-button").addClass("zip-button-grey");
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
        //window.errorModule.checkError(validateAddrResponse);
        if (validateAddrResponse?.coordinates) {
          $(".confirm-pd-20 .delivery-error").hide();
          let skuId = $(".order-items-price #pdpSku").text();
          let prodQty = $(".pdp__quantityupdate #pdpProdQty").val();
          if (overSized != undefined && overSized != null && overSized != "") {
            getCallusModal();
          } else {
            getProdDelDate(skuId, prodQty, zip);
          }
        } else {
          $(".select-estimate .zip-button").removeClass("zip-button-grey");
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
        $(".select-estimate .zip-button").removeClass("zip-button-grey");
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
        getCallusModal();
      }
    } else {
      $(".confirm-pd-20 .deliver-error").hide();
      $(".confirm-pd-20 .deliver-valid").show();
      $("#delEst").text(getEstimatedShipmentDate());
    }
  }
  function getCallusModal() {
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
  //function for shipment date
  let listOfIEHolidays = "";
  $.getJSON(
    "/content/dam/infinite-electronics/json/fairview-microwave/HolidayCalenderJSON.json",
    function (data) {
      listOfIEHolidays = data["holidays"];
    }
  );
  function getEstimatedShipmentDate() {
    let timeNow = new Date();

    let timeCST = new Date(
      timeNow.toLocaleString("en-US", { timeZone: "CST" })
    );
    let date = timeCST.getDate();
    let month = timeCST.getMonth() + 1;
    let hour = timeCST.getHours();
    let monthStringPadded = zeroPad(month);
    let day = timeCST.getDay();
    if (!isIEHoliday(date, day, monthStringPadded)) {
      if (hour < 18) {
        return "Today";
      }
    }
    return getNextBusinessDay(timeCST);
  }
  function zeroPad(number) {
    let num = number.toString();
    while (num.length < 2) {
      num = "0" + num;
    }
    return `${num}`;
  }

  /*
  -date and month must be in 01,02,03,11,29 format
*/

  function isIEHoliday(date, day, month) {
    if (day === 0 || day === 6) {
      return true;
    }
    var listOfHolidays = [];

    listOfHolidays = listOfIEHolidays;
    let dateToCheck = month + "-" + date;

    for (let holiday of listOfHolidays) {
      if (dateToCheck === holiday) {
        return true;
      }
    }
    //("NOT HOLIDAY=" + dateToCheck);
    return false;
  }

  // if not able to deliver today find the next possible business day for delivery
  function getNextBusinessDay(date) {
    let tomorrow = new Date(date.toLocaleString("en-US", { timeZone: "CST" }));
    tomorrow.setDate(date.getDate() + 1);
    // if tomorrow is a business day
    if (
      !isIEHoliday(
        zeroPad(tomorrow.getDate()),
        tomorrow.getDay(),
        zeroPad(tomorrow.getMonth() + 1)
      )
    ) {
      return "Tomorrow";
    }

    // if tomorrow is not a business day
    //let nextDay = new Date(tomorrow);
    return "Next Business Day";
    // nextDay.setDate(tomorrow.getDate() + 1);
  }
  //End of function for shipment date
  function pdpAlgoliaevent() {
    $(".cart-button").on("click", function () {
      aa("convertedObjectIDs", {
        eventName: "Product Added to Cart",
        index: indexInuse,
        userToken: userToken,
        objectIDs: [urlArr]
      });
    });
  }
  //check for logged in user
  function getCookie(name) {
    let dc = document.cookie;
    let prefix = name + "=";
    let begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
      begin = dc.indexOf(prefix);
      if (begin != 0) return null;
    } else {
      begin += 2;
      var end = document.cookie.indexOf(";", begin);
      if (end == -1) {
        end = dc.length;
      }
    }
    return decodeURI(dc.substring(begin + prefix.length, end));
  }
  //comma separator with 2 decimal places with US format

  function formatPrice(price) {
    return price.toLocaleString("en-us", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  //comma separator for number with US format

  function formatNumber(number) {
    return number.toLocaleString("en-us");
  }

  /* =================Get and set user token =================== */
  let loggedinCookie = JSON.parse(getCookie("customerInfo"));
  let guestId = "AN-" + Math.random().toString(16).slice(2);
  let gid = sessionStorage.getItem("Guest Algolia");
  if (gid == null || gid == "" || gid == "undefined") {
    sessionStorage.setItem("Guest Algolia", guestId);
  }
  const userToken =
    loggedinCookie == null ? guestId : loggedinCookie.customertoken;

  window.$pdpGlobal = {
    getBreadcrumbData,
    quantityUpdate,
    readMorePDP,
    imgChanged,
    accordMobKeyCompli,
    selectLengthColor,
    zipValidate,
    zipCheck,
    getEstimatedShipmentDate,
    zeroPad,
    isIEHoliday,
    getNextBusinessDay,
    pdpAlgoliaevent,
    formatPrice,
    formatNumber
  };
})();
