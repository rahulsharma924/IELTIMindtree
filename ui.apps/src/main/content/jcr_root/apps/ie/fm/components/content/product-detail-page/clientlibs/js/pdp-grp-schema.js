(function () {
  function getAlgoliaResponse() {
    const searchClient = algoliasearch(algId, algApi);
    const index = searchClient.initIndex(indexInuse);
    const skuId = $(".base-sku").text();
    index
      .search(skuId, {
        facetFilters: ["baseItemSKU:" + skuId],
        distinct: false
      })
      .then(({ hits }) => {
        let currentSkuIdObject = hits.find(
          (ele) => ele.objectID === $("#pdpSku").text()
        );
        if (currentSkuIdObject.isMasterCA || currentSkuIdObject.isVariant) {
          $pdpGrpSchema.addGrpSchema(currentSkuIdObject, hits);
        } else {
          $pdpGlobal.productSchema();
        }
      });
  }

  function addGrpSchema(currentSkuIdObject, data) {
    let schemaObj = $pdpGrpSchema.createSchemaObj(data, currentSkuIdObject);
    const scriptTag = `<script type="application/ld+json" id="product-grp-schema">${JSON.stringify(
      schemaObj
    )}</script>`;
    $("head").eq(0).append(scriptTag);
  }
  function createSchemaObj(data, currentSkuIdObject) {
    let schemaObj = $pdpGrpSchema.createObj(currentSkuIdObject);
    if (currentSkuIdObject.isMasterCA) {
      schemaObj = $pdpGrpSchema.ifCurrentBaseSku(schemaObj, data);
    } else {
      schemaObj = $pdpGrpSchema.ifCurrentVarientSku(
        schemaObj,
        data,
        currentSkuIdObject
      );
    }
    return schemaObj;
  }

  function ifCurrentBaseSku(schemaObj, data) {
    schemaObj["variesBy"] = ["size", "length"];
    schemaObj["hasVariant"] = $pdpGrpSchema.createVarientList(data);
    return schemaObj;
  }

  function ifCurrentVarientSku(schemaObj, data, currentSkuIdObject) {
    let baseSkuObj = data.find((ele) => ele.objectID === $(".base-sku").text());
    schemaObj["size"] = $pdpGrpSchema.getSkuLength(currentSkuIdObject);
    schemaObj["isVariantOf"] = $pdpGrpSchema.createObj(baseSkuObj);
    return schemaObj;
  }

  function createVarientList(data) {
    let varientList = [];
    data.map(function (ele) {
      if (ele.objectID !== $(".base-sku").text()) {
        let varientObj = $pdpGrpSchema.createObj(ele);
        varientObj["size"] = $pdpGrpSchema.getSkuLength(ele);
        varientList.push(varientObj);
      }
    });
    return varientList;
  }

  function getSkuLength(ele) {
    let size = ele.objectID.split("-");
    return size[size.length - 1];
  }
  function createObj(data) {
    let imageArray = [];
    if (data.assets !== undefined) {
      imageArray = $pdpGrpSchema.createImgageArray(data.assets);
    }
    let offerObj = $pdpGrpSchema.createOfferObject(data);
    let mainObj = {
      "@context": "https://schema.org/",
      "@type": "ProductGroup",
      ProductGroupID: data.baseItemSKU,
      name: data.name,
      mpn: data.objectID,
      sku: data.objectID,
      description: data.shortDesc,
      image: imageArray,
      brand: {
        "@type": "Brand",
        name: "Fairview Microwave, Inc."
      },
      offers: offerObj
    };
    return mainObj;
  }

  function createImgageArray(imgList) {
    const $hostname = window.location.origin;
    const urlPath = $(".img-in-col").attr("data-img-path");
    let imageArray = [];
    let largeImgArray = imgList.filter(function (ele) {
      return ele.type === "LargeImage";
    });
    largeImgArray.map(function (ele) {
      imageArray.push($hostname + urlPath + ele.name);
    });
    return imageArray;
  }

  function createOfferObject(data) {
    let price = data.pricingTiers;
    let offers;
    return (offers = {
      "@type": "AggregateOffer",
      offerCount: data.inventory,
      lowPrice: price[price.length - 2].price,
      highPrice: price[0].price,
      priceCurrency: data.currencyCode,
      availability: "https://schema.org/OutOfStock",
      url: $pdpGrpSchema.getProductUrl(data)
    });
  }

  function getProductUrl(data) {
    const $hostname = window.location.origin;
    let obj = {
      objectID: data.objectID,
      seoName: data.seoName,
      categorySEOURL: data.categorySEOURL,
      hierarchicalCategories: data.hierarchicalCategories
    };
    return $hostname + SeoUrl(obj);
  }

  window.$pdpGrpSchema = {
    getAlgoliaResponse,
    addGrpSchema,
    createObj,
    createImgageArray,
    createOfferObject,
    getProductUrl,
    createSchemaObj,
    createVarientList,
    ifCurrentBaseSku,
    ifCurrentVarientSku,
    getSkuLength
  };
})();

$(document).ready(function () {
  $pdpGrpSchema.getAlgoliaResponse();
});
