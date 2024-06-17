var errorModule = (function(){
  // Read error handling message
function showErrorPopup(type) {
  //if(!type.status){return}
  $(".error_details").each(function (i, ele) {
    let text = $(ele).find(".error_header").text();
    if (text.includes(type?.status) || text.includes(type?.statusCode)) {
      addErrorContent($(ele));
    }
  });
}
  function addErrorContent(currentEle) {
    $("#error-handler .modal-title").html(
      currentEle.find(".error_header").html()
    );
    let error_description = currentEle.find('.error_description').text().includes('#') ? currentEle.find('.error_description').text()?.split('#') : currentEle.find('.error_description').text();
     
    let modal_body_desc = currentEle.find('.error_description').text().includes('#') ?
        '<p class="description-title">'+error_description[0]+'</p><p class="description-text">'+error_description[1]+'</p>' :
        '<p class="description-text">'+error_description+'</p>'     
    $("#error-handler .modal-body").html(
      $('.error-handler-desc').html(modal_body_desc)
    );
    $("#error-handler").modal("show");
    hideSpinner();
  }

  function hideSpinner() {
    $(".overlayCls,.modalCls").addClass("hiddenCls");
    $(".modal-spinner-cls").addClass("hide");
  }

  function checkError(response,badRequest) {
    if(response?.errors && (response?.statusCode!==400 || badRequest))window.errorModule.showErrorPopup(response);
  }

  return {
    showErrorPopup: showErrorPopup,
    checkError:checkError
  }
})(jQuery);

$(document).ready(function () {
  $(".error_continue_btn").off("click").on("click", function () {
    location.reload();
  });  
});
