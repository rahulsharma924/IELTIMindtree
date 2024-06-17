//olcc create cable assembly  plugin v.0.2
(function ($) {
  let con1_sku, con2_sku, cabl_sku;
  var heatshrink = true,
    leadfree = false,
    clocking = 0;
  var checkTheStatus = {
    //enable or disable the create cable assembly
    checkTheStatusAll: function () {
      if (
        $olcc.con1flag == true &&
        $olcc.con2flag == true &&
        $olcc.cablflag == true
      ) {
        $(".assembly-btn .primary-assembly").removeClass("disabled");
        return true;
      } else {
        $(".assembly-btn .primary-assembly").addClass("disabled");
        return false;
      }
    },
    //enable or disable the create cable assembly ends here
    // post captcha user confirmation
    postCaptcha: function () {
      if ($(".captcha-cls").length > 0) {
        $(".captcha-cls").modal("hide");

        const postdata = {
          caCon1: $olccCreateAssembly.con1_sku,
          caCon2: $olccCreateAssembly.con2_sku,
          caCoax: $olccCreateAssembly.cabl_sku,
          assemblyOption: {
            lf: leadfree,
            hs: heatshrink,
            clock: clocking
          }
        };

        let data = {
          jsonData: JSON.stringify(postdata),
          bearertoken: window.getbearerToken()
        };
        window.getAPIModule
          .createAssemblyOlcc(data)
          .done(function (data) {
            window.errorModule.checkError(data);
            if (data && !data.error) {
              let qstring = data["key"];
              var url = $("#product-page-url").val();
              window.location.href = url + "#" + qstring + "";

              return data;
            }
          })
          .fail(function (error) {
            //return error;
            window.errorModule.showErrorPopup(error)
          });
      }
    },
    getAssemblyOption: function () {
      $(".assemblyOptions-cls .accordion-contant-section > span").each(
        function (i) {
          if (i == 0) {
            if ($(this).hasClass("not-selected")) heatshrink = true;
            else heatshrink = false;
          } else if (i == 1) {
            if ($(this).hasClass("not-selected")) leadfree = true;
            else leadfree = false;
          } else {
            clocking = $(this).parent().find("span.strong").html();            
          }
        }
      );
    },
    searchCableAssembly: function () {
      $olccCreateAssembly.checkTheStatus.getAssemblyOption();
      let searchData = {
        caCon1: $olccCreateAssembly.con1_sku,
        caCon2: $olccCreateAssembly.con2_sku,
        caCoax: $olccCreateAssembly.cabl_sku,
        assemblyOption: {
          lf: leadfree,
          hs: heatshrink,
          clock: clocking
        }
      };
      $.ajax({
        url: "/bin/olcc/SearchCableAssembly",
        dataType: "json",
        type: "POST",
        data: {
          jsonData: JSON.stringify(searchData),
          bearerToken: window.getbearerToken()
        },
        success: function (searchCableAssemblyResponse, textstatus, xhr) {
          if (
            xhr.status == 200 &&
            searchCableAssemblyResponse.statusCode != 401 &&
            searchCableAssemblyResponse.statusCode != 400 &&
            searchCableAssemblyResponse.sku != ""
          ) {
            $olccsearch.showPopupwithContent(
              "found_product",
              "creat_cableassembly",
              "creatassembly_click"
            );
            $("#check_product_result").modal("show");
            $(".continue_btn").attr(
              "data-popup",
              searchCableAssemblyResponse.sku
            );
            //code for analytic searchassembly true
            let searchAssemblyVal = "exist";
            analyticCollectAllData(searchAssemblyVal);
          } else {
            //code for analytic
            let searchAssemblyVal = "new";
            analyticCollectAllData(searchAssemblyVal);
            $(".captcha-cls").modal("show");
          }
        },
        error: function (req, status, err) {
          console.log("Something went wrong", status, err);
        }
      });
    },
    // post captcha user confirmation  ends here
    //get the standred pdp url
    getSeoName: function (sku) {
      const { algoliasearch } = window;
      let client = algoliasearch(algId, algApi);
      let index = client.initIndex(indexInuse);
      return index.getObjects([sku], {
        attributesToRetrieve: [
          "hierarchicalCategories",
          "seoName",
          "categorySEOURL"
        ]
      });
    }
    //get the standred pdp url
  };

  $(document).ready(function () {
    $(".assembly-btn .primary-assembly").on("click", function () {
      $olccCreateAssembly.checkTheStatus.searchCableAssembly();
    });

    $(".specifications").on("click", function () {
      if ($(".accordion-item").is(":visible")) {
        $(".accordion-item").slideUp(300);
        $(".plusminus").text("+");
      }
      if ($(this).siblings(".accordion-item").is(":visible")) {
        $(this).siblings(".accordion-item").slideUp(300);
        $(this).children(".plusminus").text("+");
      } else {
        $(this).siblings(".accordion-item").slideDown(300);
        $(this).children(".plusminus").text("-");
      }
    });

    $(".rf_cabledesigner_main_page").on(
      "click",
      "#creatassembly_click",
      function () {
        let checkProduct = $(this).attr("data-popup");
        if (checkProduct == " ") {
          $("#check_product_result").modal("hide");
          $(".captcha-cls").modal("show");
        } else {
          let qstring = checkProduct;
          let url = $("#product-page-url").val();
          $olccCreateAssembly.checkTheStatus
            .getSeoName(qstring)
            .then(function (response) {
              if (response.results[0] !== null) {
                let variantUrl = SeoUrl(response.results[0]);
                let hostname = window.location.hostname;
                if (variantUrl.length > 0) {
                  window.location.href = variantUrl;
                } else {
                  window.location.href = url + "#" + qstring + "";
                }
              } else {
                console.log("Invalid Sku");
                window.location.href = url + "#" + qstring + "";
              }
            });
        }
      }
    );
  });

  window.$olccCreateAssembly = {
    checkTheStatus,
    con1_sku,
    con2_sku,
    cabl_sku
  };
})(jQuery);
