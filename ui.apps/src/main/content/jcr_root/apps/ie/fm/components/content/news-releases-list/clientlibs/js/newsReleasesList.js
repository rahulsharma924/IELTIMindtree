$(document).ready(function ($) {
  let news_details;

  const apiEndPoint = $.fn.getAPIEndpoint(),
    $component = $(".news__release--list"),
    $newsList = $("#newsList"),
    templateName = ".news__release--list";
  fetch_newsDetails();
  // Sort by methods
  $("#newsSelectTypes").change(function () {
    var selType = $("#newsSelectTypes :selected").val();

    if (selType != "" && selType != null && selType == "newest") {
      sortbyDateNewest(news_details);
    } else if (selType != "" && selType != null && selType == "oldest") {
      sortbyDateOldest(news_details);
    } else if (selType != "" && selType != null && selType == "atoz") {
      $.each(news_details, function (i, val) {
        news_details = news_details.sort(function (a, b) {
          return b.newsTitle.trim() < a.newsTitle.trim() ? 1 : -1;
        });
      });
      news_pagination(news_details);
    } else if (selType != "" && selType != null && selType == "ztoa") {
      //$("#newsList>.filterDiv").sort(dec_sort).appendTo('#newsList');
      $.each(news_details, function (i, val) {
        news_details = news_details.sort(function (a, b) {
          return b.newsTitle.trim() > a.newsTitle.trim() ? 1 : -1;
        });
      });
      news_pagination(news_details);
    }
  });
  function sortbyDateNewest(news_details) {
    var sortItemsByDate = [];
    $.each(news_details, function (i, val) {
      sortItemsByDate = news_details.sort(function (a, b) {
        let d1 = new Date(a.newsDate);
        let d2 = new Date(b.newsDate);
        return d1 > d2 ? -1 : d1 < d2 ? 1 : 0;
      });
    });
    news_pagination(sortItemsByDate);
  }
  function sortbyDateOldest(news_details) {
    var sortItemsByDate = [];
    $.each(news_details, function (i, val) {
      sortItemsByDate = news_details.sort(function (a, b) {
        let d1 = new Date(a.newsDate);
        let d2 = new Date(b.newsDate);
        return d1 < d2 ? -1 : d1 > d2 ? 1 : 0;
      });
    });
    news_pagination(sortItemsByDate);
  }

  function fetch_newsDetails() {
    //JSON call to fetch news Details
    //var resp;
    $.getJSON(apiEndPoint.GET_NEWS_LIST, function (res) {
      news_details = res.data;
      news_details_list(news_details);
    });
  }
  window.addEventListener('load', function () {
     newestvalOnload();
  })

   function newestvalOnload(){
    let newest=$("#newsSelectTypes").val();
    $("#newsSelectTypes").val(newest).change();
    }
  function news_details_list(news_details) {
    $newsList.ieNewsReleaseList($component, templateName, news_details);
    news_pagination(news_details);
  }

  // Pagination
  function news_pagination(source) {
    let container = $("#pagination");
    container.pagination({
      dataSource: source,
      pageSize: 10,
      showSizeChanger: true,
      showGoInput: true,
      showNavigator: true,
      showPageNumbers: false,
      formatNavigator: " of <%= totalNumber %> results",
      position: "top",
      callback: function (data, pagination) {
        $newsList.ieNewsReleaseList(
          $component,
          templateName,
          data,
          pagination.pageSize
        );
        var paginationClone = $("#pagination > *").clone(true);
        $("#pagination1").empty();
        paginationClone.appendTo("#pagination1");
      }
    });
    var paginationClone = $("#pagination > *").clone(true);
    $("#pagination1").empty();
    paginationClone.appendTo("#pagination1");
  }

  /**
   * searchResult
   */

  $(document).on(
    apiEndPoint.customEvent.BLOG_ALGOLIA_FETCH,
    function (e, hits) {
      var responseData = [];
      hits.map(function (hit) {
        var data = {
          newsLabel: hit.blogCategory || "",
          newsTitle: hit.title || "",
          newsPagePath: hit.url || "",
          newsDate: hit.publishDate || ""
        };
        responseData.push(data);
      });
      news_details_list(responseData);
      if (!hits || !hits.length) {
        $newsList.append(
          "<p class='noBlogsMsg'>No News and press releases found for selected text.</p>"
        );
      }
      $("html, body").animate({
        scrollTop: $(".news-releases-list").offset().top - 200
      });
    }
  );
  document.querySelector("body").addEventListener(
    "click",
    function (e) {
      var anchor = e.target.closest("a");
      var iElement = e.target.closest("i");
      var label = "";
      var category = "";
      if (
        iElement !== null &&
        iElement.closest(".analyticnewsreleases") != null
      ) {
        label =
          iElement.parentElement.previousSibling.childNodes[1].textContent.trim() +
          " - angle right";
      } else if (
        anchor !== null &&
        anchor.closest(".analyticnewsreleases") != null
      ) {
        label =
          anchor.childNodes[0].childNodes[0].childNodes[1].textContent.trim() +
          " - text";
      }
      category = "News Releases - " + pageName + " page";
      ctalinkDataLayerCall(label, category);
    },
    false
  );
});
