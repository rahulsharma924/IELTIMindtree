setInterval(function () {
  let Mins, cstdat, CSTSeconds, CSTHours, CSTMinutes;
  const Time = new Date();
  cstdat = Time.toLocaleString("en-US", { timeZone: "America/Chicago" });
  const cstime = new Date(cstdat);

  CSTHours = cstime.getHours();
  CSTMinutes = cstime.getMinutes();
  CSTSeconds = cstime.getSeconds();

  let CSTDate = cstime.getDate();
  let CSTMonth = cstime.getMonth();
  let CSTDay = cstime.getDay();

  function zeroPad(number) {
    let num = number.toString();
    while (num.length < 2) {
      num = "0" + num;
    }
    return `${num}`;
  }

function validate_countdown(){
	var Hrs, Mins;
  if(CSTMinutes!=0){
  return `${zeroPad(Hrs=17-CSTHours)} hours and ${zeroPad(Mins=60-CSTMinutes)} minutes`;



 }else if(CSTMinutes==0){
  return `${zeroPad(Hrs=18-CSTHours)} hours and ${zeroPad(Mins=60-60)} minutes`;



 }else if(CSTHours < 18 && CSTMinutes==0){
  return `${zeroPad(Hrs=18-CSTHours)} hours and ${zeroPad(Mins=0)} minutes`;



 }else if(CSTHours==18){
  return`${zeroPad(Hrs=18-CSTHours)} hours and ${zeroPad(Mins=60-60)} minutes`;



 }else{
  return `${zeroPad(Hrs=17-CSTHours)} hours and ${zeroPad(Mins=(CSTMinutes-60)*-1)} minutes`;



 }
  }

  function validate_time() {
    if (CSTHours == 6 && CSTMinutes <= 59) {
      return `${validate_countdown()}`;
    } else if (CSTHours > 6 && CSTHours < 18) {
      return `${validate_countdown()}`;
    } else {
      return `00 hours and 00 minutes`;
    }
  }

  function validate_specialdays() {
    //codes for weekend holiday and special days..
    if (CSTDay == 0) {
      return `00 hours and 00 minutes`;
    } else if (CSTDate == 24 && CSTMonth == 10) {
      return `00 hours and 00 minutes`;
    } else if (CSTDate == 25 && CSTMonth == 11) {
      return `00 hours and 00 minutes`;
    } else if (CSTDate == 4 && CSTMonth == 6) {
      return `00 hours and 00 minutes`;
    } else if (CSTDate == 5 && CSTMonth == 8) {
      return `00 hours and 00 minutes`;
    } else {
      return validate_time();
    }
  }
  if (document.getElementById("test")) {
    document.getElementById("test").innerHTML = validate_specialdays() || "";
  }
}, 070);
