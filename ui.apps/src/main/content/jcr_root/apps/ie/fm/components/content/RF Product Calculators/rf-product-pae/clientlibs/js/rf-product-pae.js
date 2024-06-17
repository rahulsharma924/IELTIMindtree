function generalClickFnPae() {
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
        calculateOutputPae(operands);
    }
}
function calculateOutputPae(operands) {
    var ans;
    operands[0] = powerConv(operands[1], "W", operands[0]);
    operands[2] = powerConv(operands[3], "W", operands[2]);
    operands[4] = powerConv(operands[5], "W", operands[4]);
    ans = 100 * (operands[2] - operands[0]) / operands[4];
    document.getElementById("out").innerHTML = ans.toPrecision(4) + "%";
}
