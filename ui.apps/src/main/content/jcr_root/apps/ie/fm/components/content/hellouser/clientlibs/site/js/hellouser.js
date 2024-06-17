$(document).ready(function () {
  const data = $.fn.cookiesRead().logedInCookiesData();
  if (data && data?.customer) {
    $("#useraccdetails .signin__username").html(
      `Hello, ${data?.customer?.firstName}`
    );
  }
});
