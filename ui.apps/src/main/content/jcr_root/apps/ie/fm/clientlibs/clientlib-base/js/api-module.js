var getAPIModule = (function () {
  const endPoint = $.fn.getAPIEndpoint(),
    CUSTOMER_TOKEN = $.fn.cookiesRead().customerToken(),
    BEARER_TOKEN = window.getbearerToken(),
    apiPromise = fetchAPICallCached(),
    APIS = {
      activeCart: {
        url: endPoint.ACTIVE_CART
      },
      addToCart: {
        url: endPoint.ADD_TO_CART
      },
      updateCart: {
        url: endPoint.UPDATE_CART
      },
      removeCart: {
        url: endPoint.REMOVE_CART
      },
      calender: {
        url: endPoint.damEndpoint.calender
      },
      deliveryRate: {
        url: endPoint.DELIVERY_RATE
      },
      calculatedTax: {
        url: endPoint.CALCULATED_TAX
      },
      orderHistory: {
        url: endPoint.ORDER_HISTORY
      },
      orderHistoryDetails: {
        url: endPoint.ORDER_HISTORY_DETAILS
      },
      reOrder: {
        url: endPoint.RE_ORDER
      },
      fetchProduct: {
        url: endPoint.FETCH_PRODUCT
      },
      orderedProduct: {
        url: endPoint.ORDERED_PRODUCT
      },
      productSearch: {
        url: endPoint.PRODUCT_SEARCH
      },
      initialAddress: {
        url: endPoint.INITIAL_ADDRESS
      },
      getOptions: {
        url: endPoint.GET_OPTIONS
      },
      getAllOption: {
        url: endPoint.GET_ALL_OPTIONS
      },
      createAssembly: {
        url: endPoint.CREATE_ASSEMBLY
      },
      searchAssembly: {
        url: endPoint.SEARCH_ASSEMBLY
      },
      sendEmailRfq: {
        url: endPoint.SEND_EMAIL_RFQ
      },
      refreshToken: {
        url: endPoint.REFRESH_TOKEN
      },
      countryList: {
        url: endPoint.damEndpoint.countryList
      },
      categoriesJson: {
        url: endPoint.damEndpoint.categoriesJson
      },
      newUserRegistration: {
        url: endPoint.NEW_USER_REGISTRATION
      },
      checkoutGuestRegistration: {
        url: endPoint.CHECKOUT_GUEST_REGISTRATION
      },
      createAccountEmail: {
        url: endPoint.CREATE_ACCOUNT_EMAIL
      },
      calculatorUtility: {
        url: endPoint.damEndpoint.calculatorUtility
      },
      plpCategory: {
        url: endPoint.GET_PLPMODEL_CATEGORY
      },
      deliveryStatus: {
        url: endPoint.damEndpoint.deliveryStatusMapping
      }
    };

  // Active Cart
  function getActiveCart() {
    //const url = `${endPoint.ACTIVE_CART}?CTCustomerToken=${CUSTOMER_TOKEN}&bearertoken=${BEARER_TOKEN}`;
    return apiPromise.getPromiseObject({
      name: "activeCart",
      data: {
        CTCustomerToken: CUSTOMER_TOKEN,
        bearertoken: BEARER_TOKEN
      },
      method: "POST",
      cachedData: true
    });
  }

  // Holyday Calender response
  function holidayCalender() {
    return apiPromise.getPromiseObject({
      name: "calender",
      data: null,
      method: "GET",
      cachedData: true
    });
  }

  // Add to cart
  function addToCart(data) {
    //const object = objectMerge(data);

    return apiPromise.getPromiseObject({
      name: "addToCart",
      data: data,
      method: "PUT",
      cachedData: false
    });
  }

  // Remove Cart
  function removeCart(data) {
    const object = objectMerge(data);

    return apiPromise.getPromiseObject({
      name: "removeCart",
      data: object,
      method: "POST",
      cachedData: false
    });
  }

  // Update Cart
  function updateCart(data) {
    const object = objectMerge(data);

    return apiPromise.getPromiseObject({
      name: "updateCart",
      data: object,
      method: "POST",
      cachedData: false
    });
  }

  // Delivery Rate
  function getDeliveryRate(data) {
    return apiPromise.getPromiseObject({
      name: "deliveryRate",
      data: data,
      method: "POST",
      cachedData: false
    });
  }

  // Calculate Tax
  function getCalculatedTax(data) {
    return apiPromise.getPromiseObject({
      name: "calculatedTax",
      data: data,
      method: "POST",
      cachedData: false
    });
  }

  // Order History
  function getOrderHistory(data) {
    return apiPromise.getPromiseObject({
      name: "orderHistory",
      data: data,
      method: "POST",
      cachedData: false
    });
  }

  // Order History Details
  function getOrderHistoryDetails(data) {
    return apiPromise.getPromiseObject({
      name: "orderHistoryDetails",
      data: data,
      method: "GET",
      cachedData: true
    });
  }

  // Reorder
  function getReorder(data) {
    return apiPromise.getPromiseObject({
      name: "reOrder",
      data: data,
      method: "POST",
      cachedData: false
    });
  }

  // Fetch Product
  function getFetchProduct(data) {
    return apiPromise.getPromiseObject({
      name: "fetchProduct",
      data: data,
      method: "POST",
      cachedData: false
    });
  }

  // Ordered Product
  function getOrderedProduct(data) {
    return apiPromise.getPromiseObject({
      name: "orderedProduct",
      data: data,
      method: "POST",
      cachedData: false
    });
  }

  // Product Search
  function getProductSearch(data) {
    return apiPromise.getPromiseObject({
      name: "productSearch",
      data: data,
      method: "POST",
      cachedData: false
    });
  }

  // Initial Address
  function getInitialAddress(data) {
    return apiPromise.getPromiseObject({
      name: "initialAddress",
      data: data,
      method: "POST",
      cachedData: false
    });
  }

  // Send Email to RFQ Form
  function getSendEmailRfq(data) {
    return apiPromise.getPromiseObject({
      name: "sendEmailRfq",
      data: data,
      method: "GET",
      cachedData: false
    });
  }

  // Read Fedex and UPS Delivery Status from Json and map with ["Places", "Shipped", "out of Delivery", "Delivered"]
  function getDeliveryStatusMapping() {
    return apiPromise.getPromiseObject({
      name: "deliveryStatus",
      data: null,
      method: "GET",
      cachedData: false
    });
  }

  // Read Country List Json
  function getCountryList() {
    return apiPromise.getPromiseObject({
      name: "countryList",
      data: null,
      method: "GET",
      cachedData: true
    });
  }
  // Read Category Json
  function getCategoriesJson() {
    return apiPromise.getPromiseObject({
      name: "categoriesJson",
      data: null,
      method: "GET",
      cachedData: true
    });
  }

  // New User Registration
  function getNewUserRegistration(data) {
    return apiPromise.getPromiseObject({
      name: "newUserRegistration",
      data: data,
      method: "POST",
      cachedData: false
    });
  }

  // Check Out Guest User Registration
  function getGuestUserRegistration(data) {
    return apiPromise.getPromiseObject({
      name: "checkoutGuestRegistration",
      data: data,
      method: "POST",
      cachedData: false
    });
  }

  // Create Account
  function getCreateAccountEmail(data) {
    return apiPromise.getPromiseObject({
      name: "createAccountEmail",
      data: data,
      method: "GET",
      cachedData: false
    });
  }

  // Plp Modal category
  function getPlpModelCategory(data) {
    let dataMerge = objectMerge(data);
    return apiPromise.getPromiseObject({
      name: "plpCategory",
      data: dataMerge,
      method: "GET",
      cachedData: false
    });
  }

  // Refresh Token
  function getRefreshToken(data) {
    return apiPromise.getPromiseObject({
      name: "refreshToken",
      data: data,
      method: "POST",
      cachedData: false
    });
  }

  // return skuID
  function getSKUList(skuLists) {
    let skuList = [];
    let skuID = "";
    if (skuLists && skuLists.length) {
      skuLists.filter(function (skuId) {
        skuID = commonUtility().getSkuIdWithoutLength(skuId);
        skuList.push(skuID);
      });
    }
    return skuList;
  }
  // Return Algolia Response based on skuID and attributes
  function algoliaResponse(skuIdLists, attributes) {
    var client = window.algoliasearch(
      endPoint.algolia.API_ID,
      endPoint.algolia.API_KEY
    );
    var indexImg = client.initIndex(endPoint.algolia.indexInuse);
    return indexImg.getObjects(skuIdLists, {
      attributesToRetrieve: attributes || [
        "hierarchicalCategories",
        "seoName",
        "objectID",
        "assets.url",
        "color",
        "length"
      ]
    });
  }
  // Merge CT Response and Algolia Response
  function mergeResponse(totalLineItems, resp) {
    if (!totalLineItems || (!resp && !resp?.results)) {
      return;
    }
    return totalLineItems.map((item) => {
      const resp1Item = resp.results.find(function (respItem) {
        if (respItem) {
          return (
            (item?.variant?.sku || item?.custom?.fields?.masterSku) ===
            respItem.objectID
          );
        }
      });

      return { ...item, ...resp1Item };
    });
  }
  // url access
  function fetchAPICallCached() {
    const cachedPromiseObject = {};

    return {
      clearCache: (apiName) => {
        if (cachedPromiseObject.hasOwnProperty([apiName])) {
          cachedPromiseObject[apiName] = undefined;
        }
      },

      getPromiseObject: ({
        name: apiName,
        data: apiData,
        method: apiMethod,
        cachedData: apiCachedData
      }) => {
        const deferred = $.Deferred();

        if (!cachedPromiseObject.hasOwnProperty(apiName)) {
          if (apiCachedData) {
            cachedPromiseObject[apiName] = deferred;
          }

          $.ajax({
            type: apiMethod,
            url: APIS[apiName].url,
            data: apiData
          })
            .done((data) => deferred.resolve(data))

            .fail((error) => deferred.reject(error));

          return deferred;
        } else {
          return cachedPromiseObject[apiName];
        }
      }
    };
  }
  // Merging exiting object with token
  function objectMerge(data) {
    const token = {
      CTCustomerToken: CUSTOMER_TOKEN,
      bearerToken: BEARER_TOKEN
    };
    if (data) {
      return $.extend({}, token, data);
    } else {
      return token;
    }
  }

  //olcc starts here
  function getAllOptionOlcc(data) {
    return apiPromise.getPromiseObject({
      name: "getAllOption",
      data: {
        dataType: "json",
        jsonData: "",
        CTCustomerToken: CUSTOMER_TOKEN,
        bearertoken: BEARER_TOKEN
      },
      method: "POST",
      cachedData: false
    });
  }
  function getOptionsOlcc(data) {
    return apiPromise.getPromiseObject({
      name: "getOptions",
      data: data,
      method: "POST",
      cachedData: false
    });
  }
  function createAssemblyOlcc(data) {
    return apiPromise.getPromiseObject({
      name: "createAssembly",
      data: data,
      method: "POST",
      cachedData: false
    });
  }
  function searchAssemblyyOlcc(data) {
    return apiPromise.getPromiseObject({
      name: "searchAssembly",
      data: data,
      method: "POST",
      cachedData: false
    });
  }
  //olcc ends here.
  //rf-calculator
  function getCalUtility() {
    return apiPromise.getPromiseObject({
      name: "calculatorUtility",
      data: null,
      method: "GET",
      cachedData: true
    });
  }
  //rf-calculator ends here
  return {
    getActiveCart: getActiveCart,
    holidayCalender: holidayCalender,
    addToCart: addToCart,
    removeCart: removeCart,
    updateCart: updateCart,
    getDeliveryRate: getDeliveryRate,
    getCalculatedTax: getCalculatedTax,
    getOrderHistory: getOrderHistory,
    getOrderHistoryDetails: getOrderHistoryDetails,
    getReorder: getReorder,
    getFetchProduct: getFetchProduct,
    getOrderedProduct: getOrderedProduct,
    getProductSearch: getProductSearch,
    getInitialAddress: getInitialAddress,
    getSendEmailRfq: getSendEmailRfq,
    getDeliveryStatusMapping: getDeliveryStatusMapping,
    getCountryList: getCountryList,
    getCategoriesJson: getCategoriesJson,
    getSKUList: getSKUList,
    algoliaResponse: algoliaResponse,
    mergeResponse: mergeResponse,
    getNewUserRegistration: getNewUserRegistration,
    getGuestUserRegistration: getGuestUserRegistration,
    getCreateAccountEmail: getCreateAccountEmail,
    getAllOptionOlcc: getAllOptionOlcc,
    getOptionsOlcc: getOptionsOlcc,
    createAssemblyOlcc: createAssemblyOlcc,
    searchAssemblyyOlcc: searchAssemblyyOlcc,
    getCalUtility: getCalUtility,
    getPlpModelCategory: getPlpModelCategory,
    getRefreshToken: getRefreshToken
  };
})();
