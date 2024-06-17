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
function rvalgoliasearch(utilityMessage) {
  let unique = $algolia.recentViewData();
  if (unique != null) {
    let selectUnique = unique.slice(0, 50);
    let finalArr = "objectID: " + selectUnique.join(" OR objectID:");
    var rvData = finalArr;
  } else {
    var rvData = [];
  }

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
      $(".table-view-button").on("click", function () {
        $algoliaWidget.editParameters();
      });
      let table_view = document.querySelector(".table-view-button");
      if ($(table_view).hasClass("active")) {
        $algoliaWidget.editParameters();
      }
    }
  });
  //Dynamic filter function End
  search.addWidgets([
    $algoliaWidget.categoriesList(),
    $algoliaWidget.priceRangeSlider(),
    $algoliaWidget.priceRangeInput(),
    $algoliaWidget.clearRefinements(utilityMessage),
    $algoliaWidget.clearRefinementsMobile(utilityMessage),
    $algoliaWidget.sortWidget(utilityMessage),
    //hitsPerPage(),
    $algoliaWidget.statsTop(utilityMessage),
    $algoliaWidget.statsMobile(utilityMessage),
    $algoliaWidget.statsBottom(utilityMessage),
    $algoliaWidget.hitPerPageTop(),
    $algoliaWidget.hitPerPageBottom(),
    $algoliaWidget.hitPerPageMobile(),
    $algoliaWidget.mainHits(utilityMessage),
    $algoliaWidget.priceCurrentRefinement(),
    instantsearch.widgets.configure({
      filters: rvData
    })
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
}
$(document).ready(function () {
  if ($("#recentviews-data").length > 0) {
    window.getUTILITYModule
      .getUtility()
      .done(function (data) {
        rvalgoliasearch(data[0]);
      })
      .fail(function (error) {});
    //compare sticky
    $algolia.addCompareSticky(".compare-sec", 834);
    $(".accordion-head").click(function () {
      $(this).toggleClass("open").next().toggle(300);
    });

    $("#main-footer").closest(".experiencefragment").addClass("footer");
  }
});
