(function ($) {
  $.fn.getAPIEndpoint = function () {
    return {
      ACTIVE_CART: "/bin/getActiveCart",
      ADD_TO_CART: "/bin/addtocart",
      REMOVE_CART: "/bin/removeproduct",
      UPDATE_CART: "/bin/updatecart",
      CLEAR_CART: "/bin/clearcart",
      DELIVERY_RATE: "/bin/getdeliveryrate",
      CALCULATED_TAX: "/bin/getcalculatedtax",
      ORDER_HISTORY: "/bin/orderhistory",
      ORDER_HISTORY_DETAILS: "/bin/orderdetails",
      RE_ORDER: "/bin/reorder",
      FETCH_PRODUCT: "/bin/fetchProduct",
      ORDERED_PRODUCT: "/bin/orderedproduct",
      PRODUCT_SEARCH: "/bin/productsearch",
      VALIDATE_ADDRESS: "/bin/validateAddress",
      VALIDATE_ADDRESS_GUEST: "/bin/validateAddress.guestUser",
      GET_DELIVERY_OPTIONS: "/bin/getDeliveryOptions",
      UPDATE_ADDRESS: "/bin/updateAddress",
      CHECKOUT_UPDATE_CART: "/bin/checkoutUpdateCart",
      GET_DELIVERY_OPTIONS_GUEST: "/bin/getDeliveryOptions.guestUser",
      CHECKOUT_CALCULATE_TAX: "/bin/calculateTax",
      CHOOSE_PAYMENT: "/bin/choosePayment",
      RECALCULATE_TAX: "/bin/reCalculateTax",
      VIEW_PAYMENT_METHOD: "/bin/viewpaymentmethod",
      PROCESS_PAYMENT: "/bin/processPayment",
      INITIAL_ADDRESS: "/bin/initialAddress.json",
      GET_OPTIONS: "/bin/olcc/getOptions.json",
      GET_ALL_OPTIONS: "/bin/olcc/getAllOptions.json",
      CREATE_ASSEMBLY: "/bin/olcc/createAssembly",
      SEARCH_ASSEMBLY: "/bin/olcc/SearchCableAssembly",
      SEARCH_OPTIONS: "/bin/olcc/getSearchOptions",
      GET_BLOG_LIST: "/bin/getBlogList?year=",
      GET_NEWS_LIST: "/bin/getNewsList",
      ADD_ADDRESS: "/bin/addaddress.json",
      SEND_EMAIL_RFQ: "/bin/sendemailrfq",
      NEW_USER_REGISTRATION: "/bin/newuserregistration",
      CREATE_ACCOUNT_EMAIL: "/bin/createaccountemail",
      CHECKOUT_GUEST_REGISTRATION: "/bin/checkoutGuestRegistration",
      GET_PRODUCT_DELDATE: "/bin/getproddeldate",
      GET_PRODUCT_DELDATE_CUST: "/bin/getproddeldate.custom",
      GET_PLPMODEL_CATEGORY: "/bin/plpmodel/category",
      REFRESH_TOKEN: "/bin/refreshtoken",
      PDP_PRICE_INVENTORY: "/bin/productprojection",
      PLP_PRICE_INVENTORY: "/bin/plpGraphqlProducts",
      requestType: {
        POST: "POST",
        GET: "GET",
        PUT: "PUT",
        DELETE: "DELETE"
      },
      algolia: {
        API_ID: algId || "",
        API_KEY: algApi || "",
        indexInuse: indexInuse || ""
      },
      damEndpoint: {
        calender:
          "/content/dam/infinite-electronics/json/fairview-microwave/HolidayCalenderJSON.json",
        countries:
          "/content/dam/infinite-electronics/json/fairview-microwave/newestCountries.json",
        categoriesJson:
          "/content/dam/infinite-electronics/json/fairview-microwave/Categories.json",
        fedex_ups_card_response:
          "/content/dam/infinite-electronics/json/fairview-microwave/FedexUpsInfo.json",
        use_your_shipping_acc_response:
          "/content/dam/infinite-electronics/json/fairview-microwave/UYSA-method-of-shipping.json",
        utility:
          "/content/dam/infinite-electronics/json/fairview-microwave/utilities.json",
        calculatorUtility:
          "/content/dam/infinite-electronics/json/fairview-microwave/calculatorUtility.json",
        countryList:
          "/content/dam/infinite-electronics/json/fairview-microwave/countryList.json",
        deliveryStatusMapping:
          "/content/dam/infinite-electronics/json/fairview-microwave/deliveryStatusMapping.json",
        redirectURL: {
          emptyShoppingCart: "/content/fm/en/shopping-cart-empty.html",
          createAccountGuestRegister:
            "/content/fm/en/create-account.html/guestregister",
          successAccountCreated:
            "/content/fm/en/successfully-account-created.html",
          shippingInformation: "/content/fm/en/shipping-information.html",
          personalInformation:
            "/content/fm/en/my-account/account-details/personal-information.html",
          rfcdProductUrl:
            "/content/fm/en/the-rf-cable-designer/rfcd-product.html#"
        }
      },
      customEvent: {
        SHOPPING_CART_RESPONSE: "SHOPPING_CART_RESPONSE",
        SHOPPING_CART_FETCH: "SHOPPING_CART_FETCH",
        SHOPPING_CART_UPDATE: "SHOPPING_CART_UPDATE",
        SHOPPING_CART_REMOVE: "SHOPPING_CART_REMOVE",
        SHOPPING_CART_ERROR: "SHOPPING_CART_ERROR",
        BLOG_ALGOLIA_FETCH: "BLOG_ALGOLIA_FETCH"
      }
    };
  };
})(jQuery);
