const queryString = window.location.toString().split("=")[1];
const queryStringSearch = queryString.split("&")[0];

$(document).on("techresourceResponse", function (e, hitsResponse) {
  if (hitsResponse) {
    techResultsCount(hitsResponse);
  }
});

function techResultsCount(histResponse) {
  const $resultCount = $(".tech-resource-search--result").find(
      ".tech-resource-results--count"
    ),
    $articlesCount = $(".resources").find(".technical-articles"),
    $cardCount = $(".resources").find(".white-card"),
    $brochuresCount = $(".resources").find(".broucher_details");
  let $resultCountNum =
    $articlesCount.length + $cardCount.length + $brochuresCount.length;
  if ($resultCountNum > 0) {
    $resultCount.find(".tech-results_count").text($resultCountNum);

    $resultCount
      .find(".tech-resource-results--query")
      .text(`"${histResponse?.searchBox?.query}"`);

    $resultCount.removeClass("d-none");
  }
}

//techResultsCount();

const searchClient = algoliasearch(algId, algApi);
const { history } = instantsearch.routers;
//creating search results
const INSTANT_SEARCH_INDEX_NAME = indexContent;
const instantSearchRouter = instantsearch.routers.history();

const search = instantsearch({
  searchClient,
  indexName: INSTANT_SEARCH_INDEX_NAME,
  routing: instantSearchRouter
  //routing: true,
});

const { connectSearchBox } = instantsearch.connectors;

const virtualSearchBox = connectSearchBox(() => {});

search.addWidgets([
  virtualSearchBox({}),
  instantsearch.widgets.configure({
    facetFilters: [
      ["category:techresource"],
      [
        "sectionCategory:brochures",
        "sectionCategory:techarticles",
        "sectionCategory:whitepapers"
      ]
    ]
  }),

  instantsearch.widgets.index({
    indexName: INSTANT_SEARCH_INDEX_NAME
  })
]);
const index = searchClient.initIndex(INSTANT_SEARCH_INDEX_NAME);
index
  .search(queryStringSearch, {
    facetFilters: [
      ["category:techresource"],
      [
        "sectionCategory:brochures",
        "sectionCategory:techarticles",
        "sectionCategory:whitepapers"
      ]
    ]
  })
  .then(({ hits }) => {
    if (hits.length) {
      markup(hits);

      let hitsCount = hits.length;
      $(document).trigger(
        "techresourceResponse",
        search.renderState[INSTANT_SEARCH_INDEX_NAME]
      );
    } else {
      $(".tech-resource-result--empty").removeClass("d-none");
      $(".resources").addClass("d-none");
      $(".tech-resource-results--count").addClass("d-none");
      $("#search-title").text(
        '"' + decodeURIComponent(queryStringSearch) + '"'
      );
      $(".no-result-title").text(utilityMessage?.labels?.noResultFound);

      $("#suggestions").text(utilityMessage?.labels?.suggestions);

      $("#sgpointOne").text(utilityMessage?.labels?.suggestionsOne);

      $("#sgpointTwo").text(utilityMessage?.labels?.suggestionsTwo);

      $("#sgpointThree").text(utilityMessage?.labels?.suggestionsThree);

      $("#backToHome").text(utilityMessage?.labels?.backToHome);
    }
  });
search.start();
function markup(hits) {
  hits.map((hit) => {
    if (hit.sectionCategory === "whitepapers") {
      const newArrayPapers = () => {
        let $markup = `        
          <div class="white-card">
          <div class="white-title"><p class="title">${hit.docTitle}</p></div>
          <div class="white-desc"><p class="broucherDesc">${hit.docDesc}</p></div>
          <div class="cardbroucherLink"><a href="${hit.docUrl}" class="ie-tertiary-link font-weight-500" title="View PDF"><i class="fa-sharp fa-solid fa-file-pdf"></i>View PDF</a></div>
        </div>`;
        return $markup;
      };
      newArrayPapers();
      $(".resources").find(".white-paper-main").append(newArrayPapers);
      $(".section-whitepapers").find(".section-heading").removeClass("d-none");
    }

    if (hit.sectionCategory === "techarticles") {
      const newArrayArticles = () => {
        let $markup = `        
        <div class="technical-articles">
        <h2 class="technical-articles-title">${hit.docTitle}</h2>
        <div class="white-desc"><p class="broucherDesc broucherDesc-limit">${hit.docDesc}</p></div>
        <h3 class="basefont-size"><a class="ie-tertiary-link font-weight-500 articleView" href="${hit.docUrl}" title="View">View</a></h3>
     </div>`;
        return $markup;
      };
      newArrayArticles();
      $(".resources")
        .find(".technical_resources_articles")
        .append(newArrayArticles);
      $(".section-techarticles").find(".section-heading").removeClass("d-none");
    }

    if (hit.sectionCategory === "brochures") {
      const newArrayBrochures = () => {
        let $markup = `        
        <div class="broucher_details">
        <div class="broucherLink border-img"><img class="BroucherImage img-height" alt="${hit.docImage}" src="${hit.docImage}" aria-label="broucherimage">
        </div>
        <h2 class="broucherTitle">${hit.docTitle}</h2>
        <div class="white-desc"><p class="broucherDesc">${hit.docDesc}</p></div>
        <div class="broucherLink m-top"><a class="ie-tertiary-link font-weight-500" href="${hit.docUrl}" title="View PDF"><i class="fa-sharp fa-solid fa-file-pdf"></i>View PDF</a>
        </div></div>`;
        return $markup;
      };
      newArrayBrochures();
      $(".resources").find(".broucherInformation").append(newArrayBrochures);
      $(".section-brochures").find(".section-heading").removeClass("d-none");
    }
  });
}
