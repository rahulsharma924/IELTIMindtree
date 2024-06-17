$(document).ready(function ($) {
  const urlParams = new URLSearchParams(window.location.search),
    orderId = urlParams.get("order_id"),
    customer_token = window.isCustomerToken(),
    utilityMethod = commonUtility(),
    data = {
      order_id: orderId,
      customer_token: customer_token,
      bearertoken: window.getbearerToken()
    },
    $reorderButton = $(".reorder-button");
  window.getAPIModule.getOrderHistoryDetails(data).then((data) => {
    if (data && !data.statusCode) {
      const totalItems = [...data.lineItems, ...data.customLineItems];
      let totalLineItems = utilityMethod.responseFilter(totalItems);
      $("#orderDate").text(utilityMethod.dateFormate(data?.custom?.fields?.creationDate));
      $("#orderNum").text(data.orderNumber);
      $("#totalPrice").text("$" + data["totalPrice"]["number"]);
      $("#items").text(totalLineItems.length);
      $("#po").text(data?.custom?.fields?.purchaseOrderNumber || "-");
      $(".order-status-text span").text(
        statusCodeMapping(data?.custom?.fields)
      );
      reorder($reorderButton);
      // check if item published or not from algolia
      const skuId = getAPIModule.getSKUList(totalLineItems);

      getAPIModule
        .algoliaResponse(skuId, ["isSellable"])
        .then((response) => {
          let isSellable = true;
          let isSellableObj = response.results.find((item) => {
            if (item !== null) return item.isSellable;
          });
          if (isSellableObj !== undefined)
            isSellable = isSellableObj.isSellable;
           let isNotSellableObj = response.results.filter((item) => {
            if (item !== null) return !item.isSellable;
           });
          if (isNotSellableObj !== undefined && (isNotSellableObj.length == response.results.length)) isSellable = false;
          if (isSellable) {
            $reorderButton.attr("data-item-published", true);
          } else {
            $reorderButton
              .addClass("button--disabled")
              .attr("data-item-published", false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });

  // Order Status Updated
  function statusCodeMapping(statusCode) {
    if (statusCode) {
      if (statusCode.status === "P") {
        return "Processing";
      } else if (statusCode.status === "O") {
        return "Open";
      } else if (statusCode.status === "C") {
        return "Closed/Complete";
      } else if (statusCode.status === "V") {
        return "Void";
      } else if (statusCode.status === "N") {
        return "New web order";
      } else if (statusCode.status === "H") {
        return "Hold";
      } else {
        return "";
      }
    }
  }

  /**
   * reorderHandler
   */
  function reorder($reorderButton) {
    $reorderButton.click(function () {
      getReorderDetailsData(customer_token, orderId);
    });
  }

  /**
   * getReorderDetailsData(); return the Response after click on reorder link and redirect to continue-shopping URL
   * @access private
   * @param {String} [orderId , customerTocken]
   * @returns {Object}
   */
  function getReorderDetailsData(customerToken, orderId) {
    const data = {
      customer_token: customerToken,
      order_id: orderId,
      bearerToken: window.getbearerToken() ? window.getbearerToken() : ""
    };
    window.getAPIModule
      .getReorder(data)
      .done(function (response) {
        //window.errorModule.checkError(response);
        if (response && response != "" && !response.errors && !response.error) {
          // Add anonymous token
          if (!customerToken) {
            document.cookie =
              "anonymousCustomerInfo=" +
              JSON.stringify(response.anonymousToken);
          }

          // Update MiniCart
          $(document).trigger(
            $.fn.getAPIEndpoint().customEvent.SHOPPING_CART_RESPONSE,
            response?.cart
          );
          //analytics code here
          customlineitems = response.cart.customLineItems;
          lineitems = response.cart.lineItems;
          let addTocartProductArr = [];
          if (customlineitems?.length > 0 || lineitems?.length > 0) {
            addTocartProductArr = [...customlineitems, ...lineitems];
          }
          addToCartAllProdDL(
            addTocartProductArr,
            (quantity = ""),
            (rfcaTesting = ""),
            (pageCategory = "order-history-details")
          );
        }
      })
      .fail(function (error) {
        window.errorModule.showErrorPopup(error)
      });
  }
  $("#myacclink-subheading-oh").find("p a").addClass("current");
});
