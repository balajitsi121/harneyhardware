define(function () {
  var forms = $(".js-form-container");

  $(".js-toggle-forms").click(function (e) {
    e.preventDefault();
    forms.toggle();
  });

  if ( window.location.hash == "#recover" ) {
    forms.toggle();
  }
});
