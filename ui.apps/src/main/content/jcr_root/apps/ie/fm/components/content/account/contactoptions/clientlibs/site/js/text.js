$(function () {
    var checkbox = $("#trigger");
    var hidden = $("#createAccounts");
    hidden.hide();
    checkbox.change(function () {
        if (checkbox.is(":checked")) {
            hidden.hide();
        } else {
            hidden.show();
        }
    });
});

$("#trigger").click(function () {
    if ($(this).is(":checked")) {
        $("#modalfirstname").val("");
        $("#modallastname").val("");
        $("#inputAddress").val("");
        $("#modalcompanyname").val("");
        $("#inputAddress2").val("");
        $("#inputCity").val("");
        $("#inputZip").val("");
    }
});

$('#trigger').parent().parent().parent().addClass("billingaddressoption");
$('#contactpreference').parent().parent().parent().addClass("contactpreferencesoptions");