$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search),
    orderId = urlParams.get("order_id"),
    customer_token = window.isCustomerToken(),
    apiEndpoint = window.getAPIModule || {},
    DATA = {
      order_id: orderId,
      customer_token: customer_token,
      bearertoken: window.getbearerToken()
    };
  let statusInfo = [];

  // Api Response Order Details
  apiEndpoint.getOrderHistoryDetails(DATA).then((data) => {
    if (data && !data.statusCode) {
      let orderListData = data;

      // API All get deliveryStatusMapping
      apiEndpoint.getDeliveryStatusMapping().then((status) => {
        if (status && Object.keys(status).length) {
          statusInfo = status;
          getAlgoliaResponseAndMerge(orderListData, statusInfo);
        }
      });
    }
  });
});

function appendProductData(orderListData, statusInfo) {
  var prodAsPerDelStatus = getProdAsPerDelStatus(orderListData);
  for (var delStatus in prodAsPerDelStatus) {
    if (delStatus && delStatus !== "undefined") {
      var prodDelStatusRow = getProdDelStatusRowStr(delStatus, "desktop");
      $("#reorderHistory").append(prodDelStatusRow);
      var prodDetailsForDelStatus = prodAsPerDelStatus[delStatus];
      var counter = 0;
      for (var productDetails of prodDetailsForDelStatus) {
        reorderList(delStatus, counter, productDetails, true, statusInfo);
        counter++;
      }
      $("#reorderHistory").append("<div class='card-spacing'></div>");
    } else {
      for (let productDetails of prodAsPerDelStatus["undefined"]) {
        reorderList(delStatus, counter, productDetails, false, statusInfo);
      }
    }
  }
}

/**
 * reOrderList()
 * @param {*} orderListData
 * @param {Boolean} isDeliveryStatus
 * @returns
 */
function reorderList(
  delStatus,
  counter,
  productDetails,
  isDeliveryStatus,
  statusInfo
) {
  var classForDelDetails;

  if (!isDeliveryStatus) {
    classForDelDetails = "estimated-delivery";
  } else {
    if (counter === 0) {
      classForDelDetails = "estimated-delivery";
    } else {
      classForDelDetails = "estimated-delivery-not";
    }
  }

  var productDelivery = {
    PLACED: 1,
    SHIPPED: 2,
    "OUT FOR DELIVERY": 3,
    DELIVERED: 4
  };
  let status = orderStatusMatch(productDetails, statusInfo);
  listItemMarkup(productDetails, isDeliveryStatus);

  function listItemMarkup(productDetails, isDeliveryStatus) {
    let isOfflineProduct =
      productDetails?.slug?.indexOf("NewSellableLineItem") > -1 ? true : false;
    let isSellable =
        productDetails?.isSellable === true
          ? true
          : productDetails?.isSellable === false
          ? false
          : true,
      unitPrice;

    unitPrice =
      window.priceFormate.formateCheckout(
        productDetails?.price?.value?.number || productDetails?.money?.number
      ) || "";
    $("#reorderHistory").append(
      getProductString(
        delStatus,
        productDetails.name["en-US"] || productDetails.name["en"],
        productDetails.assets
          ? getImage(productDetails)
          : "/content/dam/infinite-electronics/images/fairview-microwave/application-images/olcc/NewRFProduct.jpg",
        commonUtility().getSkuId(productDetails),
        productDetails.color || "",
        unitPrice,
        productDetails.quantity || "",
        productDetails?.custom?.fields?.estimatedDeliveryDate
          ? commonUtility().dateFormate(
              productDetails?.custom?.fields?.estimatedDeliveryDate
            )
          : "Pending",
        productDetails?.custom?.fields?.trackingNumber || "",
        classForDelDetails,
        productDetails?.price?.value?.currencyCode || "",
        productDelivery[status],
        isSellable,
        productDetails,
        isOfflineProduct
      )
    );
    if (!isDeliveryStatus) {
      $(".estimated-delivery-not").hide();
      $(".ordered-item-status").hide();
    }
  }

  //});
}
/**
 * orderStatusMatch
 * @param {Object} order StatusInfo
 * @param {String} Return String
 */
function orderStatusMatch(order, statusInfo) {
  const UPS = "UPS",
    FEDEX = "FEDEX",
    PLACED = "Placed",
    SHIPPED = "Shipped";
  let orderStatus = "";
  const ORDER = order?.custom?.fields || {};
  if (
    Object.keys(ORDER).length &&
    ORDER.trackingNumber &&
    Object.keys(statusInfo).length
  ) {
    // if oder has tracking number but not delivery Status the by default will "Shipped"
    if (ORDER.trackingNumber && !ORDER.deliveryStatusCode) {
      orderStatus = SHIPPED;
      // if oder does't have tracking number but have delivery Status the by default will "Placed"
    } else if (!ORDER.trackingNumber && ORDER.deliveryStatusCode) {
      orderStatus = PLACED;
    } else if (ORDER.carrier === FEDEX) {
      let getStatus = statusInfo.FEDEX.find((status) => {
        return status.code === ORDER.deliveryStatusCode;
      });
      orderStatus = getStatus ? getStatus.webStatus : PLACED; // if order does't have status listed in JSON, by default will be "Placed"
    } else if (ORDER.carrier === UPS) {
      let getStatus = statusInfo.UPS.find((status) => {
        return status.code === ORDER.deliveryStatusCode;
      });
      orderStatus = getStatus ? getStatus.webStatus : PLACED; // if order does't have status listed in JSON, by default will be "Placed"
    }
  } else {
    orderStatus = PLACED;
  }

  return orderStatus ? orderStatus.toUpperCase() : "";
}

/**
 * getAlgoliaResponseAndMerge()
 * @param {Object} orderListData
 * @returns
 * @param {Object} statusInfo
 * @returns
 */
function getAlgoliaResponseAndMerge(orderListData, statusInfo) {
  let totalLineItemsData = [
    ...orderListData.lineItems,
    ...orderListData.customLineItems
  ];
  let totalLineItems = commonUtility().responseFilter(totalLineItemsData);
  const skuList = getAPIModule.getSKUList(totalLineItems);
  getAPIModule
    .algoliaResponse(skuList, [
      "isSellable",
      "assets",
      "color",
      "seoName",
      "categorySEOURL"
    ])
    .then((response) => {
      if (response) {
        const mergeResponse = totalLineItems.map((item) => {
          const resp1Item = response.results.find(function (respItem) {
            if (respItem && respItem !== null) {
              if (item?.variant?.sku) {
                return item?.variant?.sku === respItem.objectID;
              } else if (item?.custom?.fields) {
                if (item?.custom?.fields?.masterSku) {
                  return item?.custom?.fields?.masterSku === respItem.objectID;
                } else if (item.slug.indexOf(respItem.objectID) > -1) {
                  return respItem;
                }
              }
            } else {
              return item;
            }
          });

          return { ...item, ...resp1Item };
        });
        appendProductData(mergeResponse, statusInfo);
      }
    })
    .catch((error) => {
      console.log(error);
      //addTestingProduct(productDetails); // this is only for display product without SKU which is for Testing Charges
    });
}

function getDeliveryStatus(lineItem) {
  if (lineItem.custom?.fields) {
    return lineItem?.custom?.fields?.deliveryStatus;
  }
}
//gets different types of order statuses from the JSON
function getOrderStatuses(orderListData) {
  var orderStatuses = [];
  //var lineItems = getLineItems(orderListData);
  for (var lineItem of orderListData) {
    var orderStatus = getDeliveryStatus(lineItem);
    if (!orderStatuses.includes(orderStatus)) {
      orderStatuses.push(orderStatus);
    }
  }
  return orderStatuses;
}

/**
 * getProdAsPerDelStatus()
 * @param {Object} orderListData
 * @param {Object} orderListData
 * @returns object
 */
function getProdAsPerDelStatus(orderListData) {
  var prodAsPerDelStatus = {};

  var orderStatuses = getOrderStatuses(orderListData);
  var lineItems = orderListData;
  for (var orderStatus of orderStatuses) {
    var ordersWithOrderStatus = [];
    for (var lineItem of lineItems) {
      if (getDeliveryStatus(lineItem) === orderStatus) {
        ordersWithOrderStatus.push(lineItem);
      }
    }
    prodAsPerDelStatus[orderStatus] = ordersWithOrderStatus;
  }
  return prodAsPerDelStatus;
}

/*
    param->
    1.order delivery status
*/
function getProdDelStatusRowStr(orderStatus, viewType) {
  return `<div class="row in-${viewType}">
        <div class="ordered-item-status">${orderStatus}</div></div>`;
}

function formatDateFromCT(dateFromCT) {
  return commonUtility().dateFormate(dateFromCT);
}

function getProductString(
  orderStatus,
  prodName,
  orderedImage,
  prodSku,
  prodColor,
  unitPrice,
  qnty,
  estDelDate,
  trackId,
  classForDelDetails,
  currencyCode,
  stepNum,
  isSellable,
  productDetails,
  isOfflineProduct
) {
  var prodDetailsStr =
    `<div class="order-card"> 
  ${getProdDelStatusRowStr(orderStatus, "mobile")}
    <div class="row">
        <div class="col-sm-12 col-md-8 col-lg-5 col-xl-5">
            <div class="row no-gutter">
                <div class="col-lg-4 col-xl-3 col-4 col-md-3 col-sm-2">
                    <div class="card1">
                        <div class="product-img-wrapper">
                            <a class="${
                              isOfflineProduct ? "button--disabled" : ""
                            }" href="${SeoUrl(productDetails)}"
                                ><img
                                class="product-img"
                                alt="${prodSku}"
                                src="${orderedImage}"/>
                            </a>
                        </div>
                        <button data-item-published="${
                          isSellable ? true : false
                        }" class="${
      isSellable
        ? "reorder-btn ie-scondary-btn analytic-reorder-btn"
        : "button--disabled reorder-btn ie-scondary-btn analytic-reorder-btn"
    } "data-currency-code=${currencyCode} data-sku=${prodSku} data-qnty=${qnty} onclick="addToCartForOrderDetails(this)">Reorder</button>
                    </div>
                </div>
                <div class="col-lg-8 col-xl-9 col-8 col-md-9 col-sm-10">
                    <div class="ordered-item-details-col2">
                        <div class="ordered-item-title">
                            <a class="${
                              isOfflineProduct ? "button--disabled" : ""
                            }" data-slug="${
      productDetails.slug
    }" href="${SeoUrl(productDetails)}" title="${prodName}">
                                <span class="ordered-item-title-text">
                                    ${prodName}
                                </span>
                            </a>
                        </div>
                        <div class="ordered-item-specs">
                            <span>SKU: ${prodSku}</span>
                            <span class="${
                              prodColor ? "" : "d-none"
                            }">Color:${prodColor}</span><br />
                            <span>Unit price: $${unitPrice}</span><br />
                            <span>Quantity: <span id = "qty">${qnty}</span></span><br />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-sm-12 col-md-4 offset-lg-2 col-lg-5 offset-xl-2 col-xl-5">
            <div class="${classForDelDetails}">
                <span class="estimated-delivery-text">Estimated Delivery: ${estDelDate}</span>
                <br />
                <span class="tracking-id">Tracking : <span class="tracking-no">${trackId} </span></span><br>` +
    getTracker(stepNum) +
    `</div>
        </div>
    </div>
    <hr class='breaking-line in-mobile' /></div>
    `;
  return prodDetailsStr;
}

function getTracker(stepNum) {
  var widthOfBar = stepNum * 25;
  return (
    `
    <div class="sg-status-graph">
      <div class="sg-progress">
        <div class="sg-percent" style="width:${widthOfBar}%"></div>
      </div>
      <div class="sg-steps">` +
    getSteps(stepNum) +
    `</div>
      <div class="sg-labels">
        <div class="label placed-label" >Placed</div>
        <div class="label shipped-label" >Shipped</div>
        <div class="label ood-label" >Out for Delivery</div>
        <div class="label delivered-label" >Delivered</div>
    </div>
  </div>
  `
  );
}
function getSteps(stepNums) {
  let stepString = `<div class="sg-step completed"></div>`;
  for (let i = 0; i < stepNums; i++) {
    stepString += `<div class="sg-step completed"></div>`;
  }
  for (let i = stepNums; i < 4; i++) {
    stepString += `<div class="sg-step"></div>`;
  }
  return stepString;
}

function addToCartForOrderDetails(currentEle) {
  window.addtocartSpecific(currentEle);
}
