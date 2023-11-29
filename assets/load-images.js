define(["window", "breakpoint", "responsive-image"], function (W, Breakpoint, ResponsiveImage) {

  var offset = W.height() * (Breakpoint.medium_down ? 3 : 1.5);

  return function () {
    Array.prototype.slice.call(document.querySelectorAll("[data-src]"))
      .filter(function (img) {
        return W.inview(img, offset) && !img.classList.contains("loaded");
      })
      .map(function (img) {
        return new ResponsiveImage(img);
      })
      .forEach(function (img, index) {
        img.load(function () {
          this.element.classList.add("loaded");
        });
      });
  }
});
