function generalClickFnPi() {
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
        calculateOutputPi(operands);
    }
}

function calculateOutputPi(operands) {
    let mesageText = labelDataCalc.messages;
    let labelText = labelDataCalc.labels;
    let srchUrl = labelDataCalc.redirectionURL;
    if (operands[1] <= 0) {
        document.getElementById("errormsg").innerHTML = mesageText.impedanceError;
        document.getElementsByClassName("error")[1].innerHTML = mesageText.typeError;
    }
    var factor = Math.pow(10, (operands[0] / 20));
    var r1 = operands[1] * ((factor + 1) / (factor - 1));
    var r2 = (operands[1] / 2) * ((Math.pow(10, (operands[0] / 10)) - 1) / factor);

    var parameter = getClosestAtten(operands[0], operands[1]);
    var i;
    for (i in searchParameterCodes) {
        if (searchParameterCodes[i].calc_type == "Attenuator") {
            if (searchParameterCodes[i].param_name == "Attenuation") {
                var attnStr = searchParameterCodes[i].param_code;
            } else if (searchParameterCodes[i].param_name == "Impedance") {
                var impStr = searchParameterCodes[i].param_code;
            }
        }
    }
    if (parameter == 0) {
        search_str = srchUrl.piAttnUrl1;
    } else {
        search_str = srchUrl.piAttnUrl2 + attnStr + "=" + parameter[0] + "^" + parameter[1] + "&" + impStr + "=" + operands[1];
    }
    document.getElementsByClassName("related_search")[0].onclick = function () { window.open(search_str); };

    document.getElementById("r1").innerHTML = r1.toPrecision(4) + " "+labelText.omega;
    document.getElementById("r2").innerHTML = r2.toPrecision(4) + " "+labelText.omega;
}