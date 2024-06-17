function generalClickFnResonance() {
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
        calculateOutputResonance(operands);
    }
}
function calculateOutputResonance(operands) {
    let mesageText = labelDataCalc.messages;
    if (operands[0] <= 0) {
        document.getElementById("errormsg").innerHTML = mesageText.capacitanceError;
        document.getElementsByClassName("error")[0].innerHTML = mesageText.typeError;
    } else if (operands[1] <= 0) {
        document.getElementById("errormsg").innerHTML = mesageText.inductanceError;
        document.getElementsByClassName("error")[1].innerHTML = mesageText.typeError;
    }
    var unit;
    var fr = 1 / (2 * Math.PI * Math.sqrt(operands[0] * operands[1]));
    fr /= Math.pow(10, 6);
    if (fr >= 1000) {
        fr /= 1000;
        unit = "GHz";
    } else {
        unit = "MHz";
    }
    document.getElementById("fr").innerHTML = fr.toPrecision(4) + " " + unit;
}
