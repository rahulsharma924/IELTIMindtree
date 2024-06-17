function sendIEEmail() {
  window.getAPIModule
    .getActiveCart()
    .done(function (response) {
      if (response && !response.error) {
        lineItemsData(response);
      }
    })
    .fail(function (error) {
      console.error(error);
    });
}
function getUserData() {
  const loggedUserData = $.fn.cookiesRead().logedInCookiesData() || [];
  return loggedUserData?.customer ? loggedUserData?.customer : "";
}

function getAddress(defaultType) {
  let customerInfo = getUserData();
  let defaultAddressId = customerInfo[defaultType];
  let defaultAddress = customerInfo.addresses.find(
    (a) => a.id === defaultAddressId
  );
  let address1, address2, shippingStreetName;

  if (defaultAddress?.streetName !== "") {
    shippingStreetName = defaultAddress.streetName;
  }
  address1 =
    shippingStreetName &&
    defaultAddress?.streetNumber !== "" &&
    defaultAddress?.streetNumber !== "NA"
      ? shippingStreetName + "," + " #" + defaultAddress.streetNumber
      : shippingStreetName
      ? shippingStreetName
      : defaultAddress.streetNumber;
  if (defaultAddress?.state !== "NA") {
    address2 = `${defaultAddress?.city}, ${defaultAddress?.state}, ${
      defaultAddress?.country
    }${" "}${defaultAddress?.postalCode}`;
  } else {
    address2 = `${defaultAddress?.city}, ${defaultAddress?.country}${" "}${
      defaultAddress?.postalCode
    }`;
  }
  return {
    name: defaultAddress.firstName + " " + defaultAddress.lastName,
    add: address1,
    add2: address2,
    phone: defaultAddress.phone
  };
}

function lineItemsData(data) {
  const totalItems = [...data.lineItems, ...data.customLineItems];
  let totalLineItems = commonUtility().responseFilter(totalItems);
  let lineItems = [];
  let productsArray = [];
  $.each(totalLineItems, function (index, item) {
    var y = item.variant;
    productsArray.push(commonUtility().getSkuIdWithoutLength(item));
  });
  var client = algoliasearch(algId, algApi);
  var indexImg = client.initIndex(indexInuse);
  indexImg
    .getObjects(productsArray, {
      attributesToRetrieve: ["keySpecs", "assets"]
    })
    .then(({ results }) => {
      var result = "";
      let keyValues = [];
      totalLineItems.map(function (item) {
        if (results != undefined || results != null) {
          result = results.find(function (x) {
            if (x != null && x.objectID) {
              return x.objectID === commonUtility().getSkuIdWithoutLength(item);
            }
          });
        }
        let keySpecs = [
          "color",
          "Coax Type",
          "Flex Type",
          "Impedance",
          "Attenuation at 1 Ghz.",
          "Frequency, Max",
          "No. of Shields"
        ];
        keyValues.length = 0;
        if (
          (result != null || result != undefined) &&
          result.keySpecs != undefined
        ) {
          keySpecs.map((ele, i) => {
            let obj = result.keySpecs.find((obj, i) => obj.name === ele);
            if (obj === undefined) {
              keyValues[i] = "";
            } else {
              keyValues[i] = obj.value;
            }
          });
        }
        var totalPriceDecimal = item.totalPrice["centAmount"] / 100;
        totalPriceDecimal = totalPriceDecimal.toFixed(2);
        let itemPrice =
          item?.price?.value?.centAmount || item?.money?.centAmount;
        var priceDecimal = itemPrice / 100;
        priceDecimal = priceDecimal.toFixed(2);
        let assets = result ? result?.assets : [];
        let imgUrl = "";
        if (assets && assets.length) {
          imgUrl = window.imageURL.createImageURL({ assets });
        } else {
          imgUrl =
            "/content/dam/infinite-electronics/images/fairview-microwave/application-images/olcc/NewRFProduct.jpg";
        }
        let lineItem = {
          quantity: item.quantity,
          name: item.name["en"] || item.name["en-US"],
          subtotalPrice: totalPriceDecimal,
          unitprice: priceDecimal,
          color: keyValues[0],
          coaxType: keyValues[1],
          flexType: keyValues[2],
          impedence: keyValues[3],
          attenuation: keyValues[4],
          maxfrequency: keyValues[5],
          noOfshields: keyValues[6],
          image: imgUrl,
          sku: item?.variant?.sku || item?.custom?.fields?.masterSku
        };

        lineItems.push(lineItem);
      });
      cartRfqEmail(lineItems);
    });
}

function cartRfqEmail(listOfItems) {
  const subTotal = $("#totalBeforeTax").text(),
    taxAmount = $("#estimatedTaxToBeCollected").text(),
    shippingHandlingCharge = $("#estShipHandCost").text(),
    totalPrice = $("#total_amount").text();
  const userInfo = getUserData();
  let hostName = window.location.hostname,
    defaultShipAddress,
    defaultBillAddress;
	 if (userInfo !== "") {
    defaultShipAddress = getAddress("defaultShippingAddressId");
    defaultBillAddress = getAddress("defaultBillingAddressId");
  }
  
  var pageURL = window.location.href;
  var name = $("#firstName-rfq").val() + " " + $("#lastName-rfq").val();
  var obj = {};
  obj.emailId = $("#email-rfq").val();
  var ieemailid = $("#iesalesemaiid").val();
  let emailid = userInfo.email || "";
  const data = {
    email: obj.emailId,
	shippingName: defaultShipAddress?.name || "",
    shippingadd: defaultShipAddress?.add || "",
    shippingadd2: defaultShipAddress?.add2 || "",
    shippingemail: emailid,
    shippingPhone: defaultShipAddress?.phone || "",
    billingName: defaultBillAddress?.name || "",
    billingadd: defaultBillAddress?.add || "",
    billingadd2: defaultBillAddress?.add2 || "",
    billingemail: emailid,
    billingPhone: defaultBillAddress?.phone || "",
    totalPrice: totalPrice,
    subTotal: subTotal,
    ShippingAmt:
      shippingHandlingCharge === "Unknown" ? "$0.00" : shippingHandlingCharge,
    TaxAmt: taxAmount,
    totalAmt: totalPrice,
    customername: name,
    linkurl: pageURL,
    domainname: hostName,
    ieemailidval: ieemailid,
    cartresponse: JSON.stringify(listOfItems)
  };
  window.getAPIModule
    .getSendEmailRfq(data)
    .done(function (response) {
      //window.errorModule.checkError(response);
      if (response && !response.error) {
        $("#rfqModal").modal("hide");
        $("#rfqSaveModal").modal("show");
      }
      formStatus = "true";
      formRfqDataLayerCall(formStatus, listOfItems);
    })
    .fail(function (error) {
      console.log(error);
      formStatus = "false";
      formRfqDataLayerCall(formStatus, listOfItems);
      window.errorModule.showErrorPopup(error);
    });
}
