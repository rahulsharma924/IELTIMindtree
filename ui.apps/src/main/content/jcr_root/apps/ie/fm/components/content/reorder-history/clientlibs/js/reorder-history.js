var pageSize = 10;
var curPage = 1;
var allOrderListData = [];
var orderListRecord = [];
var currentNumOfRows = 0;
var table;
var listRecord;
var historyOffset, historyLimit;
var orderHistoryOffsetCount = 0;
var isTotalCountReached = false;
var totalListRecord;

$(document).ready(function () {
  const $component = $(".reorder-history");
  if ($component.length === 0) {
    return;
  }
  /*** Order History Api call*/
  getOrderHistoryDetails();
});

/**
 * getOrderHistoryDetails()
 * @param {Number} historyOffset Page No = 1 Default
 * @param {Number} historyLimit Page Size = 10 Default
 * @param {String} sortingName [date,status,total,items]
 * @param {String} sortingOrder  //asc or desc
 */

function getOrderHistoryDetails(
  historyOffset,
  historyLimit,
  sortingName,
  sortingOrder
) {
  historyOffset = historyOffset || 1;
  historyLimit = historyLimit || 10;
  /*** Order History Api call*/
  const customerToken = window.isCustomerToken()
      ? window.isCustomerToken()
      : "",
    bearerToken = window.getbearerToken() ? window.getbearerToken() : "",
    data = {
      customer_token: customerToken,
      bearertoken: bearerToken,
      pageNo: historyOffset,
      pageSize: historyLimit,
      sortField: sortingName || "date", //
      sortingOrder: sortingOrder || "desc" // asc/desc
    };
  loadGetOrderHistory(data);
}
function loadGetOrderHistory(data) {
  window.getAPIModule
    .getOrderHistory(data)
    .done(function (response) {
      //window.errorModule.checkError(response);
      if (response && !response.statusCode) {
        if (!response?.results || !response?.results) {
          return;
        }
        orderHistoryResponse(response);
      }
    })
    .fail(function (error) {
      window.errorModule.showErrorPopup(error)
    });
}

/**
 * orderHistoryResponse()
 * @param {Object} response
 */
function orderHistoryResponse(response) {
  $("#orderListBody").empty(); // Clear ALl the Value Before Updating new Value
  listRecord = response.results;
  totalListRecord = response.total;
  orderListRecord = listRecord;

  //allOrderListData = [];
  //allOrderListData = listRecord;

  table = document.querySelector("#orderListBody");
  var numOfRows = parseInt(document.getElementById("numOfRows").value);
  document.querySelector("#next").addEventListener("click", nextPage, false);
  document
    .querySelector("#prev")
    .addEventListener("click", previousPage, false);

  var actualNumOfRows = listRecord.length;
  var actualNumOfTotalRows = totalListRecord;

  $("#totalNumberOfRows").text(actualNumOfTotalRows);
  markupGenerated(listRecord);
  numberOfRows(actualNumOfRows, actualNumOfTotalRows, pageSize);
}

/*** addToCartWithReorder() : Click on reorder button*/
function addToCartWithReorder($element) {
  var currentElement = $($element);
  var elementData = currentElement.data();
  // Reorder Status Check and redirect to continue-shopping url.
  getReorderDetailsData(window.isCustomerToken(), elementData.orderId);
}

/**
 * getReorderDetailsData(); return the Response after click on reorder link and redirect to continue-shopping URL
 * @access private
 * @param {String} [orderId , customerTocken]
 * @returns {Object}
 */
function getReorderDetailsData(customerToken, orderId) {
  const data = {
    customer_token: customerToken,
    order_id: orderId,
    bearerToken: window.getbearerToken() ? window.getbearerToken() : ""
  };
  window.getAPIModule
    .getReorder(data)
    .done(function (response) {
      //window.errorModule.checkError(response);
      if (response && Object.keys(response).length) {
        // Update MiniCart
        $(document).trigger(
          $.fn.getAPIEndpoint().customEvent.SHOPPING_CART_RESPONSE,
          response?.cart
        );
        //analytic code here
        let customlineitems = response.cart.customLineItems;
        let lineitems = response.cart.lineItems;
        let addTocartProductArr = [];
        if (customlineitems?.length > 0 || lineitems?.length > 0) {
          addTocartProductArr = [...customlineitems, ...lineitems];
        }
        let quantity = "", rfcaTesting = "", pageCategory= "order-history";
        addToCartAllProdDL(
          addTocartProductArr,
          quantity,
          rfcaTesting,
          pageCategory
        );
      }
    })
    .fail(function (error) {
      window.errorModule.showErrorPopup(error)
    });
}

//for sorting descending order
$("#idSortDropDown").on("change", function () {
  var selectedOption = $(this).find(":selected").val();
  var sortedOrdersBuffer = [];

  //if sort by total option is selected //desceding
  if (selectedOption === "total") {
    getOrderHistoryDetails(curPage, pageSize, "total", "desc");
  }

  //if sort by status option is selected //ascending
  else if (selectedOption === "status") {
    getOrderHistoryDetails(curPage, pageSize, "status", "asc");
  }

  //if sort by date is selected //descending
  else if (selectedOption === "date") {
    getOrderHistoryDetails(curPage, pageSize, "date", "desc");
  }

  //if sort by items is selected //descending
  else if (selectedOption === "items") {
    getOrderHistoryDetails(curPage, pageSize, "items", "desc");
  }
});

//for changing number of rows in table
$("#numOfRows").on("change", function () {
  let currentSelectedValue = $(".sortby-dropdown").val();
  pageSize = parseInt(document.getElementById("numOfRows").value);
  curPage = 1;
  $("#orderListBody").empty();
  //markupGenerated(orderListRecord);
  historyOffset = 1;
  historyLimit = pageSize;
  const dataRows = {
    customer_token: window.isCustomerToken() ? window.isCustomerToken() : "",
    bearertoken: window.getbearerToken() ? window.getbearerToken() : "",
    offset: historyOffset,
    limit: historyLimit
  };
  getOrderHistoryDetails(historyOffset, historyLimit, currentSelectedValue);
});

/**
 * markupGenerated() Generate Markup and appended in DOM
 * @param {Object} Data
 */
function markupGenerated(data) {
  //allOrderListData.length = 0; // Reset Old Value
  let result = "";
  currentNumOfRows = 0;

  data
    .filter((row, index) => {
      let start = (curPage - 1) * pageSize;

      let end = curPage * pageSize;

      if (index >= start && index < end) {
        return true;
      } else if (data.length <= pageSize) {
        return true;
      }
    })
    .forEach((order) => {
      let resMer = {};
      currentNumOfRows++;
      // check if item published or not from algolia
      const totalItems = order.totalItems;
      //let totalLineItems = commonUtility().responseFilter(totalItems);
      //const skuId = getAPIModule.getSKUList(totalLineItems);
      let isSellable = order.isReorderable;
      markupRender(order, totalItems, isSellable);
    });

  $("#totalNumberOfPages").text(Math.ceil(totalListRecord / pageSize));
  var totalnumberofpagess = $("#totalNumberOfPages").text();
  if (totalnumberofpagess == 0) {
    $("#currentPageNumber").text("0");
  } else {
    $("#currentPageNumber").text(curPage);
  }

  var curentpagenubers = $("#currentPageNumber").text();

  if (parseInt(curentpagenubers) == 1) {
    if (parseInt(totalnumberofpagess) == 1) {
      $("#next")
        .removeClass("enable_pagination_arrow")
        .addClass("disable_pagination_arrow");
      $("#prev")
        .removeClass("enable_pagination_arrow")
        .addClass("disable_pagination_arrow");
    } else {
      $("#next")
        .removeClass("disable_pagination_arrow")
        .addClass("enable_pagination_arrow");
      $("#prev")
        .removeClass("enable_pagination_arrow")
        .addClass("disable_pagination_arrow");
    }
  } else if (parseInt(curentpagenubers) < parseInt(totalnumberofpagess)) {
    $("#next")
      .removeClass("disable_pagination_arrow")
      .addClass("enable_pagination_arrow");
    $("#prev")
      .removeClass("disable_pagination_arrow")
      .addClass("enable_pagination_arrow");
  } else if (
    parseInt(curentpagenubers) == parseInt(totalnumberofpagess) &&
    parseInt(curentpagenubers) != 0
  ) {
    $("#next")
      .removeClass("enable_pagination_arrow")
      .addClass("disable_pagination_arrow");
    $("#prev")
      .removeClass("disable_pagination_arrow")
      .addClass("enable_pagination_arrow");
  } else {
    $("#next")
      .removeClass("enable_pagination_arrow")
      .addClass("disable_pagination_arrow");
    $("#prev")
      .removeClass("enable_pagination_arrow")
      .addClass("disable_pagination_arrow");
  }
}

// MarkupRender() Order History List Item generated
function markupRender(order, totalLineItems, isSellable) {
  let result = "";
  result +=
    "<tr class='table-rows'><td>" +
    (order.status ? statusCodeMapping(order) : "") +
    "</td><td>" +
    window.commonUtility().dateFormate(order.createdAt) +
    "</td><td><a title=" +
    order.orderNumber +
    " href='/content/fm/en/my-account/orders/order-history-details.html?order_id=" +
    (order.orderId || "") +
    "' class='order-number-text analyticorderhistory-ordno'>" +
    (order.orderNumber || "") +
    "</a></td><td class='column-dis-none-mob'>" +
    (order.poNumber || "-") +
    "</td><td class='column-dis-none-mob total__price'>$" +
    window.priceFormate.formatPrice(order.orderTotal) +
    "</td><td class='items-col column-dis-none-mob total__items'>" +
    totalLineItems +
    "</td>" +
    reorderButtonMarkup(order, totalLineItems, isSellable) +
    "</tr>";

  $(table).append(result);
  //alert('ok1')
}

// Reorder Button markup
function reorderButtonMarkup(order, totalLineItems, isSellable) {
  return `<td class="column-dis-none-mob reorder--button">
    <strong>
      <a
        href="javascript:void(0)"
        class="${
          isSellable
            ? "reorder-txt analyticorderhistory-reorder"
            : "button--disabled reorder-txt analyticorderhistory-reorder"
        }"
        data-order-id="${order.orderId}"
        data-lineItems-length='
            ${totalLineItems}'
        onclick="addToCartWithReorder(this)"
        data-item-published="${isSellable ? false : true}"
      >
        Reorder
      </a>
    </strong>
  </td>`;
}

// Order Status Updated
function statusCodeMapping(statusCode) {
  if (statusCode) {
    if (statusCode.status == "P") {
      return "Processing";
    } else if (statusCode.status == "O") {
      return "Open";
    } else if (statusCode.status == "C") {
      return "Closed/Complete";
    } else if (statusCode.status == "V") {
      return "Void";
    } else if (statusCode.status == "N") {
      return "New web order";
    } else if (statusCode.status == "H") {
      return "Hold";
    } else {
      return "";
    }
  }
}

function previousPage() {
  let currentSelectedValue = $(".sortby-dropdown").val(),
    historyOffset;
  if (curPage > 1) {
    curPage--;
  }
  $("#orderListBody").empty();

  historyLimit = pageSize;
  getOrderHistoryDetails(curPage, historyLimit, currentSelectedValue);
  //markupGenerated(orderListRecord);
}

function nextPage() {
  curPage++;
  let currentSelectedValue = $(".sortby-dropdown").val();
  //if (curPage * pageSize <= orderListRecord.length) curPage++;
  //if (curPage * pageSize >= orderListRecord.length) curPage++;
  $("#orderListBody").empty();

  historyOffset = curPage;
  historyLimit = Number(pageSize);
  getOrderHistoryDetails(historyOffset, historyLimit, currentSelectedValue);
  //markupGenerated(orderListRecord);
}

function numberOfRows(lengthOfData, totalNoData, defNoRows) {
  $("#numOfRows").empty();
  var res = defNoRows;
  var arrOfNum = [10, 20, 50, 100];
  const select = document.getElementById("numOfRows");
  //for (var i = 0; i < arrOfNum.length && arrOfNum[i] <= lengthOfData; i++) {
  for (var i = 0; i < arrOfNum.length; i++) {
    const option = document.createElement("option");
    option.innerHTML =
      "<option value = " + arrOfNum[i] + ">" + arrOfNum[i] + "</option>";
    select.appendChild(option);
  }
  $("#numOfRows").val(defNoRows);
}

//code to track CTA link on sort functionality
document.querySelector("body").addEventListener(
  "change",
  function (e) {
    var selectElement = e.target.closest("select");
    var label = "";
    var specificCategory = "";
    var sorttype = "Order History";
    var sortcategory = "Orders";
    var pagecategory = "Order History";
    if (
      selectElement !== null &&
      selectElement.value !== null &&
      selectElement.closest(".analyticorderhistory-sort") != null
    ) {
      var selectedText =
        selectElement.options[selectElement.selectedIndex].text;
      if (selectElement.closest(".analyticorderhistory-sort") != null) {
        label = selectedText.trim();
      }
      plpsortDataLayerCall(
        label,
        specificCategory,
        sorttype,
        sortcategory,
        pagecategory
      );
      return false;
    } else {
      return true;
    }
  },
  false
);

//code to track CTA link on sort/no of pagees option click
document.querySelector("body").addEventListener(
  "change",
  function (e) {
    var selectElement = e.target.closest("select");
    var label = "";
    var category = "";
    var specificCategory = "";
    if (selectElement !== null && selectElement.value !== null) {
      var selectedText =
        selectElement.options[selectElement.selectedIndex].text;
      label = selectedText.trim();
      if (selectElement.closest(".analyticplplimiter") != null) {
        label = "Order History Select Filter-" + label;
        category = "Order-History";
      }
      ctalinkDataLayerCall(label, category, specificCategory);
      return false;
    } else {
      return true;
    }
  },
  false
);

//code to track CTA link on orderno row & reorder row
document.querySelector("body").addEventListener(
  "click",
  function (e) {
    var anchor = e.target.closest("a");
    var label = "";
    var category = "";
    if (
      anchor !== null &&
      anchor.textContent !== null &&
      anchor.closest(".analyticorderhistory-ordno") != null
    ) {
      label = "OrderNumber-" + anchor.textContent.trim();
      category = "Order-History";
    }
    if (
      anchor !== null &&
      anchor.textContent !== null &&
      anchor.closest(".analyticorderhistory-reorder") != null
    ) {
      label = anchor.textContent.trim();
      category = "Order-History";
    }
    ctalinkDataLayerCall(label, category);
  },
  false
);

//code to track analytic data for pagination
document.querySelector("body").addEventListener(
  "click",
  function (e) {
    var anchor = e.target.closest("a");
    var label = "";
    var category = "";
    var currentPage = "";
    var specificCategory = "";

    if (
      anchor !== null &&
      anchor.textContent !== null &&
      anchor.closest(".analyticorderhistory-pagination") != null
    ) {
      if (anchor.className.search("nxt") != "-1") {
        //Next button press
        label = "Pagination Link-Next";
        currentPage = curPage;
      } else {
        //previous button press
        label = "Pagination Link-Previous";
        currentPage = curPage;
      }
      category = "Order History";
      //alert("label="+label+" currentPage="+currentPage+" category="+category+" specificCategory="+specificCategory);
      paginationdataLayerCall(label, category, currentPage, specificCategory);
      return false;
    } else {
      return true;
    }
  },
  false
);
