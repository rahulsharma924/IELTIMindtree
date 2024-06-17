function generalClickFnMicrostripAnt() {
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
        calculateOutputMicroAnt(operands);
    }
}

function calculateOutputMicroAnt(operands) {
    let mesageText = labelDataCalc.messages;
    let labelText = labelDataCalc.labels;
    if (operands[4] <= 0) {
        document.getElementById("errormsg").innerHTML = mesageText.frequencyError;
        document.getElementsByClassName("error")[4].innerHTML = mesageText.typeError;
    } else if (operands[1] <= 0) {
        document.getElementById("errormsg").innerHTML = mesageText.vopInputError;
        document.getElementsByClassName("error")[1].innerHTML = mesageText.typeError;
    } else if (operands[2] <= 0) {
        document.getElementById("errormsg").innerHTML = mesageText.heightError;
        document.getElementsByClassName("error")[2].innerHTML = mesageText.typeError;
    } else {
        if (operands[5] == "MHz") {
            operands[4] /= 1000;
        }
        if (operands[0] == "vop") {
            operands[1] /= 100;
            operands[1] = 1 / (Math.pow(operands[1], 2));
        }
        operands[2] = lengthConv(operands[3], labelText.mm, operands[2]);

        var width = 299.792458 / (2 * operands[4] * Math.sqrt((operands[1] + 1) / 2));
        var eeff = ((operands[1] + 1) / 2) + (((operands[1] - 1) / 2) * (1 / Math.sqrt(1 + (12 * (operands[2] / width)))));
        var leff = 299.792458 / (2 * operands[4] * Math.sqrt(eeff));
        var dell = 0.412 * operands[2] * ((eeff + 0.3) * ((width / operands[2]) + 0.264)) / ((eeff - 0.258) * ((width / operands[2]) + 0.8));
        var length = leff - (2 * dell);
        document.getElementById("width").innerHTML = width.toPrecision(4) + " "+labelText.mm;
        document.getElementById("length").innerHTML = length.toPrecision(4) + " "+labelText.mm;
    }
}