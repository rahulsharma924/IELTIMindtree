(function ($) {
  $.fn.ieBlogList = function ($component, templateName, blogList, pageSize) {
    const blogListTemplate = $component.find(templateName).html();
    let templateCompile = window.Handlebars.compile(blogListTemplate);

    this.html(templateCompile({ blogList, limitData: pageSize }));
  };
})(jQuery);
