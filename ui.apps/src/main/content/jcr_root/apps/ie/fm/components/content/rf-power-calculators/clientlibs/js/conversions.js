function convertSI(type, n) {
    if (type != "INPUT") {
        return n;
    }
    switch (n[n.length - 1]) {
        case 'T':
            return (Math.pow(10, 12) * Number(n.substr(0, n.length - 1)));
        case 'G':
            return (Math.pow(10, 9) * Number(n.substr(0, n.length - 1)));
        case 'M':
            return (Math.pow(10, 6) * Number(n.substr(0, n.length - 1)));
        case 'k':
            return (Math.pow(10, 3) * Number(n.substr(0, n.length - 1)));
        case 'm':
            return (Math.pow(10, -3) * Number(n.substr(0, n.length - 1)));
        case 'u':
            return (Math.pow(10, -6) * Number(n.substr(0, n.length - 1)));
        case 'n':
            return (Math.pow(10, -9) * Number(n.substr(0, n.length - 1)));
        case 'p':
            return (Math.pow(10, -12) * Number(n.substr(0, n.length - 1)));
        default:
            return Number(n);
    }
}
function calcCel(x, n) {
    let codeF = String.fromCharCode(176) + 'F';
    let codeC = String.fromCharCode(176) + 'C';
    let codeK = String.fromCharCode(176) + 'K';
    switch (x) {
        case codeF:
            return (n - 32) * 5 / 9;
            break;
        case codeC:
            return n;
            break;
        case codeK:
            return n - 273.15;
            break;
        default:
            $('#error').html(labelDataCalc.messages.UnknownError);
            break;
    }
}
function calcFar(x, n) {
    let codeF = String.fromCharCode(176) + 'F';
    let codeC = String.fromCharCode(176) + 'C';
    let codeK = String.fromCharCode(176) + 'K';
    switch (x) {
        case codeF:
            return n;
            break;
        case codeC:
            return n * 9 / 5 + 32;
            break;
        case codeK:
            return (n - 273.15) * 9 / 5 + 32;
            break;
        default:
            $('#error').html(labelDataCalc.messages.UnknownError);
            break;
    }
}
function calcKel(x, n) {
    let codeF = String.fromCharCode(176) + 'F';
    let codeC = String.fromCharCode(176) + 'C';
    let codeK = String.fromCharCode(176) + 'K';
    switch (x) {
        case codeF:
            return (n - 32) * 5 / 9 + 273.15;
            break;
        case codeC:
            return n + 273.15;
            break;
        case codeK:
            return n;
            break;
        default:
            $('#error').html(labelDataCalc.messages.UnknownError);
            break;
    }
}
function calcNm(x, n) {
    switch (x) {
        case 'Nm':
            return n;
            break;
        case 'ft-lbs':
            return (n / 0.73756214837);
            break;
        case 'in-lbs':
            return (n / 0.73756214837) / 12;
            break;
        default:
            return labelDataCalc.messages.UnknownError;
            break;
    }
}
function calcFl(x, n) {
    switch (x) {
        case 'Nm':
            return n * 0.73756214837;
            break;
        case 'ft-lbs':
            return n;
            break;
        case 'in-lbs':
            return n / 12;
            break;
        default:
            return labelDataCalc.messages.UnknownError;
            break;
    }
}
function calcIl(x, n) {
    switch (x) {
        case 'Nm':
            return n * 12 * 0.73756214837;
            break;
        case 'ft-lbs':
            return n * 12;
            break;
        case 'in-lbs':
            return n;
            break;
        default:
            return labelDataCalc.messages.UnknownError;
            break;
    }
}
function lengthConv(from, to, n) {
    let from_system = "";
    switch (from) {
        case 'um':
            n = n / 1000;
        case 'mm':
            n = n / 10;
        case 'cm':
            n = n / 100;
        case 'm':
            n = n / 1000;
        case 'km':
            from_system = "si";
            break;
        case 'uin':
            n = n / (Math.pow(10, 6));
        case 'in':
            n = n / 12;
        case 'ft':
            n = n / 3;
        case 'yards':
            n = n / 1760;
        case 'mi':
            from_system = "std";
            break;
        default:
            $('#' + type).find(".error")[0].innerHTML = labelDataCalc.messages.UnknownError;
            break;
    }
    if (from_system == "si") {
        switch (to) {
            case 'um':
                n *= 1000;
            case 'mm':
                n *= 10;
            case 'cm':
                n *= 100;
            case 'm':
                n *= 1000;
            case 'km':
                return n;
                break;
            case 'uin':
                n *= Math.pow(10, 6);
            case 'in':
                n *= 12;
            case 'ft':
                n *= 3;
            case 'yards':
                n *= 1760;
            case 'mi':
                return n / 1.60934;
                break;
            default:
                return labelDataCalc.messages.UnknownError;
                break;
        }
    }
    if (from_system == "std") {
        switch (to) {
            case 'um':
                n *= 1000;
            case 'mm':
                n *= 10;
            case 'cm':
                n *= 100;
            case 'm':
                n *= 1000;
            case 'km':
                return n * 1.60934;
                break;
            case 'uin':
                n *= Math.pow(10, 6);
            case 'in':
                n *= 12;
            case 'ft':
                n *= 3;
            case 'yards':
                n *= 1760;
            case 'mi':
                return n;
                break;
            default:
                return labelDataCalc.messages.UnknownError;
                break;
        }
    }
}
function massConv(from, to, n) {
    let from_system = "";
    switch (from) {
        case 'mg':
            n = n / 1000;
        case 'g':
            n = n / 1000;
        case 'kg':
            from_system = "si";
            break;
        case 'oz':
            n = n / 16;
        case 'lbs':
            from_system = "std";
            break;
        default:
            $('#' + type).find(".error")[0].innerHTML = labelDataCalc.messages.UnknownError;
            break;
    }
    if (from_system == "si") {
        switch (to) {
            case 'mg':
                n *= 1000;
            case 'g':
                n *= 1000;
            case 'kg':
                return n;
                break;
            case 'oz':
                n *= 16;
            case 'lbs':
                return n / 0.453592;
                break;
            default:
                return labelDataCalc.messages.UnknownError;
                break;
        }
    }
    if (from_system == "std") {
        switch (to) {
            case 'mg':
                n *= 1000;
            case 'g':
                n *= 1000;
            case 'kg':
                return n * 0.453592;
                break;
            case 'oz':
                n *= 16;
            case 'lbs':
                return n;
                break;
            default:
                return labelDataCalc.messages.UnknownError;
                break;
        }
    }
}
function powerConv(from, to, n) {
    let from_system = "";
    switch (from) {
        case 'W':
            n = n * 1000;
        case 'mW':
            from_system = "si";
            break;
        case 'dBW':
            n = n + 30;
        case 'dBm':
            from_system = "db";
            break;
        case 'mV':
            n /= 1000;
        case 'V':
            from_system = "v";
            break;
        default:
            $('#' + type).find(".error")[0].innerHTML = labelDataCalc.messages.UnknownError;
            break;
    }
    if (from_system == "si") {
        switch (to) {
            case 'W':
                n /= 1000;
            case 'mW':
                return n;
                break;
            case 'dBW':
                n /= 1000;
            case 'dBm':
                return 10 * Math.log(n) / Math.log(10);
                break;
            case 'V':
                return powerConv("dBm", "V", 10 * Math.log(n) / Math.log(10));
                break;
            case 'mV':
                return 1000 * powerConv("dBm", "V", 10 * Math.log(n) / Math.log(10));
                break;
            default:
                return labelDataCalc.messages.UnknownError;
                break;
        }
    }
    if (from_system == "db") {
        switch (to) {
            case 'W':
                n -= 30;
            case 'mW':
                return Math.pow(10, (n / 10));
                break;
            case 'dBW':
                n -= 30;
            case 'dBm':
                return n;
                break;
            case 'V':
                return Math.sqrt((50 * (Math.pow(10, (n / 10)))) / 1000);
                break;
            case 'mV':
                return 1000 * Math.sqrt((50 * (Math.pow(10, (n / 10)))) / 1000);
                break;
            default:
                return labelDataCalc.messages.UnknownError;
                break;
        }
    }
    if (from_system == "v") {
        switch (to) {
            case 'W':
                return powerConv("dBm", "W", 10 * (Math.log((Math.pow(n, 2) * 1000) / 50)) / Math.log(10));
                break;
            case 'mW':
                return powerConv("dBm", "mW", 10 * (Math.log((Math.pow(n, 2) * 1000) / 50)) / Math.log(10));
                break;
            case 'dBm':
                return 10 * (Math.log((Math.pow(n, 2) * 1000) / 50)) / Math.log(10);
                break;
            case 'dBW':
                return (10 * (Math.log((Math.pow(n, 2) * 1000) / 50)) / Math.log(10)) - 30;
                break;
            case 'V':
                return n;
                break;
            case 'mV':
                return 1000 * n;
                break;
            default:
                return labelDataCalc.messages.UnknownError;
                break;
        }
    }
}
