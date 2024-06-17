(function ($) {
  /* Mobile filter popup */
  function filterPopup() {
    $(".plp-filter").addClass("filter-fixed");
    $("body").css("overflow", "hidden");
  }
  /* Mobile filter close */
  function filterClose() {
    $(".plp-filter").removeClass("filter-fixed");
    $("body").css("overflow", "inherit");
  }
  /* Edit parameter apply button */
  $(document).on("click", "#custom-column-btn", function () {
    $algoliaWidget.editParametersPopUp();
    $(".myModal1").fadeOut(100);
    $("#myModal1").fadeOut(100);
  });

  $(document).on("click", "#custom-column-btn-ssr", function () {
    $algoliaWidget.editParametersPopUp();
    $(".myModal1").fadeOut(100);
  });

  /* Edit parameter popup */
  function enlarge() {
    let modal1 = $("#myModal1");
    let modalSsr = $(".myModal1");
    modal1.css("display", "block");
    modalSsr.css("display", "block");
    $(".pdpclose").on("click", function () {
      modal1.fadeOut();
      modalSsr.fadeOut();
    });
  }
  /* Edit parameter select all checkbox */
  function selectAllCheck(source) {
    let checkboxes = document.querySelectorAll('input[name="changeType"]');

    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i] != source) checkboxes[i].checked = source.checked;
    }
  }

  /* == User token == */
  function algoliaUserToken() {
    let guestId = "AN-fc0e5f2ac8c42-guest";
    const userToken =
      $.fn.cookiesRead().customerToken() == null ||
      $.fn.cookiesRead().customerToken() == "undefined"
        ? guestId
        : $.fn.cookiesRead().customerToken() || guestId;
    window.aa("setUserToken", userToken);
    return userToken;
  }
  /* == Recent view products == */
  function recentViewData() {
    let uniqueSkuItems, getRecentViewArr, recentViewArr;
    getRecentViewArr = localStorage.getItem("rviewsArray") || [];
    if (getRecentViewArr.length > 0) {
      recentViewArr = JSON.parse(getRecentViewArr);
      //function to remove duplicate array items
      const removeDuplicateItems = (arr) => [...new Set(arr)];
      uniqueSkuItems = removeDuplicateItems(recentViewArr);
      return uniqueSkuItems;
    } else {
      return getRecentViewArr;
    }
  }
  /* Text character limit on Search result page */
  function readMorePDP() {
    let maxName = 200;
    $(".ellipsis-200").each(function () {
      let namechar = $(this).text();
      let trimName = namechar.replace(/\s+/g, " ").trim();
      if (trimName.length > maxName) {
        let beginTitle = trimName.substr(0, maxName);
        $(this).html(beginTitle).append($("<span />").html("..."));
      }
    });
  }
  /* Check result in search page */
  function checkNoResult(response, contentLength) {
    if (response.hits.length || contentLength > 0) {
      $(".tab").removeClass("d-none");
      if (!$(".content__tab").hasClass("active-tab")) {
        $("#product-tab.tabcontent").removeClass("d-none");
      }
      $(".not-find").removeClass("d-none");
      $(".no-result-content").addClass("d-none");
      $(".no-result-title").addClass("d-none");
      $(".loader_wrapper").hide();
    } else {
      $(".tab").addClass("d-none");
      $("#product-tab.tabcontent").addClass("d-none");
      $(".not-find").addClass("d-none");
      $(".no-result-content").removeClass("d-none");
      $(".no-result-title").removeClass("d-none");
      $(".loader_wrapper").hide();
    }
    if (!response.hits.length && contentLength > 0) {
      $(".tab").removeClass("d-none");
      $("#product-tab").addClass("d-none");
      $("#content-tab").removeClass("d-none");
      $(".tab .tablinks").removeClass("active-tab");
      $(".product__tab").addClass("button--disabled");
      $(".content__tab").addClass("active-tab");
      searchresultscontentalgolia();
    }

    $(".bs-title-container").removeClass("d-none");
    $(".fm-container").removeClass("d-none");

    $(".not-find-anch").click(function (e) {
      e.preventDefault();
    });
  }
  /* Tab click on search page */

  function openTab() {
    $(".redirect-tab").click(function () {
      $(".tablinks").removeClass("active-tab");
      $(this).addClass("active-tab");
      //$(".tabcontent").removeClass("d-none")
      $("#product-tab").addClass("d-none");
      $("#content-tab").removeClass("d-none");
      searchresultscontentalgolia();
    });
    $(".product__tab").on("click", function () {
      $(".tablinks").removeClass("active-tab");
      $(this).addClass("active-tab");
      $("#product-tab").removeClass("d-none");
      $("#content-tab").addClass("d-none");
    });
  }

  const addCompareSticky = (elementSelector, minWidth) => {
    $(document).ready(function () {
      $(window).scroll(function () {
        if ($(window).width() > minWidth) {
          const $element = $(elementSelector);
          if ($(this).scrollTop() > 1) {
            let headerHeight = $("#main-header").height();
            $element.addClass("compare-sticky");
            $element.css("top", headerHeight);
          } else {
            $element.removeClass("compare-sticky");
          }
        }
      });

      $("#megamenu-desktop .products-btn").on("click", function () {
        if (
          $("#main-header").hasClass("sticky") &&
          $("#megamenu-desktop .zeynep").hasClass("opened")
        ) {
          $(".compare-sec").addClass("low_index");
        } else {
          $(".compare-sec").removeClass("low_index");
        }
      });
    });
  };
  window.$algolia = {
    filterPopup,
    filterClose,
    enlarge,
    selectAllCheck,
    algoliaUserToken,
    recentViewData,
    readMorePDP,
    checkNoResult,
    openTab,
    addCompareSticky
  };
})(jQuery);
