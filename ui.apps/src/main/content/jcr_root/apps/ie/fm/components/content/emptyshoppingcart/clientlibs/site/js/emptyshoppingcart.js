// ==========================SSS-start============================================//
var jsonOfCountries;
var listOfIEHolidays = "";
$.getJSON('/content/dam/infinite-electronics/json/fairview-microwave/HolidayCalenderJSON.json', function (data) {
    listOfIEHolidays = data["holidays"];
});

$(document).ready(function () {



    $.getJSON("/content/dam/infinite-electronics/json/fairview-microwave/newestCountries.json", function (data) {

        jsonOfCountries = data;
        populateCountryListEmpty(data);
    });

    var countriesForCartPage = document.getElementById("select_box_country");
    countriesForCartPage.onchange = function () {
        // var valueOfSelect = document.getElementById("select_box_country").value;
        document.getElementById("postal_code_input").disabled = false;
        document.getElementById("postal_code_input").value = "";
        document.getElementById("check_active_class").style.background = "#879096";
        document.getElementById("check_active_class").style.pointerEvents = "none";
    };

});


function populateCountryListEmpty(data) {
    var countriesForCartPage = document.getElementById("select_box_country");
    for (var x in data) {
        countriesForCartPage.options[countriesForCartPage.options.length] =
            new Option(x);
    }
}

function validateZipCodeEmpty() {
    var estShipHandCost = document.getElementById("estShipHandCost");
    var estDelDate = document.getElementById("estDelDate");
    var estTax = document.getElementById("estimatedTaxToBeCollected");
    var selectedCountry = document.getElementById("select_box_country").value;

    var zipCode = document.getElementById("postal_code_input").value;


    var currentCountry = jsonOfCountries[selectedCountry];
    var checkBox = document.getElementById("check_active_class");

    //hide the error message while entering value in input field
    errorMessageActionEmpty("none");
    printToDOMEmpty("estimatedTaxToBeCollected", "$0.00");
    printToDOMEmpty("estShipHandCost", "Unknown");
    printToDOMEmpty("estDelDate", "Unknown");

    if (currentCountry === "US") {
        //validate using US regex

        if (/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zipCode)) {
            checkBox.style.background = "#D83A22";
            checkBox.style.pointerEvents = "auto";
            $(checkBox).parents().find(".postal_code_error").hide();
            checkBox.onclick = function () {

                disableTickEmpty();
                errorMessageActionEmpty("none");
                callToAjaxEmpty(currentCountry, zipCode);

            };
        }
        // make checkbox inactive if the USA postal code is invalid
        else {
            checkBox.style.background = "#879096";
            checkBox.style.pointerEvents = "none";
            $(checkBox).parents().find(".postal_code_error").show();
            // estShipHandCost.innerText = "Unknown";
            // estDelDate.innerText = "Unknown";
            // estTax.innerText = "";
        }
    } else if (currentCountry === "CA") {
        if (
            /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i.test(
                zipCode
            )
        ) {
            checkBox.style.background = "#D83A22";
            checkBox.style.pointerEvents = "auto";
            checkBox.onclick = function () {
                disableTickEmpty();
                errorMessageActionEmpty("none");
                callToAjaxEmpty(currentCountry, zipCode);
            };
        } else {
            checkBox.style.background = "#879096";
            checkBox.style.pointerEvents = "none";
        }
    }
    //for other countries than USA, make the checkbox active during input event
    else {
        checkBox.style.background = "#D83A22";
        checkBox.style.pointerEvents = "auto";
        checkBox.onclick = function () {
            errorMessageActionEmpty("none");
            callToAjaxEmpty(currentCountry, zipCode);
        };
    }
}
function getDeliveryEstimationsEmpty(countryCodeParam, zipCodeParam) {
    var rateReplyDetails = {};
    return $.ajax({
        type: "POST",
        url: "/bin/getdeliveryrate",
        data: {
            CTCustomerToken: window.isCustomerToken(),
            transitTimeRequired: true,
            zipcode: zipCodeParam,
            country: countryCodeParam,
            bearertoken: window.getbearerToken()
        },
        success: function (data) {
            return data;
        },
        error: function (error) {
          window.errorModule.showErrorPopup(error);
        }
    });
}
function getTaxEstimationEmpty(countryCodeParam, postalCodeParam) {
    return $.ajax({
        url: "/bin/getcalculatedtax",
        data: {
            CTCustomerToken: window.isCustomerToken(),
            postalCode: postalCodeParam,
            countryCode: countryCodeParam,
            bearertoken: window.getbearerToken()
        },
        success: function (result) {
            return result;
        },
        error: function (error) {
          window.errorModule.showErrorPopup(error);
        }
    });
}

function parseDeliveryEstimationResponseEmpty(data) {

    var shippingAndHand;

    var shippingAndHandlingF = Number.MAX_VALUE;


    var shippingAndHandlingU = Number.MAX_VALUE;

    if (data.statusCode === 500 || data.statusCode === 404 || data.statusCode === 400 || data.statusCode === 409 || (data["FEDEX"] === undefined && data["UPS"] === undefined)) {

        return false;
    }
    if (data["FEDEX"] !== undefined) {
        if (data["UPS"] === undefined && data["FEDEX"].statusCode === 500) {

            return false;
        }
        if (data["FEDEX"].statusCode !== 500) {
            var rateReplyDetails = data["FEDEX"]["output"]["rateReplyDetails"];
            earliestDateF = rateReplyDetails[0]["operationalDetail"]["commitDate"];
            shippingAndHandlingF = Number(rateReplyDetails[0].ratedShipmentDetails[0]["totalNetFedExCharge"]);
            for (var detail of rateReplyDetails) {
                if (Number(detail.ratedShipmentDetails[0]["totalNetFedExCharge"]) <= shippingAndHandlingF) {
                    shippingAndHandlingF = Number(detail.ratedShipmentDetails[0]["totalNetFedExCharge"]);
                }
            }
        }
    }
    if (data["UPS"] !== undefined) {
        if (data["FEDEX"] === undefined && data["UPS"].statusCode === 500) {

            return false;
        }
        if (data["UPS"].statusCode !== 500) {

            var rateReplyDetails = data["UPS"]["RateResponse"]["RatedShipment"];
            shippingAndHandlingU = Number(rateReplyDetails[0]["TotalCharges"]["MonetaryValue"]);
            for (var detail of rateReplyDetails) {

                if (Number(detail["TotalCharges"]["MonetaryValue"]) <= shippingAndHandlingU) {
                    shippingAndHandlingU = Number(detail["TotalCharges"]["MonetaryValue"]);
                }
            }
        }
    }


    if (shippingAndHandlingU <= shippingAndHandlingF) {


        shippingAndHand = shippingAndHandlingU;
    } else {


        shippingAndHand = shippingAndHandlingF;
    }

    return parseFloat(shippingAndHand).toFixed(2);
}

function parseTaxEstimationResponseEmpty(result) {

    if (result.statusCode !== 400 && result.statusCode !== 500 && result.statusCode !== 409 && result.statusCode !== 404) {
        return formatPriceEmpty(
            result["taxedPrice"]["totalTax"]["centAmount"],
            result["taxedPrice"]["totalTax"]["fractionDigits"]
        );
    } else {
        return false;
    }


}
function getEstimatedShipmentDateEmpty() {

    var timeNow = new Date();




    var timeCST = new Date(timeNow.toLocaleString("en-US", { timeZone: 'CST' }));


    var date = timeCST.getDate();
    var month = timeCST.getMonth() + 1;
    var hour = timeCST.getHours();
    var monthStringPadded = zeroPadEmpty(month);
    var day = timeCST.getDay();



    // var todayDate = monthStringPadded + "-" + date;
    if (!isIEHolidayEmpty(date, day, monthStringPadded)) {
        if (hour < 18) {
            return "Today";
        }
    }

    return getNextBusinessDayEmpty(timeCST);

}
function callToAjaxEmpty(countryCode, zipCode) {

    var taxEstimation;
    var deliveryEstimation;

    getDeliveryEstimationsEmpty(countryCode, zipCode).then(function (data) {
        deliveryEstimation = parseDeliveryEstimationResponseEmpty(data);

        getTaxEstimationEmpty(countryCode, zipCode).then(function (result) {
            taxEstimation = parseTaxEstimationResponseEmpty(result);
            if (deliveryEstimation !== false && taxEstimation !== false) {
                printToDOMEmpty("estimatedTaxToBeCollected", "$" + taxEstimation);
                printToDOMEmpty("estShipHandCost", "$" + deliveryEstimation);
                printToDOMEmpty("estDelDate", getEstimatedShipmentDateEmpty());
                // printToDOMEmpty("estDelDate", deliveryEstimation[1]);
                updateEstimatedTotalAfterPincodeTickEmpty(Number(parseFloat(taxEstimation).toFixed(2)) + Number(parseFloat(deliveryEstimation).toFixed(2)));

            } else {
                updateEstimatedTotalAfterPincodeTickEmpty(0.0);
                errorMessageActionEmpty("block");
                printToDOMEmpty("estimatedTaxToBeCollected", "Unavailable");
                printToDOMEmpty("estShipHandCost", "Unavailable");
                printToDOMEmpty("estDelDate", "Unavailable");

            }
            enableTickEmpty();
        });
    });

    // enableTickEmpty();
}
function updateEstimatedTotalAfterPincodeTickEmpty(sumOfEstTaxAndEstShipHand) {
    var totalB4TaxEle = document.getElementById("totalBeforeTax").innerHTML;
    // var itemsEle = document.getElementById("subtotal").innerHTML;
    var totalB4Tax = parseFloat(totalB4TaxEle.slice(1, totalB4TaxEle.length));
    // var itemsSubtotal = parseFloat(itemsEle.slice(1, itemsEle.length));

    var estimatedTotal = sumOfEstTaxAndEstShipHand + totalB4Tax;



    printToDOMEmpty("total_amount", "$" + estimatedTotal.toFixed(2));

}
function formatPriceEmpty(price, fractionDigits) {
    var divideBy = Math.pow(10, Number(fractionDigits));
    return String(Number(Number(price) / divideBy).toFixed(2));
}
function zeroPadEmpty(number) {
    var num = number.toString();
    while (num.length < 2) {
        num = "0" + num;
    }
    return `${num}`;
}


/*
  -date and month must be in 01,02,03,11,29 format
*/

function isIEHolidayEmpty(date, day, month) {

    if (day === 0 || day === 6) {

        return true;
    }
    var listOfHolidays = [];

    listOfHolidays = listOfIEHolidays;
    var dateToCheck = month + "-" + date;

    for (var holiday of listOfHolidays) {

        if (dateToCheck === holiday) {

            return true;
        }
    }

    return false;

}

// if not able to deliver today find the next possible business day for delivery
function getNextBusinessDayEmpty(date) {
    var tomorrow = new Date(date.toLocaleString("en-US", { timeZone: 'CST' }));
    tomorrow.setDate(date.getDate() + 1);
    // if tomorrow is a business day
    if (!isIEHolidayEmpty(zeroPadEmpty(tomorrow.getDate()), tomorrow.getDay(), zeroPadEmpty(tomorrow.getMonth() + 1))) {

        return "Tomorrow";
    }


    // if tomorrow is not a business day
    return "Next business day";

}

function printToDOMEmpty(id, value) {
    var element = document.getElementById(id);
    element.innerHTML = value;
}

function disableTickEmpty() {

    document.getElementById("check_active_class").style.pointerEvents = "none";
    document.getElementById("check_active_class").style.background = "#879096";
}
function enableTickEmpty() {

    document.getElementById("check_active_class").style.pointerEvents = "auto";
    document.getElementById("check_active_class").style.background = "#d83a22";
}
function errorMessageActionEmpty(action) {
    var erroMsg = document.getElementById("errorMsgForOrderSummary");
    var errorIcon = document.getElementById("warning_icon");
    errorIcon.style.display = action;
    erroMsg.style.display = action;
    erroMsg.style.color = "#000000";
}
// ###=========================SSS-Finish========================================//
// analytic code to track CTA links for start shopping on shopping cart empty page
document.querySelector("body").addEventListener('click', function(e) { 
    var buttonElement = e.target.closest('button');
        var label="";
        var category= "";
        if(buttonElement !== null && buttonElement.closest('.analyticmycart')!=null){  
            label= buttonElement.textContent.trim(); 
            category= "Start Shopping - My Cart-" + currentPageName + " page";        
          ctalinkDataLayerCall(label,category);               
      }        
    }, false);	