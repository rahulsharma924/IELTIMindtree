//Algolia call to get facets data for Table view edit parameters function
const { algoliasearch, instantsearch } = window;
const searchClient = algoliasearch(algId, algApi);
let indexForFilter = indexInuse;
let indexSelected;
if ($("#bestsellers").length) {
  indexSelected = indexBs;
} else {
  indexSelected = indexInuse;
}
const search = instantsearch({
  indexName: indexSelected,
  searchClient,
  routing: true
});
let client = algoliasearch(algId, algApi);
let index = client.initIndex(indexSelected);

//function to handle edit params in SSR view
function getSKUFacets(sku) {
  return index
    .getObjects(sku, {
      attributesToRetrieve: ["facets"]
    })
    .catch((error) => {
      // Your error is here!
      console.log(error);
    });
}
function allSkuForFacets() {
  let currentURlId = document.querySelectorAll(".product-grid .orignal-sku");
  let filterTable = [];
  currentURlId.forEach((item) => {
    filterTable.push(item.innerHTML);
  });
  return filterTable;
}
function editParametersSsr() {
  //$("#catfilter-popup").empty();
  let results;
  let filterTable = allSkuForFacets();
  getSKUFacets(filterTable).then(function (response) {
    if (response.results !== null) {
      //let arr = Object.keys(results[0].facets);
      results = response.results;
      let facetsArray = [];
      results.forEach((item) => {
        facetsArray.push(Object.keys(item.facets).toString());
        let idStringMain = item.objectID.replace(/\//g, "-") + "-filt";
        let singleFacets = item.facets;
        let singleFacetsConverted = Object.entries(singleFacets);
      });
      let combinedFacetsArray = facetsArray.toString();
      let allFacets = [...new Set(combinedFacetsArray.split(","))];
      allFacets.forEach((item) => {
        let idString = item.replace(/[^A-Z0-9]+/gi, "_") + "_table";

        $("#plptable-head-ssr").find(`.${idString}`).length
          ? ""
          : $("#plptable-head-ssr").append(
              `<div class="pr-th-dv fixed-td ${idString} d-none"><span>${item}</span></div>`
            );

        $("#catfilter-popup-ssr").find(`#${idString}`).length
          ? ""
          : $("#catfilter-popup-ssr").append(
              `<div class="custom-column-checkbox"><div class="compare-box pos-relat"><input name="changeType" id="${idString}" class="compare-checkbox" value="${item}" type="checkbox" /><label for="${idString}"><span>${item}</span></label></div></div>`
            );
      });
      editParametersPopUpReadSsr();
    } else {
      console.log("No Facets");
    }
  });
}

/* Edit parameter apply button */
function editParametersPopUpReadSsr() {
  let currentURlId = document.querySelectorAll(
    ".pop-filter-flex input[type='checkbox']"
  );
  let selectedCheckValue = [];
  let unselectedCheckValue = [];
  currentURlId.forEach((item) => {
    if (item.checked === true) {
      selectedCheckValue.push(item.value);
    } else {
      unselectedCheckValue.push(item.value);
    }
  });
  let allFacetsPopUP = selectedCheckValue.concat(unselectedCheckValue);
  let results, facetValue;
  let filterTable = allSkuForFacets();
  getSKUFacets(filterTable).then(function (response) {
    if (response.results !== null) {
      filterTable.forEach((item) => {
        let skuClass = item.replace(/\//g, "-") + "-filt";
        allFacetsPopUP.forEach((innerItem) => {
          let idString = innerItem.replace(/[^A-Z0-9]+/gi, "_") + "_table";
          facetValue = "";
          results = response.results;
          results.forEach((mainItem) => {
            if (mainItem.objectID == item) {
              let singleFacets = mainItem.facets;
              let singleFacetsConverted = Object.entries(singleFacets);
              singleFacetsConverted.forEach((singleFacetItem) => {
                if (singleFacetItem[0] == innerItem) {
                  facetValue = singleFacetItem[1];
                }
              });
            }
          });
          $("." + skuClass + "  .plp-viewcol-1").find(`.${idString}`).length
            ? ""
            : $("." + skuClass + "  .plp-viewcol-1").append(
                `<div class="pr-td-dv fixed-td ${idString} d-none">
                  ${
                    facetValue != undefined && facetValue != ""
                      ? facetValue
                      : "NA"
                  }</div>`
              );
        });
      });
    } else {
      console.log("No Facets");
    }
    editParametersPopUpSsr();
  });
}

function editParametersPopUpSsr() {
  let currentURlId = document.querySelectorAll(
    ".pop-filter-flex input[type='checkbox']"
  );
  let selectedCheck = [];
  let unselectedCheck = [];
  currentURlId.forEach((item) => {
    if (item.checked === true) {
      selectedCheck.push(item.id);
    } else {
      unselectedCheck.push(item.id);
    }
  });
  selectedCheck.forEach((item) => {
    $("." + item).removeClass("d-none");
  });
  unselectedCheck.forEach((item) => {
    $("." + item).addClass("d-none");
  });
}

//read all level 1 sub-cat values
function getLevel2Values() {
  let level2Arr = [];
  if ("#lvl1-cat-ssr".length) {
    $("#lvl1-cat-ssr input:checkbox[type=checkbox]").each(function () {
      level2Arr.push($(this).val());
    });
  } else if ("#brand-list-all-ssr".length) {
    $("#brand-list-all-ssr input:checkbox[type=checkbox]").each(function () {
      level2Arr.push($(this).val());
    });
  }

  return level2Arr;
}

function getCategorySlug(categoryData, response) {
  //let categoryObject = commonUtility().categoryMatch(categoryData),
  let categoryFacetValue, isPageLoad;

  $("#brand-list-all-ssr .ais-RefinementList-checkbox").on(
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

  /*  if ($("#bestsellers").length) {
    const filterValue =
      response.results._state.disjunctiveFacetsRefinements[
        "hierarchicalCategories.lvl0"
      ][0];
    if (filterValue) {
      $algoliaWidget.searchFilter(filterValue, response);
    }
  } */

  //Sub category;
  $("#lvl1-cat-ssr .ais-RefinementList-checkbox").on("click", function (event) {
    categoryFacetValue = $(event.currentTarget).attr("value");
    let splitCategory = categoryFacetValue.split(" > ")[1];
    let isSubCategory, isPageLoad;
    isSubCategory = true;
    isPageLoad = false;
    commonUtility().categoryFacetSeoUrl(
      categoryFacetValue,
      response,
      isSubCategory,
      categoryData
    );
  });
}

$(document).ready(function () {
  if ($("#algolia-data-ssr").length > 0) {
    const response = getLevel2Values();
    window.getAPIModule
      .getCategoriesJson()
      .done(function (data) {
        getCategorySlug(data, response);

        if (sessionStorage.getItem("activekey") != null) {
          let setTheBlock = "." + sessionStorage.getItem("activekey");
          $(setTheBlock).trigger("click");
          $(setTheBlock).addClass("active");
        }

        if ($(".plp-view-mode").length > 0) {
          $(".plp-view-mode div").on("click", function () {
            let currentactiveblock = $(this).attr("class").split(" ")[0];
            sessionStorage.setItem("activekey", currentactiveblock);
          });
        }
      })
      .fail(function (error) {
        console.log(error);
      });

    //compare function
    $algoliaWidget.productCompare();
    $algoliaWidget.createObjArr();
    $algolia.addCompareSticky(".compare-sec", 834);

    //view switcher
    let switchSelector = $(".plp-product-list .search-panel");
    function clearView() {
      $(switchSelector).removeClass("tile-view card-view table-view");
      $(".plp-product-list").removeClass("table-view-wrapper");
    }
    $(".tile-view-button").click(function () {
      $(".plp-view-mode > div").removeClass("active");
      $(this).addClass("active");
      clearView();
      $(switchSelector).addClass("tile-view");
    });
    $(".card-view-button").click(function () {
      $(".plp-view-mode > div").removeClass("active");
      $(this).addClass("active");
      clearView();
      $(switchSelector).addClass("card-view");
    });
    $(".table-view-button").click(function () {
      $(".plp-view-mode > div").removeClass("active");
      $(this).addClass("active");
      clearView();
      $(switchSelector).addClass("table-view");
      $(".plp-product-list").addClass("table-view-wrapper");
      //run edit parameter function
      editParametersSsr();
      editParametersPopUpSsr();
    });

    /* end of view switcher */

    $(".accordion-head").click(function () {
      $(this).toggleClass("open").next().toggle(300);
    });

    $("#main-footer").closest(".experiencefragment").addClass("footer");
    //run the function to append price inventory from CT
    $algoliaWidget.ctPriceInventoryPlp(utilityMessage);
  }
});
//end of document ready
