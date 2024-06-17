$(document).ready(function () {
    if ($(".card-section .linkCard-button #forConditionalRedir").length > 0) {
        const userInfo = $.fn.cookiesRead().logedInCookiesData() || {},
            userInfoData = userInfo ? userInfo?.customer : [];
        if (userInfoData) {
            $(".card-section .linkCard-button #forConditionalRedir").attr("href", "/content/fm/en/my-account/orders/order-history.html")
        }
    }
});


