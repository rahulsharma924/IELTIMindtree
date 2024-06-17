$(document).ready(function () {
  const brandName = "Fairview Microwave";

  function recentViewHome(utilityMessage) {
    let recentViewArrHome;
    $algolia.recentViewData();

    if ($algolia.recentViewData().length > 0) {
      recentViewArrHome = $algolia.recentViewData() || [];

      //make algolia call to get data
      let client = algoliasearch(algId, algApi);
      let index = client.initIndex(indexInuse);
      index
        .getObjects(recentViewArrHome, {
          attributesToRetrieve: [
            "objectID",
            "assets",
            "name",
            "brandSKU",
            "startingPrice",
            "productId",
            "unitPrice",
            "length",
            "color",
            "bestSellerRank",
            "inventory",
            "category",
            "hierarchicalCategories",
            "seoName",
            "categorySEOURL",
            "isDiscontinued",
            "isMasterCA",
            "isBlockedForSale"
          ]
        })
        .then(({ results }) => {
          var ritemList = document.getElementById("multilist");

          //results.forEach((item) => {
          $.each(results, function (i, item) {
            if (item) {
              ritemList.innerHTML += `
       <div class="view-tr rview-data">
              <div class="view-td view-img"><a title="${
                item.name
              }" href="${SeoUrl(item)}"><img src="${getImage(item)}" alt="${
                item.seoName
              } ${brandName} ${item.brandSKU}" /></a></div>
              <div class="view-td"><span class="mob-hidden view-ellipsis"><a title="${
                item.name
              }" href="${SeoUrl(item)}">${item.name}</a></span></div>
              <div class="view-td"><span class="ellipsis-text" title="${
                item.brandSKU
              }">${item.brandSKU}</span></div>
              <div class="view-td text-align-price"><span class="label-value"><i>$</i>${$algoliaWidget.formatPrice(
                item.startingPrice
              )}</span>
                </div>
              <div class="view-td btn-add-cart">
              ${
                item.isMasterCA == true ||
                item.isBlockedForSale == true ||
                (item.inventory <= 0 && item.isDiscontinued == true)
                  ? `<button class="cta-cart addtocart"   title="${utilityMessage?.labels?.viewProduct}">${utilityMessage?.labels?.viewProduct}</button>`
                  : `<button class="cta-cart addtocart add_to_cart" data-sku="${
                      item.brandSKU
                    }" data-cartqty="" data-currency="${
                      item.currencyCode ? item.currencyCode : ""
                    }" data-cartqty="" data-analyticcartprod="${
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
                      "@@recentview-homepage"
                    }" title="${
                      utilityMessage?.labels?.addToCart
                    }" onclick="addtocartSpecific(this)">${
                      utilityMessage?.labels?.addToCart
                    }</button>`
              }                            
              </div>
            </div>
       `;
              return i < 4;
            }
          });
          if (results.length > 4) {
            $(
              '<div class="view-tr last-tr"><div class="view-td"><a title="View All Products" class="view-all-link" href="/content/fm/en/recently-viewed-products.html">View All Products</a></div></div>'
            ).appendTo($("#multilist"));
          }
        });
    } else {
      $(".recentviews-home").addClass("hide");
    }
  }

  if ($("#recentviewshome-data").length > 0) {
    window.getUTILITYModule
      .getUtility()
      .done(function (data) {
        recentViewHome(data[0]);
      })
      .fail(function (error) {});
  }
});
