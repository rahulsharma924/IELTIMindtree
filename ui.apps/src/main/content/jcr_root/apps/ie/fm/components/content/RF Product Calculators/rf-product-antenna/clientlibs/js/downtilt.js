function changeFnRfd() {
    clearAll();
    let typeErrorHeight = labelDataCalc.messages.typeErrorHeight;
    let typeError = labelDataCalc.messages.typeError;
    var choice = document.getElementById("option2");
    var unit_c = document.getElementById("unit3")
    if (choice.value == "dist") {
        unit_c.disabled = false;
        unit_c.hidden = false;
    } else {
        unit_c.disabled = true;
        unit_c.hidden = true;
    }
}
function calculateOutputRfd(operands) {
    if (operands[0] < 0) {
        document.getElementById("errormsg").innerHTML = typeErrorHeight;
        document.getElementsByClassName("error")[0].innerHTML = typeError;
    } else if (operands[2] < 0) {
        document.getElementById("errormsg").innerHTML = typeErrorHeight;
        document.getElementsByClassName("error")[2].innerHTML = typeError;
    } else if (operands[4] < 0) {
        document.getElementById("errormsg").innerHTML = typeErrorHeight;
        document.getElementsByClassName("error")[4].innerHTML = typeError;
    } else {
        var unit;
        var choice = document.getElementById("option2");
        operands[0] = lengthConv(operands[1], "m", operands[0]);
        operands[2] = lengthConv(operands[3], "m", operands[2]);
        if (choice.value == "dist") {
            unit = "deg";
            var unit2 = operands[1];
            operands[5] = lengthConv(operands[6], "m", operands[5]);
            var downtilt = Math.atan((operands[0] - operands[2]) / operands[5]) * (360 / (2 * Math.PI));
            var ir = (operands[0] - operands[2]) / (Math.tan((downtilt + (operands[7] / 2)) * (Math.PI * 2) / 360));
            var or = (operands[0] - operands[2]) / (Math.tan((downtilt - (operands[7] / 2)) * (Math.PI * 2) / 360));
            document.getElementById("output_type").innerHTML = "Downtilt Angle:";
            document.getElementById("downtilt").innerHTML = downtilt.toPrecision(4) + " " + unit;
        } else {
            var dist = (operands[0] - operands[2]) / Math.tan(operands[5] * (Math.PI * 2) / 360);
            var ir = (operands[0] - operands[2]) / (Math.tan(((operands[5] + (operands[7] / 2)) * (Math.PI * 2) / 360)));
            var or = (operands[0] - operands[2]) / (Math.tan((operands[5] - (operands[7] / 2)) * (Math.PI * 2) / 360));
            dist = lengthConv('m', operands[1], dist);
            unit = operands[1];
            unit2 = unit;
            document.getElementById("output_type").innerHTML = "Receiver Distance:";
            document.getElementById("downtilt").innerHTML = dist.toPrecision(4) + " " + unit;
        }
        ir = lengthConv('m', operands[1], ir);
        or = lengthConv('m', operands[1], or);
        if (ir < 0) {
            ir = Number.POSITIVE_INFINITY;
        } else if (or < 0) {
            or = Number.POSITIVE_INFINITY;
        }
        document.getElementById("iRad").innerHTML = ir.toPrecision(4) + " " + unit2;
        document.getElementById("oRad").innerHTML = or.toPrecision(4) + " " + unit2;
    }
}