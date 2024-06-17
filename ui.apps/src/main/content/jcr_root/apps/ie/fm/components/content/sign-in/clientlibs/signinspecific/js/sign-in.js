$(document).ready(function () {
  $("#signInTextDesk").click(function () {
    document.cookie = "returnToPath=" + window.location.href + ";path=/;";
  });
  const data = $.fn.cookiesRead().logedInCookiesData();
  if (data && data?.customer) {
    const firstname = `Hi, ${data?.customer?.firstName}`;

    if (firstname) {
      $(".Signin a").attr(
        "href",
        "/content/fm/en/my-account/account-details/personal-information.html"
      );
      $(".Signin a").attr("title", firstname);

      $("#signInTextDesk").html(` <p class="name-ellipsis">${firstname}</p>`);
    }
  }
});
