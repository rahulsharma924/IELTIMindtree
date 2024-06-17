function generalClickWaveRectFn() {
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
        calculateWaveRectOutput(operands);
    }
}

function changeFn() {
    clearAll();
    var w = document.getElementById("w");
    var guide = document.getElementById("option").value;
    w.value = waveTable[guide];
    blurFn(w);
    if (guide == 'xx') {
        w.disabled = false;
        document.getElementById("unit").disabled = false;
        document.getElementById("matchlabel").hidden = false;
        document.getElementById("match").hidden = false;
    } else {
        w.disabled = true;
        document.getElementById("unit").selectedIndex = 0;
        document.getElementById("unit").disabled = true;
        document.getElementById("matchlabel").hidden = false;
        document.getElementById("match").hidden = true;
        ;
    }
}
function calculateWaveRectOutput(operands) {
    let mesageText = labelDataCalc.messages;
    let srchUrl = labelDataCalc.redirectionURL;
    if (operands[1] <= 0) {
        clearAll();
        document.getElementById("errormsg").innerHTML = mesageText.wallDimensionError;
        document.getElementsByClassName("error")[1].innerHTML = mesageText.typeError;
    } else {
        operands[1] = lengthConv(operands[2], "in", operands[1]);
        var fc = getFC(operands[1]);
        var closest = findMatch(operands[1]);
        var fl = fc * 1.25;
        var fh = fc * 1.89;
        if (closest == 0) {
            document.getElementsByClassName("related_search")[0].style.display = "none";
            document.getElementById("match").innerHTML = mesageText.noMatches;
        } else if (closest == -1) {
            document.getElementsByClassName("related_search")[0].style.display = "none";
            document.getElementById("match").innerHTML = mesageText.noMatches;
        } else {
            document.getElementById("match").innerHTML = closest.toUpperCase();
            if (weStockIt(closest)) {
                search_str = srchUrl.waveguideUrl1 + closest.substring(0, 2) + "-" + closest.substring(2, 6) + "%20waveguide";
            } else {
                search_str = srchUrl.waveguideUrl1;
            }
            document.getElementsByClassName("related_search")[0].onclick = function() {
                window.open(search_str);
            }
            ;
        }
        document.getElementById("fc").innerHTML = fc.toFixed(1) + " GHz";
        document.getElementById("fr").innerHTML = fl.toFixed(1) + " to " + fh.toFixed(1) + " GHz";
    }
}
function getFC(n) {
    return 29.9792458 / (2 * 2.54 * n);
}
function weStockIt(str) {
    var i;
    var stocked = ["wr15", "wr28", "wr34", "wr42", "wr51", "wr62", "wr75", "wr90", "wr102", "wr112", "wr137", "wr159", "wr187", "wr229", "wr284", "wr340", "wr430"];
    for (i = 0; i < stocked.length; i++) {
        if (str == stocked[i]) {
            return true;
        }
    }
    return false;
}
function findMatch(x) {
    var n;
    var last;
    for (n in waveTable) {
        if (waveTable[n] > x) {
            if (waveTable[n] == 0.034) {
                if (waveTable[n] - x < 0.01) {
                    return n;
                } else {
                    return -1;
                }
            }
            var high = waveTable[n] - x;
            var low = x - waveTable[last];
            if (high < low) {
                return n;
            } else {
                return last;
            }
        } else if (waveTable[n] == 9.750) {
            if (x - waveTable[n] < 1) {
                return n;
            }
        }
        last = n;
    }
    return 0;
}
var waveTable = {
    xx: "",
    wr3: 0.034,
    wr4: 0.043,
    wr7: 0.065,
    wr8: 0.080,
    wr10: 0.100,
    wr12: 0.122,
    wr15: 0.148,
    wr19: 0.188,
    wr22: 0.224,
    wr28: 0.280,
    wr34: 0.340,
    wr42: 0.420,
    wr51: 0.510,
    wr62: 0.622,
    wr75: 0.750,
    wr90: 0.900,
    wr112: 1.122,
    wr137: 1.372,
    wr159: 1.590,
    wr187: 1.872,
    wr229: 2.280,
    wr284: 2.840,
    wr340: 3.400,
    wr430: 4.300,
    wr510: 5.100,
    wr650: 6.500,
    wr770: 7.700,
    wr975: 9.750
};
