(function ($) {
  function keySpecDom(data, objList) {
    let mainArray = [
      $olccProduct.labelText.connector1,
      $olccProduct.labelText.connector2,
      $olccProduct.labelText.cable,
      $olccProduct.labelText.assemblyOptions
    ];
    var content = "";
    content += "<div class='row'>";
    objList.map(function (ele, i) {
      content += "<div class='col-12 col-md-6 col-lg-3'>";
      var close_list_class = "";
      if (data[ele] == undefined) {
        close_list_class = "close_list";
      }
      content +=
        "<div class='specification-title expand_click " +
        close_list_class +
        "'><span>" +
        mainArray[i] +
        "</span><i class='fa-solid fa-chevron-up icon_section'></i></div>";
      if (data[ele] == undefined) return;
      content += "<div class='list_wrap'>";
      for (let eleObj in data[ele]) {
        var filtername =
          typeof $("#" + eleObj).val() != "undefined"
            ? $("#" + eleObj).val()
            : eleObj;
        content += "<div class='list-item d-flex'>";
        content += "<div class='icon_section'>";
        content += '<i class="fa-regular fa-circle-check"></i>';
        content += "</div>";
        content += "<div class='detail_section d-flex'>";
        content += "<div class='title_section'>" + filtername + ": </div>";
        content += "<div class='value_section'>" + data[ele][eleObj] + "</div>";
        content += "</div>";
        content += "</div>";
      }
      content += "</div>";
      content += "</div>";
    });

    content += "</div>";
    $(".accord-key-desc").append(content);
    $("#cable_color").html(data["cable"]["cableColor"]);
    $olccProduct.productDetail.color = data["cable"]["cableColor"];
  }

  $(document.body).on("click", ".expand_click", function (event) {
    if ($(this).siblings(".list_wrap").children().length < 1) return;
    $(this).siblings(".list_wrap").slideToggle("slow");
    $(this).toggleClass("close_list");
  });
  window.$keySpecs = {
    keySpecDom: keySpecDom
  };
})(jQuery);
