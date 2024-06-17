/*******************************************************************************
 * Copyright 2022 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
(function () {
  "use strict";

  var dataLayerEnabled;
  var dataLayer;

  /**
   * Adds Click Event Listener to the main <div> of the Text Components
   */
  function addClickEventListenerToTextComponents() {
    var componentMainDivs = document.getElementsByClassName("cmp-text");

    for (var i = 0; i < componentMainDivs.length; i++) {
      componentMainDivs[i].addEventListener("click", addClickedLinkToDataLayer);
    }
  }

  /**
   * Adds clicked link contained by the Text Component to Data Layer
   *
   * @private
   * @param {Object} event The Click event
   */
  function addClickedLinkToDataLayer(event) {
    var element = event.currentTarget;
    var componentId = getDataLayerId(element);

    if (event.target.tagName === "A") {
      dataLayer.push({
        event: "cmp:click",
        eventInfo: {
          path: "component." + componentId,
          link: event.target.getAttribute("href"),
        },
      });
    }
  }

  /**
   * Parses the dataLayer string and returns the ID
   *
   * @private
   * @param {HTMLElement} item, the Text item
   * @returns {String} dataLayerId or undefined
   */
  function getDataLayerId(item) {
    if (item) {
      if (item.dataset.cmpDataLayer) {
        return Object.keys(JSON.parse(item.dataset.cmpDataLayer))[0];
      } else {
        return item.id;
      }
    }
    return null;
  }

  function onDocumentReady() {
    dataLayerEnabled = document.body.hasAttribute(
      "data-cmp-data-layer-enabled"
    );
    dataLayer = dataLayerEnabled
      ? (window.adobeDataLayer = window.adobeDataLayer || [])
      : undefined;

    if (dataLayerEnabled) {
      addClickEventListenerToTextComponents();
    }
  }

  if (document.readyState !== "loading") {
    onDocumentReady();
  } else {
    document.addEventListener("DOMContentLoaded", onDocumentReady);
  }
})();

// Cart item and price increment starts here

$(document).ready(function () {
  $(".qtyplus").on("click", function () {
    var itemCount = $(this).closest("div.product-count").find(".Itemqty").val();

    var updatedItemCount = parseInt(itemCount) + 1;

    $(this).closest("div.product-count").find(".Itemqty").val(updatedItemCount);

    var itemMultiPrice = $(this)
      .closest("div.cartItem")

      .find(".itemMultiPrice")

      .text();

    var total = $(this).closest("div.cartItem").find(".itemPrice");

    total.html("$" + (updatedItemCount * itemMultiPrice).toFixed(2));

    const subtotalInnerVal = $(".subtotalValue").text();

    var finalTotal = parseInt(subtotalInnerVal) + parseInt(itemMultiPrice);

    $(".itemSubTotal span").html(finalTotal.toFixed(2));
  });

  // Cart item and price increment ends here

  // Cart item and price decrement starts here

  $(".qtyminus").on("click", function () {
    var inputboxval = $(this)
      .closest("div.product-count")
      .find(".Itemqty")
      .val();

    var updatedItemCount = inputboxval - 1 < 1 ? 1 : inputboxval - 1;

    $(this).closest("div.product-count").find(".Itemqty").val(updatedItemCount);

    var itemMultiPrice = $(this)
      .closest("div.cartItem")

      .find(".itemMultiPrice")

      .text();

    var total = $(this).closest("div.cartItem").find(".itemPrice");

    total.html("$" + (updatedItemCount * itemMultiPrice).toFixed(2));

    if (inputboxval > 1) {
      const subtotalInnerVal = $(".subtotalValue").text();

      var finalTotal = parseInt(subtotalInnerVal) - parseInt(itemMultiPrice);

      $(".itemSubTotal span").html(finalTotal.toFixed(2));
    }
  });

  // On hover open modal

  /* $(".cart-container").hover(function () {

    $("#miniCartDetailsPopup").modal("show");

  });*/

  const windoMatch = window.matchMedia("(min-width: 1024px)");
  if (windoMatch.matches) {
    // If media query matches
    $(".cart-container").hover(function () {
      $("#miniCartDetailsPopup").modal("show");
    });
  }
});

// Cart item and price decrement ends here

function validatethecartnavigation() {
  var viewcartnavigate = document.getElementsByClassName("cart-counter");
  //viewcartnavigate= 3;
  if (viewcartnavigate == 0) {
    window.location.href = "/content/fm/en/shoppingcartempty.html";
  } else {
    window.location.href = "/content/fm/en/continue-shopping.html";
  }
}
