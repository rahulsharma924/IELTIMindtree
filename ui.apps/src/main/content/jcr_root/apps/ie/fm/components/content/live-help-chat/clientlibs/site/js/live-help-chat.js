window.lhnJsSdkInit = function () {
    lhnJsSdk.setup = {
      application_id: "be50b661-399e-43de-9e9a-89470aca7c39",
      application_secret: "627bd518790e41288bc9f0af71944ddc8454fe5ac6724dcabb"
    };
    lhnJsSdk.controls = [{
      type: "hoc",
      id: "7f246fad-93d3-40f1-b1dc-a3428757499d"
    }];
  };

  (function (d, s) {
    var newjs, lhnjs = d.getElementsByTagName(s)[0];
    newjs = d.createElement(s);
    newjs.src = 'https://developer.livehelpnow.net/js/sdk/lhn-jssdk-current.min.js';
    lhnjs.parentNode.insertBefore(newjs, lhnjs);

  }(document, "script"));


$(document).ready(function(){
  $(".livechat-menu").on("click", function () {
    $("#lhnHocButton").click();
  });
});
