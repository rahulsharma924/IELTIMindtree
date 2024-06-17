var seoURL = (function () {
  function createURL(obj) {
    let objOrig = obj.objectID;
    let objChange = objOrig?.replace(/\//g, "--") ?? "";
    if (
      obj &&
      obj.categorySEOURL &&
      obj.seoName
      //window.location.hostname != "localhost"
    ) {
      if (obj.categorySEOURL) {
        return `/product${obj.categorySEOURL[2]}/${
          obj.seoName
        }.html`;
      } else {
        return `/content/fm/en/pdppage.${obj.seoName}.html`;
      }
    } else {
      return `/content/fm/en/pdppage.${obj.seoName}.html`;
    }
  }
  return {
    createURL: createURL
  };
})();

// create seo URL
function SeoUrl(obj) {
  return window.seoURL.createURL(obj);
}
