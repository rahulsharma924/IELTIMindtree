const queryString = window.location.toString().split("=")[1];
const queryStringSearch = queryString.split("&")[0];
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
    facetFilters: ["category:faq"],
    restrictSearchableAttributes: ["faqQuestion", "faqAnswer"]
  }),

  instantsearch.widgets.index({
    indexName: INSTANT_SEARCH_INDEX_NAME
  })
]);

search.on("render", () => {
  if (search.status === "idle") {
    const hits = search?.helper?.lastResults?.hits;

    if (hits.length) {
      markup(hits); // Generate The Markup Question and Answer
      // Update the result count and result query
      $(document).trigger(
        "faq__response",
        search.renderState[INSTANT_SEARCH_INDEX_NAME]
      );
    } else {
      notFoundResult();
    }
  }
});
search.start();

function markup(hits) {
  hits.map((hit) => {
    //storeQA.Url = hit.url;
    if (hit.faqQuestion && hit.faqAnswer) {
      //var newArray = hit.faqQuestion.map(function (value, index) {
      let $markup = `
        <div class="faq__list--item">
         <h3 class="faq__heading accordion_head">${hit.faqQuestion}</h3>
         <div class="faq__body accordion_body"><p>${hit.faqAnswer}</p>
            <p><a class="faq__search--read-more" href="${hit.url}">Read More</a></p>
         </div>
      </div>`;
      //return $markup;
      //return value + hit.faqAnswer[index];
      //});
      //$list.append(newArray);
      $(".faqs").find(".faq__list").append($markup);
      $(".faqs")
        .find(".faq__search--read-more")
        .text(utilityMessage?.labels?.readMore);
    }
  });
}

/**
 * notFoundResult() if no result found
 */
function notFoundResult() {
  $(".faq__result--empty").removeClass("d-none");
  $("#search-title").text('"' + queryStringSearch + '"');
  $(".no-result-title").text(utilityMessage?.labels?.noResultFound);

  $("#suggestions").text(utilityMessage?.labels?.suggestions);

  $("#sgpointOne").text(utilityMessage?.labels?.suggestionsOne);

  $("#sgpointTwo").text(utilityMessage?.labels?.suggestionsTwo);

  $("#sgpointThree").text(utilityMessage?.labels?.suggestionsThree);

  $("#backToHome").text(utilityMessage?.labels?.backToHome);
}
