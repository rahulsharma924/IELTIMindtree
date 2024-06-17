function generalClickFnDensity() {
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
        calculateOutputDensity(operands);
    }
}
function calculateOutputDensity(operands) {
    operands[0] = powerConv(operands[1], "W", operands[0]);
    operands[3] = lengthConv(operands[4], "m", operands[3]);

    var pd = (operands[0] * operands[2])/(4 * Math.PI * (Math.pow(operands[3], 2)));

    document.getElementById("range").innerHTML = pd.toPrecision(4) + " Watts/m<sup>2</sup>";
}