function generalClickFnFriis() {
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
        calculateOutput(operands);
    }
}

function calculateOutput(operands) {
    operands[0] = powerConv(operands[1], "W", operands[0]);

    operands[5] = lengthConv(operands[6], "m", operands[5]);

    if (operands[4] == "MHz") {
        operands[3] *= Math.pow(10, 6);
    } else {
        operands[3] *= Math.pow(10, 9);
    }

    var unit = operands[1];

    //convert from db to linear
    operands[2] = Math.pow(10,operands[2]/10); 
    operands[7] = Math.pow(10,operands[7]/10); 

    var friis = (operands[0]*operands[2]*operands[7]*Math.pow(299792458, 2))/(Math.pow((4*Math.PI*operands[5]*operands[3]), 2));
    // var friis = (operands[0]*operands[2]*operands[7]*Math.pow((3*Math.pow(10,8)), 2))/(Math.pow((4*Math.PI*operands[5]*operands[3]), 2));
    friis = powerConv("W", unit, friis);

    document.getElementById("range").innerHTML = friis.toPrecision(4) + " " + unit;
}