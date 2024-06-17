var commonUtility = function () {
  const D_NONE = "d-none";
  function dateFormate(dateFromCT, isDay) {
    if (!dateFromCT) {
      return "00:00:00";
    }
    const monObj = {
      0: "January",
      1: "February",
      2: "March",
      3: "April",
      4: "May",
      5: "June",
      6: "July",
      7: "August",
      8: "September",
      9: "October",
      10: "November",
      11: "December"
    };
    const DAYS = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ];

    let calDate = new Date(dateFromCT),
      date = calDate.getDate(),
      month = calDate.getMonth(),
      day = calDate.getDay(),
      monthName = monObj[month],
      year = calDate.getFullYear();
    if (isDay) {
      return DAYS[day - 1] + ", " + monthName + " " + date + ", " + year;
    }
    return monthName + " " + date + ", " + year;
  }

  function dateFormat_mmddyyyy(date) {
    const month = [
      "",
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    date = date.split("");
    let dateArray = [
      date.slice(0, 4).join(""),
      date.slice(4, 6).join(""),
      date.slice(6, 8).join("")
    ];
    return (
      month[parseInt(dateArray[1])] +
      " " +
      parseInt(dateArray[2]) +
      ", " +
      dateArray[0]
    );
  }
  // Filter Data which not included in "WireTransfer_HandlingCharge"
  function responseFilter(totalLineItemsData) {
    const filterArray = ["WireTransfer_HandlingCharge"];
    if (!totalLineItemsData) {
      return;
    }
    return totalLineItemsData.filter(function (data) {
      if (data && data.slug) {
        return !filterArray.includes(data.slug);
      }
      return { ...data };
    });
  }

  function getSkuId(productDetails) {
    return (
      productDetails?.variant?.sku ||
      productDetails?.custom?.fields?.sku ||
      productDetails?.custom?.fields?.masterSku ||
      getSkuFromSlug(productDetails.slug)
    );
  }
  function getSkuIdWithoutLength(productDetails) {
    return (
      productDetails?.variant?.sku ||
      productDetails?.custom?.fields?.masterSku ||
      productDetails?.custom?.fields?.sku ||
      getSkuFromSlug(productDetails.slug)
    );
  }

  function getSkuFromSlug(productSlug) {
    let slugArray = productSlug.split("_");
    slugArray.shift();
    return slugArray.join("_");
  }

  //function for getting country name from country code from countrylist json
  function getCountryNameFromCountryJSON(countryList, countryCode) {
    for (let country of countryList) {
      if (country.ISO === countryCode) {
        return country.name;
      }
    }
    return "";
  }
  // check category level from url
  function categoryLevelCheckFromURL() {
    const pathnameMatches = location.pathname.match(/category\/(.*?)\/?$/);

    if (
      pathnameMatches !== null &&
      pathnameMatches[0].indexOf("all.html") < 0
    ) {
      let pathName = pathnameMatches[1].split("/");
      if (pathName && pathName.length > -1) {
        return pathName.length;
      }
    }
  }
  // Extract Category Level from URL
  function getCategoryLevelFromURL() {
    let categoryName = {};
    const pathnameMatches = location.pathname.match(/category\/(.*?)\/?$/);

    if (
      pathnameMatches !== null &&
      pathnameMatches[0].indexOf("all.html") < 0
    ) {
      let pathName = pathnameMatches[1].split("/");
      if (pathName && !pathName.length) {
        return;
      }
      if (pathName.length === 1) {
        categoryName.level0 = pathName[0].split(".html")[0] || "";
      } else if (pathName.length === 2) {
        categoryName.level0 = pathName[0].split(".html")[0] || "";
        categoryName.level1 = pathName[1].split(".html")[0] || "";
      } else if (pathName.length === 3) {
        categoryName.level0 = pathName[0].split(".html")[0] || "";
        categoryName.level1 = pathName[1].split(".html")[0] || "";
        categoryName.level2 = pathName[2].split(".html")[0] || "";
      }

      return categoryName;
    }
  }

  //check level of selected facets
  function checkSelectedFacetLevel(event) {
    const LEVEL0 = "HierarchicalCategories.lvl0:",
      LEVEL1 = "HierarchicalCategories.lvl1:",
      LEVEL2 = "HierarchicalCategories.lvl2:";
    let level;
    let $currentEvent = $(event.currentTarget);
    let facetContent = $currentEvent
      .parents(".ais-CurrentRefinements-item")
      .find(".ais-CurrentRefinements-label")
      .text();
    if (facetContent === LEVEL0) {
      level = 0;
    } else if (facetContent === LEVEL1) {
      level = 1;
    } else if (facetContent === LEVEL2) {
      level = 2;
    }
    return level;
  }

  // removeSelectedFacet
  function removeSelectedFacet(event) {
    const urlParts = location.href.match(/^(.*?)\/category/);
    const baseUrl = `${urlParts ? urlParts[1] : location.href}/`;
    const categoryLevel = getCategoryLevelFromURL();
    const categoryFacetLevel = checkSelectedFacetLevel(event);
    if (categoryFacetLevel === 2) {
      window.location.href = `${baseUrl}category/${categoryLevel.level0}/${categoryLevel.level1}.html`;
    } else if (categoryFacetLevel === 1) {
      window.location.href = `${baseUrl}category/${categoryLevel.level0}.html`;
    } else if (categoryFacetLevel === 0) {
      window.location.href = `${baseUrl}category/all.html`;
    }
  }

  // Store Category Name in Cookies based on URL category level
  function getCategoryLevel() {
    let categoryLevel;
    const pathnameMatches = location.pathname.match(/category\/(.*?)\/?$/);

    if (
      pathnameMatches !== null &&
      pathnameMatches[0].indexOf("all.html") < 0
    ) {
      let pathName = pathnameMatches[1].split("/");
      if (pathName && !pathName.length) {
        return;
      }
      if (pathName.length === 1) {
        categoryLevel = pathName[0].split(".html")[0] || "";
      } else if (pathName.length === 2) {
        categoryLevel = pathName[1].split(".html")[0] || "";
      } else if (pathName.length === 3) {
        categoryLevel = pathName[2].split(".html")[0] || "";
      }

      return categoryLevel;
    }
  }

  // check if category in URL Exist
  function isCategoryInURL() {
    const pathnameMatches = location.pathname.match(/category\/(.*?)\/?$/);
    return pathnameMatches === null ? false : true;
  }

  // categoryFacet Select URL Update
  function categoryFacetSeoUrl(
    categoryFacetValue,
    response,
    isSubCategory,
    data
  ) {
    let categoryFacet = categoryFacetValue;
    const categoryObject = data ? data : [];
    if (!categoryObject && !categoryFacetValue) {
      return;
    }
    if (isSubCategory && categoryFacetValue.trim().indexOf(">") > -1) {
      categoryFacet = categoryFacetValue.trim().replace(" > ", "|");
    } else {
      categoryFacet = categoryFacetValue;
    }
    const selectedSeoName = categoryObject.filter((category) => {
      if (isSubCategory && category.category.childCategories !== null) {
        return category.category.childCategories.find((subCategory) => {
          return subCategory.categoryPath === categoryFacet;
        });
      } else {
        return category.category.name === categoryFacet;
      }
    });
    const subCategory = selectedSeoName[0].category.childCategories.find(
      (subCategory) => {
        return subCategory.categoryPath === categoryFacet;
      }
    );
    const urlParts = location.href.match(/^(.*?)\/category/);
    const baseUrl = `${urlParts ? urlParts[1] : location.href}/`;
    if (!isSubCategory && !subCategory) {
      window.location.href = `${baseUrl}category/${selectedSeoName[0].category.seoName}.html`;
    } else {
      window.location.href = `${baseUrl}category/${subCategory.categorySeoUrl.replace(
        "|",
        "/"
      )}.html`;
    }
  }

  // category match
  function categoryMatch(categoryData) {
    if (!categoryData) {
      return;
    }
    let hasCategoryLevelCount = categoryLevelCheckFromURL();
    if (!hasCategoryLevelCount && hasCategoryLevelCount < -1) {
      return;
    }

    let rooLevelCategory = commonUtility().getCategoryLevelFromURL() || "";
    if (!rooLevelCategory) {
      return;
    }

    let datObjects = {},
      subCategoryData,
      subSubCategoryData;
    const rootCategory = categoryData.filter((category) => {
      return category.category.seoName === rooLevelCategory.level0;
    });

    if (rootCategory && rootCategory[0].category.childCategories !== null) {
      subCategoryData = rootCategory[0].category.childCategories.find(
        (subCategory) => {
          return subCategory.seoName === rooLevelCategory.level1;
        }
      );
    }
    if (subCategoryData && subCategoryData.childCategories !== null) {
      subSubCategoryData = subCategoryData.childCategories.find(
        (subSubCategory) => {
          return subSubCategory.seoName === rooLevelCategory.level2;
        }
      );
    }

    datObjects = { rootCategory, subCategoryData, subSubCategoryData };
    return datObjects;
  }

  // dynamicURL create with HOST Name
  function dynamicURLUpdate() {
    const $contentLink = $(".content__link");
    if (!$contentLink.length) {
      return;
    }
    const originHost = window.location.origin;
    $contentLink.map((index, $link) => {
      const $element = $($link),
        URL = $element.attr("data-href");
      $element.attr("href", `${originHost}${URL}`);
    });
  }

  // Expired Time sets in cookies
  function customerInfoTTL(loginResponse, isRememberMe) {
    let now = new Date();
    let time = now.getTime();
    let hour = loginResponse?.tokenExpiryInMillis / (1000 * 60 * 60) || 48;
    let expireTime = time + 1000 * 60 * 60 * hour;
    now.setTime(expireTime);
    let expires = "expires=" + now.toUTCString();
    document.cookie =
      "customerInfo=" +
      JSON.stringify(loginResponse) +
      ";" +
      expires +
      ";path=/;";
    if (loginResponse.refreshToken && isRememberMe) {
      let now = new Date();
      let time = now.getTime();
      let expireTime = time + 1000 * 60 * 60 * 4800; // 200 Days  = 4800

      now.setTime(expireTime);
      let expires = "expires=" + now.toUTCString();
      document.cookie =
        "refreshToken=" +
        loginResponse.refreshToken +
        ";" +
        expires +
        ";path=/;";
    }
  }

  /**
   * facetSorting();
   * @returns
   */
  function facetSorting() {
    let numberStore = [],
      alphabetStore = [],
      mergeArray,
      validateaddress = /^[0-9-]/,
      pattern = /^\d+\.?\d*$/;
    const REFINEMENT_CLASS_SELECTOR = ".ais-RefinementList-labelText",
      accordionItems = document.querySelectorAll(".accordion-item");
    if (!accordionItems.length) {
      return;
    }
    accordionItems.forEach((list) => {
      const refinementList = list.querySelectorAll(".ais-RefinementList-list");
      if (!refinementList.length) {
        return;
      }

      refinementList.forEach(function (target) {
        numberStore.length = 0;
        alphabetStore.length = 0;
        // Sorting
        const listSelector = target.querySelectorAll(
          ".ais-RefinementList-item"
        );

        listSelector.forEach(function (item) {
          if (
            validateaddress.test(
              item.querySelector(REFINEMENT_CLASS_SELECTOR).innerText
            )
          ) {
            numberStore.push(item);
          } else {
            alphabetStore.push(item);
          }
        });
        numberStore.sort(sortByValue);
        function sortByValue(a, b) {
          let inputTextStart = a.querySelector(
              REFINEMENT_CLASS_SELECTOR
            ).innerText,
            inputTextEnd = b.querySelector(REFINEMENT_CLASS_SELECTOR).innerText;
          if (pattern.test(inputTextStart) && pattern.test(inputTextEnd)) {
            return inputTextStart - inputTextEnd;
          } else {
            return (
              inputTextStart.match(/\d+/g)[0] - inputTextEnd.match(/\d+/g)[0]
            );
          }
        }

        mergeArray = [...numberStore, ...alphabetStore];
        mergeArray.forEach((item) => {
          target.appendChild(item);
        });
      });
    });
  }
  /**
   * Redirect to Empty Shopping Cart if there is no any token(Guest or Logged user) stored in cookies
   */
  function redirectToEmptyShoppingCart() {
    // if there is no any token then redirect to empty shopping cart
    const isCustomerToken = $.fn.cookiesRead().customerToken();
    if (!isCustomerToken) {
      window.location.href =
        $.fn.getAPIEndpoint().damEndpoint.redirectURL.emptyShoppingCart;
    }
  }

  /**
   * Redirect to Empty Shopping Cart if there is no any items in cart
   */
  function redirectToEmptyShoppingCartWithNoItemsInCard(dataResponse) {
    let totalLineItemsData = [
      ...dataResponse.lineItems,
      ...dataResponse.customLineItems
    ];

    let totalLineItems = commonUtility().responseFilter(totalLineItemsData);
    if (!totalLineItems.length) {
      window.location.href =
        $.fn.getAPIEndpoint().damEndpoint.redirectURL.emptyShoppingCart;
    }
  }
  /**
   * addClass d-none
   */
  function addClassDnone(component) {
    $(component).addClass(D_NONE);
  }
  /**
   * removeClass d-none
   */
  function removeClassDnone(component) {
    $(component).removeClass(D_NONE);
  }
  return {
    dateFormate: dateFormate,
    responseFilter: responseFilter,
    dateFormat_mmddyyyy: dateFormat_mmddyyyy,
    getSkuId: getSkuId,
    getSkuFromSlug: getSkuFromSlug,
    getSkuIdWithoutLength: getSkuIdWithoutLength,
    getCountryNameFromCountryJSON: getCountryNameFromCountryJSON,
    categoryLevelCheckFromURL: categoryLevelCheckFromURL,
    getCategoryLevelFromURL: getCategoryLevelFromURL,
    checkSelectedFacetLevel: checkSelectedFacetLevel,
    removeSelectedFacet: removeSelectedFacet,
    getCategoryLevel: getCategoryLevel,
    isCategoryInURL: isCategoryInURL,
    categoryFacetSeoUrl: categoryFacetSeoUrl,
    categoryMatch: categoryMatch,
    dynamicURLUpdate: dynamicURLUpdate,
    customerInfoTTL: customerInfoTTL,
    facetSorting: facetSorting,
    redirectToEmptyShoppingCart: redirectToEmptyShoppingCart,
    redirectToEmptyShoppingCartWithNoItemsInCard:
      redirectToEmptyShoppingCartWithNoItemsInCard,
    addClassDnone: addClassDnone,
    removeClassDnone: removeClassDnone
  };
};
