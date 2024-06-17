function changeFnTorque() {
    clearAll();
    let i;
    let conv = $("#option").val();
    let alldiv = $('.conv_cont');
    for (i = 0; i < alldiv.length; i++) {
        if (alldiv[i].id == conv) {
            alldiv[i].style.display = "inline";
        } else {
            alldiv[i].style.display = "none"
        }
    }
}
function clickFnTorque(type) {
    clearAll();
    let out;
    let x = $('#' + type).find('.input');
    let i;
    let operands = [];
    let temp1, temp2, sym;
    if (mod_check(type, x)) {
        for (i = 0; i < x.length; i++) {
            operands.push(convertSI(x[i].tagName, x[i].value));
        }
        switch (type) {
            case "range":
                /*var temp1, temp2, sym;*/
                switch (operands[3]) {
                    case "Nm":
                        temp1 = calcNm(operands[0], operands[1]);
                        temp2 = calcNm(operands[0], operands[2]);
                        sym = " Nm";
                        break;
                    case "ft-lbs":
                        temp1 = calcFl(operands[0], operands[1]);
                        temp2 = calcFl(operands[0], operands[2]);
                        sym = " ft-lbs";
                        break;
                    case "in-lbs":
                        temp1 = calcIl(operands[0], operands[1]);
                        temp2 = calcIl(operands[0], operands[2]);
                        sym = " in-lbs";
                        break;
                    default:
                        $('#error').html(labelDataCalc.messages.UnknownError);
                        break;
                }

                $('#' + type).find('.result_container')[0].style.display = "inline-block";
                $('#' + type).find(".output")[0].innerHTML = temp1.toPrecision(4) + sym + " to " + temp2.toPrecision(4) + sym;
                break;
            case "single":
                /*var temp1, sym;*/
                switch (operands[2]) {
                    case "Nm":
                        temp1 = calcNm(operands[0], operands[1]);
                        sym = " Nm";
                        break;
                    case "ft-lbs":
                        temp1 = calcFl(operands[0], operands[1]);
                        sym = " ft-lbs";
                        break;
                    case "in-lbs":
                        temp1 = calcIl(operands[0], operands[1]);
                        sym = " in-lbs";
                        break;
                    default:
                        $('#error').html(labelDataCalc.messages.UnknownError);
                        break;
                }
                let i;
                for (i in searchParameterCodes) {
                    if (searchParameterCodes[i].calc_type == "Torque Conversion") {
                        if (searchParameterCodes[i].param_name == "Torque") {
                            let torStr = searchParameterCodes[i].param_code;
                        }
                    }
                }
                let parameter = getClosest(calcIl(operands[2], temp1));
                if (parameter == 0) {
                    search_str = document.location.origin + "/category/rf-tools/rf-torque-wrenches.html?fm_product_en_qa[refinementList][hierarchicalCategories.lvl0][0]=RF%20Tools&fm_product_en_qa[refinementList][hierarchicalCategories.lvl1][0]=RF%20Tools%20>%20RF%20Torque%20Wrenches";
                } else {
                    search_str = document.location.origin + "/category/rf-tools/rf-torque-wrenches.html?fm_product_en_qa[refinementList][hierarchicalCategories.lvl0][0]=RF%20Tools&fm_product_en_qa[refinementList][hierarchicalCategories.lvl1][0]=RF%20Tools%20>%20RF%20Torque%20Wrenches";
                }
                $(".related_search")[0].onclick = function () {
                    window.open(search_str);
                }
                    ;
                $('#' + type).find(".result_container")[0].style.display = "inline-block";
                $('#' + type).find(".related_search")[0].style.display = "block";
                $('#' + type).find(".output")[0].innerHTML = temp1.toPrecision(4) + sym;
                break;
        }
    }
}
function mod_check(type, x) {
    let i;
    let errorArray = $('#' + type).find(".error");
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
function getClosest(x) {
    let available = [2, 3, 4, 5, 6.1, 8, 8.1, 12, 14];
    let n, last;
    for (n = 0; n < available.length; n++) {
        if (x < available[n]) {
            if (n == 0) {
                if ((available[n] - x) < 1) {
                    return available[n];
                } else {
                    return 0;
                }
            } else {
                let high = available[n] - x;
                let low = x - available[last];
                if (high < low) {
                    return available[n];
                } else {
                    return available[last];
                }
            }
        } else if (n == available.length - 1) {
            if ((x - available[n]) < 1) {
                return available[n];
            } else {
                return 0;
            }
        }
        last = n;
    }
}
