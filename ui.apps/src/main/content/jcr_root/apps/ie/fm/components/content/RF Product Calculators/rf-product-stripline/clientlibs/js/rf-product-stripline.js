function generalClickFnStripline() {
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
        calculateOutputStripline(operands);
    }
}

function calculateOutputStripline(operands) {
    if (operands[1] <= 0) {
        document.getElementById("errormsg").innerHTML = "Input value error: &epsilon;<sub>R</sub> / VoP must be > 0";
        document.getElementsByClassName("error")[1].innerHTML = "Incorrect entry";
    } else if (operands[2] <= 0) {
        document.getElementById("errormsg").innerHTML = "Input value error:  Width must be > 0";
        document.getElementsByClassName("error")[2].innerHTML = "Incorrect entry";
    } else if (operands[4] <= 0) {
        document.getElementById("errormsg").innerHTML = "Input value error:  Height must be > 0";
        document.getElementsByClassName("error")[4].innerHTML = "Incorrect entry";
    } else if (operands[6] <= 0) {
        document.getElementById("errormsg").innerHTML = "Input value error:  Thickness must be > 0";
        document.getElementsByClassName("error")[6].innerHTML = "Incorrect entry";
    } else {
        if (operands[0] == "vop") {
            operands[1] /= 100;
            operands[1] = 1 / (Math.pow(operands[1], 2));
        }
        operands[2] = lengthConv(operands[3], 'mm', operands[2]);
        operands[4] = lengthConv(operands[5], 'mm', operands[4]);
        operands[6] = lengthConv(operands[7], 'mm', operands[6]);
        if (operands[2] / operands[4] <= 0.1 || operands[2] / operands[4] >= 2.0) {
            document.getElementById("errormsg").innerHTML = "Input value error:  Ratio (width/height) must be > 0.1 and < 2.0";
            document.getElementsByClassName("error")[6].innerHTML = "Incorrect entry";
        } else if (operands[6] / operands[4] >= 0.25) {
            document.getElementById("errormsg").innerHTML = "Input value error:  Ratio (thickness/height) < 0.25";
            document.getElementsByClassName("error")[6].innerHTML = "Incorrect entry";
        } else {
            var imp = (60 / Math.sqrt(operands[1]) * Math.log((1.9 * (2 * operands[4] + operands[6])) / (0.8 * operands[2] + operands[6])));
            document.getElementById("imp").innerHTML = imp.toPrecision(4) + " &Omega;";
        }
    }
}