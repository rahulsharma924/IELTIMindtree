$(document).ready(function () {
  $("#eocsendbtn").on("click", function () {
    getResponseCartEmail();
  });
});

function getEmailIds() {
  var emailArray = [];
  $(".emailmodal-body")
    .find("input[type='email']")
    .each(function (i, ele) {
      if ($(ele).val() !== null) emailArray.push($(ele).val());
    });
  return emailArray;
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

function getProductList() {
  let listOfItems = [],
    productsSkuArray = [];
  $(".single_product_details").each(function () {
    let lineOfItems = {};
    lineOfItems.skuID = $(this).find(".sku_number").attr("data-sku");
    lineOfItems.prodDesc = $(this).find(".cart_product_details > a").text();
    lineOfItems.prodQuantity = $(this)
      .find(".cart_quantity_div")
      .find("input")
      .val();
    lineOfItems.prodPrice = $(this)
      .find(".price")
      .find(".single_pr_price")
      .text();
    lineOfItems.prodTotalPrice = $(this)
      .find(".single_product_total_amount")
      .find("p")
      .text();
    listOfItems.push(lineOfItems);
    productsSkuArray.push(lineOfItems.skuID);
  });
  return {
    listOfItems: listOfItems,
    productsSkuArray: productsSkuArray
  };
}

function getCartKeySpecification(result) {
  let keyValues = [];
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
  if ((result != null || result != undefined) && result.keySpecs != undefined) {
    keySpecs.map((ele, i) => {
      let obj = result.keySpecs.find((obj, i) => obj.name === ele);
      if (obj === undefined) {
        keyValues[i] = "";
      } else {
        keyValues[i] = obj.value;
      }
    });
  }
  return keyValues;
}

function getResponseCartEmail() {
  let listOfItems = [],
    ShippingAmt = "",
    TaxAmt = "",
    orderTotal = "";

  let totalPrice = $("#subtotal").text();
  TaxAmt = $("#estimatedTaxToBeCollected").text();
  ShippingAmt = $("#estShipHandCost").text() ==="Unknown" ? "$0.00" : $("#estShipHandCost").text();
  orderTotal = $("#total_amount").text();
  let productsSkuArray = getProductList().productsSkuArray;
  let productList = getProductList().listOfItems;
  let client = algoliasearch(algId, algApi);
  let indexImg = client.initIndex(indexInuse);
  indexImg
    .getObjects(productsSkuArray, {
      attributesToRetrieve: ["keySpecs"]
    })
    .then(({ results }) => {
      var result = "";
      let keyValues = [];
      productList.map(function (item) {
        if (results != undefined || results != null) {
          result = results.find(function (x) {
            if (x != null && x.objectID) {
              return x.objectID === item.skuID;
            }
          });
        }
        keyValues = getCartKeySpecification(result);
        let lineItem = {
          name: item.prodDesc,
          sku: item.skuID,
          quantity: item.prodQuantity,
          unitprice: item.prodPrice,
          subtotalPrice: item.prodTotalPrice,
          color: keyValues[0],
          coaxType: keyValues[1],
          flexType: keyValues[2],
          impedence: keyValues[3],
          attenuation: keyValues[4],
          maxfrequency: keyValues[5],
          noOfshields: keyValues[6]
        };
        listOfItems.push(lineItem);
      });
      shoppingCartEmail(
        listOfItems,
        totalPrice,
        ShippingAmt,
        TaxAmt,
        orderTotal
      );
    });
}

function shoppingCartEmail(
  listOfItems,
  totalPrice,
  ShippingAmt,
  TaxAmt,
  orderTotal
) {
  const userInfo = getUserData();
  let hostName = window.location.hostname,
    defaultShipAddress,
    defaultBillAddress;
  if (userInfo !== "") {
    defaultShipAddress = getAddress("defaultShippingAddressId");
    defaultBillAddress = getAddress("defaultBillingAddressId");
  }

  let obj = {};
  obj.emailId = $("#email").val();
  let fname = userInfo.firstName || "",
    companyname = userInfo.company || "",
    lname = userInfo.lastName || "",
    emailid = userInfo.email || "";
  $.ajax({
    type: "GET",
    url: "/bin/sendemailshoppingcart",
    data: {
      email: getEmailIds().join(),
      firstname: fname,
      lastname: lname,
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
      ShippingAmt: ShippingAmt,
      TaxAmt: TaxAmt,
      totalAmt: orderTotal,
      hostname: hostName,
      cartresponse: JSON.stringify(listOfItems)
    },
    success: function (loginResponse, textstatus, xhr) {
      //window.errorModule.checkError(loginResponse);
      if (xhr.status == 200 && loginResponse.statusCode != 404) {
        $("#emailpopup").removeClass("show");
        $("body").removeClass("modal-open");
        $("#confirmationmsg").addClass("show");
        //setInterval("location.reload()", 10000);

        // Hide The popup after 1S
        setTimeout(function () {
          $("#confirmationmsg").removeClass("show");
        }, 3000);
        formEmailCartDLcall("Email your cart", "Email your cart details");
      }
    },
    error: function (error) {
      console.error(error);
      window.errorModule.showErrorPopup(error);
    }
  });
}
