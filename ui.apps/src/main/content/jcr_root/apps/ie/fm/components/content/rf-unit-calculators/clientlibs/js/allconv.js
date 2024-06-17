function changeFnUnit() { 
    clearAll();
    let i;
    let conv = $("#option").val();
    let alldiv = $('.conv_cont');
    let eq = $("#eq");
    let eqstring = utilityMessage.dataIMAGE.allconv_Conv_Image + conv + "conv_eq.png";
    $("#eq").attr('src',eqstring);
    for (i = 0; i < alldiv.length; i++) {
        if (alldiv[i].id == conv) {
            alldiv[i].style.display = "inline";
        } else {
            alldiv[i].style.display = "none"
        }
    }
}
function clickFnAllconv(type) {
    clearAll();
    let out;
    let x = [];
    x = $('#' + type).find('.input');
    let i;
    let operand;
    if (mod_check(type, x)) {
        operand = convertSI(x[1].tagName, x[1].value);
        switch (type) {
            case 'length':
                out = lengthConv(x[0].value, x[2].value, operand);
                break;
            case 'mass':
                out = massConv(x[0].value, x[2].value, operand);
                break;
            case 'powerwrap':
                out = powerConv(x[0].value, x[2].value, operand);
                break;
            case 'ratio':
                let operands = [convertSI(x[0].tagName, x[0].value), convertSI(x[1].tagName, x[1].value), convertSI(x[2].tagName, x[2].value), convertSI(x[3].tagName, x[3].value)]

                operands[0] = powerConv(operands[1], "W", operands[0]);
                operands[2] = powerConv(operands[3], "W", operands[2]);
                out = 10 * Math.log(operands[0] / operands[2]) / Math.log(10);
                break;
            case 'torque':
                switch (x[2].value) {
                    case 'Nm':
                        out = calcNm(x[0].value, operand);
                        break;
                    case 'ft-lbs':
                        out = calcFl(x[0].value, operand);
                        break;
                    case 'in-lbs':
                        out = calcIl(x[0].value, operand);
                        break;
                    default:
                        $('#' + type).find('.error')[0].innerHTML = labelDataCalc.messages.UnknownError;
                        break;
                }
                break;
            case 'temp':
                let codeF = String.fromCharCode(176) + 'F';
                let codeC = String.fromCharCode(176) + 'C';
                let codeK = String.fromCharCode(176) + 'K';
                switch (x[2].value) {
                    case codeF:
                        out = calcFar(x[0].value, operand);
                        break;
                    case codeC:
                        out = calcCel(x[0].value, operand);
                        break;
                    case codeK:
                        out = calcKel(x[0].value, operand);
                        break;
                    default:
                        $('#' + type).find('.error')[0].innerHTML = labelDataCalc.messages.UnknownError;
                        break;
                }
                break;
            default:
                break;
        }
        $('#' + type).find('.result_container')[0].style.display = "inline-block";
        if (type == "ratio") {
            $('#' + type).find(".output")[0].innerHTML = out.toPrecision(4) + " dB";
        } else {
            $('#' + type).find(".output")[0].innerHTML = out.toPrecision(4) + " " + x[2].value;
        }
        if (type == "powerwrap" && (x[2].value == "V" || x[2].value == "mV")) {
            $('#vpp_power').css('display', 'table-cell');
            let vppVal = ((out * 2 * Math.sqrt(2)).toFixed(2)) + " " + x[2].value;
            $('#vpp_power').html(vppVal);
            document.getElementById(type).getElementsByClassName("output")[0].innerHTML += "<sub>rms</sub>";
            $('#vpp_power').append("<sub>pp&nbsp;&nbsp;&nbsp;</sub>");
        } else {
            $('#vpp_power').css('display', 'none');
        }
    }
}
function mod_check(type, x) {
    let i;
    let errorArray = $('#'+type).find(".error");
    let ret = true;
    for (i = 0; i < x.length; i++) {
        if (!x[i].value) {
            errorArray[errorArray.length - 1].innerHTML = labelDataCalc.messages.typeErrorAll;
            errorArray[i].innerHTML = labelDataCalc.messages.typeError;
            ret = false;
        }
        if (!checkValidity(x[i].tagName, x[i].value)) {
            errorArray[errorArray.length - 1].innerHTML = labelDataCalc.messages.typeErrorUnexpected;
            errorArray[i].innerHTML = labelDataCalc.messages.typeError;
            ret = false;
        }
    }
    return ret;
}
