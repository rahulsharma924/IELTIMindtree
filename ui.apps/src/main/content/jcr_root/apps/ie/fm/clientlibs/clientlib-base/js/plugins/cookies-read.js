(function ($) {
  $.fn.cookiesRead = function () {
    /**
     * isCustomerToken(): Check if user is logged or not
     * @param {String} return either logedin User Token or Anynomus(Guest) User Token
     */
    function customerToken() {
      let CTCustomerToken;
      const cookiesValue = document.cookie.split(";");
      cookiesValue.find(function (e) {
        const isCustomerToken = isOnlyCustomerToken();
        if (e) {
          let cus = e.split("=") ? e.split("=")[0] : "";
          if (cus) {
            if (cus.trim() === "customerInfo") {
              const cusToken = document.cookie.split("customertoken"),
                info1 = cusToken[1],
                s = info1 ? info1.split(":") : "",
                s1 = s ? s[1] : "",
                s2 = s1 ? s1.split(",") : "",
                s3 = s2 ? s2[0] : "";
              CTCustomerToken = s3 ? s3.replaceAll('"', "") : "";
            }
            if (cus.trim() == "anonymousCustomerInfo" && !isCustomerToken) {
              CTCustomerToken = e.split("=")[1].replaceAll('"', "");
            }
          }
        }
      });
      return CTCustomerToken;
    }

    /**
     * isOnlyCustomerToken() only Logged in User token
     * @param {Boolean}  return true/false
     */

    function isOnlyCustomerToken() {
      const cookiesValue = document.cookie.split(";");
      const cookies = cookiesValue.find(function (e) {
        if (e) {
          let cus = e.split("=") ? e.split("=")[0] : "";
          if (cus) {
            return cus.trim() === "customerInfo";
          }
        }
      });

      return !!cookies;
    }

    /**
     * isGuestUserToken() only Guest User token
     * @param {Boolean}  return true/false
     */

    function isGuestUserToken() {
      const cookiesValue = document.cookie.split(";");
      const cookies = cookiesValue.find(function (e) {
        if (e) {
          let cus = e.split("=") ? e.split("=")[0] : "";
          if (cus) {
            return cus.trim() === "anonymousCustomerInfo";
          }
        }
      });

      return !!cookies;
    }

    /**
     * logedInCookiesData() only Logged in User token
     * @param {Object}  return object
     */

    function logedInCookiesData() {
      const cookiesValue = document.cookie.split(";");
      let cookiesObject;
      cookiesValue.find(function (e) {
        if (e) {
          let cus = e.split("=") ? e.split("=")[0] : "";
          if (cus) {
            if (cus.trim() === "customerInfo") {
              let store = e.replace("customerInfo=", "");
              cookiesObject = JSON.parse(store);
            }
          }
        }
      });
      return cookiesObject;
    }

    // refresh token
    function refreshToken() {
      const cookiesValue = document.cookie.split(";");
      let refreshToken;
      cookiesValue.find(function (e) {
        if (e) {
          let cus = e.split("=") ? e.split("=")[0] : "";
          if (cus) {
            if (cus.trim() === "refreshToken") {
              refreshToken = e.replace("refreshToken=", "").trim();
            }
          }
        }
      });
      return refreshToken;
    }
    return {
      customerToken: customerToken,
      isOnlyCustomerToken: isOnlyCustomerToken,
      logedInCookiesData: logedInCookiesData,
      refreshToken: refreshToken,
      isGuestUserToken: isGuestUserToken
    };
  };
})(jQuery);
