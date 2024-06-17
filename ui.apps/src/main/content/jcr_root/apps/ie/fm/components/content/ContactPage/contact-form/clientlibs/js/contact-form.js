$(document).ready(function () {
  // we need to prepopulate the form
  prepopulateEloquaForm();
});
function prepopulateEloquaForm() {
  var firstName = "";
  var lastName = "";
  var companyName = "";
  var email = "";
  var contactNum = "";
  var i,
    x,
    y,
    ARRcookies = document.cookie.split(";");
  for (i = 0; i < ARRcookies.length; i++) {
    x = ARRcookies[i].substring(0, ARRcookies[i].indexOf("="));
    y = ARRcookies[i].substring(ARRcookies[i].indexOf("=") + 1);
    x = x.replace(/^\s+|\s+$/g, "");
    if (x == "customerInfo") {
      if (document.cookie.length != 0) {
        var custTokentJSONObject = JSON.parse(y);
        firstName = custTokentJSONObject["customer"]["firstName"];
        lastName = custTokentJSONObject["customer"]["lastName"];
        companyName = custTokentJSONObject["customer"]["companyName"];
        email = custTokentJSONObject["customer"]["email"];
        contactNum =
          custTokentJSONObject["customer"]["custom"]["fields"]["contact"];
      }
    }
    if (firstName !== "") {
      document.getElementById("fe1189").defaultValue = firstName;
    }
    if (lastName !== "") {
      document.getElementById("fe1190").defaultValue = lastName;
    }
    if (companyName !== "") {
      document.getElementById("fe1191").defaultValue = companyName;
    }
    if (email !== "") {
      document.getElementById("fe1193").defaultValue = email;
    }
    if (contactNum !== "") {
      document.getElementById("fe1444").defaultValue = contactNum;
    }
  }
}

function handleFormSubmit(ele) {
  var submitButton = ele.querySelector("input[type=submit]");
  var spinner = document.createElement("span");
  spinner.setAttribute("class", "loader");
  var elqFormName = document.querySelector("[name=elqFormName]");
  elqFormName.value += "_";
  submitButton.setAttribute("disabled", true);
  submitButton.style.cursor = "wait";
  submitButton.parentNode.appendChild(spinner);
  return true;
}
function resetSubmitButton(e) {
  var submitButtons = e.target.form.getElementsByClassName("submit-button");
  for (var i = 0; i < submitButtons.length; i++) {
    submitButtons[i].disabled = false;
  }
}
function addChangeHandler(elements) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener("change", resetSubmitButton);
  }
}
var form = document.getElementById("form106");
addChangeHandler(form.getElementsByTagName("input"));
addChangeHandler(form.getElementsByTagName("select"));
addChangeHandler(form.getElementsByTagName("textarea"));
var nodes = document.querySelectorAll("#form106 input[data-subscription]");
if (nodes) {
  for (var i = 0, len = nodes.length; i < len; i++) {
    var status = nodes[i].dataset
      ? nodes[i].dataset.subscription
      : nodes[i].getAttribute("data-subscription");
    if (status === "true") {
      nodes[i].checked = true;
    }
  }
}
var nodes = document.querySelectorAll("#form106 select[data-value]");
if (nodes) {
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    var selectedValue = node.dataset
      ? node.dataset.value
      : node.getAttribute("data-value");
    if (selectedValue) {
      for (var j = 0; j < node.options.length; j++) {
        if (node.options[j].value === selectedValue) {
          node.options[j].selected = "selected";
          break;
        }
      }
    }
  }
}
this.getParentElement = function (list) {
  return list[list.length - 1].parentElement;
};
var dom0 = document.querySelector("#form106 #fe1189");
var fe1189 = new LiveValidation(dom0, {
  validMessage: "",
  onlyOnBlur: false,
  wait: 300,
  isPhoneField: false
});
fe1189.add(Validate.Custom, {
  against: function (value) {
    return !value.match(
      /(telnet|ftp|https?):\/\/(?:[a-z0-9][a-z0-9-]{0,61}[a-z0-9]\.|[a-z0-9]\.)+[a-z]{2,63}/i
    );
  },
  failureMessage: "Value must not contain any URL's"
});
fe1189.add(Validate.Custom, {
  against: function (value) {
    return !value.match(/(<([^>]+)>)/gi);
  },
  failureMessage: "Value must not contain any HTML"
});
fe1189.add(Validate.Presence, {
  failureMessage: "This field is required"
});
fe1189.add(Validate.Custom, {
  against: function (value) {
    return !value.match(/[<>/{}*]/gi);
  },
  failureMessage: "Value must not contain special characters '<>/{}*' "
});
var dom1 = document.querySelector("#form106 #fe1190");
var fe1190 = new LiveValidation(dom1, {
  validMessage: "",
  onlyOnBlur: false,
  wait: 300,
  isPhoneField: false
});
fe1190.add(Validate.Custom, {
  against: function (value) {
    return !value.match(
      /(telnet|ftp|https?):\/\/(?:[a-z0-9][a-z0-9-]{0,61}[a-z0-9]\.|[a-z0-9]\.)+[a-z]{2,63}/i
    );
  },
  failureMessage: "Value must not contain any URL's"
});
fe1190.add(Validate.Custom, {
  against: function (value) {
    return !value.match(/(<([^>]+)>)/gi);
  },
  failureMessage: "Value must not contain any HTML"
});
fe1190.add(Validate.Presence, {
  failureMessage: "This field is required"
});
fe1190.add(Validate.Custom, {
  against: function (value) {
    return !value.match(/[<>/{}*]/gi);
  },
  failureMessage: "Value must not contain special characters '<>/{}*' "
});
var dom2 = document.querySelector("#form106 #fe1191");
var fe1191 = new LiveValidation(dom2, {
  validMessage: "",
  onlyOnBlur: false,
  wait: 300,
  isPhoneField: false
});
fe1191.add(Validate.Custom, {
  against: function (value) {
    return !value.match(
      /(telnet|ftp|https?):\/\/(?:[a-z0-9][a-z0-9-]{0,61}[a-z0-9]\.|[a-z0-9]\.)+[a-z]{2,63}/i
    );
  },
  failureMessage: "Value must not contain any URL's"
});
fe1191.add(Validate.Custom, {
  against: function (value) {
    return !value.match(/(<([^>]+)>)/gi);
  },
  failureMessage: "Value must not contain any HTML"
});
fe1191.add(Validate.Presence, {
  failureMessage: "This field is required"
});
fe1191.add(Validate.Custom, {
  against: function (value) {
    return !value.match(/[<>/{}*]/gi);
  },
  failureMessage: "Value must not contain special characters '<>/{}*' "
});
var dom3 = document.querySelector("#form106 #fe1192");
var fe1192 = new LiveValidation(dom3, {
  validMessage: "",
  onlyOnBlur: false,
  wait: 300,
  isPhoneField: false
});
fe1192.add(Validate.Custom, {
  against: function (value) {
    return !value.match(
      /(telnet|ftp|https?):\/\/(?:[a-z0-9][a-z0-9-]{0,61}[a-z0-9]\.|[a-z0-9]\.)+[a-z]{2,63}/i
    );
  },
  failureMessage: "Value must not contain any URL's"
});
fe1192.add(Validate.Custom, {
  against: function (value) {
    return !value.match(/(<([^>]+)>)/gi);
  },
  failureMessage: "Value must not contain any HTML"
});
fe1192.add(Validate.Presence, {
  failureMessage: "This field is required"
});
fe1192.add(Validate.Custom, {
  against: function (value) {
    return !value.match(/[<>/{}*]/gi);
  },
  failureMessage: "Value must not contain special characters '<>/{}*' "
});
var dom4 = document.querySelector("#form106 #fe1193");
var fe1193 = new LiveValidation(dom4, {
  validMessage: "",
  onlyOnBlur: false,
  wait: 300,
  isPhoneField: false
});
fe1193.add(Validate.Custom, {
  against: function (value) {
    return !value.match(
      /(telnet|ftp|https?):\/\/(?:[a-z0-9][a-z0-9-]{0,61}[a-z0-9]\.|[a-z0-9]\.)+[a-z]{2,63}/i
    );
  },
  failureMessage: "Value must not contain any URL's"
});
fe1193.add(Validate.Custom, {
  against: function (value) {
    return !value.match(/(<([^>]+)>)/gi);
  },
  failureMessage: "Value must not contain any HTML"
});
fe1193.add(Validate.Format, {
  pattern:
    /(^[A-Z0-9!#\$%&'\*\+\-\/=\?\^_`\{\|\}~][A-Z0-9!#\$%&'\*\+\-\/=\?\^_`\{\|\}~\.]{0,62}@(([A-Z0-9](?:[A-Z0-9\-]{0,61}[A-Z0-9])?)(\.[A-Z0-9](?:[A-Z0-9\-]{0,61}[A-Z0-9])?)+)$)/i,
  failureMessage: "A valid email address is required"
});
fe1193.add(Validate.Format, {
  pattern: /\.\.|\.@/i,
  failureMessage: "A valid email address is required",
  negate: "true"
});
fe1193.add(Validate.Presence, {
  failureMessage: "This field is required"
});
var dom5 = document.querySelector("#form106 #fe1444");
var fe1444 = new LiveValidation(dom5, {
  validMessage: "",
  onlyOnBlur: false,
  wait: 300,
  isPhoneField: false
});
fe1444.add(Validate.Custom, {
  against: function (value) {
    return !value.match(
      /(telnet|ftp|https?):\/\/(?:[a-z0-9][a-z0-9-]{0,61}[a-z0-9]\.|[a-z0-9]\.)+[a-z]{2,63}/i
    );
  },
  failureMessage: "Value must not contain any URL's"
});
fe1444.add(Validate.Custom, {
  against: function (value) {
    return !value.match(/(<([^>]+)>)/gi);
  },
  failureMessage: "Value must not contain any HTML"
});
fe1444.add(Validate.Presence, {
  failureMessage: "This field is required"
});
fe1444.add(Validate.Custom, {
  against: function (value) {
    return !value.match(/[<>/{}*]/gi);
  },
  failureMessage: "Value must not contain special characters '<>/{}*' "
});
var dom6 = document.querySelector("#form106 #fe1166");
var fe1166 = new LiveValidation(dom6, {
  validMessage: "",
  onlyOnBlur: false,
  wait: 300,
  isPhoneField: false
});
fe1166.add(Validate.Custom, {
  against: function (value) {
    return !value.match(
      /(telnet|ftp|https?):\/\/(?:[a-z0-9][a-z0-9-]{0,61}[a-z0-9]\.|[a-z0-9]\.)+[a-z]{2,63}/i
    );
  },
  failureMessage: "Value must not contain any URL's"
});
fe1166.add(Validate.Custom, {
  against: function (value) {
    return !value.match(/(<([^>]+)>)/gi);
  },
  failureMessage: "Value must not contain any HTML"
});
fe1166.add(Validate.Presence, {
  failureMessage: "This field is required"
});
var dom7 = document.querySelector("#form106 #fe1167");
var fe1167 = new LiveValidation(dom7, {
  validMessage: "",
  onlyOnBlur: false,
  wait: 300,
  isPhoneField: false
});
fe1167.add(Validate.Custom, {
  against: function (value) {
    return !value.match(
      /(telnet|ftp|https?):\/\/(?:[a-z0-9][a-z0-9-]{0,61}[a-z0-9]\.|[a-z0-9]\.)+[a-z]{2,63}/i
    );
  },
  failureMessage: "Value must not contain any URL's"
});
fe1167.add(Validate.Custom, {
  against: function (value) {
    return !value.match(/(<([^>]+)>)/gi);
  },
  failureMessage: "Value must not contain any HTML"
});
fe1167.add(Validate.Presence, {
  failureMessage: "This field is required"
});
document.onload = handleDocumentLoad("form106", "638200148");
function handleDocumentLoad(b, a) {
  window.getElqFormSubmissionToken(b, a);
  // window.processLastFormField()
}
function getElqFormSubmissionToken(g, c) {
  var e = new XMLHttpRequest();
  var b = document.getElementById(g);
  if (b && b.elements.namedItem("elqFormSubmissionToken")) {
    var f = b.action;
    var a = window.getHostName(f);
    a = "https://" + a + "/e/formsubmittoken?elqSiteID=" + c;
    if (a) {
      e.onreadystatechange = function () {
        if (e.readyState === 4) {
          if (e.status === 200) {
            b.elements.namedItem("elqFormSubmissionToken").value =
              e.responseText;
          } else {
            b.elements.namedItem("elqFormSubmissionToken").value = "";
          }
        }
      };
      e.open("GET", a, true);
      e.send();
    } else {
      b.elements.namedItem("elqFormSubmissionToken").value = "";
    }
  }
}
function getHostName(b) {
  if (typeof window.URL === "function") {
    return new window.URL(b).hostname;
  } else {
    var a = b.match(/:\/\/(www[0-9]?\.)?(.[^\/:]+)/i);
    if (
      a !== null &&
      a.length > 2 &&
      typeof a[2] === "string" &&
      a[2].length > 0
    ) {
      return a[2];
    } else {
      return null;
    }
  }
}
// function processLastFormField() {
//   var form = document.getElementById("form106");
//   var lastFormField = form.querySelector("#elq-FormLastRow");
//   lastFormField.style.display = "none";
// }
