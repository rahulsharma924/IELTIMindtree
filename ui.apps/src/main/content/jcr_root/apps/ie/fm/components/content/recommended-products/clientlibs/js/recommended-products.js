$(document).ready(function () {
  let labelData, callUs, contactNumber, addToCart, recommededTitle;
  // Utility JSON
  window.getUTILITYModule
    .getUtility()
    .done(function (response) {
      labelData = response ? response[0] : [];
      callUs = labelData.labels.callUs;
      contactNumber = labelData.labels.contactNumber;
      addToCart = labelData.labels.addToCart;
      recommededTitle = labelData.labels.recommededTitle;
      $(".recommended-title").text(recommededTitle);
    })

    .fail(function (error) {});

  const recommend = window["@algolia/recommend"];
  const recommendClient = recommend(algId, algApi);
  const { relatedProducts } = window["@algolia/recommend-js"];
  //let recomendSku = window.location.pathname.split(".")[1];
  //let recommendurlArr = recomendSku.replace(/\--/g, '/');

  let url = window.location.href;
  let dotCount = (url.match(/\./g) || []).length;
  let splitUrl = url.split(/\./g, dotCount + 1);
  let stringBeforeDot = splitUrl[splitUrl.length - 2];
  //let recommendurlArr = stringBeforeDot?.replace(/\--/g, "/") ?? "";
  let recommendurlArr = $("#pdpSku").text() ? $("#pdpSku").text() : "";
  var objectID = recommendurlArr;

  var skuIds;
  window.getAPIModule
    .getActiveCart()
    .done(function (response) {
      //window.errorModule.checkError(response);
      updateRecommendedProduct(response);
    })
    .fail(function (error) {
      window.errorModule.showErrorPopup(error);
    });

  var currentitemdata = [];
  function RelatedItem({ item }) {
    const itemdata = item;
    currentitemdata.push(itemdata);
    if (currentitemdata.length > 0) {
      $(".recommended-title").removeClass("d-none");
    }

    if (itemdata.inventory == 0) {
      $(".relatedProducts .product-grid").addClass("available");
    }

    function setMax(availablecount) {
      var keyedVal = $(this).val();
      var maxavail = $(this).attr("dat-avail");
      if (keyedVal > maxavail) {
        $(this).val(maxavail);
      }
    }

    if (currentitemdata.length > 4) {
      return false;
    } else {
      $(".relatedProducts")
        .append(`<div class="aem-GridColumn aem-GridColumn--default--12 aem-GridColumn--tablet--12
        aem-GridColumn--phone--12 col-md-6 col-lg-3 recommended-wrapper">
        <div class="category-products prod-flex">
          <div class="prod-item">
            <div class="search-panel tile-view">
              <div class="ais-Hits-item">
                <div class="product-grid">
                  <div class="plp-viewcol-1">
                    <div class="product-image-wrapper">
                      <div class="product-image">
                        <div class="tile-prod-labels">
                          <span class="algolia-rohs">
                          ${
                            itemdata.roHSStatus == "Compliant" &&
                            itemdata.roHSStatus != undefined
                              ? `<span class="label-rohs"><i class="fa fa-check"></i>&nbsp;ROHS</span>`
                              : ``
                          }
                          </span>
                          <span class="algolia-new">
                          ${
                            itemdata.isNew
                              ? `<span class="label-new">New</span>`
                              : ``
                          }
                          </span>

                        </div>
                        <a data-object="${itemdata.objectID}" class="store-obj"
                          href="${SeoUrl(itemdata)}" title="${itemdata.name}">
                          <img id="plp-img" src="${getImage(itemdata)}" alt="${
        itemdata.seoName
      } ${brandName} ${itemdata.brandSKU}" />
                        </a>
                      </div>
                      <div class="label-title-wrapper">
                        <div class="algolia-product-labels">
                        <span class="algolia-qty">
                        ${
                          itemdata.inventory > 0
                            ? `${formatNumber(itemdata.inventory)} available`
                            : `<a href="tel:${contactNumber}" title="${contactNumber}" class="no-stock-label call-link">${callUs}</a>`
                        }

                        </span>
                          <span class="algolia-rohs"> </span>
                          <span class="algolia-new"> </span>
                        </div>
                        <h2 class="algolia-product-name">
                          <a class="store-obj" data-object="${
                            itemdata.objectID
                          }" title="${itemdata.name}"
                            href="${SeoUrl(itemdata)}">${itemdata.name}</a>
                        </h2>
                      </div>
                    </div>
                    <div class="algolia-datasheet recommend-datasheet">
                      <a title="Datasheet" href="${getdataSheet(
                        itemdata
                      )}" target="_blank"><i class="fa fa-file-text-o" aria-hidden="true"></i>
                        Datasheet</a>
                    </div>
                    <div class="compare-box-new">
                      <input id="30053" class="" type="checkbox" /><label for="30053">Compare</label>
                    </div>
                  </div>
                  <div class="plp-viewcol-2 plp-actions">
                    <div class="sku-label">
                      <span class="label-txt">SKU</span>
                      <span class="label-value">${itemdata.objectID}</span>
                    </div>
                    <div class="price-label">
                      <span class="label-txt">Starting price</span>
                      <span class="label-value">${
                        itemdata.startingPrice &&
                        itemdata.startingPrice != undefined
                          ? "&#36;" + formatPrice(itemdata.startingPrice)
                          : ``
                      }</span>
                    </div>
                    <div class="delivery-label">
                      <span class="label-txt">Estimated shipment</span>
                      <span class="label-value estimetedshipment"></span>
                    </div>
                    <div class='wrap'>
                    ${
                      itemdata.inventory < 0 && itemdata.isSellable == "false"
                        ? `<div class="nostock-action more">
                    <a title="Learn More" class="ie-learn-more-btn more-btn" data-object="${
                      itemdata.objectID
                    }" href="${SeoUrl(itemdata)}">Learn More</a>
                  </div>

                    `
                        : ` <div class="add-to-cart">
                    <div class="qty">
                      <button class="cart-qty-minus"  type="button" onclick='addminus(this)'><span class="dec-val"> -
                        </span></button>
                      <input type="number" class="qty_num" name="qty_num" value="1"
                      min="1"  oninput="validity.valid||(value='')" maxlength="5"
                      dat-avail="${itemdata.inventory}" max="${
                            itemdata.inventory
                          }"
                      onchange="changeQuantityAttribute(this)" onblur="checkValidationQuantity(this)"
                      />
                      <button class="cart-qty-plus" data-plusbtn='plusbtn' alt='lorem ipsum'   type="button" onclick="addplus(this)" ><span class="inc-val"> +
                        </span></button>
                    </div>
                    <button type="button" onclick="addtocartSpecific(this)" class="ie-primary-btn cart-button add_to_cart" data-sku="${
                      itemdata.objectID
                    }"
                      data-currency="USD" data-cartqty="1" data-analyticcartprod="${
                        itemdata.brandSKU +
                        "@@" +
                        itemdata.name +
                        "@@" +
                        itemdata.productId +
                        "@@" +
                        itemdata.unitPrice +
                        "@@" +
                        itemdata.startingPrice +
                        "@@" +
                        itemdata.length +
                        "@@" +
                        itemdata.color +
                        "@@" +
                        itemdata.bestSellerRank +
                        "@@" +
                        itemdata.inventory +
                        "@@" +
                        itemdata.category +
                        "@@pdp - recommended products"
                      }">
                      ${addToCart}
                    </button>
                    </div>
                </div>
                    `
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>`);
    }

    //Shipping Date
    $(".estimetedshipment").html(
      window.estimatedShipment.getEstimatedShipmentDate()
    );
  }
  function updateRecommendedProduct(skudata) {
    const variant = window.getAPIModule.getSKUList(skudata.lineItems);

    if (!variant) {
      return;
    }
    if (variant && variant.length) {
      skuIds = variant;
    }
    // });
    relatedProducts({
      container: "#relatedProducts",
      recommendClient,
      indexName: indexInuse,
      maxRecommendations: 4,
      objectIDs: skuIds,
      itemComponent: RelatedItem
    });
  }

  if (recommendurlArr && $("#pdp-data").length > 0) {
    relatedProducts({
      container: "#relatedProducts",
      recommendClient,
      indexName: indexInuse,
      maxRecommendations: 4,
      objectIDs: [objectID],
      itemComponent: RelatedItem
    });
  }
});
