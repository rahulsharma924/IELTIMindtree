(function () {
  let skuLable,
    qtyAvailable,
    callUs,
    contactNumber,
    pricePerUnit,
    quantityLabel,
    priceLabel,
    newLabel,
    closeLabel,
    lengthLabel,
    customLabel,
    minimum6Inches,
    customLengthLabel,
    unitLabel,
    inLabel,
    cmLabel,
    colorLabel,
    estimatedShipmentLabel,
    enterPostalCodeLabel,
    deliveryAsSoonAsLabel,

    callUsPhoneNum,
    deliveryCallUsLabel,
    deliveryAsSoonAsCallUs,

    notValidPostalCodeLabel,
    documentsAndMediaLabel,
    documentNameLabel,
    actionsLabel,
    dataSheetLabel,
    viewLabel,
    downloadLabel,
    specSheetLabel,
    twoDDrawingsLabel,
    threeDDrawingsLabel,
    downloadAllLabel,
    productComplianceLabel,
    rohsDeclarationLabel,
    reachDeclarationLabel,
    tscaDeclarationLabel,
    rohsStatusLabel,
    tscaStatusLabel,
    reachStatusLabel,
    eccnLabel,
    notSubmittedLabel,
    warningLabel,
    warningContent,
    warningAnchorLabel,
    warningLink,
    addToCartlLabel,
    requestAQuoteLabel,
    pleaseCallForQuoteLabel,
    SpecSheetWitoutSpace,
    twoDcadLabel,
    threeDcadLabel,
    compliantLabel,
    rohsLabel,
    naLabel,
    depletedTitle,
    depletedDescription,
    freightTitle,
    freightDescription,
    DataSheetWithCapsLabel,
    keySpecificationResult,
    productComplianceResult,
    mobileCall;
  pdpLables = (content) => {
    const getData = async () => {
      await fetch("/content/dam/infinite-electronics/json/fairview-microwave/utilities.json")
        .then((response) => response.json())
        .then((data) => {
          skuLable = data[0].labels.sku;
          qtyAvailable = data[0].labels.qtyAvailable;
          callUs = data[0].labels.callUs;
          contactNumber = data[0].labels.contactNumber;
          pricePerUnit = data[0].labels.pricePerUnit;
          quantityLabel = data[0].labels.quantity;
          priceLabel = data[0].labels.price;
          newLabel = data[0].labels.new;
          closeLabel = data[0].labels.close;
          lengthLabel = data[0].labels.length;
          customLabel = data[0].labels.custom;
          minimum6Inches = data[0].labels.minimum6Inches;
          customLengthLabel = data[0].labels.customLength;
          unitLabel = data[0].labels.unit;
          inLabel = data[0].labels.in;
          cmLabel = data[0].labels.cm;
          colorLabel = data[0].labels.color;
          estimatedShipmentLabel = data[0].labels.estimatedShipment;
          enterPostalCodeLabel = data[0].messages.enterPostalCode;
          deliveryAsSoonAsLabel = data[0].messages.deliveryAsSoonAs;
          deliveryAsSoonAsCallUs = data[0].messages.deliveryAsSoonAsCallUs;
          callUsPhoneNum=data[0].messages.callUsPhoneNum;
          deliveryCallUsLabel=data[0].messages.deliveryCallUsLabel;
          notValidPostalCodeLabel = data[0].messages.notValidPostalCode;
          documentsAndMediaLabel = data[0].labels.documentsAndMedia;
          documentNameLabel = data[0].labels.documentName;
          actionsLabel = data[0].labels.actions;
          dataSheetLabel = data[0].labels.dataSheet;
          viewLabel = data[0].labels.view;
          downloadLabel = data[0].labels.download;
          specSheetLabel = data[0].labels.specSheet;
          twoDDrawingsLabel = data[0].labels.twoDDrawings;
          twoDDrawingsLabel = data[0].labels.twoDDrawings;
          threeDDrawingsLabel = data[0].labels.threeDDrawings;
          downloadAllLabel = data[0].labels.downloadAll;
          productComplianceLabel = data[0].labels.productCompliance;
          rohsDeclarationLabel = data[0].labels.rohsDeclaration;
          reachDeclarationLabel = data[0].labels.reachDeclaration;
          tscaDeclarationLabel = data[0].labels.tscaDeclaration;
          rohsStatusLabel = data[0].labels.rohsStatus;
          tscaStatusLabel = data[0].labels.tscaStatus;
          reachStatusLabel = data[0].labels.reachStatus;
          eccnLabel = data[0].labels.eccn;
          notSubmittedLabel = data[0].labels.notSubmitted;
          warningContent = data[0].labels.warningContent;
          warningLabel = data[0].labels.warning;
          warningAnchorLabel = data[0].labels.warningAnchor;
          warningLink = data[0].labels.warningLink;
          addToCartlLabel = data[0].labels.addToCart;
          requestAQuoteLabel = data[0].labels.requestAQuote;
          pleaseCallForQuoteLabel = data[0].labels.pleaseCallForQuote;
          SpecSheetWitoutSpace = data[0].labels.SpecSheetWitoutSpace;
          twoDcadLabel = data[0].labels.twoDcad;
          threeDcadLabel = data[0].labels.threeDcad;
          compliantLabel = data[0].labels.compliant;
          rohsLabel = data[0].labels.rohs;
          naLabel = data[0].labels.na;
          depletedTitle = data[0].labels.depletedTitle;
          depletedDescription = data[0].labels.depletedDescription;
          freightTitle = data[0].labels.freightTitle;
          freightDescription = data[0].labels.freightDescription;
          DataSheetWithCapsLabel = data[0].labels.DataSheetWithCaps;
          mobileCall = data[0].labels.mobileCall
          window.Handlebars.registerHelper(
            "isDataSheetDefined",
            function (value) {
              let dataSheetData = value.find(
                (asset) => asset.type === DataSheetWithCapsLabel
              );
              //alert(dataSheetData);
              if (dataSheetData !== undefined) {
                return value !== undefined;
              } else {
                return value === undefined;
              }
            }
          );
          window.Handlebars.registerHelper(
            "isSpecSheetDefined",
            function (value) {
              let specData = value.find(
                (asset) => asset.type === SpecSheetWitoutSpace
              );
              if (specData !== undefined) {
                return value !== undefined;
              } else {
                return value === undefined;
              }
            }
          );
          window.Handlebars.registerHelper("dataSheetLink", function () {
            return getdataSheet(content);
          });
          window.Handlebars.registerHelper("specSheetLink", function () {
            return getspecSheet(content);
          });
          window.Handlebars.registerHelper(
            "ifCond",
            function (v1, v2, v3, options) {
              if (v1 !== "" || v2 !== "" || v3 !== "") {
                return options.fn(this);
              }
              return options.inverse(this);
            }
          );
          const mergedObject = {
            ...content,
            ...data
          };
          let keySpecificationTemplate = $(".key-specification-handle").html();
          let productComplianceTemplate = $(
            ".product-compliance-handle"
          ).html();
          let keySpecificationTemplateCompile = window.Handlebars.compile(
            keySpecificationTemplate
          );
          let productComplianceTemplateCompile = window.Handlebars.compile(
            productComplianceTemplate
          );
          keySpecificationResult =
            keySpecificationTemplateCompile(mergedObject);
          productComplianceResult =
            productComplianceTemplateCompile(mergedObject);
          $(".key-spec-first").html(keySpecificationResult);
          $(".prod-comp-temp").html(productComplianceResult);
        })
        .catch((error) => {
          // Your error is here!
          console.log(error);
        });
    };
    getData();
    return [
      addToCartlLabel,
      requestAQuoteLabel,
      pleaseCallForQuoteLabel,
      SpecSheetWitoutSpace,
      twoDcadLabel,
      threeDcadLabel,
      compliantLabel,
      rohsLabel,
      naLabel,
      depletedTitle,
      depletedDescription,
      dataSheetLabel,
      freightTitle,
      freightDescription,
      DataSheetWithCapsLabel,
      mobileCall
    ];
  };
  pdpLables();
  keySpecification = () => {
    return `<div class="key-specification key-spec-first"></div>`;
  };
  productCompliance = () => {
    return `<div class="key-specification prod-comp-temp">`;
  };

  viewAllModalPopup = (
    dataSheetData,
    content,
    specData,
    twodData,
    threedData
  ) => {
    return `<div id="view-all-modal" class="modal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h3>${documentsAndMediaLabel}</h3>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="${closeLabel}">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div class="modal-body">
          <ul><li><div class="hlf-name"><strong>${documentNameLabel}</strong></div> <div class="hlf-action"><strong>${actionsLabel}</strong></div></li>${
      dataSheetData
        ? `<li><div class="hlf-name">${dataSheetLabel}</div><div class="hlf-action"><a title="${viewLabel}" href="${getdataSheet(
            content
          )}"><i class="fa-solid fa-eye"></i> ${viewLabel}</a><a title="${downloadLabel}"  href="${getdataSheet(
            content
          )}" download><i class="fa-solid fa-download"></i> ${downloadLabel}</a></div></li>`
        : ""
    }${
      specData
        ? `<li><div class="hlf-name">${specSheetLabel}</div><div class="hlf-action"><a title="${viewLabel}" href="${getspecSheet(
            content
          )}"><i class="fa-solid fa-eye"></i> ${viewLabel}</a><a title="${downloadLabel}" href="${getspecSheet(
            content
          )}" download><i class="fa-solid fa-download"></i> ${downloadLabel}</a></div>`
        : ""
    }${
      twodData
        ? `<li><div class="hlf-name">${twoDDrawingsLabel}</div><div class="hlf-action"><a title="${viewLabel}"  href="${gettwoDImg(
            content
          )}"><i class="fa-solid fa-eye"></i> ${viewLabel}</a><a title="${downloadLabel}" href="${gettwoDImg(
            content
          )}" download><i class="fa-solid fa-download"></i> ${downloadLabel}</a></div></li>`
        : ""
    } ${
      threedData
        ? `<li><div class="hlf-name">${threeDDrawingsLabel}</div><div class="hlf-action"><a title="${viewLabel}" href="${getthreeDImg(
            content
          )}"><i class="fa-solid fa-eye"></i> ${viewLabel}</a><a title="${downloadLabel}" href="${getthreeDImg(
            content
          )}" download><i class="fa-solid fa-download"></i> ${downloadLabel}</a></div></li>`
        : ""
    }
          </ul>
            </div>
            <div class="modal-footer">
              <a class="downl-anch" title="${downloadAllLabel}" href="#">${downloadAllLabel}</a><button type="button" class="close-btn-foot" data-dismiss="modal"  aria-label="Close">${closeLabel} </button>
            </div>
          </div>
        </div>
      </div>`;
  };

  estimatedShipmentContent = (statusEstimatedDelivery,statusOversized) => {
    return `<div class="confirm-pd-20">
            <div class="d-flex-postal">
              <label>${estimatedShipmentLabel}</label>
              <div class="select-estimate checkboxgrey">
                <div class="order-country-input zip-flex">
                  <input
                    type="text"
                    id="zip"
                    name="zipcode"
                    ${statusOversized ? "disabled": ""}
                    oninput="$pdpGlobal.zipCheck()"
                    placeholder="${enterPostalCodeLabel}"
                    maxlength="10"
                  />
                  <button type="button" onclick="$pdpGlobal.zipValidate()"  
                   class="zip-button zip-button-grey"><i class="fa-solid fa-check"></i></button>
                </div>
              </div>
            </div>
            <div class="delivery-details deliver-valid">
            <i class="fa-solid fa-truck"></i>  ${deliveryAsSoonAsLabel} <span class="textred" id="delEst"></span>
            </div>
            <div id="pdpCallUsModal" class="modal pdp-modal-callus deliver-callus pdp-callus" tabindex=1>
              <div class="modal-content pdp-modal-content-callus">
              <div class="pdp-callus-head">
                <div class="pdp-callus-h1">
                  <i class="fa fa-exclamation-triangle fa-lg" aria-hidden="true"></i>
                  <span class="pdp-callus-contlab">${deliveryCallUsLabel}</span>
                </div>
                <div class="pdp-callus-h2"> <i class="fa fa-times fa-lg pdp-callus__close" id="closePdpCallus" aria-hidden="true"></i></div>
               
              </div>
        
                <a class="pdp-callus-num" href="tel:${callUsPhoneNum}">${callUsPhoneNum}</a>
              </div>
            </div>
            <div class="delivery-details delivery-error">${notValidPostalCodeLabel}</div>
          </div>`;
  };
  inventoryMethod = () => {
    return `<div class="d-flex-zipcode">
              <div class="select-estimate pdp__quantityupdate">
                <label>${quantityLabel}</label>
                <div
                  class="input-group input-field-border w-auto wht-backg flex-space"
                >
                  <button
                    type="button"
                    value="-"
                    class="plus-minus-pointer button-minus border-none rounded-circle icon-shape icon-sm mx-1"
                    data-field="quantity">-</button>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    max="99999"
                    value="1"
                    id="pdpProdQty"
                    name="quantity"
                    class="input-plus-minus border-none text-center w-25" oninput="validity.valid||(value='');"
                  />
                  <button
                    type="button"
                    value="+"
                    class="plus-minus-pointer button-plus border-none rounded-circle icon-shape icon-sm"
                    data-field="quantity">+</button>
                </div>
              </div>
            </div>`;
  };

  colorVariationMethod = (content, selectOptioncolor) => {
    return `${
      content.colorVariations && content.colorVariations != ""
        ? `
          <div class="d-flex-zipcode color-code-sec">
              <div class="select-estimate">
                <label>${colorLabel}</label>
                <select id="select-color" class="order-summry-select color-select order-country-select">
                  ${selectOptioncolor}
                </select>
              </div>
            </div>`
        : ``
    }`;
  };

  lengthVariationMethod = (content, selectOptionlength) => {
    return `${
      content.lengthVariations && content.lengthVariations != ""
        ? `
<div class="length-variant">
            <div class="d-flex-zipcode">
              <div class="select-estimate">
                <label>${lengthLabel}</label>
                <select id="select-length" class="order-summry-select order-country-select ln-sel">
                  ${selectOptionlength}
                  <option class="ais-SortBy-option" value="select_custom">
                    ${customLabel}
                  </option>
                </select>
              </div>
            </div>
            <div class="mininchpd">
              <span class="minimuminch">${minimum6Inches}</span>
            </div>
            </div>
            <div class="custom-selectOption-box">
            <div class="d-flex-zipcode">
              <div class="select-estimate">
                <label>${customLengthLabel}</label>
                <div id="inputCustom-select"></div>
                <div class="mininchpd">
              <span class="minimuminch">${minimum6Inches}</span>
              <input type="hidden" id="basesku" value="${content.baseItemSKU}" />
            </div>
            </div>
            <div class="select-estimate pl-10">
            <label>${unitLabel}</label>
            <select
            onchange="$pdpCustomVariant.customlengthselect()"
            id="customunitselect"
            class="order-summry-select order-country-select custom-unit-select"
          >
            <option class="ais-SortBy-option" value="IN" selected>${inLabel}</option>
            <option class="ais-SortBy-option" value="CM">${cmLabel}</option>
          </select>
          </div>
              </div>
              </div>
            `
        : ``
    }`;
  };

  pricingTierMethod = (pricingTiersList, pricingTiersLast) => {
    return `<div class="price-details-info">
            <div class="order-details pd-price">
              <span class="order-items-name qnty">${quantityLabel}</span>
              <span class="order-items-price qnty">${priceLabel} </span>
            </div>
            <div class="pricetire">
            ${pricingTiersList}
            ${pricingTiersLast}
            </div>
          </div>`;
  };

  productDetailsMethod = (content) => {
    return `<div class="order-details">
            <span class="order-items-name">${skuLable}</span>
            <span class="order-items-price">
            <span class="pricing-tiersku">
            <span class="orignal-sku" id="pdpSku">${content.brandSKU}</span>	
            <span class="newSelected-sku">${
              content.baseItemSKU +
              "/<span id='color-value'>" +
              content.defaultColor +
              "</span>-<span id='length-value'>" +
              content.length +
              "</span>"
            }</span>	
            </span>
           </span>
          </div>
          <div class="order-details">
            <span class="order-items-name">${qtyAvailable}</span>
            <span class="order-items-price">${
              content.inventory > 0
                ? `${content.inventory}`
                : `<a class="call-link" href="tel:${contactNumber}" title="${contactNumber}">${callUs}</a>`
            }</span>
          </div>
          <div class="order-details">
            <span class="order-items-name">${pricePerUnit}</span>
            <span class="order-items-price">${
              content.startingPrice
                ? `<span class="label-value pricingtierpriceNA"><span>$</span><span class="pricingtierprice">${content.startingPrice.toFixed(
                    2
                  )}</span></span>`
                : `<span class="label-value">NA</span>`
            }</span>
          </div>`;
  };

  imageCardMethod = (content, statusOversized) => {
    return `<div class="mob_Title_Description">
        <p class="mob-pdpheader-title"><b>${content.name}</b></p>
    </div>
    <div class="pdpmain_TitleDescription">
        <div class="productcard">
          <div class="pdp-flex-container">
            <ul class="pdp-thumbnails" id="items">
              <li class="thumbnails-image">
                <img
                  class="imgInCol plp-img-src"
                  data-picsrc1="${getImage(content)}"
                  src="${getImage(content)}"
                  alt="${content.name} ${brandName} ${content.brandSKU}"
                />
              </li>

              <li class="thumbnails-image">
                <img
                  class="imgInCol plp-img-src"
                  data-picsrc1="${getImage(content)}"
                  src="${getImage(content)}"
                  alt="${content.name} ${brandName} ${content.brandSKU}"
                />
              </li>
            </ul>

            <div class="product_card">
              <div class="pdp-container" id="toBeChanged" style="flex-grow: 4">
                <div class="compliance_label">
                ${statusOversized}
               
                ${
                  content.isNew
                    ? `<span class="label-new">${newLabel}</span>`
                    : ``
                }
                </div>
                <img
                  class="cardimage plp-img-src"
                  id="imgToBeChanged"
                  src="${getImage(content)}"
                  alt="${content.name} ${brandName} ${content.brandSKU}"
                />
                <button class="zoom_btn" onclick="enlarge();">
                 <i class="fa-sharp fa-light fa-magnifying-glass-plus"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="main_Title_Description">
            <!-- <input class="toggle-box" id="first_div" type="checkbox" /> -->
            <!-- <label for="first_div" id="second_div">&nbsp;</label> -->
            <div class="desc" id="third_div">
              <h1 class="pdpheader-title">
              ${content.name}
              </h1>
              <p class="pdpheader-desc more">
              ${content.webDesc ? `${content.webDesc}` : `NA`}
              </p>
            </div>
          </div>
        </div>
      </div>`;
  };

  imageModalPopupMethod = () => {
    return ` <div class="cart-empty">
    <div id="myModal" class="modal pdp-modal" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
        <button
          type="button"
          class="close pdpclose"
          data-dismiss="modal"
          aria-label="${closeLabel}"
        ></button>

      <div class="modal-body">
        <img class="" id="img1" alt="productimage" />
      </div>
    </div>
  </div>
</div>`;
  };

  window.$pdp = {
    keySpecification,
    productCompliance,
    viewAllModalPopup,
    estimatedShipmentContent,
    inventoryMethod,
    colorVariationMethod,
    lengthVariationMethod,
    pricingTierMethod,
    productDetailsMethod,
    imageCardMethod,
    imageModalPopupMethod,
    pdpLables
  };
})();
