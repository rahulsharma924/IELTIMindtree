//code for analytics datasheet tracking on PDP page
document.querySelector("body").addEventListener('click', function(e) {    
    let buttonElement = e.target.closest('button');
    let anchorElement = e.target.closest('a');
    if(buttonElement !== null && buttonElement.closest('.analytics-datasheet-pdp')!=null){
    let analyticspdpdata = $('#analyticspdpproddetails').value;
    let analyticspdpdataArr = [];
    let dataSheetArray = [];
        if(analyticspdpdata){
            analyticspdpdataArr = analyticspdpdata.split("@@");
        }
    let documentName = buttonElement.title.trim() ? buttonElement.title.trim() : "";
    let productNameDetails = analyticspdpdataArr[1] ? analyticspdpdataArr[1] : "";
    let prodCategory = analyticspdpdataArr[9] ? analyticspdpdataArr[9] : "";
    let specificCategory = "";
    let dataSheetData = documentName + "@@" + "Datasheet PDF" + "@@" + productNameDetails + "@@" + prodCategory + "@@" + "pdp" + "@@" + specificCategory;
    dataSheetArray = dataSheetData.split("@@");
    documentDLCall(dataSheetArray, "Click");
    }
    else if(anchorElement !== null && anchorElement.closest('.analytics-datasheet-pdp')!=null){
    let analyticspdpdata = $('#analyticspdpproddetails').value;
    let analyticspdpdataArr = [];
    let dataSheetArray = [];
        if(analyticspdpdata){
            analyticspdpdataArr = analyticspdpdata.split("@@");
        }
    let documentName = anchorElement.title.trim() ? anchorElement.title.trim() : "";
    let productNameDetails = analyticspdpdataArr[1] ? analyticspdpdataArr[1] : "";
    let prodCategory = analyticspdpdataArr[9] ? analyticspdpdataArr[9] : "";
    let specificCategory = "";
    let dataSheetData = documentName + "@@" + "Datasheet PDF" + "@@" + productNameDetails + "@@" + prodCategory + "@@" + "pdp" + "@@" + specificCategory;
    dataSheetArray = dataSheetData.split("@@");
    documentDLCall(dataSheetArray, "Click");
    }
}, false);