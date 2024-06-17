var priceFormate = (function () {
  var userLang = navigator.language || navigator.userLanguage;
  // formating Price
  const formatPrice = (price) => {
    var divideBy = Math.pow(10, Number(price.fractionDigits));
    let priceVal = Number(Number(price.centAmount) / divideBy);
    const formatter = new Intl.NumberFormat(userLang, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return formatter.format(priceVal);
  };
  // parseFloat number
  function parseFloatNumber(value) {
    return parseFloat(value).toFixed(2);
  }
  // Price Formate for updated method to changes the formate with ,
  function formateCheckout(priceVal) {
    const formatter = new Intl.NumberFormat(userLang, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return formatter.format(priceVal);
  }
  //format number only like inventory
  function formatNumber(value) {
    const formatter = new Intl.NumberFormat(userLang);
    return formatter.format(value);
  }
  return {
    formatPrice: formatPrice,
    parseFloatNumber: parseFloatNumber,
    formateCheckout: formateCheckout,
    formatNumber: formatNumber
  };
})();
