function compliancepdfcheck(event){
  let elements = document.getElementsByClassName("datasheet-btn-pdf");
  let skuValue = event.getAttribute("data-sku");
  let dataSheet = event.getAttribute("data-datasheet");
  let token=window.getbearerToken();
  if(skuValue!=null && dataSheet!=null){ 

 let xhr = new XMLHttpRequest();
  xhr.open('GET','/bin/generatepdf'+'?'+'skuId='+skuValue +'&'+'datasheetval='+dataSheet+'&'+'bearerToken='+token,true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function(e) {
if (this.status == 200) {
    let blob = new Blob([this.response], {
        type: "application/pdf"
    });
    let url = URL.createObjectURL(blob);
    window.open(url);
    var link = document.createElement('a');
    //link.href = url;
   // link.download = skuValue + '.pdf';
  link.click();
}
 };
xhr.send();

 }
}