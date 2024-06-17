$(document).ready(function () {
  commonUtility().dynamicURLUpdate();
  // Set Current level in local Storage
  const $blogDetailsLabel = $(".blog__details--label");
  if ($blogDetailsLabel.length) {
    $blogDetailsLabel.on("click", function (e) {
      e.preventDefault();
      localStorage.setItem("blogLabel", e.target.text);
      window.location.href = "/blog.html";
    });
  }
  setTimeout(function () {
    $("#main_blog_article .social_icons")
      .addClass("show_social_icons")
      .removeClass("social_icons");
  }, 250);
  articleSchema();
  function articleSchema() {
    const $hostname = window.location.origin;
    let splitDate = $(".blog_post_author")
      .text()
      .split(" | ")[1]
      .replaceAll(",", "")
      .split(" ");
    let publishDate = splitDate[2] + "-" + splitDate[0] + "-" + splitDate[1];
    let logoUrl = $(".logoFM img").attr("src");
    let imgUrl = $(".hero_image_container img").attr("src");
    let description = $(".blog_fullcontent")
      .text()
      .split(" ")
      .slice(0, 30)
      .join(" ");
    let scriptTag = `<script type="application/ld+json" id="artical-schema">
            {
              "@context": "http://schema.org",
              "@type": "Article",
              "author": "Fairview Microwave",
              "datePublished": "${publishDate}",
              "dateModified": "",
              "mainEntityOfPage":{
                "@type":"WebPage",
                "@id":"${window.location.href}"
              },
              "headline": "${$(".blog_title").text()}",
              "image": {
                "@type": "ImageObject",
                "url": "${$hostname + imgUrl}"
              },
          "publisher": {
                "@type": "Organization",
                "name": "Fairview Microwave",
                "url": "https://www.fairviewmicrowave.com/",
                "logo": {
                  "@type": "ImageObject",
                  "url": "${$hostname + logoUrl}"
                }
              },
              "description": "${description}"
            }
            </script>`;
    $("head").eq(0).append(scriptTag);
  }
});
