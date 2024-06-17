const { algoliasearch, instantsearch } = window;

const searchClient = algoliasearch(algId, algApi);
let indexForFilter = indexInuse;
const search = instantsearch({
  indexName: indexInuse,
  searchClient,
  routing: true
});
let client = algoliasearch(algId, algApi);
let index = client.initIndex(indexInuse);
function aemalgoliasearch(utilityMessage) {
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
      const response = search?.renderState[indexForFilter]?.hits;
      window.getAPIModule
        .getCategoriesJson()
        .done(function (data) {
          getCategoriesData(data, response);
        })
        .fail(function (error) {
          console.log(error);
        });
      $algoliaWidget.facetDisplay();
      $(".table-view-button").on("click", function () {
        $algoliaWidget.editParameters();
      });
      let table_view = document.querySelector(".table-view-button");
      if ($(table_view).hasClass("active")) {
        $algoliaWidget.editParameters();
      }
    }
    $algoliaWidget.RenderHandler();
  });

  /**
   * getCategoriesData() Get Category Data
   * @param {Object} data Categories Response
   * @param {Object} response algolia Response
   */
  function getCategoriesData(categoryData, response) {
    let categoryObject = commonUtility().categoryMatch(categoryData);
    //let categoryFacetValue = "Adapters";
    $("#brand-list .ais-RefinementList-checkbox").on("click", function (event) {
      categoryFacetValue = $(event.currentTarget).attr("value");
      isPageLoad = false;
      if (commonUtility().isCategoryInURL()) {
        commonUtility().categoryFacetSeoUrl(
          categoryFacetValue,
          response,
          false,
          categoryData
        );
      } else if ($(".new__releases").length) {
        setTimeout(function () {
          location.href = location.href;
        }, 500);
      }
    });
    if ($(".new__releases").length) {
      const filterValue =
        response.results._state.disjunctiveFacetsRefinements[
          "hierarchicalCategories.lvl0"
        ][0];
      if (filterValue) {
        $algoliaWidget.searchFilter(filterValue, response);
      }
    }

    //Sub category;
    $("#lvl1-cat .ais-RefinementList-checkbox").on("click", function (event) {
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

  $algolia.algoliaUserToken();
  search.start();
  $algolia.recentViewData();
}
$(document).ready(function () {
  if ($("#algolia-data, #newreleases-data").length > 0) {
    // Call the UtiLITY Message First
    window.getUTILITYModule
      .getUtility()
      .done(function (data) {
        aemalgoliasearch(data[0]);
      })
      .fail(function (error) {});

    $(".accordion-head").click(function () {
      $(this).toggleClass("open").next().toggle(300);
    });

    $("#main-footer").closest(".experiencefragment").addClass("footer");
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
  prodcat.length > 0 ? (pdcat = prodcat.replaceAll(",", "/")) : (pdcat = "");

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

//analytic code for compare product checkbox select & unselect
document.querySelector("body").addEventListener(
  "change",
  function (e) {
    let checkboxelement = e.target.closest("input");
    let category,
      specificCategory,
      prodDetails,
      prodName,
      prodCategory,
      prodSKU;
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

$(document).ready(function () {
  //breadcrumb for tierI, tierII

  function breadcrumbPlpCSR(data) {
    let breadcrumbLvl0,
      breadcrumbLvl1,
      breadcrumbLvl2,
      splitBreadcrumb,
      name0,
      name1,
      name2,
      linkLvl0,
      linkLvl1,
      linkLvl2;
    //Getting value from URL
    let origin = window.origin;
    let tierUrl = window.location.href.split(".html")[0];
    let tierCategoryUrl = tierUrl.split("/category/")[1];
    if (tierCategoryUrl != undefined) {
      splitBreadcrumb = tierCategoryUrl.split("/");
      if (splitBreadcrumb[0] != undefined) {
        breadcrumbLvl0 = splitBreadcrumb[0].trim();
      }
      if (splitBreadcrumb[1] != undefined) {
        breadcrumbLvl1 = splitBreadcrumb[1].trim();
      }
      if (splitBreadcrumb[2] != undefined) {
        breadcrumbLvl2 = splitBreadcrumb[2].trim();
      }
    }
    //Matching value from categories json
    $.each(data, (index, item) => {
      if (breadcrumbLvl0 == item.category.seoName) {
        name0 = item.category.name;
        let lvl1Arr = item.category.childCategories;
        if (lvl1Arr != null && lvl1Arr != undefined) {
          lvl1Arr.forEach((item) => {
            if (breadcrumbLvl1 == item.seoName) {
              name1 = item.name;
              let lvl2Arr = item.childCategories;
              if (lvl2Arr != null && lvl2Arr != undefined) {
                lvl2Arr.forEach((item) => {
                  if (breadcrumbLvl2 == item.seoName) {
                    name2 = item.name;
                  } else {
                  }
                });
              } else {
              }
            }
          });
        } else {
        }
      } else {
      }
    });

    //Creating breadcrumb
    if (splitBreadcrumb != undefined) {
      linkLvl0 = `${origin}/category/${splitBreadcrumb[0]}.html`;
      linkLvl1 = `${origin}/category/${splitBreadcrumb[0]}/${splitBreadcrumb[1]}.html`;
      linkLvl2 = `${origin}/category/${splitBreadcrumb[0]}/${splitBreadcrumb[1]}/${splitBreadcrumb[2]}.html`;
      $(".category4").empty();
      if (splitBreadcrumb.length == 3) {
        if (name0 !== undefined && name1 !== undefined && name2 !== undefined) {
          $(".category4").append(
            ` <a href="${linkLvl0}">${name0}</a> <i class="fa fa-angle-right" aria-hidden="true"></i> <a href="${linkLvl1}">${name1}</a> <i class="fa fa-angle-right" aria-hidden="true"></i> <strong>${name2}</strong>`
          );
        }
      } else if (splitBreadcrumb.length == 2) {
        if (name0 !== undefined && name1 !== undefined) {
          $(".category4").append(
            ` <a href="${linkLvl0}">${name0}</a> <i class="fa fa-angle-right" aria-hidden="true"></i> <strong>${name1}</strong>`
          );
        }
      } else if (splitBreadcrumb.length == 1) {
        if (name0 !== undefined) {
          $(".category4").append(` <strong>${name0}</strong>`);
        }
      } else {
        console.log("No category Breadcrumb");
      }
      if (splitBreadcrumb.length < 1) {
        $(".edit-param").addClass("d-none");
      } else {
        $(".edit-param").removeClass("d-none");
        $("element").prop("checked", true);
      }
    }
  }
  //Reading Categories json
  window.getAPIModule
    .getCategoriesJson()
    .done(function (data) {
      breadcrumbPlpCSR(data);
    })
    .fail(function (error) {});
});
