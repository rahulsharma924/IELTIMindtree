
function minitimer() {
var Hrs,Mins,Secs;
setInterval(function () {

    const Time = new Date();
    var cstdat = Time.toLocaleString("en-US", { timeZone: 'America/Chicago' });

    const cstime = new Date(cstdat);

    var CSTHours = cstime.getHours();
    var CSTMinutes = cstime.getMinutes();
    var CSTSeconds = cstime.getSeconds();

    var CSTDate = cstime.getDate();
    var CSTMonth = cstime.getMonth();
    var CSTDay = cstime.getDay();

    function zeroPad(number) {
        var num = number.toString();
        while (num.length < 2) {
            num = "0" + num;
        }
        return `${num}`;
    }

    function validate_countdown() {
	       if (CSTMinutes != 0) {
            return `${zeroPad(Hrs = 17 - CSTHours)}:${zeroPad(Mins = 60 - CSTMinutes)}:${zeroPad(Secs = 60 - CSTSeconds)}`;



        } else if (CSTMinutes == 0) {
            return `${zeroPad(Hrs = 18 - CSTHours)}:${zeroPad(Mins = 60 - 60)}:${zeroPad(Secs = 60 - 60)}`;



        } else if (CSTHours < 18 && CSTMinutes == 0) {
            return `${zeroPad(Hrs = 18 - CSTHours)}:${zeroPad(Mins = 0)}:${zeroPad(Secs = 0)}`;



        } else if (CSTHours == 18) {
            return `${zeroPad(Hrs = 18 - CSTHours)}:${zeroPad(Mins = 60 - 60)}:${zeroPad(Secs = 60 - 60)}`;


        } else {
            return `${zeroPad(Hrs = 17 - CSTHours)}:${zeroPad(Mins = (CSTMinutes - 60) * -1)}:${zeroPad(Secs = (CSTSeconds - 60) * -1)}`;


        }
    }

    function validate_time() {

        if (CSTHours == 6 && CSTMinutes <= 59) {
            return `${validate_countdown()}`;

        } else if (CSTHours > 6 && CSTHours < 18) {
            return `${validate_countdown()}`;


        } else {
            return `00:00:00`;
        }
    }

    function validate_specialdays() {
        //codes for weekend holiday and special days..
        if (CSTDay == 0) {
            return `00:00:00`;


        } else if (CSTDate == 24 && CSTMonth == 10) {
            return `00:00:00`;



        } else if (CSTDate == 25 && CSTMonth == 11) {
            return `00:00:00`;



        } else if (CSTDate == 4 && CSTMonth == 6) {
            return `00:00:00`;



        } else if (CSTDate == 5 && CSTMonth == 8) {
            return `00:00:00`;



        } else {
            return validate_time();
        }
    }
    document.getElementById("shipTimer").innerHTML = validate_specialdays() || "";


});
}

$(function() {
    if ($(window).width() > 833)
    {
    if ($("#stickytimer").length > 0) {
        minitimer();
      
      }
    }
});

