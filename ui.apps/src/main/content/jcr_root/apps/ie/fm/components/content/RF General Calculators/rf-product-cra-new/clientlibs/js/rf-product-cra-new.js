function generalClickFnCra() {
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
        calculateOutputCra(operands);
    }
}
function calculateOutputCra(operands) {
    let mesageText = labelDataCalc.messages;
    let labelText = labelDataCalc.labels;
    if (operands[2] <= 0) {
        document.getElementById("errormsg").innerHTML = mesageText.frequencyError;
        document.getElementsByClassName("error")[0].innerHTML = mesageText.typeError;
    } else if (operands[1] <= 0) {
        document.getElementById("errormsg").innerHTML = mesageText.capacitanceOrReactanceError;
        document.getElementsByClassName("error")[3].innerHTML = mesageText.typeError;
    } else {
        if (operands[3] == "MHz") {
            operands[2] /= 1000;
        }
        switch (operands[0]) {
            case 'c':
                var c = operands[1];
                var x = 1000 / (2 * Math.PI * operands[2] * c);
                var b = 1000 / x;
                break;
            case 'x':
                var x = operands[1];
                var c = 1000 / (2 * Math.PI * operands[2] * x);
                var b = 1000 / x;
                break;
        }

        document.getElementById("c").innerHTML = c.toPrecision(4) + " "+labelText.pF;
        document.getElementById("x").innerHTML = x.toPrecision(4) + " "+labelText.omega;
        document.getElementById("b").innerHTML = b.toPrecision(4) + " "+labelText.mMohs;
    }
}