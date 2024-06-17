$(document).ready(function () {
  $(".click-shopbybestsellers").on("click", function () {
    shopByBestsellersFilter();
  });
  //shopByBestsellersFilter();
  //analytics
  shopByBestsellerAnalytics();
});
function shopByBestsellersFilter() {
  const { algoliasearch, instantsearch } = window;

  const searchClient = algoliasearch(algId, algApi);

  const search = instantsearch({
    indexName: indexBs,
    searchClient
    //routing: true,
  });

  search.addWidgets([
    instantsearch.widgets.hits({
      container: "#bestsellers-hits",
      templates: {
        item: (hit) => `
        <div class="card analyticsbestsellerscard">
          <a class="store-obj" data-object="${hit.objectID}" href="${SeoUrl(
          hit
        )}">
            <div class="card-img-wrap">
              <img src="${getImage(hit)}" alt="${hit.seoName} ${brandName} ${
          hit.brandSKU
        }" class="img-with-text" loading="lazy"/>
            </div>
            <p data-toggle="tooltip" title="${hit.name}">${hit.name}</p>
          </a>
        </div>
        `
      }
    }),

    instantsearch.widgets.configure({
      filters:
        "bestSellerRank:1 TO 50 AND isSellable:true AND hasCategory:true AND isInPlp:true",
      hitsPerPage: 11
    })
  ]);

  function onRenderHandler() {
    var lenData = $("#bestsellers-hits .ais-Hits-list .ais-Hits-item").length;
    /* if (lenData > 10) {
      $("#bestsellers-hits .ais-Hits-list").prepend('<div class="card view-all-shopByBestSellers"><a title="best-sellers" href="/content/fm/en/best-selling-rf-microwave-and-millimeter-wave-products.html"><div class="card-img-wrap"><img alt="shopByBestSellers-viewAll" src = "'+utilityMessage.dataIMAGE.viewall_Image+'" class= "img-with-text img-thumbnail" alt="Detectors" /></div ><p>View All</p></a ></div > ');
    } */
    if (lenData > 10) {
      $(".view-all-shopByBestSellers").insertBefore(
        $("#bestsellers-hits .ais-Hits-list > li:first-child")
      );
      $(".view-all-shopByBestSellers").removeClass("d-none");
    }
  }

  search.on("render", onRenderHandler);
  search.on("render", $algoliaWidget.createObjArr);

  search.start();
}

//function for shop by bestseller card click for analytics
function shopByBestsellerAnalytics() {
  document.querySelector("body").addEventListener(
    "click",
    function (e) {
      var pVal = e.target.closest("p");
      var label = "";
      var category = "";
      if (
        pVal !== null &&
        pVal.textContent !== null &&
        pVal.closest(".analyticsbestsellerscard") !== null
      ) {
        label = pVal.textContent.trim();
        category = "Best Seller Tab- Home Page";
        ctalinkDataLayerCall(label, category);
      }
    },
    false
  );
}
