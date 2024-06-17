
// Cart item and price increment starts here

$(document).ready(function () {

    $(".checkout-qtyplus").on("click", function () {
  
      var itemCount = $(this).closest("div.product-count").find(".checkout-Itemqty").val();
  
      var updatedItemCount = parseInt(itemCount) + 1;
  
      $(this).closest("div.product-count").find(".checkout-Itemqty").val(updatedItemCount);
  
      var itemMultiPrice = $(this)
  
        .closest("div.checkout-cartItem")
  
        .find(".checkout-itemMultiPrice")
  
        .text();
  
      var total = $(this).closest("div.checkout-cartItem").find(".itemPrice");
  
      total.html("$" + (updatedItemCount * itemMultiPrice).toFixed(2));
  
  
  
      const subtotalInnerVal = $(".subtotalValue").text();
  
      var finalTotal = parseInt(subtotalInnerVal) + parseInt(itemMultiPrice);
  
      $(".itemSubTotal-value span").html(finalTotal.toFixed(1));
  
    });
  
    // Cart item and price increment ends here
  
  
  
    // Cart item and price decrement starts here

    $(".checkout-qtyminus").on("click", function () {
  
      var inputboxval = $(this).closest("div.product-count").find(".checkout-Itemqty").val();
  
      var updatedItemCount = inputboxval - 1 < 1 ? 1 : inputboxval - 1;
  
      $(this).closest("div.product-count").find(".checkout-Itemqty").val(updatedItemCount);
  
      var itemMultiPrice = $(this)
  
        .closest("div.checkout-cartItem")
  
        .find(".checkout-itemMultiPrice")
  
        .text();
  
      var total = $(this).closest("div.checkout-cartItem").find(".itemPrice");
  
      total.html("$" + (updatedItemCount * itemMultiPrice).toFixed(2));
  
      if (inputboxval > 1) {
  
        const subtotalInnerVal = $(".checkout-subtotalValue").text();
  
        var finalTotal = parseInt(subtotalInnerVal) - parseInt(itemMultiPrice);
  
        $(".itemSubTotal-value span").html(finalTotal.toFixed(1));
  
      }
  
    });
    