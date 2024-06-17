$(document).ready(function () {
  window.getUTILITYModule
    .getUtility()
    .done(function (data) {
      jsonCategories(data[0]);
    })
    .fail(function (error) {});
});

function jsonCategories(utilityMessage) {
  // Categories JSON
  window.getAPIModule
    .getCategoriesJson()
    .done(function (data) {
      var categories = "";
      var urlAppend = `.html`;
      $.each(data, function (key, value) {
        let imgurl =
          utilityMessage?.dataJSON?.category_img_url +
          "/" +
          value.category.seoName +
          ".jpg";
        //CONSTRUCTION OF ROWS HAVING
        // DATA FROM JSON OBJECT
        categories += `<div class="card analyticsshopbycard">
              <a title="${value.category.name}" href="/category/${value.category.seoName}${urlAppend}">
              <div class="card-img-wrap">
              <img alt="${value.category.name}" src="${imgurl}" class="img-with-text"  loading="lazy" /> </div>
              <p>${value.category.name}</p>
              </div>`;

        return key < 10;
      });
      //INSERTING ROWS INTO TABLE
      $("#categoriesData").append(categories);
      //analytics code
      shopByCat();
    })
    .fail(function (error) {});
}

//function for shop by category card click for analytics
function shopByCat() {
  document.querySelector("body").addEventListener(
    "click",
    function (e) {
      var pVal = e.target.closest("p");
      var label = "";
      var category = "";
      if (
        pVal !== null &&
        pVal.textContent !== null &&
        (pVal.closest(".analyticsshopbycard") ||
          pVal.closest(".analyticsshopbycardview")) !== null
      ) {
        label = pVal.textContent.trim();
        category = "Category Tab- Home Page";
        ctalinkDataLayerCall(label, category);
      }
    },
    false
  );
}
/*
function jsonData() {
  // api url
  const api_url = "/content/dam/fm/json/Categories.json";

  // Defining async function
  async function getapi(url) {
    // Storing response
    const response = await fetch(url);

    // Storing data in form of JSON
    var data = await response.json();
    if (response) {
      //hideloader();
    }
    show(data);
  }
  // Calling that async function
  getapi(api_url);

  // Function to hide the loader

  // Function to define innerHTML for HTML structure
  function show(data) {
    let catdata = ``;

    // Loop to access all cards
    for (let r of data.categories) {
      catdata += `      
      <div class="card">
                  <a title="${r?.category?.name}" role="link" href="plp-page.html?${indexInuse}%5BrefinementList%5D%5BhierarchicalCategories.lvl0%5D%5B0%5D=${r.category.categoryUrl}">
        <div class="card-img-wrap">
          <img alt="${r?.category?.name}" src="${r.category.thumbnailUrl}" class="img-with-text">
        </div>
        <p>${r.category.name}</p>
      </a>
                  </div>`;
    }
    // Setting innerHTML as catdata variable
    document.getElementById("shop-by-category-data").innerHTML = catdata;
  }
}
*/
//  jsonData();
/*
if ($("#categories-data").length > 0) {
  jsonData();
}
*/
