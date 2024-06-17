$(document).ready(function () {
  const windoMatch = window.matchMedia("(min-width: 1024px)");
  if (windoMatch.matches) {
    // If media query matches
    $(".right_text_email").click(function () {
      $("#emailpopup").modal("show");
    });
  }
});

$(document).ready(function () {
  var max_fields = 3; //maximum input boxes allowed
  var wrapper = $(".input_fields_wrap"); //Fields wrapper
  var add_button = $(".add_field_button"); //Add button ID
  let i = 1;
  var x = 1; //initlal text box count
  //var i = $("select-estimate").length + 1;
  $(add_button).click(function (e) {
    //on add input button click
    e.preventDefault();
    if (x < max_fields) {
      //max input box allowed
      //text box increment
      $(wrapper).append(
        '<div class="select-estimate order-country-input"><label class="label-text" for="zip">Add recipient email address</label><span class="remove_field"><i class="fa-light fa-trash"></i></span><input type="text"  id="adder' +
          i +
          '" onchange="validation(this)" placeholder=""/><p id="emailMsg" class="errormsg custom_form_signin_error_msg"></p></div>'
      ); //add input box
      i < 2 ? (i = i + 1) : (i = 1);
      //i++;
      x++;
    }
    if (x >= max_fields) {
      /*$(add_button).attr("enable");*/
      $(add_button).prop("disabled", "true");
      $(add_button).blur();

      /*$(add_button).removeAttr("enabled");
            $(add_button).addClass("disabled");*/
      /*add_button.addEventListener("click", ()=>{
    add_button.blur(); // removes the focus
    })*/
    }
  });

  $(wrapper).on("click", ".remove_field", function (e) {
    //user click on remove text
    e.preventDefault();
    $(this).parent("div").remove();

    $(add_button).removeAttr("disabled");

    $("#eocsendbtn").attr("disabled", false);

    x--;
  });
});

function validation($event) {
  var currentEvent = $($event);
  const ERROR_MESSAGE = utilityMessage.messages.enterAdditionalEmail;
  if (currentEvent) {
    var $emailValidation = currentEvent.parents(".email__validation");
    if ($emailValidation) {
      var currentValue = currentEvent.val();
      var prevValue = currentEvent.parent().prev().find("input").val();
      var nextValue =
        currentEvent.parent().next().find("input").val() ||
        currentEvent.parents(".select-estimate").next().find("input").val();
      var pprevValue = currentEvent.parent().prev().prev().find("input").val();
      var nnextValue =
        currentEvent.parent().next().next().find("input").val() ||
        currentEvent
          .parents(".select-estimate")
          .next()
          .next()
          .find("input")
          .val();

      var cValue = currentValue ? currentValue.toLowerCase() : "";
      var pValue = prevValue ? prevValue.toLowerCase() : "";
      var nValue = nextValue ? nextValue.toLowerCase() : "";
      var pnValue = pprevValue ? pprevValue.toLowerCase() : "";
      var nnValue = nnextValue ? nnextValue.toLowerCase() : "";

      if (
        cValue === pValue ||
        cValue === pnValue ||
        cValue === nValue ||
        cValue === nnValue
      ) {
        currentEvent.parent().find(".errormsg").text(ERROR_MESSAGE);
        $("#eocsendbtn").attr("disabled", true);
      } else {
        emailValidation(cValue, currentEvent, ERROR_MESSAGE);
      }
    }
  }
}

function emailValidation(email, currentEvent, ERROR_MESSAGE) {
  let mesageText = utilityMessage.messages;
  let form = document.getElementById("eocform");
  let pattern =
    /^[a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1}([a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1})*[a-zA-Z0-9]@[a-zA-Z0-9][-\.]{0,1}([a-zA-Z][-\.]{0,1})*[a-zA-Z0-9]\.[a-zA-Z0-9]{1,}([\.\-]{0,1}[a-zA-Z]){0,}[a-zA-Z0-9]{0,}$/i;

  if (email.match(pattern)) {
    form.classList.add("valid");
    form.classList.remove("invalid");
    currentEvent.parent().find(".errormsg").text("");
    $("#eocsendbtn").removeAttr("disabled");
  } else {
    form.classList.remove("valid");
    form.classList.add("invalid");
    currentEvent
      .parent()
      .find(".errormsg")
      .text(mesageText.enterValidEmailAddress);
    $("#eocsendbtn").attr("disabled", true);
  }

  if (email == "") {
    form.classList.remove("valid");
    form.classList.add("invalid");
    currentEvent
      .parent()
      .find(".errormsg")
      .text(mesageText.enterEmailAddress);
  }
}

$(document).ready(function () {
  $(".footer-btn-apply:disabled").click(function () {});
});

$(document).ready(function () {
  $("#eoccancelbutton").on("click", function () {
    location.reload();
    $("input").val("");
    $("spant:errormsg").val("");
  });
});
