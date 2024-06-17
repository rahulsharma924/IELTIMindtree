$(document).ready(function () {
  $(".welcome_page h1 .icon_section").show();
  $(".instruction_wrap .fa-youtube").addClass("d-none");
  $(".expand_click")
    .off("click")
    .on("click", function () {
      $(".welcome_page h1 .icon_section").toggle();
      $("#" + $(this).attr("data-target")).slideToggle("slow");
      $(this).text($(this).text() == "Expand" ? "Close" : "Expand");
      $(".instruction_wrap .fa-youtube").toggleClass("d-none");
    });
  $(".card_section").click(function () {
    if ($("#skip_content_check_box").prop("checked")) {
      sessionStorage.setItem("skipid", true);
    } else {
      sessionStorage.removeItem("skipid");
    }
    var url = $("#rfcabledesignmainpage").val();
    let analyticElement = $(this);
    let analyticlabel = analyticElement[0].innerText.trim();
    let analyticcategory = "The RF Cable Designer - Welcome";
    ctalinkDataLayerCall(analyticlabel, analyticcategory);
    $(location).prop("href", url);
    localStorage.setItem("CableConnectorSection", $(this).attr("id"));
  });
  $("#skip_content_check_box").click(function () {
    if (!$("#skiprfcdwelcome").prop("checked")) {
      sessionStorage.removeItem("skipid");
    }
  });
  if (sessionStorage.getItem("skipid")) {
    var url = $("#rfcabledesignmainpage").val();
    $(location).prop("href", url);
  } else {
    $("#welcome-component").removeClass("hide-component");
  }
});
document.querySelector("body").addEventListener(
  "click",
  function (e) {
    var hyperlinkElement = e.target.closest("a");
    var label = "";
    var category = "";
    if (
      hyperlinkElement !== null &&
      hyperlinkElement.closest(".analyticinstruction") != null
    ) {
      label = hyperlinkElement.textContent.trim();
      category = "The RF Cable Designer - Welcome";
    }
    ctalinkDataLayerCall(label, category);
  },
  false
);
