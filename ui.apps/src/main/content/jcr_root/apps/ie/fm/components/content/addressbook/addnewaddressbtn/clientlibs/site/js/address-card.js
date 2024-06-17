(function ($) {
  $.fn.ieAddressCard = function ($component, data) {
    const addressCardTemplate = $component
      .find(".address__cart--template")
      .html();
    let templateCompile = window.Handlebars.compile(addressCardTemplate);

    this.append(templateCompile(data));
  };
})(jQuery);
