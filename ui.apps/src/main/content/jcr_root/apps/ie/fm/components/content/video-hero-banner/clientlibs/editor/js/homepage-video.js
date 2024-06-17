$(document).ready(function() {
    var url = $("#youtubepopupId").attr('src');
    $("#youtubeId").on('hide.bs.modal', function() {
        $("#youtubepopupId").attr('src', '');
    });
    $("#youtubeId").on('show.bs.modal', function() {
        $("#youtubepopupId").attr('src', url);
    });

});