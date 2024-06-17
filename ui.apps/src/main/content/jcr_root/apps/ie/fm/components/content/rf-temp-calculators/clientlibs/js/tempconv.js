function changeFnTemp() {
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
function clickFn(type) {
  clearAll();
  let out;
  let x = $('#' + type).find(".input");
  let i;
  let operands = [];
  if (mod_check(type, x)) {
      for (i = 0; i < x.length; i++) {
          operands.push(convertSI(x[i].tagName, x[i].value));
      }
      switch (type) {
      case "range":
          let codeF = String.fromCharCode(176) + 'F';
          let codeC = String.fromCharCode(176) + 'C';
          let codeK = String.fromCharCode(176) + 'K';
          let temp1, temp2, sym;
          switch (operands[3]) {
          case codeF:
              temp1 = calcFar(operands[0], operands[1]);
              temp2 = calcFar(operands[0], operands[2]);
              sym = "&deg;F";
              break;
          case codeC:
              temp1 = calcCel(operands[0], operands[1]);
              temp2 = calcCel(operands[0], operands[2]);
              sym = "&deg;C";
              break;
          case codeK:
              temp1 = calcKel(operands[0], operands[1]);
              temp2 = calcKel(operands[0], operands[2]);
              sym = "&deg;K";
              break;
          default:
              $("#error").html(labelDataCalc.messages.UnknownError);
              break;
          }
          $('#' + type).find('.result_container')[0].style.display = "inline-block";
          $('#' + type).find(".output")[0].innerHTML = temp1.toPrecision(4) + sym + " to " + temp2.toPrecision(4) + sym;
          break;
      case "single":
          let codeF1 = String.fromCharCode(176) + 'F';
          let codeC1 = String.fromCharCode(176) + 'C';
          let codeK1 = String.fromCharCode(176) + 'K';
          let temp, sym1;
          switch (operands[2]) {
          case codeF1:
              temp = calcFar(operands[0], operands[1]);
              sym1 = " &deg;F";
              break;
          case codeC1:
              temp = calcCel(operands[0], operands[1]);
              sym1 = " &deg;C";
              break;
          case codeK1:
              temp = calcKel(operands[0], operands[1]);
              sym1 = " &deg;K";
              break;
          default:
              $("#errormsg").html(labelDataCalc.messages.UnknownError);
              break;
          }
          $('#' + type).find('.result_container')[0].style.display = "inline-block";
          $('#' + type).find(".output")[0].innerHTML = temp.toPrecision(4) + sym1;
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
