var defaultToken;
$(document).ready(function () {
  const customerToken = window.isCustomerToken();
  const isOnlyCustomerToken = window.isOnlyCustomerToken();
    if (isOnlyCustomerToken) {
    $.ajax({
      type: "GET",
      url: "/bin/viewpaymentmethod",
      data: {CTCustomerToken: customerToken,bearerToken: window.getbearerToken()},
      success: function (viewpaymentmethod,textstatus,xhr) {              
          if(viewpaymentmethod!=null && viewpaymentmethod!=""){
              if(xhr.status == 200 && viewpaymentmethod.statusCode != 401 && viewpaymentmethod.statusCode != 400){
                  var paymentMethods = JSON.stringify(viewpaymentmethod);
                  var data = JSON.parse(paymentMethods);
                  data['paymentMethods'].sort(dynamicSort("default"));
                  var cardData = $('.card_data');
                  for(var i=0; i<data.paymentMethods.length; i++){
                      var cardType = data.paymentMethods[i].cardType;
                      var lastDigit = data.paymentMethods[i].last4;
                      var activeMethod = `<div class="payment-card" style="order:${i+1}">`
                      activeMethod += `<div class="card_div">`
                      activeMethod += `<h2 class="card_name">Credit Card</h2>`

                      if(data.paymentMethods[i].default == true){
                          activeMethod += `<span class="make_default active">Default</span>`
                          activeMethod += `<span class="card_type card_typename">${cardType}</span>`
                          activeMethod += `<span class="card_type">Ending in <span class="last_digit">${lastDigit}</span></span>`
                          activeMethod += `<div class="make_default_div hide">`
                          activeMethod += `<input data-token="${data.paymentMethods[i].token}" id="default-card-input" type="checkbox" class="default_check" value="" name="make_default" onclick="makeDefault(this);">`
                          activeMethod += `<label for="default-card-input" class="make_default_checkbox">Make default card</label>`
                          activeMethod += `</div>`
                      }else{
                          activeMethod += `<span class="make_default">Default</span>`
                          activeMethod += `<span class="card_type card_typename">${cardType}</span>`
                          activeMethod += `<span class="card_type">Ending in <span class="last_digit">${lastDigit}</span></span>`
                          activeMethod += `<div class="make_default_div">`
                          activeMethod += `<input data-token="${data.paymentMethods[i].token}" type="checkbox" class="default_check" value="" name="make_default" onclick="makeDefault(this);">`
                          activeMethod += `<label class="make_default_checkbox">Make default card</label>`
                          activeMethod += `</div>`
                      }
                          activeMethod += `</div></div>`
                          cardData.append(activeMethod);

                  }

              }
          }
      }
   }); 
  }
});
function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] > b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}
//change default card items
function makeDefault(event){
	$(event).prop("checked", true);
    $('.payment-card').removeClass('ordering_default');
	$('.make_default_div').removeClass('hide');
	$(".make_default").removeClass('active');
	$(event).closest('.make_default_div').siblings(".make_default").addClass('active');
    $(event).closest('.payment-card').addClass('ordering_default');
	$(event).closest('.make_default_div').addClass('hide');
	$(".default_check").prop("checked", false);
    defaultToken = $(event).attr('data-token');
	returnDefaulToken(defaultToken);
}

//return default token value
function returnDefaulToken(defaultToken){
	$.ajax({
      type: "PUT",
      url: "/bin/defaultpaymentmethod",
      data: {CTCustomerToken:getCustomerTokenFromCookie(), paymentToken:defaultToken, bearertoken: window.getbearerToken()},
      success: function (defaulypaymentresponse,textstatus,xhr) {              
          if(defaulypaymentresponse!=null && defaulypaymentresponse!=""){
              if(xhr.status == 200 && defaulypaymentresponse.statusCode != 401 && defaulypaymentresponse.statusCode != 400){
                  //alert(JSON.stringify(defaulypaymentresponse));
              }
          }       
      }
   });
}

// Appending My account content to modal on mobile and tablet view starts
const mq = window.matchMedia( "(max-width: 833px)" );
if (mq.matches) { // If media query matches
    const myAccountModalBody = document.getElementById("MyAccountMobilerespModal");
    const myAccountuserDetails = document.getElementById("hello-message");
    const myAccountForm = document.getElementById("new_form");
    myAccountModalBody.appendChild(myAccountForm);
    myAccountModalBody.insertBefore(myAccountuserDetails, myAccountForm); 
 } 
// Appending My account content to modal on mobile and tablet view ends