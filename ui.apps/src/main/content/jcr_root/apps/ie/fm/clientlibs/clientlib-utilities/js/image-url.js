var imageURL = (function ($) {
  function createImageURL(obj) {
    let OLCCLargeImgUrlCheck = obj.assets
                  ? obj.assets.filter((asset) => asset.url == "/content/dam/infinite-electronics/images/fairview-microwave/application-images/olcc/")
                  : "";
    var flag = "n";
    var largeImg = obj.assets
      ? obj.assets.filter((asset) => asset.type == "LargeImage")
      : "";
    if (largeImg.length > 0 && largeImg != undefined && largeImg != "") {
      for (var i = 0; i < largeImg.length; i++) {
        if (flag == "n") {
          var dynamicImgPath =
            window.location.protocol + "//" + window.location.hostname;
          const IMG_PATH =
            "content/dam/infinite-electronics/product-assets/fairview-microwave/images/";
          var imgPath = utilityMessage?.redirectionURL?.image_path || IMG_PATH;
          if(OLCCLargeImgUrlCheck.length > 0 && OLCCLargeImgUrlCheck != undefined && OLCCLargeImgUrlCheck != "" ){
               imgPath = largeImg[0].url || "/content/dam/infinite-electronics/images/fairview-microwave/application-images/olcc/";
               flag = "y";
               return `${dynamicImgPath}${imgPath}${largeImg[0].name}`;
          } else{
               flag = "y";
               return `${dynamicImgPath}/${imgPath}${largeImg[0].name}`;
          }
        }
      }
    } else return "";
  }
  return {
    createImageURL: createImageURL
  };
})(jQuery);
function getImage(obj) {
  return window.imageURL.createImageURL(obj);
}
