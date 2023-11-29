define(function () {
  var extensions = ["jpg", "jpeg", "gif", "png"];

  var sizes = {
    pico: 16,
    icon: 32,
    thumb: 50,
    small: 100,
    compact: 160,
    medium: 240,
    large: 480,
    grande: 600,
    master: 2048
  };

  sizes["1024x1024"] = 1024;
  sizes["2048x2048"] = 2048;

  var regex = {
    size: new RegExp("_(" + Object.keys(sizes).join("|") + ")\.(" + extensions.join("|") + ")"),
    extension: new RegExp("\.(" + extensions.join("|") + ")")
  };

  return {
    sizes: sizes,
    resize: function (src, size) {
      if ( !size ) {
        return src;
      }

      if ( regex.size.test(src) ) {
        return src.replace(regex.size, "_" + size + ".$2");
      } else {
        return src.replace(regex.extension, "_" + size + ".$1");
      }
    },
    crop: function (src) {
      var src = regex.size.test(src) ? src : this.resize(src, "2048x2048");
      return src.replace(regex.size, "_$1_cropped.$2");
    }
  };
});
