/**
 * adding the custom classes to HTML tag
 */
var root = document.getElementsByTagName("html")[0];
var test = function (regexp) {
  return regexp.test(window.navigator.userAgent);
};
/* Operating System name */
var osName = (function () {
  switch (true) {
    case test(/Win/i):
      return "os-windows";
    case test(/iPhone/i):
      return "os-iPhone";
    case test(/iPad/i):
      return "os-iPad";
    case test(/Mac/i):
      return "os-macintosh";
    case test(/Android/i):
      return "os-android";
    default:
      return "os-other";
  }
})();
root.className += " " + osName;

/* Browser name */
var browser = (function () {
  switch (true) {
    case test(/edg/i):
      return "browser-msedge";
    case test(/trident/i):
      return "browser-msie";
    case test(/firefox|fxios/i):
      return "browser-firefox";
    case test(/opr\//i):
      return "browser-opera";
    case test(/ucbrowser/i):
      return "browser-uc";
    case test(/samsungbrowser/i):
      return "browser-samsung";
    case test(/chrome|chromium|crios/i):
      return "browser-chrome";
    case test(/safari/i):
      return "browser-safari";
    default:
      return "browser-other";
  }
})();
root.className += " " + browser;

/* Touch enbled or not */
var touchdevice = "istouch-no";
if ("ontouchstart" in document.documentElement) touchdevice = "istouch-yes";
root.className += " " + touchdevice;

$(document).ready(function () {
  $(".tools-res_links.cmp-teaser__action-link").click(function (e) {
    $(
      ".tools-res_link .tools-res_links.tools-res_links.cmp-teaser__action-link"
    ).removeClass("linksactive");
    $(this).addClass("linksactive");
  });
  /**
   * function to open New Window and show the content of the external url
   * element - <a>
   * class - 'open-newwindow'
   * required - 'href' attribute
   *
   * */
  $(".open-newwindow").click(function (evnt) {
    evnt.preventDefault();
    window.open(
      $(this).attr("href"),
      "_blank",
      "toolbar=no,location=no,height=500,width=400,menubar=no,resizable=no"
    );
  });
  // Overrite CSS of new.nwpar
  if ($(".new.newpar").length) {
    $(".new.newpar").css("height", "auto");
  }
});

//code for return home
var retunHomeBtn = document.getElementById("returntoHome");
if (retunHomeBtn) {
  retunHomeBtn.parentNode.classList.add("return_to_home_btn_main");
  retunHomeBtn.classList.add("return_to_home_btn");
  retunHomeBtn.classList.remove("cmp-button");
}

var signInCreateBtn = document.getElementById("signin-createaccount");
if (signInCreateBtn) {
  signInCreateBtn.style.textDecoration = "none";
  signInCreateBtn.parentNode.classList.add("createaccountbutton");
  signInCreateBtn.classList.add("cmp-button");
}

var donotHaveAccText = document.getElementById("donthaveanacc");
var benefitText = document.getElementById("benefitstext");
if (donotHaveAccText || benefitText) {
  donotHaveAccText.classList.add("cmp-text");
}
if (benefitText) {
  benefitText.classList.add("cmp-text");
}

var abtitleText = document.getElementById("abtitle");
if (abtitleText) {
  abtitleText.classList.add("cmp-text", "address_book_title");
}

var formSubtitleText = document.getElementById("formsubtitle");
if (formSubtitleText) {
  formSubtitleText.classList.add("cmp-text", "form_subtitle");
}

var formDescText = document.getElementById("formdesc");
if (formDescText) {
  formDescText.classList.add("custom_form_desc");
  formDescText.parentNode.classList.add("cmp", "cmp-text");
}

var createPwdDescText = document.getElementById("createpwddesc");
if (createPwdDescText) {
  createPwdDescText.classList.add("custom_create_pwd_desc");
}

var formtitleText = document.getElementById("formtitle");
if (formtitleText) {
  formtitleText.classList.add("custom_form_title");
}

var changePwdText = document.getElementById("chngepwddesc");
if (changePwdText) {
  changePwdText.classList.add("custom_change_pwd_desc");
  changePwdText.parentNode.classList.add("cmp", "cmp-text");
}

// Showing active page in the my account starts

function highlightCurrentURL() {
  var pi =
    document
      .getElementById("myacclink-subheading-pi")
      .getElementsByTagName("a") != null
      ? document
          .getElementById("myacclink-subheading-pi")
          .getElementsByTagName("a")
      : "";
  for (var i = 0; i < pi.length; i++) {
    if (pi[i].href.split("#")[0] == document.location.href.split("#")[0]) {
      pi[i].className = "current";
    }
  }

  var ab =
    document
      .getElementById("myacclink-subheading-ab")
      .getElementsByTagName("a") != null
      ? document
          .getElementById("myacclink-subheading-ab")
          .getElementsByTagName("a")
      : "";

  for (var i = 0; i < ab.length; i++) {
    if (ab[i].href.split("#")[0] == document.location.href.split("#")[0]) {
      ab[i].className = "current";
    }
  }
  var oh =
    document
      .getElementById("myacclink-subheading-oh")
      .getElementsByTagName("a") != null
      ? document
          .getElementById("myacclink-subheading-oh")
          .getElementsByTagName("a")
      : "";

  for (var i = 0; i < oh.length; i++) {
    if (oh[i].href.split("#")[0] == document.location.href.split("#")[0]) {
      oh[i].className = "current";
    }
  }
}

// customer Token or guest user token
function isCustomerToken() {
  return $.fn.cookiesRead().customerToken() || "";
}

// return true/false if only customer token
function isOnlyCustomerToken() {
  return $.fn.cookiesRead().isOnlyCustomerToken() || false;
}

$(document).ready(function () {
  const screensize = window.matchMedia("(max-width: 833px)");
  if (screensize.matches) {
    var maxcharLength = 90;
  } else {
    var maxcharLength = 200;
  }
});

const brandName = "Fairview Microwave";

function getdataSheet(obj) {
  var flag = "datasheet";

  var dataSheet = obj.assets
    ? obj.assets.filter((datas) => datas.type == "DataSheet")
    : ``;
  if (dataSheet.length > 0 && dataSheet != undefined && dataSheet != "") {
    for (var i = 0; i < dataSheet.length; i++) {
      if (flag == "datasheet") {
        var dynamicImgPath =
          window.location.protocol + "//" + window.location.hostname;
        //var imgPath = "content/dam/infinite-electronics/product-assets/fairview-microwave/datasheets/";
        var imgPath = utilityMessage?.redirectionURL?.dataSheet_path;
        flag = "other";
        return `${dynamicImgPath}/${imgPath}${dataSheet[0].name}`;
      }
    }
  } else return "";
}

function getspecSheet(obj) {
  var flag = "specsheet";

  var specSheet = obj.assets
    ? obj.assets.filter((datas) => datas.type == "SpecSheet")
    : ``;
  if (specSheet.length > 0 && specSheet != undefined && specSheet != "") {
    for (var i = 0; i < specSheet.length; i++) {
      if (flag == "specsheet") {
        var dynamicImgPath =
          window.location.protocol + "//" + window.location.hostname;
        //var imgPath = "content/dam/fm/product/specsheets/";
        var imgPath = utilityMessage?.redirectionURL?.specSheet_path;
        flag = "other";
        return `${dynamicImgPath}/${imgPath}${specSheet[0].name}`;
      }
    }
  } else return "";
}
$(document).ready(function () {
  var bearerCookie = getCookie("bearerToken");
  if (bearerCookie == null || bearerCookie == "") {
    //bearer is not there this will run
    bearerTokenFetch();
  } else {
    //bearer is there this will run every 55 min
    let expiresToken = getCookie("bearerExpireTime");

    let expires = new Date(expiresToken).getTime();

    let nowDate = new Date();
    nowDate = nowDate.toUTCString();

    let nowGmtDate = new Date(nowDate).getTime();

    let milliseconds_left = expires - nowGmtDate;

    setInterval(function () {
      bearerTokenFetch();
    }, milliseconds_left);
  }
  // Dynamic Link Update
  commonUtility().dynamicURLUpdate();
});

function bearerTokenFetch() {
  $.ajax({
    type: "GET",
    url: "/bin/olcc/login",
    success: function (oauthtokenresponse, textstatus, xhr) {
      if (
        xhr.status == 200 &&
        oauthtokenresponse.statusCode != 401 &&
        oauthtokenresponse.statusCode != 400
      ) {
        var now = new Date();
        var time = now.getTime();
        var expireTime = time + 1000 * 60 * 55;
        now.setTime(expireTime);
        let expires = "expires=" + now.toUTCString();
        document.cookie =
          "bearerToken=" +
          JSON.stringify(oauthtokenresponse) +
          ";" +
          expires +
          ";path=/;";
        document.cookie = "bearerExpireTime=" + now.toUTCString() + ";path=/;";
      }
      //  window.errorModule.checkError(oauthtokenresponse);
    },
    error: function (error) {
      console.log(error);
    }
  });
}
function getbearerToken() {
  var bearerToken;
  var i,
    x,
    y,
    ARRcookies = document.cookie.split(";");
  for (i = 0; i < ARRcookies.length; i++) {
    x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
    y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
    x = x.replace(/^\s+|\s+$/g, "");
    if (x == "bearerToken") {
      return (bearerToken = y.replaceAll('"', ""));
    }
  }
}

function getCookie(name) {
  var dc = document.cookie;
  var prefix = name + "=";
  var begin = dc.indexOf("; " + prefix);
  if (begin == -1) {
    begin = dc.indexOf(prefix);
    if (begin != 0) return null;
  } else {
    begin += 2;
    var end = document.cookie.indexOf(";", begin);
    if (end == -1) {
      end = dc.length;
    }
  }
  // because unescape has been deprecated, replaced with decodeURI
  //return unescape(dc.substring(begin + prefix.length, end));
  return decodeURI(dc.substring(begin + prefix.length, end));
}

function gettwoDImg(obj) {
  var flag = "twodimg";
  var twoDimg = obj.assets.filter((datas) => datas.type == "2DCAD");
  for (var i = 0; i < twoDimg.length; i++) {
    if (flag == "twodimg") {
      var dynamicImgPath =
        window.location.protocol + "//" + window.location.hostname;
      //var imgPath = "content/dam/infinite-electronics/product-assets/fairview-microwave/2d-drawings/";
      var imgPath = utilityMessage?.redirectionURL?.twoDImg_path;
      flag = "other";
      return `${dynamicImgPath}/${imgPath}${twoDimg[0].name}`;
    }
  }
}
function getthreeDImg(obj) {
  var flag = "twodimg";
  var threeDimg = obj.assets.filter((datas) => datas.type == "3DCAD");
  for (var i = 0; i < threeDimg.length; i++) {
    if (flag == "twodimg") {
      var dynamicImgPath =
        window.location.protocol + "//" + window.location.hostname;
      //var imgPath = "content/dam/infinite-electronics/product-assets/fairview-microwave/3d-drawings/";
      var imgPath = utilityMessage?.redirectionURL?.threeDImg_path;
      flag = "other";
      return `${dynamicImgPath}/${imgPath}${threeDimg[0].name}`;
    }
  }
}
//comma separator with 2 decimal places with US format
function formatPrice(price) {
  return price.toLocaleString("en-us", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

//comma separator for number with US format
function formatNumber(number) {
  return number.toLocaleString("en-us");
}

//format phone number string to usa phone format with +1 code
function formatPhonetoUS(phStr) {
  //cleans the phone number string
  let cleaned = ("" + phStr).replace(/\D/g, "");
  // checks if it is 10 digit string
  let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  //if 10 digit convert to USA phone format
  if (match) {
    return "+1 (" + match[1] + ") " + match[2] + "-" + match[3];
  }

  return phStr; //else return it as it is
}
