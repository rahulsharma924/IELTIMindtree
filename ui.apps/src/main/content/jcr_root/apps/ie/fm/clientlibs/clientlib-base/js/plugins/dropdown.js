(function ($) {
  //Country DropDown Display
  $.fn.countryList = function (data) {
    if (!data && !data?.length) {
      return;
    }
    let countryResponse = data.map(function ({ name, ISO }) {
      return '<option value="' + ISO + '">' + name + "</option>";
    });

    this.append(countryResponse);
  };
  // State Drop down Display
  $.fn.stateList = function (data) {
    let $this = this;
    let $option;
    data.map(function (state) {
      Object.entries(state.state).map(function (value) {
        $option = '<option value="' + value[0] + '">' + value[1] + "</option>";
        $this.append($option);
      });
    });
  };

  // Filter State based on country selection
  $.fn.stateFilter = function (data, selectedCountry) {
    let $selectedState = this;
    $selectedState.empty();
    data.find(function (list) {
      if (list.ISO === selectedCountry) {
        Object.entries(list.state).map(function (value) {
          let $option =
            '<option value="' + value[0] + '">' + value[1] + "</option>";
          $selectedState.append($option);
        });
      }
    });
  };
})(jQuery);
