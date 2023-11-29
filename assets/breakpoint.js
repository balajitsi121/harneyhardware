define(["throttle"], function (throttle) {
  var breakpoints = {
    small: 0,
    medium: 480,
    large: 768,
    xlarge: 1024
  };

  var Breakpoint = {
    get small() {
      return matchMedia("(max-width: " + breakpoints.medium + "px)").matches;
    },
    get medium() {
      return matchMedia("(min-width: " + (breakpoints.medium + 1) + "px)").matches;
    },
    get medium_down() {
      return matchMedia("(max-width: " + breakpoints.large + "px)").matches;
    },
    get large() {
      return matchMedia("(min-width: " + (breakpoints.large + 1) + "px)").matches;
    },
    get large_down() {
      return matchMedia("(max-width: " + breakpoints.xlarge + "px)").matches;
    },
    get xlarge() {
      return matchMedia("(min-width: " + (breakpoints.xlarge + 1) + "px)").matches;
    },
    get current() {
      var viewport = window.innerWidth;
      var current = null;

      for ( var breakpoint in breakpoints ) {
        if ( viewport > breakpoints[breakpoint] ) {
          current = breakpoint;
        }
      }

      return current;
    },
    max: function (width) {
      return matchMedia("(max-width: " + width + ")").matches;
    },
    min: function (width) {
      return matchMedia("(min-width: " + width + ")").matches;
    }
  };

  var active = Breakpoint.current;

  $(window).resize(throttle(function () {
    var current = Breakpoint.current;

    if ( current != active ) {
      $(document).trigger("theme.breakpoint", current);
      active = current;
    }
  }));

  return Breakpoint;
});
