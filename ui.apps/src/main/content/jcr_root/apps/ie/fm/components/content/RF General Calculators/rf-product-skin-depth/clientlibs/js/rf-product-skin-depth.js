function generalClickFnSkin() {
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
        calculateOutputSkin(operands);
    }
}
function changeFnSkin() {
    clearAll();
        var res = document.getElementById("res");
        var perm = document.getElementById("perm");
        var material = document.getElementById("option").value;

        res.value = mvals[material][0];
        perm.value = mvals[material][1];

        blurFn(res);
        blurFn(perm);

        if (material == 'xx') {
            res.disabled = false;
            perm.disabled = false;
        } else {
            res.disabled = true;
            perm.disabled = true;
        }
    }
function calculateOutputSkin(operands) {
    let mesageText = labelDataCalc.messages;
    if (operands[1] <= 0) {
        document.getElementById("errormsg").innerHTML = mesageText.resistivityError;
        document.getElementsByClassName("error")[1].innerHTML = mesageText.typeError;
    } else if (operands[2] <= 0) {
        document.getElementById("errormsg").innerHTML = mesageText.vopInputError;
        document.getElementsByClassName("error")[2].innerHTML = mesageText.typeError;
    } else if (operands[3] <= 0) {
        document.getElementById("errormsg").innerHTML = mesageText.frequencyError;
        document.getElementsByClassName("error")[3].innerHTML = mesageText.typeError;
    } else {
        if (operands[4] == "GHz") {
            operands[3] *= 1000;
        }
        var mu = 4 * Math.PI / 10000000;
        operands[3] *= Math.pow(10, 6);
        operands[1] *= Math.pow(10, -6);
        var depth = Math.sqrt((operands[1]) / (Math.PI * operands[3] * operands[2] * mu))

        depth *= Math.pow(10, 5);
        document.getElementById("depth").innerHTML = depth.toPrecision(3) + " &mu;m";
    }
}

var mvals = {
    xx: ["", ""],
    cu: [1.678, 0.999991],
    al: [2.6548, 1.00002],
    au: [2.24, 1],
    ag: [1.586, 0.9998],
    ni: [6.84, 600]
};