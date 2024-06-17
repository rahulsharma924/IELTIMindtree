//code for analytic data track on PLP product image & text click
document.querySelector("body").addEventListener(
  "click",
  function (e) {
    var image = e.target.closest("img");
    var anchor = e.target.closest("a");
    if (
      (image !== null &&
        image !== undefined &&
        image.closest(".analyticplptrack") != null) ||
      (anchor !== null &&
        anchor !== undefined &&
        anchor.closest(".analyticplptrack") != null) ||
      (anchor !== null &&
        anchor !== undefined &&
        anchor.closest(".analyticdatasheet") != null) ||
      (anchor !== null &&
        anchor !== undefined &&
        anchor.closest(".analyticcompare") != null)
    ) {
      if (image !== null && image !== undefined) {
        mainDiv = image.closest(".analyticplptrack");
        childDiv = mainDiv.childNodes;
        productDetailsVal = childDiv["1"].value;
        //productDetailsVal=document.getElementById("analyticproddetail").value;
        productDetailsArray = productDetailsVal.split("@@");
        for (i = 0; i < productDetailsArray.length; i++) {
          if (productDetailsArray[i] === "undefined") {
            productDetailsArray[i] = "";
          }
        }
        callCtaDL(productDetailsArray[1], productDetailsArray[9]);
      } else if (
        anchor !== null &&
        anchor !== undefined &&
        anchor.closest(".analyticplptrack") != null
      ) {
        mainDiv = anchor.closest(".analyticplptrack");
        childDiv = mainDiv.childNodes;
        productDetailsVal = childDiv["1"].value;
        productDetailsArray = productDetailsVal.split("@@");
        for (i = 0; i < productDetailsArray.length; i++) {
          if (productDetailsArray[i] === "undefined") {
            productDetailsArray[i] = "";
          }
        }
        callCtaDL(productDetailsArray[1], productDetailsArray[9]);
      } else if (
        anchor !== null &&
        anchor !== undefined &&
        anchor.closest(".analyticdatasheet") != null
      ) {
        mainDiv = anchor.closest(".analyticdatasheet");
        childDiv = mainDiv.childNodes;
        dataSheetVal = childDiv["1"].value;
        dataSheetArray = dataSheetVal.split("@@");
        for (i = 0; i < dataSheetArray.length; i++) {
          if (dataSheetArray[i] === "undefined") {
            dataSheetArray[i] = "";
          }
        }
        documentDLCall(dataSheetArray, "Click");
      } else if (
        anchor !== null &&
        anchor !== undefined &&
        anchor.closest(".analyticcompare") != null
      ) {
        var prodArray = localStorage.getItem("compArr");
        var compFinalarr = JSON.parse(prodArray);
        if (compFinalarr.length > 4) {
          compFinalarr.splice(0, compFinalarr.length - 4);
        }
        labelText = "Compare-";
        for (const key in compFinalarr) {
          if (compFinalarr.hasOwnProperty(key)) {
            sku = compFinalarr[key];
            if (key == compFinalarr.length - 1) {
              labelText = labelText + sku;
            } else {
              labelText = labelText + sku + "|";
            }
          }
        }
        label = labelText;
        category = "Compare - plp";
        callCtaDL(label, category);
      }
      return false;
    } else {
      return true;
    }
  },
  false
);

//analytic code for CTA link call on prod img & prod text click
function callCtaDL(lb, prodcat) {
  prodcat.length > 0 ? (pdcat = prodcat.replaceAll(",", "/")) : (pdcat = "");

  var urlString = window.location.href;
  var url = new URL(urlString);

  specificCategory = url.searchParams.get(algoliaIndex);
  if (specificCategory == null) {
    specificCategory = "";
  }
  ctalinkDataLayerCall(lb, pdcat, specificCategory);
}

//analytics code to track clicks on left nav filters
document.querySelector("body").addEventListener(
  "change",
  function (e) {
    var inputValue ="";
    var selectElement = e.target.closest(".analyticsplpfilter");
    if (selectElement != null && selectElement != "") {
      var filterlabel = selectElement
        .querySelector(".accordion-head")
        .textContent.trim();
      var inputElement = e.target.closest("input");
      if (inputElement != null && inputElement != "" && selectElement != null) {
        if(inputElement.nextElementSibling !=null){
           inputValue = inputElement.nextElementSibling.textContent.trim();
        }
        var checkFlag = "n";
        if (inputElement.checked === true) {
          checkFlag = "y";
        }
        var urlString = window.location.href;
        var url = new URL(urlString);
        var params = [];
        specificCategory = url.searchParams.get(algoliaIndex);
        if (specificCategory == null) {
          specificCategory = "";
        }
        params = getSearchFilterParams(filterlabel, inputValue, checkFlag);
        plpFilterInteracted(params, checkFlag, specificCategory);
      }
    }
  },
  false
);

//analytics code to track clicks on left nav clear refinements filters
document.querySelector("body").addEventListener(
  "click",
  function (e) {
    var selectClearElement = e.target.closest("span");
    if (
      selectClearElement != null &&
      selectClearElement != "" &&
      selectClearElement.className == "ais-CurrentRefinements-category"
    ) {
      var urlString = window.location.href;
      var url = new URL(urlString);
      var params = [];
      var checkFlag = "n";
      specificCategory = url.searchParams.get(algoliaIndex);
      if (specificCategory == null) {
        specificCategory = "";
      }
      params = getSearchFilterParams();
      plpFilterInteracted(params, checkFlag, specificCategory);
    }
  },
  false
);

//analytics code to get left navigation filter params
function getSearchFilterParams(filterlabel, inputValue, checkFlag, Price) {
  var urlString = window.location.href;
  var url = new URL(urlString);
  var filterparams = [];
  var isKeyFlag = false;
  if (
    typeof filterlabel !== "undefined" &&
    typeof inputValue !== "undefined" &&
    filterlabel !== null &&
    inputValue !== null
  ) {
    if (checkFlag === "y") {
      filterparams[filterlabel] = inputValue;
    }
  }
  url.searchParams.forEach(function (value, key) {
    if (key.indexOf("ta_flangeSize") !== -1) {
      key = "Flange Size";
      isKeyFlag = true;
    }
    if (key.indexOf("ta_maxFrequency") !== -1) {
      key = "Max Frequency";
      isKeyFlag = true;
    }
    if (key.indexOf("ta_minFrequency") !== -1) {
      key = "Min Frequency";
      isKeyFlag = true;
    }
    if (key.indexOf("ta_waveguideSize") !== -1) {
      key = "Wave Guide Size";
      isKeyFlag = true;
    }
    if (key.indexOf("startingPrice") !== -1) {
      key = "Price";
      if (Price === "" || typeof inputValue === "undefined") {
        isKeyFlag = true;
      } else {
        isKeyFlag = false;
      }
    }
    if (isKeyFlag === true) {
      if (filterparams[key] !== undefined) {
        if (!Array.isArray(filterparams[key])) {
          filterparams[key] = [filterparams[key]];
        }
        filterparams[key].push(value);
      } else {
        filterparams[key] = value;
      }
    }
  });
  return filterparams;
}

//analytics code for slider tracking
document.querySelector("body").addEventListener(
  "mouseup",
  function (e) {
    var myElement = e.target.closest("div");
    if (
      myElement != null &&
      myElement != "" &&
      (myElement.className == "rheostat-handle rheostat-handle-lower" ||
        myElement.className == "rheostat-handle rheostat-handle-upper")
    ) {
      var Price =
        e.target.parentElement
          .querySelector(".rheostat-handle-lower")
          .textContent.trim() +
        ":" +
        e.target.parentElement
          .querySelector(".rheostat-handle-upper")
          .textContent.trim();
      var urlString = window.location.href;
      var url = new URL(urlString);
      var inputValue = "";
      var filterlabel = "";
      var checkFlag = "";
      var params = [];
      specificCategory = url.searchParams.get(algoliaIndex);
      if (specificCategory == null) {
        specificCategory = "";
      }
      if (Price != null && Price != "") {
        filterlabel = "Price";
        inputValue = Price;
        checkFlag = "y";
      }
      params = getSearchFilterParams(filterlabel, inputValue, checkFlag, Price);
      plpFilterInteracted(params, checkFlag, specificCategory);
    }
  },
  false
);
