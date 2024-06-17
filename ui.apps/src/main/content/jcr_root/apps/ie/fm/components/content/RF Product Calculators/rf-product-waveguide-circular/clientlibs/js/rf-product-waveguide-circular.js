function generalClickWaveFn() {
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
        calculateWaveOutput(operands);
    }
}
function calculateWaveOutput(operands) {
    var ans;
    operands[0] = lengthConv(operands[1], "m", operands[0]);

    ans = (1.8412 * 3 * Math.pow(10, 8)) / (2 * Math.PI * operands[0]);

    document.getElementById("out").innerHTML = ans.toPrecision(4) + " Hz";
}