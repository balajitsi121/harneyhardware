define(["money", "shopify-image"], function (money, ShopifyImage) {

  $(document).on("change", ".js-product-option", function (e) {
    var form = $(e.currentTarget).parents("form");
    var product = form.data("product");
    var variant = get_current_variant(product, form);

    if (!variant) {
      form
        .find("[name='id']")
        .val('');
    } else {
      form
        .find("[name='id']")
        .val(variant.id);

      update_price(variant, form);
      update_button(variant, form);
      update_gallery(variant);
      update_url(variant);
    }
  });

  function update_gallery(variant) {
    if ( !variant.featured_image ) {
      return false;
    }

    var image = $("#product-image");
    var src = ShopifyImage.resize(variant.featured_image.src, "1024x1024");

    image.attr("src", src);
  }

  function update_price(variant, form) {
    var price = form.find(".js-price");
    var compare = form.find(".js-compare-price");

    price.html(money(variant.price));

    if ( variant.compare_at_price > variant.price ) {
      compare
        .html(money(variant.compare_at_price))
        .show();
    } else {
      compare.hide();
    }
  };

  function update_button(variant, form) {
    var button = form.find("[type=submit]");

    if ( variant.available ) {
      button
        .val("Add to cart")
        .prop("disabled", false);
    } else {
      button
        .val("Out of stock")
        .prop("disabled", true);
    }
  };

  function update_url(variant) {
    var url = window.location.href + (window.location.search == "" ? "?" : "&") + "variant=" + variant.id;

    if( window.location.search.indexOf("variant=") != -1 ) {
      url = window.location.href.replace(/variant=\d+/g, "variant=" + variant.id);
    }

    window.history.pushState({}, null, url);
  };

  function get_current_variant(product, form) {
    var current = null;
    var options = form.find(".js-product-option");
    var values = {};

    options.each(function (i, element) {
      var option = element.getAttribute("name");

      if ( element.tagName == "SELECT" || element.checked || element.getAttribute("type") == "hidden" ) {
        values[option] = element.value;
      }
    });

    product.variants.forEach(function (variant) {
      if ( variant.option1 == values.option1 && variant.option2 == values.option2 && variant.option3 == values.option3 ) {
        current = variant;
        return;
      }
    });

    return current;
  }
})
