$(document).ready(function () {
  const customerToken = $.fn.cookiesRead().customerToken(),
    $component = $(".product__ordered");
  const TRUE = "true";
  let pageSize = 12,
    curPage = 1,
    totalNoOfRows = 0,
    productDetails = [],
    labelData = "",
    sortArray = [];
  window.getUTILITYModule
    .getUtility()
    .done(function (response) {
      labelData = response ? response[0] : [];
    })
    .fail(function (error) {});

  orderedProductResponse();
  function orderedProductResponse(data) {
    const token = {
        customer_token: customerToken,
        bearertoken: window.getbearerToken()
      },
      dataObject = $.extend({}, token, data);

    window.getAPIModule
      .getOrderedProduct(dataObject)
      .done(function (response) {
        //window.errorModule.checkError(response);
        if (response && !response.error) {
          orderedProductMarkup(response);
        }
      })
      .fail(function (error) {
        //return error;
        window.errorModule.showErrorPopup(error)
      });
  }
  function orderedProductMarkup(response) {
    productDetails = response;
    sortProductDetails(productDetails);

    totalNoOfRows = sortArray.length;
    $("#prodcutorderedlist").empty();
    appendData1(sortArray);

    $("#totalNumberOfRows").text(totalNoOfRows);
    $("#totalNumberOfRowsbottom").text(totalNoOfRows);

    document.querySelector("#next").addEventListener("click", nextPage, false);
    document
      .querySelector("#prev")
      .addEventListener("click", previousPage, false);
    numberOfRows(totalNoOfRows, pageSize);
    numberOfRowsforDesktop(totalNoOfRows, pageSize);
    sortArray = [];
    $("#currentPageNumber").text(curPage);
    let pageCount = Math.ceil(totalNoOfRows / pageSize);
    if (pageCount > 1) {
      $("#next i").addClass("nxtbutton");
    }
    $("#totalNumberOfPages").text(Math.ceil(totalNoOfRows / pageSize));
    if (currentNumOfRows < 12) {
      $("#numOfRows").prop("disabled", true);
    } else {
      $("#numOfRows").prop("disabled", false);
    }
  }

  $("#original").on("change", function () {
    var clicked = document.getElementById("original").value;
    if (clicked == 30) {
      orderedProductResponse({ past30daysProducts: TRUE });
    }

    if (clicked == -1) {
      orderedProductResponse({ past60daysProducts: TRUE });
    }

    if (clicked == 90) {
      orderedProductResponse({ past90daysProducts: TRUE });
    }

    if (clicked == 180) {
      orderedProductResponse({ past180daysProducts: TRUE });
    }

    if (clicked == 270) {
      orderedProductResponse({ past270daysProducts: TRUE });
    }

    if (clicked == 360) {
      orderedProductResponse({ past360daysProducts: TRUE });
    }
  });

  $("#numOfRowsbottom").on("change", function () {
    pageSize = parseInt(document.getElementById("numOfRowsbottom").value);
    curPage = 1;
    sortProductDetails(productDetails);
    appendData1(sortArray);
  });

  $("#searchbox").on("change", function () {
    var searchText = document.getElementById("searchbox").value;
    if (searchText.length > 3) {
      const data = {
        customer_token: customerToken,
        query: searchText,
        bearertoken: window.getbearerToken()
      };
      window.getAPIModule
        .getProductSearch(data)
        .done(function (response) {
          //window.errorModule.checkError(response);
          if (response && !response.error) {
            orderedProductMarkup(response);
          }
        })
        .fail(function (error) {
          //return error;
          window.errorModule.showErrorPopup(error)
        });
    }
    if (searchText.length == 0) {
      orderedProductResponse();
    }
  });

  function appendData1(data) {
    let filterData = [];
    let dataHandlerbar = $component
      .find(".product__ordered--handlerbar")
      .html();
    let template = window.Handlebars.compile(dataHandlerbar);
    var result = "";
    currentNumOfRows = 0;
    data
      .filter((row, index) => {
        let start = (curPage - 1) * pageSize;
        let end = curPage * pageSize;
        if (index >= start && index < end) return true;
      })
      .forEach((order, index) => {
        currentNumOfRows++;
        filterData.push(order);
      });

    $component
      .find("#prodcutorderedlist")
      .html(template({ filterData, limitData: pageSize }));
    // Updated The Key
    $component.find(".add__to__cart").text(labelData.labels.addToCart);
    $component.find(".view__order").text(labelData.labels.viewOrder);
    $component.find(".learn__more").text(labelData.labels.learnMore);
    $component.find(".learn__more").attr("title", labelData.labels.learnMore);
    $("#currentPageNumber").text(curPage);
    $("#totalNumberOfPages").text(Math.ceil(totalNoOfRows / pageSize));
    let pageCount = Math.ceil(totalNoOfRows / pageSize);
    //numberOfRows(totalNoOfRows, pageSize);
    //numberOfRowsforDesktop(totalNoOfRows, pageSize);
    if (curPage == 1) {
      if (pageCount == 1) {
          $("#prev i").removeClass("nxtbutton");
          $("#next i").removeClass("nxtbutton");
      } else {
          $("#prev i").removeClass("nxtbutton");
          $("#next i").addClass("nxtbutton");
      }
    }  else if (curPage < pageCount) {
        $("#prev i").addClass("nxtbutton");
        $("#next i").addClass("nxtbutton");
    } else if (curPage == pageCount && curPage != 0) {
        $("#prev i").addClass("nxtbutton");
        $("#next i").removeClass("nxtbutton");      
    } else {
      $("#prev i").removeClass("nxtbutton");
      $("#next i").removeClass("nxtbutton");      
    }

    if (currentNumOfRows < 12) {
      $("#numOfRows").prop("disabled", true);
    } else {
      $("#numOfRows").prop("disabled", false);
    }
    //$("#prodcutorderedlist").html(result);
  }

  function previousPage() {
    if (curPage > 1) curPage--;
    sortProductDetails(productDetails);
    appendData1(sortArray);
    let pageCount = Math.ceil(totalNoOfRows / pageSize);
    if (curPage == 1) {
      if (pageCount == 1) {
          $("#prev i").removeClass("nxtbutton");
          $("#next i").removeClass("nxtbutton");
      } else {
          $("#prev i").removeClass("nxtbutton");
          $("#next i").addClass("nxtbutton");
      }
    }  else if (curPage < pageCount) {
        $("#prev i").addClass("nxtbutton");
        $("#next i").addClass("nxtbutton");
    } else if (curPage == pageCount && curPage != 0) {
        $("#prev i").addClass("nxtbutton");
        $("#next i").removeClass("nxtbutton");      
    } else {
      $("#prev i").removeClass("nxtbutton");
      $("#next i").removeClass("nxtbutton");      
    }
  }

  function nextPage() {
    if (curPage * pageSize < totalNoOfRows) curPage++;
    sortProductDetails(productDetails);
    appendData1(sortArray);
    $("#prev i").addClass("nxtbutton");
    let pageCount = Math.ceil(totalNoOfRows / pageSize);
    if (curPage == 1) {
      if (pageCount == 1) {
          $("#prev i").removeClass("nxtbutton");
          $("#next i").removeClass("nxtbutton");
      } else {
          $("#prev i").removeClass("nxtbutton");
          $("#next i").addClass("nxtbutton");
      }
    }  else if (curPage < pageCount) {
        $("#prev i").addClass("nxtbutton");
        $("#next i").addClass("nxtbutton");
    } else if (curPage == pageCount && curPage != 0) {
        $("#prev i").addClass("nxtbutton");
        $("#next i").removeClass("nxtbutton");      
    } else {
      $("#prev i").removeClass("nxtbutton");
      $("#next i").removeClass("nxtbutton");      
    }
  }

  function numberOfRows(lengthOfData, defNoRows) {
    var res = defNoRows;
    var arrOfNum = [12, 24, 36];
    const select = document.getElementById("numOfRows");
    document.getElementById("numOfRows").innerHTML = "";
    //for (var i = 0; i < arrOfNum.length && arrOfNum[i] <= lengthOfData; i++) {
    for (var i = 0; i < arrOfNum.length; i++) {
      const option = document.createElement("option");
      option.innerHTML =
        "<option value = " + arrOfNum[i] + ">" + arrOfNum[i] + "</option>";
      select.append(option);
    }
  }

  function numberOfRowsforDesktop(lengthOfData, defNoRows) {
    var res1 = defNoRows;
    var arrOfNum1 = [12, 24, 36];
    const select1 = document.getElementById("numOfRowsbottom");
    document.getElementById("numOfRowsbottom").innerHTML = "";
    //for (var j = 0; j < arrOfNum1.length && arrOfNum1[j] <= lengthOfData; j++) {
    for (var j = 0; j < arrOfNum1.length; j++) {
      const option1 = document.createElement("option");
      option1.innerHTML =
        "<option value = " + arrOfNum1[j] + ">" + arrOfNum1[j] + "</option>";
      select1.append(option1);
    }
  }

  function sortProductDetails(productDetails) {
    var sortedOrdersBuffer = [];

    sortArray = [];
    for (var j = 0; j < productDetails.length; j++) {
      for (var productdata2 of productDetails[j]) {
        sortArray.push(productdata2);
      }
    }

    sortArray.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  }
});
