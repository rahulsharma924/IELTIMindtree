
function generalClickFnBridgedTee() {

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
        calculateOutputTee(operands);
    }
}

function calculateOutputTee(operands) {
    if (operands[1] <= 0) {
        document.getElementById("errormsg").innerHTML = typeErrorImpedance;
        document.getElementsByClassName("error")[1].innerHTML = typeError;
    }
    var factor = Math.pow(10, (operands[0] / 20));
    var r1 = operands[1] * (factor - 1);
    var r2 = operands[1] * (1 / (factor - 1));
    var parameter = getClosestAtten(operands[0], operands[1]);
    var i;
    for (i in searchParameterCodes) {
        if (searchParameterCodes[i].calc_type == "Attenuator") {
            if (searchParameterCodes[i].param_name == "Attenuation") {
                var attnStr = searchParameterCodes[i].param_code;
            } else if (searchParameterCodes[i].param_name == "Impedance") {
                var impStr = searchParameterCodes[i].param_code;
            }
        }
    }
    if (parameter == 0) {
        search_str = "/category/rf-attenuators/rf-fixed-attenuators.html?fm_product_en_qa%5BrefinementList%5D%5BhierarchicalCategories.lvl0%5D%5B0%5D=RF%20Attenuators&fm_product_en_qa%5BrefinementList%5D%5BhierarchicalCategories.lvl1%5D%5B0%5D=RF%20Attenuators%20%3E%20RF%20Fixed%20Attenuators";
    } else {
        search_str = "/category/rf-attenuators/rf-fixed-attenuators.html?fm_product_en_qa%5BrefinementList%5D%5BhierarchicalCategories.lvl0%5D%5B0%5D=RF%20Attenuators&fm_product_en_qa%5BrefinementList%5D%5BhierarchicalCategories.lvl1%5D%5B0%5D=RF%20Attenuators%20%3E%20RF%20Fixed%20Attenuators" + attnStr + "=" + parameter[0] + "^" + parameter[1] + "&" + impStr + "=" + operands[1];
    }
    document.getElementsByClassName("related_search")[0].onclick = function() {
        window.open(search_str);
    }
    ;
    document.getElementById("r1").innerHTML = r1.toPrecision(4) + " &Omega;";
    document.getElementById("r2").innerHTML = r2.toPrecision(4) + " &Omega;";
}
