function generalClickFnRadar() {
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
        calculateOutputRadar(operands);
    }
}

function calculateOutputRadar(operands) {
    operands[0] = powerConv(operands[1], "W", operands[0]);
    operands[7] = powerConv(operands[8], "W", operands[7]);

    operands[5] = Math.sqrt(operands[5]);
    operands[5] = lengthConv(operands[6], "m", operands[5]);
    operands[5] = Math.pow(operands[5], 2);

    if (operands[4] == "MHz") {
        operands[3] *= Math.pow(10, 6);
    } else {
        operands[3] *= Math.pow(10, 9);
    }

    var unit = operands[6];

    var numer = operands[0] * Math.pow(operands[2], 2) * operands[5] * Math.pow(3*Math.pow(10, 8), 2);
    var denom = operands[7] * Math.pow((4 * Math.PI), 3) * Math.pow(operands[3], 2);
    var range = Math.sqrt(Math.sqrt(numer / denom));

    range = lengthConv("m", unit, range);
    document.getElementById("range").innerHTML = range.toPrecision(4) + " " + unit;
}