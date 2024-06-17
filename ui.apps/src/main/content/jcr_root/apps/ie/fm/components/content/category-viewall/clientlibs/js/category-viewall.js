/* Category view all page */
function jsonData() {
  // api url
  //const api_url = "/content/dam/fm/json/Categories.json";
/*
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
*/
  // Function to hide the loader

  // Function to define innerHTML for HTML structure
  // Categories JSON
  window.getAPIModule
    .getCategoriesJson()
    .done(function (data) {
      show(data)
    }).fail(function (error) { });
  function show(data) {
    let catdata = ``;

    // Loop to access all cards
    for (let r of data) {
      let imgurl = utilityMessage?.dataJSON?.category_img_url + "/" + r.category.seoName + ".jpg"
      let plpCategoryName = encodeURIComponent(r.category.name);
      catdata += `      
        <div class="card">
                    <a title="" href="/category/${r.category.seoName}.html">
          <div class="card-img-wrap">
            <img alt="${r.category.name}" src="${imgurl}" class="img-with-text rounded-circle" loading="lazy">
          </div>
          <p>${r.category.name}</p>
        </a>
        </div>`;
    }
    // Setting innerHTML as catdata variable
    document.getElementById("shop-by-category-data").innerHTML = catdata;
  }
}
/* For view all categories */
$(document).ready(function () {
  if ($("#categories-data").length > 0) {
    jsonData();    
  }
});
