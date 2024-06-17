
// Configure/customize these variables.
$(document).ready(function () {
  var width = $(window).width();
  if (width <= 832) {
    var showCharCount = 90;
  } else {
    var showCharCount = 200;
  }
  var ellipsestext = "...";
  var moretextNew = "Read More";
  var lesstextNew = "Read Less";
  $('.plp-g-more').each(function () {
    var content = $(this).html();
    if (content.length > showCharCount) {
      var c = content.substr(0, showCharCount);
      var h = content.substr(showCharCount, content.length - showCharCount);
      var plpHtml = c + '<span class="moreellipses">' + ellipsestext + '</span><span class="morecontent"><span>' + h + '</span>&nbsp;<a href="" class="morelink-plp">' + moretextNew + '</a></span>';
      $(this).html(plpHtml);
    }
  });
 
  $(".morelink-plp").click(function () {
    if ($(this).hasClass("less")) {
      $(this).removeClass("less");
      $(this).html(moretextNew);
    } else {
      $(this).addClass("less");
      $(this).html(lesstextNew);
    }
    $(this).parent().prev().toggle();
    $(this).prev().toggle();
    return false;
  });
   //breadcrumb for tierI, tierII

  const breadcrumbPlpSSR = async () => {
    let breadcrumbLvl0,
      breadcrumbLvl1,
      breadcrumbLvl2,
      splitBreadcrumb,
      name0,
      name1,
      name2,
      linkLvl0,
      linkLvl1,
      linkLvl2;
    let origin = window.origin;
    let tierUrl = window.location.href.split(".html")[0];
    let tierCategoryUrl = tierUrl.split("/category/")[1];
    if (tierCategoryUrl != undefined) {
      splitBreadcrumb = tierCategoryUrl.split("/");
      if (splitBreadcrumb[0] != undefined) {
        breadcrumbLvl0 = splitBreadcrumb[0].trim();
      }
      if (splitBreadcrumb[1] != undefined) {
        breadcrumbLvl1 = splitBreadcrumb[1].trim();
      }
      if (splitBreadcrumb[2] != undefined) {
        breadcrumbLvl2 = splitBreadcrumb[2].trim();
      }
    }

    window.getAPIModule
     .getCategoriesJson()
     .done(function (data) {   
        $.each(data, (index, item) => {
          if (breadcrumbLvl0 == item.category.seoName) {
            name0 = item.category.name;
            let lvl1Arr = item.category.childCategories;
            if (lvl1Arr != null && lvl1Arr != undefined) {
              lvl1Arr.forEach((item) => {
                if (breadcrumbLvl1 == item.seoName) {
                  name1 = item.name;
                  let lvl2Arr = item.childCategories;
                  if (lvl2Arr != null && lvl2Arr != undefined) {
                    lvl2Arr.forEach((item) => {
                      if (breadcrumbLvl2 == item.seoName) {
                        name2 = item.name;
                      } else {
                      }
                    });
                  } else {
                  }
                }
              });
            } else {
            }
          } else {
          }
        });
      })
      .fail(function (error) {});
    if (splitBreadcrumb != undefined) {
      linkLvl0 = `${origin}/category/${splitBreadcrumb[0]}.html`;
      linkLvl1 = `${origin}/category/${splitBreadcrumb[0]}/${splitBreadcrumb[1]}.html`;
      linkLvl2 = `${origin}/category/${splitBreadcrumb[0]}/${splitBreadcrumb[1]}/${splitBreadcrumb[2]}.html`;
      $(".category-ssr").empty();
      if (splitBreadcrumb.length == 3) {
        if (name0 !== undefined && name1 !== undefined && name2 !== undefined) {
          $(".category-ssr").append(
          ` <a href="javascript:void(0)">${name0}</a> <i class="fa fa-angle-right" aria-hidden="true"></i> <a href="javascript:void(0)">${name1}</a> <i class="fa fa-angle-right" aria-hidden="true"></i> <strong>${name2}</strong>`
        );
        }
        
      } else if (splitBreadcrumb.length == 2) {
        if (name0 !== undefined && name1 !== undefined) {
          $(".category-ssr").append(
            ` <a href="javascript:void(0)">${name0}</a> <i class="fa fa-angle-right" aria-hidden="true"></i> <strong>${name1}</strong>`
          );
        }
      } else if (splitBreadcrumb.length == 1) {
        if (name0 !== undefined) {
          $(".category-ssr").append(` <strong>${name0}</strong>`);
        }
      } else {
        console.log("No category Breadcrumb");
      }
      if (splitBreadcrumb.length < 1) {
        $(".edit-param").addClass("d-none");
      } else {
        $(".edit-param").removeClass("d-none");
        $("element").prop("checked", true);
      }
    }
  };
  breadcrumbPlpSSR();
});