const searchClient = algoliasearch(algId, algApi);
const INSTANT_SEARCH_INDEX_NAME = indexInuse;
const instantSearchRouter = instantsearch.routers.history();
let indexForFilter = indexInuse;

const search = instantsearch({
  searchClient,
  indexName: INSTANT_SEARCH_INDEX_NAME,
  routing: instantSearchRouter
  //routing: false,
});
let client = algoliasearch(algId, algApi);
let index = client.initIndex(indexInuse);
const queryString = window.location.search;
const urlParamsSearch = new URLSearchParams(queryString);
const fullurlParams = indexInuse + "[query]";
const queryString_categ = urlParamsSearch.get(fullurlParams);
let puretitle = decodeURIComponent(queryString_categ);
function searchresultsalgolia(utilityMessage) {
  if (puretitle !== "null") {
    $("#search-title").text('"' + puretitle + '"');
  }

  const { history } = instantsearch.routers;
  //creating search results

  const { connectSearchBox } = instantsearch.connectors;

  const virtualSearchBox = connectSearchBox(() => {});

  const { connectPagination } = instantsearch.connectors;
  const customPagination = connectPagination($algoliaWidget.renderPagination);
  const customPagination2 = connectPagination($algoliaWidget.renderPagination2);
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
  const renderStats = (renderOptions, isFirstRender) => {
    const { nbHits } = renderOptions;

    document.querySelector(".stats-content-title").innerHTML = `${nbHits}`;
  };
  const renderHits = connectPagination(renderStats);
  search.addWidgets([
    instantsearch.widgets.index({ indexName: indexContent }).addWidgets([
      renderHits({
        container: document.querySelector(".stats-content-title")
      }),
      instantsearch.widgets.configure({
        filters: ""
      })
    ])
  ]);
  //Dynamic filter start
  //search.on("render", $algoliaWidget.searchFilter);
  //Dynamic filter end
  search.addWidgets([
    virtualSearchBox({}),

    $algoliaWidget.categoriesList(),
    $algoliaWidget.priceRangeSlider(),
    $algoliaWidget.priceRangeInput(),
    $algoliaWidget.clearRefinements(utilityMessage),
    $algoliaWidget.clearRefinementsMobile(utilityMessage),
    $algoliaWidget.sortWidget(utilityMessage),
    $algoliaWidget.hitsPerPage(utilityMessage),
    $algoliaWidget.statsSearchTop(utilityMessage),
    $algoliaWidget.statsMobile(utilityMessage),
    $algoliaWidget.statsSearchBottom(utilityMessage),
    $algoliaWidget.statsTitle(utilityMessage),
    $algoliaWidget.hitPerPageTop(),
    $algoliaWidget.hitPerPageBottom(),
    $algoliaWidget.hitPerPageMobile(),
    $algoliaWidget.mainHits(utilityMessage),
    $algoliaWidget.isSearchable(),
    $algoliaWidget.priceCurrentRefinement()
  ]);

  search.on("render", (e) => {
    if (search.status === "idle") {
      const response = search?.renderState[indexForFilter]?.hits;
      const responseContent =
        search?.renderState[indexContent]?.pagination?.nbHits;

      $algoliaWidget.RenderHandler(response);
      $(".table-view-button").on("click", function () {
        $algoliaWidget.editParameters();
      });
      let table_view = document.querySelector(".table-view-button");
      if ($(table_view).hasClass("active")) {
        $algoliaWidget.editParameters();
      }
      $algolia.readMorePDP();
      $algolia.checkNoResult(response, responseContent);
      $algolia.openTab();

      const filterValue =
        search?.renderState[indexForFilter]?.hits.results._state
          .disjunctiveFacetsRefinements["hierarchicalCategories.lvl0"][0];
      let isFacetValue, categoryFacetValue;
      isFacetValue = filterValue ? true : false;
      $("#brand-list .ais-RefinementList-checkbox").on(
        "click",
        function (event) {
          categoryFacetValue = $(event.currentTarget).attr("value");
          setTimeout(function () {
            location.reload();
          }, 500);
        }
      );
      if (filterValue) {
        $algoliaWidget.searchFilter(filterValue, response);
      }
      $algoliaWidget.facetDisplay();
      //run the function to append price inventory from CT
      $algoliaWidget.ctPriceInventoryPlp(utilityMessage);
    }
  });

  search.use(
    instantsearch.middlewares.createInsightsMiddleware({
      insightsClient: window.aa,
      insightsInitParams: {
        useCookie: false
      }
    })
  );

  $algolia.algoliaUserToken();

  search.start();

  $algolia.recentViewData();
}
$(document).ready(function () {
  if ($("#search-data").length > 0) {
    //compare sticky
    $algolia.addCompareSticky(".compare-sec", 834);
    window.getUTILITYModule
      .getUtility()
      .done(function (data) {
        searchresultsalgolia(data[0]);
      })
      .fail(function (error) {});
    $(".accordion-head").click(function () {
      $(this).toggleClass("open").next().toggle(300);
    });

    $("#main-footer").closest(".experiencefragment").addClass("footer");

    //reload with search query
    window.onpopstate = function (event) {
      // Check if the search query parameter is present
      if (window.location.search.includes(`${indexInuse}[query]=`)) {
        // Perform the page refresh
        location.reload();
      }
    };
  }
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
        anchor.closest(".analyticcompare") != null)
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
  prodcat.length > 0 ? (pdcat = prodcat.replaceAll(",", "/")) : (pdcat = "");

  var urlString = window.location.href;
  var url = new URL(urlString);
  let specificCategory;

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
        let subcategories = getanalyticsPlpCategory();
        plpFilterInteracted(params, checkFlag, specificCategory, subcategories);
      }
    }
  },
  false
);
function getanalyticsPlpCategory() {
  let subcatlvl1Label = $(".ais-CurrentRefinements-label:eq(1)").text();
  let subcatlvl2Label = $(".ais-CurrentRefinements-label:eq(2)").text();
  let subcatlvl1Name = "";
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
      plpFilterInteracted(params, checkFlag, specificCategory);
    }
  },
  false
);

//analytics code to get left navigation filter params
function getSearchFilterParams(filterlabel, inputValue, checkFlag, sliderVal) {
  let urlString = window.location.href;
  let url = new URL(urlString);
  let filterparams = [];
  let isKeyFlag = false;
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
        let matches = key.match(/\[[^\]]*\]\[(.*?)\]/);
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
    let myElement = e.target.closest("div");
    if (
      myElement != null &&
      myElement != "" &&
      (myElement.className == "rheostat-handle rheostat-handle-lower" ||
        myElement.className == "rheostat-handle rheostat-handle-upper")
    ) {
      let sliderVal =
        e.target.parentElement
          .querySelector(".rheostat-handle-lower")
          .textContent.trim() +
        ":" +
        e.target.parentElement
          .querySelector(".rheostat-handle-upper")
          .textContent.trim();
      let urlString = window.location.href;
      let url = new URL(urlString);
      let inputValue = "";
      let filterlabel = "";
      let checkFlag = "";
      let params = [];
      let divElement = e.target.closest(".analyticsplpfilter");
      let specificCategory;
      filterlabel = divElement.querySelector(".accordion-head").textContent
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
      let subcategories = getanalyticsPlpCategory();
      plpFilterInteracted(params, checkFlag, specificCategory, subcategories);
    }
  },
  false
);

//analytic code for global search page load data layer call
setTimeout(function () {
  let prodresultCount,
    contentesultCount,
    findcommaProd,
    findcomaContent,
    finalprodreslutCount,
    finalcontentreslutCount,
    overallsercount,
    sercat,
    resultcountcat,
    reslultpgagecount,
    prodsku,
    prodname,
    searchterm,
    searchtype;
  if (
    document.getElementsByClassName("no-result-title d-none")[0] != undefined
  ) {
    prodresultCount =
      document.getElementsByClassName("ais-Stats-text")[0].innerHTML;
    contentesultCount = document.getElementsByClassName(
      "stats-content-title"
    )[0].innerHTML;

    findcommaProd = prodresultCount.indexOf(",");
    findcomaContent = contentesultCount.indexOf(",");

    if (findcommaProd != "-1") {
      finalprodreslutCount =
        prodresultCount.substr(0, findcommaProd) +
        prodresultCount.substring(findcommaProd + 1);
    } else {
      finalprodreslutCount = prodresultCount;
    }
    if (findcomaContent != "-1") {
      finalcontentreslutCount =
        contentesultCount.substr(0, findcomaContent) +
        contentesultCount.substring(findcomaContent + 1);
    } else {
      finalcontentreslutCount = contentesultCount;
    }
    overallsercount =
      Number(finalprodreslutCount) + Number(finalcontentreslutCount);

    sercat = "product|content";
    resultcountcat = "P(" + prodresultCount + "),C(" + contentesultCount + ")";
    reslultpgagecount = $(".pagination_gap").text().substr(3, 4);

    prodsku = "";
    prodname = "";
    searchterm = $("#search-title").text().slice(1, -1);
    searchtype = "Clicked";
  } else {
    overallsercount = "0";
    sercat = "product|content";
    resultcountcat = "P(0),C(0)";
    reslultpgagecount = "0";
    prodsku = "";
    prodname = "";
    searchterm = $("#search-title").text().slice(1, -1);
    searchtype = "Clicked";
  }
  globalsearchDataLayer(
    overallsercount,
    sercat,
    resultcountcat,
    reslultpgagecount,
    prodsku,
    prodname,
    searchterm,
    searchtype
  );
}, 6000);
