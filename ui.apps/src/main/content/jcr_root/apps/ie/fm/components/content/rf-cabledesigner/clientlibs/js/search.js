//olcc search plugin v.0.1
(function ($) {
  //DOM ready starts here
  $(document).ready(function () {
    $(document).on("keyup",".search_part_num",function () {
      let search_text = $(this).val();
      let target = $(this).attr("data-target");
      $(".content_section").empty();
      $(this).parent().siblings(".search_result_wrap").hide();
      if (search_text.length < 3) return;
      $("#check_product_result").modal("hide");
      let searchInput = $(this);
      getData(
        search_text,
        searchInput.parent().siblings(".search_result_wrap"),
        target,
        searchInput
      );
    });

    $(document).on("click", function (event) {
      let $trigger = $(".search_whole_wrap");
      if ($trigger !== event.target && !$trigger.has(event.target).length) {
        $(".search_result_wrap").slideUp("fast");
      }
    });

    $(document).on("click", ".search_result_click", function () {
      let content = $(this).html();
      let sku = $(this).find(".sku").attr("asku");
      let hyperlink;
      $(this)
        .parents(".search_result_wrap")
        .siblings(".selected_part_section")
        .find(".result_section")
        .removeClass("invisible");
      $(this)
        .parents(".search_result_wrap")
        .hide()
        .siblings(".selected_part_section")
        .show()
        .find(".icon_detail")
        .html(content);
      let curBlock;
      let currentSection = $(this)
        .parents(".connector_cable_wrap")
        .attr("data-section");
      $olcc[currentSection + "flag"] = true;
      curBlock = "." + $olcc[currentSection][4] + " .accordion-contant";
      $olccCreateAssembly[currentSection + "_sku"] = sku;
      let cls = "." + $olcc[currentSection][3];
      $olccCreateAssembly.checkTheStatus.checkTheStatusAll();
      let isAuto = true;
      $olcc.getKeySpec.getKeySpecs(curBlock, sku, isAuto, cls);
      let currentObjParent = $(this).parents(".card");
      activeTopImage(currentObjParent);
    });
    $(".assembly_click").change(function () {
      if ($(this).is(":checked")) {
        $(".assemblyOptions-cls .accordion-contant-section")
          .find("span[title='" + $(this).val() + "']")
          .parent()
          .siblings("span")
          .removeClass("selected")
          .addClass("not-selected");
      } else {
        $(".assemblyOptions-cls .accordion-contant-section")
          .find("span[title='" + $(this).val() + "']")
          .parent()
          .siblings("span")
          .removeClass("not-selected")
          .addClass("selected");
      }
      $olccCreateAssembly.checkTheStatus.getAssemblyOption();
    });
    $(".assembly_option_click").change(function () {
      $(".assemblyOptions-cls .accordion-contant-section")
        .find("span[title='" + $(this).attr("data-target") + "']")
        .parent()
        .siblings("span")
        .removeClass("selected")
        .addClass("not-selected");
      $(".assemblyOptions-cls .accordion-contant-section")
        .find("span[title='" + $(this).attr("data-target") + "']")
        .text($(this).val());
      $(this).atr("value", $(this).val());

      $olccCreateAssembly.checkTheStatus.getAssemblyOption();
    });
    $("#max-frequency").blur(function (e) {
      checkMacFrequency();
    });
    $("#unit").change(function () {
      checkMacFrequency();
    });

    $(".rf_cabledesigner_main_page").off("click").on(
      "click",
      "#wrong_text_close_btn,.check_product_result[data-class='not-found-dom'],.check_product_result[data-class='not-found-dom'] .close",
      function (e) {
        e.stopPropagation();
        $("#check_product_result").modal("hide");
        $(".search_part_num").val("");
        $(".wrong_text").html("");
      }
    );

    $(".rf_cabledesigner_main_page").on(
      "click",
      "#no-results-close-btn",
      function () {
        $("#check_product_result").modal("hide");
      }
    );
  });
  //DOM ready ends here
  function checkMacFrequency() {
    let unitValue = $("#unit").val();
    if (unitValue == "MHz" && $("#max-frequency").val() > 110000) {
      $("#max-frequency").val(110000);
    } else if (unitValue == "GHz" && $("#max-frequency").val() > 110) {
      $("#max-frequency").val(110);
    }
  }

  function getCableConnectorKeys(search_text, curObj) {
    let _data = {
      Connector_One_Selections: {},
      Connector_Two_Selections: {},
      Cable_Selections: {}
    };
    let currentSection = curObj
      .parents(".connector_cable_wrap")
      .attr("data-section");
    _data[$olcc[currentSection][0]] = { searchQuery: curObj.val() };
    let currentKeySection = $("." + $olcc[currentSection][4]);
    _data = selectCableConnectorKeys(
      currentKeySection.siblings(".cable_connector_keys"),
      _data
    );
    return _data;
  }

  function selectCableConnectorKeys(keySections, _data) {
    keySections.each(function (mainIndex, mainEle) {
      let currentSection = $(mainEle).attr("data-section"),curBlock,curValue;
      if ($olcc[currentSection + "flag"]) {
        _data[$olcc[currentSection][0]]["pn"] = $olccCreateAssembly[currentSection + "_sku"];
      } else {
        $(mainEle).find(".accordion-contant-section").each(function (ele) {
          if ($(this).find(".active-state-cls").hasClass("not-selected")) {
            let textParent = $(this).find(".accordion-contant-content .strong");
            curBlock = textParent.attr("title");
            curValue = textParent.text();
            _data[$olcc[currentSection][0]][curBlock] = curValue;
          }
        });
      }
    });
    return _data;
  }
  // Search by part name or number - Autocomplete
  function createObj(search_text, target, curObj) {
    let _data = getCableConnectorKeys(search_text, curObj);
    let queryObject = {
      Connector_One_Selections: {},
      Connector_Two_Selections: {},
      Cable_Selections: {},
      calf: false,
      cahs: false,
      caclock: false,
      rohs: false,
      inStock: false
    };
    queryObject["Connector_One_Selections"] = _data.Connector_One_Selections;
    queryObject["Connector_Two_Selections"] = _data.Connector_Two_Selections;
    queryObject["Cable_Selections"] = _data.Cable_Selections;
    let DataObject = {
      url: "/bin/olcc/getSearchOptions",
      method: "POST",
      timeout: 0,
      data: {
        jsonData: JSON.stringify(queryObject),
        bearertoken: window.getbearerToken()
      }
    };
    return DataObject;
  }

  function getData(search_text, currentSearchResultBox, target,curObj) {
    let DataObject = createObj(search_text, target,curObj);
    $.ajax(DataObject).done(function (response) {
      window.errorModule.checkError(response,true);
      let filteredArray = response.recommendations;
      if (filteredArray == undefined) {
        $(".content_section").empty();
        currentSearchResultBox.hide();
        showPopupNotValidText(curObj);
        return;
      } else {
        currentSearchResultBox.show();
        appendSearchList(filteredArray, currentSearchResultBox, target,curObj.parents(".connector_cable_wrap"));
      }
    })
    .fail(function (error) { 
      window.errorModule.showErrorPopup(error)
    });
  }

  function appendSearchList(filteredArray, currentSearchResultBox, target,currentParent) {
    $(".content_section").empty();
    filteredArray.map(function (ele, i) {
      appendDOM(ele, "recomended_wrap",currentParent);
    });
    if (filteredArray.length > 0) {
      currentSearchResultBox.show();
    } else {
      currentSearchResultBox.hide();
    }
  }

  function appendDOM(ele, content_section,currentParent) {
    let content = "";
    content += "<div class='content_wrap search_result_click'>";
    content += $olccsearch.innerDOM(ele.name, ele.sku,currentParent);
    content += "</div>";

    $("." + content_section + " .content_section").append(content);
  }

  function innerDOM(name, sku,currentParent) {
    let content = "";
    let link = "/" + utilityMessage?.redirectionURL?.dataSheet_path + sku.replace(/[^a-zA-Z0-9]/g, '-') + ".pdf";
    content += $olccsearch.innerBlockSearch(sku, name, link);
    currentParent.find(".prdct-details").addClass("content-added");
    return content;
  }

  function showPopupNotValidText(curObj) {
    $olccsearch.showPopupwithContent(
      "no_product",
      "not-found-dom",
      "wrong_text_close_btn"
    );
    $(".wrong_text").text(curObj.val());
    if (curObj.val() != "")$("#check_product_result").modal("show");
  }

  function activeTopImage(currentObj) {
    let currentHeaderTitle = currentObj
      .find(".card-header button")
      .text()
      .trim(),
      currentSection = currentObj.attr("data-section"),
      currFlag = currentSection + "flag",
      link,
      sku = $olccCreateAssembly[currentSection + "_sku"]
    if(sku!==undefined)
    link ="/" + utilityMessage?.redirectionURL?.image_path + sku.replace(/[^a-zA-Z0-9]/g, '-') + ".jpg"
    $(".card_section").each(function (i, ele) {
      let topImageTitle = $(ele).find(".card_title").text().trim();
      let topImage = $(ele).find("img");
      if (topImageTitle == currentHeaderTitle && $olcc[currFlag]) {
        $(ele).addClass("enabled-cls");
        topImage.attr("src", link);
      } else if (topImageTitle == currentHeaderTitle && !$olcc[currFlag]) {
        $(ele).removeClass("enabled-cls");
        topImage.attr("src", topImage.attr("data-default-img"))
      }
    });
  }

  function innerBlockSearch(sku, name, link) {
    //Grab the inline template
    let template = $("#searchDomTemplate").html();
    //Compile the template
    let compiled_template = Handlebars.compile(template);
    //Render the data into the template
    let rendered = compiled_template({ sku: sku, name: name, link: link ,skuLabel:$olcc.labelText.sku});
    return rendered;
  }

  function showPopupwithContent(parentId, className, btnEventId) {
    $("#check_product_result .modal-title").html(
      $("#" + parentId + " .title").html()
    );
    $("#check_product_result .modal-body").html(
      $("#" + parentId + " .desc").html()
    );
    $("#check_product_result").attr("data-class",className || "");
    $("#check_product_result .continue_btn").attr("id", btnEventId);
  }

  // Search by part name or number - Autocomplete ends here

  window.$olccsearch = {
    checkMacFrequency,
    createObj,
    getData,
    appendDOM,
    appendSearchList,
    innerDOM,
    activeTopImage,
    innerBlockSearch,
    showPopupwithContent,
    selectCableConnectorKeys
  };
})(jQuery);
