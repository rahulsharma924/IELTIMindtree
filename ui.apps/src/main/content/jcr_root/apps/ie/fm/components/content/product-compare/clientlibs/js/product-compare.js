$(document).ready(function () {
  /* global instantsearch algoliasearch */
  var client = algoliasearch(algId, algApi);
  var index = client.initIndex(indexInuse);

  //const prodArray = ["MTAC206", "MT1AC206", "MT1AC206", "MT1AC206"];
  var prodArray = localStorage.getItem("compArr");

  const BRAND_NAME = brandName ? brandName : "Fairview Microwave";

  if (prodArray != null) {
    var compFinalarr = JSON.parse(prodArray);

    //show only last 4 items added to compare

    var maxNumber = 4;
    var arrLength = compFinalarr.length;
    if (arrLength > maxNumber) {
      compFinalarr.splice(0, arrLength - maxNumber);
    }
  } else {
    var compFinalarr = [];
    window.location.replace(document.referrer);
  }

  //Get data from local storage and filter only unique values

  index
    .getObjects(compFinalarr, {
      attributesToRetrieve: [
        "objectID",
        "name",
        "seoName",
        "assets",
        "isNew",
        "pricingTiers",
        "webDesc",
        "keySpecs",
        "unitPrice",
        "inventory",
        "bestSellerRank",
        "category",
        "color",
        "productId",
        "length",
        "brandSKU",
        "isOversized",
        "categorySEOURL"
      ]
    })
    .then(({ results }) => {
      //code for anlytic data collection
      let analyticResult;
      analyticResult = results;
      compareProdDataLayer(analyticResult);

      let itemList = document.getElementById("compare-prod");
      results.forEach((item) => {
        let pricingTiersList = "";
        let pricingTiersLast = "";
        let pricingTiersRow = item.pricingTiers.length - 1;
        if (
          typeof item.pricingTiers != "undefined" &&
          item.pricingTiers != ""
        ) {
          item.pricingTiers.forEach((item1, index) => {
            if (index < pricingTiersRow) {
              pricingTiersList += `<li>
                      <span>
                      ${item1.lowQuantity}-${item1.highQuantity}</span>
                      <span><strong>$${item1.price}</strong></span>
                    </li>`;
            }
          });

          pricingTiersLast = `<li>
                      <span>${item.pricingTiers[pricingTiersRow].lowQuantity}+</span>
                      <span><strong>Call</strong></span>
                    </li><li>
                      For larger quantities, please call for quote. * All Prices
                      are in US Dollars and do not include duties
                    </li>`;
        } else {
          pricingTiersList = `<li>
                      <span>NA</span>
                      <span><strong>NA</strong></span>
                    </li>`;
        }
        let keySpecsList = "";
        if (typeof item.keySpecs != "undefined") {
          item.keySpecs.forEach((item1) => {
            keySpecsList += `<li>
                      <span><strong>${item1.name}</strong></span>
                      <span>${item1.value}</span>
                    </li>`;
          });
        } else {
          keySpecsList = `<li>
                      <span><strong>NA</strong></span>
                      <span>NA</span>
                    </li>`;
        }

        itemList.innerHTML += `
   <div class="compare-item" data-compare="${getImage(
     item
   )}" data-id="${item.objectID.replace(/\//g, "-")}">
              <button class="rem_${item.objectID.replace(
                /\//g,
                "-"
              )} compare-remove-btn ie-primary-link">Remove</button>
            
            <div class="compare-img-sec">
              <a title="${item.name}" href="${SeoUrl(
          item
        )}"><img src="${getImage(item)}" alt="${
          item.name ? textSlice.textSliceWithLimit(item.name, 40) : ""
        } ${BRAND_NAME} ${item.brandSKU ? item.brandSKU : ""}" /></a>
              <div class="tile-prod-labels">
              ${
                item.isOversized
                  ? `<span class="label-new freight-label"><span class="fr-tool-tip">Due to this products weight or size, it will be shipped via Freight.<i class="fa-solid fa-caret-down"></i></span>Freight</span>`
                  : ``
              }
                ${item.isNew ? `<span class="label-new">New</span>` : ``}
              </div>
            </div>
            <a class="title_anch"  title=${item.name}" href="${SeoUrl(item)}">
            <span class="compare-desc ellipsis-90">${item.name}</span></a>
            <button title="Add to Cart" data-sku="${
              item.brandSKU
            }" data-currency="" data-quantity="" onclick="addtocartSpecific(this);" class="ie-primary-btn compare-cart">Add to Cart</button>
            <a title="Datasheet" target="_blank" class="compare-datesheet" href="${getdataSheet(
              item
            )}"
              ><i class="fa fa-file-text-o" aria-hidden="true"></i> Datasheet</a
            >
            <div class="accordion-list compare-list">
              <div class="accordion-item plp-filter-cty">
                <div class="accordion-head">Pricing</div>

                <div class="accordion-content" id="">
                  <ul class="price-compare">
                    <li>
                      <span><strong>QUANTITY</strong></span>
                      <span><strong>Price</strong></span>
                    </li>
                     ${pricingTiersList}
            ${pricingTiersLast}
                  </ul>
                </div>
              </div>

              <div class="accordion-item plp-filter-cty">
                <div class="accordion-head">Key specification</div>

                <div class="accordion-content" id="">
                  <ul class="price-compare">
                    ${keySpecsList}
                  </ul>
                </div>
              </div>

              <div class="accordion-item plp-filter-cty">
                <div class="accordion-head">Description</div>

                <div class="accordion-content" id="">
                  <p class="compare-dec-accordion">
                  ${
                    item.webDesc == 0 || item.webDesc == null
                      ? `NA`
                      : `${item.webDesc}`
                  }                  
                  </p>
                </div>
              </div>
            </div>
          </div>
   `;
        $(".accordion-head").click(function () {
          $(this).toggleClass("open").next().toggle(300);
        });
        historyBack();
      });

      //create thumbs
      index
        .getObjects(compFinalarr, {
          attributesToRetrieve: ["objectID", "name", "assets", "categorySEOURL"]
        })
        .then(({ results }) => {
          results.forEach((item) => {
            let thumbitemList = document.getElementById("compare-image-thumbs");
            let objID = `${item.objectID.replace(/\//g, "-")}`;
            let li = document.createElement("li");
            li.innerHTML = `<button title="Close" class="delete-cross rem_${objID}"><i class="fa-regular fa-circle-xmark"></i></button
      ><img src="${getImage(item)}" title="${item.name}" alt="${
              item.seoName ? item.seoName : ""
            } ${BRAND_NAME} ${item.brandSKU ? item.brandSKU : ""}" />`;
            thumbitemList.appendChild(li);
          });
        });

      //creating delete compare item
      $("#compare-prod .compare-item").each(function (index) {
        var itemdataID = $(this).data("id");
        var itemImagePath = $(this).data("compare");
        var itemCount = $("#compare-prod").children().length;
        if (itemCount < 1) {
          $(".compare-sec").addClass("hide");
          window.localStorage.removeItem("compArr");
          window.localStorage.removeItem("compImgPath");
          window.location.replace(document.referrer);
        }
        $("p.compare-text").text(
          itemCount == 0 ? "No item" : +itemCount + " of 4 items"
        );
        $(".rem_" + itemdataID).on("click", function () {
          // $(this).closest('.compare-item').remove();
          $("#compare-image-thumbs .rem_" + itemdataID).click();

          let deleteSku = itemdataID;
          let deleteThumbPath = itemImagePath;
          //let mydataID = $(this).data("id");
          var compStorage = JSON.parse(localStorage.getItem("compArr"));
          compStorage.forEach((itemId, index) => {
            if (itemId == deleteSku) {
              compStorage.splice(index, 1);
            }
            localStorage.setItem("compArr", JSON.stringify(compStorage));
          });

          var compStorageImage = JSON.parse(
            localStorage.getItem("compImgPath")
          );
          compStorageImage.forEach((itemId, index) => {
            if (itemId == deleteThumbPath) {
              compStorageImage.splice(index, 1);
            }
            localStorage.setItem(
              "compImgPath",
              JSON.stringify(compStorageImage)
            );
          });
        });
        $(document).on("click", ".rem_" + itemdataID, function () {
          $(this).parent().remove();
          $("#compare-prod .rem_" + itemdataID).click();
          $("p.compare-text").text(
            $("#compare-prod .compare-item").length == 0
              ? ""
              : +$("#compare-prod .compare-item").length + " of 4 items."
          );
          if ($("#compare-prod .compare-item").length < 1) {
            $(".compare-sec").addClass("hide");
            window.localStorage.removeItem("compArr");
            window.localStorage.removeItem("compImgPath");
            window.location.replace(document.referrer);
          }
        });

        function charLimit() {
          var maxName = 88;
          $(".ellipsis-90").each(function () {
            var namechar = $(this).text();
            if (namechar.length > maxName) {
              var beginTitle = namechar.substr(0, maxName);
              $(this).html(beginTitle).append($("<span />").html("..."));
            }
          });
        }
        charLimit();
      });
    });
});
$(document).ready(function () {
  if ($("#compare-details").length > 0) {
    $("#main-footer").closest(".experiencefragment").addClass("footer");
    $algolia.addCompareSticky(".compare-sec", 834);
  }
});
function resetCompare() {
  // window.localStorage.removeItem("compArr");
  window.location.replace(document.referrer);
}
function historyBack() {
  $(".history-back-button").on("click", function () {
    window.history.back();
  });
}
