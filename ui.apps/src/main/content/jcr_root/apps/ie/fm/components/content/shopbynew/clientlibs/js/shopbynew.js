$(document).ready(function () {
  $(".click-shopbynew").on("click", function () {
    shopByNewReleaseFilter();
  });
  //shopByNewReleaseFilter();
  //analytics
  shopByNewAnalytics();
});
function shopByNewReleaseFilter() {
  const { algoliasearch, instantsearch } = window;

  const searchClient = algoliasearch(algId, algApi);

  const search = instantsearch({
    indexName: indexInuse,
    searchClient,
    routing: true
  });

  search.addWidgets([
    instantsearch.widgets.hits({
      container: "#shopByNewRelease-hits",
      templates: {
        item: (hit) => `
          <div class="card analyticsshopbynewcard">
            <a class="store-obj" data-object="${hit.objectID}" href="${SeoUrl(
          hit
        )}">
              <div class="card-img-wrap">
                <img src="${getImage(hit)}" alt="${hit.seoName} ${brandName} ${
          hit.brandSKU
        }" class="img-with-text" loading="lazy" />
              </div>
              <p data-toggle="tooltip" title="${hit.name}">${hit.name}</p>
            </a>
          </div>
        `
      }
    }),

    instantsearch.widgets.configure({
      facetFilters: [
        "isNew:true",
        "categorySEOURL:-/customized-products",
        "isSellable:true",
        "hasCategory:true",
        "isInPlp:true"
      ],
      hitsPerPage: 11
    })
  ]);

  function onRenderHandler() {
    var lenData = $(
      "#shopByNewRelease-hits .ais-Hits-list .ais-Hits-item"
    ).length;
    /* if (lenData > 10) {
      $("#shopByNewRelease-hits .ais-Hits-list").prepend(
        `<div class="card view-all-shopByNew"><a title="new-release" href="/content/fm/en/new-rf-microwave-products-from-fairview-microwave.html"><div class="card-img-wrap"><img alt="shopByNew-viewAll" src = "` +
          utilityMessage.dataIMAGE.viewall_Image +
          `"  loading="lazy" class= "img-with-text img-thumbnail" alt="Detectors" /></div ><p>View All</p></a ></div > `
      );
    } */
    if (lenData > 10) {
      $(".view-all-shopByNew").insertBefore(
        $("#shopByNewRelease-hits .ais-Hits-list > li:first-child")
      );
      $(".view-all-shopByNew").removeClass("d-none");
    }
  }

  search.on("render", onRenderHandler);
  search.on("render", $algoliaWidget.createObjArr);
  search.start();
}

//function for shop by new card click for analytics
function shopByNewAnalytics() {
  document.querySelector("body").addEventListener(
    "click",
    function (e) {
      var pVal = e.target.closest("p");
      var label = "";
      var category = "";
      if (
        pVal !== null &&
        pVal.textContent !== null &&
        pVal.closest(".analyticsshopbynewcard") !== null
      ) {
        label = pVal.textContent.trim();
        category = "New Tab- Home Page";
        ctalinkDataLayerCall(label, category);
      }
    },
    false
  );
}
