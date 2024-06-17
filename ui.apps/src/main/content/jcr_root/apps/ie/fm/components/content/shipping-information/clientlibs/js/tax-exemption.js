// fetching data from cookies
var slectedState = "";
var customerToken = "";
var selectCountry = "";

function getCustomerTokenFromCookie() {
  var i,
    x,
    y,
    ARRcookies = document.cookie.split(";"); //var tvalue="";
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

$(document).ready(function () {
  customerToken = getCustomerTokenFromCookie();
  if (customerToken == null || customerToken == undefined) {
    $(".tax-exemption-check-section").css("display", "none");
    document.getElementById("taxExemptionCheck").style.display = "block";
    document.getElementById("taxExemptLabel").innerHTML = "Yes I'm tax exempt";
    document.getElementById("taxApproved").style.display = "none";
    document.getElementById("taxCheck").disabled = true;
    if (document.getElementById("ShippingCountry").value == "") {
      document.getElementById("taxCheck").disabled = true;
    }
  }
});

function countryChange() {
  $("#ShippingCountry option[selected]").removeAttr("selected");
  var e = document.getElementById("ShippingCountry");
  e.options[e.selectedIndex].setAttribute("selected", "selected");
  var value = e.options[e.selectedIndex].value; 
  if (value != "US") {
    $(".tax-exemption-check-section").css("display", "none");
    document.getElementById("taxExemptLabel").innerHTML = "";
  } else {
    $(".tax-exemption-check-section").css("display", "block");
    document.getElementById("taxNumber").value = "";
    document.getElementById("taxNumber").style.display = "none";
    document.getElementById("errorMsg").innerHTML = "";

    document.getElementById("taxCheck").checked = false;
    document.getElementById("taxCheck").disabled = true;
    document.getElementById("taxExemptLabel").innerHTML = "Yes I'm tax exempt";
    document.getElementById("ShippingState").value = "select";
  }
}

function selectState() {
  var e = document.getElementById("ShippingState");
  var value = e.options[e.selectedIndex].value;
  slectedState = e.options[e.selectedIndex].text;
  if (value != "" && value != "select") {
    document.getElementById("taxCheck").disabled = false;
    document.getElementById("taxExemptLabel").innerHTML =
      "Yes I'm tax exempt in " + slectedState;
    document.getElementById("taxNumber").value = "";
    document.getElementById("errorMsg").innerHTML = "";
  } else {
    document.getElementById("taxNumber").style.display = "none";
    document.getElementById("errorMsg").innerHTML = "";
    document.getElementById("taxCheck").checked = false;
    document.getElementById("taxCheck").disabled = true;
    document.getElementById("taxExemptLabel").innerHTML = "Yes I'm tax exempt";
  }
}

// end up guest chek
function taxBoxNumber() {
  var checkBox = document.getElementById("taxCheck");
  var taxNumber = document.getElementById("taxNumber");

  if (checkBox.checked == true) {
    taxNumber.style.display = "block";
    $(".tax-message").show();
  } else {
    taxNumber.style.display = "none";
    $(".tax-message").hide();
    document.getElementById("errorMsg").innerHTML = "";
    document.getElementById("taxNumber").value = "";
  }
}

function checkLength() {
  let regSpecial = regexPattern.SPECIALCHAR;
  if (
    taxNumber.value == "" ||
    taxNumber.value.length < 3 ||
    taxNumber.value.length > 35 ||
    regSpecial.test(taxNumber.value)
  ) {
    $("#errorMsg").text(
      utilityMessage?.messages?.enterValidTaxExemptCertificateNo || ""
    );
  } else {
    document.getElementById("errorMsg").innerHTML = "";
  }
}

// state response Ajax call for Logged user
var state_taxexemp = "";
var stateValue = "";
function gettaxexempt(user_state, stateValue) {
  //var state_data = tax_emempt_Json.tax_exempt_data;
  for (var i = 0; i < user_state.length; i++) {
    if (user_state[i] == stateValue) {
      //var taxexemptData = state_data[i].taxexempt;
      state_taxexemp = user_state[i];
      return user_state[i];
    }
  }
}

const getTaxDetail = {};
function stateInfo(elem) {
  let currentEvent = elem;
  stateValue = $(elem).attr("value");
  selectCountry = $(elem).data("country");
  document.getElementById("taxNumber").value = "";
  document.getElementById("taxNumber").style.display = "none";
  document.getElementById("errorMsg").innerHTML = "";
  document.getElementById("taxCheck").checked = false;
  $(".tax-exemption-check-section").css("display", "none");
  
  if (selectCountry != "US" && globalCentAmout !== 0) {
    $(".tax-exemption-check-section").css("display", "block");
  } else {
    $(".tax-exemption-check-section").css("display", "none");
  }
 
  $.ajax({
    type: "POST",
    url: "/bin/customerProfile",
    data: {
      CTCustomerToken: window.isCustomerToken(),
      bearertoken: window.getbearerToken()
    },
    //dataType: "json",
    success: function (data) {
      //window.errorModule.checkError(data);
      var user_state = data.custom.fields.usTaxExemptionStates;

      if (user_state == undefined) {
        document.getElementById("taxExemptionCheck").style.display = "block";
        document.getElementById("taxExemptLabel").innerHTML =
          "Yes I'm tax exempt in  " + stateValue;
        document.getElementById("taxApproved").style.display = "none";
      } else {
        var state_taxexempt = gettaxexempt(user_state, stateValue);
        if (state_taxexempt) {
          document.getElementById("taxApproved").style.display = "block";
          document.getElementById("taxApproved").innerHTML =
            "Approved - " + stateValue;
          document.getElementById("taxExemptionCheck").style.display = "none";
        } else {
          document.getElementById("taxExemptionCheck").style.display = "block";
          document.getElementById("taxExemptLabel").innerHTML =
            "Yes I'm tax exempt in " + stateValue;
          document.getElementById("taxApproved").style.display = "none";
        }
      }  
     
    },
    error: function (error) {
      window.errorModule.showErrorPopup(error);
    }
  });  
  changeAddressValidation(currentEvent);    
}
getTaxDetail.stateInfo = stateInfo;
window.getTaxDetail = getTaxDetail || {};
