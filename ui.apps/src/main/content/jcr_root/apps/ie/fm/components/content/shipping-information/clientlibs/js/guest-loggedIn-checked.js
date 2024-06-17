$(document).ready(function () {
    var customerToken = getCustomerTokenFromCookie();
    function getCustomerTokenFromCookie() {
        var i,
            x,
            y,
            ARRcookies = document.cookie.split(";");
        //var tvalue="";
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
    if (customerToken == null || customerToken == undefined) {
        //$(".loader").hide();
        //$(".logged-in-user").addClass("d-none");
        $(".logged-in-user").removeClass('tokenActive');
        $(".guest-user").addClass('tokenActive');
    } else {
        //$(".loader").hide();
        //$(".guest-user").addClass("d-none");
        $(".guest-user").removeClass('tokenActive');
        $(".logged-in-user").addClass("tokenActive");
    }
});
