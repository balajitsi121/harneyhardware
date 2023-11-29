define(function () {
  function ga_load() {
    if ( window.ga ) {
      $(document).trigger("googleanalyticsload");
    } else {
      setTimeout(function () {
        ga_load();
      }, 10);
    }
  }

  ga_load();
});
