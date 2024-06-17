(function ($) {
  const APIModule = window.getAPIModule,
    endPoint = $.fn.getAPIEndpoint(),
    SHOPPING_CART_FETCH = endPoint.customEvent.SHOPPING_CART_FETCH,
    SHOPPING_CART_ERROR = endPoint.customEvent.SHOPPING_CART_ERROR,
    SHOPPING_CART_UPDATE = endPoint.customEvent.SHOPPING_CART_UPDATE,
    $cartContainer = $(".cart__section"),
    MINICART_DISABLED = "minicart__disabled",
    isCustomerToken = $.fn.cookiesRead().customerToken();
  let activeCartResponse = {};
  if (window.location.href.includes("continue-shopping")) {
    activeCartResponse = window.getAPIModule.getActiveCart();
  }
  $.fn.ieShoppingCart = function ($component, templateName) {
    const that = this;

    const init = function () {
      fetchAndRenderSummary();
    };

    const render = function (dataResponse) {
      let lineItems;
      if (
        (dataResponse && dataResponse?.errors && dataResponse?.errors.length) ||
        dataResponse.statusCode === 401
      ) {
        $component.trigger(SHOPPING_CART_ERROR, dataResponse);
        return;
      }

      if (
        !dataResponse?.lineItems?.length &&
        !dataResponse?.customLineItems?.length
      ) {
        $component.trigger(SHOPPING_CART_ERROR, dataResponse);
        return;
      }

      // Reading Template
      let dataHandlebar = templateName.html();

      let totalLineItemsData = [
        ...dataResponse.lineItems,
        ...dataResponse.customLineItems
      ];
      let totalLineItems = commonUtility().responseFilter(totalLineItemsData);

      const skuList = APIModule.getSKUList(totalLineItems);

      if (!skuList || !skuList.length) {
        $component.trigger(SHOPPING_CART_ERROR, dataResponse);
        return;
      }

      //Algolia Response pass attributes and skuList
      const attributes = [
        "hierarchicalCategories",
        "seoName",
        "objectID",
        "assets",
        "color",
        "length",
        "bestSellerRank",
        "category",
        "startingPrice",
        "inventory",
        "isDiscontinued",
        "isPublished",
        "isOversized",
        "categorySEOURL"
      ];
      APIModule.algoliaResponse(skuList, attributes).then(
        (resp) => {
          // Merge CT Response and Algolia Response
          const mergedResponse = APIModule.mergeResponse(totalLineItems, resp);

          lineItems = mergedResponse;
          // Check if Minicart Enabled or Disbaled from page properties
          if (window.miniCartDisabled === "false") {
            let template = window.Handlebars.compile(dataHandlebar);
            that.html(template({ lineItems }));
            $cartContainer.removeClass(MINICART_DISABLED);
          } else {
            $cartContainer.addClass(MINICART_DISABLED);
          }

          // Call the function once template generated
          $component.trigger(SHOPPING_CART_FETCH, [
            dataResponse,
            totalLineItems
          ]);
        },
        (error) => {
          // After Algolia Fails we need re-initialize the template with CT Response
          lineItems = totalLineItems;
          // Check if Minicart Enabled or Disbaled from page properties
          if (window.miniCartDisabled === "false") {
            let template = window.Handlebars.compile(dataHandlebar);
            that.html(template({ lineItems }));
            $cartContainer.removeClass(MINICART_DISABLED);
          } else {
            $cartContainer.addClass(MINICART_DISABLED);
          }

          $component.trigger(SHOPPING_CART_FETCH, [
            dataResponse,
            totalLineItems
          ]);
        }
      );
    };
    const fetchAndRenderSummary = function () {
      if (isCustomerToken) {
        const cartApiResponse = Object.keys(activeCartResponse).length
          ? activeCartResponse
          : window.getAPIModule.getActiveCart();
        cartApiResponse.done(render);
      } else {
        $component.trigger(SHOPPING_CART_ERROR, {});
      }

      // Update template after remove/update/add in cart
      $(document).on(SHOPPING_CART_UPDATE, function (e, response) {
        if (response.error) {
          return;
        }
        if (response?.lineItems?.length || response?.customLineItems?.length) {
          render(response);
        } else {
          $component.trigger(SHOPPING_CART_ERROR, response);
        }
      });
    };
    return this.each(function () {
      init();
    });
  };
})(jQuery);
