function bannerSearchInput() {
  const searchClient = algoliasearch(algId, algApi);
  const { history } = instantsearch.routers;

  //creating search results
  const INSTANT_SEARCH_INDEX_NAME = indexContent;
  const instantSearchRouter = instantsearch.routers.history();

  const search = instantsearch({
    searchClient,
    indexName: INSTANT_SEARCH_INDEX_NAME,
    routing: instantSearchRouter
  });

  const { connectSearchBox } = instantsearch.connectors;

  const virtualSearchBox = connectSearchBox(() => {});

  // Set the InstantSearch index UI state from external events.
  function setInstantSearchUiState(indexUiState) {
    search.setUiState((uiState) => ({
      ...uiState,
      [INSTANT_SEARCH_INDEX_NAME]: {
        ...uiState[INSTANT_SEARCH_INDEX_NAME],
        // We reset the page when the search state changes.
        page: 1,
        ...indexUiState
      }
    }));
  }
  search.start();

  // Return the InstantSearch index UI state.
  function getInstantSearchUiState() {
    const uiState = instantSearchRouter.read();

    return (uiState && uiState[INSTANT_SEARCH_INDEX_NAME]) || {};
  }

  const searchPageState = getInstantSearchUiState();

  let skipInstantSearchUiStateUpdate = false;

  const { autocomplete, getAlgoliaResults } =
    window["@algolia/autocomplete-js"];

  //content index
  const contentPlugin = {
    getSources({ query }) {
      if (query.length < 3) {
        return [];
      }

      return [
        {
          sourceId: "contentPlugin",
          getItems() {
            return getAlgoliaResults({
              searchClient,
              queries: [
                {
                  indexName: indexContent,
                  query,
                  params: {
                    hitsPerPage: 3
                  }
                }
              ]
            });
          },
          getItemUrl({ item }) {
            return `${item.url}`;
             },
          templates: {
            header({ items, html }) {
              if (items.length === 0) {
                return null;
              }

              return html`<span class="aa-SourceHeaderTitle">Content</span>
                <div class="aa-SourceHeaderLine" />`;
            },
            item({ item, components, html }) {
              return html`<a
                class="aa-ItemLink analytic-internal-search-content"
                href="${item.url}"
              >
                <div class="aa-ItemContent">
                  <div class="aa-ItemContentBody">
                    <div class="aa-ItemContentTitle"></div>
                    <div class="aa-ItemContentDescription">
                      ${components.Snippet({
                        hit: item,
                        attribute: "title"
                      })}
                    </div>
                  </div>
                  <div class="aa-ItemActions"></div></div
              ></a>`;
            }
            // noResults() {
            //         return 'No matching items.';
            //       },
          }
        }
      ];
    }
  };

  const { setQuery } = autocomplete({
    container: "#autocomplete-search",
    placeholder: "Search",
    openOnFocus: true,
    plugins: [contentPlugin],
    detachedMediaQuery: "none",
    initialState: {
      query: searchPageState.query || ""
    },

    onSubmit({ state }) {

      //window.location.href = `/content/fm/en/faq/faq-search-result.html?${indexContent}%5Bquery%5D=${
      //  state.query ? `${state.query}` : "No result"
      // }&facetFilters=category:faq`;

      var getInputValue =
        $(
          ".search-relative .banner-search-input .aa-Autocomplete form input"
        ).val() || "";
      searchBanner(getInputValue, categoryName);
      if($("#tech-resources").length || $("#resources-results").length){
        window.location.href = `/content/fm/en/tools-resources/technical-resource-results.html?${indexContent}%5Bquery%5D=${
        state.query ? `${state.query}` : "No result"
       }&facetFilters=[["category:techresource"],["sectionCategory:brochures","sectionCategory:techarticles","sectionCategory:whitepapers"]]`;
      }
    },

    onReset() {
      //setInstantSearchUiState({ query: "" });
    },

    onStateChange({ prevState, state }) {
      if (!skipInstantSearchUiStateUpdate && prevState.query !== state.query) {
        setInstantSearchUiState({ query: state.query });
      }
      skipInstantSearchUiStateUpdate = false;
    },
    onStateChange({ state }) {
      // On search field update
      theTextQuery = state.query; // update the theTextQuery variable
    }
  });

  window.addEventListener("popstate", () => {
    skipInstantSearchUiStateUpdate = true;
    setQuery(search.helper?.state.query || "");
  });
}

var $searchBanner = $(".search__banner"),
  categoryName = $searchBanner.attr("data-category-name") || "";

bannerSearchInput();

function searchBanner(getInputValue, categoryName) {
  const searchClient = window.algoliasearch(algId, algApi);

  const INSTANT_SEARCH_INDEX_NAME = indexContent;
  let singleResult, multiResult, blogNoResult;
 
        singleResult = utilityMessage?.labels.singleResult;
        multiResult = utilityMessage?.labels.multiResult;
        blogNoResult = utilityMessage?.labels.blogNoResult;
      
  const index = searchClient.initIndex(INSTANT_SEARCH_INDEX_NAME);
  let facetFilterTerm = { facetFilters: ["category:" + categoryName]};
  if($("#tech-resources").length || $("#resources-results").length){
    facetFilterTerm = {"facetFilters": [
      [
       "category:techresource"
      ],
      [
       "sectionCategory:brochures",
       "sectionCategory:techarticles",
       "sectionCategory:whitepapers"
      ]
     ]};
  }
  index
    .search(getInputValue, facetFilterTerm)
    .then(({ hits }) => {
      if (hits.length === 1) {
        $("#result-query-blog").empty();
        $(".blog-filters-wrapper").removeClass("d-none");
        $("#blogList_wrapper").removeClass("d-none");
        $("#result-query-blog").append(
          `${hits.length} ${singleResult}  "${getInputValue}"`
        );
      } else if (hits.length > 1) {
        $("#result-query-blog").empty();
        $(".blog-filters-wrapper").removeClass("d-none");
        $("#blogList_wrapper").removeClass("d-none");
        $("#result-query-blog").append(
          `${hits.length} ${multiResult}  "${getInputValue}"`
        );
      } else {
        $("#result-query-blog").empty();
        $("#result-query-blog").append(blogNoResult);
        $(".blog-filters-wrapper").addClass("d-none");
        $("#blogList_wrapper").addClass("d-none");
      }
      $(document).trigger(
        $.fn.getAPIEndpoint().customEvent.BLOG_ALGOLIA_FETCH,
        [hits]
      );
    });
}

$("#autocomplete-search").on("click", function (e) {
  $(this).addClass("active-search");
  e.stopPropagation();
});
$(document).click(function (e) {
  if (!$(e.target).hasClass("autocomp")) {
    $("#autocomplete-search").removeClass("active-search");
  }
});
