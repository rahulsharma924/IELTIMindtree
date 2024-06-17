function generalClickFnFree() {
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
        calculateOutputFree(operands);
    }
}

function calculateOutputFree(operands) {
    let mesageText = labelDataCalc.messages;
    let srchUrl = labelDataCalc.redirectionURL;
    if (operands[0] <= 0) {
        document.getElementById("errormsg").innerHTML = mesageText.distanceError;
        document.getElementsByClassName("error")[0].innerHTML = mesageText.typeError;
    } else if (operands[2] <= 0) {
        document.getElementById("errormsg").innerHTML = mesageText.frequencyError;
        document.getElementsByClassName("error")[2].innerHTML = mesageText.typeError;
    } else {
        if (operands[3] == "GHz") {
            operands[2] *= 1000;
        }
        operands[0] = lengthConv(operands[1], "km", operands[0]);

        var fspl = (20 * Math.log(operands[0]) / Math.log(10)) + (20 * Math.log(operands[2]) / Math.log(10));
        fspl -= (operands[4] + operands[5]);
        fspl += 32.44;

        search_str = srchUrl.fsplUrl;
        document.getElementsByClassName("related_search")[0].onclick = function () { window.open(search_str); };

        document.getElementById("fspl").innerHTML = fspl.toPrecision(4) + " dB";
    }
}