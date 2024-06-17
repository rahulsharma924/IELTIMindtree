window.onload = function () {
    var interior = document.getElementById("boxes");
    var newtr, megastring;
    newtr = document.createElement("div");
    newtr.classList.add('row');
    //newtr.innerHTML = "<div class=\"column small-6 medium-4\"><label>Noise (dB)</label></div><div class=\"column small-6 medium-4 end\"><label>Gain (dB)</label></div>";
    interior.appendChild(newtr);
    for (i = 1; i <= 2; i++) {
        newtr = document.createElement("div");
        newtr.classList.add('row');
        megastring = "<div class=\"column small-6 medium-4\"><input class=\"noise\" type=\"text\"";
        megastring += " value=\"Stage " + i + " Noise\" onkeypress=\"ifEnter(event)\" onblur=\"blurFn(this)\" onfocus=\"focusFn(this)\" ";
        megastring += "/></div><div class=\"column small-6 medium-4 \"><input class=\"gain\" type=\"text\" ";
        megastring += " value=\"Stage " + i + " Gain\" onkeypress=\"ifEnter(event)\" onblur=\"blurFn(this)\" onfocus=\"focusFn(this)\" ";
        megastring += "/></div><div class=\"column medium-4 field-cell error-field-calc\"><span class=\"error ErrorText\"></span></div>";
        newtr.innerHTML = megastring;
        interior.appendChild(newtr);
    }
    newtr = document.createElement("div");
    newtr.classList.add('row');
    newtr.innerHTML = "<div class=\"column medium-4 end\"><input id=\"go\" class=\"button primary calculate-button\" type=\"button\" onclick=\"clickNoiseFn()\" value=\"Calculate\" /></div>";
    interior.appendChild(newtr);

    start_watermark();
}
function changeNoiseFn() {
    var interior = document.getElementById("boxes");
    var newtr;
    while (interior.firstChild) {
        interior.removeChild(interior.firstChild);
    }
    newtr = document.createElement("div");
    newtr.classList.add('row');
   // newtr.innerHTML = "<div class=\"column small-6 medium-4\"><label>Noise (dB)</label></div><div class=\"column small-6 medium-4 end\"><label>Gain (dB)</label></div>";
    interior.appendChild(newtr);
    var n = Number(document.getElementById("option").value)
    for (i = 1; i <= n; i++) {
        newtr = document.createElement("div");
        newtr.classList.add('row');
        newtr.classList.add('mt-3');
        megastring = "<div class=\"col-6 col-md-4\"><input class=\"noise\" type=\"text\"";
        megastring += " value=\"Stage " + i + " Noise\" onkeypress=\"ifEnter(event)\" onblur=\"blurFn(this)\" onfocus=\"focusFn(this)\" ";
        megastring += "/></div><div class=\"col-6 col-md-4 \"><input class=\"gain\" type=\"text\" ";
        megastring += " value=\"Stage " + i + " Gain\" onkeypress=\"ifEnter(event)\" onblur=\"blurFn(this)\" onfocus=\"focusFn(this)\" ";
        megastring += "/></div><div class=\"col-6 col-md-4 error-field-calc\"><span class=\"error ErrorText\"></span></div>";
        newtr.innerHTML = megastring;
        interior.appendChild(newtr);
    }
    newtr = document.createElement("div");
    newtr.classList.add('row');
    //newtr.innerHTML = "<div class=\"column medium-4 end\"><input id=\"go\" class=\"button primary calculate-button\" type=\"button\" onclick=\"clickNoiseFn()\" value=\"Calculate\" /></div>";
    interior.appendChild(newtr);

    start_watermark();
}

function clickNoiseFn() {
    clearAll();

    var n = document.getElementsByClassName("noise");
    var g = document.getElementsByClassName("gain");
    var i;
    var operandN = [];
    var operandG = [];

    if (check(n) && check(g)) {
        for (i = 0; i < n.length; i++) {
            operandN.push(convertSI(n[i].tagName, n[i].value));
            operandG.push(convertSI(g[i].tagName, g[i].value));
        }
        document.getElementsByClassName("result_container")[0].style.display = "inline-block";
        var productBool = document.getElementsByClassName("related_search")[0];
        if (!!productBool) {
            document.getElementsByClassName("related_search")[0].style.display = "inline-block";
        }

        var gain = 0;

        for (i = 0; i < operandG.length; i++) {
            gain += operandG[i];
        }

        for (i = 0; i < operandG.length; i++) {
            operandG[i] = Math.pow(10, (operandG[i] / 10));
            operandN[i] = Math.pow(10, (operandN[i] / 10));
        }

        var noise = operandN[0];
        var piGain = 1;
        for (i = 1; i < operandG.length; i++) {
            piGain *= operandG[i - 1];
            noise += (operandN[i] - 1) / piGain;
        }

        noise = 10 * Math.log(noise) / Math.log(10);

        search_str = "/category/rf-amplifiers.html?fm_product_en_qa[refinementList][hierarchicalCategories.lvl0][0]=RF%20Amplifiers";
        document.getElementsByClassName("related_search")[0].onclick = function () { window.open(search_str); };

        document.getElementById("noise").innerHTML = noise.toPrecision(4) + " dB";
        document.getElementById("gain").innerHTML = gain.toPrecision(4) + " dB";
    }

}
