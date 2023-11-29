define(["url-params"], function (url_params) {
  $(".js-collection-products-per-page").change(function () {
    var params = url_params();
    params.limit = this.value;
    location.search = $.param(params);
  });
});
