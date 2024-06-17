function analyticOlccDLcall(con1,con2,cable,hs,lfs,cl,scaVal){    
    var userstate = getLoggedInUserDetails(),
    id = "", 
    userwebid,
    ustate,
    webid = "";
    if (userstate != "Guest") {
    ustate = userstate.split("@@")[0];
    id = userstate.split("@@")[1];
    userwebid = userstate.split("@@")[2];
    webid = userwebid.split("-")[0];
    //alert(id +"-->"+webid);
    } else {
    ustate = userstate;
    id = 'anonymous';
    webid = 'unknown';
    }    

    var skiptOptionVal = "",
        stockPart = "";
    sessionStorage.getItem("skipid")!=null ? skiptOptionVal="checked" : skiptOptionVal="unchecked";
    var stockPartCheck=document.getElementById("stock-parts").checked;
    stockPartCheck ? stockPart="checked" : stockPart="unchecked"

    var connectorOneFields=con1.split("@@"),
    connectorTwoFields=con2.split("@@"),
    cableFields=cable.split("@@");
    
    

    //window.dataLayer = window.dataLayer || [];
    dataLayer.push({
    event : "cableDesign",
    cableDesign: {
            selectOption: {
                IsCableConnectoroptionSkip:  skiptOptionVal
            },
            filterConfiguration: {
            showStockPart:  stockPart
            },
            connector1: {
                gender: connectorOneFields[1]!="" ? connectorOneFields[1] : "", 
                series: connectorOneFields[0]!="" ? connectorOneFields[0] : "",
                bodyStyle: connectorOneFields[2]!="" ? connectorOneFields[2] : "",
                polarity: connectorOneFields[3]!="" ? connectorOneFields[3] : "",
                impedence: connectorOneFields[4]!="" ? connectorOneFields[4] : "",
                mountingMethod: connectorOneFields[5]!="" ? connectorOneFields[5] : "",
                attachedMethod: connectorOneFields[6]!="" ? connectorOneFields[6] : "",
                searchType:connectorOneFields[7]!="" ? connectorOneFields[7] : "",
                selectedSKU:connectorOneFields[8]!="" ? connectorOneFields[8] : ""
            },
            connector2: {
                gender: connectorTwoFields[1]!="" ? connectorTwoFields[1] : "", 
                series: connectorTwoFields[0]!="" ? connectorTwoFields[0] : "", 
                bodyStyle: connectorTwoFields[2]!="" ? connectorTwoFields[2] : "", 
                polarity: connectorTwoFields[3]!="" ? connectorTwoFields[3] : "", 
                impedence: connectorTwoFields[4]!="" ? connectorTwoFields[4] : "", 
                mountingMethod: connectorTwoFields[5]!="" ? connectorTwoFields[5] : "", 
                attachedMethod: connectorTwoFields[6]!="" ? connectorTwoFields[6] : "", 
                searchType:connectorTwoFields[7]!="" ? connectorTwoFields[7] : "",
                selectedSKU:connectorTwoFields[8]!="" ? connectorTwoFields[8] : ""
            },
            cable: {
                cable: cableFields[0]!="" ? cableFields[0] : "",       
                IL: cableFields[1]!="" ? cableFields[1] : "",     
                flexType: cableFields[2]!="" ? cableFields[2] : "",     
                noOfShields: cableFields[3]!="" ? cableFields[3] : "",     
                impedence: cableFields[4]!="" ? cableFields[4] : "", 
                searchType:cableFields[5]!="" ? cableFields[5] : "",
                selectedSKU:cableFields[6]!="" ? cableFields[6] : ""                 
            },
            assemblyOptions: {
                leadFreeSolder: lfs,
                heatShrink: hs,
                clocking: cl
            }, 
            searchCableAssembly:scaVal,
            visitorState: ustate,
            webId: webid,
            userId: id,
            pageUrl:location.protocol +"//" +location.hostname +location.pathname,
            pageName: pageName,
            pageCategory: 'RF cable designer Main Page'
        }
    }); 
}
function olccAddToCartDataLayer(skuval, qntval, prodcutArr, pgcategory,rfcaTesting) {
    //alert(""+skuval+","+ qntval+","+  prodcutArr+","+  pgcategory+","+ rfcaTesting);
    var userstate = getLoggedInUserDetails(),
        id = "",
        ustate,
        userwebid,
        prodCategory="",
        webid = "";
    if (userstate != "Guest") {
    ustate = userstate.split("@@")[0];
    id = userstate.split("@@")[1];
    userwebid = userstate.split("@@")[2];
    webid = userwebid.split("-")[0];
    //alert(id +"-->"+webid);
    } else {
    ustate = userstate;
    id = 'anonymous';
    webid = 'unknown';
    }   
    
    if (prodcutArr[9] != "") {
    prodcutArr[9].length > 0
        ? (prodCategory = prodcutArr[9].replaceAll(",", "/"))
        : (prodCategory = "");
    }
    if (
    prodcutArr[10] != null &&
    (prodcutArr[10] != undefined) & (prodcutArr[10] != "")
    ) {
    pgcategory = prodcutArr[10];
    }
   
    prodPrice=JSON.stringify(prodcutArr[3]);
    rfcaTesting ? rfcaTesting="selected" : rfcaTesting="unselected";

    dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
    dataLayer.push({
    event: "addToCart",
    ecommerce: {
        actionFeild: {
        list: pgcategory,
        action: "add"
        },
        add: {
        // "add" actionFieldObject measures.
        products: [
            {
            //  adding a product to a shopping cart.
            productSku: prodcutArr[0],
            productName: prodcutArr[1],
            productId: prodcutArr[2],
            productPrice: prodPrice.replace("$",""),
            productStartingPrice: prodcutArr[4].replace("$",""),
            productCategory: prodCategory,
            estimatedDelivery: "",
            productType: "",
            productLength: prodcutArr[5],
            productColor: prodcutArr[6],
            pageUrl:
                location.protocol +
                "//" +
                location.hostname +
                location.pathname,
            pageName: pageName,
            pageCategory: pgcategory,
            bestSellerRank: prodcutArr[7],
            quantity: qntval,
            rfcaTesting:rfcaTesting,
            brand: "Fairview Microwave",
            visitorState: ustate,
            webId: webid,
            userId: id            
            }
        ]
        }
    }
    });
}
function olccProductDLCall(prodDetArr, pgcategory) {
    //alert(prodDetArr.length+"  brandSKU-->"+prodDetArr[0]+"  name-->"+prodDetArr[1]+"  productId-->"+prodDetArr[2]+"  unitPrice-->"+prodDetArr[3]+"  startingPrice-->"+prodDetArr[4]+"  length-->"+prodDetArr[5]+"  color-->"+prodDetArr[6]+"  bestSellerRank-->"+prodDetArr[7]+"  inventory-->"+prodDetArr[8]+" pgcat-->"+pgcategory+" Product Category-->"+prodDetArr[9]);
    if (prodDetArr.length > 0) {
        var userstate = getLoggedInUserDetails(),
        ustate,
        userwebid,
        id = "",
       webid = "";
    if (userstate != "Guest") {
        ustate = userstate.split("@@")[0];
        id = userstate.split("@@")[1];
        userwebid = userstate.split("@@")[2];
        webid = userwebid.split("-")[0];
        //alert(id +"-->"+webid);
    } else {
        ustate = userstate;
        id = 'anonymous';
        webid = 'unknown';
    }
    dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
    dataLayer.push({
        event: "productView",
        product_View: {
        products: [
            {
            productSku: prodDetArr[0],
            productName: prodDetArr[1],
            productId: prodDetArr[2],
            productPrice: prodDetArr[3].replace("$",""),
            productStartingPrice: prodDetArr[4],
            productCategory: prodDetArr[9],
            estimatedDelivery: "",
            productType: prodDetArr[10],
            productLength: prodDetArr[5],
            productColor: prodDetArr[6],
            pageUrl:
                location.protocol +
                "//" +
                location.hostname +
                location.pathname,
            pageName: pageName,
            pageCategory: pgcategory,
            bestSellerRank: prodDetArr[7],
            Inventory: prodDetArr[8],
            brand: "Fairview Microwave",
            visitorState: ustate,
            webId: webid,
            userId: id
            }
        ]
        }
    });
    }
}