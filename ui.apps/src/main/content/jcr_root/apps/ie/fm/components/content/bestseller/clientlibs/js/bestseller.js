const { algoliasearch, instantsearch } = window;

const searchClient = algoliasearch(algId, algApi);
let indexForFilter = indexBs;

const search = instantsearch({
  indexName: indexBs,
  searchClient,
  routing: true
});
let client = algoliasearch(algId, algApi);
let index = client.initIndex(indexInuse);

function bsalgoliasearch(utilityMessage) {
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
  //Dynamic filter function start

  search.on("render", () => {
    if (search.status === "idle") {
      const response = search?.renderState[indexForFilter]?.hits;
      const filterValue =
        search?.renderState[indexForFilter]?.hits.results._state
          .disjunctiveFacetsRefinements["hierarchicalCategories.lvl0"][0];
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
      $(".table-view-button").on("click", function () {
        $algoliaWidget.editParameters();
      });
      let table_view = document.querySelector(".table-view-button");
      if ($(table_view).hasClass("active")) {
        $algoliaWidget.editParameters();
      }
      //run the function to append price inventory from CT
      $algoliaWidget.ctPriceInventoryPlp(utilityMessage);
    }
  });
  //Dynamic filter function End
  search.addWidgets([
    $algoliaWidget.categoriesList(),
    $algoliaWidget.priceRangeSlider(),
    $algoliaWidget.priceRangeInput(),
    $algoliaWidget.clearRefinements(utilityMessage),
    $algoliaWidget.clearRefinementsMobile(utilityMessage),
    $algoliaWidget.statsTop(utilityMessage),
    $algoliaWidget.statsMobile(utilityMessage),
    $algoliaWidget.statsBottom(utilityMessage),
    $algoliaWidget.hitPerPageTop(),
    $algoliaWidget.hitPerPageBottom(),
    $algoliaWidget.hitPerPageMobile(),
    $algoliaWidget.mainHits(utilityMessage),
    $algoliaWidget.sortWidgetBestseller(utilityMessage),
    $algoliaWidget.hitsPerPageBestSeller(),
    $algoliaWidget.priceCurrentRefinement()
  ]);

  search.on("render", $algoliaWidget.RenderHandler);

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
  if ($("#bestseller-data").length > 0) {
    //setTimeout(() => {
    //bsalgoliasearch();
    //}, 1000);
    window.getUTILITYModule
      .getUtility()
      .done(function (data) {
        bsalgoliasearch(data[0]);
      })
      .fail(function (error) {});
    $(".accordion-head").click(function () {
      $(this).toggleClass("open").next().toggle(300);
    });

    $("#main-footer").closest(".experiencefragment").addClass("footer");
  }
});
document.querySelector("body").addEventListener(
  "change",
  function (e) {
    var inputValue = "";
    let selectElement = e.target.closest(".analyticsplpfilter");
    if (selectElement != null && selectElement != "") {
      let filterlabel = selectElement
        .querySelector(".accordion-head")
        .textContent.trim();
      let inputElement = e.target.closest("input");
      if (inputElement != null && inputElement != "" && selectElement != null) {
        if (inputElement.nextElementSibling != null) {
          inputValue = inputElement.nextElementSibling.textContent.trim();
        }
        let checkFlag = "n";
        if (inputElement.checked === true) {
          checkFlag = "y";
        }
        let urlString = window.location.href;
        let url = new URL(urlString);
        let params = [];
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
  subcatlvl2Name = "";
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
    let selectClearElement = e.target.closest("span");
    if (
      selectClearElement != null &&
      selectClearElement != "" &&
      selectClearElement.className == "ais-CurrentRefinements-category"
    ) {
      let urlString = window.location.href;
      let url = new URL(urlString);
      let params = [];
      let checkFlag = "n";
      specificCategory = url.searchParams.get(algoliaIndex);
      if (specificCategory == null) {
        specificCategory = "";
      }
      params = getSearchFilterParams();
      let subcategories = getanalyticsPlpCategory();
      plpFilterInteracted(params, checkFlag, specificCategory, subcategories);
    }
  },
  false
);
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
//analytic code to track CTA links on bestsellers page
document.querySelector("body").addEventListener(
  "click",
  function (e) {
    var divElement = e.target.closest("div");
    var label = "";
    var category = "";
    if (
      divElement !== null &&
      divElement.textContent !== null &&
      divElement.closest(".analyticbestsellers") != null
    ) {
      label = divElement.textContent.trim();
      var urlString = window.location.href;
      var url = new URL(urlString);
      specificCategory = url.searchParams.get(algoliaIndex);
      if (specificCategory == null) {
        specificCategory = "";
      }
      category = "Product List-" + currentPageName;
    } else {
      return true;
    }
    ctalinkDataLayerCall(label, category, specificCategory);
    return false;
  },
  false
);

//analytic code to track CTA link on no of pages and sort by option click
document.querySelector("body").addEventListener(
  "change",
  function (e) {
    let selectElement = e.target.closest("select");
    let checkboxelement = e.target.closest("input");
    let label = "";
    let category = "";
    if (
      selectElement !== null &&
      selectElement.value !== null &&
      selectElement.closest(".analyticbestsellerslimiter") != null
    ) {
      label = selectElement.value.trim();
      let urlString = window.location.href;
      let url = new URL(urlString);
      specificCategory = url.searchParams.get(algoliaIndex);
      if (specificCategory == null) {
        specificCategory = "";
      }
      if (
        selectElement.parentNode.parentNode.className == "hits-per-page-bottom"
      ) {
        label = "Product Select Filter-down-" + label;
      } else {
        label = "Product Select Filter-up-" + label;
      }
      category = "Best Seller Product List";
      ctalinkDataLayerCall(label, category, specificCategory);
      return false;
    } else if (
      selectElement !== null &&
      selectElement.value !== null &&
      selectElement.closest(".analyticbestsellerssortby") != null
    ) {
      label = selectElement.options[selectElement.selectedIndex].text.trim();
      let urlString = window.location.href;
      let url = new URL(urlString);
      specificCategory = url.searchParams.get(algoliaIndex);
      if (specificCategory == null) {
        specificCategory = "";
      }
      plpsortDataLayerCall(label, specificCategory);
      return false;
    } else if (
      checkboxelement !== null &&
      checkboxelement.value !== null &&
      checkboxelement.closest(".analyticbestsellerseditparameters")
    ) {
      let parameterName = checkboxelement.nextSibling.textContent.trim();
      let pageLabel = window.location.href
        .split("?")[0]
        .split("/")
        .pop()
        .replace(".html", "");
      let urlString = window.location.href;
      let url = new URL(urlString);
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
      return false;
    } else {
      return true;
    }
  },
  false
);

//analytic code to track CTA for LearnMore clicks on bestsellers page
document.querySelector("body").addEventListener(
  "click",
  function (e) {
    var anchor = e.target.closest("a");
    if (
      anchor !== null &&
      anchor !== undefined &&
      anchor.closest(".analyticbestsellerslearnmore") != null
    ) {
      label = anchor.textContent.trim();
      hrefVal = anchor.href;
      skuVal = hrefVal.split("#");
      category = "out of stock - " + skuVal[1] + " - bestsellers page";
      var urlString = window.location.href;
      var url = new URL(urlString);

      specificCategory = url.searchParams.get(algoliaIndex);
      if (specificCategory == null) {
        specificCategory = "";
      }
      ctalinkDataLayerCall(label, category, specificCategory);
      return false;
    } else {
      return true;
    }
  },
  false
);
//code to track analytic data for pagination
document.querySelector("body").addEventListener(
  "click",
  function (e) {
    var anchor = e.target.closest("a");
    var flag = "true";
    if (anchor !== null && anchor.hasChildNodes()) {
      flag = "true";
    } else {
      flag = "false";
    }
    if (flag === "true") {
      var anchorchild = anchor.childNodes;
      var iElement = "";
      for (var i = 0; i < anchorchild.length; i++) {
        if (
          anchorchild[i].className != "undefined" &&
          anchorchild[i].className != null
        ) {
          if (
            anchorchild[i].className.search("analytictracktop") != "-1" ||
            anchorchild[i].className.search("analytictrackbottom") != "-1"
          ) {
            iElement = anchorchild[i];
          }
          if (anchorchild[i].className.search("ais-Pagination-link") != "-1") {
            iElement = anchorchild[i].childNodes[0];
          }
        }
      }
      //var iElement = e.target.closest('i');
      var label = "";
      var category = "";
      var currentPage = "";
      var specificCategory = "";

      if (
        iElement !== null &&
        iElement.className !== null &&
        iElement !== "undefined"
      ) {
        //four scenairo up-next, up-back, down-next, down-back to capture
        iClassName = iElement.className;
        var urlString = window.location.href;
        var url = new URL(urlString);
        const urlParamsbestsellers = new URLSearchParams(location.search);
        urlparamkeybestsellers = "";
        for (const key of urlParamsbestsellers.keys()) {
          urlparamkeybestsellers = key.split("[")[0];
        }
        const algoliaIndexbestsellers =
          urlparamkeybestsellers +
          "[refinementList][hierarchicalCategories.lvl0][0]";
        const algoliaIndexPageNobestsellers = urlparamkeybestsellers + "[page]";
        var pageNo = url.searchParams.get(algoliaIndexPageNobestsellers);
        if (pageNo == null) {
          pageNo = 1;
        }
        specificCategory = url.searchParams.get(algoliaIndexbestsellers);
        if (specificCategory == null) {
          specificCategory = "";
        }

        if (
          iClassName !== null &&
          iClassName !== undefined &&
          iClassName.search("analytictracktop") != "-1"
        ) {
          //top
          if (iClassName.search("angle-left") != "-1") {
            //left arrow
            label = "Pagination Link-top-Previous";
            currentPage = --pageNo;
          } else {
            //right arrorw
            label = "Pagination Link-top-Next";
            currentPage = ++pageNo;
          }
        } else if (
          iClassName !== null &&
          iClassName !== undefined &&
          iClassName.search("analytictrackbottom") != "-1"
        ) {
          //bottom
          if (iClassName.search("angle-left") != "-1") {
            //lef arrow
            label = "Pagination Link-bottom-Previous";
            currentPage = --pageNo;
          } else {
            //right arrorw
            label = "Pagination Link-bottom-Next";
            currentPage = ++pageNo;
          }
        }
        category = "bestsellers";
        //alert("label="+label+" currentPage="+currentPage+" category="+category+" specificCategory="+specificCategory);
        paginationdataLayerCall(label, category, currentPage, specificCategory);
        return false;
      } else {
        return true;
      }
    }
  },
  false
);
