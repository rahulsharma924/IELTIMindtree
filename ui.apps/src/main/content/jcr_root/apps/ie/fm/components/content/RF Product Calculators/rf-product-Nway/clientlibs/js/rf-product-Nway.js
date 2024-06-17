
function generalClickFnNway() {
    let categoryData;
    // Category response
    window.getAPIModule
        .getCategoriesJson()
        .done(function (data) {
            categoryData = data;
            clearAll();
    var x = document.getElementsByClassName("input");
    var i;
    var operands = [];
    if (check(x)) {
        for (i = 0; i < x.length; i++) {
            operands.push(convertSI(x[i].tagName, x[i].value));
        }
        document.getElementsByClassName("result_container")[0].style.display = "inline-block";
        var productBool = document.getElementsByClassName("related_search")[0];
        if (!!productBool) {
            document.getElementsByClassName("related_search")[0].style.display = "inline-block";
        }
        calculateOutputNway(operands,categoryData);
    }
        })
        .fail(function (error) {
          console.log(error);
        });
    
}

function calculateOutputNway(operands,categoryData) {
    var tl = -10 * Math.log(1 / Number(operands[0])) / Math.log(10);
    tl += operands[1];

    if (onTheList(operands[0])) {
        var i;
        for (i in searchParameterCodes) { 
            if (searchParameterCodes[i].calc_type == "N-Way Power Divider") {
                if (searchParameterCodes[i].param_name == "Number of Output Ports") {
                    var numStr = searchParameterCodes[i].param_code;
                }
            }
        }
        let subCategoryMatch;
        let level = operands[0] +"-way-power-divider";
        let levels = operands[0] +"-way-power-dividers";
        let seoNameMatched = categoryData.filter(function(category){
            if(category && category?.category.childCategories !==null) {
            return category.category.childCategories.find(function(subCategory){
                    if(subCategory.seoName ===  level) {
                        return subCategory.seoName ===  level
                    } 
                    return subCategory.seoName ===  levels      
                    })
            }
               
        })
        if(seoNameMatched.length > 0) {
            let subCategory = seoNameMatched[0].category.childCategories.find(function(clevel){
                return (clevel.seoName === level || clevel.seoName === levels )
            })
            search_str = `/category/rf-power-dividers/${subCategory.seoName}.html`;
            document.getElementsByClassName("related_search")[0].onclick = function () { window.open(search_str); };
    
        }
    }
     else {
        document.getElementsByClassName("related_search")[0].style.display = "none";
    }

    document.getElementById("tl").innerHTML = tl.toFixed(4) + " dB";
}


function onTheList(n) {
    var theList = [2, 3, 4, 6, 8, 16];
    var i = 0;
    while (i < theList.length) {
        if (n == theList[i]) {
            return true;
        }
        i++;
    }
    return false;
}