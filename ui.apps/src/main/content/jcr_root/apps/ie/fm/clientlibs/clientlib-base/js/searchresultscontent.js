function searchresultscontentalgolia() {
  const searchClient = algoliasearch(algId, algApi);
  //creating search results
  const INSTANT_SEARCH_INDEX_NAME = indexContent;
  const search = instantsearch({
    searchClient,
    indexName: INSTANT_SEARCH_INDEX_NAME,
    routing: false
  });

  const { connectSearchBox } = instantsearch.connectors;

  const virtualSearchBox = connectSearchBox(() => {});

  //custom pagination widget for top
  const { connectPagination } = instantsearch.connectors;

  // Create the render function
  const renderPagination = (renderOptions, isFirstRender) => {
    const {
      pages,
      currentRefinement,
      nbPages,
      isFirstPage,
      isLastPage,
      refine,
      createURL
    } = renderOptions;

    const container = document.querySelector("#pagination-top");

    container.innerHTML = `
      <ul class="ais-Pagination-list">	
    ${`Page`}
    ${pages
      .map(
        (page) => `
              <li class="active-page" style="display: ${
                currentRefinement === page ? "inline-block" : "none"
              }">
                <a
                  href="${createURL(page)}"
                  data-value="${page}"
                  title="Pagination Link"
                >
                  ${page + 1}
                </a>
              </li>
            `
      )
      .join("")}
      ${`<li class="pagination_gap">`} ${`of`} ${nbPages} ${`</li>`}
        ${
          !isFirstPage
            ? `
              
              <li>
                <a
                  title="Pagination Link"
                  href="${createURL(currentRefinement - 1)}"
                  data-value="${currentRefinement - 1}"
                >
                  <span class="ais-Pagination-link"><i class="fa fa-angle-left analytictracktop" aria-hidden="true"></i></span>
                </a>
              </li>
              `
            : `<li class="ais-Pagination-item ais-Pagination-item--previousPage ais-Pagination-item--disabled">
                  <span class="ais-Pagination-link"><i class="fa fa-angle-left analytictracktop" aria-hidden="true"></i></span>
                </li>`
        }
      ${
        !isLastPage
          ? `
                <li class="ais-Pagination-item ais-Pagination-item--nextPage">
                  <a class="ais-Pagination-link" title="Pagination Link"
                    href="${createURL(currentRefinement + 1)}"
                    data-value="${currentRefinement + 1}"
                  >
                    <i class="fa fa-angle-right analytictracktop" aria-hidden="true"></i>
                  </a>
                </li>
                
                `
          : `<li class="ais-Pagination-item ais-Pagination-item--previousPage ais-Pagination-item--disabled">
                  <span class="ais-Pagination-link"><i class="fa fa-angle-right analytictracktop" aria-hidden="true"></i></span>
                </li>`
      }      
  
      </ul>
    `;

    [...container.querySelectorAll("a")].forEach((element) => {
      element.addEventListener("click", (event) => {
        event.preventDefault();
        refine(event.currentTarget.dataset.value);
      });
    });
  };

  // Create the custom widget for top pagination
  const customPagination = connectPagination(renderPagination);

  // Create the render function for top content pagination
  const renderPagination3 = (renderOptions, isFirstRender) => {
    const {
      pages,
      currentRefinement,
      nbPages,
      isFirstPage,
      isLastPage,
      refine,
      createURL
    } = renderOptions;

    const container3 = document.querySelector("#pagination-top3");

    container3.innerHTML = `
    <ul class="ais-Pagination-list">	
  ${`Page`}
  ${pages
    .map(
      (page) => `
            <li class="active-page" style="display: ${
              currentRefinement === page ? "inline-block" : "none"
            }">
              <a
                href="${createURL(page)}"
                data-value="${page}"
                title="Pagination Link"
              >
                ${page + 1}
              </a>
            </li>
          `
    )
    .join("")}
    ${`<li class="pagination_gap">`} ${`of`} ${nbPages} ${`</li>`}
      ${
        !isFirstPage
          ? `
            
            <li>
              <a
                title="Pagination Link"
                href="${createURL(currentRefinement - 1)}"
                data-value="${currentRefinement - 1}"
              >
                <span class="ais-Pagination-link"><i class="fa fa-angle-left analytictracktop" aria-hidden="true"></i></span>
              </a>
            </li>
            `
          : `<li class="ais-Pagination-item ais-Pagination-item--previousPage ais-Pagination-item--disabled">
                <span class="ais-Pagination-link"><i class="fa fa-angle-left analytictracktop" aria-hidden="true"></i></span>
              </li>`
      }
    ${
      !isLastPage
        ? `
              <li class="ais-Pagination-item ais-Pagination-item--nextPage">
                <a class="ais-Pagination-link" title="Pagination Link"
                  href="${createURL(currentRefinement + 1)}"
                  data-value="${currentRefinement + 1}"
                >
                  <i class="fa fa-angle-right analytictracktop" aria-hidden="true"></i>
                </a>
              </li>
              
              `
        : `<li class="ais-Pagination-item ais-Pagination-item--previousPage ais-Pagination-item--disabled">
                <span class="ais-Pagination-link"><i class="fa fa-angle-right analytictracktop" aria-hidden="true"></i></span>
              </li>`
    }      
  
    </ul>
  `;

    [...container3.querySelectorAll("a")].forEach((element) => {
      element.addEventListener("click", (event) => {
        event.preventDefault();
        refine(event.currentTarget.dataset.value);
      });
    });
  };

  // Create the custom widget for top content pagination
  const customPagination3 = connectPagination(renderPagination3);

  // Instantiate the custom widget for top content pagination
  search.addWidgets([
    customPagination3({
      container: document.querySelector("#pagination-top3")
    })
  ]);
  //end of custom top pagination widget

  // Create the render function for bottom content pagination
  const renderPagination4 = (renderOptions, isFirstRender) => {
    const {
      pages,
      currentRefinement,
      nbPages,
      isFirstPage,
      isLastPage,
      refine,
      createURL
    } = renderOptions;

    const container4 = document.querySelector("#pagination-bottom4");

    container4.innerHTML = `
      <ul class="ais-Pagination-list">	
      ${`<li class="desktop-pagination ml-pl-0"><ul class="ml-pl-0">`}
    ${`Page`}
    ${pages
      .map(
        (page) => `
              <li class="active-page" style="display: ${
                currentRefinement === page ? "inline-block" : "none"
              }">
                <a
                  title="Pagination Link"
                  href="${createURL(page)}"
                  data-value="${page}"
                  
                >
                  ${page + 1}
                </a>
              </li>
            `
      )
      .join("")}
      ${`<li style="display:inline-block">`} ${`of`} ${nbPages} ${`</li>`}
      ${`</ul></li>`}
        ${
          !isFirstPage
            ? `
              <li class="double-angle-ar-lf"> <a title="Pagination Link" href="${createURL(
                0
              )}" data-value="${0}" ><i class="fa fa-angle-double-left"></i></a> </li>
              <li>
                <a title="Pagination Link"
                  href="${createURL(currentRefinement - 1)}"
                  data-value="${currentRefinement - 1}"
                >
                  <span class="ais-Pagination-link"><i class="fa fa-angle-left analytictrackbottom" aria-hidden="true"></i></span>
                </a>
              </li>
              `
            : `<li class="double-angle-ar-lf  ais-Pagination-item--disabled"><i class="fa fa-angle-double-left"></i></li>
              <li class="ais-Pagination-item ais-Pagination-item--previousPage ais-Pagination-item--disabled">
                  <span class="ais-Pagination-link"><i class="fa fa-angle-left analytictrackbottom" aria-hidden="true"></i></span>
                </li>`
        }
        ${`<li class="mobile-pagination ml-pl-0"><ul class="ml-pl-0">`}
        ${`Page`}
    ${pages
      .map(
        (page) => `
              <li class="active-page" style="display: ${
                currentRefinement === page ? "inline-block" : "none"
              }">
                <a title="Pagination Link"
                  href="${createURL(page)}"
                  data-value="${page}"
                  
                >
                  ${page + 1}
                </a>
              </li>
            `
      )
      .join("")}
      ${`<li>`} ${`of`} ${nbPages} ${`</li>`}
        ${`</ul></li>`}
      ${
        !isLastPage
          ? `
                <li class="ais-Pagination-item ais-Pagination-item--nextPage">
                  <a title="Pagination Link" class="ais-Pagination-link"
                    href="${createURL(currentRefinement + 1)}"
                    data-value="${currentRefinement + 1}"
                  >
                    <i class="fa fa-angle-right analytictrackbottom" aria-hidden="true"></i>
                  </a>
                </li>
                <li class="double-angle-ar-rt"> <a title="Pagination Link" href="${createURL(
                  nbPages - 1
                )}" data-value="${
              nbPages - 1
            }" > <i class="fa fa-angle-double-right"></i></a> </li>
                `
          : `<li class="ais-Pagination-item ais-Pagination-item--previousPage ais-Pagination-item--disabled">
                  <span class="ais-Pagination-link"><i class="fa fa-angle-right analytictrackbottom" aria-hidden="true"></i></span>
                </li>
                <li class="double-angle-ar-rt ais-Pagination-item--disabled"><i class="fa fa-angle-double-right"></i></li>
                `
      }
        
          
      </ul>
    `;

    [...container4.querySelectorAll("a")].forEach((element) => {
      element.addEventListener("click", (event) => {
        event.preventDefault();
        refine(event.currentTarget.dataset.value);
      });
    });
  };

  // Create the custom widget for bottom content pagination
  const customPagination4 = connectPagination(renderPagination4);

  // Instantiate the custom widget for bottom content pagination
  search.addWidgets([
    customPagination4({
      container: document.querySelector("#pagination-bottom4")
    })
  ]);

  //end of custom top pagination widget
  const renderStats = (renderOptions, isFirstRender) => {
    const { nbHits } = renderOptions;

    //document.querySelector(".stats-title").innerHTML = `${nbHits}`;
  };
  const renderHits = connectPagination(renderStats);
  search.addWidgets([
    instantsearch.widgets.index({ indexName: indexInuse }).addWidgets([
      renderHits({
        container: document.querySelector(".stats-title")
      }),
      instantsearch.widgets.configure({
        filters: "isSellable:true"
      })
    ])
  ]);
  search.addWidgets([
    virtualSearchBox({}),
    instantsearch.widgets.index({ indexName: indexContent }).addWidgets([
      instantsearch.widgets.hits({
        container: "#hits-content",
        templates: {
          item(hit, { html, components }) {
            return html`
              <h3>${hit.title}</h3>
              <p class="ellipsis-200">${hit.description}</p>
              <p class="html-content"></p>
              <p class="card-read-more"><a href="${hit.url}">Read More</a></p>
            `;
          }
        }
      }),
      customPagination3({
        container: document.querySelector("#pagination-top3")
      }),
      customPagination4({
        container: document.querySelector("#pagination-bottom4")
      }),
      instantsearch.widgets.stats({
        container: ".stats3",
        templates: {
          text: `
                {{#hasNoResults}}0{{/hasNoResults}}
                {{#hasOneResult}}1 result{{/hasOneResult}}
                {{#hasManyResults}} {{#helpers.formatNumber}}{{nbHits}}{{/helpers.formatNumber}} results{{/hasManyResults}}
            `
        }
      }),
      instantsearch.widgets.stats({
        container: ".stats3-bottom",
        templates: {
          text: `
                  {{#hasNoResults}}0{{/hasNoResults}}
                  {{#hasOneResult}}1 result{{/hasOneResult}}
                  {{#hasManyResults}} {{#helpers.formatNumber}}{{nbHits}}{{/helpers.formatNumber}} results{{/hasManyResults}}
              `
        }
      }),

      instantsearch.widgets.hitsPerPage({
        container: ".hits-per-page-content",
        items: [
          { label: "12", value: 12, default: true },
          { label: "24", value: 24 },
          { label: "36", value: 36 }
        ]
      }),
      instantsearch.widgets.hitsPerPage({
        container: ".hits-per-page3-bottom",
        items: [
          { label: "12", value: 12, default: true },
          { label: "24", value: 24 },
          { label: "36", value: 36 }
        ]
      }),
      instantsearch.widgets.sortBy({
        container: ".sort-by-content",
        cssClasses: {
          root: "plpSortBy",
          select: ["plpSortBySelect"]
        },
        items: [
          { value: indexContent, label: "Default" },
          { value: indexContentAsc, label: "A - Z" },
          { value: indexContentDsc, label: "Z - A" }
        ]
      })
    ])
  ]);

  function onRenderHandler(response) {
    if (response.pagination.nbHits) {
      $(".stats-content-title").text(response.pagination.nbHits);
    }

    // your jquery function you want to run
    //add a class when product is out of stock to hide add to cart
    // $(window).on('load', inventoryCheck());

    $(document).ready(function () {
      charLimit();
      readMoreContent();
    });

    //setting char limit 90 in table view product name

    function charLimit() {
      var maxName = 90;

      $(".pr-td-dv .ellipsis-90").each(function () {
        var namechar = $(this).text();

        if (namechar.length > maxName) {
          var beginTitle = namechar.substr(0, maxName);

          $(this).html(beginTitle).append($("<span />").html("..."));
        }
      });
    }

    // char limit 200 on content result page
    function readMoreContent() {
      let maxName = 200,
        truncatedtext,
        htmlString,
        htmlContent,
        appendContent;
      $(".ellipsis-200").each(function () {
        const $this = $(this);
        htmlContent = $this.html() ? $this.html().trim() : "";
        if (htmlContent.length > maxName) {
          truncatedtext = htmlContent.substr(0, maxName);
          htmlString = $.parseHTML(truncatedtext)
            ? $.parseHTML(truncatedtext)[0]?.data
            : "";

          if (htmlString) {
            $this.hide();
            $this.next().empty();
            appendContent = $this.next().append(htmlString);
            if ($this.next().find("ol li").length > 0) {
              $this
                .next()
                .find("ol li:last-child")
                .append($("<span />").html(" ..."));
            } else {
              appendContent.append($("<span />").html(" ..."));
            }
          }
        } else {
          let html = $.parseHTML(htmlContent)
            ? $.parseHTML(htmlContent)[0]?.data
            : "";
          $this.hide();
          $this.next().empty();
          $this.next().append(html);
        }
      });
    }

    //end function
  }

  search.on("render", () => {
    if (search?.renderState[indexContent]?.hits.results !== undefined) {
      const response = search?.renderState[indexContent];
      onRenderHandler(response);
    }
  });

  search.use(
    instantsearch.middlewares.createInsightsMiddleware({
      insightsClient: window.aa,
      insightsInitParams: {
        useCookie: false
      }
    })
  );

  //check for logged in user
  function getCookie(name) {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
      begin = dc.indexOf(prefix);
      if (begin != 0) return null;
    } else {
      begin += 2;
      var end = document.cookie.indexOf(";", begin);
      if (end == -1) {
        end = dc.length;
      }
    }
    return decodeURI(dc.substring(begin + prefix.length, end));
  }

  /* =================Get and set user token =================== */
  var loggedinCookie = JSON.parse(getCookie("customerInfo"));

  var guestId = "AN-" + Math.random().toString(16).slice(2);
  var gid = sessionStorage.getItem("Guest Algolia");
  if (gid == null || gid == "" || gid == "undefined") {
    sessionStorage.setItem("Guest Algolia", guestId);
  }

  const userToken =
    loggedinCookie == null ? guestId : loggedinCookie.customertoken;
  window.aa("setUserToken", userToken);
  /*
  aa('getUserToken', null, (err, userToken) => {
    if (err) {
      console.error(err);
      return;
    }
  });
  */
  /* =================End of Get and set user token =================== */

  search.start();
  var indexName = indexContent;
  search.setUiState((uiState) => {
    return {
      ...uiState,
      // Replace instant_search with your own index name
      [indexName]: {
        ...uiState[indexName],
        query: $(".aa-Input").val()
      }
    };
  });
  //view switcher
  var switchSelector = $(".plp-product-list .search-panel");
  function clearView() {
    //$(".plp-view-mode").attr("class", "");
    $(switchSelector).removeClass("tile-view card-view table-view");
    $(".plp-product-list").removeClass("table-view-wrapper");
  }
}
