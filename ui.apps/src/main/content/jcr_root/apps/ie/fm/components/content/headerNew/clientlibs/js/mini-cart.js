/* eslint-disable */
$(document).ready(function ($) {
  /**
   * @param {Component} $component
   */
  const miniCartSelector = "minicart__lineitems--count",
    $component = $(".order-details__minicart"),
    $miniCartFillup = $component.find(".minicart__data--fillup"),
    displayNone = "d-none",
    noOverFlow = "overflow-hidden",
    endPoint = $.fn.getAPIEndpoint(),
    isCustomerToken = $.fn.cookiesRead().customerToken(),
    miniCartListItems = ".minicart__listitems",
    SHOPPING_CART_RESPONSE = endPoint.customEvent.SHOPPING_CART_RESPONSE,
    SHOPPING_CART_FETCH = endPoint.customEvent.SHOPPING_CART_FETCH,
    SHOPPING_CART_UPDATE = endPoint.customEvent.SHOPPING_CART_UPDATE,
    SHOPPING_CART_ERROR = endPoint.customEvent.SHOPPING_CART_ERROR;

  /**
   * @param {Component} $miniCart
   * @param {Template Name}  $miniCart.find(".mini--cart")
   */
  $miniCartFillup.ieShoppingCart($component, $component.find(".mini--cart"));
  $component.on(
    SHOPPING_CART_FETCH,
    function (e, dataResponse, totalLineItems) {
      minicartMarkup(dataResponse, totalLineItems);
      qtyIncreaseAndDecrease($component);
    }
  );

  // Update the minicart template
  $(document).on(SHOPPING_CART_RESPONSE, function (e, response) {
    if (response && !response.errors) {
      $(document).trigger(SHOPPING_CART_UPDATE, response);
    }
  });

  // Update the minicart if no lineItems
  $component.on(SHOPPING_CART_ERROR, function () {
    miniCartEmpty();
  });

  // check if token exist in cookie
  if (!isCustomerToken) {
    miniCartEmpty();
  }

  /**
   * minicartMarkup(); Update Minicart Data
   * @param {Object} data
   */
  function minicartMarkup(data, totalLineItems) {
    var response = data;
    if (response.error) {
      console.log(response);
      return;
    }
    if (!response?.lineItems?.length && !response?.customLineItems?.length) {
      //change here
      miniCartEmpty();
      return;
    }

    var lineItemCount = totalLineItems.length;

    var $minCartBody = $component.find(".minicart__body");
    $minCartBody.css("height", "145px");
    $component.find(".minicart__count").text(lineItemCount);
    $(".cart-container .cart-counter").text(lineItemCount);
    // Temp Fix to update cart count on shopping cart page, will remove later
    if ($(".shopping__cart").find(".mycart_qty").length) {
      $(".shopping__cart").find(".mycart_qty").text(lineItemCount);
    }
    $(".cart-counter").addClass("d-inline");
    $(".cart-container").addClass(miniCartSelector);
    miniCartTotalPriceCalculate();
    $component.find(".minicart__empty").addClass(displayNone);
    $component
      .find(".minicart__empty")
      .closest(".minicart__body")
      .removeClass(noOverFlow);
    $component.find(".modal-footer").removeClass(displayNone);
  }

  /**
   * miniCartTotalPriceCalculate() SubTotal Price Manual Calculation
   */
  function miniCartTotalPriceCalculate() {
    const $miniCartListItems = $miniCartFillup.find(".minicart__listitems");
    if ($miniCartListItems.length === 0) {
      return;
    }
    let miniCartTotal = [];
    $miniCartListItems.map(function (index, item) {
      let $itemTotalPrice = $(item).find(".minicart__sub--totlaprice").text();
      let subPrice = $itemTotalPrice
        ? Number($itemTotalPrice.replaceAll(",", ""))
        : "";
      miniCartTotal.push(subPrice);
    });

    let miniCartTotalPrice = miniCartTotal.reduce((priceX, priceY) => {
      return priceX + priceY;
    });

    $component
      .find(".minicart__totalprice")
      .text(window.priceFormate.formateCheckout(miniCartTotalPrice));
  }
  /*
   * emptyMiniCart() IF response length is 0 then update minicart empty with 0 quantity
   */
  function miniCartEmpty() {
    $component.find(".minicart__data--fillup").empty();
    $component.find(".minicart__count").text(0);
    $(".cart-container").removeClass(miniCartSelector);
    $(".cart-counter").text("");
    $(".cart-counter").removeClass("d-inline");
    $component.find(".modal-footer").addClass(displayNone);
    $component
      .find(".minicart__body")
      .removeClass("minicart__hidden")
      .css("height", "220px");
    $component.find(".minicart__empty").removeClass(displayNone);
    $component
      .find(".minicart__empty")
      .closest(".minicart__body")
      .addClass(noOverFlow);
  }
  /**
   * qtyIncreaseAndDecrease() increase and decrease the quantity
   * @param {Component} $miniCart
   */
  function qtyIncreaseAndDecrease($miniCart) {
    var $listItems = $miniCart.find(miniCartListItems);
    // Plus Quantity
    $listItems.find(".minicart__plus").on("click", function (e) {
      var $currentEvent = $(e.currentTarget);
      $currentEvent.addClass("curser__none");
      var $listItem = $currentEvent.parents(miniCartListItems);
      var plus = Number($listItem.find(".minicart__qty").val());
      if (plus > 0 && plus < 99999) {
        var plusOne = plus + 1;
        quantityUpdate(plusOne, $listItem, $miniCart, $currentEvent);
      } else {
        $currentEvent.removeClass("curser__none");
      }
    });
    // Minus Quantity
    $listItems.find(".minicart__minus").on("click", function (e) {
      var $currentEvent = $(e.currentTarget);
      $currentEvent.addClass("curser__none");
      var $listItem = $currentEvent.parents(miniCartListItems);
      var plus = Number($listItem.find(".minicart__qty").val());
      if (plus > 1 && plus <= 99999) {
        var plusOne = plus - 1;
        quantityUpdate(plusOne, $listItem, $miniCart, $currentEvent);
      } else {
        $currentEvent.removeClass("curser__none");
      }
    });

    // Mouse Focus
    $listItems.find(".minicart__qty").on("focusout", function (e) {
      var $currentEvent = $(e.currentTarget);
      var $listItem = $currentEvent.parents(miniCartListItems);
      var inputValue = Number($listItem.find(".minicart__qty").val());
      quantityUpdate(inputValue, $listItem, $miniCart, $currentEvent);
    });
  }

  /**
   *quantityUpdate() Update quantity after click on plus/minus
   * @param {Number} plusOne
   * @param {DOM Element} $listItem
   * @param {Component} $miniCart
   * @param {currentTarget} $currentEvent
   */
  function quantityUpdate(plusOne, $listItem, $miniCart, $currentEvent) {
    $listItem.find(".minicart__qty").val(plusOne);
    let removeComma = $listItem
      .find(".minicart__price")
      .text()
      .replaceAll(",", "");
    var $miniCartPrice = parseFloat(removeComma);
    $listItem
      .find(".minicart__sub--totlaprice")
      .text(window.priceFormate.formateCheckout($miniCartPrice * plusOne));
    var lineItems = $listItem
      .find(".minicart__remove--item")
      .attr("data-lineitem-id");
    updateCartQuantity($miniCart, plusOne, lineItems, $currentEvent);
  }

  /**
   * updateCartQuantity() update Quantity after click on plus/minus/or enter value in input box
   * @param {Component} $miniCart
   * @param {Number} quantity
   * @param {String} lineItemId
   * @param {currentTarget} $currentEvent
   */
  function updateCartQuantity($miniCart, quantity, lineItemId, $currentEvent) {
    var isCustomLineItem = $currentEvent
      .parents(".minicart__listitems")
      .find(".removeItemLink")
      .attr("data-isitemcustom");
    const data = {
      qnty: quantity,
      id: lineItemId,
      isCustomLineItem: isCustomLineItem
    };
    window.getAPIModule
      .updateCart(data)
      .done(function (result) {
        if (result && !result.errors) {
          miniCartTotalPriceCalculate();
          $currentEvent.removeClass("curser__none");
        }
        //window.errorModule.checkError(result);
      })
      .fail(function (error) {
        console.log(error);
        window.errorModule.showErrorPopup(error);
      });
  }
});

/**
 * removeItemFromCart() Removing Line item from Cart
 * @param {Dom Element} event : target element
 */
function removeItemFromCart(event) {
  var crtLineItemId = $(event).attr("data-lineItem-id");
  let uint = $("#unit") ? $("#unit").val() : "";
  let isCustomLineItem = $(event).attr("data-isitemcustom");

  const data = {
    id: crtLineItemId,
    unitOfMeasurement: uint,
    isCustomLineItem: isCustomLineItem
  };
  // Pass URL and data to call removeCart Api
  window.getAPIModule
    .removeCart(data)
    .done(function (result) {
      if (result && !result.errors) {
        //code for anlaytic data tracking on remove
        productData = $(event).attr("data-analyticprod");
        productSlugVal = $(event).attr("data-analyticslug");
        productDetailsFinalArray = [];
        productDetailsArray = [];
        cabelAssemblyTestArray = [];
        productClickedSlug = "";
        cableAssemblyTest = "";
        if (productData) {
          productDetailsArray = productData.split("@@");
          for (i = 0; i < productDetailsArray.length; i++) {
            if (productDetailsArray[i] === "undefined") {
              productDetailsArray[i] = "";
            }
          }

          productDetailsFinalArray.push(productDetailsArray);
          productSlugVal
            ? (productClickedSlug = productSlugVal.split("_"))
            : (productClickedSlug = "");
          if (isCustomLineItem == "true" && productClickedSlug.length == 2) {
            $.each($(".minicart__remove--item"), function () {
              if (
                $(this).attr("data-analyticslug").split("_")[2] ==
                productClickedSlug[1]
              ) {
                cableAssemblyTest = $(this).attr("data-analyticprod");
              }
            });
            if (cableAssemblyTest != "") {
              cabelAssemblyTestArray = cableAssemblyTest.split("@@");
              for (i = 0; i < cabelAssemblyTestArray.length; i++) {
                if (cabelAssemblyTestArray[i] === "undefined") {
                  cabelAssemblyTestArray[i] = "";
                }
              }
              productDetailsFinalArray.push(cabelAssemblyTestArray);
            }
          }
          window.removecartDataLayer(productDetailsFinalArray, "mini-cart");
        }
        // Update MiniCart
        $(document).trigger(
          $.fn.getAPIEndpoint().customEvent.SHOPPING_CART_RESPONSE,
          result
        );
      }
    })
    .fail(function (error) {
      console.log(error);
      window.errorModule.showErrorPopup(error);
    });
}
