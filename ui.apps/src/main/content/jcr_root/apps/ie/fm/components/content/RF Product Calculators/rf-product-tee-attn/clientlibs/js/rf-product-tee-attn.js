function generalClickTeeFn() {
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
        calculateTeeOutput(operands);
    }
}

function calculateTeeOutput(operands) {
    let mesageText = labelDataCalc.messages;
    let labelText = labelDataCalc.labels;
    let srchUrl = labelDataCalc.redirectionURL;
    if (operands[1] <= 0) {
        document.getElementById("errormsg").innerHTML = mesageText.impedanceError;
        document.getElementsByClassName("error")[1].innerHTML = mesageText.typeError;
    }
    var factor = Math.pow(10, (operands[0] / 20));
    var r1 = operands[1] * ((factor - 1) / (factor + 1));
    var r2 = (operands[1] * 2) * (factor / (Math.pow(10, (operands[0] / 10)) - 1));

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
        search_str = srchUrl.teeAttnUrl1
    } else {
        search_str = srchUrl.teeAttnUrl2;
       // search_str = "/category/rf-attenuators/rf-fixed-attenuators.html?fm_product_en_qa%5BrefinementList%5D%5BhierarchicalCategories.lvl0%5D%5B0%5D=RF%20Attenuators&fm_product_en_qa%5BrefinementList%5D%5BhierarchicalCategories.lvl1%5D%5B0%5D=RF%20Attenuators%20>%20RF%20Fixed%20Attenuators" + attnStr + "=" + parameter[0] + "^" + parameter[1] + "&" + impStr + "=" + operands[1];
    }
    document.getElementsByClassName("related_search")[0].onclick = function () { window.open(search_str); };

    document.getElementById("r1").innerHTML = r1.toPrecision(4) + " "+labelText.omega;
    document.getElementById("r2").innerHTML = r2.toPrecision(4) + " "+labelText.omega;
}

function getClosestAtten(x, ohm) {
    var available = [];
    var options = {
        avail50: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 30, 40, 50, 60],
        avail75: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 16, 20, 30]
    };
    if (ohm == 50) {
        available = options.avail50;
    } else if (ohm == 75) {
        available = options.avail75;
    } else {
        return 0;
    }
    var n, last;
    for (n = 0; n < available.length; n++) {
        if (x <= available[n]) {
            if (n == 0) {
                if ((available[n] - x) < 1) {
                    return new Array(available[n],available[n]);
                } else {
                    return 0;
                }
            } else if (x == available[n]) {
                return new Array(available[n],available[n]);
            } else {
                return new Array(available[last],available[n]);
            }
        } else if (n == available.length - 1) {
            if ((x - available[n]) < 1) {
                return new Array(available[n],available[n]);
            } else {
                return 0;
            }
        }
        last = n;
    }
}