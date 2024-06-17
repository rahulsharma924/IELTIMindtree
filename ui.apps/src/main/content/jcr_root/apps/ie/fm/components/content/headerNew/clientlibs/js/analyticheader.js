
	document.querySelector("body").addEventListener('click', function(e) {
        var anchor = e.target.closest('a');
		var button = e.target.closest('button');
		var label= "";
		var category= "";
		if(anchor !== null && anchor.textContent !== null){
		 	label= anchor.textContent.trim();								
			if(anchor.closest('.analyticheader')!=null){ 
				category= "Header";
				if(anchor.closest('.analyticcontactus')!=null){
					formContacusDLcall();
				}
			}			
			if(anchor.closest('.analyticfooter')!=null){				
				var divtag = anchor.closest('.analyticfooter');							
				var mainParentDiv=	divtag.parentNode.parentNode;				
				var mainDiv=mainParentDiv.childNodes;
				var headingText=mainDiv['1'].textContent.trim();					
				category= headingText.toLowerCase()+"-Footer";				
			}
			if(anchor.closest('.analyticherobanner')!=null) { category= "Brochure PDF link-Home Page"; }			
			if(anchor.closest('.analyticexporenewprod')!=null) { category= "PDP-Home Page"; }
			if(anchor.closest('.analyticvieworderhistory')!=null) {category= "Quick order"; }	
			if(anchor.closest('.analyticrfcableconnet')!=null) { category= "RF Cable-Home Page"; }
			if(anchor.closest('.analyticengineer')!=null) { category= "Engineer section-Home Page";}
			if(anchor.closest('.analyticbuyer')!=null) { category= "Buyer section-Home Page";}
			if(anchor.closest('.analyticresource')!=null) {
				var isToolsResourcesPage = window.location.href.includes("tools-resources");
				if(isToolsResourcesPage){
					category= "Technical resources - tools-resource page"
				} 
				else{
				 	category= "Resources section-Home Page";}
				}
			if(anchor.closest('.analyticjoinmailinglist')!=null) { category= "Join our mail list-Home Page"; }
			//analytic code to track start shopping in header section CTA link	
			if(anchor.closest('.analytic-startshopping')!=null) { category= "Start Shopping - Minicart Header-" + currentPageName; }
			if(anchor.closest('.analytcsearch-product')!=null) {			
				labelval=anchor.href.split("#");					
				prodsku=labelval[1].split("/")[0];										
				//prodnameArray=labelval[0].split("/");				
				//prodnameElement=prodnameArray[prodnameArray.length-1];				
				//prodname=prodnameElement.substr(0,prodnameElement.length-5);//to exclude .html from end.				
				//searchterm=prodname;				
				prodname=anchor.textContent.trim();
				searchterm=prodname;								
				globalsearchDataLayer("","product","","",prodsku,prodname,searchterm,"Recommended");				
			}
			if(anchor.closest('.analytcsearch-content')!=null) {				
				searchterm=anchor.href;
				globalsearchDataLayer("","content","","","","",searchterm,"Recommended");
			}
			if(anchor.closest('.analytic-internal-search-content')!=null) {				
				searchterm=anchor.href;
				searchlist="Internal";
				globalsearchDataLayer("","content","","","","",searchterm,"Recommended",searchlist);
			}
			ctalinkDataLayerCall(label,category);
			return false;	
		} else if (button !== null && button.textContent !== null && button.closest('.analyticscheckoutbutton-minicart')!==null) {
			var items = document.querySelectorAll(".minicart__data--fillup .analytics-minicart-listitems");
			var estimatedTaxToBeCollected = ""; var totalPrice = ""; var shippingAndHandling = ""; var shippingPrice = ""; var handlingPrice = "";
			var estimatedDelivery = ""; 
			var itemsArr = []; var productsDataArr = [];
			var step = "1";
			var option = "checkout_process_minicart";
			var pageCategory = 'mini-cart';
			if (items !==null && items !==undefined) {
				totalPrice = document.getElementsByClassName('minicart__totalprice')[0].textContent.trim() ? document.getElementsByClassName('minicart__totalprice')[0].textContent.trim() : "";
				for (i = 0; i < items.length; i++) {
        			productPrice = items[i].getElementsByClassName('minicart__price')[0].textContent.trim() ? items[i].getElementsByClassName('minicart__price')[0].textContent.trim() : "";
					beforeTaxPrice = items[i].getElementsByClassName('minicart__sub--totlaprice')[0].textContent.trim() ? items[i].getElementsByClassName('minicart__sub--totlaprice')[0].textContent.trim() : "";
					var products_data = items[i].getElementsByClassName("minicart__remove--item")[0].getAttribute("data-analyticprod");
					if(products_data!==null && products_data!==undefined){
						productsDataArr = products_data.split("@@");
					}
					productSku = productsDataArr[0] ? productsDataArr[0] : "";
					productName = productsDataArr[1] ? productsDataArr[1] : "";
					productId = productsDataArr[2] ? productsDataArr[2] : "";
					productType = productsDataArr[4] ? productsDataArr[4] : "";
					var analytics_prod_detail = items[i].getElementsByClassName("analytics-prod-minicart")[0].getAttribute("data-analytics-prod-detail");
					quantity = items[i].getElementsByClassName('minicart__qty')[0].value ? items[i].getElementsByClassName('minicart__qty')[0].value : "";
        			itemsObj = productSku + "@@" + productName + "@@" +  productId + "@@" + productPrice + "@@" + shippingAndHandling + "@@" + shippingPrice + "@@" + handlingPrice + "@@" +
					beforeTaxPrice + "@@" + estimatedTaxToBeCollected + "@@" + totalPrice + "@@" +  estimatedDelivery + "@@" +  productType + "@@" + quantity + "@@" + analytics_prod_detail;
        			itemsArr.push(itemsObj);
				}
				checkoutDataLayer(itemsArr,pageCategory,step,option);
			}
		}
		else{
				return true;
		}
  }, false);
