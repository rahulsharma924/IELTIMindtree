function check(x) {
    let i;
    let ret = true;
    let Usenumericvalue = labelDataCalc.messages.Usenumericvalue; 
    let typeErrorAll = labelDataCalc.messages.typeErrorAll;
    let typeErrorUnexpected = labelDataCalc.messages.typeErrorUnexpected;
    let typeError = labelDataCalc.messages.typeError;
    for (i = 0; i < x.length; i++) {
        if (!x[i].value || x[i].value == Usenumericvalue) {
            $('#errormsg').html(typeErrorAll);
            $(".error")[i].innerHTML = typeError;
            ret = false;
        } else if (!checkValidity(x[i].tagName, x[i].value)) {
            $('#errormsg').html(typeErrorUnexpected);
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
                if (n[j] == '-' && j != 0) {
                    return false;
                }
                if (n[j] == '.') {
                    if (numdot > 0) {
                        return false;
                    } else {
                        numdot++;
                    }
                }
                if ((n[j] < '0' || n[j] > '9') && n[j] != '.' && n[j] != '-') {
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
    if (n == 'T' || n == 'G' || n == 'M' || n == 'k' || n == 'm' || n == 'u' || n == 'n' || n == 'p') {
        return true;
    } else {
        return false;
    }
}
