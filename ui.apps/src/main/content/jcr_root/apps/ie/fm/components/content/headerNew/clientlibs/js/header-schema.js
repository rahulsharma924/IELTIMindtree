$(document).ready(function () {

  if ($("#home").length === 0) {
    $headSchema.breadcrumbSchema();
  } else {
    $headSchema.addWebsiteSchema();
    $headSchema.addCorporationSchema();
    $("#home .breadcrumb").remove();
  }
  if ($("#faq-template-container-right").length !== 0) {
    $headSchema.faqSchema();
  }
});

(function ($) {
  const $head = $("head").eq(0);
  const $hostname = window.location.origin;
  function loadBreadCrumbSchema(itemListElement, category,innerEle,secondCategory) {
    let breadcrumbInterval = setInterval(function () {
      if ($(".plp-breadcrumbs ul ." + category + " a").length > 0) {
        itemListElement = pdp_plp_BreadcrumbList(itemListElement, category, innerEle, secondCategory);
        appendBreadcrumb(itemListElement);
        clearInterval(breadcrumbInterval);
      }
    }, 0);
  }
  function addWebsiteSchema() {
    $head.append(
      `<script type="application/ld+json" id="website-schema">
      {
      "@context":"http://schema.org",
      "@type":"WebSite",
      "name":"Fairview Microwave",
      "url":"https://www.fairviewmicrowave.com/",
      "potentialAction":
      {
      "@type":"SearchAction",
      "target":"${$hostname}/content/fm/en/search-results.html?fm_product_en_dev[query]={search_term_string}",
      "query-input":"required name=search_term_string"
      }
      }
      </script>`
    );
  }
  function addCorporationSchema() {
    let logoUrl = $(".logoFM img").attr("src");
    $head.append(
      `<script type="application/ld+json" id="corporation-schema">
       {
         "@context": "http://schema.org",
         "@type": "Corporation",
         "legalName": "Fairview Microwave", 
         "description": "Fairview Microwave is a leading provider of high quality rf microwave and mmWave components providing over 1 million sku's with same day shipping globally.",
         "url": "https://www.fairviewmicrowave.com/",
         "logo": "${$hostname + logoUrl}",
         "parentorganization": "Infinite Electronics",
         "sameAs": [
            "https://www.facebook.com/pages/Fairview-Microwave-Inc/147451475275645",
            "https://twitter.com/Fairview_Micro",
            "https://www.linkedin.com/company/fairview-microwave-inc./"
          ]
       };
       </script>`
    );
  }

  function breadcrumbSchema() {
    let itemListElement = [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.fairviewmicrowave.com/"
      }
    ];
    let plpIdLength = $("#plp-page").length;
    let bestSellerIdLength = $("#bestsellers").length;
    let newReleasesIdLength = $("#new-releases").length;
    let plpClassLength = $(".plp-breadcrumbs").length;
    if (
      plpClassLength !== 0 &&
      (bestSellerIdLength !== 0 ||
        plpIdLength !== 0 ||
        newReleasesIdLength !== 0)
    ) {
      loadBreadCrumbSchema(itemListElement, "category4","strong");
    } else if (plpClassLength !== 0 && $("nav.cmp-breadcrumb").length === 0) {
      loadBreadCrumbSchema(itemListElement, "category3","span","category4");
    } else if ($("nav.cmp-breadcrumb").length === 0) {
      itemListElement = breadcrumbList(itemListElement);
      appendBreadcrumb(itemListElement);
    }
  }

  function breadcrumbList(itemListElement) {
    $(".cmp-breadcrumb__list li:not(:first-child)").each(function (i, ele) {
      let url = $(ele).find(".cmp-breadcrumb__item-link").attr("href");
      if (url === undefined) url = window.location.pathname;
      let listObj = createListObject(
        i + 2,
        $(ele).find("span[itemprop='name']").text(),
        url
      );
      itemListElement.push(listObj);
    });
    return itemListElement;
  }

  function pdp_plp_BreadcrumbList(itemListElement, category, innerEle,secondCategory) {
    let count = 1;
    $(".plp-breadcrumbs ul ." + category + " a").each(function (i, ele) {
      let url = $(ele).attr("href");
      let listObj = createListObject(i + 2, $(ele).text(), url);
      itemListElement.push(listObj);
      count = i + 2;
    });
    if (secondCategory !== undefined) category = secondCategory;
    let name = $(".plp-breadcrumbs ul ."+category+" "+innerEle).text().trim();
    let url = window.location.pathname;
    let listObj = createListObject(count + 1, name, url);
    itemListElement.push(listObj);
    return itemListElement;
  }

  function createListObject(count, name, url) {
    return (listObj = {
      "@type": "ListItem",
      position: count,
      name: name,
      item: $hostname + url
    });
  }

  function appendBreadcrumb(itemListElement) {
    let breadcrumbSchema = `<script type="application/ld+json" id="breadcrumb-schema">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": ${JSON.stringify(itemListElement)}
    }
    </script>`;
    $head.append(breadcrumbSchema);
  }

  function faqSchema() {
    let mainEntity = [];
    let mainEntityObj = "";

    $(".faq__list--item").each(function (i, ele) {
      let faqObj = {
        "@type": "Question",
        name: $(ele).find("h3").text(),
        acceptedAnswer: {
          "@type": "Answer",
          text: $(ele).find(".faq__body").text().replaceAll(/\n/g, " ")
        }
      };
      mainEntity.push(faqObj);
      mainEntityObj = JSON.stringify(mainEntity);
    });
    let scriptTag = `<script type="application/ld+json" id="faq-schema">
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": ${mainEntityObj}
      }
    </script>`;
    $("head").eq(0).append(scriptTag);
  }
  window.$headSchema = {
    breadcrumbSchema,
    addWebsiteSchema,
    addCorporationSchema,
    faqSchema
  }
})(jQuery);
