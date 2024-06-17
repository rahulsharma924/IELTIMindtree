$(document).ready(function () {
  const isCustomerTokenValue = window.isCustomerToken();
  const isOnlyCustomerToken = window.isOnlyCustomerToken();
  if (!isOnlyCustomerToken) {
    $(".logged-in-users").addClass("tokenActive");
    $(".logged-in-users").removeClass("tokenActive");
    $(".guest-users").addClass("d-none");
  } else {
    $(".guest-users").addClass("d-none");
    $(".guest-users").removeClass("d-none");
    $(".logged-in-users").addClass("tokenActive");
  }
  if (isOnlyCustomerToken) {
    getViewOrder(isCustomerTokenValue);
  }
});

/*
 * getViewOrder(): Get View order Detilas
 *
 */
function getViewOrder(isCustomerToken) {
  const data = {
    CTCustomerToken: isCustomerToken,
    pastDays: 365,
    pageSize: 6,
    bearertoken: window.getbearerToken()
  };
  window.getAPIModule
    .getFetchProduct(data)
    .done(function (response) {
      //window.errorModule.checkError(response);
      if (response && response.length && !response.error) {
        quickOrderMarkup(response);
      }
    })
    .fail(function (error) {
      //return error;
      window.errorModule.showErrorPopup(error)
    });
}

/**
 * quickOrderMarkup() // Quick Order Data Markup Created
 */
function quickOrderMarkup(data) {
  var $quickOrder = $(".view__quick--order");
  if (!$quickOrder) {
    return;
  }
  var $quickOrderCards = $quickOrder.find(".view__quick--order--card");
  $.each(data[0], function (index, item) {
    var analyticData =
      item.brandSKU +
      "@@" +
      item.name +
      "@@" +
      item.productId +
      "@@" +
      item.unitPrice +
      "@@" +
      item.startingPrice +
      "@@" +
      item.length +
      "@@" +
      item.color +
      "@@" +
      item.bestSellerRank +
      "@@" +
      item.inventory +
      "@@" +
      item.category +
      "@@quickorder-homepage";
    var $quickOrderCard = $quickOrderCards.clone(true);
    $quickOrderCard
      .find(".add_to_cart")
      .attr("data-sku", item.brandSKU)
      .attr("data-currency", item.currencyCode)
      .attr("data-analyticcartprod", analyticData);
    $quickOrderCard.find(".description").text(item.name || item.shortDesc);
    $quickOrderCard
      .find(".view__quick--order--image img")
      .attr("src", getImage(item))
      .attr("alt", item.seoName + brandName + item.brandSKU);
    $quickOrder.find(".view__quick--fillup").append($quickOrderCard);
    $quickOrderCard.removeClass("d-none");
  });
  $(".quickreorder_main").removeClass("quick__order--hidden");
}
