$(document).ready(function ($) {
  let blog_details,
    show_categories_array = [],
    cacheData = {};
  const apiEndPoint = $.fn.getAPIEndpoint(),
    $blogListComponent = $(".blog__list--component"),
    $blogList = $("#blogList"),
    blogListCard = ".blog__list--card",
    blogListFilterCategories = ".blog__list--filter--categories",
    bloListFilterArchives = ".blog__list--filter--archives";
  if (!$blogListComponent.length) {
    return;
  }
  const isBlogCategoryValueExist = localStorage.getItem("blogLabel");

  fetch_blogDetails();
  $(".blog-post-card-label .label").on("click", function (e) {
    const label = $(e.currentTarget).data().label;
    if (Object(cacheData["category"]).length) {
      blogFilterOnload(label, true);
    } else {
      fetch_blogDetails("category", true, label);
    }
  });

  // blogFilterCategory
  function blogFilterOnload(label, isFlag) {
    if (isBlogCategoryValueExist) {
      localStorage.removeItem("blogLabel");
    }
    $.each($(".blog-filters-list li"), function (index, $list) {
      if ($list) {
        if ($($list).find("input").attr("id") === label) {
          $($list).find("input").prop("checked", true);
        }
      }
    });
    filterBlog(label, isFlag);
  }

  // Filter by Categories

  function filterBlog(label, isFlag) {
    //$("#Antennas").prop("checked", true);
    if (!$(this).is(":checked")) {
      $(
        ".blog-filters-list input[id='" +
          $(this).attr("id") +
          "'].filterSelection"
      ).prop("checked", false);
    }

    let selected_category = isFlag ? label : $(this).attr("id");
    if (selected_category == "All") {
      showAllItems();
      if ($(this).is(":checked")) {
        $(".filterSelection")
          .prop("checked", $(this).prop("checked"))
          .not(this)
          .attr("disabled", "true");
      } else {
        //<-- if checkbox was unchecked
        $(".filterSelection").prop("checked", false).prop("disabled", false); // <-- enable all checkboxes
      }
    } else if ($(this).is(":checked") || isFlag) {
      show_categories_array.push(selected_category); //Was not checked so add to filter arrayy);
      showItemsFiltered(show_categories_array); //Show items grid with filters
      $("html, body").animate(
        { scrollTop: $("#blogList_wrapper").offset().top - 150 },
        "fast"
      );
      if (isFlag) {
        $("#blog-filters-collapseOne").addClass("show");
      }
    } else {
      //Unchecked so remove from the array
      show_categories_array = show_categories_array.filter(function (elem) {
        return elem !== selected_category;
      });
      showItemsFiltered(show_categories_array); //Show items grid with new filters
    }

    if (!$("input[type=checkbox]").is(":checked")) {
      //No checkboxes are checked
      $(".filterSelection").prop("checked", false);
      show_categories_array = [];
      showAllItems();
    }
  }

  // Sort by methods
  document.getElementById("blogSelectTypes").addEventListener(
    "change",
    function (e) {
      sortingMethod(e);
    },
    false
  );
  function sortingMethod(event) {
    var selType = event.target.value;

    if (selType != "" && selType != null && selType == "default") {
      //fetch_blogDetails();
    }
    if (selType != "" && selType != null && selType == "date") {
      sortbyDate(blog_details);
    } else if (selType != "" && selType != null && selType == "atoz") {
      $.each(blog_details, function (i, val) {
        blog_details = blog_details.sort(function (a, b) {
          return b.blogtitle.trim() < a.blogtitle.trim() ? 1 : -1;
        });
      });
      blog_pagination(blog_details);
    } else if (selType != "" && selType != null && selType == "ztoa") {
      $.each(blog_details, function (i, val) {
        blog_details = blog_details.sort(function (a, b) {
          return b.blogtitle.trim() > a.blogtitle.trim() ? 1 : -1;
        });
      });
      blog_pagination(blog_details);
    }
  }

  function sortbyDate(blog_details) {
    var sortItemsByDate = sortByDate(blog_details);

    blog_pagination(sortItemsByDate);
  }

  /**
   * sortByDate()
   * @param {Object} blog_details
   * @returns {Object} Sorting Data
   */
  function sortByDate(blog_details) {
    let sortItemsByDate;
    $.each(blog_details, function (i, val) {
      sortItemsByDate = blog_details.sort(function (a, b) {
        let d1 = new Date(a.formattedDate);
        let d2 = new Date(b.formattedDate);
        return d1 > d2 ? -1 : d1 < d2 ? 1 : 0;
      });
    });
    return sortItemsByDate;
  }
  /**
   *
   * @param {String} year Archives Year
   * @param {Boolean} isCardClick  clicked on card category label
   * @param {String} label  current clicked category label
   */
  function fetch_blogDetails(year, isCardClick, label) {
    //JSON call to fetch Blog Details
    var resp;
    if (typeof year === "undefined") {
      year = "";
    }

    $.getJSON(apiEndPoint.GET_BLOG_LIST + year, function (res) {
      blog_details = res.data ? sortByDate(res.data) : [];
      resp = res;
      if (isCardClick) {
        cacheData["category"] = blog_details;
      }
      blog_details_list(blog_details);
    })
      .done(function () {
        setCategories(resp.categories);
        setArchives(resp.archivesYear);
        highlightArchives();
        $blogListComponent
          .find(".filterContainer li input[type=checkbox]")
          .on("change", filterBlog);

        //$("#Antennas").prop("checked", true);
        //filterBlog();
        if (isCardClick) {
          blogFilterOnload(label, true);
        }

        const isBlogCategoryLabel = localStorage.getItem("blogLabel");
        if (isBlogCategoryLabel && isBlogCategoryLabel !== "") {
          fetch_blogDetails("category", true, isBlogCategoryLabel);
          //blogFilterOnload(isBlogCategoryLabel, true);
        }
      })
      .fail(function (error) {
        console.error(error);
      })
      .always(function () {
        console.log("complete");
      });
  }

  function setCategories(categories) {
    let sortCategories = categories ? categories.sort() : [];
    const $categoriesFilter = $(".filterContainer");
    $(".filterContainer").empty();
    blogListsMarkup(
      $categoriesFilter,
      blogListFilterCategories,
      sortCategories
    );
  }

  function setArchives(archives) {
    const $archivesList = $(".archives_list");
    blogListsMarkup($archivesList, bloListFilterArchives, archives);

    $(".archives_list li").each(function (i, text) {
      $(this).on("click", function () {
        var archives_year = $(this).data("year");
        fetch_blogDetails(archives_year);
      });
    });
  }

  function blog_details_list(blog_details) {
    blogListsMarkup($blogList, blogListCard, blog_details);
    blog_pagination(blog_details);
  }

  function showAllItems() {
    blogListsMarkup($blogList, blogListCard, blog_details);
    blog_pagination(blog_details);
  }

  //funtion to filter data based on the selected category checkbox
  function showItemsFiltered(show_categories_array) {
    var blog_details_dup = [];
    $.each(show_categories_array, function (i, val) {
      blog_details_dup = blog_details_dup.concat(
        blog_details.filter(function (e) {
          return e.bloglabel.find(function (x) {
            return x.trim() === show_categories_array[i].trim();
          });
        })
      );
      blog_details_dup = blog_details_dup.filter(
        (item, idx) => blog_details_dup.indexOf(item) === idx
      );
    });
    if (blog_details_dup.length > 0) {
      blogListsMarkup($blogList, blogListCard, blog_details_dup);
      blog_pagination(blog_details_dup);
    } else {
      blog_pagination(blog_details_dup);
      $blogList.append(
        "<article><p class='noBlogsMsg'>No Blogs Found on this category</p></article>"
      );
    }
  }

  // Pagination
  function blog_pagination(source) {
    let container = $("#pagination");
    container.pagination({
      dataSource: source,
      pageSize: 10,
      showSizeChanger: true,
      showGoInput: true,
      showNavigator: true,
      showPageNumbers: false,
      formatNavigator: "<%= totalNumber %> results",
      position: "top",
      callback: function (data, pagination) {
        blogListsMarkup($blogList, blogListCard, data, pagination.pageSize);

        var paginationClone = $("#pagination > *").clone(true);
        $("#pagination1").empty();
        paginationClone.appendTo("#pagination1");
      }
    });
  }

  /**
   * blogListsMarkup()
   * @param {Element} $componentName // Root Element for initialize the component
   * @param {TemplateName}  templateName // Example ["blog List, Blog List Filter"] use for append the data
   * @param {Object} response
   * @param {Number} pageSize
   */
  function blogListsMarkup($componentName, templateName, response, pageSize) {
    $componentName.ieBlogList(
      $blogListComponent,
      templateName,
      response,
      pageSize
    );
  }

  // For Mobile View
  $(document).on("click", "ul.blogList_MobView li.accordion-mob", function (e) {
    e.stopPropagation();
  });
  function highlightArchives() {
    $(".blog-filters-list.archives_list li").each(function () {
      $(this).click(function () {
        $(".blog-filters-list.archives_list li").removeClass("active");
        $(this).addClass("active");
      });
    });
  }

  $(".blog-filters-accordion-btn").on("click", function () {
    if ($(this).hasClass("collapsed")) {
      $(this).find(".fa-angle-down").css("transform", "rotate(180deg)");
    } else {
      $(this).find(".fa-angle-down").css("transform", "rotate(0deg)");
    }
  });

  $(document).on(
    apiEndPoint.customEvent.BLOG_ALGOLIA_FETCH,
    function (e, hits) {
      var responseData = [];
      hits.map(function (hit) {
        var data = {
          bloglabel: hit.blogCategory || "",
          blogauthor: hit.author || "",
          blogtitle: hit.title || "",
          bloglink: hit.url || "",
          formattedDate: hit.publishDate || ""
        };
        responseData.push(data);
      });
      blog_details_list(responseData);
      if (!hits || !hits.length) {
        $blogList.append(
          "<p class='noBlogsMsg'>No Blogs found for selected text.</p>"
        );
      }
      $("html, body").animate({
        scrollTop: $(".blog-list-with-filters").offset().top - 200
      });
      $(".blog__filters--archives").addClass("d-none");
    }
  );
});
