function generalClickFnLink() {
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
        calculateOutputLink(operands);
    }
}

function changeFnLink() {
    clearAll();
    var interior = document.getElementById("fspl");
    var newtr;
    var n = document.getElementById("option2").value;
    while (interior.firstChild) {
        interior.removeChild(interior.firstChild);
    }
    if (n == "fspl") {
        newtr = document.createElement("div");
        newtr.classList.add('row');
        newtr.classList.add('set-mb');
        megastring = '<div class="col-lg-4"> <select id="option2" class="input" onchange="changeFnLink()" data-acsb-navigable="true" data-acsb-now-navigable="true" aria-hidden="false" data-acsb-hidden="false"><option value="fspl" selected="true">Free Space Path Loss (dB): </option><option value="freq">Frequency</option></select>        <span class="error ErrorText" aria-hidden="true" data-acsb-hidden="true" data-acsb-force-hidden="true"></span></div>'+
                      '<div class="col-lg-4"><input type="text" class="input" value="Use numeric value" onblur="blurFn(this)" onfocus="focusFn(this)" data-acsb-navigable="true" data-acsb-now-navigable="true" aria-hidden="false" data-acsb-hidden="false" style="color: rgb(170, 170, 170);">                      <span class="error ErrorText" aria-hidden="true" data-acsb-hidden="true" data-acsb-force-hidden="true"></span> </div>';  
        newtr.innerHTML = megastring;
        interior.appendChild(newtr);
    } else {
        newtr = document.createElement("div");
        newtr.classList.add('set-mb');
        megastring = '<div class="row set-mb">'+
                        '<div class="col-lg-4">'+
                            '<select id="option2" class="input" onchange="changeFnLink()" data-acsb-navigable="true" data-acsb-now-navigable="true" aria-hidden="false" data-acsb-hidden="false"><option value="fspl">Free Space Path Loss (dB): </option><option value="freq" selected="true">Frequency</option></select>'+
                            '<span class="error ErrorText" aria-hidden="true" data-acsb-hidden="true"             data-acsb-force-hidden="true"></span>'+
                        '</div>'+
                        '<div class="col-lg-4">'+
                            '<input type="text" class="input" value="Use numeric value" onblur="blurFn(this)" onfocus="focusFn(this)"  data-acsb-navigable="true" data-acsb-now-navigable="true" aria-hidden="false" data-acsb-hidden="false">'+
                            '<span class="error ErrorText" aria-hidden="true" data-acsb-hidden="true"                           data-acsb-force-hidden="true"></span>'+
                        '</div>	'+
                        '<div class="col-lg-4">'+
                            '<select id="option1" class="input" data-acsb-navigable="true" data-acsb-now-navigable="true" aria-hidden="false" data-acsb-hidden="false"><option value="GHz">GHz</option><option value="MHz">MHz</option></select>'+
                            '<span class="error ErrorText" aria-hidden="true" data-acsb-hidden="true"		data-acsb-force-hidden="true"></span>'+
                        '</div>	'+
                    '</div>	'+
                    '<div class="row set-mb">'+
							'<div class="col-lg-4 offset-md-4">'+
								'<label>Distance:</label>'+
								'<input type="text" class="input" value="Use numeric value" onblur="blurFn(this)" onfocus="focusFn(this)"  data-acsb-navigable="true" data-acsb-now-navigable="true" aria-hidden="false" data-acsb-hidden="false">'+
								'<span class="error ErrorText" aria-hidden="true" data-acsb-hidden="true"			data-acsb-force-hidden="true"></span>'+
							'</div>'+
							'<div class="col-lg-4 dt-mt-rem">									'+
								'<select id="unit1" class="input" data-acsb-navigable="true" data-acsb-now-navigable="true" aria-hidden="false" data-acsb-hidden="false"><option value="km">Kilometers</option><option value="m">Meters</option><option value="cm">Centimeters</option><option value="mi">Miles</option><option value="yards">Yards</option><option value="ft">Feet</option><option value="in">Inches</option></select>'+
								'<span class="error ErrorText" aria-hidden="true" data-acsb-hidden="true" data-acsb-force-hidden="true"></span>		</div>'+
						'</div>';
       
        newtr.innerHTML = megastring;
        interior.appendChild(newtr);
    }
    start_watermark();
    start_enter();
}
function calculateOutputLink(operands) {
    operands[0] = powerConv(operands[1], "dBm", operands[0]);
    if (document.getElementById("option2").value == "fspl") {
        var rp = operands[0] + operands[2] - operands[3] - operands[5] - operands[6] + operands[7] - operands[8];
    } else {
        if (operands[6] == "GHz") {
            operands[5] *= 1000;
        }
        operands[5] *= Math.pow(10, 6);
        operands[7] = lengthConv(operands[8], "m", operands[7]);
        var fspl = 20 * Math.log(operands[7]) / Math.log(10) + 20 * Math.log(operands[5]) / Math.log(10) - 147.55;
        var rp = operands[0] + operands[2] - operands[3] - fspl - operands[9] + operands[10] - operands[11];
    }
    document.getElementById("rp").innerHTML = rp.toPrecision(4) + " dBm";
}
