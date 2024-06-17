$(document).ready(function () {
  //reading json from html string
  function readJsonFromHtml() {
    return new Promise((resolve, reject) => {
      const jsonStr = $("#megamenu-obj").text();

      if (jsonStr && jsonStr.trim() !== "") {
        try {
          const jsonObject = JSON.parse(jsonStr);

          if (typeof jsonObject === "object" && jsonObject !== null) {
            resolve(jsonObject);
          } else {
            reject("Invalid JSON format.");
          }
        } catch (error) {
          reject(`Error parsing JSON: ${error}`);
        }
      } else {
        reject('No valid JSON string found in the "menu" div.');
      }
    });
  }

  // FETCHING DATA FROM JSON FILE
  jsonProducts();
  // product menu click
  $("#megamenu-desktop .products-btn").click(function () {
    // init zeynepjs side menu
    var zeynep = $(".zeynep").zeynep({
      load: function (element, options) {}
    });
    var zeynep = $(".zeynep").zeynep({
      opened: function () {},
      closed: function () {}
    });
    zeynep.on("closing", function () {});
    // zeynep.destroy();
    if ($(this).hasClass("active")) zeynep.close();
    else zeynep.open();
    $(".sec_level_nav").removeClass("opened current show");
    $(".third_level_nav").removeClass("opened current show");
    $(".promotion_box").removeClass("sec_level_promo third_level_promo");
    $("#fair_first_level > li.no-submenu > a, ul.nosubmenu_links li a").on(
      "mouseover",
      function () {
        $(".sec_level_nav").removeClass("opened current show");
        $(".sec_level_nav > ul").removeClass("show");
        $(".promotion_box").removeClass("sec_level_promo third_level_promo");
      }
    );
    $(".sec_level_nav > ul > li.no-submenu > a").on("mouseover", function () {
      $(".third_level_nav").removeClass("opened current show");
      $(".third_level_nav > ul").removeClass("show");
      $(".promotion_box").removeClass("sec_level_promo third_level_promo");
    });
    //destroy menu on hover
    $(".zeynep").on("mouseleave", function () {
      zeynep.close();
      $(".compare-sec").removeClass("low_index");
      $(".products-btn").removeClass("active");
      $(".megaNavigation").removeClass("opened");
      $("#overlay-products").removeClass("active");
      $("#megamenu-desktop .products-btn").removeClass("collapsed");
      $(".container.responsivegrid.Homepage.Content.Container").removeClass(
        "fade-mode"
      );
      $(".container.responsivegrid.Article").removeClass("fade-mode");
    });
    $("#overlay-products").on("mouseover", function () {
      zeynep.close();
      $(".products-btn").removeClass("active");
      $(".megaNavigation").removeClass("opened");
      $("#overlay-products").removeClass("active");
      $("#megamenu-desktop .products-btn").removeClass("collapsed");
      $(".container.responsivegrid.Homepage.Content.Container").removeClass(
        "fade-mode"
      );
      $(".container.responsivegrid.Article").removeClass("fade-mode");
    });
  });

  $(".products-btn").click(function () {
    $(".products-btn").toggleClass("active");
    $(".categoryName").toggleClass("show");
    $(".products-table-wrapper").toggleClass("show");
    $(".industries-navigation-btn").addClass("collapsed");
    $(".industry-dropdowns.collapse").removeClass("show");
    $(".industries-navigation-btn a").removeClass("showBorderBottom");
    $("#overlayIndustries").removeClass("active");
    $(
      "#main-header .cmp-navigation.ie-navigation .cmp-navigation__group .cmp-navigation__item.cmp-navigation__item--active"
    ).toggleClass("cmp-navigation__item--active");

    /* Desktop View */
    if ($(window).width() > 834) {
      $("#overlayIndustries").removeClass("active");
      $("#collapseIndustry").removeClass("show");
      $(".industries-navigation-btn").removeClass("collapsed");
      $(".industries-navigation-btn a").removeClass("showBorderBottom");
    }
    /* mobile view */
    $(".back-to-menu").toggleClass("active");
    $(".productsbtn-mob").addClass("active");
    $("ul.menu").css("border", "none");
    $(".productList-display.d-block").removeClass("d-block");
    $(".productList-display").addClass("d-none");
    $(".products-active").css("border-bottom", "1px solid #e5e7e9");
  });

  $(".back-to-menu").click(function () {
    $(".products-btn.mob").removeClass("active");
    $(".categoryName").removeClass("show");
    $(".products-table-wrapper").removeClass("show");
    $(".back-to-menu").removeClass("active");
    $("ul.menu").css("border-bottom", "1px solid #e5e7e9");
    $(".products-active").css("border-bottom", "none");
    $(".container.responsivegrid.Homepage.Content.Container").removeClass(
      "fade-mode"
    );
    $(".productList-display.d-none").removeClass("d-none");
    $(".productList-display").addClass("d-block");
    $(".productsbtn-mob").removeClass("active");
  });

  window.getUTILITYModule
    .getUtility()
    .done(function (response) {
      let labelData = response ? response[0] : [];
      $(".new-release-label").text(labelData.labels.newRelease);
      $(".new-release-label").attr("title", labelData.labels.newRelease);
      $(".product-label").text(labelData.labels.productLabel);
      $(".bestsellers-label").text(labelData.labels.bestsellersLabel);
      $(".bestsellers-label").attr("title", labelData.labels.bestsellersLabel);
    })
    .fail(function (error) {});
  //remove desktop menu in mobile view ports
  if ($(window).width() < 833) {
    $("#megamenu-desktop").find(".zeynep.megaNavigation").html("");
  }

  function jsonProducts() {
    if ($(window).width() > 833) $(".zeynep_mob.megaNavigation").html("");
    else $(".megaNavigation").addClass("zeynep_mob");
    // Categories JSON
    readJsonFromHtml()
      .then((data) => {
        var navContainer = $(".products_items");
        $.each(data, (index, item) => {
          var checkChild = item.category.childCategories;
          var level_one = buildCategoryURL(
            item.category.categoryPath,
            0,
            item.category.seoName
          );
          if (checkChild == undefined) {
            var dropdownGroup = `<li class="no-submenu"><a id="${index}_main" data-name="${item.category.name}" data-child="${item.category.childCategories}" href="${level_one}"  >${item.category.name}</a>`;
          } else {
            var dropdownGroup = `<li class="has-submenu" menu="${index}"><a id="${index}_main" data-submenu="${item.category.categoryId}" data-child="${item.category.childCategories}" href="${level_one}"  >${item.category.name}</a><div id="${item.category.categoryId}" class="submenu sec_level_nav"><div class="submenu-header hide"><a href="#" data-submenu-close="${item.category.categoryId}">Products</a></div><label class="hide">${item.category.name}</label><ul aria-labelledby="${index}_main" class="sec_level_scroll">`;
          }
          //loop through loaction array
          $.each(item.category.childCategories, (index, items) => {
            var checkChild = items.childCategories;
            let lvl1cat = `${item.category.seoName}/${items.seoName}`;
            var level_two = buildCategoryURL(items.categoryPath, 1, lvl1cat);
            if (checkChild == undefined) {
              dropdownGroup += ` <li class="no-submenu"><a id="${index}_inner" class="mob_acc" data-name="${items.name}" data-child="${items.childCategories}" href="${level_two}"  >${items.name}</a><ul class="dropdown-menu inner_no_submenu" aria-labelledby="${index}_inner">`;
            } else {
              dropdownGroup += ` <li class="has-submenu" menu="${index}"><a class="mob_acc"  data-submenu="${items.categoryId}" data-child="${items.childCategories}" href="${level_two}"  >${items.name}</a><div id="${items.categoryId}" class="submenu third_level_nav"><div class="submenu-header hide "><a href="#" data-submenu-close="${items.categoryId}">Products</a></div><label class="hide">${item.name}</label><ul class="innerNest_no_submenu third_level_scroll" aria-labelledby="${index}_inner">`;
            }
            //loop through child array
            var parentPageLink = $(".mob_acc").attr("href");
            $.each(items.childCategories, (index, item) => {
              let lvl2cat = `${lvl1cat}/${item.seoName}`;
              var level_three = buildCategoryURL(item.categoryPath, 2, lvl2cat);
              dropdownGroup += ` <li class="no-submenu"><a href="${level_three}" data-child="${item.childCategories}" aria-labelledby="${index}_inner" >${item.name}</a></li>`;
            });
            dropdownGroup += `</ul></li>`; //closes tags
          });
          dropdownGroup += `</ul></li>`; //close tags..
          navContainer.append(dropdownGroup);
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  //function buildCategoryURL(path, level) {
  function buildCategoryURL(path, level, name) {
    var tempArr = path ? path.split("|") : [];
    if (level == 0) {
      return "/category/" + name + ".html";
    } else if (level == 1) {
      return "/category/" + name + ".html";
    } else if (level == 2) {
      return "/category/" + name + ".html";
    }
  }
  /* header and navigation bar for desktop view sticky while scrlling js*/
  window.onscroll = function () {
    headerSticky();
  };
  let header = document.getElementById("main-header");
  let megamenu = document.getElementById("megamenu-desktop");
  let menuContainer = document.getElementById("megamenu-container");
  let sticky = header.offsetTop;
  function headerSticky() {
    if (window.pageYOffset > sticky) {
      header.classList.add("sticky");
      megamenu.classList.add("animateUp");
      menuContainer.classList.add("height-zero");
    } else {
      header.classList.remove("sticky");
      megamenu.classList.remove("animateUp");
      menuContainer.classList.remove("height-zero");
    }
  }
});

document.querySelector("body").addEventListener(
  "click",
  function (e) {
    var button = e.target.closest("button");
    var label = "";
    var category = "";
    if (button !== null && button.textContent !== null) {
      label = button.textContent.trim();
      if (button.closest(".analyticmegamenu") != null) {
        category = "Header";
      }
      ctalinkDataLayerCall(label, category);
      return false;
    }
  },
  false
);
function onOverlayProducts() {
  if ($("#megamenu-desktop").hasClass("animateUp")) {
    setTimeout(function () {
      if ($(".zeynep.megaNavigation").hasClass("opened")) {
        $(".container.responsivegrid.Homepage.Content.Container").addClass(
          "fade-mode"
        );
        $(".container.responsivegrid.Article").addClass("fade-mode");
      } else {
        $(".container.responsivegrid.Homepage.Content.Container").removeClass(
          "fade-mode"
        );
        $(".container.responsivegrid.Article").removeClass("fade-mode");
        $("#overlay-products").removeClass("active");
      }
    }, 10);
  } else {
    $("#overlay-products").toggleClass("active");
    $("#megamenu-desktop .products-btn").toggleClass("collapsed");
    $("#overlayIndustries").removeClass("active");
    $("industries-navigation-btn").removeClass("collapsed");
  }
}
