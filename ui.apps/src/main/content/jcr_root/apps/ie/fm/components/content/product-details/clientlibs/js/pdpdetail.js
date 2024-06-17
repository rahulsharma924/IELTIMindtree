(function () {
function readMoreNew() {

    let width = $(window).width();
    if (width <= 832) {
      let showChar = 90;
    } else {
      showChar = 200;
    }

    let ellipsestext = "...";
    let moretext =
      "Expand <i class='fa-regular fa-circle-plus font-16' aria-hidden='true'></i>";

    let lesstext =
      "Collapse<i class='fa fa-minus-circle' aria-hidden='true'></i>";

    $(".pdp-morenew").each(function () {
      let content = $(this).html();
      if (content.length > showChar) {
        let c = content.substr(0, showChar);
        let h = content.substr(showChar, content.length - showChar);

        let html =
          c +
          '<span class="moreellipses">' +
          ellipsestext +
          '</span><span class="morecontent"><span>' +
          h +
          '</span>&nbsp;<a title="Read More"  class="morelink ie-withIcon-link">' +
          moretext +
          "</a></span>";

        $(this).html(html);
      }
    });
    $("a.morelink").on("click", function () {
      if ($(this).hasClass("less")) {
        $(this).removeClass("less");
        $(this).html(moretext);
      } else {
        $(this).addClass("less");
        $(this).html(lesstext);
      }
      $(this).parent().prev().toggle();
      $(this).prev().toggle();
      return false;
    });
}

function accordMobKeyCompli() {
    setTimeout(function () {
      $(".accord-key-title").click(function () {
        $(this).toggleClass("open");
        $(".accord-key-desc").toggleClass("open").toggle(300);
        $(".accord-key-links").toggleClass("open").toggle(300);
      });
      $(".accord-compli-title").click(function () {
        $(this).toggleClass("open");
        $(".accord-compli-desc").toggleClass("open").toggle(300);
        $(".accord-compli-links").toggleClass("open").toggle(300);
      });
    }, 800);
    let shipDate = (document.getElementById("shipmentDate").innerHTML =
      getEstimatedShipmentDate());
    $(".shipment-date").each(function () {
      $(this).html(shipDate);
    });
  }


  window.$pdpGlobal = {
    readMoreNew,
    accordMobKeyCompli
  }

})();


  $(document).ready(function () {
    $pdpGlobal.readMoreNew();
    $pdpGlobal.accordMobKeyCompli();
  });