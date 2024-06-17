function generalClickFn(calType) {
    clearAll();
    let x = $(".input");// document.getElementsByClassName("input");
    let i;
    let operands = [];
    if (check(x)) {
        for (i = 0; i < x.length; i++) {
            operands.push(convertSI(x[i].tagName, x[i].value));
        }
        $('.result_container')[0].style.display = "inline-block";
        var productBool = $('.related_search')[0];
        if (!!productBool) {
            $(".related_search")[0].style.display = "inline-block";
        }
        if (calType == "power") calculateOutputPowerCon(operands);
        else calculateOutputRatio(operands);
    }
}

function calculateOutputPowerCon(operands) {
    $("#vpp").css("display", "none");
    let temp = powerConv(operands[0], operands[2], operands[1]);
    let powerVal = temp.toFixed(2) + " " + operands[2];
    $("#power").html(powerVal);
    if (operands[2] == "V" || operands[2] == "mV") {
        $("#vpp").css("display", "table-cell");
        let vppVal = (temp * 2 * Math.sqrt(2)).toFixed(2) + " " + operands[2];
        $("#vpp").html(vppVal);
        $("#power").append("<sub>rms</sub>");
        $("#vpp").append("<sub>pp&nbsp;&nbsp;&nbsp;</sub>");
    }
}

function calculateOutputRatio(operands) {
    if (operands[0] == 0) {
        //document.getElementById("errormsg").innerHTML =  "Input value error: Power must not = 0";
        $('#errormsg').html(labelDataCalc.messages.typeErrorPower);
        $(".error")[0].innerHTML = labelDataCalc.messages.typeError;

    }
    if (operands[2] == 0) {
        // document.getElementById("errormsg").innerHTML =   "Input value error: Power must not = 0";
        $('#errormsg').html(labelDataCalc.messages.typeErrorPower);
        // document.getElementsByClassName("error")[2].innerHTML =  "Please enter value";
        $(".error")[2].innerHTML = labelDataCalc.messages.typeError;
    }
    operands[0] = powerConv(operands[1], "W", operands[0]);
    operands[2] = powerConv(operands[3], "W", operands[2]);
    let temp = (10 * Math.log(operands[0] / operands[2])) / Math.log(10);
    //document.getElementById("db").innerHTML = temp.toPrecision(3) + " dB";
    let dbVal = temp.toPrecision(3) + " dB";
    $('#db').html(dbVal);
}

function clearAll() {
    let i;
    for (i = 0; i < $(".output").length; i++) {
        $(".output")[i].innerHTML = "";
    }
    for (i = 0; i < $(".error").length; i++) {
        $(".error")[i].innerHTML = "";
    }
    for (
        i = 0;
        i < $(".related_search").length;
        i++
    ) {
        var productBool = $(".related_search")[i];
        if (!!productBool) {
            $(".related_search")[0].style[
                "font-weight"
            ] = "bold";
            $(".related_search")[i].style.display =
                "none";
        }
    }
}
////////////////////

function check(x) {
    let i;
    let ret = true;
    for (i = 0; i < x.length; i++) {
        let Usenumericvalue = labelDataCalc.messages.Usenumericvalue; 
        let typeErrorAll = labelDataCalc.messages.typeErrorAll;
        let typeErrorUnexpected = labelDataCalc.messages.typeErrorUnexpected;
        let typeError = labelDataCalc.messages.typeError;

        if (!x[i].value || x[i].value == Usenumericvalue) {
            $('#errormsg').html(typeErrorAll)
            $(".error")[i].innerHTML = typeError;

            ret = false;
        } else if (!checkValidity(x[i].tagName, x[i].value)) {
            //document.getElementById("errormsg").innerHTML =        "Input type error: Unexpected characters in input";
            $('#errormsg').html(typeErrorUnexpected)
            $(".error")[i].innerHTML = typeError;
            ret = false;
        }
    }
    return ret;
}
function checkValidity(type, n) {
    let j;
    let numdot = 0;
    if (type == "INPUT") {
        if (isNaN(n)) {
            for (j = 0; j < n.length; j++) {
                if (n[j] == "-" && j != 0) {
                    return false;
                }
                if (n[j] == ".") {
                    if (numdot > 0) {
                        return false;
                    } else {
                        numdot++;
                    }
                }
                if ((n[j] < "0" || n[j] > "9") && n[j] != "." && n[j] != "-") {
                    if (j != n.length - 1 && j != 0) {
                        return false;
                    } else {
                        return checkSIbool(n[j]);
                    }
                }
            }
        }
    }
    return true;
}
function checkSIbool(n) {
    if (
        n == "T" ||
        n == "G" ||
        n == "M" ||
        n == "k" ||
        n == "m" ||
        n == "u" ||
        n == "n" ||
        n == "p"
    ) {
        return true;
    } else {
        return false;
    }
}