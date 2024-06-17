var timerId = null,
  timeout = 5;

function WaitUntilCustomerGUIDIsRetrieved() {
  if (!timerId) {
    if (timeout == 0) {
      return;
    }
    if (typeof this.GetElqCustomerGUID === "function") {
      document.forms[
        "FairviewMicrowaveJoinMailingList-63807150296106156"
      ].elements["elqCustomerGUID"].value = GetElqCustomerGUID();
      return;
    }
    timeout -= 1;
  }
  timerId = setTimeout("WaitUntilCustomerGUIDIsRetrieved()", 500);
  return;
}
window.onload = WaitUntilCustomerGUIDIsRetrieved;
//_elqQ.push(["elqGetCustomerGUID"]);

$(".join-mailing-list_main button[type=submit]").on("click", function () {
  let enteredEmail = $("input[type=email]").val();

  $("#form118 input[name=emailAddress]").val(enteredEmail);
});

//============================================================expaned JOML
function handleFormSubmitJ(ele) {
  var submitButton = ele.querySelector("input[type=submit]");
  var spinner = document.createElement("span");
  spinner.setAttribute("class", "loader");
  var elqFormName = $("#form118 input[name=elqFormName]");
  elqFormName.val(elqFormName.val() + "_");
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
var form = document.getElementById("form118");
addChangeHandler(form.getElementsByTagName("input"));
addChangeHandler(form.getElementsByTagName("select"));
addChangeHandler(form.getElementsByTagName("textarea"));
var nodes = document.querySelectorAll("#form118 input[data-subscription]");
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
var nodes = document.querySelectorAll("#form118 select[data-value]");
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
var dom0 = document.querySelector("#form118 #fe1288");
var fe1288 = new LiveValidation(dom0, {
  validMessage: "",
  onlyOnBlur: false,
  wait: 300,
  isPhoneField: false
});
fe1288.add(Validate.Custom, {
  against: function (value) {
    return !value.match(
      /(telnet|ftp|https?):\/\/(?:[a-z0-9][a-z0-9-]{0,61}[a-z0-9]\.|[a-z0-9]\.)+[a-z]{2,63}/i
    );
  },
  failureMessage: "Value must not contain any URL's"
});
fe1288.add(Validate.Custom, {
  against: function (value) {
    return !value.match(/(<([^>]+)>)/gi);
  },
  failureMessage: "Value must not contain any HTML"
});
fe1288.add(Validate.Length, {
  tooShortMessage: "Invalid length for field value",
  tooLongMessage: "Invalid length for field value",
  minimum: 0,
  maximum: 35
});
fe1288.add(Validate.Presence, {
  failureMessage: "This field is required"
});
fe1288.add(Validate.Custom, {
  against: function (value) {
    return !value.match(/[<>/{}*]/gi);
  },
  failureMessage: "Value must not contain special characters '<>/{}*' "
});
var dom1 = document.querySelector("#form118 #fe1289");
var fe1289 = new LiveValidation(dom1, {
  validMessage: "",
  onlyOnBlur: false,
  wait: 300,
  isPhoneField: false
});
fe1289.add(Validate.Custom, {
  against: function (value) {
    return !value.match(
      /(telnet|ftp|https?):\/\/(?:[a-z0-9][a-z0-9-]{0,61}[a-z0-9]\.|[a-z0-9]\.)+[a-z]{2,63}/i
    );
  },
  failureMessage: "Value must not contain any URL's"
});
fe1289.add(Validate.Custom, {
  against: function (value) {
    return !value.match(/(<([^>]+)>)/gi);
  },
  failureMessage: "Value must not contain any HTML"
});
fe1289.add(Validate.Length, {
  tooShortMessage: "Invalid length for field value",
  tooLongMessage: "Invalid length for field value",
  minimum: 0,
  maximum: 35
});
fe1289.add(Validate.Presence, {
  failureMessage: "This field is required"
});
fe1289.add(Validate.Custom, {
  against: function (value) {
    return !value.match(/[<>/{}*]/gi);
  },
  failureMessage: "Value must not contain special characters '<>/{}*' "
});
var dom2 = document.querySelector("#form118 #fe1286");
var fe1286 = new LiveValidation(dom2, {
  validMessage: "",
  onlyOnBlur: false,
  wait: 300,
  isPhoneField: false
});
fe1286.add(Validate.Presence, {
  failureMessage: "This field is required"
});
fe1286.add(Validate.Format, {
  pattern:
    /(^[A-Z0-9!#\$%&'\*\+\-\/=\?\^_`\{\|\}~][A-Z0-9!#\$%&'\*\+\-\/=\?\^_`\{\|\}~\.]{0,62}@(([A-Z0-9](?:[A-Z0-9\-]{0,61}[A-Z0-9])?)(\.[A-Z0-9](?:[A-Z0-9\-]{0,61}[A-Z0-9])?)+)$)/i,
  failureMessage: "A valid email address is required"
});
fe1286.add(Validate.Format, {
  pattern: /\.\.|\.@/i,
  failureMessage: "A valid email address is required",
  negate: "true"
});
document.onload = handleDocumentLoad("form118", "638200148");
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
document.querySelector("body").addEventListener(
  "click",
  function (e) {
    var buttonElement = e.target.closest("button");
    var label = "";
    var category = "",
      formName,
      formAction,
      pageCategory;

    if (
      buttonElement !== null &&
      buttonElement.closest(".analytic-join-our-mailing-list") != null
    ) {
      label = buttonElement.textContent.trim();
      category = "Join our mailing list-" + pageName + " page";
      ctalinkDataLayerCall(label, category);
      formName = "Join our mailing list";
      formAction = "Join our mailing list";
      pageCategory = "Join our mailing list";
      formContacusDLcall(formName, formAction, pageCategory);
    }
  },
  false
);