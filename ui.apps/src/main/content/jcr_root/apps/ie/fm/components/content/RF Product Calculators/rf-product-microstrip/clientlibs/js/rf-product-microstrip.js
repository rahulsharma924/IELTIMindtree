function generalClickFnMicrostrip() {
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
        calculateOutputMicrostrip(operands);
    }
}
function ifEnter(e) {
    if (e) {
        if (e.keyCode == '13' || e.which == '13') {
            var buttons = document.getElementsByTagName("INPUT");
            var i;
            for (i = 0; i < buttons.length; i++) {
                if (buttons[i] == e.srcElement) {
                    break;
                }
            }
            while (buttons[i]) {
                if (buttons[i].value == "Calculate") {
                    buttons[i].onclick();
                    break;
                }
                i++;
            }
        }
    }
}
function start_enter() {
    var i;
    var nodes = document.getElementsByTagName("INPUT");
    for (i = 0; i < nodes.length; i++) {
        if (nodes[i].type == "text") {
            nodes[i].onkeypress = ifEnter;
        }
    }
}
window.addEventListener("load", start_enter, true);
function clearAll() {
    var i;
    for (i = 0; i < document.getElementsByClassName("output").length; i++) {
        document.getElementsByClassName("output")[i].innerHTML = "";
    }
    for (i = 0; i < document.getElementsByClassName("error").length; i++) {
        document.getElementsByClassName("error")[i].innerHTML = "";
    }
    for (i = 0; i < document.getElementsByClassName("related_search").length; i++) {
        var productBool = document.getElementsByClassName("related_search")[i];
        if (!!productBool) {
            document.getElementsByClassName("related_search")[0].style["font-weight"] = "bold";
            document.getElementsByClassName("related_search")[i].style.display = "none";
        }
    }
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


function calculateOutputMicrostrip(operands) {
    let mesageText = labelDataCalc.messages;
    let labelText = labelDataCalc.labels;
    if (operands[1] <= 0) {
        document.getElementById("errormsg").innerHTML = mesageText.vopInputError;
        document.getElementsByClassName("error")[1].innerHTML = mesageText.typeError;
    } else if (operands[2] <= 0) {
        document.getElementById("errormsg").innerHTML = mesageText.widthError;
        document.getElementsByClassName("error")[2].innerHTML = mesageText.typeError;
    } else if (operands[4] <= 0) {
        document.getElementById("errormsg").innerHTML = mesageText.heightError;
        document.getElementsByClassName("error")[4].innerHTML = mesageText.typeError;
    } else {
        if (operands[0] == "vop") {
            operands[1] /= 100;
            operands[1] = 1 / (Math.pow(operands[1], 2));
        }
        operands[2] = lengthConv(operands[3], "in", operands[2]);
        operands[4] = lengthConv(operands[5], "in", operands[4]);
        var ratio = operands[2] / operands[4];
        if (ratio < 1) {
            var pout = ((operands[1] + 1) / 2) + ((operands[1] - 1) / 2) * (1 / Math.sqrt(1 + (12 * (1 / ratio))) + (0.04 * Math.pow(1 - ratio, 2)));
            var imp = (60 / Math.sqrt(pout)) * Math.log((8 * (1 / ratio)) + (0.25 * ratio));
        } else {
            var pout = ((operands[1] + 1) / 2) + ((operands[1] - 1) / 2) * (1 / Math.sqrt(1 + (12 * (1 / ratio))));
            var imp = (120 * Math.PI) / (Math.sqrt(pout) * (ratio + 1.393 + (2 * Math.log(ratio + 1.444) / 3)));
        }
        document.getElementById("ratio").innerHTML = ratio.toPrecision(4);
        document.getElementById("pout").innerHTML = pout.toPrecision(4);
        document.getElementById("imp").innerHTML = imp.toPrecision(4) + " "+labelText.omega;
    }
}

