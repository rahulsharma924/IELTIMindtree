(function () {
  let labels, utilityMessage;
  const endPoint = $.fn.getAPIEndpoint(),
    redirectURL = endPoint?.damEndpoint?.redirectURL;
  // Utility JSON
  window.getUTILITYModule
    .getUtility()
    .done(function (data) {
      labels = data[0].labels;
      utilityMessage = data[0];
    })
    .fail(function (error) {});
  // Price Formate
  window.Handlebars.registerHelper("priceFormate", function (price) {
    if (price && price?.fractionDigits) {
      return window.priceFormate.formatPrice(price);
    }
  });

  // SKU return from lineItem or customLineItme (OLCC)
  window.Handlebars.registerHelper(
    "skuVarient",
    function (varientSku, custom, slug) {
      return (
        varientSku ||
        custom?.fields?.sku ||
        custom?.fields?.masterSku ||
        commonUtility().getSkuFromSlug(slug)
      );
    }
  );

  // return category
  window.Handlebars.registerHelper("returnCategory", function (category) {
    if (category) {
      return category.toString().replaceAll(",", "|");
    }
  });

  //seo URL
  window.Handlebars.registerHelper(
    "seoUrl",
    function (
      categorySEOURL,
      seoName,
      objectID,
      masterSku,
      name,
      isMinicart = false
    ) {
      const skuName = name["en-US"] || name["en"] || name;
      if (masterSku) {
        let newURL = window.seoURL.createURL({
          categorySEOURL,
          seoName,
          objectID
        });
        if (newURL.indexOf("undefined") > 0)
          newURL = redirectURL.rfcdProductUrl + masterSku;
        return new window.Handlebars.SafeString(
          `<a href="${newURL}">${
            isMinicart ? window.textSlice.textSliceWithLimit(skuName) : skuName
          }${isMinicart ? "..." : ""}</a>`
        );
      } else {
        const newURL = window.seoURL.createURL({
          categorySEOURL,
          seoName,
          objectID
        });
        return new window.Handlebars.SafeString(
          `<a href="${newURL}">${
            isMinicart ? window.textSlice.textSliceWithLimit(skuName) : skuName
          }${isMinicart ? "..." : ""}</a>`
        );
      }
    }
  );
  //Only seo URL
  window.Handlebars.registerHelper(
    "seoLevelUrl",
    function (categorySEOURL, seoName, objectID) {
      const newURL = window.seoURL.createURL({
        categorySEOURL,
        seoName,
        objectID
      });
      return newURL;
    }
  );
  // Image URL
  window.Handlebars.registerHelper(
    "imgURL",
    function (assets, seoName, variantSku, custom, className) {
      let imgPath;
      if (assets && assets.length) {
        imgPath = window.imageURL.createImageURL({ assets });
      } else {
        imgPath =
          utilityMessage.dataIMAGE.rfcd_Product_Image ||
          "/content/dam/infinite-electronics/images/fairview-microwave/application-images/olcc/NewRFProduct.jpg";
      }
      const $imageMarkup = ` <img
    src="${imgPath}"
    alt="${seoName}-${
        variantSku || custom?.fields?.sku || custom?.fields?.masterSku
      }"
    class="${className}"
  />`;

      return new window.Handlebars.SafeString($imageMarkup);
    }
  );

  // is Custom Filed
  window.Handlebars.registerHelper("customValue", function (customSku) {
    return customSku ? false : true;
  });

  //is master SKU check (Cable Assembly)
  window.Handlebars.registerHelper(
    "masterProduct",
    function (length, isCableAssembly) {
      return length && isCableAssembly ? true : false;
    }
  );

  //estimatedDate
  window.Handlebars.registerHelper("estimatedDate", function () {
    return window.estimatedShipment.getEstimatedShipmentDate();
  });

  //  Set the array data limit
  window.Handlebars.registerHelper("limit", function (arr, limit) {
    if (!Array.isArray(arr)) {
      return [];
    }
    return arr.slice(0, limit);
  });

  /* Function for getting the price slab*/
  window.Handlebars.registerHelper(
    "dropDown",
    function (unitPrice, tierResponse) {
      let formatePrice = window.priceFormate.formatPrice(unitPrice);

      if (tierResponse == undefined) {
        return "";
      }
      var toBeReturned = `<div class="row">
        <table class="table table-bordered">
          <thead><tr><th>${labels.quantity}</th><th class="align_right_td">${
        labels.price
      }</th></tr></thead>
          ${getPriceSlabBody(formatePrice, tierResponse)}
        </table>
      </div>
    `;

      return new window.Handlebars.SafeString(toBeReturned);
    }
  );

  function getPriceSlabBody(unitPrice, tiers) {
    var firstMinQty;
    var firstLine = "";
    if (tiers) {
      firstMinQty = tiers[0].minimumQuantity;

      if (firstMinQty) {
        firstLine = `
                    <tr>
                      <td>1-${parseInt(firstMinQty) - 1}</td>
                      <td class="align_right_td">$${unitPrice}</td>
                    </tr>
                  `;
      } else {
        return `
              <td>1+ </td> 
              <td class="align_right_td">$${unitPrice}</td>
            `;
      }
      var otherLines = "";
      var nxt = 1;
      for (var oneSlab of tiers) {
        if (nxt < tiers.length) {
          otherLines += `<tr>
          <td>${oneSlab?.minimumQuantity}-${
            tiers[nxt]?.minimumQuantity - 1
          }</td>
          <td class="align_right_td">$${window.priceFormate.formatPrice(
            oneSlab?.value
          )}</td>
        </tr>`;
          nxt++;
        } else {
          otherLines += `<tr>
          <td>${oneSlab?.minimumQuantity}+</td>
          <td class="align_right_td">Please call for quote</td>
        </tr>`;
        }
      }

      //var firstLine => should be from 1 to (firstMinQty - 1)
      return `<tbody>
            ${firstLine}
            ${otherLines}
          </tbody>`;
    }
  }
  // Calculate Price Quantity
  window.Handlebars.registerHelper(
    "getPriceOfProdAsPerQuantity",
    function (qty, priceArray) {
      if (priceArray?.tier === undefined) {
        return window.priceFormate.formatPrice(priceArray.value || priceArray);
      }
      let $tiers = priceArray.tiers;
      let upperB = Number($tiers[0].minimumQuantity);
      let lowerB = 1;
      for (let i = 0; i < $tiers.length - 1; i++) {
        if (qty >= lowerB && qty < upperB) {
          return window.priceFormate.formatPrice($tiers[i].value);
        }
        lowerB = upperB;
        upperB = $tiers[i + 1].minimumQuantity;
      }
      return window.priceFormate.formatPrice(priceArray.value || priceArray);
    }
  );
  //for checking if the company name or address line 2 or state code is NA or not
  window.Handlebars.registerHelper("isNotNA", function (strToCheck) {
    if (strToCheck && strToCheck !== "NA") return strToCheck;
    else return "";
  });

  //for checking  whether country is United States and then formatting the phone number
  window.Handlebars.registerHelper(
    "isCountryUSA",
    function (countryCode, phoneNumber) {
      if (countryCode && countryCode === "United States")
        return window.formatPhonetoUS(phoneNumber);
      else return phoneNumber;
    }
  );
  window.Handlebars.registerHelper(
    "priceFormateProductOdered",
    function (price) {
      return (
        "$" +
        price.toLocaleString("en-us", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      );
    }
  );
  window.Handlebars.registerHelper("getSku", function (varientSku, customSku) {
    return varientSku || customSku;
  });
})();
