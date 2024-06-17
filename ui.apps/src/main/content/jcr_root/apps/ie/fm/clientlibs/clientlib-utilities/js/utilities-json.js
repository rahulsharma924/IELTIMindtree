var getUTILITYModule = (function () {
  // Read Utility Json
  let utilityMessage = window.utilityMessage || {};
  const apiPromise = fetchAPICallCached(),
  APIS = {
    utility: {
      url: "/content/dam/infinite-electronics/json/fairview-microwave/utilities.json"
    }
  };
  function getUtility() {
    return apiPromise.getPromiseObject({
      name: "utility",
      data: null,
      method: "GET",
      cachedData: true
    });
  }

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
        cachedData: apiCachedData,
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
  
    getUtility()
    .done(function (data) {
      window.utilityMessage = data ? data[0] : [];
    })
    .fail(function (error) {});
    return {
      getUtility: getUtility
    }
    
})();
