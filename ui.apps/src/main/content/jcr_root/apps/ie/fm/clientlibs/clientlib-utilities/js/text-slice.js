var textSlice = (function () {
  const textSliceWithLimit = (skuTitle, number = 20) => {
    if (skuTitle.length > number) {
      return skuTitle.slice(0, number);
    } else {
      return skuTitle;
    }
  };
  return {
    textSliceWithLimit: textSliceWithLimit
  };
})();
