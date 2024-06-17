(function ($, $document) {
    "use strict";

    $.validator.register("foundation.validation.validator", {
        selector: "coral-multifield",
        validate: function (el) {
            var totalPanels = el["0"].items.getAll().length;
            var min;
            var max;
            if ($(el).data("minlink-allowed")) {
                min = $(el).data("minlink-allowed");
                if (totalPanels < min) {
                    return "Minimum numbers of items required are: " + min;
                }
            }
            if ($(el).data("maxlink-allowed")) {
                max = $(el).data("maxlink-allowed");
                if (totalPanels > max) {
                    return "Maximum numbers of items allowed are: " + max;
                }
            }
        },
    });

})($, $(document));
