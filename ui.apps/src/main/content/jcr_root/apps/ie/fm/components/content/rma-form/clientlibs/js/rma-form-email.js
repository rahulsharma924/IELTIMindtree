$(document).ready(function () {
  var client = algoliasearch(algId, algApi);
  var index = client.initIndex(indexInuse);
  $("#rfSubmitBtn").on("click", function () {
    var enteredSKUs = [];
    $(".act-prod-row .fm-rma-sku").each(function (i, ele) {
      if ($(this).val().trim() !== "") {
        enteredSKUs.push($(this).val());
      }
    });

    index.getObjects(enteredSKUs).then(({ results }) => {
      let toSubmit = true;
      let filledRows = 0;

      $(".act-prod-row .fm-rma-sku").each(function (i, ele) {
        var valueOfID = "rfqSKUinval_" + i;
        // var valueOfInuput = "rfPartNum_"+ i +"-error";
        if ($(this).val().trim() !== "") {
          if (results[filledRows] === null) {
            // eslint-disable-next-line quotes
            toSubmit = false;
            $("#" + valueOfID).text(utilityMessage.messages.validPartNumber);
            $("#rfPartNum_" + i).rules("add", {
              required: false
            });
          } else {
            $("#" + valueOfID).html(" ");
            $("#rfPartNum_" + i).rules("add", {
              required: true
            });
          }
          filledRows++;
        }
      });

      const recaptcha_box_checked = grecaptcha.getResponse() ? true : false;
     
      if ($("#rmaForm").valid() && toSubmit && recaptcha_box_checked) {
        let rmapoitems = [];
        let rfirstname = $("#rfFirstName").val();
        let rlastName = $("#rfLastName").val();
        let rcompnay = $("#rfCompany").val();
        let rjobtitle = $("#rfJob").val();
        let rphone = $("#rfPhone").val();
        let remail = $("#rfEmail").val();
        let rcity = $("#rfCity").val();
        let rstate = $("#rfState").val();
        let rzip = $("#rfZipcode").val();
        let rcountry = $("#rfCountry").val();
        let rfminvoice = $("#rfSalesInvoice").val();
        let rpo = $("#rfPONum").val();
        let rsignature = $("#rfSign").val();
        let rdate = $("#rfDate").val();
        let nameToBeSent = rfirstname+" "+rlastName;
        let rordertype = $(
          "input[type='radio'][name='rmaReqType']:checked"
        ).val();
        setFNameInLocalStorage(rfirstname);
        let $rmaForm = $(".rma-form-skuvalue");
        $.each($rmaForm, function (index, item) {
          var obje = {};
          obje.sku = $(item).find(".fm-rma-sku").val() || "";
          obje.qty = $(item).find(".fm-rma-qty").val() || "";
          obje.ror = $(item).find(".fm-ror").val() || "";
          rmapoitems.push(obje);
        });
        RMAEmailForm(
          nameToBeSent,
          rcompnay,
          rjobtitle,
          remail,
          rphone,
          rcity,
          rstate,
          rzip,
          rcountry,
          rfminvoice,
          rpo,
          rsignature,
          rdate,
          rmapoitems,
          rordertype
        );
      } else {
        errorMsg = erororMessagerma();
        fstatus = "false";
        formRmaDataLayerCall(fstatus,errorMsg);
        return false;
      }
    });
  });
});

function setFNameInLocalStorage(fname){
  localStorage.setItem("rmaFName", fname);
}

/************ Analytics code for RMA form *********** */
function erororMessagerma() {
  let errorMsg = "";
  let cnt = 0;
  $('label[class="error"]').each(function() {
    cnt++;
  });
  $('label[class="error"]').each(function(index) {
    index = index + 1;
    if ($(this).text().length > 0 && index < cnt) {
      if ($(this)[0].id === "rfCountry-error") {
        errorMsg = errorMsg + "Select Country||";
      } else if ($(this)[0].id === "rfState-error") {
        errorMsg = errorMsg + "Select State||";
      } else {
        errorMsg = errorMsg + $(this).text() + "||"
      }
    } else if ($(this).text().length > 0 && index == cnt) {	
	if ($(this)[0].id === "rfCountry-error") {
		errorMsg = errorMsg + "Select Country";
	} else if ($(this)[0].id === "rfState-error") {
		errorMsg = errorMsg + "Select State";
	} else {
		errorMsg = errorMsg + $(this).text();
	}
    }
  });
  return errorMsg;
}

function RMAEmailForm(
  name,
  rcompnay,
  rjobtitle,
  remail,
  rphone,
  rcity,
  rstate,
  rzip,
  rcountry,
  rfminvoice,
  rpo,
  rsignature,
  rdate,
  rmapoitems,
  rordertype
) {
  var hostName = window.location.hostname;
  let salesteamemail = $(".iesalesemail").val();
  $.ajax({
    type: "GET",
    url: "/bin/sendemailrma",
    data: {
      rfname: name,
      rcompany: rcompnay,
      rjob: rjobtitle,
      rphone: rphone,
      email: remail,
      ordertype: rordertype,
      rcity: rcity,
      rstate: rstate,
      rzip: rzip,
      rcountry: rcountry,
      rinvoice: rfminvoice,
      rpo: rpo,
      rsignature: rsignature,
      rdate: rdate,
      rskuvalues: JSON.stringify(rmapoitems),
      domainname: hostName,
      salesteamemail: salesteamemail
    },
    success: function (rmaemailresponse, textstatus, xhr) {
      //window.errorModule.checkError(rmaemailresponse);
      if (rmaemailresponse != null && rmaemailresponse != "") {
        if (xhr.status == 200 && rmaemailresponse.statusCode != 404) {
          window.location.href = "/resources/thank-you-rma.html";
        }
      }
      fstatus = "true";
      formRmaDataLayerCall(fstatus);
    },
    error: function (error) {
      fstatus = "false";
      formRmaDataLayerCall(fstatus);
      window.errorModule.showErrorPopup(error);
    }
  });
}
