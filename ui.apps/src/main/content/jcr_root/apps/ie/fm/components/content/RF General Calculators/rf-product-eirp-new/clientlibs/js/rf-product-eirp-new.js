function generalClickFnErip() {
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
        calculateOutputErip(operands);
    }
}
function calculateOutputErip(operands) {
    operands[0] = powerConv(operands[1], "dBm", operands[0]);

    var eirp = operands[0] - operands[2] + operands[3];

    document.getElementById("range").innerHTML = eirp.toPrecision(4) + " dB";
}