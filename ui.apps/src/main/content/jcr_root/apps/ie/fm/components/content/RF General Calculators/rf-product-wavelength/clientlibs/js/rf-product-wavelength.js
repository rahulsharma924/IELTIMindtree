function generalClickFnTEM() {
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
        calculateOutputTEM(operands);
    }
}

function calculateOutputTEM(operands) {
    let mesageText = labelDataCalc.messages;
    if (operands[0] <= 0) {
        document.getElementById("errormsg").innerHTML = mesageText.frequencyError;
        document.getElementsByClassName("error")[0].innerHTML = mesageText.typeError;
    } else if (operands[3] <= 0) {
        document.getElementById("errormsg").innerHTML = mesageText.vopInputError;
        document.getElementsByClassName("error")[3].innerHTML = mesageText.typeError;
    } else {
        if (operands[1] == "MHz") {
            operands[0] /= 1000;
        }
        if (operands[2] == "vop") {
            operands[3] /= 100;
            operands[3] = 1 / (Math.pow(operands[3], 2));
        }
        var lambda = 300 / (operands[0] * Math.sqrt(operands[3]));
        document.getElementById("lambda").innerHTML = lambda.toPrecision(4) + " mm<br/>(" + lengthConv("mm", "in", lambda).toPrecision(4) + " in)";
    }
}
