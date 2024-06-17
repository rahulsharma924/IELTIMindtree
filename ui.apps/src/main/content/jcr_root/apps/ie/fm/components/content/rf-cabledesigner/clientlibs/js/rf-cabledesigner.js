//olcc plugin v.0.2
/*@Author Kantharaja*/
(function ($) {

  let olccModal,
    connectorOneLength,
    connectorTwoLength,
    cablelength,
    connector1Length,
    connector2Length,
    cable2Length,
    con1flag = false,
    con2flag = false,
    cablflag = false,
    connectorOneHref,
    connectorTwoHref,
    cableHref,
    cOneGlobal = {},
    listItemStatus = true,
    labelText,
    singletonCurCls,
    listOfRecords,
    con1,
    con2,
    cabl;
  
  (listOfRecords = 1),
    (con1 = [
      "Connector_One_Selections",
      "connector1Options",
      "connector1Recommendations",
      "connectror1-detail-cls",
      "connector1-cls",
      "c1title"
    ]);
  con2 = [
    "Connector_Two_Selections",
    "connector2Options",
    "connector2Recommendations",
    "connectror2-detail-cls",
    "connector2-cls",
    "c1title"
  ];
  cabl = [
    "Cable_Selections",
    "cableOptions",
    "cableRecommendations",
    "cabledetail-cls",
    "cableOptions-cls",
    "cabletitle"
  ];
  //algolia startes here
  const { algoliasearch, instantsearch } = window;
  const searchClient = algoliasearch(algId, algApi);
  const search = instantsearch({
    indexName: indexInuse,
    searchClient,
    routing: true
  });
  const indexOlcc = searchClient.initIndex(indexInuse);
  // An object literal for getAllOptions
  let getAlloptionFlag = false;
  var getAllOptions = {
    getAllOption: function () {
      window.getAPIModule
        .getAllOptionOlcc()
        .done(function (data) {
          window.errorModule.checkError(data,true);
          //$olcc.getAllOptions.hideTheLoader();                  
          $olcc.getAllOptions.hideTheCustomLoader();
          $olcc.getAllOptions.displyKeySpecification(data);
          $olcc.getAllOptions.displayConnector(
            data,
            "connector1Options",
            ".connectror1-detail-cls .filter-area-cls"
          );
          $olcc.getAllOptions.displayConnector(
            data,
            "connector2Options",
            ".connectror2-detail-cls .filter-area-cls"
          );
          $olcc.getAllOptions.displayConnector(
            data,
            "cableOptions",
            ".cabledetail-cls .filter-area-cls"
          );
          $olcc.getAllOptions.customMOdal(false);
        })
        .fail(function (error) { 
          window.errorModule.showErrorPopup(error)
        });
    },
    displyKeySpecification: function (data) {
      let options = "connector1Options";
      let cls = " .connector1-cls";
      $olcc.getAllOptions.renderTheKey(data, options, cls);
      options = "connector2Options";
      cls = " .connector2-cls";
      $olcc.getAllOptions.renderTheKey(data, options, cls);
      options = "cableOptions";
      cls = " .cableOptions-cls";
      $olcc.getAllOptions.renderTheKey(data, options, cls);
    },
    displayConnector: function (data, option, cls) {
      let connector1Options = data[option];
      for (let idx in connector1Options) {
        let filtername =
          typeof $("#" + idx).val() != "undefined" ? $("#" + idx).val() : idx;
        if (filtername == "Angle") filtername = "Body style";
        let eachblock = $olcc.handlebarOlcc.eachblock(filtername, idx);
        $(cls).append(eachblock);
        if (connector1Options[idx] instanceof Array) {
          let ary = connector1Options[idx];
          ary.sort(function (a, b) {
            return a.value.localeCompare(b.value);
          });
          for (let ele of ary) {
            if (ele instanceof Object) {
              var strArr = ele.value.trim().split(" ");
              for (var i = 1; i < strArr.length; i++) {
                strArr[i] = strArr[i].toLowerCase();
              }
              strArr[0] =
                strArr[0].charAt(0).toUpperCase() + strArr[0].slice(1);
              let keyVal = strArr.join(" ");

              let innerblock = $olcc.handlebarOlcc.innerBlock(
                ele.value
              );

              $(
                cls + "  div.filter_wrap:last-child .filter-container ul"
              ).append(innerblock);
            }
          }
        }
      }
    },
    filterThis: function () {
      $(document).on("keyup", "input", function (event) {
        var value = $(this).val().toLowerCase();
        $(this)
          .parent()
          .find("p")
          .filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
          });
      });

      $(document).on("click", ".form-group p", function (event) {
        $(this).parent().find("p").removeClass("bg-test-cls");
        $(this).addClass("bg-test-cls");
      });
    },
    success: function () {
      if (getAlloptionFlag) {
        setTimeout(function () {
          $('#modalSpinnerId').modal("hide");
        }, 500);
        $('#modalSpinnerId').css('display', 'none');
        $('#modalSpinnerId').modal("hide");
      }
    },
    renderTheKey(data, options, cls) {
      let connectorptions = data[options];
      connectorOneLength = Object.keys(connectorptions).length;
      for (let idx in connectorptions) {
        let filtername =
          typeof $("#" + idx).val() != "undefined" ? $("#" + idx).val() : idx;
        //let keyItem ='<div class="accordion-contant-section"><span class="selected active-state-cls"></span><p class="accordion-contant-content" filtername="' +         filtername +          '">' +          filtername +          ':<span class="strong" title=' +          idx +          ">none</span> </p></div>";
        let template = $olcc.handlebarOlcc.keyItem(filtername, idx); //Handlebars.compile(keyItem);
        let getSpec = ".key-specification-cls" + cls + " .accordion-contant";
        $(getSpec).append(template);
      }
    },
    hideTheLoader() {
      $('#modalSpinnerId').css('display', 'none');
      $('#modalSpinnerId').modal("hide");
      setTimeout(function () {
        $('#modalSpinnerId').modal("hide");
      }, 500);
      $('#modalSpinnerId').ready(function () {
        $('#modalSpinnerId').css('display', 'none');
        $('#modalSpinnerId').modal("hide");
      });
    },
    customMOdal(boolVal) {
      const modal = document.querySelector(".modalCls");
      const overlay = document.querySelector(".overlayCls");

      // close modal when the Esc key is pressed
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && !modal.classList.contains("hiddenCls")) {
          closeModal();
        }
      });

      if (boolVal == true) {
        modal.classList.remove("hiddenCls");
        overlay.classList.remove("hiddenCls");
      }
      else if (boolVal == false) {
        modal.classList.add("hiddenCls");
        overlay.classList.add("hiddenCls");
      }
      // close modal function
      const closeModal = function () {
        modal.classList.add("hiddenCls");
        overlay.classList.add("hiddenCls");
      };

      // open modal function
      const openModal = function () {
        modal.classList.remove("hiddenCls");
        overlay.classList.remove("hiddenCls");
      };
      // open modal event    
      //openModal();
    },
    hideTheCustomLoader() {
      $olcc.getAllOptions.customMOdal(false);
      setTimeout(function () {
        $olcc.getAllOptions.customMOdal(false);
      }, 500);
    },
  };
  // An object literal for getAllOptions ends here
  // An object literal for getOption
  var getOptions = {
    getOption: function (
      Connector_One_Selections,
      Connector_Two_Selections,
      Cable_Selections
    ) {
      const postdata = {
        Connector_One_Selections,
        Connector_Two_Selections,
        Cable_Selections
      };
      const data = {
        dataType: "json",
        jsonData: JSON.stringify(postdata),
        bearertoken: window.getbearerToken()
      };
      window.getAPIModule
        .getOptionsOlcc(data)
        .done(function (data) {
          window.errorModule.checkError(data,true);
          if (data && !data.error) {
            return data;
          }
        })
        .fail(function (error) {
          //return error;
          window.errorModule.showErrorPopup(error)
        });
    },
    getOptionEach: function (
      Connector_One_Selections,
      Connector_Two_Selections,
      Cable_Selections,
      cls,
      curRec,
      innerBlk
    ) {
      let postdata = {
        Connector_One_Selections,
        Connector_Two_Selections,
        Cable_Selections
      };
      const data = {
        dataType: "json",
        jsonData: JSON.stringify(postdata),
        bearertoken: window.getbearerToken()
      };
      $olcc.singletonCurCls = cls;
      let responseWithOption = window.getAPIModule
        .getOptionsOlcc(data)
        .done(function (response) {
          window.errorModule.checkError(response,true);
          if (response && !response.error) {
            if (innerBlk) {
              setTimeout(function () {
                $('#modalSpinnerId').modal("hide");
              }, 500);
              $('#modalSpinnerId').css('display', 'none');
              $('#modalSpinnerId').modal("hide");
              let data = response[curRec];
              let listOfKeys = ['connector1Recommendations', 'connector2Recommendations', 'cableRecommendations'];
              for (let key of listOfKeys) {
                if (key != curRec) {
                  let data = response[key];
                  let curname, cursku, datasection;
                  if (data.length == 1) {
                    for (let ele of data) {
                      if (ele instanceof Object) {
                        cursku = ele["sku"];
                        curname = ele["name"];
                      }
                    }
                    if (key == 'connector1Recommendations') datasection = "con1";
                    if (key == 'connector2Recommendations') datasection = "con2";
                    if (key == 'cableRecommendations') datasection = "cabl";
                    $olcc.selectData.setSingletonRecommendation(curname, cursku, datasection);
                  }
                }
              }
              //let hlink;
              let currentSection = $(cls).attr("data-section");
              let skuVal;
              listOfRecords = data.length;
              if (data.length > 0) {
                if (data instanceof Array) {
                  let i = 0;
                  for (let ele of data) {
                    if (ele instanceof Object) {
                      if (i < 1) {
                        $(cls + " .result_section .pdf_section").show();
                        let dom = $olccsearch.innerDOM(ele["name"], ele["sku"],$(cls));
                        $(cls + " .result_section .icon_detail").html(dom);
                        skuVal = ele["sku"];
                      }
                    }
                    i++;
                  }
                }
                if (data.length == 1) {
                  $(cls + " .result_section").removeClass("invisible");
                  let isAuto = true;
                  //new imple
                  let curBlock =
                    "." + $olcc[currentSection][4] + " .accordion-contant";
                  $olcc[currentSection + "flag"] = true;
                  $olccCreateAssembly[currentSection + "_sku"] = skuVal;
                  $olcc.getKeySpec.getKeySpecs(curBlock, skuVal, isAuto, cls);
                  if ($("#sameasconnector1").is(":checked")) {
                    let dom = $olccsearch.innerDOM(ele["name"], ele["sku"],$(cls));
                    $olcc.listGroupItem.sameAsConnectorSeeAll(
                      cls,
                      dom,
                      skuVal,
                      isAuto
                    );
                  }
                } else {
                  $olcc[currentSection + "flag"] = false;
                }
                $(cls + " .get-all-matches").removeClass("invisible");
                if (
                  cls == ".connectror1-detail-cls" &&
                  connectorOneLength == connector1Length &&
                  data.length == 1
                )
                  $olcc.con1flag = true;
                else if (
                  cls == ".connectror2-detail-cls" &&
                  connectorTwoLength == connector2Length &&
                  data.length == 1
                )
                  $olcc.con2flag = true;
                else if (
                  cls == ".cabledetail-cls" &&
                  cablelength == cable2Length &&
                  data.length == 1
                )
                  $olcc.cablflag = true;
              } else {
                $(cls + " .result_section").addClass("invisible");
                $(cls + " .get-all-matches").addClass("invisible");
                setFlagFalse(cls);
                $olccsearch.showPopupwithContent(
                  "no-results",
                  "no-results-dom",
                  "no-results-close-btn"
                );
                $("#check_product_result").modal("show");
              }
              $olccsearch.activeTopImage($(cls));
            } else {
              let listOfProd = response[curRec];
              $(".seeallmatches-cls").attr("curblock", cls);
              $(".seeallmatches-cls table.table tbody").html("");
              if (listOfProd.length > 0) {
                $(".seeallmatches-cls .nomatches-cls").html(listOfProd.length);
                if (listOfProd instanceof Array) {
                  for (let ele of listOfProd) {
                    if (ele instanceof Object) {
                      let dom =
                        "<tr prdname='" +
                        ele.name +
                        "' skuid='" +
                        ele.sku +
                        "' ><td>" +
                        ele.sku +
                        "</td> <td><div class='product_column'><img src='/" + utilityMessage?.redirectionURL?.image_path +
                        ele.sku.replace(/[^a-zA-Z0-9]/g, '-') +
                        ".jpg'>" +
                        ele.name +
                        "</td></div></tr>";
                      $(".seeallmatches-cls table.table tbody").append(dom);
                    }
                  }
                }
              }
              setTimeout(function () {
                $('#modalSpinnerId').modal("hide");
              }, 500);
              $('#modalSpinnerId').css('display', 'none');
              $('#modalSpinnerId').modal("hide");
              if (listOfProd.length > 0) $($olcc.olccModal).modal("show");
            }
            $olccCreateAssembly.checkTheStatus.checkTheStatusAll();
          }
        })
        .fail(function (error) {
          //return error;
          window.errorModule.showErrorPopup(error);
        });
      return responseWithOption;
    },
    enableorDisableItem: function (
      Connector_One_Selections,
      Connector_Two_Selections,
      Cable_Selections,
      curBlock,
      curOPtions,
      curTitle,
      curVal
    ) {
      const postdata = {
        Connector_One_Selections,
        Connector_Two_Selections,
        Cable_Selections
      };
      const data = {
        dataType: "json",
        jsonData: JSON.stringify(postdata),
        bearertoken: window.getbearerToken()
      };
      window.getAPIModule
        .getOptionsOlcc(data)
        .done(function (response) {
          window.errorModule.checkError(response,true);
          let data = response[curOPtions];
          for (let idx in data) {
            let ary = data[idx];
            $(curBlock + " .filter_wrap").each(function () {
              let disableChk = $(this)
                .find(".list-group")
                .hasClass("disable-list");
              let curlist = $(this).find(".filter_title").attr("titleval");
              if (!disableChk && curlist == idx) {
                let checkselection = 0;
                $(this)
                  .find("ul.list-group .list-group-item")
                  .each(function () {
                    for (let ele of ary) {
                      if (ele instanceof Object) {
                        if ($(this).attr("val") == ele.value && ele.disabled) {
                          $(this).addClass("each-itemdisabled-cls");
                        } else if (
                          $(this).attr("val") == ele.value &&
                          !ele.disabled
                        ) {
                          checkselection++;
                          $(this).removeClass("each-itemdisabled-cls");
                        }
                      }
                    }
                    if ($(this).is(':last-child')) {
                      /* if(checkselection <= 1)                         
                       {
                          $(this).parent().find('.list-group-item').each(function(){
                              if(!$(this).hasClass('each-itemdisabled-cls'))
                              {
                                $(this).addClass('item-selected');
                              }
                          });
                       }*/
                      let curObj = $(this).parent().find('.each-itemdisabled-cls');
                      $(curObj).appendTo($(this).parent());
                    }
                  });

              } else if (disableChk && curlist == idx) {
                $(this)
                  .find("ul.list-group .list-group-item")
                  .each(function () {
                    for (let ele of ary) {
                      if (ele instanceof Object) {
                        if ($(this).attr("val") == ele.value && ele.disabled) {
                          $(this).addClass("each-itemdisabled-cls");
                        } else if (
                          $(this).attr("val") == ele.value &&
                          !ele.disabled
                        ) {
                          $(this).removeClass("each-itemdisabled-cls");
                        }
                      }
                    }
                    if ($(this).is(':last-child')) {
                      let curObj = $(this).parent().find('.each-itemdisabled-cls');
                      $(curObj).appendTo($(this).parent());
                    }
                  });
              }
            });
          }

          //validate for c1,c2 and cable time bng
          const connector = [
            ".connectror1-detail-cls",
            ".connectror2-detail-cls",
            ".cabledetail-cls"
          ];
          const connectorOpt = [
            "connector1Options",
            "connector2Options",
            "cableOptions"
          ];
          let curOpt;
          connector.forEach(function (con, index) {
            if (con != curBlock) {
              connectorOpt.forEach(function (opt, idx) {
                if (index == idx) {
                  curOpt = opt;
                }
              });
              if (
                (index == 0 && $olcc.con1flag == false) ||
                (index == 1 && $olcc.con2flag == false) ||
                (index == 2 && $olcc.cablflag == false)
              ) {
                let data = response[curOpt];
                for (let idx in data) {
                  let ary = data[idx];
                  $(con + " .filter_wrap").each(function () {
                    let disableChk = $(this)
                      .find(".list-group")
                      .hasClass("disable-list");
                    let curlist = $(this)
                      .find(".filter_title")
                      .attr("titleval");
                    if (!disableChk && curlist == idx) {
                      let checkSelOther = 0;
                      $(this)
                        .find("ul.list-group .list-group-item")
                        .each(function () {
                          for (let ele of ary) {
                            if (ele instanceof Object) {
                              if ($(this).attr("val") == ele.value && ele.disabled) {
                                $(this).addClass("each-itemdisabled-cls");

                              } else if ($(this).attr("val") == ele.value && !ele.disabled) {
                                checkSelOther++;
                                $(this).removeClass("each-itemdisabled-cls");
                              }
                            }
                          }
                          if ($(this).is(':last-child')) {

                            /*  if(checkSelOther <= 1)                         
                              {
                                 $(this).parent().find('.list-group-item').each(function(){
                                     if(!$(this).hasClass('each-itemdisabled-cls'))
                                     {
                                       $(this).addClass('item-selected');
                                     }
                                 });
                              }*/

                            let curObj = $(this).parent().find('.each-itemdisabled-cls');
                            $(curObj).appendTo($(this).parent());

                          }
                        });
                    } else if (disableChk && curlist == idx) {
                      $(this)
                        .find("ul.list-group .list-group-item")
                        .each(function () {
                          for (let ele of ary) {
                            if (ele instanceof Object) {
                              if (
                                $(this).attr("val") == ele.value &&
                                ele.disabled
                              ) {
                                $(this).addClass("each-itemdisabled-cls");
                              } else if (
                                $(this).attr("val") == ele.value &&
                                !ele.disabled
                              ) {
                                $(this).removeClass("each-itemdisabled-cls");
                              }
                            }
                          }
                          if ($(this).is(':last-child')) {

                            let curObj = $(this).parent().find('.each-itemdisabled-cls');
                            $(curObj).appendTo($(this).parent());

                          }
                        });
                    }
                  });
                }
              }
            }
          });
          //validate for c1,c2 and cable time ends here
          return response;
        })
        .fail(function (error) {
          //return error;
          window.errorModule.showErrorPopup(error)
        });
    },
    sameasconnector: function () { }
  };
  // An object literal for getOption ends here

  //An object literal for listGroupItem
  var listGroupItem = {
    setKeySpecification: function (curKeySpec, activeObj) {
      $(curKeySpec + " .accordion-contant-section")
        .find("span.active-state-cls")
        .removeClass("not-selected")
        .addClass("selected");
      for (const [key, value, index] of Object.entries(activeObj)) {
        $(curKeySpec + " .accordion-contant-section").each(function (idx) {
          if ($(this).find("span.strong").attr("title") == key) {
            $(this).find("span.strong").html(value);
            $(this)
              .find("span.active-state-cls")
              .removeClass("selected")
              .addClass("not-selected");
          }
        });
      }
    },
    setlistItemValue: function (selectedObj, curObj) {
      let getlistOfSelected = {};
      $(selectedObj + " .filter_wrap ul li").each(function () {
        // $(selectedObj + " .filter_wrap .disable-list li").each(function () {
        let curBlock = $(this)
          .closest(".filter_wrap")
          .find("div.filter_title")
          .attr("titleval");
        if ($(this).hasClass("item-selected")) {
          let selectedStatus = $(this).attr("val");
          getlistOfSelected[curBlock] = selectedStatus;
        }
      });
      $(curObj).find(".list-group-item").removeClass("item-selected");
      for (const [key, value, index] of Object.entries(getlistOfSelected)) {
        $(curObj + " .filter_wrap li").each(function () {
          let curBlock = $(this)
            .closest(".filter_wrap")
            .find("div.filter_title")
            .attr("titleval");

          if (key == curBlock) {
            $(this).parent().addClass("disable-list");
            if (value == $(this).attr("val")) {
              $(this)
                .parent()
                .find(".list-group-item")
                .removeClass("item-selected");
              $(this).addClass("item-selected");
            }
          }
        });
      }
      //here to update
      let cls = selectedObj;
      let dom = $(cls).find('.result_section').html();
      $(curObj + " .result_section").html('');
      $(curObj + " .result_section").removeClass('invisible');
      $(curObj + " .result_section").html(dom);
      if ($(cls).find('.result_section').hasClass('invisible')) $(curObj + " .result_section").addClass('invisible');

    },
    sameAsConnectorSeeAll: function (cls, dom, sku, isAuto) {
      if (cls == ".connectror1-detail-cls") {
        cls = ".connectror2-detail-cls";
        $(cls + " .result_section .icon_detail").html(dom);
        $(cls + " .result_section").removeClass("invisible");
        $(cls + " .get-all-matches").removeClass("invisible");
        $olcc.con2flag = true;
        let hyperlink = connectorTwoHref + "#" + sku;
        let curBlock = ".connector2-cls .accordion-contant";
        $olccCreateAssembly.con2_sku = sku;

        $olcc.getKeySpec.getKeySpecs(curBlock, sku, isAuto, cls);
      } else if (cls == ".connectror2-detail-cls") {
        cls = ".connectror1-detail-cls";
        $(cls + " .result_section .icon_detail").html(dom);
        $(cls + " .result_section").removeClass("invisible");
        $(cls + " .get-all-matches").removeClass("invisible");

        $olcc.con1flag = true;
        let hyperlink = connectorOneHref + "#" + sku;
        let curBlock = ".connector1-cls .accordion-contant";
        $olccCreateAssembly.con1_sku = sku;
        $olcc.getKeySpec.getKeySpecs(curBlock, sku, isAuto, cls);
      }
    }
  };
  // An object literal for angle setting ends here
  var angleSettings = {
    setAngleSelectBox: function (current_ele) {
      let currentTitle = current_ele
        .parents(".filter-container")
        .siblings(".filter_title")
        .text()
        .toLowerCase();
      currentTitle = currentTitle.trim();
      if (
        current_ele.text().trim().toLowerCase() == "right angle" &&
        currentTitle == "body style" &&
        current_ele.hasClass("item-selected")
      ) {
        $("#clocking").removeAttr("disabled");
      }
    },
    checkAllAngleSetSelectBox: function () {
      $("#clocking").attr("disabled", "disabled");
      let con1Angle = $(".connector1-cls").find("span[title='angle']").text() == "Right Angle";
      let con2Angle = $(".connector2-cls").find("span[title='angle']").text() == "Right Angle";
      if (con1Angle && con2Angle) $("#clocking").removeAttr("disabled");
    },
  };

  // *** an Object literal for search ***//
  //update the key specification based on algolia data
  var getKeySpec = {
    getKeySpecs: function (curSpec, sku, isAuto, cls) {
      $(curSpec + " .accordion-contant-section")
        .find("span.active-state-cls")
        .removeClass("selected")
        .addClass("not-selected");
      let curBlock = cls;
      let curOPtions = "connector1Options";
      let _data = {
        Connector_One_Selections: {},
        Connector_Two_Selections: {},
        Cable_Selections: {}
      };
      var one, two, cable;
      let listOfCurSelection = {};
      indexOlcc
        .getObjects([sku], {
          attributesToRetrieve: [
            "configColor",
            "configCoaxType",
            "Connector 1 Series",
            "Connector 1 Gender",
            "Polarity",
            "Connector 1 Body Style",
            "Connector 1 Mount Method",
            "Attachment Method",
            "Impedance(Ohms)",
            "Flex Type",
            "Attenuation at 1 GHz",
            "No. of Shields",
            "RF Shielding (dB)"
          ]
        })
        .then(({ results }) => {
          let name, itemVal, currentSection = $(cls).attr("data-section"), currentSearchRadio = $(cls).find("input[data-target='existing_part_number_section']");

          $(curSpec + " .accordion-contant-section").each(function (idx) {
            let fltval = $(this)
              .find("p.accordion-contant-content")
              .attr("filtername");
            fltval = fltval.replace(/ /g, "").toLowerCase();
            name = $(this).find("span.strong").attr("title");
            let getKeyName = $olcc.getKeySpec.getKeyName(name);
            itemVal = results[0][getKeyName];
            $(this).find("span.strong").html(itemVal);
            if (!currentSearchRadio.is(":checked"))
              _data[$olcc[currentSection][0]][name] = itemVal;
            curOPtions = $olcc[currentSection][1];
          });
          if (currentSearchRadio.is(":checked")) {
            _data[$olcc[currentSection][0]]["pn"] = results[0].objectID;
          }
          $olcc.angleSettings.checkAllAngleSetSelectBox();
          // _data=$olcc.selectData.getSiblingFilterData($(cls),_data);
          _data = $olcc.selectData.getDataConnectorandCable(
            $(cls).siblings(".connector_cable_wrap"),
            _data
          );
          if (isAuto) {
            if (curBlock == '.connectror1-detail-cls') {
              listOfCurSelection = _data.Connector_One_Selections;
              _data["Connector_One_Selections"] = {};
              _data["Connector_One_Selections"]["pn"] = sku;
            }
            else if (curBlock == '.connectror2-detail-cls') {
              listOfCurSelection = _data.Connector_Two_Selections;
              _data["Connector_Two_Selections"] = {};
              _data["Connector_Two_Selections"]["pn"] = sku;
            }
            else if (curBlock == '.cabledetail-cls') {
              listOfCurSelection = _data.Cable_Selections;
              _data["Cable_Selections"] = {};
              _data["Cable_Selections"]["pn"] = sku;
            }
          }
          one = _data.Connector_One_Selections;
          two = _data.Connector_Two_Selections;
          cable = _data.Cable_Selections;
          if (isAuto) {
            if (listItemStatus || listOfRecords > 1) {
              $(cls + " .list-group-item").addClass("each-itemdisabled-cls");
              $(cls + " .list-group-item").removeClass("item-selected");
              disableList.disableItem(
                _data.Connector_One_Selections,
                _data.Connector_Two_Selections,
                _data.Cable_Selections,
                curBlock,
                curOPtions,
                cls,
                sku,
                listOfCurSelection
              );
            } else if (!listItemStatus && listOfRecords == 1) {
              if ($olcc.singletonCurCls == cls) {
                $(cls).find(".reset_click").trigger("click");
              }
            }
            else {
              $(cls).find(".reset_click").trigger("click");
              $(cls + " .filter_search")
                .val("")
                .trigger("keyup")
                .focus();
            }
          }
        });
    },
    getKeyName: function (key) {
      let algoliaKeyData = {
        color: "configColor",
        coaxType: "configCoaxType",
        angle: "Connector 1 Body Style",
        gender: "Connector 1 Gender",
        connectorImpedance: "Impedance(Ohms)",
        cableImpedance: "Impedance(Ohms)",
        mountMethod: "Connector 1 Mount Method",
        polarity: "Polarity",
        series: "Connector 1 Series",
        attachMethod: "Attachment Method",
        flexType: "Flex Type",
        noShields: "No. of Shields",
        iL1Ghz: "Attenuation at 1 GHz"
      };
      return algoliaKeyData[key];
    }
  };
  var disableList = {
    disableItem: function (
      Connector_One_Selections,
      Connector_Two_Selections,
      Cable_Selections,
      curBlock,
      curOPtions,
      cls,
      sku,
      listOfCurSelection
    ) {

      const postdata = {
        Connector_One_Selections,
        Connector_Two_Selections,
        Cable_Selections
      };
      const data = {
        dataType: "json",
        jsonData: JSON.stringify(postdata),
        bearertoken: window.getbearerToken()
      };
      window.getAPIModule
        .getOptionsOlcc(data)
        .done(function (response) {
          window.errorModule.checkError(response,true);
          let cOne;
          let currentSection = $(cls).attr("data-section");
          cOne = listOfCurSelection;
          $olcc[currentSection + "flag"] = true;
          $(".connector_cable_wrap .filter_wrap").each(function () {
            let curSec = $(this)
              .parents(".connector_cable_wrap")
              .attr("data-section");
            let curObj = $olcc[curSec][1];
            let curList = $(this).find(".filter_title").attr("titleval");
            const propertyNames = Object.keys(response[curObj]);
            if (propertyNames.includes(curList)) {
              let checkSelOtherDisable = 0;
              $(this)
                .find("ul.list-group .list-group-item")
                .each(function () {
                  var self = $(this);
                  response[curObj][curList].map(function (key) {
                    if (key.value == self.attr("val") && key.disabled) {
                      self.addClass("each-itemdisabled-cls");
                    }
                    else if (key.value == self.attr("val") && !key.disabled) {
                      checkSelOtherDisable++;
                    }
                  });

                  if ($(this).is(':last-child')) {
                    /*if(checkSelOtherDisable <= 1)                         
                    {
                       $(this).parent().find('.list-group-item').each(function(){
                           if(!$(this).hasClass('each-itemdisabled-cls'))
                           {
                             $(this).addClass('item-selected');
                           }
                       });
                    }*/
                    let curObj = $(this).parent().find('.each-itemdisabled-cls');
                    $(curObj).appendTo($(this).parent());
                  }
                });
            }
          });
          //for redoing
          let data = response[curOPtions];
          for (let idx in data) {
            let ary = data[idx];
            for (const [key, val] of Object.entries(cOne)) {
              let title = idx.toLowerCase();
              if (title == key.toLowerCase()) {
                $(curBlock + " .filter_wrap").each(function () {
                  let curlist = $(this).find(".filter_title").attr("titleval");
                  if (idx == curlist) {
                    let checkSelOtherItem = 0;
                    $(this)
                      .find("ul.list-group .list-group-item")
                      .each(function () {
                        for (let ele of ary) {
                          if (ele instanceof Object) {
                            if (
                              ele.value == val &&
                              $(this).attr("val") == ele.value
                            ) {
                              $(this).removeClass("each-itemdisabled-cls");
                              $(this).addClass("item-selected");
                            }
                          }
                        }
                        if ($(this).is(':last-child')) {
                          let curObj = $(this).parent().find('.each-itemdisabled-cls');
                          $(curObj).appendTo($(this).parent());
                        }
                      });
                  }
                });
              }
            }

            $olccsearch.activeTopImage($(cls));
            $olccCreateAssembly.checkTheStatus.checkTheStatusAll();
          }

          return response;
        })
        .fail(function (error) {
          //return error;
          window.errorModule.showErrorPopup(error)
        });
    }
  };
  //olcc handlebar starts here
  var handlebarOlcc = {
    keyItem: function (filtername, idx) {
      //Grab the inline template
      let template = $("#keyItemTemplate").html();
      //Compile the template
      let compiled_template = Handlebars.compile(template);
      //Render the data into the template
      let rendered = compiled_template({ filtername: filtername, idx: idx });
      return rendered;
    },
    eachblock: function (filtername, idx) {
      //Grab the inline template
      let template = $("#eachBlockTemplate").html();
      //Compile the template
      let compiled_template = Handlebars.compile(template);
      //Render the data into the template
      let rendered = compiled_template({ filtername: filtername, idx: idx });
      return rendered;
    },
    innerBlock: function (val, keyVal) {
      //Grab the inline template
      let template = $("#innerBlockTemplate").html();
      //Compile the template
      let compiled_template = Handlebars.compile(template);
      //Render the data into the template
      let rendered = compiled_template({ value: val });
      return rendered;
    }
  };
  var selectData = {
    selectFilterData: function (currentClickItem, type) {
      let {
        one,
        two,
        cable,
        curObj,
        curReccomandation,
        curKeySpec,
        activeObj,
        innerBlk,
        curOPtions
      } = {
        one: {},
        two: {},
        cable: {},
        curObj: "",
        curReccomandation: "",
        curKeySpec: "",
        activeObj: {},
        innerBlk: true,
        curOPtions: ""
      };
      let currentClickSec = currentClickItem
        .parents(".connector_cable_wrap")
        .attr("data-section");
      curObj = "." + $olcc[currentClickSec][3];
      curReccomandation = $olcc[currentClickSec][2];
      curKeySpec = "." + $olcc[currentClickSec][4];
      curOPtions = $olcc[currentClickSec][1];
      let _data = {
        Connector_One_Selections: {},
        Connector_Two_Selections: {},
        Cable_Selections: {}
      };
      _data = $olcc.selectData.getDataConnectorandCable(
        $(".connector_cable_wrap"),
        _data
      );
      one = _data.Connector_One_Selections;
      two = _data.Connector_Two_Selections;
      cable = _data.Cable_Selections;

      //one = _data["Connector_One_Selections"] = {"pn":"FMCN1821"};
        $('.connector_cable_wrap').each(function(){
          if(!$(this).hasClass($olcc[currentClickSec][3]))
          {
            if($(this).hasClass('connectror1-detail-cls'))
            {
              if(!$(this).find('.selected_part_section .result_section').hasClass('invisible'))
              {
                
                let defaultSku = $(this).find('.sku').attr('asku');
                one = _data["Connector_One_Selections"] = {"pn":defaultSku};
              }
            }
            else if($(this).hasClass('connectror2-detail-cls')){
              if(!$(this).find('.selected_part_section .result_section').hasClass('invisible'))
              {
              
               let defaultSku = $(this).find('.sku').attr('asku');
               two = _data["Connector_Two_Selections"] = {"pn":defaultSku};
              }
            }
            else if($(this).hasClass('cabledetail-cls')){
              if(!$(this).find('.selected_part_section .result_section').hasClass('invisible'))
              {
               
               let defaultSku = $(this).find('.sku').attr('asku');
               cable = _data["Cable_Selections"] = {"pn":defaultSku};
              }
            }
          }
        });

      if (
        $("#sameasconnector1").is(":checked") /*&&  Object.keys(cOneGlobal).length > 0  */) {
        let selectedConnector =
          $olcc.selectData.setFilterIfSameasConnectorChecked(
            currentClickItem,
            one,
            two
          );
        one = selectedConnector[0];
        two = selectedConnector[1];
      }
      activeObj = _data[$olcc[currentClickSec][0]];
      if (
        currentClickItem.closest(".card").hasClass("connectror1-detail-cls")
      ) {
        cOneGlobal = one;
      }
      $(curKeySpec)
        .find("span.active-state-cls")
        .removeClass("not-selected")
        .addClass("selected");
      $(curKeySpec).find(".accordion-contant-content span.strong").html("none");
      $olcc.listGroupItem.setKeySpecification(curKeySpec, activeObj);
      $olcc.getOptions.getOptionEach(
        one,
        two,
        cable,
        curObj,
        curReccomandation,
        innerBlk
      );
      $olcc.getOptions.enableorDisableItem(one, two, cable, curObj, curOPtions);
      connector1Length = Object.keys(one).length;
      connector2Length = Object.keys(two).length;
      cable2Length = Object.keys(cable).length;
    },
    getDataConnectorandCable: function (currentParent, _data) {
      currentParent.each(function (mainIndex, mainEle) {
        let currentSection = $(this).attr("data-section");
        let currentSearchRadio = $(this).find("input[data-target='existing_part_number_section']");
        if ($olcc[currentSection + "flag"] && currentSearchRadio.is(":checked")) {
          //  if ($olcc[currentSection + "flag"]) {
          _data[$olcc[currentSection][0]]["pn"] = $olccCreateAssembly[currentSection + "_sku"]
        } else {
          $(mainEle).find(".filter-area-cls .filter_wrap li").each(function (ele) {
            let curBlock = $(this)
              .parents(".filter_wrap")
              .find(".filter_title")
              .attr("titleval");
            if ($(this).hasClass("item-selected")) {
              let selectedStatus = $(this).attr("val");
              _data[$olcc[currentSection][0]][curBlock] = selectedStatus;
            }
          });
        }
      })
      return _data;
    },
    setFilterIfSameasConnectorChecked: function (currentClickItem, one, two) {
      let currentParent = currentClickItem.closest(".card");
      let checkClickIdEqual = currentClickItem.attr("id") == "sameasconnector1";
      let checkClickIdNotEqual =
        currentClickItem.attr("id") != "sameasconnector1";
      if (
        checkClickIdEqual ||
        (checkClickIdNotEqual &&
          currentParent.hasClass("connectror1-detail-cls"))
      ) {
        two = one;
        $olcc.listGroupItem.setlistItemValue(
          ".connectror1-detail-cls",
          ".connectror2-detail-cls"
        );
      }
      if (
        checkClickIdNotEqual &&
        currentParent.hasClass("connectror2-detail-cls")
      ) {
        one = two;
        $olcc.listGroupItem.setlistItemValue(
          ".connectror2-detail-cls",
          ".connectror1-detail-cls"
        );
      }
      return [one, two];
    },
    getSiblingFilterData: function (curObj, _data) {
      curObj
        .siblings(".connector_cable_wrap")
        .each(function (mainEleIndex, mainEle) {
          let currentSection = $(mainEle).attr("data-section");
          $(mainEle)
            .find(".filter-area-cls .filter_wrap")
            .each(function (subEleIndex, subEle) {
              let curlist = $(subEle).find(".filter_title").attr("titleval");
              $(subEle)
                .find("ul.list-group .list-group-item")
                .each(function (listEleIndex, listEle) {
                  if ($(listEle).hasClass("item-selected")) {
                    _data[$olcc[currentSection][0]][curlist] =
                      $(listEle).attr("val");
                  }
                });
            });
        });
      return _data;
    },
    setSingletonRecommendation: function (curname, cursku, datasection) {
      let name, sku , domGlobal, skuGlobal;
      name = curname;
      sku = cursku;

      let currentSection = datasection;
      let curBlock = "." + $olcc[currentSection][4] + " .accordion-contant";
      let cls = "." + $olcc[currentSection][3];
      $olcc[currentSection + "flag"] = true;
      $olccCreateAssembly[currentSection + "_sku"] = sku;
      let dom = $olccsearch.innerDOM(name, sku,$(cls));
      domGlobal = dom;
      skuGlobal = sku;
      $(cls + " .result_section .icon_detail").html(dom);
      $(cls + " .result_section").removeClass("invisible");
      $(cls + " .get-all-matches").removeClass("invisible");
      let isAuto = true;
      //new imple
      $olcc.getKeySpec.getKeySpecs(curBlock, sku, isAuto, cls);
      //new imple ends here

      //same as connector
      if ($("#sameasconnector1").is(":checked")) {
        $olcc.listGroupItem.sameAsConnectorSeeAll(cls, dom, sku, isAuto);
      }
      //same as connector ends here   
    },
  };
  var resetValidator = {
    resetCheck: function (curObj) {
      let _data = {
        Connector_One_Selections: {},
        Connector_Two_Selections: {},
        Cable_Selections: {}
      };
      let currentSection = curObj
        .parents(".connector_cable_wrap")
        .attr("data-section");
      if (currentSection == undefined) return;
      _data[$olcc[currentSection][0]] = {};
      let curOPtions = $olcc[currentSection][1];
      let curobjR = $olcc[currentSection][3];
      // _data=$olcc.selectData.getSiblingFilterData(curObj.parents(".connector_cable_wrap"),_data);
      _data = $olcc.selectData.getDataConnectorandCable(
        curObj
          .parents(".connector_cable_wrap")
          .siblings(".connector_cable_wrap"),
        _data
      );

      $('.connector_cable_wrap').each(function(){
        if(!$(this).hasClass($olcc[currentSection][3]))
        {
          if($(this).hasClass('connectror1-detail-cls'))
          {
            if(!$(this).find('.selected_part_section .result_section').hasClass('invisible'))
            {
              
              let defaultSku = $(this).find('.sku').attr('asku');
              _data.Connector_One_Selections = _data["Connector_One_Selections"] = {"pn":defaultSku};
            }
          }
          else if($(this).hasClass('connectror2-detail-cls')){
            if(!$(this).find('.selected_part_section .result_section').hasClass('invisible'))
            {
             
             let defaultSku = $(this).find('.sku').attr('asku');
             _data.Connector_Two_Selections = _data["Connector_Two_Selections"] = {"pn":defaultSku};
            }
          }
          else if($(this).hasClass('cabledetail-cls')){
            if(!$(this).find('.selected_part_section .result_section').hasClass('invisible'))
            {
             
             let defaultSku = $(this).find('.sku').attr('asku');
             _data.Cable_Selections = _data["Cable_Selections"] = {"pn":defaultSku};
            }
          }
        }
      });

      $olcc.getOptions.enableorDisableItem(
        _data.Connector_One_Selections,
        _data.Connector_Two_Selections,
        _data.Cable_Selections,
        curobjR,
        curOPtions,
        "",
        ""
      );
      $("." + curobjR + " .filter_search")
        .val("")
        .trigger("keyup");
    }
  };
  var getIdtoScroll = function () {
    let cardId = localStorage.getItem("CableConnectorSection");
    if (cardId == undefined) {
      $("#card_0").addClass("active_card");
      return;
    }
    $("#" + cardId).addClass("active_card");
    $olcc.scrollToCard(cardId);
  };
  function scrollToCard(cardId) {
    let card = document.getElementById(cardId);
    const y = card.getBoundingClientRect().top - 170 + window.scrollY;
    window.scroll({
      top: y,
      behavior: "smooth"
    });
  }
  function setFlagFalse(cls) {
    let currentSection = $(cls).attr("data-section");
    $olcc[currentSection + "flag"] = false;
  }

  function getPopuponQuestionMarkIcon(currentEle) {
    let target = currentEle.attr("data-target");
    $(".icon_popup .icon_popup_wrap").html($("#" + target).html());
    $(".icon_popup").show();
    let currEleSize = 14, thisQuestion = currentEle.offset(),
      currentQTop = thisQuestion.top,
      currentQLeft = thisQuestion.left,
      popupLeft = thisQuestion.left + currEleSize,
      popupTop = thisQuestion.top + currEleSize
    icon_popup = $(".icon_popup")[0].getBoundingClientRect(),
      popupWidth = icon_popup.width,
      popupHeight = icon_popup.height;
    if (popupLeft + popupWidth > $("body").width()) {
      popupLeft = (currentQLeft + currEleSize) - popupWidth;
      if (popupLeft < 0) popupLeft = 2;
    }
    if (popupTop + popupHeight > $("body").height()) {
      popupTop = popupHeight - (currentQTop + currEleSize);
      if (popupTop < 0) popupTop = 2;
    }
    $(".icon_popup").css({ left: popupLeft, top: popupTop });
  }

  function loadTemplate(template_id, data, index) {
    let template = $("#" + template_id).html();
    //Compile the template
    let compiled_template = Handlebars.compile(template);
    //Render the data into the template
    let rendered = compiled_template({ data: data, index: index + 1, ind: index });
    return rendered;
  }

  function createCardTemplate(utilityMessage) {

    const data = [{
      heading: utilityMessage?.labels.connector1,
      className: "connectror1-detail-cls",
      attrDataSection: "con1",
      cardId: "card_0",
    }, {
      heading: utilityMessage?.labels.connector2,
      className: "connectror2-detail-cls",
      attrDataSection: "con2",
      cardId: "card_2"
    }, {
      heading: utilityMessage?.labels.cable,
      className: "cabledetail-cls",
      attrDataSection: "cabl",
      cardId: "card_1"
    }
    ];
    data.forEach(function (value, key) {
      let html = loadTemplate("ccc-card-accordian", value, key);
      $("#filter_selection").append(html)
    });
    $(".connectror2-detail-cls .check-box-same-as-one").append(loadTemplate("same-as-one-template"))
    $olcc.getIdtoScroll();
    setDomLabels(utilityMessage);
    // callUtiltyLabels("setDomLabels");
  }

  function setDomLabels(utilityMessage) {
    $(".filter-config-label").text(utilityMessage?.labels.filtersForCongiguration)
    $(".show-stock-part-label").text(utilityMessage?.labels.onlyShowInStockParts)
    $(".reset_click").text(utilityMessage?.labels.reset);
    $(".radio-label1").text(utilityMessage?.labels.selectParameters);
    $(".radio-label2").text(utilityMessage?.labels.searchAnExistingPartNumber);
    $(".mid_text").text(utilityMessage?.labels.or);
    $(".search_title").text(utilityMessage?.labels.recommended),
      $(".slected_label").text(utilityMessage?.labels.partSelected + ": ")
    $(".get-all-matches").text(utilityMessage?.labels.seeAllMatches);
    $(".same1_label").text(utilityMessage?.labels.sameAsConnector1);
    $("#sameasconnector1").attr("value", utilityMessage?.labels.sameAsConnector1);
    $(".sku_label").text(utilityMessage?.labels.sku)
    $(".product_label").text(utilityMessage?.labels.product)
    $(".key-specification-label").text(utilityMessage?.labels.keySpecifications)
    $(".part-matches-label").text(utilityMessage?.labels.partMatches)
    $(".select_btn").text(utilityMessage?.labels.select)
    let cancel = utilityMessage?.labels?.cancel || "Cancel";
    $(".cancel_btn").text(cancel.charAt(0).toUpperCase() + cancel.slice(1).toLowerCase());

  }

  //DOM Ready starts here
  $(document).ready(function () {
    // Utility JSON
    window.getUTILITYModule
      .getUtility()
      .done(function (response) {
        utilityMessage = response ? response[0] : [];
        $olcc.labelText=utilityMessage.labels
        createCardTemplate(utilityMessage);
      })
      .fail(function (error) { });

    $(document).on("change", ".select_section", function () {
      $(this).closest(".card").find(".reset_click").trigger("click");
      let currentSection = $(this).parents(".card");
      $(this).closest(".card").find(".option_container").hide();
      $(this)
        .closest(".card")
        .find("." + $(this).attr("data-target"))
        .show();
      if (
        $(this).attr("data-target") == "existing_part_number_section" &&
        (currentSection.hasClass("connectror1-detail-cls") ||
          currentSection.hasClass("connectror2-detail-cls"))
      ) {
        $(".connectror2-detail-cls .check-box-same-as-one").hide();
      } else {
        $(".connectror2-detail-cls .check-box-same-as-one").show();
      }
    });
    $(".accordion-titel").on("click", function () {
      $(this).next().slideToggle(200);
      $(this).toggleClass("open", 200);
      let curObject = $(this).parent(".accordion-item");
      curObject.find(".border").slideToggle();
      curObject.prevAll(".accordion-item").find(".border").slideUp();
      curObject.nextAll(".accordion-item").find(".border").slideUp();
    });
    $(document).on("click", ".expand_click", function () {
      $("#" + $(this).attr("target")).slideToggle("slow");
      var current_text = $(this).text();
      var updated_text = $(this).attr("replace_text");
      $(this).text(
        $(this).text() == current_text ? updated_text : current_text
      );
      $(this).attr("replace_text", current_text);
    });
    // RF Cable Filters accordian ends here

    // RF Cable:Filter the Selectd parameter
    $(document).on("keyup", ".filter_search", function () {
      var value = $(this).val().toLowerCase();
      var search_list = $(this)
        .parents(".filter-container")
        .find(".search_list");
      search_list.find("li").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
      });
    });
    // RF Cable:Filter the Selectd parameter ends here

    //Get the reccomandation's based on the selectd parameters
    $(document).on("click", ".list-group-item", function () {
      $(this).removeClass("each-itemdisabled-cls");
      $(this).toggleClass("item-selected");
      $(this).closest('ul').find('li').not(this).removeClass("item-selected");
      $(this).parent().addClass("disable-list");
      let curTitle = $(this)
        .closest(".filter_wrap")
        .find(".filter_title")
        .attr("titleval");
      let curVal = $(this).attr("val");
      listItemStatus = $(this).hasClass("item-selected"); //bkend
      $(".modal-spinner-cls").modal("show");
      $(this).closest(".card").find(".result_section").addClass("invisible");
      $olcc.selectData.selectFilterData($(this), false);
      $olcc.angleSettings.checkAllAngleSetSelectBox();
      //sameasconnector ends here
    });
    //Get the reccomandation's based on the selectd parameters ends here

    //same as connector change
    $(document).on("change", "#sameasconnector1", function (event) {
      if ($(this).is(":checked")) {
        if (Object.keys(cOneGlobal).length > 0) {
          $olcc.selectData.selectFilterData($(this), true);
        }
      }
    });
    //same as connector change ends here

    //reset the selectd parameters
    $(document).on("click", ".reset_click", function (event) {
      let cobj;
      $(this)
        .parent()
        .closest(".card")
        .find(".list-group")
        .removeClass("disable-list");
      $(this)
        .parent()
        .closest(".card")
        .find(".list-group .list-group-item")
        .removeClass("item-selected each-itemdisabled-cls");
      $(this)
        .siblings(".existing_part_number_section")
        .find(".selected_part_section")
        .find(".search_part_num")
        .val("");
      $(this)
        .siblings(".existing_part_number_section")
        .find(".selected_part_section")
        .hide();
      $(this)
        .siblings(".parameter_section")
        .find(".result_section")
        .addClass("invisible");
      $(this)
        .siblings(".parameter_section")
        .find(".get-all-matches")
        .addClass("invisible");
        $(this).parents(".card").find(".prdct-details").removeClass("content-added")
      $(this).parents(".card").removeClass("active_connector_cable");
      $(this).parents(".card").find("#sameasconnector1").prop("checked", false);
      if (
        $(this).parent().closest(".card").hasClass("connectror1-detail-cls")
      ) {
        cobj = ".connector1-cls";
        $(cobj)
          .find("span.active-state-cls")
          .removeClass("not-selected")
          .addClass("selected");
        $(cobj).find(".accordion-contant-content span.strong").html("none");
        cOneGlobal = {};
        $("#sameasconnector1").prop("checked", false);
      }
      if (
        $(this).parent().closest(".card").hasClass("connectror2-detail-cls")
      ) {
        cobj = ".connector2-cls";
        $(cobj)
          .find("span.active-state-cls")
          .removeClass("not-selected")
          .addClass("selected");
        $(cobj).find(".accordion-contant-content span.strong").html("none");
      }
      if ($(this).parent().closest(".card").hasClass("cabledetail-cls")) {
        cobj = ".cableOptions-cls";
        $(cobj)
          .find("span.active-state-cls")
          .removeClass("not-selected")
          .addClass("selected");
        $(cobj).find(".accordion-contant-content span.strong").html("none");
      }
      if ($(this).parent().closest(".card").hasClass("assembly-cls")) {
        $("#heat-shrink").prop("checked", false);
        $("#lead-free-solder").prop("checked", false);
        $("#clocking").val(0);
        $(".assemblyOptions-cls .accordion-contant-section > span")
          .removeClass("not-selected")
          .addClass("selected");
        $(".assemblyOptions-cls")
          .find(".accordion-contant-content span.strong")
          .html("");
      }

      $(this)
        .siblings(".existing_part_number_section")
        .find(".search_part_num")
        .val("");

      setFlagFalse(cobj);
      $olccCreateAssembly.checkTheStatus.checkTheStatusAll();

      //sameasconnector starts here
      if ($("#sameasconnector1").is(":checked")) {
        let curCls;
        if (
          $(this).parent().closest(".card").hasClass("connectror1-detail-cls")
        ) {
          cobj = ".connector2-cls";
          curCls = ".connectror2-detail-cls";
        }
        if (
          $(this).parent().closest(".card").hasClass("connectror2-detail-cls")
        ) {
          cobj = ".connector1-cls";
          curCls = ".connectror1-detail-cls";
        }
        $(cobj)
          .find("span.active-state-cls")
          .removeClass("not-selected")
          .addClass("selected");
        $(cobj).find(".accordion-contant-content span.strong").html("none");
        $(curCls).find(".list-group").removeClass("disable-list");
        $(curCls)
          .find(".list-group .list-group-item")
          .removeClass("item-selected");
        $(curCls)
          .find(".list-group .list-group-item")
          .removeClass("each-itemdisabled-cls");
        $(curCls + " .existing_part_number_section")
          .find(".selected_part_section")
          .find(".search_part_num")
          .val("");
        $(curCls + " .existing_part_number_section")
          .find(".selected_part_section")
          .hide();
        $(curCls + " .parameter_section")
          .find(".result_section")
          .addClass("invisible");
        $(curCls + " .parameter_section")
          .find(".get-all-matches")
          .addClass("invisible");
      }

      $olccsearch.activeTopImage($(this).parents(".card"));
      //reset //
      $olcc.resetValidator.resetCheck($(this));
      //reset end //
      $olcc.angleSettings.checkAllAngleSetSelectBox();
    });
    //reset the selectd parameters

    // See all matches - get the list of reccomandations based on the parameters
    $(document).on("click", ".get-all-matches", function (event) {
      event.preventDefault();
      $olcc.olccModal = $(this).data("target");
      $(".modal-spinner-cls").modal("show");
      $(".seeallmatches-cls .select_btn").addClass("disabled");
      let innerBlk = false;
      let currentClickSec = $(this)
        .parents(".connector_cable_wrap")
        .attr("data-section");
      let curObj = "." + $olcc[currentClickSec][3];
      let curReccomandation = $olcc[currentClickSec][2];
      let _data = {
        Connector_One_Selections: {},
        Connector_Two_Selections: {},
        Cable_Selections: {}
      };
      _data = $olcc.selectData.getDataConnectorandCable(
        $(".connector_cable_wrap"),
        _data
      );

      $('.connector_cable_wrap').each(function(){
        if(!$(this).hasClass($olcc[currentClickSec][3]))
        {
          if($(this).hasClass('connectror1-detail-cls'))
          {
            if(!$(this).find('.selected_part_section .result_section').hasClass('invisible'))
            {
              
              let defaultSku = $(this).find('.sku').attr('asku');
              _data.Connector_One_Selections = _data["Connector_One_Selections"] = {"pn":defaultSku};
            }
          }
          else if($(this).hasClass('connectror2-detail-cls')){
            if(!$(this).find('.selected_part_section .result_section').hasClass('invisible'))
            {
             
             let defaultSku = $(this).find('.sku').attr('asku');
             _data.Connector_Two_Selections = _data["Connector_Two_Selections"] = {"pn":defaultSku};
            }
          }
          else if($(this).hasClass('cabledetail-cls')){
            if(!$(this).find('.selected_part_section .result_section').hasClass('invisible'))
            {
             
             let defaultSku = $(this).find('.sku').attr('asku');
             _data.Cable_Selections = _data["Cable_Selections"] = {"pn":defaultSku};
            }
          }
        }
      });

      $olcc.getOptions.getOptionEach(
        _data.Connector_One_Selections,
        _data.Connector_Two_Selections,
        _data.Cable_Selections,
        curObj,
        curReccomandation,
        innerBlk
      );
    });
    // See all matches - get the list of reccomandations based on the parameters ends here

    // See all matches modal events
    $(document).on(
      "click",
      ".seeallmatches-cls table.table tbody tr",
      function (event) {
        $(".seeallmatches-cls table.table tr").removeClass("tablerow-selected");
        $(this).addClass("tablerow-selected");
        $(".seeallmatches-cls .select_btn").removeClass("disabled");
      }
    );
    var domGlobal, skuGlobal;
    $(document).on("click", ".select_btn", function (event) {
      let name, sku;
      $(".seeallmatches-cls table.table tr").each(function () {
        if ($(this).hasClass("tablerow-selected")) {
          name = $(this).attr("prdname");
          sku = $(this).attr("skuid");
        }
      });
      let cls = $(".seeallmatches-cls").attr("curblock");
      let currentSection = $(cls).attr("data-section");
      let curBlock = "." + $olcc[currentSection][4] + " .accordion-contant";
      $olcc[currentSection + "flag"] = true;
      $olccCreateAssembly[currentSection + "_sku"] = sku;
      let dom = $olccsearch.innerDOM(name, sku,$(cls));
      let domGlobal = dom;
      let skuGlobal = sku;

      $(cls + " .result_section .icon_detail").html(dom);
      $(cls + " .result_section").removeClass("invisible");
      $(cls + " .get-all-matches").removeClass("invisible");
      let isAuto = true;
      //new imple
      $olcc.getKeySpec.getKeySpecs(curBlock, sku, isAuto, cls);
      //new imple ends here
      //same as connector
      if ($("#sameasconnector1").is(":checked")) {
        $olcc.listGroupItem.sameAsConnectorSeeAll(cls, dom, sku, isAuto);
      }
      //same as connector ends here
      $("#popup_div").modal("hide");
    });
    // See all matches modal events ends here

    $(document).on("click", ".card-header button", function () {
      let currentParent = $(this).parents(".card");
      let cardId = currentParent.attr("id");
      currentParent
        .siblings(".card")
        .removeClass("active_card active_connector_cable");
      currentParent.toggleClass("active_card");
      $(".connector_cable_wrap").each(function () {
        let currentSection = $(this).attr("data-section");
        if ($olcc[currentSection + "flag"]) {
          $(this).addClass("active_card");
          $(this).toggleClass("active_connector_cable");
        } else {
          $(this).removeClass("active_connector_cable");
        }
      });
      $olcc.scrollToCard(cardId);
    });
    //for bkend
    //custom display 
    $olcc.getAllOptions.getAllOption();

    $(".question_icon").on({
      mouseenter: function () {
        getPopuponQuestionMarkIcon($(this));
      },
      mouseleave: function () {
        $(".icon_popup").hide();
      }
    })
    $(".icon_popup").on({
      mouseenter: function () {
        $(".icon_popup").show();
      },
      mouseleave: function () {
        $(".icon_popup").hide();
      }
    });
    $("#heat-shrink").prop("checked", true);
    $(".assemblyOptions-cls .accordion-contant-section:first-child > span")
      .removeClass("selected")
      .addClass("not-selected");
    
    //tooltip//
$(".assembly-btn").on("mouseover", function () {
  //stuff to do on mouseover.
  if ($(this).find('button').hasClass('disabled')) {
    $('.assembly-btn .assembly-tooltip').css('visibility', 'visible');
  }
});
$(".assembly-btn").on("mouseout", function () {
  //stuff to do on mouseout.  
  $('.assembly-btn .assembly-tooltip').css('visibility', 'hidden');
});
    //tooltip ends here//
    
  });
  //DOM Ready ends here

  window.$olcc = {
    getAllOptions,
    getOptions,
    listGroupItem,
    angleSettings,
    search,
    getKeySpec,
    disableList,
    handlebarOlcc,
    olccModal,
    con1flag,
    con2flag,
    cablflag,
    selectData,
    resetValidator,
    con1,
    con2,
    cabl,
    labelText,
    getIdtoScroll,
    scrollToCard,
    setDomLabels,
    createCardTemplate
  };
})(jQuery);

function analyticCollectAllData(scaVal) {
  let connectorOneData = "";
  let connectorTwoData = "";
  let cableData = "";

  let cobjOne = ".analytic-connector1";
  connectorOneData = analyticSectionData(cobjOne);
  let additionalParamOne = getAdditionalParameter("one");
  let connectorOneDataFinal = connectorOneData + "@@" + additionalParamOne;

  let cobjTwo = ".analytic-connector2";
  connectorTwoData = analyticSectionData(cobjTwo);
  let additionalParamTwo = getAdditionalParameter("two");
  let connectorTwoDataFinal = connectorTwoData + "@@" + additionalParamTwo;

  let cobjThree = ".analytic-cable";
  cableData = analyticSectionData(cobjThree);
  let additionalParamCable = getAdditionalParameter("cable");
  let cableDataFinal = cableData + "@@" + additionalParamCable;

  let heatShrink = "";
  let leadFreeSolder = "";
  let clocking = "";
  let cobjFour = $(".analytic-assembly-option .accordion-contant-section > span");
  heatShrink = $(cobjFour[0]).hasClass("selected");
  leadFreeSolder = $(cobjFour[1]).hasClass("selected");
  clocking = cobjFour[2].innerHTML;

  heatShrink ? (heatShrink = "unchecked") : (heatShrink = "checked");
  leadFreeSolder
    ? (leadFreeSolder = "unchecked")
    : (leadFreeSolder = "checked");
  clocking != "" ? (clocking = "clocking") : (clocking = "0");

  analyticOlccDLcall(
    connectorOneDataFinal,
    connectorTwoDataFinal,
    cableDataFinal,
    heatShrink,
    leadFreeSolder,
    clocking,
    scaVal
  );
}

function analyticSectionData(sectionObj) {
  let sectionData = "";
  if ($(sectionObj)) {
    let cobjProperty = $(sectionObj).find(".accordion-contant-content span.strong");   
    for (i = 0; i < cobjProperty.length; i++) {
      if (i == cobjProperty.length - 1) {
        sectionData = sectionData + cobjProperty[i].innerHTML;
      } else {
        sectionData = sectionData + cobjProperty[i].innerHTML + "@@";
      }
    }
  }
  return sectionData;
}

function getAdditionalParameter(type = "") {
  let connector1SelectParameter = "";
  let connector2SelectParameter = "";
  let cableSelectParameter = "";
  let skuVar,finalskVar;

  if (type == "one") {
    if ($("#select-parameters-1").is(":checked")) {
      connector1SelectParameter = "select paremeters";
      if (
        $(".connectror1-detail-cls .parameter_section .icon_detail .sku")[0] !=
        undefined &&
        $(".connectror1-detail-cls .parameter_section .icon_detail .sku")[0] !=
        null &&
        !$(
          ".connectror1-detail-cls .parameter_section .result_section"
        ).hasClass("invisible")
      ) {
        skuVar = $(
          ".connectror1-detail-cls .parameter_section .icon_detail .sku"
        )[0].innerText;
        finalskVar = skuVar.split(":");
        connector1SelectParameter =
          connector1SelectParameter + "@@" + finalskVar[1].trim();
        return connector1SelectParameter;
      }
    } else if ($("#search-an-existing-part-number-1").is(":checked")) {
      connector1SelectParameter = "search an existing part number";
      if (
        $(
          ".connectror1-detail-cls .existing_part_number_section .icon_detail .sku"
        )[0] != undefined &&
        $(
          ".connectror1-detail-cls .existing_part_number_section .icon_detail .sku"
        )[0] != null &&
        !$(
          ".connectror1-detail-cls .existing_part_number_section .result_section"
        ).hasClass("invisible")
      ) {
        skuVar = $(
          ".connectror1-detail-cls .existing_part_number_section .icon_detail .sku"
        )[0].innerText;
        finalskVar = skuVar.split(":");
        connector1SelectParameter =
          connector1SelectParameter + "@@" + finalskVar[1].trim();
        return connector1SelectParameter;
      }
    }
  }
  if (type == "two") {
    if ($("#select-parameters-2").is(":checked")) {
      connector2SelectParameter = "select paremeters";
      if (
        $(".connectror2-detail-cls .parameter_section .icon_detail .sku")[0] !=
        undefined &&
        $(".connectror2-detail-cls .parameter_section .icon_detail .sku")[0] !=
        null &&
        !$(
          ".connectror2-detail-cls .parameter_section .result_section"
        ).hasClass("invisible")
      ) {
        skuVar = $(
          ".connectror2-detail-cls .parameter_section .icon_detail .sku"
        )[0].innerText;
        finalskVar = skuVar.split(":");
        connector2SelectParameter =
          connector2SelectParameter + "@@" + finalskVar[1].trim();
        return connector2SelectParameter;
      }
    } else if ($("#search-an-existing-part-number-2").is(":checked")) {
      connector2SelectParameter = "search an existing part number";
      if (
        $(
          ".connectror2-detail-cls .existing_part_number_section .icon_detail .sku"
        )[0] != undefined &&
        $(
          ".connectror2-detail-cls .existing_part_number_section .icon_detail .sku"
        )[0] != null &&
        !$(
          ".connectror2-detail-cls .existing_part_number_section .result_section"
        ).hasClass("invisible")
      ) {
        skuVar = $(
          ".connectror2-detail-cls .existing_part_number_section .icon_detail .sku"
        )[0].innerText;
        finalskVar = skuVar.split(":");
        connector2SelectParameter =
          connector2SelectParameter + "@@" + finalskVar[1].trim();
        return connector2SelectParameter;
      }
    }
  }
  if (type == "cable") {
    if ($("#select-parameters-3").is(":checked")) {
      cableSelectParameter = "select paremeters";

      if (
        $(".cabledetail-cls .parameter_section .icon_detail .sku")[0] !=
        undefined &&
        $(".cabledetail-cls .parameter_section .icon_detail .sku")[0] != null &&
        !$(".cabledetail-cls .parameter_section .result_section").hasClass(
          "invisible"
        )
      ) {
        skuVar = $(".cabledetail-cls .parameter_section .icon_detail .sku")[0]
          .innerText;
        finalskVar = skuVar.split(":");
        cableSelectParameter =
          cableSelectParameter + "@@" + finalskVar[1].trim();
        return cableSelectParameter;
      }
    } else if ($("#search-an-existing-part-number-3").is(":checked")) {
      cableSelectParameter = "search an existing part number";
      if (
        $(
          ".cabledetail-cls .existing_part_number_section .icon_detail .sku"
        )[0] != undefined &&
        $(
          ".cabledetail-cls .existing_part_number_section .icon_detail .sku"
        )[0] != null &&
        !$(
          ".cabledetail-cls .existing_part_number_section .result_section"
        ).hasClass("invisible")
      ) {
        skuVar = $(
          ".cabledetail-cls .existing_part_number_section .icon_detail .sku"
        )[0].innerText;
        finalskVar = skuVar.split(":");
        cableSelectParameter =
          cableSelectParameter + "@@" + finalskVar[1].trim();
        return cableSelectParameter;
      }
    }
  }
}

//reload on back button
window.addEventListener("pageshow", function (event) {
  var historyTraversal = event.persisted ||
    (typeof window.performance != "undefined" &&
      window.performance.navigation.type === 2);
  if (historyTraversal) {
    // Handle page restore.
    window.location.reload();
  }
});
//reload on back button
  

