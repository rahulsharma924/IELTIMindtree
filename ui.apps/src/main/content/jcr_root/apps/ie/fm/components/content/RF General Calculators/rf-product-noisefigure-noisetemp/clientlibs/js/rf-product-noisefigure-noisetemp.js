function generalClickFnNoiseTemp() {
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
        calculateOutputNTemp(operands);
    }
}

function calculateOutputNTemp(operands) {
    var ans, unit;
    if (operands[0] == "figure") {
        ans = operands[2] * (Math.pow(10, operands[1] / 10) - 1);
        document.getElementById("outlabel").innerHTML = "Noise Temperature:";
        unit = "K";
    } else { //operands[0] == "temp"
        ans = 10 * Math.log10((operands[1] / operands[2]) + 1);
        document.getElementById("outlabel").innerHTML = "Noise Figure:";
        unit = "dB";
    }

    document.getElementById("out").innerHTML = ans.toPrecision(4) + " " + unit;
}