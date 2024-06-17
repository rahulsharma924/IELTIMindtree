function generalClickFnCoax() {
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
        calculateOutputCoax(operands);
    }
}

function calculateOutputCoax(operands) {
    if (operands[0] <= operands[2]) {
        document.getElementById("errormsg").innerHTML = "Input value error: OD must be > ID";
        document.getElementsByClassName("error")[1].innerHTML = "Incorrect entry";
    } else {
        if (operands[4] == "vop") {
            operands[5] /= 100;
            operands[5] = 1 / (Math.pow(operands[5], 2));
            document.getElementById("er_label").innerHTML = "Dielectric Constant:";
            document.getElementById("er").innerHTML = operands[5].toFixed(1);
        } else {
            var vop = 100 / (Math.sqrt(operands[5]));
            document.getElementById("er_label").innerHTML = "Velocity of Propogation:";
            document.getElementById("er").innerHTML = vop.toFixed(1) + "%";
        }
        operands[0] = lengthConv(operands[1], "in", operands[0]);
        operands[2] = lengthConv(operands[3], "in", operands[2]);
        var zo = 138 / Math.sqrt(operands[5]) * (Math.log(operands[0] / operands[2]) / Math.log(10));
        var fc = 11.8 / (Math.sqrt(operands[5]) * Math.PI * ((operands[0] + operands[2]) / 2));
        var cl = 7.354 * operands[5] / (Math.log(operands[0] / operands[2]) / Math.log(10));
        var il = 140.4 * Math.log(operands[0] / operands[2]) / Math.log(10);
        var i;
        for (i in searchParameterCodes) {
            if (searchParameterCodes[i].calc_type == "Coax Impedance") {
                if (searchParameterCodes[i].param_name == "Impedance") {
                    var impStr = searchParameterCodes[i].param_code;
                }
            }
        }
        var parameter = getClosestCoax(zo.toFixed(0));
        if (parameter == 0) {
            search_str = "/category/rf-coaxial-cable-bulk.html?fm_product_en_qa%5BrefinementList%5D%5BhierarchicalCategories.lvl0%5D%5B0%5D=RF%20Coaxial%20Cable%20Bulk";
        } else {
            search_str = "/category/rf-coaxial-cable-bulk.html?fm_product_en_qa%5BrefinementList%5D%5BhierarchicalCategories.lvl0%5D%5B0%5D=RF%20Coaxial%20Cable%20Bulk" + impStr + "=" + parameter[0] + "^" + parameter[1];
        }
        document.getElementsByClassName("related_search")[0].onclick = function() {
            window.open(search_str);
        }
        ;
        document.getElementById("zo").innerHTML = zo.toFixed(1) + " &Omega;";
        document.getElementById("fc").innerHTML = fc.toFixed(1) + " GHz";
        document.getElementById("cl").innerHTML = cl.toFixed(1) + " pF/ft";
        document.getElementById("il").innerHTML = il.toFixed(1) + " nH/ft";
    }
}
function getClosestCoax(x) {
    var available = [50, 53, 75, 93, 95];
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
