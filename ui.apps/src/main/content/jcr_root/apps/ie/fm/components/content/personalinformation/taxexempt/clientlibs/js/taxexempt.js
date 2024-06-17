window.addEventListener('pageshow', function (event) {
    if (event.persisted || performance.getEntriesByType("navigation")[0].type === 'back_forward') {
        var i,
            x,
            y,
            isCookieThere = false,
            ARRcookies = document.cookie.split(";");

        for (i = 0; i < ARRcookies.length; i++) {
            x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
            y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, "");
            if (x == "customerInfo") {
                isCookieThere = true;
            }
        }
        if (!isCookieThere) {

            window.location.href = "/content/fm/en/sign-in.html";
        }

    }
});

$(document).ready(function () {

    $("#myacclink-subheading-pi").find("p a").addClass("current");
    // (function () {
    var custToken = window.isCustomerToken();
    var bearToken = window.getbearerToken();
     $.ajax({
        type: "POST",
        url: "/bin/customerProfile",
		data: {
          "bearertoken": window.getbearerToken(),
          "CTCustomerToken": window.isCustomerToken()
        },
        success: function (data) {
            //window.errorModule.checkError(data);
            var exemptedStatesCode;
            if (data.custom?.fields?.usTaxExemptionStates) {
                exemptedStatesCode = data.custom.fields.usTaxExemptionStates;
            }

            //create a <p>state code and append to tax exempted states

            if (exemptedStatesCode !== undefined && exemptedStatesCode.length !== 0) {
                let exemptedStatesHTML = "";
                for (let eStateCode of exemptedStatesCode) {
                    exemptedStatesHTML += `<p>${getStateNameFromCode(eStateCode)}</p>`;
                }
                $("#states").html(exemptedStatesHTML);
            } else {
                $("#approved").hide();
                $("#states").removeClass("padding-for-states");
                $("#states").addClass("padding-states-notapproved");
                $("#states").html(`<p>${$("#states").attr("data-states-notapproved")}</p>`);
            }

            if (data.custom?.fields?.erpCustomerId) {
                $("#erpCustId").html(` ${data.custom?.fields?.erpCustomerId}`);
            } else {
                $("#erpCustId").html(" <b> &nbsp;&nbsp;-</b>");
            }

            if(data.custom?.fields?.buyOnTerms){
                 $("#cardList").html(`${$("#cardList").attr("data-purorder-text")}`);
            }
            else{
                $("#cardList").html(`${$("#cardList").attr("data-payment-notpresent")}`);
            }

        },
        error: function (error) {
          window.errorModule.showErrorPopup(error);
        }
    });
    // $.ajax({
    //     type: "GET",
    //     url: "/bin/viewpaymentmethod",
    //     data: { CTCustomerToken: custToken, bearerToken: bearToken },
    //     success: function (data, textstatus, xhr) {
    //         if (data) {
    //             //if payment methods are present
    //             if (data['paymentMethods'] !== undefined && data['paymentMethods'] !== null) {
    //                 var $payMeths = data['paymentMethods'];
    //                 var payMethHTML = "";
    //                 for (let payMeth of $payMeths) {
    //                     payMethHTML += `<p>${payMeth['cardType']} *** *** *** *** ${payMeth['last4']}</p>`;
    //                 }
    //                 $("#cardList").append(payMethHTML);
    //             }
    //             else {
    //                 $("#cardList").html(`<p>${$("#cardList").attr("data-payment-notpresent")}</p>`);
    //             }
    //         }
    //     }
    // });
});

function getStateNameFromCode(stateCode) {
    var stateJSON = {
        "AL": "Alabama",
        "AK": "Alaska",
        "AS": "American Samoa",
        "AA": "AA (Armed Forces Americas)",
        "AE": "AE  (Armed Forces Europe)",
        "AP": "AP (Armed Forces Pacific)",
        "AZ": "Arizona",
        "AR": "Arkansas",
        "CA": "California",
        "CO": "Colorado",
        "CT": "Connecticut",
        "DE": "Delaware",
        "DC": "District of Columbia",
        "FM": "Federated States of Micronesia",
        "FL": "Florida",
        "GA": "Georgia",
        "GU": "Guam",
        "HI": "Hawaii",
        "ID": "Idaho",
        "IL": "Illinois",
        "IN": "Indiana",
        "IA": "Iowa",
        "KS": "Kansas",
        "KY": "Kentucky",
        "LA": "Louisiana",
        "ME": "Maine",
        "MH": "Marshall Islands",
        "MD": "Maryland",
        "MA": "Massachusetts",
        "MI": "Michigan",
        "MN": "Minnesota",
        "MS": "Mississippi",
        "MO": "Missouri",
        "MT": "Montana",
        "MP": "Northern Mariana Islands",
        "NE": "Nebraska",
        "NV": "Nevada",
        "NH": "New Hampshire",
        "NJ": "New Jersey",
        "NM": "New Mexico",
        "NY": "New York",
        "NC": "North Carolina",
        "ND": "North Dakota",
        "OH": "Ohio",
        "OK": "Oklahoma",
        "OR": "Oregon",
        "PW": "Palau",
        "PA": "Pennsylvania",
        "PR": "Puerto Rico",
        "RI": "Rhode Island",
        "SC": "South Carolina",
        "SD": "South Dakota",
        "TN": "Tennessee",
        "TX": "Texas",
        "UT": "Utah",
        "VT": "Vermont",
        "VI": "Virgin Islands",
        "VA": "Virginia",
        "WA": "Washington",
        "WV": "West Virginia",
        "WI": "Wisconsin",
        "WY": "Wyoming"
    };
    if (stateJSON[stateCode]) {
        return stateJSON[stateCode];
    } else {
        return "";
    }

}
