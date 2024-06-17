var estimatedShipment = (function ($) {
  function getEstimatedShipmentDate(itemdata) {
    var timeNow;
    if (itemdata) {
      timeNow = new Date(itemdata.availStartDate);
    } else {
      timeNow = new Date();
    }
    var cstdat = timeNow.toLocaleString("en-US", { timeZone: 'America/Chicago' });   


    var timeCST = new Date(cstdat);
    var date = timeCST.getDate();
    var month = timeCST.getMonth() + 1;
    var hour = timeCST.getHours();
    var monthStringPadded = zeroPad(month);
    var day = timeCST.getDay();

    if (!isIEHoliday(date, day, monthStringPadded)) {
      if (hour < 18) {
        return "Today";
      }
    }
    return getNextBusinessDay(timeCST);
  }

  function zeroPad(number) {
    var num = number.toString();
    while (num.length < 2) {
      num = "0" + num;
    }
    return `${num}`;
  }

  /*
      -date and month must be in 01,02,03,11,29 format
    */

  function isIEHoliday(date, day, month) {
    if (day === 0 || day === 6) {
      return true;
    }
    var listOfHolidays = [];
    // Holiday Response
    window.getAPIModule.holidayCalender().done(function (data) {
      listOfHolidays = data ? data.holidays : [];
    });

    var dateToCheck = month + "-" + date;

    for (var holiday of listOfHolidays) {
      if (dateToCheck === holiday) {
        return true;
      }
    }

    return false;
  }

  // if not able to deliver today find the next possible business day for delivery
  function getNextBusinessDay(date) {
    var tomorrow = new Date(date.toLocaleString("en-US", { timeZone: 'America/Chicago' }));
    tomorrow.setDate(date.getDate() + 1);

    if (
      !isIEHoliday(
        zeroPad(tomorrow.getDate()),
        tomorrow.getDay(),
        zeroPad(tomorrow.getMonth() + 1)
      )
    ) {
      return "Tomorrow";
    }

    return "Next Business Day";
  }
  return {
    getEstimatedShipmentDate: getEstimatedShipmentDate,
    getNextBusinessDay: getNextBusinessDay
  };
})(jQuery);
