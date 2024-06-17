(function () {
  const apiEndPoint = $.fn.getAPIEndpoint();
  //searchBanner()
  var $searchBanner = $(".search__banner"),
    $searchInputButton = $searchBanner.find(".search__input--button"),
    $searchInput = $searchBanner.find(".ie-search-input"),
    categoryName = $searchBanner.attr("data-category-name") || "";

  $searchInputButton.on("click", function () {
    var getInputValue = $searchInput.val();
    searchBanner(getInputValue, categoryName);
  });
  $searchInput.on("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      $searchInputButton.click();
    }
  });

  /**
   * searchBanner()
   */
  function searchBanner(getInputValue, categoryName) {
    const searchClient = window.algoliasearch(algId, algApi);

    const INSTANT_SEARCH_INDEX_NAME = indexContent;

    const index = searchClient.initIndex(INSTANT_SEARCH_INDEX_NAME);
    index
      .search(getInputValue, { facetFilters: ["category:" + categoryName] })
      .then(({ hits }) => {
        if (hits && hits.length) {
          $(document).trigger(apiEndPoint.customEvent.BLOG_ALGOLIA_FETCH, [
            hits
          ]);
        }
      });
  }
})();
