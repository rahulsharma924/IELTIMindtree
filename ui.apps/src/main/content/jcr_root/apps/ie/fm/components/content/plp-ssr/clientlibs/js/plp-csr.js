let isalgolia = true;
$(document).ready(function () {
  let facetTitleVal = "";
  function aemalgoliasearch(utilityMessage) {
    const { connectPagination } = instantsearch.connectors;
    const customPagination = connectPagination($algoliaWidget.renderPagination);
    const customPagination2 = connectPagination(
      $algoliaWidget.renderPagination2
    );
    const { connectStats } = instantsearch.connectors;
    const customStats1 = connectStats($algoliaWidget.renderStats1);
    // Instantiate the custom widget for  pagination
    search.addWidgets([
      customPagination({
        container: document.querySelector("#pagination-top")
      }),
      customPagination2({
        container: document.querySelector("#pagination-bottom")
      }),
      customStats1({
        container: document.querySelector("#page-length-end")
      })
    ]);
    let isPageLoad = true;
    let isSubCategory = false;
    const pathnameMatches = location.pathname.match(/category\/(.*?)\/?$/);
    const categoryLabel = pathnameMatches ? `/${pathnameMatches[1]}` : [];
    let categoryName;
    if (pathnameMatches && categoryLabel) {
      if (categoryLabel.indexOf("all.html") > -1) {
        categoryName = categoryLabel.split("/all.html")[0];
      } else if (categoryLabel.indexOf(".html") > -1) {
        categoryName = categoryLabel.split(".html")[0];
      } else categoryName = categoryLabel;
    }
    //Dynamic filter function start
    search.on("render", () => {
      if (search.status === "idle") {
        const response = search?.renderState[indexSelected]?.hits;
        window.getAPIModule
          .getCategoriesJson()
          .done(function (data) {
            getCategoriesData(data, response);
          })
          .fail(function (error) {
            console.log(error);
          });
        $algoliaWidget.facetDisplay();

        $algoliaWidget.editParameters();
        $algoliaWidget.editParametersPopUp();
        $algoliaWidget.editParametersPopUpReading();

        $(".table-view-button").on("click", function () {
          $algoliaWidget.editParameters();
          $algoliaWidget.editParametersPopUp();
          $algoliaWidget.editParametersPopUpReading();
        });
        let table_view = document.querySelector(".table-view-button");
        if ($(table_view).hasClass("active")) {
          $algoliaWidget.editParameters();
          $algoliaWidget.editParametersPopUp();
          $algoliaWidget.editParametersPopUpReading();
        }

        $("#algolia-data-ssr").fadeOut(2500).remove();
        $("#algolia-data").fadeIn(2000).removeClass("d-none");
        if (facetTitleVal.length > 0 || facetTitleVal.length != "undefined") {
          if (facetTitleVal != "priceSlider") {
            $("#catfilter-head .accordion-head").each(function () {
              let txt = $(this).text();
              txt = $.trim(txt);
              if (txt == facetTitleVal) {
                $(this).trigger("click");
              }
            });
          } else {
            $("#price-range").prev().trigger("click");
            $("html, body").animate(
              {
                scrollTop: $("#price-range").offset().top - 200
              },
              "slow"
            );
          }
          facetTitleVal = "";
        }
        //run the function to append price inventory from CT
        $algoliaWidget.ctPriceInventoryPlp(utilityMessage);
      }
      $algoliaWidget.RenderHandler();
    });

    /**
     * getCategoriesData() Get Category Data.
     * @param {Object} data Categories Response
     * @param {Object} response algolia Response
     */

    function getCategoriesData(categoryData, response) {
      let categoryObject = commonUtility().categoryMatch(categoryData);
      $("#brand-list .ais-RefinementList-checkbox").on(
        "click",
        function (event) {
          categoryFacetValue = $(event.currentTarget).attr("value");
          isPageLoad = false;
          if (commonUtility().isCategoryInURL()) {
            commonUtility().categoryFacetSeoUrl(
              categoryFacetValue,
              response,
              false,
              categoryData
            );
          } else if ($("#new-releases").length) {
          }
        }
      );
      if ($("#new-releases").length || $("#bestsellers").length) {
        const filterValue =
          response.results._state.disjunctiveFacetsRefinements[
            "hierarchicalCategories.lvl0"
          ][0];
        if (filterValue) {
          $algoliaWidget.searchFilter(filterValue, response);
        }
      }

      //Sub category;
      $(
        "#lvl1-cat .ais-RefinementList-checkbox,lvl1-cat-ssr .ais-RefinementList-checkbox"
      ).on("click", function (event) {
        categoryFacetValue = $(event.currentTarget).attr("value");
        let splitCategory = categoryFacetValue.split(" > ")[1];
        isSubCategory = true;
        isPageLoad = false;
        commonUtility().categoryFacetSeoUrl(
          categoryFacetValue,
          response,
          isSubCategory,
          categoryData
        );
      });

      if (
        pathnameMatches !== null &&
        response.results.hits.length &&
        pathnameMatches[0].indexOf("all.html") < 0 &&
        isPageLoad
      ) {
        $algoliaWidget.searchFilter(
          response.results.hits[0].category[0],
          response,
          categoryObject
        );
      }
    }

    //search.on("render", $algoliaWidget.searchFilter);
    //Dynamic filter function End

    search.addWidgets([
      $algoliaWidget.categoriesList(),
      $algoliaWidget.categoriesListLevelOne(),
      $algoliaWidget.categoriesListLevelTwo(),
      $algoliaWidget.priceRangeSlider(),
      $algoliaWidget.priceRangeInput(),
      $algoliaWidget.categoriesIsNew(),
      $algoliaWidget.clearRefinements(utilityMessage),
      $algoliaWidget.clearRefinementsMobile(utilityMessage),
      $algoliaWidget.sortWidget(utilityMessage),
      $algoliaWidget.hitsPerPage(),
      $algoliaWidget.statsTop(utilityMessage),
      $algoliaWidget.statsMobile(utilityMessage),
      $algoliaWidget.statsBottom(utilityMessage),
      $algoliaWidget.hitPerPageTop(),
      $algoliaWidget.hitPerPageBottom(),
      $algoliaWidget.hitPerPageMobile(),
      $algoliaWidget.mainHits(utilityMessage),
      $algoliaWidget.isSellable(),
      $algoliaWidget.priceCurrentRefinement()
    ]);
    search.addWidget(
      instantsearch.widgets.configure({
        facetsRefinements: {
          categorySEOURL: categoryName ? [categoryName] : []
        },
        facets: ["categorySEOURL"]
      })
    );

    if ($("#bestsellers").length) {
      search.addWidget($algoliaWidget.hitsPerPageBestSeller());
    }
    ///search.on("render", $algoliaWidget.RenderHandler);
    //search.on("render", $algoliaWidget.editParameters);
    search.use(
      instantsearch.middlewares.createInsightsMiddleware({
        insightsClient: window.aa,
        insightsInitParams: {
          useCookie: false
        }
      })
    );

    search.start();
    $algolia.recentViewData();
  }
  let priceRangeInterval;
  function addQueryParam(classname, queryParam) {
    $(document).on(
      "click change mouseup mousemove",
      "." + classname,
      function (event) {
        event.preventDefault();

        // Get the current URL
        let currentURL = window.location.href;
        let url = new URL(currentURL);

        // Check if the URL already has a query parameter
        let separator;
        if (queryParam.length > 1) {
          separator = currentURL.includes("?") ? "&" : "?";
        } else {
          separator = "";
        }

        // Build the new URL with the additional query parameter
        let newURL = `${currentURL}${separator}${queryParam}`;
        //check if there are existing parameter in the url
        if (url.search) {
          url.search = `${queryParam}&${url.searchParams.toString()}`;
          window.history.pushState({}, "", url.href);
          // Create a new URL with the query parameter
          const urlWithQueryParam = new URL(currentURL);
          urlWithQueryParam.searchParams.set(
            queryParam.split("=")[0],
            queryParam.split("=")[1]
          );
          // Replace the current URL without reloading the page
          window.history.replaceState({}, "", url.href);
        } else {
          url.search = `${currentURL}${separator}${queryParam}`;
          window.history.pushState({}, "", newURL);
          // Create a new URL with the query parameter
          const urlWithQueryParam = new URL(currentURL);
          urlWithQueryParam.searchParams.set(
            queryParam.split("=")[0],
            queryParam.split("=")[1]
          );
          // Replace the current URL without reloading the page
          window.history.replaceState({}, "", newURL);
        }

        //Run algolia
        if (isalgolia) {
          window.getUTILITYModule
            .getUtility()
            .done(function (data) {
              aemalgoliasearch(data[0]);
              if (classname == "price-range-ssr") {
                priceRangeInterval = setInterval(triggerPriceRange, 1000);
              }
            })
            .fail(function (error) {});
          isalgolia = false;
        }
      }
    );
  }
  function triggerPriceRange() {
    if ($("#price-range").length > 0) {
      $("#price-range").parent().find(".accordion-head").trigger("click");
      clearInterval(priceRangeInterval);
      $("html, body").animate(
        {
          scrollTop: $("#price-range").offset().top - 200
        },
        "slow"
      );
    }
  }

  //function to update url parameter on pagination and show per page interaction
  function updateUrlParams(action, customValue) {
    let baseUrl = window.location.href;
    // Get selected values from dropdowns
    let itemsPerPage = $(".ais-HitsPerPage-select").val(),
      currentPage = $(".active-page").data("value"),
      currentIndex = $(".plpSortBySelect").val(),
      firstPage = $(".mob-first-page").data("value"),
      lastPage = $(".mob-last-page").data("value"),
      customPageValue = $(`.${customValue} .page-number-ssr`).val();
    // Create a new URL object
    let url = new URL(baseUrl);

    // Set or update parameters based on selected values
    url.searchParams.set("hitsPerPage", itemsPerPage);
    // Handle next and previous page actions
    if (action === "next") {
      currentPage++;
    } else if (action === "prev" && currentPage > 0) {
      currentPage--;
    } else if (action === "first") {
      currentPage = firstPage;
    } else if (action === "last") {
      currentPage = lastPage;
    } else if (action === "custom") {
      currentPage = customPageValue - 1;
    }

    //set current selected index
    url.searchParams.set("indexName", currentIndex);

    //set current selected page
    url.searchParams.set("page", currentPage);

    //save selected values to localStorage
    localStorage.setItem("currentPage", currentPage);
    localStorage.setItem("indexName", currentIndex);
    localStorage.setItem("hitsPerPage", itemsPerPage);

    // Log the updated URL
    window.history.pushState({}, "", url.href);
    baseUrl = url.href;
    window.location.reload(true);
  }

  function hitsPerPageParams(selectedDropValue) {
    let baseUrl = window.location.href;
    // Get selected values from dropdowns
    let itemsPerPage = $(`.${selectedDropValue} .ais-HitsPerPage-select`).val(),
      currentPage = $(".active-page").data("value"),
      currentIndex = $(".plpSortBySelect").val(),
      firstPage = $(".mob-first-page").data("value"),
      lastPage = $(".mob-last-page").data("value"),
      url = new URL(baseUrl);

    url.searchParams.set("hitsPerPage", itemsPerPage);
    url.searchParams.set("indexName", currentIndex);
    url.searchParams.set("page", 0);

    //save selected values to localStorage
    localStorage.setItem("indexName", currentIndex);
    localStorage.setItem("hitsPerPage", itemsPerPage);

    window.history.pushState({}, "", url.href);
    baseUrl = url.href;
    window.location.reload(true);
  }

  //function to get value from a string of query param
  function getUrlParameter(parameterName) {
    let queryString = window.location.search;
    let searchParams = new URLSearchParams(queryString);
    return searchParams.get(parameterName);
  }

  function plpConversionEvent() {
    $(".add_to_cart").on("click", function () {
      const plpSku = $(this).data("sku");
      aa("convertedObjectIDsAfterSearch", {
        eventName: "Add to Cart",
        index: indexInuse,
        userToken: $algolia.algoliaUserToken(),
        objectIDs: [plpSku]
      });
    });
  }

  function plpClickEvent() {
    $(".store-obj").on("click", function () {
      const itemSku = $(this).data("object");
      aa("clickedObjectIDsAfterSearch", {
        eventName: "click on PLP Product",
        index: indexInuse,
        userToken: $algolia.algoliaUserToken(),
        objectIDs: [itemSku]
      });
    });
  }

  //function to go a paginated page directly on giving input
  function customPage(inputClass, customValue) {
    const inputField = $(`.${inputClass} .page-number-ssr`);
    let inputValue;
    const maxInputvalue = $(`.${inputClass} .page-number-ssr`).attr("max");
    // inputField.on("input", () => {
    inputValue = inputField.val();
    if (+inputValue > +maxInputvalue) {
      inputValue = maxInputvalue;
      inputField.val(maxInputvalue);
    }

    if (inputValue.trim() !== "") {
      updateUrlParams("custom", customValue);
    }
    // });
  }

  if ($("#algolia-data-ssr").length > 0) {
    //run Algolia Events
    plpConversionEvent();
    plpClickEvent();
    //set dropdown value by reading from query parameter
    let hitsperPageValue = getUrlParameter("hitsPerPage");
    let currentIndexValue = getUrlParameter("indexName");
    if (hitsperPageValue) {
      $(".ais-HitsPerPage-select").val(hitsperPageValue);
    }
    if (currentIndexValue) {
      $(".plpSortBySelect").val(currentIndexValue);
    }

    //set prev pagination link as disabled on first page
    let currentPage = $(".active-page").data("value");
    let lastPage = $(".mob-last-page").data("value");
    currentPage == 0
      ? $(".ssr-prevPage").addClass("ais-Pagination-item--disabled")
      : "";
    currentPage === lastPage
      ? $(".ssr-nextPage").addClass("ais-Pagination-item--disabled")
      : "";
    // Handle next and previous link clicks
    $(".ssr-prevPage").click(function (e) {
      e.preventDefault();
      updateUrlParams("prev");
    });
    $(".ssr-nextPage").click(function (e) {
      e.preventDefault();
      updateUrlParams("next");
    });

    $(".mob-first-page").click(function (e) {
      e.preventDefault();
      updateUrlParams("first");
    });

    $(".mob-last-page").click(function (e) {
      e.preventDefault();
      updateUrlParams("last");
    });
    // Call the function when dropdown values change
    $(".hits-per-page-ssr .ais-HitsPerPage-select").change(function () {
      hitsPerPageParams("hits-per-page-ssr");
    });

    $(".hits-per-page-bottom-ssr .ais-HitsPerPage-select").change(function () {
      hitsPerPageParams("hits-per-page-bottom-ssr");
    });

    //go to a paginated page directly on input value
    $(".desktop-pagination-top .page-number-ssr").on("input", () => {
      customPage("desktop-pagination-top", "desktop-pagination-top");
    });
    $(".desktop-pagination-bottom .page-number-ssr").on("input", () => {
      customPage("desktop-pagination-bottom", "desktop-pagination-bottom");
    });
    $(".mobile-pagination .page-number-ssr").on("input", () => {
      customPage("mobile-pagination", "mobile-pagination");
    });
  }

  if ($("#algolia-data, #newreleases-data").length > 0) {
    //Call to CSR on selecting sort by
    $(".plpSortBySelect").on("change", function () {
      updateUrlParams();
    });

    //Call to CSR on clicking Filter checkbox
    $("#catfilter-head-ssr .ais-RefinementList-checkbox").on(
      "click",
      function () {
        let selectedOption;
        if (!$(this).closest(".accordion-content").hasClass("lvl-cat-cls")) {
          let checkboxVal = $(this).val();
          let facetLabel = $(this).closest(".accordion-content").prev().text();
          facetTitleVal = facetLabel;
          selectedOption = `[${facetLabel}][0]=${checkboxVal}`;
        } else {
          let checkboxVal = $(this).val();
          var allFoundCharacters = checkboxVal.match(/[>]/g);
          let hierarchicalCategories;

          if (allFoundCharacters == null) {
            hierarchicalCategories = "hierarchicalCategories.lvl0";
          } else if (allFoundCharacters.length == 1) {
            hierarchicalCategories = "hierarchicalCategories.lvl1";
          } else if (allFoundCharacters.length == 2) {
            hierarchicalCategories = "hierarchicalCategories.lvl2";
          }

          selectedOption = `[${hierarchicalCategories}][0]=${checkboxVal}`;
        }
        if ($("#new-releases").length > 0) {
          let checkboxVal = $(this).val();
          var allFoundCharacters = checkboxVal.match(/[>]/g);
          let hierarchicalCategories;
          hierarchicalCategories = "hierarchicalCategories.lvl0";
          addQueryParam(
            "ais-RefinementList-checkbox",
            `${indexInuse}[refinementList][${hierarchicalCategories}][0]=${checkboxVal}`
          );
        } else {
          addQueryParam(
            "ais-RefinementList-checkbox",
            `${indexInuse}[refinementList]${selectedOption}`
          );
        }
      }
    );

    $("#brand-list-new-ssr .ais-RefinementList-checkbox").on(
      "click",
      function () {
        let checkboxVal = $(this).val();
        let hierarchicalCategories;
        let dataIndex;
        if ($("#new-releases").length) {
          dataIndex = indexInuse;
        } else if ($("#bestsellers").length) {
          dataIndex = indexBs;
        }
        hierarchicalCategories = "hierarchicalCategories.lvl0";
        addQueryParam(
          "ais-RefinementList-checkbox",
          `${dataIndex}[refinementList][${hierarchicalCategories}][0]=${checkboxVal}`
        );
      }
    );
  }

  $("form.ais-RangeInput-form-ssr").submit(function (event) {
    event.preventDefault();
    facetTitleVal = "priceSlider";
    let minval = $(".ais-RangeInput-input--min").val();
    let maxval = $(".ais-RangeInput-input--max").val();
    let selectedIndex = minval + ":" + maxval;

    addQueryParam(
      "ais-RangeInput-submit",
      `${indexInuse}[range][startingPrice]=${selectedIndex}`
    );
  });

  //slider
  let priceflag = true;
  $(".price-range-ssr-wrap").on("click", function () {
    if (priceflag) {
      facetTitleVal = "priceSlider";
      let minval, maxval;
      minval = Math.round($(".ais-RangeInput-input--min").attr("min"));
      maxval = Math.round($(".ais-RangeInput-input--max").attr("max"));
      let slidestopMin, slidestopMax;
      $("#slider-range").slider({
        range: true,
        min: minval,
        max: maxval,
        values: [minval, maxval],
        slide: function (event, ui) {
          $(".ais-RangeInput-input--min").val(ui.values[0]);
          $(".ais-RangeInput-input--max").val(ui.values[1]);
          slidestopMin = ui.values[0];
          slidestopMax = ui.values[1];
          // $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
        }
      });

      $("#slider-range").on("slidestop", function () {
        let selectedIndex = slidestopMin + ":" + slidestopMax;
        let dataIdx;
        if ($("#bestsellers").length) {
          dataIdx = indexBs;
        } else {
          dataIdx = indexInuse;
        }
        addQueryParam(
          "slider-range",
          `${dataIdx}[range][startingPrice]=${selectedIndex}`
        );
      });

      priceflag = false;
    }
  });
  //for clear all ..

  const isCategory = commonUtility().isCategoryInURL();
  $("#clear-refinements button, #clear-refinements-ssr button").on(
    "click",
    function () {
      if (isCategory) {
        const urlParts = location.href.match(/^(.*?)\/category/);
        const baseUrl = `${urlParts ? urlParts[1] : location.href}/`;
        window.location.href = baseUrl + "category/all.html";
      } else {
        window.location.href = location.pathname;
      }
    }
  );
  // facet alphanumeric sorting  used in filter section
  commonUtility().facetSorting();
});

//code for analytic data track on PLP product image & text click
document.querySelector("body").addEventListener(
  "click",
  function (e) {
    var image = e.target.closest("img");
    var anchor = e.target.closest("a");
    if (
      (image !== null &&
        image !== undefined &&
        image.closest(".analyticplptrack") != null) ||
      (anchor !== null &&
        anchor !== undefined &&
        anchor.closest(".analyticplptrack") != null) ||
      (anchor !== null &&
        anchor !== undefined &&
        anchor.closest(".analyticdatasheet") != null) ||
      (anchor !== null &&
        anchor !== undefined &&
        anchor.closest(".analyticcompare") != null) ||
      (anchor !== null &&
        anchor !== undefined &&
        anchor.closest(".analyticlearnmore"))
    ) {
      if (image !== null && image !== undefined) {
        mainDiv = image.closest(".analyticplptrack");
        childDiv = mainDiv.childNodes;
        productDetailsVal = childDiv["1"].value;
        //productDetailsVal=document.getElementById("analyticproddetail").value;
        productDetailsArray = productDetailsVal.split("@@");
        for (i = 0; i < productDetailsArray.length; i++) {
          if (productDetailsArray[i] === "undefined") {
            productDetailsArray[i] = "";
          }
        }
        callCtaDL(productDetailsArray[1], productDetailsArray[9]);
      } else if (
        anchor !== null &&
        anchor !== undefined &&
        anchor.closest(".analyticplptrack") != null
      ) {
        mainDiv = anchor.closest(".analyticplptrack");
        childDiv = mainDiv.childNodes;
        productDetailsVal = childDiv["1"].value;
        productDetailsArray = productDetailsVal.split("@@");
        for (i = 0; i < productDetailsArray.length; i++) {
          if (productDetailsArray[i] === "undefined") {
            productDetailsArray[i] = "";
          }
        }
        callCtaDL(productDetailsArray[1], productDetailsArray[9]);
      } else if (
        anchor !== null &&
        anchor !== undefined &&
        anchor.closest(".analyticdatasheet") != null
      ) {
        mainDiv = anchor.closest(".analyticdatasheet");
        childDiv = mainDiv.childNodes;
        dataSheetVal = childDiv["1"].value;
        dataSheetArray = dataSheetVal.split("@@");
        for (i = 0; i < dataSheetArray.length; i++) {
          if (dataSheetArray[i] === "undefined") {
            dataSheetArray[i] = "";
          }
        }
        documentDLCall(dataSheetArray, "Click");
      } else if (
        anchor !== null &&
        anchor !== undefined &&
        anchor.closest(".analyticcompare") != null
      ) {
        var prodArray = localStorage.getItem("compArr");
        var compFinalarr = JSON.parse(prodArray);
        if (compFinalarr.length > 4) {
          compFinalarr.splice(0, compFinalarr.length - 4);
        }
        labelText = "Compare-";
        for (const key in compFinalarr) {
          if (compFinalarr.hasOwnProperty(key)) {
            sku = compFinalarr[key];
            if (key == compFinalarr.length - 1) {
              labelText = labelText + sku;
            } else {
              labelText = labelText + sku + "|";
            }
          }
        }
        label = labelText;
        category = "Compare - plp";
        callCtaDL(label, category);
      } else if (
        anchor !== null &&
        anchor !== undefined &&
        anchor.closest(".analyticlearnmore") != null
      ) {
        label = anchor.textContent.trim();
        hrefval = anchor.href;
        skuval = hrefval.split("#");
        category = "out of stock - " + skuval[1] + " - plp page";
        var urlString = window.location.href;
        var url = new URL(urlString);

        specificCategory = url.searchParams.get(algoliaIndex);
        if (specificCategory == null) {
          specificCategory = "";
        }
        ctalinkDataLayerCall(label, category, specificCategory);
      }
      return false;
    } else {
      return true;
    }
  },
  false
);

//analytic code for CTA link call on prod img & prod text click
function callCtaDL(lb, prodcat) {
  prodcat?.length > 0 ? (pdcat = prodcat.replaceAll(",", "/")) : (pdcat = "");

  var urlString = window.location.href;
  var url = new URL(urlString);

  specificCategory = url.searchParams.get(algoliaIndex);
  if (specificCategory == null) {
    specificCategory = "";
  }
  ctalinkDataLayerCall(lb, pdcat, specificCategory);
}

//analytics code to track clicks on left nav filters
document.querySelector("body").addEventListener(
  "change",
  function (e) {
    var inputValue = "";
    var selectElement = e.target.closest(".analyticsplpfilter");
    if (selectElement != null && selectElement != "") {
      var filterlabel = selectElement
        .querySelector(".accordion-head")
        .textContent.trim();
      var inputElement = e.target.closest("input");
      if (inputElement != null && inputElement != "" && selectElement != null) {
        if (inputElement.nextElementSibling != null) {
          inputValue = inputElement.nextElementSibling.textContent.trim();
        }
        var checkFlag = "n";
        if (inputElement.checked === true) {
          checkFlag = "y";
        }
        var urlString = window.location.href;
        var url = new URL(urlString);
        var params = [];
        specificCategory = url.searchParams.get(algoliaIndex);
        if (specificCategory == null) {
          specificCategory = "";
        }
        params = getSearchFilterParams(filterlabel, inputValue, checkFlag);
        var subcategories = getanalyticsPlpCategory();
        plpFilterInteracted(params, checkFlag, specificCategory, subcategories);
      }
    }
  },
  false
);

//analytics code to track clicks on left nav clear refinements filters
document.querySelector("body").addEventListener(
  "click",
  function (e) {
    var selectClearElement = e.target.closest("span");
    if (
      selectClearElement != null &&
      selectClearElement != "" &&
      selectClearElement.className == "ais-CurrentRefinements-category"
    ) {
      var urlString = window.location.href;
      var url = new URL(urlString);
      var params = [];
      var checkFlag = "n";
      specificCategory = url.searchParams.get(algoliaIndex);
      if (specificCategory == null) {
        specificCategory = "";
      }
      params = getSearchFilterParams();
      var subcategories = getanalyticsPlpCategory();
      plpFilterInteracted(params, checkFlag, specificCategory, subcategories);
    }
  },
  false
);

//analytics code to get left navigation filter params
function getSearchFilterParams(filterlabel, inputValue, checkFlag, sliderVal) {
  var urlString = window.location.href;
  var url = new URL(urlString);
  var filterparams = [];
  var isKeyFlag = false;
  if (
    typeof filterlabel !== "undefined" &&
    typeof inputValue !== "undefined" &&
    filterlabel !== null &&
    inputValue !== null
  ) {
    if (checkFlag === "y") {
      filterparams[filterlabel] = inputValue;
    }
  }
  url.searchParams.forEach(function (value, key) {
    if (!key.includes("hierarchicalCategories")) {
      if (key.indexOf("startingPrice") !== -1) {
        key = "Price";
        if (sliderVal === "" || typeof sliderVal === "undefined") {
          isKeyFlag = true;
        } else {
          isKeyFlag = false;
        }
      } else {
        var matches = key.match(/\[[^\]]*\]\[(.*?)\]/);
        if (matches) {
          key = matches[1];
          isKeyFlag = true;
        }
      }
    }
    if (isKeyFlag === true) {
      if (filterparams[key] !== undefined) {
        if (!Array.isArray(filterparams[key])) {
          filterparams[key] = [filterparams[key]];
        }
        filterparams[key].push(value);
      } else {
        filterparams[key] = value;
      }
    }
  });
  return filterparams;
}

//analytics code for slider tracking
document.querySelector("body").addEventListener(
  "mouseup",
  function (e) {
    var myElement = e.target.closest("div");
    if (
      myElement != null &&
      myElement != "" &&
      (myElement.className == "rheostat-handle rheostat-handle-lower" ||
        myElement.className == "rheostat-handle rheostat-handle-upper")
    ) {
      var sliderVal =
        e.target.parentElement
          .querySelector(".rheostat-handle-lower")
          .textContent.trim() +
        ":" +
        e.target.parentElement
          .querySelector(".rheostat-handle-upper")
          .textContent.trim();
      var urlString = window.location.href;
      var url = new URL(urlString);
      var inputValue = "";
      var filterlabel = "";
      var checkFlag = "";
      var params = [];
      var divElement = e.target.closest(".analyticsplpfilter");
      var filterlabel = divElement.querySelector(".accordion-head").textContent
        ? divElement.querySelector(".accordion-head").textContent.trim()
        : "";
      specificCategory = url.searchParams.get(algoliaIndex);
      if (specificCategory == null) {
        specificCategory = "";
      }
      if (sliderVal != null && sliderVal != "") {
        inputValue = sliderVal;
        checkFlag = "y";
      }
      params = getSearchFilterParams(
        filterlabel,
        inputValue,
        checkFlag,
        sliderVal
      );
      var subcategories = getanalyticsPlpCategory();
      plpFilterInteracted(params, checkFlag, specificCategory, subcategories);
    }
  },
  false
);

function getanalyticsPlpCategory() {
  var subcatlvl1Label = $(".ais-CurrentRefinements-label:eq(1)").text();
  var subcatlvl2Label = $(".ais-CurrentRefinements-label:eq(2)").text();
  var subcatlvl1Name = "";
  let subcatlvl2Name = "";
  if (subcatlvl1Label.indexOf("HierarchicalCategories.lvl1") != -1) {
    subcatlvl1Cat = $(".ais-CurrentRefinements-categoryLabel:eq(1)")
      .text()
      .trim();
    subcatlvl1Name = subcatlvl1Cat.split(">")[1]
      ? subcatlvl1Cat.split(">")[1].trim()
      : "";
  }
  if (subcatlvl2Label.indexOf("HierarchicalCategories.lvl2") != -1) {
    subcatlvl2Cat = $(".ais-CurrentRefinements-categoryLabel:eq(2)")
      .text()
      .trim();
    subcatlvl2Name = subcatlvl2Cat.split(">")[2]
      ? subcatlvl2Cat.split(">")[2].trim()
      : "";
  }
  return subcatlvl1Name + "@@" + subcatlvl2Name;
}

//analytic code for compare product checkbox select & unselect
document.querySelector("body").addEventListener(
  "change",
  function (e) {
    var checkboxelement = e.target.closest("input");
    var label;
    let prodDetails, prodName, category, prodCategory, prodSKU;
    if (
      checkboxelement != null &&
      checkboxelement.value !== null &&
      checkboxelement.closest(".analyticplpcompareproduct")
    ) {
      prodDetails = checkboxelement.value;
      prodName = prodDetails.split("@@")[0];
      prodCategory = prodDetails.split("@@")[1];
      prodSKU = prodDetails.split("@@")[2];
      var urlString = window.location.href;
      var url = new URL(urlString);
      var label;
      specificCategory = url.searchParams.get(algoliaIndex);
      if (specificCategory == null) {
        specificCategory = "";
      }
      if (checkboxelement.checked) {
        label = "product selected/" + prodName + "/" + prodCategory;
        category = prodSKU + " - plp";
        ctalinkDataLayerCall(label, category, specificCategory);
      } else {
        label = "product unselected/" + prodName + "/" + prodCategory;
        category = prodSKU + " - plp";
        ctalinkDataLayerCall(label, category, specificCategory);
      }
    }
    //analytic code for Edit parameters checkbox select & unselect
    else if (
      checkboxelement !== null &&
      checkboxelement.value !== null &&
      checkboxelement.closest(".analyticplpcustomcolumndisplay")
    ) {
      var parameterName = checkboxelement.nextSibling.textContent.trim();
      var pageLabel = window.location.href
        .split("?")[0]
        .split("/")
        .pop()
        .replace(".html", "");
      var urlString = window.location.href;
      var url = new URL(urlString);
      let category;
      specificCategory = url.searchParams.get(algoliaIndex);
      if (specificCategory == null) {
        specificCategory = "";
      }
      if (checkboxelement.checked) {
        label = "parameter selected/" + parameterName + "/" + pageLabel;
      } else {
        label = "parameter unselected/" + parameterName + "/" + pageLabel;
      }
      category = "Product Table - Edit Parameters - " + pageLabel;
      ctalinkDataLayerCall(label, category, specificCategory);
    }
  },
  false
);
