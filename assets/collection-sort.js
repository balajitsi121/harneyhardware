define(["url-params"], function (url_params) {
  $(".js-collection-sort").change(function () {
    var params = url_params();
    params.sort_by = this.value;
    location.search = $.param(params);
  });
});
