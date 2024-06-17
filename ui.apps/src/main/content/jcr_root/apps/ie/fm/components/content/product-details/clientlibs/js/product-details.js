/* global instantsearch algoliasearch */
let client = algoliasearch(algId, algApi);
let index = client.initIndex(indexInuse);
let locationUrl = window.location.origin + window.location.pathname;
const urlArr = window.location.hash.split("#")[1];

let objectID = urlArr;
let id = objectID;
let catName;

index
  .getObjects([objectID], {
    attributesToRetrieve: [
      "assets",
      "name",
      "brandSKU",
      "startingPrice",
      "webDesc",
      "keySpecs",
      "reachStatus",
      "roHSStatus",
      "tSCAStatus",
      "eCCN",
      "lengthVariations",
      "colorVariations",
      "uomVariations",
      "pricingTiers",
      "isNew",
      "complianceStatus",
      "unitPrice",
      "inventory",
      "bestSellerRank",
      "category",
      "color",
      "productId",
      "length",
      "currencyCode",
      "baseItemSKU",
      "defaultColor",
      "isDiscontinued",
      "isOversized",
      "isSellable",
    ]
  })
  .then(({ results }) => {
    let pdpData = document.getElementById("pdp-data");
    let pdpLabelsArr = $pdp.pdpLables();
    let addToCartlLabel = pdpLabelsArr[0];
    let requestAQuoteLabel = pdpLabelsArr[1];
    let pleaseCallForQuoteLabel = pdpLabelsArr[2];
    let SpecSheetWitoutSpace = pdpLabelsArr[3];
    let twoDcadLabel = pdpLabelsArr[4];
    let threeDcadLabel = pdpLabelsArr[5];
    let compliantLabel = pdpLabelsArr[6];
    let rohsLabel = pdpLabelsArr[7];
    let naLabel = pdpLabelsArr[8];
    let depletedTitle = pdpLabelsArr[9];
    let depletedDescription = pdpLabelsArr[10];
    let freightTitle = pdpLabelsArr[12];
    let freightDescription = pdpLabelsArr[13];
    let DataSheetWithCapsLabel = pdpLabelsArr[14];
    let mobileCall = pdpLabelsArr[15];
    results.forEach((content) => {
      let dataSheetData = content?.assets?.find(
        (asset) => asset.type === DataSheetWithCapsLabel
      );
      let specData = content?.assets?.find(
        (asset) => asset.type === SpecSheetWitoutSpace
      );
      let twodData = content?.assets?.find(
        (asset) => asset.type === twoDcadLabel
      );
      let threedData = content?.assets?.find(
        (asset) => asset.type === threeDcadLabel
      );
      let statusOversized = "";
      if (
        typeof content.isOversized != "undefined" &&
        content.isOversized === true
      ) {
        statusOversized = `<span class="label-new freight-label"><span class="fr-tool-tip">${freightDescription}<i class="fa-solid fa-caret-down"></i></span>${freightTitle}</span>`;
      } else {
        let statusOversized = "";
      }

      let statusRohs = "";
      let analyticsRohs = "";
      if (
        typeof content.roHSStatus != "undefined" &&
        content.roHSStatus === compliantLabel
      ) {
        statusRohs = `<span class='compliancelabel'>${rohsLabel}</span>`;
        analyticsRohs = "true";
      } else {
        analyticsRohs = "false";
      }

      let selectOptionlength = "";
      if (typeof content.lengthVariations != "undefined") {
        content.lengthVariations.forEach((item) => {
          let onlyNumbers = item.replace(/\D/g, "");
          let defaultValue = content.length;
          selectOptionlength += `<option ${
            onlyNumbers == defaultValue ? `selected` : ``
          } class="ais-SortBy-option" value="${item}">${item}</option>`;
          selectOptionlength += `<option ${
            onlyNumbers == defaultValue ? `selected` : ``
          } class="ais-SortBy-option" value="${item}">${item}</option>`;
        });
      }

      let selectOptioncolor = "";
      if (typeof content.colorVariations != "undefined") {
        content.colorVariations.forEach((item) => {
          let defaultValue = content.color;
          selectOptioncolor += `<option ${
            item == defaultValue ? `selected` : ``
          } class="ais-SortBy-option" value="${item}">${item}</option>`;
          selectOptioncolor += `<option ${
            item == defaultValue ? `selected` : ``
          } class="ais-SortBy-option" value="${item}">${item}</option>`;
        });
      }

      let pricingTiersList = "";
      let pricingTiersLast = "";
      let pricingTiersRow = content.pricingTiers.length - 1;
      if (
        typeof content.pricingTiers != "undefined" &&
        content.pricingTiers != ""
      ) {
        content.pricingTiers.forEach((item, index) => {
          if (index < pricingTiersRow) {
            pricingTiersList += `<div class="order-details pd-price">
          <span class="order-items-name font-normal">${item.lowQuantity}-${item.highQuantity}</span>
          <span class="order-items-price font-normal">$${$pdpGlobal.formatPrice(item.price)}</span>
        </div>`;
          }
        });
        pricingTiersLast = `<div class="order-details pd-price">
        <span class="order-items-name font-normal">${content.pricingTiers[pricingTiersRow].lowQuantity}+</span>
        <span class="order-items-price font-normal mob-call d-md-none d-block"
          >${mobileCall}
        </span>
        <span class="order-items-price font-normal d-md-block d-none"
          >${pleaseCallForQuoteLabel}
        </span>
      </div>`;
      } else {
        pricingTiersList = `<div class="order-details pd-price">
        <span class="order-items-name font-normal">${naLabel}</span>
        <span class="order-items-price font-normal">${naLabel}</span>
      </div>`;
      }

      let statusInventory = "";
      let statusEstimatedDelivery = "";
      if (typeof content.inventory != "undefined") {
        if (content.inventory < 1 && content.isSellable== false ) {
          statusInventory = `<button type='button' class='request-button'>${requestAQuoteLabel}</button>`;
          statusEstimatedDelivery = `unknown`;
        } else {
          statusInventory = `<button type="button" class="ie-primary-btn cart-button add_to_cart add_to_cart--pdp" data-cartqty data-currency="${
            content.currencyCode ? content.currencyCode : ""
          }" data-sku="${content.brandSKU}" data-analyticcartprod="${
            content.brandSKU +
            "@@" +
            content.name +
            "@@" +
            content.productId +
            "@@" +
            content.unitPrice +
            "@@" +
            content.startingPrice +
            "@@" +
            content.length +
            "@@" +
            content.color +
            "@@" +
            content.bestSellerRank +
            "@@" +
            content.inventory +
            "@@" +
            content.category +
            "@@pdp"
          }" onclick="addtocartSpecific(this)">${addToCartlLabel}</button>`;
          statusEstimatedDelivery = `<span class="shipment-date"></span>`;
        }
      }

      let statusDiscontinue = "";
      if (typeof content.isDiscontinued != "undefined") {
        if (content.isDiscontinued === true && content.inventory > 0) {
          statusDiscontinue = `<div class="depleted-div">
          <h2>${depletedTitle}</h2>
          <p>${depletedDescription}</p>
        </div>`;
        } else {
          statusDiscontinue = ``;
        }
      }

      if (typeof content.roHSStatus != "undefined") { 
      if (content.roHSStatus === "" || content.roHSStatus === "Not Available"){
        $(".rohs-status").addClass("d-none");
      } else {
        $(".rohs-status").removeClass("d-none");
      }
    }

    if (typeof content.roHSStatus != "undefined") { 
      if (content.reachStatus === "" || content.reachStatus === "Not Available"){
        $(".reach-status").addClass("d-none");
      } else {
        $(".reach-status").removeClass("d-none");
      }
    }
    if (typeof content.tSCAStatus != "undefined") { 
      if (content.tSCAStatus === "" || content.tSCAStatus === "Not Available"){
        $(".tsca-status").addClass("d-none");
      } else {
        $(".tsca-status").removeClass("d-none");
      }
    }


      pdpData.innerHTML += `
    
  <div class="d-none" id="shipmentDate"></div>
      <div class="aem-GridColumn aem-GridColumn--default--6 aem-GridColumn--tablet--12 aem-GridColumn--phone--12">
      <input type="hidden" id="analyticspdpproddetails" value="${
        content.brandSKU +
        "@@" +
        content.name +
        "@@" +
        content.productId +
        "@@" +
        content.unitPrice +
        "@@" +
        content.startingPrice +
        "@@" +
        content.length +
        "@@" +
        content.color +
        "@@" +
        content.bestSellerRank +
        "@@" +
        content.inventory +
        "@@" +
        content.category +
        "@@" +
        content.isNew +
        "@@" +
        analyticsRohs
      }">
    <div class="d-none">${$pdp.pdpLables(content)}</div>
    ${$pdp.imageModalPopupMethod()}
    ${$pdp.imageCardMethod(content, statusOversized)}
    </div>
    </div>
    <div class="aem-GridColumn aem-GridColumn--default--6 aem-GridColumn--tablet--12 aem-GridColumn--phone--12">
    <div class="pdp-box-right">
      <div class="pdp-box-grid">
        <div class="order-bg-color-light bgwhite fmrg-tp">
          ${$pdp.productDetailsMethod(content)}
          ${$pdp.pricingTierMethod(pricingTiersList, pricingTiersLast)}
        </div>
      </div>
      <div class="pdp-box-grid">
        <div class="order-bg-color-light bg-mobile">
          <div class="form-pd-20">
            ${statusDiscontinue}  
            ${$pdp.lengthVariationMethod(content, selectOptionlength)}
            ${$pdp.colorVariationMethod(content, selectOptioncolor)}
            ${$pdp.inventoryMethod()}
            ${statusInventory}
          </div>

          <div class="my-order-line"></div>
          ${$pdp.estimatedShipmentContent(statusEstimatedDelivery,statusOversized)}
        </div>
      </div>
    </div>
  </div>
  <div class="aem-Grid main-wid main-wid-lower aem-Grid--12">
    <div
      class="aem-GridColumn aem-GridColumn--default--12 aem-GridColumn--tablet--12 aem-GridColumn--phone--12"
    >
      ${$pdp.viewAllModalPopup(
        dataSheetData,
        content,
        specData,
        twodData,
        threedData
      )}

      ${$pdp.keySpecification()}
    </div>
    <div
      class="aem-GridColumn aem-GridColumn--default--12 aem-GridColumn--tablet--12 aem-GridColumn--phone--12"
    >
      ${$pdp.productCompliance(content)}
    <div
      class="aem-GridColumn aem-GridColumn--default--12 aem-GridColumn--tablet--12 aem-GridColumn--phone--12"
    >
      <div class="seperator-div mob-seperte-none"></div>
    </div>
   
  </div>
`;
      $pdpGlobal.readMorePDP();
      $pdpGlobal.imgChanged();
      $pdpGlobal.accordMobKeyCompli();
      $pdpGlobal.selectLengthColor();
      $pdpGlobal.quantityUpdate();
      getPdpAnalyticsDetails();
      $pdpGlobal.pdpAlgoliaevent();
    });
  });

//analytics code to get product details on pdp page
function getPdpAnalyticsDetails() {
  var productDetailsVal = document.querySelector(
    "#analyticspdpproddetails"
  ).value;
  if (productDetailsVal != "" && productDetailsVal != undefined) {
    prodDetArr = productDetailsVal.split("@@");
    for (i = 0; i < prodDetArr.length; i++) {
      if (prodDetArr[i] === "undefined") {
        prodDetArr[i] = "";
      }
    }
  }
  plpProductDLCall(prodDetArr, "pdp");
}

$(document).ready(function () {
  $pdpGlobal.getBreadcrumbData();
  let delayInMilliseconds = 2000; //1 second
  setTimeout(function () {
    $(".downl-anch").click(function () {
      let urlList = "";
      $(".modal-body")
        .find("a")
        .each(function () {
          if ($(this).attr("href").startsWith("https")) {
            if (!urlList.includes($(this).attr("href"))) {
              urlList = urlList + $(this).attr("href") + ",";
            }
          }
        });
      let zip = new JSZip();
      let urls = urlList.split(",");
      let count = 0;
      let zipFilename = "pdfs.zip";
      Array.from(urls).forEach(function (url) {
        let filename = "filename";
        JSZipUtils.getBinaryContent(url, function (err, data) {
          if (err) {
            console.log("Error");
          }
          let filename = url.replace(/.*\//g, "");
          zip.file(filename, data, { binary: true, createFolders: true });
          count++;
          if (count == urls.length) {
            zip
              .generateAsync({
                type: "blob"
              })
              .then(function (blob) {
                saveAs(blob, zipFilename);
              });
          }
        });
      });
    });
  }, delayInMilliseconds);
});
