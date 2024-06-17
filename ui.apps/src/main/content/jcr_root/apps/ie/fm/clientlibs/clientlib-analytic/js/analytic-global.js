window.dataLayer = window.dataLayer || [];
//code of device type
!(function (a) {
  var b = /iPhone/i,
    c = /iPod/i,
    d = /iPad/i,
    e = /(?=.*\bAndroid\b)(?=.*\bMobile\b)/i,
    f = /Android/i,
    g = /(?=.*\bAndroid\b)(?=.*\bSD4930UR\b)/i,
    h =
      /(?=.*\bAndroid\b)(?=.*\b(?:KFOT|KFTT|KFJWI|KFJWA|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|KFARWI|KFASWI|KFSAWI|KFSAWA)\b)/i,
    i = /Windows Phone/i,
    j = /(?=.*\bWindows\b)(?=.*\bARM\b)/i,
    k = /BlackBerry/i,
    l = /BB10/i,
    m = /Opera Mini/i,
    n = /(CriOS|Chrome)(?=.*\bMobile\b)/i,
    o = /(?=.*\bFirefox\b)(?=.*\bMobile\b)/i,
    p = new RegExp("(?:Nexus 7|BNTV250|Kindle Fire|Silk|GT-P1000)", "i"),
    q = function (a, b) {
      return a.test(b);
    },
    r = function (a) {
      var r = a || navigator.userAgent,
        s = r.split("[FBAN");
      if (
        ("undefined" != typeof s[1] && (r = s[0]),
        (s = r.split("Twitter")),
        "undefined" != typeof s[1] && (r = s[0]),
        (this.apple = {
          phone: q(b, r),
          ipod: q(c, r),
          tablet: !q(b, r) && q(d, r),
          device: q(b, r) || q(c, r) || q(d, r)
        }),
        (this.amazon = {
          phone: q(g, r),
          tablet: !q(g, r) && q(h, r),
          device: q(g, r) || q(h, r)
        }),
        (this.android = {
          phone: q(g, r) || q(e, r),
          tablet: !q(g, r) && !q(e, r) && (q(h, r) || q(f, r)),
          device: q(g, r) || q(h, r) || q(e, r) || q(f, r)
        }),
        (this.windows = {
          phone: q(i, r),
          tablet: q(j, r),
          device: q(i, r) || q(j, r)
        }),
        (this.other = {
          blackberry: q(k, r),
          blackberry10: q(l, r),
          opera: q(m, r),
          firefox: q(o, r),
          chrome: q(n, r),
          device: q(k, r) || q(l, r) || q(m, r) || q(o, r) || q(n, r)
        }),
        (this.seven_inch = q(p, r)),
        (this.any =
          this.apple.device ||
          this.android.device ||
          this.windows.device ||
          this.other.device ||
          this.seven_inch),
        (this.phone =
          this.apple.phone || this.android.phone || this.windows.phone),
        (this.tablet =
          this.apple.tablet || this.android.tablet || this.windows.tablet),
        "undefined" == typeof window)
      )
        return this;
    },
    s = function () {
      var a = new r();
      return (a.Class = r), a;
    };
  "undefined" != typeof module && module.exports && "undefined" == typeof window
    ? (module.exports = r)
    : "undefined" != typeof module &&
      module.exports &&
      "undefined" != typeof window
    ? (module.exports = s())
    : "function" == typeof define && define.amd
    ? define("isMobile", [], (a.isMobile = s()))
    : (a.isMobile = s());
})(this);

function getLoggedInUserDetails() {
  var i,
    x,
    y,
    ARRcookies = document.cookie.split(";");
  var userState = "";
  var customerId = "";
  var customerWebId = "";
  var billingAddPostalcode = "";
  var shippingAddPostalcode = "";
  for (i = 0; i < ARRcookies.length; i++) {
    x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
    y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
    x = x.replace(/^\s+|\s+$/g, "");
    if (x == "customerInfo") {
      if (document.cookie.length != 0) {
        var custobject = JSON.parse(y);
        if (
          custobject["statusCode"] != "401" &&
          custobject["statusCode"] != "400"
        ) {
          //condition aded to validate error scenario
          if (
            custobject["customer"]["id"] != null &&
            custobject["customer"]["id"] != undefined
          ) {
            customerId = custobject["customer"]["id"];
          }
          if (
            custobject["customer"]["key"] != null &&
            custobject["customer"]["key"] != undefined
          ) {
            customerWebId = custobject["customer"]["key"];
          }
          if (
            custobject["customer"]["addresses"] != null &&
            custobject["customer"]["addresses"] != undefined
          ) {
            for (
              var j = 0;
              j < custobject["customer"]["addresses"].length;
              j++
            ) {
              if (
                custobject["customer"]["addresses"][j].id ==
                custobject["customer"]["defaultBillingAddressId"]
              ) {
                billingAddPostalcode =
                  custobject["customer"]["addresses"][j].postalCode;
              }
              if (
                custobject["customer"]["addresses"][j].id ==
                custobject["customer"]["defaultShippingAddressId"]
              ) {
                shippingAddPostalcode =
                  custobject["customer"]["addresses"][j].postalCode;
              }
            }
          }
          userState = "loggedIn";
          userState =
            userState +
            "@@" +
            customerId +
            "@@" +
            customerWebId +
            "@@" +
            billingAddPostalcode +
            "@@" +
            shippingAddPostalcode;
        }
      }
    }
  }
  userState != "" ? (userState = userState) : (userState = "Guest");
  return userState;
}

function globalsearchDataLayer(
  overallsercount,
  sercat,
  resultcountcat,
  reslultpgagecount,
  prodsku,
  prodname,
  searchterm,
  searchtype,
  searchlist = ""
) {
  //alert("overallsercount->"+overallsercount+" sercat->"+sercat+" resultcountcat->"+resultcountcat+" reslultpgagecount->"+reslultpgagecount+" prodsku->"+prodsku+" prodname->"+prodname+" searchterm->"+searchterm+" searchtype->"+searchtype);
  var userstate = getLoggedInUserDetails(),
    id = "",
    userwebid,
    webid = "",
    ustate;
  if (userstate != "Guest") {
    ustate = userstate.split("@@")[0];
    id = userstate.split("@@")[1];
    userwebid = userstate.split("@@")[2];
    webid = userwebid.split("-")[0];
    //alert(id +"-->"+webid);
  } else {
    ustate = userstate;
    id = "anonymous";
    webid = "unknown";
  }
  searchlist != "" ? (searchlist = searchlist) : (searchlist = "global");

  dataLayer.push({
    event: "searchInteracted",
    search: {
      searchResults: {
        searchList: searchlist,
        overallSearchCount: overallsercount,
        seachCategory: sercat, // product or content
        resultsCountCategory: resultcountcat, // product count or content count
        resultPageCount: reslultpgagecount,
        userId: id,
        webId: webid,
        visitorState: ustate,
        productSku: prodsku,
        productName: prodname
      },
      searchParams: {
        searchInfo: {
          searchTerm: searchterm,
          searchType: searchtype
        }
      }
    }
  });
}
function viewcartDataLayer(pageCategory) {
  //same as clear cart
  var prodcutDetails = document.getElementById("analytic-clearcart").value,
    prodArray = JSON.parse(prodcutDetails),
    prodcutObj = "",
    productArr = [],
    userstate = getLoggedInUserDetails(),
    id = "",
    ustate,
    pageurl,
    pagename,
    priceamt,
    productName,
    userwebid,
    webid = "";
  if (userstate != "Guest") {
    ustate = userstate.split("@@")[0];
    id = userstate.split("@@")[1];
    userwebid = userstate.split("@@")[2];
    webid = userwebid.split("-")[0];
    //alert(id +"-->"+webid);
  } else {
    ustate = userstate;
    id = "anonymous";
    webid = "unknown";
  }
  pageurl = location.protocol + "//" + location.hostname + location.pathname;
  pagename = pageName;
  for (i = 0; i < prodArray.length; i++) {
    if (prodArray[i].variant != undefined && prodArray[i]?.variant != null) {
      priceamt = (
        prodArray[i]?.variant?.prices[0]?.value?.centAmount / 100
      ).toFixed(2);
    } else if (prodArray[i].money != undefined && prodArray[i].money != null) {
      priceamt = (prodArray[i]?.money.centAmount / 100).toFixed(2);
    }
    priceamt = priceamt.replace("$", "");
    productName = "";
    if (prodArray[i].name["en"] != undefined && prodArray[i].name["en"] != "") {
      productName = prodArray[i].name["en"];
    } else if (
      prodArray[i].name["en-US"] != undefined &&
      prodArray[i].name["en-US"] != ""
    ) {
      productName = prodArray[i].name["en-US"];
    } else {
      productName = "";
    }

    let product_sku = prodArray[i]?.variant?.sku
      ? prodArray[i]?.variant?.sku
      : prodArray[i].custom?.fields?.masterSku
      ? prodArray[i].custom?.fields?.masterSku
      : "";
    let productType = prodArray[i].productType?.id
      ? prodArray[i].productType.id
      : prodArray[i].custom?.type.id
      ? prodArray[i].custom?.type.id
      : "";
    let product_id = prodArray[i]?.productId
      ? prodArray[i].productId
      : prodArray[i]?.id;
    prodcutObj =
      '{"productSku": "' +
      product_sku +
      '","productName": "' +
      productName +
      '","productId": "' +
      product_id +
      '","productPrice": "' +
      priceamt +
      '","productType": "' +
      productType +
      '","productLength": "","productColor": "","productCategory": "","bestSellerRank": "","startingPrice": "","quantity": "' +
      prodArray[i].quantity +
      '","brand": "Fairview Microwave","pageUrl": "' +
      pageurl +
      '","pageName": "' +
      pagename +
      '","pageCategory": "' +
      pageCategory +
      '","visitorState": "' +
      ustate +
      '","webId": "' +
      webid +
      '","userId": "' +
      id +
      '"}';
    productArr.push(JSON.parse(prodcutObj));
  }
  dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
  dataLayer.push({
    event: "cartView",
    cart_View: {
      products: productArr
    }
  });
}
function compareProdDataLayer(cmpresult) {
  var prodcutDetails = JSON.stringify(cmpresult),
    prodArray = JSON.parse(prodcutDetails),
    prodcutObj = "",
    productArr = [],
    ustate = getLoggedInUserDetails();
  ustate != "Guest" ? (ustate = "loggedIn") : (ustate = ustate);
  var pageurl =
    location.protocol + "//" + location.hostname + location.pathname;
  //pagename=pageName;
  var pagename = "compare",
    productComparedID = "",
    productCompared = "";
  for (i = 0; i < prodArray.length; i++) {
    var prodcat = "",
      prodcat,
      procategory = prodArray[i].category;
    if (procategory) {
      for (j = 0; j < procategory.length; j++) {
        if (j == procategory.length - 1) {
          prodcat = prodcat + procategory[j];
        } else {
          prodcat = prodcat + procategory[j] + "/";
        }
      }
    }
    var prdPrice = prodArray[i].unitPrice,
      prdPriceString = JSON.stringify(prdPrice),
      finalprdPrice = prdPriceString.replace("$", "");
    //indexofDoller=prdPrice.indexof("$");
    //prdPrice=prdPrice.
    //prdPrice="$29.0";
    prodcutObj =
      '{"productSku": "' +
      prodArray[i].brandSKU +
      '","productName": "' +
      prodArray[i].name +
      '","productId": "' +
      prodArray[i].productId +
      '","productPrice": "' +
      finalprdPrice +
      '","productCategory": "' +
      prodcat +
      '","estimatedDelivery": "","productType": "","productLength": "' +
      prodArray[i].length +
      '","productColor": "' +
      prodArray[i].color +
      '","brand": "Fairview Microwave","bestSellerRank": "' +
      prodArray[i].bestSellerRank +
      '","quantity": "","pageUrl": "' +
      pageurl +
      '","pageName": "' +
      pagename +
      '","pageCategory": "compare-product","visitorState": "' +
      ustate +
      '"}';
    if (i == prodArray.length - 1) {
      productComparedID = productComparedID + prodArray[i].productId;
      productCompared = productCompared + prodArray[i].brandSKU;
    } else {
      productComparedID = productComparedID + prodArray[i].productId + "|";
      productCompared = productCompared + prodArray[i].brandSKU + "|";
    }
    productArr.push(JSON.parse(prodcutObj));
  }
  dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
  dataLayer.push({
    event: "compareProduct",
    compareProducts: {
      pageCategory: "compare-product",
      pageName: "compare",
      pageUrl: location.protocol + "//" + location.hostname + location.pathname,
      productComparedID: productComparedID,
      products: productArr,
      productCompared: productCompared
    }
  });
}

//function for checkout DataLayer Call
function checkoutDataLayer(itemsArr, pageCategory, step, option) {
  var productObj = "",
    productArr = [],
    userstate = getLoggedInUserDetails(),
    ustate = "",
    id = "",
    pageurl,
    webid = "";
  if (userstate != "Guest") {
    ustate = "loggedIn";
    id = userstate.split("@@")[1];
    userwebid = userstate.split("@@")[2];
    webid = userwebid.split("-")[0];
  } else {
    ustate = userstate;
    id = "anonymous";
    webid = "unknown";
  }
  pageurl = location.protocol + "//" + location.hostname + location.pathname;
  pagename = pageName;
  for (i = 0; i < itemsArr.length; i++) {
    items = itemsArr[i].split("@@");
    //prdPrice=items[3];
    prdPrice = items[3].replace("$", "");
    productObj =
      '{"productSku": "' +
      items[0] +
      '","productName": "' +
      items[1] +
      '","productId": "' +
      items[2] +
      '","productPrice": "' +
      prdPrice +
      '","shippingAndHandling": "' +
      items[4] +
      '","shippingPrice": "' +
      items[5] +
      '","handlingPrice": "' +
      items[6] +
      '","beforeTaxPrice": "' +
      items[7] +
      '","estimatedTaxCollected": "' +
      items[8] +
      '","totalPrice": "' +
      items[9] +
      '","estimatedDelivery": "' +
      items[10] +
      '","productType": "' +
      items[11] +
      '","bestSellerRank": "' +
      items[13] +
      '","productLength": "' +
      items[15] +
      '","productColor": "' +
      items[14] +
      '","startingPrice": "' +
      items[17] +
      '","quantity": "' +
      items[12] +
      '","productCategory": "' +
      items[16] +
      '","brand": "Fairview Microwave","pageUrl": "' +
      pageurl +
      '","pageName": "' +
      pagename +
      '","pageCategory": "' +
      pageCategory +
      '","visitorState": "' +
      ustate +
      '","userId": "' +
      id +
      '","webId": "' +
      webid +
      '"}';
    productArr.push(JSON.parse(productObj));
  }

  dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
  dataLayer.push({
    event: "checkout",
    checkout: {
      ecommerce: {
        actionFeild: {
          step: step,
          option: option,
          action: "checkout"
        },
        products: {
          products: productArr
        }
      }
    }
  });
  bluconicDataCapture("checkout");
}

//function for purchase DataLayer Call
function purchaseDataLayer(itemsArr, purchaseDetailObj, pageCategory) {
  if (!purchaseDetailObj && !purchaseDetailObj.length) {
    return;
  }
  var productObj = "",
    productArr = [],
    purchaseArr = [],
    purchaseArr = purchaseDetailObj.split("@@"),
    userstate = getLoggedInUserDetails(),
    ustate = "",
    userwebid,
    pagename,
    pageurl,
    id = "",
    webid = "";
  if (userstate != "Guest") {
    ustate = "loggedIn";
    id = userstate.split("@@")[1];
    userwebid = userstate.split("@@")[2];
    webid = userwebid.split("-")[0];
  } else {
    ustate = userstate;
    id = "anonymous";
    webid = "unknown";
  }
  pageurl = location.protocol + "//" + location.hostname + location.pathname;
  pagename = pageName;
  for (let i = 0; i < itemsArr.length; i++) {
    var items = itemsArr[i].split("@@");
    var prdPrice = items[3].replace("$", "");
    productObj =
      '{"productSku": "' +
      items[0] +
      '","productName": "' +
      items[1] +
      '","productId": "' +
      items[2] +
      '","productPrice": "' +
      prdPrice +
      '","shippingAndHandling": "' +
      items[4] +
      '","shippingPrice": "' +
      items[5] +
      '","handlingPrice": "' +
      items[6] +
      '","beforeTaxPrice": "' +
      items[7] +
      '","estimatedTaxCollected": "' +
      items[8] +
      '","totalPrice": "' +
      items[9] +
      '","estimatedDelivery": "' +
      items[10] +
      '","productType": "' +
      items[11] +
      '","bestSellerRank": "' +
      items[13] +
      '","productLength": "' +
      items[15] +
      '","productColor": "' +
      items[14] +
      '","startingPrice": "' +
      items[17] +
      '","quantity": "' +
      items[12] +
      '","productCategory": "' +
      items[16] +
      '","brand": "Fairview Microwave","pageUrl": "' +
      pageurl +
      '","pageName": "' +
      pagename +
      '","pageCategory": "' +
      pageCategory +
      '","visitorState": "' +
      ustate +
      '","userId": "' +
      id +
      '","webId": "' +
      webid +
      '"}';
    productArr.push(JSON.parse(productObj));
  }

  dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
  dataLayer.push({
    event: "purchase",
    purchaseProd: {
      products: {
        productArr
      },
      purchaseDetails: {
        purchaseID: purchaseArr[0].slice(1, purchaseArr[0].length),
        Orders: purchaseArr[1],
        Units: purchaseArr[2],
        Revenue: purchaseArr[3],
        bcRevenue: purchaseArr[3].replace(",", ""),
        paymentMethod: purchaseArr[4],
        shippingMethod: purchaseArr[5]
      },
      shippingAddress: {
        shippingPostalcode: purchaseArr[6],
        shippingState: purchaseArr[7],
        shippingCity: purchaseArr[8],
        shippingCountry: purchaseArr[9]
      }
    }
  });
}

function clearCartDataLayer(pageCategory) {
  var prodcutDetails = document.getElementById("analytic-clearcart").value,
    prodArray = JSON.parse(prodcutDetails),
    prodcutObj = "",
    productArr = [],
    userstate = getLoggedInUserDetails(),
    id = "",
    pageurl,
    userwebid,
    pagename,
    ustate,
    webid = "";
  if (userstate != "Guest") {
    ustate = userstate.split("@@")[0];
    id = userstate.split("@@")[1];
    userwebid = userstate.split("@@")[2];
    webid = userwebid.split("-")[0];
    //alert(id +"-->"+webid);
  } else {
    ustate = userstate;
    id = "anonymous";
    webid = "unknown";
  }
  pageurl = location.protocol + "//" + location.hostname + location.pathname;
  pagename = pageName;

  for (var i = 0; i < prodArray.length; i++) {
    let priceamt = "",
      productName = "",
      productSku = "",
      productId = "",
      productType = "",
      productLength = "";
    if (prodArray[i].name["en"] != undefined && prodArray[i].name["en"] != "") {
      productName = prodArray[i].name["en"];
    } else if (
      prodArray[i].name["en-US"] != undefined &&
      prodArray[i].name["en-US"] != ""
    ) {
      productName = prodArray[i].name["en-US"];
    } else {
      productName = "";
    }
    //priceamt = ((prodArray[i].variant.prices[0].value.centAmount / 100).toFixed(2) || (prodArray[i].money.centAmount / 100).toFixed(2));
    if (prodArray[i].money) {
      priceamt = (prodArray[i].money.centAmount / 100).toFixed(2);
    }
    if (prodArray[i].variant) {
      priceamt = (
        prodArray[i].variant.prices[1].value.centAmount / 100
      ).toFixed(2);
    }
    priceamt = priceamt.replace("$", "");

    if (prodArray[i].variant) {
      productSku = prodArray[i].variant.sku;
    }
    if (prodArray[i].custom) {
      productSku = prodArray[i].custom.fields.masterSku;
    }
    if (prodArray[i].productId) {
      productId = prodArray[i].productId;
    }
    if (prodArray[i].id) {
      productId = prodArray[i].id;
    }
    if (prodArray[i].productType) {
      productType = prodArray[i].productType.id;
    }
    if (prodArray[i].custom) {
      productLength = prodArray[i].custom.fields.customlength;
    }
    prodcutObj =
      '{"productSku": "' +
      productSku +
      '","productName": "' +
      productName +
      '","productId": "' +
      productId +
      '","productPrice": "' +
      priceamt +
      '","productType": "' +
      productType +
      '","productLength": "' +
      productLength +
      '","productColor": "","productCategory": "","quantity": "' +
      prodArray[i].quantity +
      '","brand": "Fairview Microwave","pageUrl": "' +
      pageurl +
      '","pageName": "' +
      pagename +
      '","pageCategory": "' +
      pageCategory +
      '","visitorState": "' +
      ustate +
      '","webId": "' +
      webid +
      '","userId": "' +
      id +
      '"}';
    productArr.push(JSON.parse(prodcutObj));
  }

  dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
  dataLayer.push({
    event: "clearFromCart",
    ecommerce: {
      actionFeild: {
        list: pageCategory,
        action: "clear"
      },
      clear: {
        products: productArr
      }
    }
  });
}

function removecartDataLayer(prodArray, pgcategory) {
  var userstate = getLoggedInUserDetails(),
    id = "",
    ustate,
    userwebid,
    productArr,
    pageurl,
    prodPrice,
    prodcutObj,
    pagename,
    webid = "";
  if (userstate != "Guest") {
    ustate = userstate.split("@@")[0];
    id = userstate.split("@@")[1];
    userwebid = userstate.split("@@")[2];
    webid = userwebid.split("-")[0];
    //alert(id +"-->"+webid);
  } else {
    ustate = userstate;
    id = "anonymous";
    webid = "unknown";
  }
  productArr = [];
  pageurl = location.protocol + "//" + location.hostname + location.pathname;
  pagename = pageName;
  for (i = 0; i < prodArray.length; i++) {
    prodPrice = "";
    prodArray[i][3] != ""
      ? (prodPrice = prodArray[i][3].replace("$", ""))
      : (prodPrice = "");
    prodcutObj =
      '{"productSku": "' +
      prodArray[i][0] +
      '","productName": "' +
      prodArray[i][1] +
      '","productId": "' +
      prodArray[i][2] +
      '","productPrice": "' +
      prodPrice +
      '","productType": "' +
      prodArray[i][4] +
      '","productLength": "","productColor": "","productCategory": "","quantity": "' +
      prodArray[i][5] +
      '","brand": "Fairview Microwave","pageUrl": "' +
      pageurl +
      '","pageName": "' +
      pagename +
      '","pageCategory": "' +
      pgcategory +
      '","visitorState": "' +
      ustate +
      '","webId": "' +
      webid +
      '","userId": "' +
      id +
      '"}';
    productArr.push(JSON.parse(prodcutObj));
  }

  dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
  dataLayer.push({
    event: "removeFromCart",
    ecommerce: {
      actionFeild: {
        list: pgcategory,
        action: "remove"
      },
      remove: {
        // "remove" actionFieldObject measures.
        products: productArr
      }
    }
  });
  bluconicDataCapture(pgcategory);
}

function addToCartDataLayer(skuval, qntval, prodcutArr, pgcategory) {
  var userstate = getLoggedInUserDetails(),
    id = "",
    ustate,
    userwebid,
    prodCategory,
    webid = "";
  if (userstate != "Guest") {
    ustate = userstate.split("@@")[0];
    id = userstate.split("@@")[1];
    userwebid = userstate.split("@@")[2];
    webid = userwebid.split("-")[0];
    //alert(id +"-->"+webid);
  } else {
    ustate = userstate;
    id = "anonymous";
    webid = "unknown";
  }
  //alert(prodcutArr.length+"  brandSKU-->"+prodcutArr[0]+"  name-->"+prodcutArr[1]+"  productId-->"+prodcutArr[2]+"  unitPrice-->"+prodcutArr[3]+"  startingPrice-->"+prodcutArr[4]+"  length-->"+prodcutArr[5]+"  color-->"+prodcutArr[6]+"  bestSellerRank-->"+prodcutArr[7]+"  inventory-->"+prodcutArr[8]+" pgcat-->"+pgcategory+" Product Category-->"+prodcutArr[9]+" Page Category-->"+prodcutArr[10]);
  //alert(qntval);
  //alert(prodcutArr.length+"  brandSKU-->"+prodcutArr[0]+"  name-->"+prodcutArr[1]+"  productId-->"+prodcutArr[2]+"  unitPrice-->"+prodcutArr[3]+"  startingPrice-->"+prodcutArr[4]+"  length-->"+prodcutArr[5]+"  color-->"+prodcutArr[6]+"  bestSellerRank-->"+prodcutArr[7]+"  inventory-->"+prodcutArr[8]+" pgcat-->"+pgcategory+" Product Category-->"+prodcutArr[9]);
  prodCategory = "";
  if (prodcutArr[9] != "") {
    prodcutArr[9].length > 0
      ? (prodCategory = prodcutArr[9].replaceAll(",", "/"))
      : (prodCategory = "");
  }
  if (
    prodcutArr[10] != null &&
    (prodcutArr[10] != undefined) & (prodcutArr[10] != "")
  ) {
    pgcategory = prodcutArr[10];
  }
  //alert(prodCategory);
  dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
  dataLayer.push({
    event: "addToCart",
    ecommerce: {
      actionFeild: {
        list: pgcategory,
        action: "add"
      },
      add: {
        // "add" actionFieldObject measures.
        products: [
          {
            //  adding a product to a shopping cart.
            productSku: prodcutArr[0],
            productName: prodcutArr[1],
            productId: prodcutArr[2],
            productPrice: prodcutArr[3].replace("$", ""),
            productStartingPrice: prodcutArr[4],
            productCategory: prodCategory,
            estimatedDelivery: "",
            productType: "",
            productLength: prodcutArr[5],
            productColor: prodcutArr[6],
            pageUrl:
              location.protocol + "//" + location.hostname + location.pathname,
            pageName: pageName,
            pageCategory: pgcategory,
            bestSellerRank: prodcutArr[7],
            quantity: qntval,
            brand: "Fairview Microwave",
            visitorState: ustate,
            webId: webid,
            userId: id
          }
        ]
      }
    }
  });
}

function addToCartAllProdDL(
  prodArray,
  quantity = "",
  rfcaTesting = "",
  pageCategory = ""
) {
  var prodcutObj = "",
    productArr = [],
    userstate = getLoggedInUserDetails(),
    id = "",
    ustate,
    pageurl,
    pagename,
    userwebid,
    webid = "";
  if (userstate != "Guest") {
    ustate = userstate.split("@@")[0];
    id = userstate.split("@@")[1];
    userwebid = userstate.split("@@")[2];
    webid = userwebid.split("-")[0];
    //alert(id +"-->"+webid);
  } else {
    ustate = userstate;
    id = "anonymous";
    webid = "unknown";
  }
  pageurl = location.protocol + "//" + location.hostname + location.pathname;
  pagename = pageName;

  for (i = 0; i < prodArray.length; i++) {
    var priceamt = "",
      productName = "",
      productSku = "",
      productId = "",
      productType = "",
      productLength = "",
      prodQuantity = "",
      prodCategory = "";
    if (prodArray[i].name["en"] != undefined && prodArray[i].name["en"] != "") {
      productName = prodArray[i].name["en"];
    } else if (
      prodArray[i].name["en-US"] != undefined &&
      prodArray[i].name["en-US"] != ""
    ) {
      productName = prodArray[i].name["en-US"];
    } else {
      productName = "";
    }
    //priceamt = ((prodArray[i].variant.prices[0].value.centAmount / 100).toFixed(2) || (prodArray[i].money.centAmount / 100).toFixed(2));
    if (prodArray[i].money) {
      priceamt = (prodArray[i].money.centAmount / 100).toFixed(2);
    }
    if (prodArray[i].variant) {
      priceamt = (
        prodArray[i].variant.prices[1].value.centAmount / 100
      ).toFixed(2);
    }
    priceamt = priceamt.replace("$", "");

    if (prodArray[i].variant) {
      productSku = prodArray[i].variant.sku;
    }
    if (prodArray[i].custom) {
      productSku = prodArray[i].custom.fields.masterSku;
    }
    if (prodArray[i].productId) {
      productId = prodArray[i].productId;
    }
    if (prodArray[i].id) {
      productId = prodArray[i].id;
    }
    if (prodArray[i].productType) {
      productType = prodArray[i].productType.id;
    }
    if (prodArray[i].custom) {
      productLength = prodArray[i].custom.fields.customlength;
    }
    if (quantity != "") {
      prodQuantity = quantity;
    } else {
      prodQuantity = prodArray[i].quantity;
    }
    if (productSku != "") {
      rfcaTesting ? (rfcaTesting = "selected") : (rfcaTesting = "unselected");
    } else {
      rfcaTesting = "";
    }
    rfcaTesting
      ? (prodCategory = "Custom Cable Assembly")
      : (prodCategory = ""); //for olcc product prod category

    prodcutObj =
      '{"productSku": "' +
      productSku +
      '","productName": "' +
      productName +
      '","productId": "' +
      productId +
      '","productPrice": "' +
      priceamt +
      '","productStartingPrice": "","productType": "' +
      productType +
      '","productLength": "' +
      productLength +
      '","productColor": "","rfcaTesting": "' +
      rfcaTesting +
      '","bestSellerRank": "","productCategory": "' +
      prodCategory +
      '","estimatedDelivery": "","quantity": "' +
      prodQuantity +
      '","brand": "Fairview Microwave","pageUrl": "' +
      pageurl +
      '","pageName": "' +
      pagename +
      '","pageCategory": "' +
      pageCategory +
      '","visitorState": "' +
      ustate +
      '","webId": "' +
      webid +
      '","userId": "' +
      id +
      '"}';
    productArr.push(JSON.parse(prodcutObj));
  }

  dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
  dataLayer.push({
    event: "addToCart",
    ecommerce: {
      actionFeild: {
        list: pageCategory,
        action: "add"
      },
      add: {
        // "add" actionFieldObject measures.
        products: productArr
      }
    }
  });
}

function rfcaProductDatalayer(
  sku,
  startingPrice,
  productPrice,
  productLength,
  prodColor,
  productName
) {
  var userstate = getLoggedInUserDetails();
  if (userstate != "Guest") {
    var ustate = userstate.split("@@")[0],
      id = userstate.split("@@")[1],
      userwebid = userstate.split("@@")[2],
      webid = userwebid.split("-")[0];
    //alert(id +"-->"+webid);
  } else {
    ustate = userstate;
    id = "anonymous";
    webid = "unknown";
  }
  pageurl = location.protocol + "//" + location.hostname + location.pathname;
  pagename = pageName;
  dataLayer.push({
    event: "productDetail",
    product_View: {
      products: [
        {
          productSku: sku,
          productName: productName,
          productId: "",
          productPrice: startingPrice,
          productStartingPrice: productPrice,
          productCategory: "Custom Cable Assembly Product",
          estimatedDelivery: "",
          productType: "",
          productLength: productLength,
          productColor: prodColor,
          pageUrl: pageurl,
          pageName: pagename,
          pageCategory: "RF Cable Designer",
          bestSellerRank: "",
          Inventory: "",
          brand: "Fairview Microwave",
          visitorState: ustate,
          webId: webid,
          userId: id
        }
      ]
    }
  });
}

function documentDLCall(datasheetArr, docaction = "", doccat = "", docid = "") {
  var urlString = window.location.href,
    doccategory,
    documentid,
    prodCategory,
    specificCategory;
  var url = new URL(urlString);
  if (doccat != "") {
    doccategory = doccat;
  } else {
    doccategory = "Datasheet";
  }
  if (docid != "") {
    documentid = docid;
  } else {
    documentid = "Datasheet";
  }
  specificCategory = url.searchParams.get(algoliaIndex);
  if (
    specificCategory == null &&
    datasheetArr[5] !== null &&
    datasheetArr[5] !== undefined
  ) {
    specificCategory = datasheetArr[5];
  } else {
    if (specificCategory != "") {
      specificCategory = specificCategory;
    } else {
      if (specificCategory == "") {
        specificCategory = "";
      }
    }
  }
  datasheetArr[3].length > 0
    ? (prodCategory = datasheetArr[3].replaceAll(",", "/"))
    : (prodCategory = "");
  action = docaction;
  if (
    datasheetArr[4] !== null &&
    datasheetArr[4] !== "" &&
    datasheetArr[4] !== undefined
  ) {
    pageCategory = datasheetArr[4];
  } else {
    pageCategory = "plp";
  }
  //alert(datasheetArr.length+"  Docname-->"+datasheetArr[0]+"  doctype-->"+datasheetArr[1]+"  product Name-->"+datasheetArr[2]+" specificcat-->"+specificCategory+" doc action-->"+action+" Prod category-->"+datasheetArr[3]);
  if (datasheetArr.length > 0) {
    dataLayer.push({
      event: "DocumentInteracted",
      Document: {
        documentID: documentid,
        documentName: datasheetArr[0],
        documentType: datasheetArr[1],
        documentCategory: doccategory,
        documentAction: action,
        productNameDetails: datasheetArr[2],
        productCategory: prodCategory,
        specificCategory: specificCategory,
        pageName: pageName,
        pageUrl:
          location.protocol + "//" + location.hostname + location.pathname,
        pageCategory: pageCategory
      }
    });
  }
}

function plpProductDLCall(prodDetArr, pgcategory) {
  //alert(prodDetArr.length+"  brandSKU-->"+prodDetArr[0]+"  name-->"+prodDetArr[1]+"  productId-->"+prodDetArr[2]+"  unitPrice-->"+prodDetArr[3]+"  startingPrice-->"+prodDetArr[4]+"  length-->"+prodDetArr[5]+"  color-->"+prodDetArr[6]+"  bestSellerRank-->"+prodDetArr[7]+"  inventory-->"+prodDetArr[8]+" pgcat-->"+pgcategory+" Product Category-->"+prodDetArr[9]);
  let inventory, prodCategory, ustate, userwebid;
  if (prodDetArr.length > 0) {
    prodDetArr[8] > 0
      ? (inventory = "Available")
      : (inventory = "out of stock");
    prodDetArr[9].length > 0
      ? (prodCategory = prodDetArr[9].replaceAll(",", "/"))
      : (prodCategory = "");
    var prodType = "";
    var RoHs = "";
    if (prodDetArr[10] === "true") {
      prodType = "New";
    }
    if (prodDetArr[11] === "true") {
      RoHs = "RoHS";
    }
    if (prodType == "" && RoHs == "") {
      prodType = "";
    } else {
      prodType = prodType + "/" + RoHs;
    }
    var userstate = getLoggedInUserDetails(),
      id = "",
      webid = "";
    if (userstate != "Guest") {
      ustate = userstate.split("@@")[0];
      id = userstate.split("@@")[1];
      userwebid = userstate.split("@@")[2];
      webid = userwebid.split("-")[0];
      //alert(id +"-->"+webid);
    } else {
      ustate = userstate;
      id = "anonymous";
      webid = "unknown";
    }

    dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
    dataLayer.push({
      event: "productView",
      product_View: {
        products: [
          {
            productSku: prodDetArr[0],
            productName: prodDetArr[1],
            productId: prodDetArr[2],
            productPrice: prodDetArr[3].replace("$", ""),
            productStartingPrice: prodDetArr[4],
            productCategory: prodCategory,
            estimatedDelivery: "",
            productType: prodType,
            productLength: prodDetArr[5],
            productColor: prodDetArr[6],
            pageUrl:
              location.protocol + "//" + location.hostname + location.pathname,
            pageName: pageName,
            pageCategory: pgcategory,
            bestSellerRank: prodDetArr[7],
            Inventory: inventory,
            brand: "Fairview Microwave",
            visitorState: ustate,
            webId: webid,
            userId: id
          }
        ]
      }
    });
  }
}

function formContacusDLcall(formName = "", formAction = "", pageCategory = "") {
  var userstate = getLoggedInUserDetails(),
    vstate;
  if (userstate == "Guest") {
    vstate = "Guest";
  } else {
    vstate = "loggedIn";
  }
  var formName = formName ? formName : "Contact Us",
    formAction = formAction ? formAction : "Contact Us",
    pageCategory = pageCategory ? pageCategory : "Contact Us";
  dataLayer.push({
    event: "formInteracted",
    formDL: {
      formName: formName,
      formAction: formAction,
      formStatus: "Form Loaded",
      pageName: pageName,
      pageUrl: location.protocol + "//" + location.hostname + location.pathname,
      pageCategory: pageCategory,
      visitorState: vstate
    }
  });
}

//code to capture data for cart email form tracking
function formEmailCartDLcall(fname, faction, fstatus = "") {
  var userstate = getLoggedInUserDetails(),
    vstate;
  if (userstate == "Guest") {
    vstate = "Guest";
  } else {
    vstate = "loggedIn";
  }
  if (fname == "Email order confirmation") {
    //code for order success send email data layer call
    //alert(fstatus);
    if (fstatus == "false") {
      dataLayer.push({
        event: "formInteracted",
        formDL: {
          formName: fname,
          formAction: faction,
          formStatus: "Failure",
          pageName: pageName,
          pageUrl:
            location.protocol + "//" + location.hostname + location.pathname,
          pageCategory: "Checkout Success",
          visitorState: vstate
        }
      });
    } else {
      dataLayer.push({
        event: "formInteracted",
        formDL: {
          formName: fname,
          formAction: faction,
          formStatus: "Success",
          pageName: pageName,
          pageUrl:
            location.protocol + "//" + location.hostname + location.pathname,
          pageCategory: "Checkout Success",
          visitorState: vstate
        }
      });
    }
  } else {
    dataLayer.push({
      event: "formInteracted",
      formDL: {
        formName: fname,
        formAction: faction,
        formStatus: "Success",
        pageName: pageName,
        pageUrl:
          location.protocol + "//" + location.hostname + location.pathname,
        pageCategory: "continue shopping",
        visitorState: vstate
      }
    });
  }
}

//code to capture data for PLP left Navigation Filter
function plpFilterInteracted(
  params,
  checkflag,
  specificCategory,
  subcategories
) {
  var keys = "";
  var values = "";
  if (typeof params !== "undefined") {
    keys = Object.keys(params).join(",");
    for (const [key, value] of Object.entries(params)) {
      values = (key + ":" + value).concat("|") + values;
      if (key.startsWith("Price")) {
        values.replace(",", "");
      }
    }
    var lastLetter = values.charAt(values.length - 1);
    if (lastLetter.indexOf("|") !== -1) {
      values = values.substring(0, values.length - 1);
    }
  }
  var subcategoriesArr = [];
  subcategoriesArr = subcategories.split("@@");
  if (keys != "" && values != "") {
    dataLayer.push({
      event: "FilterInteracted",
      data: {
        filtertype: "Product Filter",
        filterTitle: "PLP left Nav filter",
        filterCategory: keys,
        filterValues: values,
        filterApplied: checkflag,
        pageName: pageName,
        pageUrl:
          location.protocol + "//" + location.hostname + location.pathname,
        pageCategory: "PLP",
        specificCategory: specificCategory,
        subCategory: subcategoriesArr[0],
        subSubCategory: subcategoriesArr[1]
      }
    });
  }
  params = [];
}

function formCreatAccountDLCall(userdata, fname, ferror, faction, fstatus) {
  //alert("userdetails= "+userdata+" formname= "+fname+" formerror= "+ferror+" formaction= "+faction+" formstatus= "+fstatus);
  if (fname == "Create Account") {
    var todaydate = new Date().toString();
    if (fstatus == "true") {
      var userdetailsArray = userdata.split("@@");
      dataLayer.push({
        event: "userRegistrationInteracted",
        userRegistration: {
          registrationDate: todaydate.slice(0, 25),
          industry: userdetailsArray[0],
          userCountry: userdetailsArray[1],
          userCity: userdetailsArray[2],
          userState: userdetailsArray[3],
          userZip: userdetailsArray[4],
          formName: fname,
          formError: "",
          formAction: faction,
          formStatus: "Registration success"
        }
      });
    } else if (fstatus == "false") {
      dataLayer.push({
        event: "userRegistrationInteracted",
        userRegistration: {
          registrationDate: todaydate.slice(0, 25),
          industry: "",
          userCountry: "",
          userCity: "",
          userState: "",
          userZip: "",
          formName: fname,
          formError: ferror,
          formAction: faction,
          formStatus: "Form Error"
        }
      });
    }
  }
}
function formDataLayerCall(id, fname, ferror, faction, fstatus, webid) {
  //alert("userid= "+id+" formname= "+fname+" formerror= "+ferror+" formaction= "+faction+" formstatus= "+fstatus);
  // condition to validate login/signin form
  if (fname == "Login") {
    //fstatus="true";
    //fstatus= "false";
    if (fstatus == "true") {
      dataLayer.push({
        event: "userLoginInteracted",
        userLogin: {
          userId: id,
          formName: fname,
          formError: "",
          formAction: faction,
          webId: webid,
          formStatus: "Login Success"
        }
      });
    }
    if (fstatus == "false") {
      dataLayer.push({
        event: "userLoginInteracted",
        userLogin: {
          userId: "anonymous",
          formName: fname,
          formError: ferror,
          formAction: faction,
          formStatus: "Login Form Error"
        }
      });
    }
  }
}

function formRfqDataLayerCall(fstatus, prodArray) {
  let cityVal = $("#city-rfq").val(),
    countryVal = $("#country-rfq").val(),
    zipVal = $("#zipcode-rfq").val(),
    stateVal = $("#state-rfq").val(),
    totalPrice = $("span.pop_totalprice").text(),
    prodcutObj = "",
    productArr = [],
    userstate = getLoggedInUserDetails();
  var ustate = "",
    id = "",
    userwebid,
    webid = "";
  if (userstate != "Guest") {
    ustate = "loggedIn";
    id = userstate.split("@@")[1];
    userwebid = userstate.split("@@")[2];
    webid = userwebid.split("-")[0];
  } else {
    ustate = userstate;
    id = "";
    webid = "";
  }
  if (fstatus == "true") {
    for (var i = 0; i < prodArray.length; i++) {
      let priceamt = "",
        productName = "",
        productSku = "",
        productId = "",
        productType = "",
        productLength = "",
        prodQuantity = "";
      if (
        prodArray[i].name["en"] != undefined &&
        prodArray[i].name["en"] != ""
      ) {
        productName = prodArray[i].name["en"];
      } else if (
        prodArray[i].name["en-US"] != undefined &&
        prodArray[i].name["en-US"] != ""
      ) {
        productName = prodArray[i].name["en-US"];
      } else {
        productName = "";
      }
      if (prodArray[i].money) {
        priceamt = (prodArray[i].money.centAmount / 100).toFixed(2);
      }
      if (prodArray[i].variant) {
        priceamt = (
          prodArray[i].variant.prices[1].value.centAmount / 100
        ).toFixed(2);
      }
      priceamt = priceamt.replace("$", "");

      if (prodArray[i].variant) {
        productSku = prodArray[i].variant.sku;
      }
      if (prodArray[i].custom) {
        productSku = prodArray[i].custom.fields.masterSku;
      }
      if (prodArray[i].productId) {
        productId = prodArray[i].productId;
      }
      if (prodArray[i].id) {
        productId = prodArray[i].id;
      }
      if (prodArray[i].productType) {
        productType = prodArray[i].productType.id;
      }
      if (prodArray[i].custom) {
        productLength = prodArray[i].custom.fields.customlength;
      }
      prodcutObj =
        '{"productSku": "' +
        productSku +
        '","productName": "' +
        productName +
        '","productId": "' +
        productId +
        '","productPrice": "' +
        priceamt +
        '","productStartingPrice": "","totalPrice":"' +
        totalPrice +
        '","productType": "' +
        productType +
        '","productLength": "' +
        productLength +
        '","productColor": "","bestSellerRank": "","productCategory": "","estimatedDelivery": "","quantity": "' +
        prodArray[i].quantity +
        '","brand": "Fairview Microwave"}';
      productArr.push(JSON.parse(prodcutObj));
    }

    dataLayer.push({
      event: "formInteracted",
      formDL: {
        formName: "RFQ form",
        formAction: "Click",
        formError: "",
        formStatus: "successfully submited",
        pageName: pageName,
        pageUrl:
          location.protocol + "//" + location.hostname + location.pathname,
        pageCategory: "RFQ",
        city: cityVal,
        country: countryVal,
        zip: zipVal,
        state: stateVal,
        webId: webid,
        userId: id,
        visitorState: ustate,
        products: productArr
      }
    });
  }
  if (fstatus == "false") {
    dataLayer.push({
      event: "formInteracted",
      formDL: {
        userId: id,
        webId: webid,
        formName: "RFQ form",
        formError: "404 Error",
        formAction: "Click",
        formStatus: "Form Error"
      }
    });
  }
}

function formRmaDataLayerCall(fstatus, frmaerror = "") {
  let cityVal = $("#rfCity").val();
  let countryVal = $("#rfCountry").val();
  let zipVal = $("#rfZipcode").val();
  let stateVal = $("#rfState").val();
  let fmSaleInvoiceVal = $("#rfSalesInvoice").val();
  let poVal = $("#rfPONum").val();
  let rmaTypeRequestVal = $('input[name="rmaReqType"]:checked').val();
  let partVal = $("#rfPartNum_0").val();
  let quantityVal = $("#rfQty_0").val();
  let reasonOfReturnVal = $("#fmRor_0").val();
  let dateVal = $("#rfDate").val();

  if (fstatus == "true") {
    dataLayer.push({
      event: "formInteracted",
      formDL: {
        formName: "RMA Form",
        formAction: "Click",
        formError: "",
        formStatus: "successfully submited",
        pageName: pageName,
        pageUrl:
          location.protocol + "//" + location.hostname + location.pathname,
        pageCategory: "Resources/RMA",
        city: cityVal,
        country: countryVal,
        zip: zipVal,
        state: stateVal,
        fmSaleInvoice: fmSaleInvoiceVal,
        po: poVal,
        rmaTypeRequest: rmaTypeRequestVal,
        part: partVal,
        quantity: quantityVal,
        reasonOfReturn: reasonOfReturnVal,
        date: dateVal
      }
    });
  }
  if (fstatus == "false") {
    let formError = "";
    if (frmaerror != "") {
      formError = frmaerror;
    } else {
      formError = "404 Error";
    }
    dataLayer.push({
      event: "formInteracted",
      formDL: {
        userId: id,
        webId: webid,
        formName: "RMA Form",
        formAction: "Click",
        formError: formError,
        formStatus: "Form Error"
      }
    });
  }
}
function formResetPasswordDLCall(
  fname,
  ferror,
  faction,
  fstatus,
  webId,
  customerId
) {
  if (customerId === "" || customerId === null || customerId === "undefined") {
    customerId = "anonymous";
  }
  if (webId === "" || webId === null || webId === "undefined") {
    webId = "unknown";
  }
  if (fname == "Send Email") {
    //condition to check if reset password submission status is true or false.
    if (fstatus == "true") {
      dataLayer.push({
        event: "userResetPassword",
        resetPassword: {
          formName: fname,
          formError: "",
          formAction: faction,
          webId: webId,
          userId: customerId,
          formStatus: "Email sent Successfully"
        }
      });
    }
    if (fstatus == "false") {
      dataLayer.push({
        event: "userResetPassword",
        resetPassword: {
          formName: fname,
          formError: ferror,
          formAction: faction,
          webId: webId,
          userId: customerId,
          formStatus: "Form Error"
        }
      });
    }
  } else if (fname == "Confirm Password") {
    //condition to check if confirm password submission status is true or false.
    if (fstatus == "true") {
      dataLayer.push({
        event: "userResetPassword",
        resetPassword: {
          formName: fname,
          formError: "",
          formAction: faction,
          webId: webId,
          userId: customerId,
          formStatus: "Password Reset Successfully"
        }
      });
    }
    if (fstatus == "false") {
      dataLayer.push({
        event: "userResetPassword",
        resetPassword: {
          formName: fname,
          formError: ferror,
          formAction: faction,
          webId: webId,
          userId: customerId,
          formStatus: "Pasword reset fail"
        }
      });
    }
  }
}

//function for signout button click
function analyticSignOut() {
  var button = document.querySelector(".analyticsignout"),
    label = button.textContent.trim(),
    category = "Order-History-Left Nav";
  ctalinkDataLayerCall(label, category);
}

//function for Text component link click
function analyticOrderLeftNav() {
  //analytic code to track order hisotyr left nav CTA link
  document.querySelector("body").addEventListener(
    "click",
    function (e) {
      var anchor = e.target.closest("a");
      var label = "";
      var category = "";
      var analyticdiv = "";
      var maindivid = "";
      var mainHeading = "";
      if (
        anchor !== null &&
        anchor.textContent !== null &&
        anchor.closest(".analyticorderhistory-leftnav") != null
      ) {
        label = anchor.textContent.trim();
        if (anchor.parentNode.tagName === "B") {
          analyticdiv = anchor.parentNode.parentNode.parentNode;
        } else {
          analyticdiv = anchor.parentNode.parentNode;
        }
        maindivid = analyticdiv.id;
        if (maindivid.search("myacclink-heading") != "-1") {
          //label=analyticdiv.textContent.trim();
          category = "Order-History-Left Nav";
        } else {
          var placeholder = analyticdiv.parentNode.previousElementSibling;
          while (placeholder) {
            if (
              placeholder.childNodes["1"] != null &&
              placeholder.childNodes["1"] != undefined &&
              placeholder.childNodes["1"].id != null &&
              placeholder.childNodes["1"].id != undefined &&
              placeholder.childNodes["1"].id.search("myacclink-heading") != "-1"
            ) {
              mainHeading = placeholder.textContent.trim();
              break;
            }
            if (
              placeholder.childNodes["3"] != null &&
              placeholder.childNodes["3"] != undefined &&
              placeholder.childNodes["3"].id != null &&
              placeholder.childNodes["3"].id != undefined &&
              placeholder.childNodes["3"].id.search("myacclink-heading") != "-1"
            ) {
              mainHeading = placeholder.textContent.trim();
              break;
            }
            placeholder = placeholder.previousElementSibling;
          }
          if (mainHeading != "") {
            category = "Order-History-" + mainHeading + "-Left Nav";
          }
        }
        ctalinkDataLayerCall(label, category);
      }
    },
    false
  );
}

function textclickDatatracking() {
  document.querySelector("body").addEventListener(
    "click",
    function (e) {
      anchorElement = e.target.closest("a");
      label = "";
      category = "";
      if (
        anchorElement !== null &&
        anchorElement.closest(".analytic-forgotpwdpage") != null &&
        anchorElement.parentElement.parentElement.id == "forgotpwd"
      ) {
        label = anchorElement.textContent.trim();
        category = "Forgot Password-" + currentPageName + " page";
        ctalinkDataLayerCall(label, category);
      } else if (
        anchorElement !== null &&
        anchorElement.closest(".analyticfaqcategory") != null &&
        anchorElement.parentElement.parentElement.parentElement.parentElement
          .parentElement.id == "faq-template-container-left"
      ) {
        label = anchorElement.textContent.trim();
        category = anchorElement.textContent.trim() + " - FAQ";
        ctalinkDataLayerCall(label, category);
      }
    },
    false
  );
}

function plpsortDataLayerCall(lb, sc, srt = "", src = "", pc = "") {
  if (lb != "") {
    if (srt == "") {
      srt = "Product Filter";
    }
    if (src == "") {
      src = "Product List";
    }
    if (pc == "") {
      pc = "Product List";
    }
    dataLayer.push({
      event: "sortFilterInteracted",
      sort_Filter: {
        sortingtype: srt,
        sortingCategory: src,
        sortingValues: lb,
        specificCategory: sc,
        pageCategory: pc,
        pageName: pageName,
        pageUrl:
          location.protocol + "//" + location.hostname + location.pathname
      }
    });
  }
}
//code to capture data for PLP Pagination
function paginationdataLayerCall(lb, ct, cp, sc) {
  if (lb != "" && ct != "") {
    dataLayer.push({
      event: "PaginationInteracted",
      pagination: {
        currentPage: cp,
        eventAction: "Click",
        eventLabel: lb,
        pageCategory: ct,
        pageName: pageName,
        pageUrl:
          location.protocol + "//" + location.hostname + location.pathname,
        specificCategory: sc
      }
    });
  }
}

//code to capture CTA link on home page
function ctalinkDataLayerCall(lb, ct, sc = "") {
  //alert("lb=" +lb+" ct="+ct+" sc="+sc);
  //alert(pageName);
  if (lb != "" && ct != "") {
    dataLayer.push({
      event: "customLinksInteracted",
      customLink: {
        eventLabel: lb,
        eventCategory: ct,
        eventAction: "click",
        specificCategory: sc,
        pageName: pageName,
        pageUrl:
          location.protocol + "//" + location.hostname + location.pathname
      }
    });
  }
}
function FAQDataLayerCall(fId, fName, fcat = "") {
  dataLayer.push({
    event: "FAQInteracted",
    data: {
      faqId: fId,
      faqName: fName,
      faqCategory: fcat,
      pageName: pageName,
      pageUrl: location.protocol + "//" + location.hostname + location.pathname,
      pageCategory: "FAQ"
    }
  });
}
function bluconicDataCapture(category) {
  if (
    typeof Storage !== "undefined" &&
    typeof Storage !== "null" &&
    (category == "shopping-cart" || category == "checkout")
  ) {
    let retrievedDL = "",
      getDL = {},
      saveDL = {},
      timeNow = new Date().getTime();
    retrievedDL = localStorage.getItem("persistDL");
    for (var i = 0; i < window.dataLayer.length; i++) {
      if (
        window.dataLayer[i].event == "removeFromCart" ||
        window.dataLayer[i].event == "checkout"
      ) {
        saveDL = window.dataLayer[i];
        //delete saveDL.event;
        //saveDL.event="bcremoveFromCart";
        getDL = JSON.parse(retrievedDL) || {};
        for (var key in saveDL) {
          if (saveDL.hasOwnProperty(key)) {
            getDL[key] = saveDL[key];
          }
        }
        localStorage.setItem("persistDL", JSON.stringify(getDL));
      }
    }
    localStorage.setItem("persistTime", JSON.stringify(timeNow));
  }
}
$(document).ready(function () {
  let pageerror = "",
    pageTitle;
  if (pageTitle != "" && pageTitle == "404") {
    pageerror = "page not found";
  } else {
    pageerror = "";
  }
  var userstate = getLoggedInUserDetails();
  var id = "",
    webid = "",
    billingPostalCode = "",
    shippingPostalCode = "",
    userwebid,
    ustate;
  if (userstate != "Guest") {
    ustate = userstate.split("@@")[0];
    id = userstate.split("@@")[1];
    userwebid = userstate.split("@@")[2];
    webid = userwebid.split("-")[0];
    billingPostalCode = userstate.split("@@")[3];
    shippingPostalCode = userstate.split("@@")[4];
  } else {
    ustate = userstate;
    id = "anonymous";
    webid = "unknown";
  }
  //currentPageName=pageName;
  //window.dataLayer = window.dataLayer || [];

  //code for environment
  var pageEnvironment = "",
    environementType;
  if (pageDepth == "4") {
    environementType = pageEnvOne.split("-");
    //window.dataLayer[0]["page"]["environment"] = environementType[0];
    pageEnvironment = environementType[0];
  }
  if (pageDepth == "5") {
    environementType = pageEnvTwo.split("-");
    //window.dataLayer[0]["page"]["environment"] = environementType[0];
    pageEnvironment = environementType[0];
  }
  if (pageDepth == "6") {
    environementType = pageEnvThree.split("-");
    //window.dataLayer[0]["page"]["environment"] = environementType[0];
    pageEnvironment = environementType[0];
  }
  if (pageDepth == "7") {
    environementType = pageEnvFour.split("-");
    //window.dataLayer[0]["page"]["environment"] = environementType[0];
    pageEnvironment = environementType[0];
  }

  //code for pageType
  var pagePageType = "",
    pageTypevalue = pgType.split("/");
  //window.dataLayer[0]["page"]["pageType"] =pageTypevalue[pageTypevalue.length - 1];
  pagePageType = pageTypevalue[pageTypevalue.length - 1];

  var pageDeviceType = "";
  (function () {
    if (isMobile.phone) {
      //window.dataLayer[0]["page"]["deviceType"] = "Mobile";
      pageDeviceType = "Mobile";
    } else if (isMobile.tablet) {
      //window.dataLayer[0]["page"]["deviceType"] = "Tablet";
      pageDeviceType = "Tablet";
    } else {
      //window.dataLayer[0]["page"]["deviceType"] = "Desktop";
      pageDeviceType = "Desktop";
    }
  })();
  var pageUrlHash = "";
  //code for URL Hash
  (function () {
    if (window.location.hash != undefined && window.location.hash != "") {
      var hashVal = window.location.hash;
      //window.dataLayer[0]["page"]["urlHash"] = hashVal.substr(1);
      pageUrlHash = hashVal.substr(1);
    }
  })();
  var pageSection;
  var pageContentHirerachy = [];
  //code for contetnHierarchy & section
  (function () {
    // parse path
    //for Production (https://www.fairviewmicrowave.com/)
    //var path = location.pathname.split("/").splice(2);
    //for pre-prod (http://localhost:4502/content/fm/en/homepage.html)
    //url="/category/rf-adapters.html?fm_product_en_qa%5BrefinementList%5D%5BhierarchicalCategories.lvl0%5D%5B0%5D=RF%20Adapters";
    //var path = pagePath.split("/").splice(4);
    var path = pagePath.split("/");
    while (path.length > 10) {
      path.pop();
    }

    path.forEach(function (p, i) {
      p = p
        .replace(/\-/g, " ")
        .replace(/\.html/, "")
        .replace(/(^| )([a-z])/g, function (l) {
          return l.toUpperCase();
        });
      path[i] = p;
    });

    // generate content heirarchy

    var j = 0;
    path.forEach(function (p, i) {
      if (p != "" && p != "Fm" && (p != "En") & (p != "Content")) {
        // window.dataLayer[0]["page"]["contentHierarchy"]["level" + (j + 1)] = p;
        pageContentHirerachy[j] = p;
        j++;
      }
      if (i === path.length - 1) {
        //window.dataLayer[0]["page"]["section"] = p;
        pageSection = p;
      }
    });
  })();

  //code for referringURL
  var pageReferringURL = "",
    finalbluconicDL;
  //window.dataLayer[0]["page"]["referringURL"] = document.referrer;
  pageReferringURL = document.referrer;

  dataLayer.push({
    event: "PageLoad",
    page: {
      pageName: pageName,
      pageTitle: pageTitle,
      pageType: pagePageType,
      brand: "Fairview Microwave",
      environment: pageEnvironment,
      hostname: location.hostname,
      contentHierarchy: {
        level1: "",
        level2: "",
        level3: "",
        level4: "",
        level5: "",
        level6: "",
        level7: "",
        level8: ""
      },
      server: "Apache",
      urlHash: pageUrlHash,
      userAgent: "",
      //"userId": '${currentSession.getUserID  @ context="scriptString"}',
      visitorState: ustate,
      shippingVisitorZip: billingPostalCode,
      billingvisitorZip: shippingPostalCode,
      deviceType: pageDeviceType,
      pageError: pageerror,
      deviceOS: navigator.platform,
      browserType: navigator.appName,
      section: pageSection,
      pageURL: location.protocol + "//" + location.hostname + location.pathname,
      referringURL: pageReferringURL,
      browser: ""
    },
    userLogin: {
      userId: id,
      webId: webid
    }
  });

  for (i = 0; i < window.dataLayer.length; i++) {
    if (
      window.dataLayer[i]["page"] != undefined &&
      window.dataLayer[i]["page"] != null
    ) {
      if (
        window.dataLayer[i]["page"]["contentHierarchy"] != undefined &&
        window.dataLayer[i]["page"]["contentHierarchy"] != null
      ) {
        for (j = 0; j < pageContentHirerachy.length; j++) {
          window.dataLayer[i]["page"]["contentHierarchy"]["level" + (j + 1)] =
            pageContentHirerachy[j];
        }
      }
    }
  }

  if (
    location.pathname.search("thank-you-join-our-mailing-list.html") != "-1"
  ) {
    dataLayer.push({
      event: "formsubmitted",
      formSuccessDL: {
        formName: "Join Our Mailing List",
        formAction: "Submitted",
        formStatus: "Success",
        pageName: pageName,
        pageUrl:
          location.protocol + "//" + location.hostname + location.pathname,
        pageCategory: "Thank You - Join our mailing list"
      }
    });
  } else if (location.pathname.search("thank-you.html") != "-1") {
    dataLayer.push({
      event: "formsubmitted",
      formSuccessDL: {
        formName: "Contact Us",
        formAction: "Submitted",
        formStatus: "Success",
        pageName: "Contact Us",
        pageUrl:
          location.protocol + "//" + location.hostname + location.pathname,
        pageCategory: "Contact Us"
      }
    });
  }
  //code for bluconic data capture
  if (typeof Storage !== "undefined" && typeof Storage !== "null") {
    var bluconicDL = localStorage.getItem("persistDL"),
      bluconicDLStartTime = localStorage.getItem("persistTime"),
      DataLayerPersistTime = 1000 * 60 * 2, // Expiration in milliseconds; set to null to never expire
      currentTime = new Date().getTime();
    if (bluconicDL && bluconicDLStartTime) {
      if (
        DataLayerPersistTime &&
        currentTime > Number(bluconicDLStartTime) + DataLayerPersistTime
      ) {
        localStorage.removeItem("persistDL"); //Delete bluconic data layer local storage
      } else {
        if (bluconicDL) {
          if (bluconicDL.search("removeFromCart") != "-1") {
            dataLayer.push({ ecommerce: null });
            finalbluconicDL = bluconicDL.replace(
              "removeFromCart",
              "bcremoveFromCart"
            );
            window.dataLayer.push(JSON.parse(finalbluconicDL));
            localStorage.removeItem("persistDL"); //Delete bluconic data layer local storage
          } else if (bluconicDL.search("checkout") != "-1") {
            dataLayer.push({ ecommerce: null });
            finalbluconicDL = bluconicDL.replace("checkout", "bccheckout");
            window.dataLayer.push(JSON.parse(finalbluconicDL));
            localStorage.removeItem("persistDL"); //Delete bluconic data layer local storage
          }
        }
      }
    }
  }
});
