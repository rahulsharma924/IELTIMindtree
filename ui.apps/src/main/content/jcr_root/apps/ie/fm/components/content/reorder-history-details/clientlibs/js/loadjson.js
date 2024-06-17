let getUrlParams = new URLSearchParams(window.location.search);

async function getDataFromAjaxCall() {
  const result = await $.ajax({
    type:"GET",
    url:"/bin/orderdetails",
    data: { 
      customer_token:getUrlParams.get("customer_token"),
      order_id:getUrlParams.get("order_id"),
      bearer_token:getUrlParams.get("bearer_token"),
    },
    success:function(data){
      return data;
    },
    error:function(error){
      return error;
    }
  });
  return result;
}

var globalData = getDataFromAjaxCall();
