function globalSearch() {
  const searchClient = algoliasearch(algId, algApi);
  const { history } = instantsearch.routers;

  //creating search results
  const INSTANT_SEARCH_INDEX_NAME = indexInuse;
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

  //function to split string from last hyphen
  const splitStringFromLastHyphen = (str) => {
    const lastHyphenIndex = str.lastIndexOf("-");
    if (lastHyphenIndex !== -1) {
      const basePart = str.slice(0, lastHyphenIndex)?.toUpperCase();
      const customLength = str.slice(lastHyphenIndex + 1);
      return [basePart, customLength];
    }
    return [str];
  };

  //function to check cm or in in the custom length input
  const endWithCmorIn = (str) => {
    if (str.endsWith("cm") || str.endsWith("in")) {
      return true;
    } else {
      return (window.location.href = `/content/fm/en/search-results.html?${indexInuse}[query]=${state.query}`);
    }
  };

  // Return the InstantSearch index UI state.
  function getInstantSearchUiState() {
    const uiState = instantSearchRouter.read();

    return (uiState && uiState[INSTANT_SEARCH_INDEX_NAME]) || {};
  }

  const searchPageState = getInstantSearchUiState();

  let skipInstantSearchUiStateUpdate = false;

  const { autocomplete, getAlgoliaResults } =
    window["@algolia/autocomplete-js"];

  const { createQuerySuggestionsPlugin } =
    window["@algolia/autocomplete-plugin-query-suggestions"];

  const querySuggestionsPlugin = createQuerySuggestionsPlugin({
    searchClient,
    indexName: indexQuerySuggest,
    getSearchParams({ state }) {
      return { hitsPerPage: state.query ? 3 : 3 };
    },
    transformSource({ source, onTapAhead }) {
      return {
        ...source,
        getItemUrl({ item }) {
          return `/content/fm/en/search-results.html?${indexInuse}[query]=${item.query}`;
        },
        getItems(params) {
          if (params.state.query.length < 3) {
            return [];
          }
          return source.getItems(params);
        },
        templates: {
          ...source.templates,
          item(params) {
            const { item, html } = params;
            return html`<a
              class="aa-ItemLink"
              href="/content/fm/en/search-results.html?${indexInuse}[query]=${item.query}"
            >
              ${source.templates.item(params).props.children}
            </a>`;
          }
        }
      };
    }
  });

  const productsPlugin = {
    getSources({ query }) {
      if (query.length < 3) {
        return [];
      }

      return [
        {
          sourceId: "productsPlugin",
          getItems() {
            return getAlgoliaResults({
              searchClient,
              queries: [
                {
                  indexName: indexInuse,
                  query,
                  params: {
                    filters: "isSearchable:true AND hasCategory:true",
                    hitsPerPage: 3
                  }
                }
              ]
            });
          },
          getItemUrl({ item }) {
            return `${SeoUrl(item)}`;
          },
          getItemInputValue({ item }) {
            return item.title;
          },
          templates: {
            header({ items, html }) {
              if (items.length === 0) {
                return null;
              }

              return html`<span class="aa-SourceHeaderTitle">Products</span>
                <div class="aa-SourceHeaderLine" />`;
            },
            item({ item, components, html }) {
              return html`<a
                class="aa-ItemLink analytcsearch-product"
                href="${SeoUrl(item)}"
              >
                <div class="aa-ItemContent">
                  <div class="aa-ItemIcon">
                    <img
                      src="${getImage(item)}"
                      alt="${item.seoName} ${brandName} ${item.brandSKU}"
                      width="40"
                      height="40"
                    />
                  </div>
                  <div class="aa-ItemContentBody">
                    <div class="aa-ItemContentTitle">
                      ${components.Highlight({
                        hit: item,
                        attribute: "name"
                      })}
                    </div>
                    <div class="aa-ItemContentDescription">
                      ${components.Snippet({
                        hit: item,
                        attribute: "description"
                      })}
                    </div>
                  </div>
                </div>
                <div class="aa-ItemActions">
                  <button
                    class="aa-ItemActionButton aa-DesktopOnly aa-ActiveOnly"
                    type="button"
                    title="Select"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="currentColor"
                    >
                      <path
                        d="M18.984 6.984h2.016v6h-15.188l3.609 3.609-1.406 1.406-6-6 6-6 1.406 1.406-3.609 3.609h13.172v-4.031z"
                      />
                    </svg>
                  </button>
                </div>
              </a>`;
            }
          }
        }
      ];
    }
  };

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
                class="aa-ItemLink analytcsearch-content"
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
  //view all result link
  const viewall = {
    getSources({ query }) {
      if (query.length < 3) {
        return [];
      }
      return [
        {
          sourceId: "viewall",
          getItems() {},
          getItemUrl({ item }) {
            return `/content/fm/en/search-results.html?${indexInuse}[query]=${query}`;
          },
          templates: {
            item({ item, components, html }) {
              return html`<a
                title="View All Results"
                class="search-view-all"
                href="/content/fm/en/search-results.html?${indexInuse}[query]=${query}"
                >View All Results</a
              >`;
            }
          }
        }
      ];
    }
  };
  const { setQuery } = autocomplete({
    container: "#autocomplete",
    placeholder: "Search by keyword or part number",
    openOnFocus: false,
    plugins: [querySuggestionsPlugin, productsPlugin, contentPlugin, viewall],
    detachedMediaQuery: "none",
    initialState: {
      query: searchPageState.query || ""
    },
    onSubmit({ state }) {
      //search page url
      const searchPage = `/content/fm/en/search-results.html?${indexInuse}[query]=${state.query}`;
      const searchResponse = state?.collections[1]?.items;
      if (state.query != searchResponse[0]?.objectID) {
        function customSkuSearch() {
          //split the query string from the last hyphen
          const inputString = state.query ? state.query : "";
          const [basePart, customLength] =
            splitStringFromLastHyphen(inputString);
          const isNumericAlphanumeric = /^\d+(?:cm|in)(?![a-zA-Z0-9])$|^\d+$/;
          const validCustomLength =
            isNumericAlphanumeric.test(customLength) &&
            customLength !== undefined
              ? customLength
              : "";

          //split customLength to get value and UOM(cm)
          const splitStringAtCM = (customLength) => {
            const uomCm = "cm";
            const uomIn = "in";
            const isUomCm =
              validCustomLength.endsWith("cm") && customLength !== undefined
                ? uomCm
                : "IN";
            const isUomIn =
              validCustomLength.endsWith("in") && customLength !== undefined
                ? uomIn
                : "IN";
            const indexOfCM = isUomCm ? uomCm : "";
            const beforeCmValue =
              isUomCm == "cm"
                ? validCustomLength.substring(0, validCustomLength.length - 2)
                : validCustomLength;
            const afterCmUom =
              isUomCm == "cm"
                ? validCustomLength
                    .substring(validCustomLength.length - 2)
                    .toUpperCase()
                : "IN";

            if (isNumericAlphanumeric.test(customLength) && indexOfCM !== -1) {
              return { beforeCmValue, afterCmUom };
            } else {
              return validCustomLength;
            }
          };

          const lengthValue = splitStringAtCM(validCustomLength);

          //do a algolia query to check SKU response
          const { algoliasearch } = window;
          let client = algoliasearch(algId, algApi);
          let index = client.initIndex(indexInuse);
          if (basePart !== null) {
            async function getObjectByID(objectID) {
              try {
                const results = await index.getObjects([objectID], {
                  attributesToRetrieve: [
                    "isMasterCA",
                    "isCustomLengthAllowed",
                    "hierarchicalCategories",
                    "seoName",
                    "categorySEOURL"
                  ]
                });
                if (
                  results?.results[0] != null &&
                  validCustomLength.length != 0
                ) {
                  const pdpUrl = SeoUrl(results?.results[0]);
                  //check isCustomLengthAllowed
                  //if false then send valid SKU to std SKU
                  if (results?.results[0].isCustomLengthAllowed == true) {
                    window.location.href = `${pdpUrl}?customlength=${lengthValue.beforeCmValue}&uom=${lengthValue.afterCmUom}`;
                  } else {
                    window.location.href = `${pdpUrl}`;
                  }
                  //check in case of no response from Algolia query
                } else {
                  window.location.href = searchPage;
                }
              } catch (error) {
                console.error("error retreiving object", error.message);
                throw error;
              }
            }
            //run async function to get algolia result

            getObjectByID(basePart);
          }
        }
        //end of function

        customSkuSearch();
      } else {
        window.location.href = searchPage;
      }
      //}, 500);
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
      const searchResponseState = state?.collections[1]
        ? state?.collections[1].items
        : [];
      const skuString = searchResponseState[0]?.objectID;
      const hasLengthString = splitStringFromLastHyphen(
        state.query
      ).hasOwnProperty([1]);
      const isNumAlphanum = /^(?=.*[a-zA-Z])(?=.*[0-9])/;
      if (
        isNumAlphanum.test(state.query) &&
        state.query !== skuString &&
        hasLengthString == true
      ) {
        //searchResponseLength;
        searchResponseState.length = 0;
      }

      // On search field update
      theTextQuery = state.query; // update the theTextQuery variable
      setTimeout(function () {
        let source = $(".aa-Source").attr("data-autocomplete-source-id");
        //let count = $(".aa-Source").find("*").length;
        if (
          source == "querySuggestionsPlugin" ||
          source == "productsPlugin" ||
          source == "contentPlugin"
        ) {
          $(".aa-Source").closest(".aa-Panel").removeClass("d-none");
        } else {
          $(".aa-Source").closest(".aa-Panel").addClass("d-none");
        }
      }, 500);
    }
  });

  window.addEventListener("popstate", () => {
    skipInstantSearchUiStateUpdate = true;
    setQuery(search.helper?.state.query || "");
  });
}
if ($("#autocomplete").length > 0) {
  globalSearch();
}

$("#autocomplete").on("click", function (e) {
  $(this).addClass("active-search");
  e.stopPropagation();
});
$(document).click(function (e) {
  if (!$(e.target).hasClass("autocomp")) {
    $("#autocomplete").removeClass("active-search");
  }
});
