function generalClickFnRfp() {
    clearAll();
    var x = document.getElementsByClassName("input");
    var i;
    var operands = [];
    if (checkRfd(x)) {
        for (i = 0; i < x.length; i++) {
            operands.push(convertSI(x[i].tagName, x[i].value));
        }
        document.getElementsByClassName("result_container")[0].style.display = "inline-block";
        var productBool = document.getElementsByClassName("related_search")[0];
        if (!!productBool) {
            document.getElementsByClassName("related_search")[0].style.display = "inline-block";
        }
        calculateOutputRfd(operands);
    }
}
function ifEnter(e) {
    if (e) {
        if (e.keyCode == '13' || e.which == '13') {
            var buttons = document.getElementsByTagName("INPUT");
            var i;
            for (i = 0; i < buttons.length; i++) {
                if (buttons[i] == e.srcElement) {
                    break;
                }
            }
            while (buttons[i]) {
                if (buttons[i].value == "Calculate") {
                    buttons[i].onclick();
                    break;
                }
                i++;
            }
        }
    }
}
function start_enter() {
    var i;
    var nodes = document.getElementsByTagName("INPUT");
    for (i = 0; i < nodes.length; i++) {
        if (nodes[i].type == "text") {
            nodes[i].onkeypress = ifEnter;
        }
    }
}
window.addEventListener("load", start_enter, true);
function clearAll() {
    var i;
    for (i = 0; i < document.getElementsByClassName("output").length; i++) {
        document.getElementsByClassName("output")[i].innerHTML = "";
    }
    for (i = 0; i < document.getElementsByClassName("error").length; i++) {
        document.getElementsByClassName("error")[i].innerHTML = "";
    }
    for (i = 0; i < document.getElementsByClassName("related_search").length; i++) {
        var productBool = document.getElementsByClassName("related_search")[i];
        if (!!productBool) {
            document.getElementsByClassName("related_search")[0].style["font-weight"] = "bold";
            document.getElementsByClassName("related_search")[i].style.display = "none";
        }
    }
}
function getClosestAtten(x, ohm) {
    var available = [];
    var options = {
        avail50: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 30, 40, 50, 60],
        avail75: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 16, 20, 30]
    };
    if (ohm == 50) {
        available = options.avail50;
    } else if (ohm == 75) {
        available = options.avail75;
    } else {
        return 0;
    }
    var n, last;
    for (n = 0; n < available.length; n++) {
        if (x <= available[n]) {
            if (n == 0) {
                if ((available[n] - x) < 1) {
                    return new Array(available[n],available[n]);
                } else {
                    return 0;
                }
            } else if (x == available[n]) {
                return new Array(available[n],available[n]);
            } else {
                return new Array(available[last],available[n]);
            }
        } else if (n == available.length - 1) {
            if ((x - available[n]) < 1) {
                return new Array(available[n],available[n]);
            } else {
                return 0;
            }
        }
        last = n;
    }
}
