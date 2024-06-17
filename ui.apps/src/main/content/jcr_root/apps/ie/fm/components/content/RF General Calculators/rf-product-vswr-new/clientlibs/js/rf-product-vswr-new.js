function generalClickFnVswr() {
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
        calculateOutputVswr(operands);
    }
}

function calculateOutputVswr(operands) {
    let mesageText = labelDataCalc.messages;
    switch (operands[0]) {
        case 'vswr':
            if (operands[1] <= 1) {
                document.getElementById("errormsg").innerHTML = mesageText.vswrError;
                document.getElementsByClassName("error")[1].innerHTML = mesageText.typeError;
                break;
            }
            calcVSWR(operands[1]);
            break;
        case 'rc':
            if (operands[1] <= 0 || operands[1] >= 1) {
                document.getElementById("errormsg").innerHTML = mesageText.reflectionCoefficientError;
                document.getElementsByClassName("error")[1].innerHTML = mesageText.typeError;
                break;
            }
            calcRC(operands[1]);
            break;
        case 'rl':
            if (operands[1] <= 0) {
                document.getElementById("errormsg").innerHTML = mesageText.returnLossError;
                document.getElementsByClassName("error")[1].innerHTML = mesageText.typeError;
                break;
            }
            calcRL(operands[1]);
            break;
        default:
            document.getElementById("errormsg").innerHTML = mesageText.unknownError;
            break;
    }
}

function calcVSWR(vswr) {
    let labelText = labelDataCalc.labels;
    var rc = (vswr - 1) / (vswr + 1);
    var rl = -20 * (Math.log(rc) / Math.log(10));
    var ml = -10 * (Math.log(1 - Math.pow(rc, 2)) / Math.log(10));

    document.getElementById("vswr").innerHTML = vswr.toPrecision(4);
    document.getElementById("rc").innerHTML = rc.toPrecision(4);
    document.getElementById("rl").innerHTML = rl.toPrecision(4) + " "+labelText.dB;
    document.getElementById("ml").innerHTML = ml.toPrecision(4) + " "+labelText.dB;
}

function calcRC(rc) {
    let labelText = labelDataCalc.labels;
    var vswr = (1 + rc) / (1 - rc);
    var rl = -20 * (Math.log(rc) / Math.log(10));
    var ml = -10 * (Math.log(1 - Math.pow(rc, 2)) / Math.log(10));

    document.getElementById("vswr").innerHTML = vswr.toPrecision(4);
    document.getElementById("rc").innerHTML = rc.toPrecision(4);
    document.getElementById("rl").innerHTML = rl.toPrecision(4) + " "+labelText.dB;
    document.getElementById("ml").innerHTML = ml.toPrecision(4) + " "+labelText.dB;
}

function calcRL(rl) {
    let labelText = labelDataCalc.labels;
    var rc = Math.pow(10, (-rl / 20));
    var vswr = (1 + rc) / (1 - rc);
    var ml = -10 * (Math.log(1 - Math.pow(rc, 2)) / Math.log(10));

    document.getElementById("vswr").innerHTML = vswr.toPrecision(4);
    document.getElementById("rc").innerHTML = rc.toPrecision(4);
    document.getElementById("rl").innerHTML = rl.toPrecision(4) + " "+labelText.dB;
    document.getElementById("ml").innerHTML = ml.toPrecision(4) + " "+labelText.dB;
}
