(function () {
  faqUpdate();
})();

$(document).on("faq__response", function (e, hitsResponse) {
  if (hitsResponse) {
    faqUpdate(hitsResponse);
    updateResultsCount(hitsResponse);
  }
});
/*
 * faqUpdate()// Update ShowMre/Show Less as per question List
 */
function faqUpdate() {
  var $faqs = $(".faqs"),
    showMore = ".show__more",
    showLess = ".show__less",
    displayNone = "d-none",
    $plus = "<i class='fa fa-plus' aria-hidden='true'></i>",
    $minus = "<i class='fa fa-minus' aria-hidden='true'></i>";
  $faqs.each(function () {
    create(this);
  });

  function create(component) {
    var $component = $(component),
      $faqList = $component.find(".faq__list"),
      $faqListItem = $faqList.find(".faq__list--item"),
      dataObject = $component.data() || {},
      defaultValue = dataObject.defaultValue || 6,
      loadMoreLabel = dataObject.loadMore,
      loadLessLabel = dataObject.loadLess;
    markupModified($component);
    if (!$faqListItem.length) {
      return;
    }
    addHiddenClass($faqListItem);
    buttonAdded($faqList, loadMoreLabel, loadLessLabel);
    displayListOfItem($faqList, defaultValue, $component);
    loadMore($faqList, defaultValue);
    faqAccordion($faqList);
    storeValue($component);
    questionFocus($component, $faqListItem);
  }

  /**
   * buttonAdded() // ShowMore/Show Less Button Added
   * @param {*} $component
   */
  function buttonAdded($faqList, loadMoreLabel, loadLessLabel) {
    const $butttonMarkup =
      "<div class='button__wrapper d-none'><button class='show__more d-none'>" +
      loadMoreLabel +
      "</button> <button class='show__less d-none'>" +
      loadLessLabel +
      "</button></div>";
    $.each($faqList, function (index, $list) {
      $($list).append($butttonMarkup);
    });
  }

  /**
   * addHiddenClass() // By Default Hide List
   */
  function addHiddenClass($faqListItem) {
    $faqListItem.each(function () {
      $(this).addClass(displayNone);
    });
  }

  /**
   * displayListOfItem() / Display List of item
   * @param {Number} defaultValue
   */
  function displayListOfItem($faqList, defaultValue, $component) {
    //var $faqListItem = $faqList.find(".faq__list--item")
    $.each($faqList, function (index, $list) {
      var $listItems = $($list).find(".faq__list--item");
      $listItems.addClass(displayNone);
      $.each($listItems, function (index, $listItem) {
        for (var i = index; i < defaultValue; i++) {
          $($listItem).removeClass(displayNone);
        }
        if ($listItems.length <= defaultValue) {
          $listItems
            .parent()
            .find(".button__wrapper .show__less")
            .removeClass(displayNone);
          $listItems
            .parent()
            .find(".button__wrapper .show__more")
            .addClass(displayNone);
        } else {
          $listItems.parent().find(".button__wrapper").removeClass(displayNone);
          $listItems
            .parent()
            .find(".button__wrapper .show__more")
            .removeClass(displayNone);
        }
      });
    });
  }
  /**
   * loadMore()
   * @param {DOMElement} $component, $faqList
   * @param {Number} defaultValue
   */
  function loadMore($faqList, defaultValue) {
    // Show More
    $faqList.find(showMore).on("click", function (e) {
      var $currentEvent = $(e.target);
      var $faqListCurrent = $currentEvent.parents(".faq__list");
      var totalVisibleLength = $faqListCurrent.find(".faq__list--item").length;
      var totalHiddenLength = $faqListCurrent.find(
        ".faq__list--item.d-none"
      ).length;
      if (totalHiddenLength >= defaultValue) {
        var existingValue = Number(
          $faqListCurrent.attr("data-current-value") || defaultValue
        );
        var newUpdatedValue = defaultValue + existingValue;
        displayListOfItem($faqListCurrent, newUpdatedValue);
        $faqListCurrent.attr("data-current-value", newUpdatedValue);
      } else {
        displayListOfItem($faqListCurrent, totalVisibleLength);
        $faqListCurrent.find(showLess).removeClass(displayNone);
        $faqListCurrent.find(showMore).addClass(displayNone);
      }
    });

    // Show Less
    $faqList.find(showLess).on("click", function (e) {
      var $currentEvent = $(e.target);
      var $faqListCurrent = $currentEvent.parents(".faq__list");
      displayListOfItem($faqListCurrent, defaultValue);
      $faqListCurrent.attr("data-current-value", defaultValue);
      $faqListCurrent.find(showLess).addClass(displayNone);
      $faqListCurrent.find(showMore).removeClass(displayNone);
    });
  }

  /**
   * Accordion
   */
  function faqAccordion($faqList) {
    $.each($faqList, function (index, $accordion) {
      $($accordion)
        .find(".accordion_head")
        .on("click", function (event) {
          var $currentEvent = $(event.target);
          $currentEvent
            .parents(".faq__list")
            .find(".accordion_body")
            .slideUp(300);
          $currentEvent
            .parents(".faq__list")
            .find(".accordion_head")
            .removeClass("accordian__active");
          if ($currentEvent.next(".accordion_body").is(":visible")) {
            $currentEvent.next(".accordion_body").slideUp(300);
            $currentEvent.removeClass("accordian__active");
          } else {
            $currentEvent.next(".accordion_body").slideDown(300);
            $currentEvent.toggleClass("accordian__active");
          }
          // Analytics code
          const currentHeading =
              $currentEvent.parents(".faq__list").find(".faq__title").text() +
              " - FAQ",
            currentLevel = $currentEvent.text();
          FAQDataLayerCall(currentLevel, currentLevel, currentHeading);
        });
    });
  }
  // Markup Modified for banner
  function markupModified($component) {
    if ($component.length || $(".faq__result--empty").length > 0) {
      if ($(".bannerforsupport").length) {
        $(".bannerforsupport, .image.aem-GridColumn--default--none").wrapAll(
          "<div class='faq-bannercontainer'><div class='faq--banner'></div></div>"
        );
        $(".faq-bannercontainer").insertAfter($(".breadcrumb.aem-GridColumn"));
      }
      if ($("#faq-template-container-left").length) {
        $("#faq-template-container-left")
          .parent()
          .addClass("faq__left--navigation");
      }
    }
  }
  /**
   * questionFocus
   */
  function questionFocus($component, $faqListItem) {
    if (!localStorage.getItem("searchLabel")) {
      contentFocus($component, $component);
      return;
    }
    // By Default open Question
    $.each($faqListItem, function (index, $listItem) {
      let matchActiveLabel = $($listItem).find(".faq__heading").text();
      const isQuestionExist = localStorage.getItem("searchLabel");
      if (
        isQuestionExist &&
        matchActiveLabel.trim() === localStorage.getItem("searchLabel").trim()
      ) {
        $($listItem).find(".faq__heading").addClass("accordian__active");
        $($listItem).find(".faq__body").css("display", "block");
        contentFocus($($listItem), $component);
        localStorage.removeItem("searchLabel");
      }
    });
    contentFocus($component, $component); // Remove Loader if not matched any text
  }
  /**
   * storeValueInLocalStorage
   */
  function storeValue($component) {
    $component.find(".faq__search--read-more").on("click", function (e) {
      const activeText =
        $(e.target)
          .parents(".faq__list--item")
          .find(".accordian__active")
          .text() || "";
      localStorage.setItem("searchLabel", activeText);
    });
  }
  /**
   * contentFocus() After Page Load content will be focus
   * @param {Element} $component, $components
   */
  function contentFocus($component, $components) {
    $("html, body").animate({ scrollTop: $component.offset().top - 150 }, 10);
  }
}

/*
 * updateResultsCount Search Result Count Update
 */
function updateResultsCount(histResponse) {
  const $resultCount = $(".faqs").find(".faq__results--count"),
    $listCount = $(".faqs").find(".faq__list--item");
  if ($resultCount.length && $listCount.length) {
    $resultCount
      .find(".faq__results__count")
      .text($(".faq__list--item").length);

    $resultCount
      .find(".faq__results--query")
      .text(histResponse?.searchBox?.query);

    $resultCount.removeClass("d-none");
  }
}
