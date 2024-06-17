(function () {
  let countFilter = 0;
  let editCount = 0;
  let utilityMessage;
  let isAlreadySubCategory;
  let sortIndex;
  if ($("#bestsellers").length) {
    sortIndex = indexBs;
  } else {
    sortIndex = indexInuse;
  }

  /*  window.onload = function () {
    utilityMessage = window.utilityMessage ? window.utilityMessage : {};
  }; */
  /* Pagination */
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
              <input type="number" min="1" max=${nbPages} value=${page + 1}>
                
              </li>
            `
      )
      .join("")}
      ${`<li class="pagination_gap">`} ${`of`} ${nbPages} ${`</li>`}
        ${
          !isFirstPage
            ? `
              
              <li class="ais-Pagination-item ais-Pagination-item--previousPage">
                <a class="ais-Pagination-link"
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

    [...container.querySelectorAll("input")].forEach((element) => {
      let maxInput, currentInput;
      element.addEventListener("input", (event) => {
        maxInput = event.currentTarget.getAttribute("max");
        currentInput = event.currentTarget.value;
        if (+currentInput > +maxInput) {
          currentInput = maxInput;
        }
        setTimeout(() => {
          refine(currentInput - 1);
        }, 1200);
      });
    });
  };

  const renderPagination2 = (renderOptions, isFirstRender) => {
    const {
      pages,
      currentRefinement,
      nbPages,
      isFirstPage,
      isLastPage,
      refine,
      createURL
    } = renderOptions;

    const container2 = document.querySelector("#pagination-bottom");

    container2.innerHTML = `
      <ul class="ais-Pagination-list">	
      ${`<li class="desktop-pagination ml-pl-0"><ul class=" ml-pl-0">`}
    ${`Page`}
    ${pages
      .map(
        (page) => `
              <li class="active-page" style="display: ${
                currentRefinement === page ? "inline-block" : "none"
              }">
              <input type="number" min="1" max=${nbPages} value=${page + 1}>
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
        ${`<li class="mobile-pagination  ml-pl-0"><ul class=" ml-pl-0">`}
        ${`Page`}
    ${pages
      .map(
        (page) => `
              <li class="active-page" style="display: ${
                currentRefinement === page ? "inline-block" : "none"
              }">
              <input type="number" min="1" max=${nbPages} value=${page + 1}>
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

    [...container2.querySelectorAll("a")].forEach((element) => {
      element.addEventListener("click", (event) => {
        event.preventDefault();
        refine(event.currentTarget.dataset.value);
      });
    });

    [...container2.querySelectorAll("input")].forEach((element) => {
      element.addEventListener("input", (event) => {
        event.preventDefault();
        setTimeout(() => {
          refine(event.target.value - 1);
        }, 1200);
      });
    });
  };

  const renderStats1 = (renderOptions, isFirstRender) => {
    const {
      hitsPerPage,

      page,

      nbHits,

      widgetParams
    } = renderOptions;

    if (isFirstRender) {
      return;
    }

    let count = `${hitsPerPage * (page + 1)}`;

    let tcount = `${nbHits}`;

    let mcount = count.length > tcount.length ? `${tcount}` : `${count}`;

    widgetParams.container.innerHTML = `${mcount}`;
  };
  /* Filters */
  const categoriesList = () => {
    //$algolia.instantSearch();
    return instantsearch.widgets.refinementList({
      container: "#brand-list",
      attribute: "hierarchicalCategories.lvl0",
      limit: 200,
      sortBy: ["name:asc", "count:desc"]
    });
  };

  const categoriesListLevelOne = () => {
    return instantsearch.widgets.refinementList({
      container: "#lvl1-cat",
      attribute: "hierarchicalCategories.lvl1",
      sortBy: ["name:asc", "count:desc"],
      limit: 200
    });
  };

  const categoriesListLevelTwo = () => {
    return instantsearch.widgets.refinementList({
      container: "#lvl2-cat",
      attribute: "hierarchicalCategories.lvl2",
      sortBy: ["name:asc", "count:desc"]
    });
  };

  const priceRangeSlider = () => {
    return instantsearch.widgets.rangeSlider({
      container: "#price-range",
      attribute: "startingPrice",
      tooltips: false,
      pips: false,
      precision: 6
    });
  };
  const priceRangeInput = () => {
    return instantsearch.widgets.rangeInput({
      container: "#range-input",
      attribute: "startingPrice",
      precision: 6
    });
  };

  const categoriesIsNew = () => {
    if ($(".new__releases").length || $("#new-releases").length) {
      return instantsearch.widgets.configure({
        facetFilters: ["isNew:true", "categorySEOURL:-/customized-products"]
      });
    }
    return instantsearch.widgets.configure({});
  };

  const clearRefinements = (utilityMessage) => {
    return instantsearch.widgets.clearRefinements({
      container: "#clear-refinements",

      templates: {
        resetLabel({ hasRefinements }, { html }) {
          return html`<span
            >${hasRefinements ? utilityMessage?.labels?.clearAll : ""}</span
          >`;
        }
      }
    });
  };

  const clearRefinementsMobile = (utilityMessage) => {
    return instantsearch.widgets.clearRefinements({
      container: "#clear-refinements-mob",

      templates: {
        resetLabel({ hasRefinements }, { html }) {
          return html`<span
            >${hasRefinements ? utilityMessage?.labels?.clear : ""}</span
          >`;
        }
      }
    });
  };

  /* Sorting */
  const sortWidgetBestseller = (utilityMessage) => {
    return instantsearch.widgets.sortBy({
      container: ".sort-by",
      cssClasses: {
        root: "plpSortBy",
        select: ["plpSortBySelect"]
      },
      items: [
        { value: indexBs, label: utilityMessage?.labels?.sortingDefault },
        { value: indexNmAsc, label: utilityMessage?.labels?.sortingAZ },
        { value: indexNmDsc, label: utilityMessage?.labels?.sortingZA },
        { value: indexPrAsc, label: utilityMessage?.labels?.sortingPriceLH },
        { value: indexPrDsc, label: utilityMessage?.labels?.sortingPriceHL }
      ]
    });
  };

  const sortWidget = (utilityMessage) => {
    return instantsearch.widgets.sortBy({
      container: ".sort-by",
      cssClasses: {
        root: "plpSortBy",
        select: ["plpSortBySelect"]
      },
      items: [
        { value: sortIndex, label: utilityMessage?.labels?.sortingDefault },
        { value: indexNmAsc, label: utilityMessage?.labels?.sortingAZ },
        { value: indexNmDsc, label: utilityMessage?.labels?.sortingZA },
        { value: indexPrAsc, label: utilityMessage?.labels?.sortingPriceLH },
        { value: indexPrDsc, label: utilityMessage?.labels?.sortingPriceHL }
      ]
    });
  };

  /* Products view per page */
  const hitsPerPage = () => {
    return instantsearch.widgets.configure({
      hitsPerPage: 12
    });
  };

  const hitsPerPageBestSeller = () => {
    return instantsearch.widgets.configure({
      filters:
        "bestSellerRank:1 TO 50 AND isSellable:true  AND hasCategory:true  AND isInPlp:true"
    });
  };

  const hitPerPageTop = () => {
    return instantsearch.widgets.hitsPerPage({
      container: ".hits-per-page",
      items: [
        { label: "12", value: 12, default: true },
        { label: "24", value: 24 },
        { label: "48", value: 48 },
        { label: "100", value: 100 }
      ]
    });
  };

  const hitPerPageBottom = () => {
    return instantsearch.widgets.hitsPerPage({
      container: ".hits-per-page-bottom",
      items: [
        { label: "12", value: 12, default: true },
        { label: "24", value: 24 },
        { label: "48", value: 48 },
        { label: "100", value: 100 }
      ]
    });
  };

  const hitPerPageMobile = () => {
    return instantsearch.widgets.hitsPerPage({
      container: ".hits-per-page-mob",
      items: [
        { label: "12", value: 12, default: true },
        { label: "24", value: 24 },
        { label: "48", value: 48 },
        { label: "100", value: 100 }
      ]
    });
  };
  /* Show products result */
  const statsTop = (utilityMessage) => {
    return instantsearch.widgets.stats({
      container: ".stats2",
      templates: {
        text: `
              {{#hasNoResults}}${utilityMessage?.labels?.noResultAlgolia}{{/hasNoResults}}
              {{#hasOneResult}}1 ${utilityMessage?.labels?.results} <a title="${utilityMessage?.labels?.editParameters}" class="edit-param d-none" onClick="$algolia.enlarge();">${utilityMessage?.labels?.editParameters}</a>{{/hasOneResult}}
              {{#hasManyResults}} {{#helpers.formatNumber}}{{nbHits}}{{/helpers.formatNumber}} ${utilityMessage?.labels?.results} <a title="${utilityMessage?.labels?.editParameters}" class="edit-param d-none" onClick="$algolia.enlarge();">${utilityMessage?.labels?.editParameters}</a>{{/hasManyResults}}
          `
      }
    });
  };
  const statsSearchTop = (utilityMessage) => {
    return instantsearch.widgets.stats({
      container: ".stats2",
      templates: {
        text: `
              {{#hasNoResults}}0{{/hasNoResults}}
              {{#hasOneResult}}1 ${utilityMessage?.labels?.results} <a title="${utilityMessage?.labels?.editParameters}" class="edit-param d-none" onClick="$algolia.enlarge();">${utilityMessage?.labels?.editParameters}</a>{{/hasOneResult}}
              {{#hasManyResults}} {{#helpers.formatNumber}}{{nbHits}}{{/helpers.formatNumber}} ${utilityMessage?.labels?.results} <a title="${utilityMessage?.labels?.editParameters}" class="edit-param d-none" onClick="$algolia.enlarge();">${utilityMessage?.labels?.editParameters}</a>{{/hasManyResults}}
          `
      }
    });
  };

  const statsMobile = (utilityMessage) => {
    return instantsearch.widgets.stats({
      container: ".mstats",
      templates: {
        text: `
              {{#hasNoResults}}${utilityMessage?.labels?.noResultAlgolia}{{/hasNoResults}}
              {{#hasOneResult}}1 ${utilityMessage?.labels?.results}{{/hasOneResult}}
              {{#hasManyResults}} {{#helpers.formatNumber}}{{nbHits}}{{/helpers.formatNumber}} ${utilityMessage?.labels?.results}{{/hasManyResults}}
          `
      }
    });
  };

  const statsBottom = (utilityMessage) => {
    return instantsearch.widgets.stats({
      container: ".stats2-bottom",
      templates: {
        text: `
              {{#hasNoResults}}${utilityMessage?.labels?.noResultAlgolia}{{/hasNoResults}}
              {{#hasOneResult}}1 ${utilityMessage?.labels?.results}{{/hasOneResult}}
              {{#hasManyResults}} {{#helpers.formatNumber}}{{nbHits}}{{/helpers.formatNumber}} ${utilityMessage?.labels?.results}{{/hasManyResults}}
          `
      }
    });
  };
  const statsSearchBottom = (utilityMessage) => {
    return instantsearch.widgets.stats({
      container: ".stats2-bottom",
      templates: {
        text: `
              {{#hasNoResults}}0{{/hasNoResults}}
              {{#hasOneResult}}1 ${utilityMessage?.labels?.results}{{/hasOneResult}}
              {{#hasManyResults}} {{#helpers.formatNumber}}{{nbHits}}{{/helpers.formatNumber}} ${utilityMessage?.labels?.results}{{/hasManyResults}}
          `
      }
    });
  };

  const statsTitle = () => {
    return instantsearch.widgets.stats({
      container: ".stats-title",
      templates: {
        text: `
                {{#hasNoResults}}0{{/hasNoResults}}
                {{#hasOneResult}}1{{/hasOneResult}}
                {{#hasManyResults}} {{#helpers.formatNumber}}{{nbHits}}{{/helpers.formatNumber}}{{/hasManyResults}}
            `
      }
    });
  };

  const isSellable = () => {
    return instantsearch.widgets.configure({
      filters: "isSellable:true AND hasCategory:true AND isInPlp:true"
    });
  };

  const isSearchable = () => {
    return instantsearch.widgets.configure({
      filters: "isSearchable:true AND hasCategory:true"
    });
  };

  const facetDisplay = () => {
    $(
      ".accordion-content .ais-RefinementList--noRefinement, .accordion-content .ais-RangeSlider--disabled"
    )
      .parents(".accordion-item")
      .addClass("d-none");
  };

  /* For current filter tags */
  function customCurrentFilter() {
    setInterval(function () {
      $(
        ".rangeRefinement-custom-new.price-range-text .ais-CurrentRefinements-categoryLabel"
      ).each(function () {
        $(this).parent().children(".custom-span-current").remove();
        let currentRangePrice = $(this).text();
        let pureNumber = currentRangePrice.replace(
          /[`~!@#$%^&*()_|+\-=?;:'",<>≥≤\{\}\[\]\\\/]/gi,
          ""
        );
        let typeNumber = Number(pureNumber);
        let withCommaNumber = typeNumber.toLocaleString("en-us");
        $(this)
          .parent()
          .append(
            "<span class='custom-span-current'>$" + withCommaNumber + "</span>"
          );
      });
    }, 200);
  }
  //comma separator with 2 decimal places with US format

  function formatPrice(price) {
    return price.toLocaleString("en-us", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
  // Check Category level from URL
  const pathnameMatches = location.pathname.match(/category\/(.*?)\/?$/);

  function catLevelSelection() {
    if (
      pathnameMatches !== null &&
      pathnameMatches[0].indexOf("all.html") < 0
    ) {
      let catUrl = pathnameMatches;
      let currentURL = catUrl;
      let catLevel = "hierarchicalCategories.lvl0";
      if (currentURL[1].indexOf("/") > -1) {
        let extractData = currentURL[1].split("/");
        if (extractData.length === 1) {
          catLevel = "hierarchicalCategories.lvl0";
        } else if (extractData.length === 2) {
          catLevel = "hierarchicalCategories.lvl1";
        } else if (extractData.length === 3) {
          catLevel = "hierarchicalCategories.lvl2";
        }
      }
      return catLevel;
    }
  }

  //comma separator for number with US format

  function formatNumber(number) {
    return number.toLocaleString("en-us");
  }

  /* Dynamic filter */
  let isAlreadyCall = true;
  function searchFilter(categoryName, response, categoryObject) {
    let cName = categoryObject?.rootCategory[0].category.name || categoryName;
    countFilter++;

    if (countFilter <= 1 || isAlreadyCall) {
      const categoryFinal = encodeURIComponent(cName);

      if (categoryFinal !== null) {
        // First AJAX call
        $.ajax({
          type: "POST",
          url: "/bin/GetPLPFilterAttributes",
          data: {
            brandName: "FM",
            categoryName: categoryFinal,
            bearertoken: window.getbearerToken()
          },
          success: function (data) {
            //window.errorModule.checkError(data);
            function plpFacetData(data) {
              var categoryName = $(
                "#brand-list .ais-RefinementList-item--selected .ais-RefinementList-labelText"
              ).text();
              var catFilterdata = ` `;
              data?.attributes?.forEach((innerData) => {
                catFilterdata += `<div class="accordion-item accordion-filter plp-filter-cty analyticsplpfilter"><div class="accordion-head">${innerData.webAttributeName.replace(
                  /,/g,
                  " -"
                )}${innerData.displayWidget === "rangeSlider" ? " Range" : ""}
            </div><div class="accordion-content ${
              innerData.displayWidget
            }" id="${innerData.attributeCode.replace(/\(|\)/g, "")}">
            ${
              innerData.displayWidget === "rangeSlider"
                ? `<div class="customised-range-remove"></div>
            <div class="customised-range">
              <div id="rangeInp${innerData.attributeCode.replace(
                /\(|\)/g,
                ""
              )}"></div>
            </div>`
                : ``
            }
            
              </div></div>`;
              });
              $("#catfilter-head").html(catFilterdata);
              data?.attributes?.forEach((attributeName) => {
                if (attributeName.displayWidget === "refinementList") {
                  search.addWidget(
                    instantsearch.widgets.refinementList({
                      attribute: attributeName.webAttributeName.replace(
                        /,/g,
                        " -"
                      ),
                      container:
                        "#" + attributeName.attributeCode.replace(/\(|\)/g, ""),
                      sortBy: ["name:asc", "count:desc"],
                      limit: 100
                    })
                  );
                } else if (attributeName.displayWidget === "rangeSlider") {
                  search.addWidgets([
                    instantsearch.widgets.rangeSlider({
                      attribute: attributeName.webAttributeName.replace(
                        /,/g,
                        " -"
                      ),
                      container:
                        "#" + attributeName.attributeCode.replace(/\(|\)/g, ""),
                      pips: false,
                      tooltips: false,
                      precision: 6
                    }),
                    instantsearch.widgets.rangeInput({
                      container:
                        "#rangeInp" +
                        attributeName.attributeCode.replace(/\(|\)/g, ""),
                      attribute: attributeName.webAttributeName.replace(
                        /,/g,
                        " -"
                      ),
                      precision: 6
                    })
                  ]);
                  setInterval(function () {
                    let categId = attributeName.attributeCode.replace(
                      /\(|\)/g,
                      ""
                    );
                    let mainItem = $("#" + categId)
                      .parent(".accordion-item")
                      .children(".accordion-head")
                      .text()
                      .split(" Range")[0];

                    $(
                      '.ais-CurrentRefinements-list .ais-CurrentRefinements-label:contains("' +
                        mainItem +
                        ':")'
                    )
                      .parent()
                      .addClass("rangeRefinement-custom-new");

                    $(
                      '.ais-CurrentRefinements-list .ais-CurrentRefinements-label:contains("' +
                        mainItem +
                        ':")'
                    ).html("<span>" + mainItem + " Range" + ":</span>");
                  }, 200);
                }
              });
              // Facet Slection after page reload
              const level = catLevelSelection();
              let cateName,
                facetCollection = [],
                facetLevel = {};

              if (level === "hierarchicalCategories.lvl0") {
                cateName = [
                  categoryObject.rootCategory[0].category.categoryPath
                ];

                facetLevel["hierarchicalCategories.lvl0"] = [
                  categoryObject.rootCategory[0].category.categoryPath
                ];
                facetCollection.push("hierarchicalCategories.lvl0");
              } else if (level === "hierarchicalCategories.lvl1") {
                cateName = [
                  categoryObject.subCategoryData.categoryPath.replaceAll(
                    "|",
                    " > "
                  )
                ];

                facetCollection.push(
                  "hierarchicalCategories.lvl0",
                  "hierarchicalCategories.lvl1"
                );
                facetLevel["hierarchicalCategories.lvl0"] = [
                  categoryObject.rootCategory[0].category.categoryPath
                ];
                facetLevel["hierarchicalCategories.lvl1"] = [
                  categoryObject.subCategoryData.categoryPath.replaceAll(
                    "|",
                    " > "
                  )
                ];
              } else if (level === "hierarchicalCategories.lvl2") {
                cateName = [
                  categoryObject.subSubCategoryData.categoryPath.replaceAll(
                    "|",
                    " > "
                  )
                ];

                facetLevel["hierarchicalCategories.lvl0"] = [
                  categoryObject.rootCategory[0].category.categoryPath
                ];
                facetLevel["hierarchicalCategories.lvl1"] = [
                  categoryObject.subCategoryData.categoryPath.replaceAll(
                    "|",
                    " > "
                  )
                ];
                facetCollection.push(
                  "hierarchicalCategories.lvl0",
                  "hierarchicalCategories.lvl1",
                  "hierarchicalCategories.lvl2"
                );
                facetLevel["hierarchicalCategories.lvl2"] = [
                  categoryObject.subSubCategoryData.categoryPath.replaceAll(
                    "|",
                    " > "
                  )
                ];
              }

              search.addWidget(
                instantsearch.widgets.configure({
                  facetsRefinements: facetLevel,
                  facets: facetCollection
                })
              );
              if ($(".new__releases").length || $("#new-releases").length) {
                search.addWidget(
                  instantsearch.widgets.configure({
                    filters:
                      "isNew:true AND NOT categorySEOURL:/customized-products"
                  })
                );
              }

              var currentAttributes = [];
              const lvl0cat = "hierarchicalCategories.lvl0";
              const lvl1cat = "hierarchicalCategories.lvl1";
              const lvl2cat = "hierarchicalCategories.lvl2";
              const selectedPrice = "startingPrice";

              data?.attributes?.forEach((attributeName) => {
                // if (data.CategoryName === categoryName) {
                currentAttributes += attributeName.webAttributeName + ",";
                //}
              });
              if (currentAttributes.length > 0) {
                var arrSelected = currentAttributes.split(",");
                arrSelected.unshift(lvl0cat, lvl1cat, lvl2cat, selectedPrice);
                search.addWidget(
                  instantsearch.widgets.currentRefinements({
                    container: "#current-refinements",
                    includedAttributes: arrSelected
                  })
                );
              } else {
                var arrSelected = [];
                arrSelected.unshift(lvl0cat, lvl1cat, lvl2cat, selectedPrice);
                search.addWidget(
                  instantsearch.widgets.currentRefinements({
                    container: "#current-refinements",
                    includedAttributes: arrSelected
                  })
                );
              }
              //filter accordion
              $(".accordion-filter .accordion-head").on("click", function () {
                $(this).toggleClass("open").next().toggle(300);
              });
            }
            isAlreadySubCategory = false;
            // let categoryRoot = window.location.pathname.split("/category")[1].split("/");
            // let categoryRoot = window.location.pathname.split("/");

            if (
              data?.hasFacetAttribute == false &&
              $(".ais-RefinementList-checkbox:checked")
            ) {
              // Condition is false, make the second AJAX call

              $(
                "#lvl1-cat .ais-RefinementList-item--selected .ais-RefinementList-checkbox"
              ).each(function () {
                if ($(this).is(":checked")) {
                  $(".cat-filter").addClass("d-none");
                } else {
                  $(".cat-filter").removeClass("d-none");
                }
              });
              let subCate = encodeURIComponent(
                categoryObject?.subCategoryData?.name || cName
              );
              $.ajax({
                type: "POST",
                url: "/bin/GetPLPFilterAttributes",
                data: {
                  brandName: "FM",
                  bearertoken: window.getbearerToken(),
                  categoryName: subCate
                },
                success: function (data, status, xhr) {
                  // window.errorModule.checkError(data);
                  isAlreadyCall = false;
                  // Handle the second AJAX call response

                  plpFacetData(data);
                  customCurrentFilter();
                  if (data?.hasFacetAttribute == false) {
                    $(".lvl1-filter").removeClass("d-none");
                    $(".lvl1-filter .accordion-content").css(
                      "display",
                      "block"
                    );
                    $(
                      ".lvl1-filter .ais-RefinementList-labelText:not(:contains(" +
                        data.categoryName +
                        "))"
                    )
                      .closest(".ais-RefinementList-item")
                      .addClass("d-none");
                  } else {
                    $(".lvl1-filter").addClass("d-none");
                    $(".priceSlider")
                      .closest(".accordion-item")
                      .removeClass("d-none");
                  }
                },
                error: function (xhr, status, error) {
                  // Handle the second AJAX call error
                  if (xhr.statusCode === 404) {
                    console.log("An error occurred: " + error);
                  }
                  window.errorModule.showErrorPopup(error);
                }
              });
            } else {
              // Condition is true, handle the first AJAX call response
              plpFacetData(data);
              isAlreadyCall = false;
              customCurrentFilter();
            }
          },
          error: function (error) {
            window.errorModule.showErrorPopup(error);
          }
        });
      }
      /* End of Ajax call */
    }
    //custom codes for filter events
    $(
      ".accordion-content .ais-RefinementList--noRefinement, .accordion-content .ais-RangeSlider--disabled"
    )
      .parents(".accordion-item")
      .removeClass("d-none");
    customCurrentFilter();
    // Facet Sorting after dom load
    commonUtility().facetSorting();
    //End of custom codes for filter events
  }

  /* Dynamic edit parameter */
  function allSkuForFacets() {
    let currentURlId = document.querySelectorAll(".product-grid .orignal-sku");
    let filterTable = [];
    currentURlId.forEach((item) => {
      filterTable.push(item.innerHTML);
    });
    return filterTable;
  }
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

  function editParameters() {
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

          $("#plptable-head").find(`.${idString}`).length
            ? ""
            : $("#plptable-head").append(
                `<div class="pr-th-dv fixed-td ${idString} d-none"><span>${item}</span></div>`
              );

          $("#catfilter-popup").find(`#${idString}`).length
            ? ""
            : $("#catfilter-popup").append(
                `<div class="custom-column-checkbox"><div class="compare-box pos-relat"><input name="changeType" id="${idString}" class="compare-checkbox" value="${item}" type="checkbox" /><label for="${idString}"><span>${item}</span></label></div></div>`
              );
        });
        editParametersPopUpReading();
      } else {
        console.log("No Facets");
      }
    });
  }

  /* Edit parameter apply button */
  function editParametersPopUpReading() {
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
      editParametersPopUp();
    });
  }

  function editParametersPopUp() {
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
  /* Dynamic edit parameter */

  /* RF Cable assembly condition */
  const containsCableAssembly = (utilityMessage) => {
    let slugPart = utilityMessage?.labels?.cableAssemblies
      ? utilityMessage?.labels?.cableAssemblies
      : "rf-cable-assemblies";
    let cableAssembliesString = "/category/" + slugPart;
    let regEx = new RegExp(cableAssembliesString, "g");
    let pathMatch = regEx.test(location.pathname);
    return pathMatch;
  };

  /* Card from algolia */
  const mainHits = (utilityMessage) => {
    return instantsearch.widgets.hits({
      container: "#hits",
      templates: {
        item: (hit, bindEvent) => `
        <div class="product-grid ${hit.brandSKU.replace(/\//g, "-")}-filt">
    <div class="plp-viewcol-1">
    <div class="product-image-wrapper analyticplptrack">
    <input type="hidden" id="analyticproddetail" value="${
      hit.brandSKU +
      "@@" +
      hit.name +
      "@@" +
      hit.productId +
      "@@" +
      hit.unitPrice +
      "@@" +
      hit.startingPrice +
      "@@" +
      hit.length +
      "@@" +
      hit.color +
      "@@" +
      hit.bestSellerRank +
      "@@" +
      hit.inventory +
      "@@" +
      hit.category
    }">    
    <div class="product-image">
      <div class="tile-prod-labels">
      <span class="algolia-rohs">
    </span>
    ${
      hit.isOversized
        ? `<span class="label-new freight-label"><span class="fr-tool-tip">${utilityMessage?.labels?.freightDescription}<i class="fa-solid fa-caret-down"></i></span>${utilityMessage?.labels?.freightTitle}</span>`
        : ``
    }



    
      <span class="algolia-new">
    ${
      hit.isNew
        ? `<span class="label-new">${utilityMessage?.labels?.new}</span>`
        : ``
    }
    </span>
      </div>
    <a title="${hit.name}" data-object=${
          hit.objectID
        } class="store-obj url-class" ${bindEvent(
          "click",
          hit,
          "click on PLP Product"
        )} href="${SeoUrl(hit)}">
        <img id="plp-img" class="plp-img-src" src="${getImage(hit)}" alt="${
          hit.seoName ? hit.seoName : ""
        } ${brandName} ${hit.brandSKU ? hit.brandSKU : ""}">
     </a></div>
     <div class="label-title-wrapper">       
      <div class="algolia-product-labels">
            <span class="algolia-qty ct__qty data-loader">
  ${
    hit.isMasterCA == true || hit.isBlockedForSale == true
      ? ``
      : hit.inventory > 0
      ? `${formatNumber(hit.inventory)} ${utilityMessage?.labels?.available}`
      : containsCableAssembly(utilityMessage)
      ? ``
      : `<a class="call-link no-stock-label" href="tel:${utilityMessage?.labels?.contactNumber}" title="${utilityMessage?.labels?.contactNumber}">${utilityMessage?.labels?.callUs}</a>`
  }
  </span>	
     <span class="algolia-rohs">
   
  </span>
  ${
    hit.isOversized
      ? `<span class="label-new freight-label"><span class="fr-tool-tip">${utilityMessage?.labels?.freightDescription}<i class="fa-solid fa-caret-down"></i></span>${utilityMessage?.labels?.freightTitle}</span>`
      : ``
  }
     <span class="algolia-new">
  ${
    hit.isNew
      ? `<span class="label-new">${utilityMessage?.labels?.new}</span>`
      : ``
  }
  </span>
     </div>
     <h2 class="algolia-product-name"><a title="${
       hit.name
     }" class="store-obj url-class" data-object=${hit.objectID} ${bindEvent(
          "click",
          hit,
          "click on PLP Product"
        )} href="${SeoUrl(hit)}">${hit.name}</a></h2>
    </div>
    </div>
    <div class="algolia-datasheet analyticdatasheet ${
      getdataSheet(hit) ? `` : `item-hidden`
    }">
    <input type="hidden" id="analyticplpdatasheet" value="${
      hit.assets
        ? `${
            hit?.assets[0]?.name +
            "@@" +
            hit?.assets[0]?.type +
            "@@" +
            hit.name +
            "@@" +
            hit.category
          }`
        : `${"" + "@@" + "" + "@@" + hit.name + "@@" + hit.category}`
    }">
    <a title="${
      utilityMessage?.labels?.dataSheet
    }" target="_blank" href="${getdataSheet(
          hit
        )}"><i class="fa fa-file-text-o" aria-hidden="true"></i> ${
          utilityMessage?.labels?.dataSheet
        }</a></div>
    
    <div class="pr-td-dv-nw tab-compare analyticplpcompareproduct">
    <div class="compare-box-new ${
      hit.isMasterCA == true ? "d-none" : ""
    }"><input id="ID${hit.objectID.replace(
          /\//g,
          "-"
        )}" class="js-refinement-link input-checkbox" data-id="ID${hit.objectID.replace(
          /\//g,
          "-"
        )}" aria-label="ID${hit.objectID.replace(/\//g, "-")}" data-sku="${
          hit.brandSKU
        }" data-title="${hit.name}" data-alt="${
          hit.seoName ? hit.seoName : ""
        } ${brandName} ${
          hit.brandSKU ? hit.brandSKU : ""
        }" data-compare="${getImage(hit)}" type="checkbox" value="${
          hit.name + "@@" + hit.category + "@@" + hit.brandSKU
        }"><label for="ID${hit.objectID.replace(/\//g, "-")}">${
          utilityMessage?.labels?.Compare
        }</label></div>
    </div>    
                         
        <div class="pr-td-dv tab-title"><a title="${
          hit.name
        }" class="store-obj ellipsis-90" data-object=${
          hit.objectID
        } ${bindEvent("click", hit, "click on PLP Product")} href="${SeoUrl(
          hit
        )}">${hit.name}</a></div>
        <div class="pr-td-dv sticky-action">
       
        
        ${
          hit.inventory > 0 && hit.isSellable == false
            ? `<div class="nostock-actions-blue">
            <a title="${
              utilityMessage?.labels?.viewProduct
            }" class="more-btn-primary view-link" href="${SeoUrl(hit)}">${
                utilityMessage?.labels?.viewProduct
              }</a>
            </div>`
            : hit.inventory <= 0 && hit.isDiscontinued == true
            ? `<div class="nostock-actions-blue">
         <a title="${
           utilityMessage?.labels?.viewProduct
         }" class="more-btn-primary view-link" href="${SeoUrl(hit)}">${
                utilityMessage?.labels?.viewProduct
              }</a>
         </div>`
            : hit.isMasterCA == true || hit.isBlockedForSale == true
            ? `<div class="nostock-actions-blue">
            <a title="${
              utilityMessage?.labels?.viewProduct
            }" class="more-btn-primary view-link" href="${SeoUrl(hit)}">${
                utilityMessage?.labels?.viewProduct
              }</a>
            </div>`
            : `<a title="${utilityMessage?.labels?.addToCart}" ${bindEvent(
                "conversion",
                hit,
                utilityMessage?.labels?.addToCart
              )} class="add-cart-btn ccounter" href="Javascript:void(0)" onclick="addtocartSpecific(this);" data-cartqty="" data-sku="${
                hit.brandSKU
              }" data-currency="${
                hit.currencyCode ? hit.currencyCode : ""
              }" data-analyticcartprod="${
                hit.brandSKU +
                "@@" +
                hit.name +
                "@@" +
                hit.productId +
                "@@" +
                hit.unitPrice +
                "@@" +
                hit.startingPrice +
                "@@" +
                hit.length +
                "@@" +
                hit.color +
                "@@" +
                hit.bestSellerRank +
                "@@" +
                hit.inventory +
                "@@" +
                hit.category
              }">${utilityMessage?.labels?.addToCart}</a>`
        }
          
        </div>
        <div class="pr-td-dv tab-quant ct__qty">
        ${
          hit.isMasterCA == true || hit.isBlockedForSale == true
            ? ``
            : hit.inventory > 0
            ? `${formatNumber(hit.inventory)}`
            : `<a class="font-weight-bold call-link" href="tel:${utilityMessage?.labels?.contactNumber}" title="${utilityMessage?.labels?.contactNumber}">${utilityMessage?.labels?.callUs}</a>`
        }</div>
        <div class="pr-td-dv tab-sku">${hit.brandSKU}</div>
        <div class="pr-td-dv tab-price">${
          hit.startingPrice
            ? `<span class="label-value ct__price data-loader"><i>$</i>${formatPrice(
                hit.startingPrice
              )}</span>`
            : `<span class="label-value">NA</span>`
        }</div>
        <div class="pr-td-dv shipment-date"></div>
        
    </div>
    
    <div class="plp-viewcol-2 plp-actions">
    <div class="sku-label"><span class="label-txt">SKU</span><span class="label-value orignal-sku">${
      hit.brandSKU
    }</span> <span class="label-value newSelected-sku">${
          hit.baseItemSKU +
          "/<span class='colorsku'>" +
          hit.defaultColor +
          "</span>-<span class='lengthsku'>" +
          hit.length +
          "</span>"
        }</span></div>
    <div class="price-label">
    <span class="label-txt">${utilityMessage?.labels?.startingPrice}</span>
  ${
    hit.startingPrice
      ? `<span class="label-value ct__price"><i>$</i>${formatPrice(
          hit.startingPrice
        )}</span>`
      : `<span class="label-value"></span>`
  }
    </div>
    <div class="delivery-label"><span class="label-txt">${
      utilityMessage?.labels?.estimatedShipmentPlp
    }</span> <span class="label-value shipment-date"></span></div>
    
  ${
    hit.inventory > 0 && hit.isSellable == false
      ? `<div class="view-product-div">
      <a title="${
        utilityMessage?.labels?.viewProduct
      }" class="view-products cart-button store-obj" href="${SeoUrl(hit)}">${
          utilityMessage?.labels?.viewProduct
        }</a>
      </div>`
      : hit.inventory <= 0 && hit.isDiscontinued == true
      ? `<div class="view-product-div">
    <a title="${
      utilityMessage?.labels?.viewProduct
    }" class="view-products cart-button store-obj" href="${SeoUrl(hit)}">${
          utilityMessage?.labels?.viewProduct
        }</a>
    </div>`
      : hit.isMasterCA == true || hit.isBlockedForSale == true
      ? `<div class="view-product-div">
      <a title="${
        utilityMessage?.labels?.viewProduct
      }" class="view-products cart-button store-obj" href="${SeoUrl(hit)}">${
          utilityMessage?.labels?.viewProduct
        }</a>
      </div>`
      : `<div class="add-to-cart">
      <div class="qty">
    <button class="cart-qty-minus" onclick="addminus(this);" type="button"><span class="dec-val"> - </span></button>
    <input type="text" class="qty_num" name="qty_num" aria-label="inp-${hit.objectID.replace(
      /\//g,
      "-"
    )}" value="1"  oninput="changeQuantityAttribute(this)" onblur="checkValidationQuantity(this)"/>
    <button  class="cart-qty-plus" onclick="addplus(this);" type="button"><span class="inc-val"> + </span></button>
    </div>
    <button ${bindEvent(
      "conversion",
      hit,
      utilityMessage?.labels?.addToCart
    )} type="button" title="Add to Cart" class="cart-button add_to_cart" onclick="addtocartSpecific(this);"  data-cartqty="" data-analyticcartprod="${
          hit.brandSKU +
          "@@" +
          hit.name +
          "@@" +
          hit.productId +
          "@@" +
          hit.unitPrice +
          "@@" +
          hit.startingPrice +
          "@@" +
          hit.length +
          "@@" +
          hit.color +
          "@@" +
          hit.bestSellerRank +
          "@@" +
          hit.inventory +
          "@@" +
          hit.category
        }" data-sku="${hit.brandSKU}" data-currency="${
          hit.currencyCode ? hit.currencyCode : ""
        }">${utilityMessage?.labels?.addToCart}</button>
          </div>`
  }
     
    
    
     

    </div>
    </div>
        `
      }
    });
  };
  const priceCurrentRefinement = () => {
    return instantsearch.widgets.currentRefinements({
      container: "#current-refinements",
      includedAttributes: "startingPrice"
    });
  };

  const productCompare = () => {
    //get all the products
    var $selectedProductsListing = $("#compare-products");
    function compCounter() {
      var itemLength = $selectedProductsListing.find("li").length;
      $("p.compare-text").text(
        itemLength == 0
          ? +itemLength + " of 4 items"
          : +itemLength + " of 4 items"
      );

      if (itemLength > 0) {
        $(".compare-sec").addClass("show");
        $("#main-header.cmp-container.fm-main-container").addClass("no-shadow");
      } else {
        $(".compare-sec").removeClass("show");
        $("#main-header.cmp-container.fm-main-container").removeClass(
          "no-shadow"
        );
      }
      if ($(this).is(":checked")) {
        $(this)
          .closest(".search-panel.card-view .ais-Hits-item")
          .addClass("compare-checked");
        $(this)
          .closest(".search-panel.tile-view .ais-Hits-item")
          .addClass("compare-checked");
        $(this)
          .closest(".search-panel.table-view .ais-Hits-item")
          .addClass("compare-checked");
      } else {
        $(this)
          .closest(".search-panel.card-view .ais-Hits-item")
          .removeClass("compare-checked");
        $(this)
          .closest(".search-panel.tile-view .ais-Hits-item")
          .removeClass("compare-checked");
        $(this)
          .closest(".search-panel.table-view .ais-Hits-item")
          .removeClass("compare-checked");
      }
    }

    function deleteThumb() {
      $(".delete-cross").on("click", function () {
        let deleteSku = $(this).data("sku");
        let deleteThumbPath = $(this).data("compare");
        let mydataID = $(this).data("id");
        let inputMydataID = $("input#" + mydataID);
        var compStorage = JSON.parse(localStorage.getItem("compArr"));
        compStorage.forEach((itemId, index) => {
          if (itemId == deleteSku) {
            compStorage.splice(index, 1);
          }
          localStorage.setItem("compArr", JSON.stringify(compStorage));
        });

        var compStorageImage = JSON.parse(localStorage.getItem("compImgPath"));

        compStorageImage.forEach((itemId, index) => {
          if (itemId == deleteThumbPath) {
            compStorageImage.splice(index, 1);
          }
          localStorage.setItem("compImgPath", JSON.stringify(compStorageImage));
        });

        $(".rem_ID" + deleteSku)
          .parent()
          .remove();
        if (inputMydataID.length > 0 && compStorage.length <= 4) {
          $(mydataID).prop("checked", true).click();
        } else {
          $(".js-refinement-link.input-checkbox").removeAttr("disabled");
        }

        compCounter();
      });
    }

    var compareSku = [];
    try {
      var pmode = JSON.parse(localStorage.getItem("compArr"));
      if (!Array.isArray(pmode)) {
        pmode = [];
      }
      localStorage.setItem("compArr", JSON.stringify(pmode));
      compareSku = Object.values(pmode);

      var thumbStore = JSON.parse(localStorage.getItem("compImgPath"));

      if (!Array.isArray(thumbStore)) {
        thumbStore = [];
      }
      let compareImagePath = Object.values(thumbStore);

      $("#compare-products li").remove();

      compareSku.forEach((itemId, index) => {
        if (
          search?.renderState[indexForFilter]?.hits?.hits.length ||
          $("#algolia-data-ssr").length > 0
        ) {
          let compSkuId = itemId.replace(/\//g, "-");
          const itemImage = compareImagePath[index];

          $("input[type='checkbox']#ID" + compSkuId).prop("checked", true);

          var compareImg;
          var inputId = "input[type='checkbox']#ID" + compSkuId;
          var deleteId = "ID" + compSkuId;
          var compImgPath = $(inputId).data("compare");

          var imgTitle = $(inputId).data("title");
          var imgAlt = $(inputId).data("alt");
          compareImg = `<img alt='${imgAlt}' title='${imgTitle}' src='${itemImage}'>`;

          $("p.compare-text").text(
            compareSku.length == 0
              ? "No item"
              : +compareSku.length + " of 4 items"
          );
          var selecteditems = new Array();
          $("#compare-products li").each(function (index) {
            selecteditems.push($(this).attr("id"));
          });

          $($selectedProductsListing).append(
            '<li class="checked-items ' +
              deleteId +
              '" id="' +
              deleteId +
              '"><button  title="Close" class="delete-cross rem_' +
              deleteId +
              '" data-id="' +
              deleteId +
              '" data-compare="' +
              itemImage +
              '" data-sku="' +
              compSkuId +
              '">' +
              inputId +
              "</button>" +
              compareImg +
              "</li>"
          );

          $(inputId)
            .closest(".search-panel.card-view .ais-Hits-item")
            .addClass("compare-checked");
          $(inputId)
            .closest(".search-panel.tile-view .ais-Hits-item")
            .addClass("compare-checked");
          $(inputId)
            .closest(".search-panel.table-view .ais-Hits-item")
            .addClass("compare-checked");

          if (compareSku.length >= 4) {
            $(".js-refinement-link.input-checkbox").each(function () {
              if ($(this).is(":checked")) {
                $(this).removeAttr("disabled");
              } else {
                $(this).attr("disabled", true);
              }
            });
          } else {
            $(".js-refinement-link.input-checkbox").each(function () {
              if ($(this).is(":checked")) {
                $(this).removeAttr("disabled");
              } else {
                $(this).removeAttr("disabled");
              }
            });
          }

          $(".js-refinement-link.input-checkbox").each(function (index) {
            var mydataID = $(this).data("id");

            $(document).on("click", ".rem_" + mydataID, function () {
              $('.compare-box-new input[type="checkbox"]#' + mydataID)
                .prop("checked", true)
                .click();
            });

            compCounter();
          });
        }
      });

      if (compareSku.length > 0) {
        $(".compare-sec").addClass("show");
        $("#main-header.cmp-container.fm-main-container").addClass("no-shadow");
      } else {
        $(".compare-sec").removeClass("show");
        $("#main-header.cmp-container.fm-main-container").removeClass(
          "no-shadow"
        );
      }

      if (compareSku.length == 1) {
        $(".compare-title .compare-btn").addClass("hide");
      } else {
        $(".compare-title .compare-btn").removeClass("hide");
      }
    } catch (error) {
      console.log(error);
    }

    //remove thumb function
    deleteThumb();

    $(".js-refinement-link.input-checkbox").on("change", function (event) {
      const $checkbox = $(event.target);
      $("#compare-products li").remove();
      const value = $checkbox.data("sku");
      const imagePath = $checkbox.data("compare");
      try {
        var pmode = JSON.parse(localStorage.getItem("compArr"));
        if (!Array.isArray(pmode)) {
          pmode = [];
        }
        //uncheck boxes
        var mydataID = $(this).data("id");
        $(document).on("click", ".rem_" + mydataID, function () {
          $('.compare-box-new input[type="checkbox"]#' + mydataID)
            .prop("checked", true)
            .click();
        });
        //set storage for thumb image path
        var thumbStore = JSON.parse(localStorage.getItem("compImgPath"));
        if (!Array.isArray(thumbStore)) {
          thumbStore = [];
        }

        if ($checkbox.is(":checked")) {
          if (!pmode.includes(value)) {
            pmode.push(value);
          }
          thumbStore.push(imagePath);
        } else {
          const index = pmode.indexOf(value);
          if (index > -1) {
            pmode.splice(index, 1);
          }
          const thumbIndex = thumbStore.indexOf(imagePath);
          if (thumbIndex > -1) {
            thumbStore.splice(thumbIndex, 1);
          }
        }
        localStorage.setItem("compArr", JSON.stringify(pmode));
        compareSku = Object.values(pmode);

        let uniqThumb = [...new Set(thumbStore)];

        localStorage.setItem("compImgPath", JSON.stringify(uniqThumb));

        let compareImagePath = Object.values(uniqThumb);

        if (compareSku.length > 0) {
          $(".compare-sec").addClass("show");
          $("#main-header.cmp-container.fm-main-container").addClass(
            "no-shadow"
          );
        } else {
          $(".compare-sec").removeClass("show");
          $("#main-header.cmp-container.fm-main-container").removeClass(
            "no-shadow"
          );
        }

        if (compareSku.length == 1) {
          $(".compare-title .compare-btn").addClass("hide");
        } else {
          $(".compare-title .compare-btn").removeClass("hide");
        }

        if (compareSku.length >= 4) {
          $(".js-refinement-link.input-checkbox").each(function () {
            if ($(this).is(":checked")) {
              $(this).removeAttr("disabled");
            } else {
              $(this).attr("disabled", true);
            }
          });
        } else {
          $(".js-refinement-link.input-checkbox").each(function () {
            if ($(this).is(":checked")) {
              $(this).removeAttr("disabled");
            } else {
              $(this).removeAttr("disabled");
            }
          });
        }

        $(".js-refinement-link.input-checkbox").each(function () {
          if ($(this).is(":checked")) {
            $(this)
              .closest(".search-panel.card-view .ais-Hits-item")
              .addClass("compare-checked");
            $(this)
              .closest(".search-panel.tile-view .ais-Hits-item")
              .addClass("compare-checked");
            $(this)
              .closest(".search-panel.table-view .ais-Hits-item")
              .addClass("compare-checked");
          } else {
            $(this)
              .closest(".search-panel.card-view .ais-Hits-item")
              .removeClass("compare-checked");
            $(this)
              .closest(".search-panel.tile-view .ais-Hits-item")
              .removeClass("compare-checked");
            $(this)
              .closest(".search-panel.table-view .ais-Hits-item")
              .removeClass("compare-checked");
          }
        });

        //only return those that are checked
        compareSku.forEach((itemId, index) => {
          let compSkuId = itemId.replace(/\//g, "-");
          const itemImage = compareImagePath[index];

          var compareImg;
          var inputId = "ID" + compSkuId;

          var imgTitle = $("#" + inputId).data("title");
          var imgAlt = $("#" + inputId).data("alt");
          compareImg = `<img alt='${imgAlt}' title='${imgTitle}' src='${itemImage}'>`;
          $("p.compare-text").text(
            compareSku.length == 0
              ? "No item"
              : +compareSku.length + " of 4 items"
          );

          $($selectedProductsListing).append(
            '<li class="checked-items ' +
              inputId +
              '" id="' +
              inputId +
              '"><button  title="Close" class="delete-cross rem_' +
              inputId +
              '" data-id="' +
              inputId +
              '" data-compare="' +
              itemImage +
              '" data-sku="' +
              compSkuId +
              '">' +
              inputId +
              "</button>" +
              compareImg +
              "</li>"
          );
        });
        deleteThumb();
      } catch (error) {
        console.log(error);
      }
    });
  };

  const createObjArr = () => {
    $(".store-obj").each(function (index) {
      $(this).on("click", function () {
        const clickedSku = $(this).data("object");
        if (clickedSku !== null && clickedSku !== undefined) {
          const storedSkus =
            JSON.parse(localStorage.getItem("rviewsArray")) || [];
          storedSkus.push(clickedSku);
          localStorage.setItem("rviewsArray", JSON.stringify(storedSkus));
        } else {
          console.error("SKU is null or undefined");
        }
      });
    });
  };

  const ctPriceInventoryPlp = (utilityMessage) => {
    let jsonDataVar, skuArr, updatedProductList, results;
    skuArr = readSkus(".ais-Hits-list .orignal-sku");
    jsonDataVar = {
      query:
        'query Products($skus: [String!]!){productProjectionSearch(limit: 500, offset: 0,staged: false,filters:[{model:{value:{path:"variants.sku",values: $skus}}}]){results{masterVariant {sku attributesRaw(includeNames:["startingPrice"]){name value}availability{noChannel{availableQuantity}}}}}}',
      variables: {
        skus: skuArr
      }
    };
    $.ajax({
      type: $.fn.getAPIEndpoint().requestType.POST,
      url: $.fn.getAPIEndpoint().PLP_PRICE_INVENTORY,
      data: {
        bearerToken: window.getbearerToken(),
        jsonData: JSON.stringify(jsonDataVar)
      },
      success: function (response, textstatus, xhr) {
        if (xhr.status == 200 && response.statusCode != 404) {
          results = response?.data?.productProjectionSearch?.results;
          updatedProductList = appendPriceInventory(
            skuArr,
            results,
            utilityMessage,
            "ct__price",
            "ct__qty"
          );
        }
      },
      error: function (error) {
        window.errorModule.showErrorPopup(error);
      }
    });
  };

  //function to read sku value from page
  const readSkus = (selector) => {
    let valueArr = [];
    $(selector).each((index, element) => {
      const sku = $(element).text().trim();
      if (sku) {
        valueArr.push(sku);
      }
    });
    return valueArr;
  };

  //append price inventory from CT
  const appendPriceInventory = (
    valueArr,
    response,
    utilityMessage,
    priceClass,
    inventoryClass
  ) => {
    let matchingProduct;
    valueArr.forEach((sku) => {
      matchingProduct = response.find(
        (item) => item.masterVariant?.sku === sku
      );
      if (matchingProduct) {
        let startingPrice, inventoryCT, priceKey, inventoryKey, formattedPrice;
        priceKey =
          matchingProduct.masterVariant?.attributesRaw !== null
            ? matchingProduct.masterVariant?.attributesRaw[0]?.value
            : `NA`;
        formattedPrice =
          matchingProduct.masterVariant?.attributesRaw.length > 0
            ? window.priceFormate.formatPrice(priceKey)
            : `NA`;
        inventoryKey = matchingProduct.masterVariant?.availability?.noChannel;
        startingPrice =
          priceKey !== null && priceKey !== undefined
            ? `$${formattedPrice}`
            : `NA`;
        inventoryCT =
          inventoryKey !== null && inventoryKey?.availableQuantity > 0
            ? `${formatNumber(inventoryKey?.availableQuantity)} <i>${
                utilityMessage?.labels?.available
              }</i>`
            : `<a class="call-link no-stock-label" href="tel:${utilityMessage?.labels?.contactNumber}" title="${utilityMessage?.labels?.contactNumber}">${utilityMessage?.labels?.callUs}</a>`;
        $(
          `.ais-Hits-list .${sku.replace(/\//g, "-")}-filt .${priceClass}`
        ).html(`${startingPrice}`);
        $(
          `.ais-Hits-list .${sku.replace(/\//g, "-")}-filt .${inventoryClass}`
        ).html(`${inventoryCT}`);
        $(`.${inventoryClass}, .${priceClass}`).removeClass("data-loader");
      }
    });
  };

  /* All functions using in algolia */
  let RenderHandler = function onRenderHandler() {
    // your jquery function you want to run
    $(document).ready(function () {
      inventoryCheck();
      $algoliaWidget.createObjArr();
      charLimit();
      customPlpFilter();
      //addToCompare();
      $algoliaWidget.productCompare();
      variantAccordion();
      categoryFilter();
      filterTableAll();
      priceSelectionFormat();
    });

    function priceSelectionFormat() {
      setInterval(function () {
        $(
          '.ais-CurrentRefinements-list .ais-CurrentRefinements-label:contains("StartingPrice:")'
        )
          .parent()
          .addClass("rangeRefinement-custom-new price-range-text");
        $(
          '.ais-CurrentRefinements-list .ais-CurrentRefinements-label:contains("StartingPrice:")'
        ).html("<span class='priceColor'>" + "Price Range" + ":</span>");
      }, 200);
      customCurrentFilter();
    }

    function categoryFilter() {
      $("#brand-list .ais-RefinementList")
        .closest(".accordion-item")
        .removeClass("d-none");
      //$("#catfilter-head").addClass("d-none");

      //hide empty accordion
      $(
        "#brand-list .ais-RefinementList-item--selected .ais-RefinementList-checkbox"
      ).each(function () {
        if ($(this).is(":checked")) {
          $(".cat-filter").addClass("d-none");
        } else {
          $(".cat-filter").removeClass("d-none");
        }
      });

      $(
        "#lvl1-cat .ais-RefinementList-item--selected .ais-RefinementList-checkbox"
      ).each(function () {
        if ($(this).is(":checked")) {
          $(".lvl1-filter").addClass("d-none");
        } else {
          $(".lvl1-filter").removeClass("d-none");
        }
      });

      $(
        "#brand-list .ais-RefinementList-item--selected .ais-RefinementList-checkbox"
      ).each(function () {
        if ($(this).is(":checked")) {
          $(".cat-filter").addClass("d-none");
          $("#catfilter-head").removeClass("d-none");
          $(".edit-param").removeClass("d-none");
        }
      });

      const isCategory = commonUtility().isCategoryInURL();
      $("#clear-refinements button").on("click", function () {
        if (isCategory) {
          const urlParts = location.href.match(/^(.*?)\/category/);
          const baseUrl = `${urlParts ? urlParts[1] : location.href}/`;
          window.location.href = baseUrl + "category/all.html";
        } else {
          window.location.href = location.pathname;
        }
      });
      $(".ais-CurrentRefinements .ais-CurrentRefinements-delete").on(
        "click",
        function (event) {
          if (isCategory) {
            commonUtility().removeSelectedFacet(event);
          } else {
            let hasCategoryLevel =
              commonUtility().checkSelectedFacetLevel(event);
            if (hasCategoryLevel > -1) {
              window.location.href = location.pathname;
            }
          }
        }
      );
    }

    function inventoryCheck() {
      $(".ais-Hits-item")
        .find(".no-stock-label")
        .parents(".ais-Hits-item")
        .addClass("out-of-stock");
      let shipDate = (document.getElementById("shipmentDate").innerHTML =
        estimatedShipment.getEstimatedShipmentDate());
      $(".shipment-date").each(function () {
        $(this).html(shipDate);
      });
    }
    //setting char limit 90 in table view product name

    function charLimit() {
      let maxName = 90;

      $(".pr-td-dv .ellipsis-90").each(function () {
        let namechar = $(this).text();

        if (namechar.length > maxName) {
          let beginTitle = namechar.substr(0, maxName);

          $(this).html(beginTitle).append($("<span />").html("..."));
        }
      });
    }
    function customPlpFilter() {
      $(".rheostat-marker-large:eq(1)").css("display", "none");
      $(".rheostat-marker-large:eq(0)").css("left", "36px");
      $(".rheostat-marker-large:eq(2)").addClass("right-calc");
    }

    function variantAccordion() {
      $(".variant-title").click(function () {
        $(this).toggleClass("open").next().toggle(300);
        $(this).parent().toggleClass("heightAuto");
      });
    }

    //end function

    function filterTableAll() {
      setTimeout(function () {
        let currentURlId = document.querySelectorAll(
          ".pop-filter-flex input[type='checkbox']"
        );
        let selectedCheck = [];
        currentURlId.forEach((item) => {
          if (item.checked === true) {
            selectedCheck.push(item.id);
          }
        });
        selectedCheck.forEach((item) => {
          $("." + item).removeClass("d-none");
        });
      }, 1000);
    }
    //view switcher
    let switchSelector = $(".plp-product-list .search-panel");
    function clearView() {
      $(switchSelector).removeClass("tile-view card-view table-view");
      $(".plp-product-list").removeClass("table-view-wrapper");
    }

    $(function () {
      $(".tile-view-button").click(function () {
        $(".plp-view-mode > div").removeClass("active");
        $(this).addClass("active");
        //border on select checkbox
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
      });
    });
  };

  window.$algoliaWidget = {
    renderPagination,
    renderPagination2,
    renderStats1,
    categoriesList,
    categoriesListLevelOne,
    categoriesListLevelTwo,
    priceRangeSlider,
    categoriesIsNew,
    clearRefinements,
    clearRefinementsMobile,
    sortWidgetBestseller,
    sortWidget,
    hitsPerPage,
    hitsPerPageBestSeller,
    hitPerPageTop,
    hitPerPageBottom,
    hitPerPageMobile,
    statsTop,
    statsSearchTop,
    statsMobile,
    statsBottom,
    statsSearchBottom,
    statsTitle,
    searchFilter,
    editParameters,
    mainHits,
    priceCurrentRefinement,
    RenderHandler,
    isSellable,
    priceRangeInput,
    isSearchable,
    facetDisplay,
    editParametersPopUp,
    editParametersPopUpReading,
    productCompare,
    createObjArr,
    formatPrice,
    ctPriceInventoryPlp
  };
})();
