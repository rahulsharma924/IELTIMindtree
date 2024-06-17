(function ($) {
  $.fn.ieNewsReleaseList = function (
    $component,
    templateName,
    newsList,
    pageSize
  ) {
    const blogListTemplate = $component.find(templateName).html();
    let templateCompile = window.Handlebars.compile(blogListTemplate);

    this.html(templateCompile({ newsList, limitData: pageSize }));
  };
})(jQuery);
