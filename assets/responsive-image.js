define(["breakpoint", "shopify-image"], function (Breakpoint, ShopifyImage) {

  function ResponsiveImage(element) {
    this.element = element;
  }

  ResponsiveImage.prototype.src = function () {
    var size = "2048x2048";
    var src = this.element.getAttribute("data-src");

    if ( Breakpoint.small ) {
      size = "grande";
    } else if ( Breakpoint.medium_down ) {
      size = "1024x1024";
    }

    for ( var breakpoint in Breakpoint ) {
      if ( !Breakpoint[breakpoint] ) {
        continue;
      }

      if ( this.element.hasAttribute("data-src-" + breakpoint) ) {
        src = this.element.getAttribute("data-src-" + breakpoint);
      }

      if ( this.element.hasAttribute("data-size-" + breakpoint) ) {
        size = this.element.getAttribute("data-size-" + breakpoint);
      }
    }

    if ( !this.element.hasAttribute("data-no-resize") ) {
      src = ShopifyImage.resize(src, size);
    }

    return src;
  };

  ResponsiveImage.prototype.load = function (callback) {
    var self = this;
    var element = this.element;
    var src = this.src();
    var image = new Image();

    image.onload = function () {
      if ( element.nodeName == "DIV" ) {
        element.style.backgroundImage = "url(" + src + ")";
      } else {
        element.src = src;
      }

      callback.call(self);
    };

    image.src = src;
  };

  return ResponsiveImage;
});
