define(function () {
  $(document.body).on("click", ".js-add-to-cart",
    function (e) {
      if ($(this).hasClass('in-cart')) {
        if (! $(this).hasClass('js-multiple-variants')) {
          return true;
        }
      }

      e.preventDefault();
      var button = $(this);
      var product = button.parents(".js-product");
      var quantity = product.find('input[type="number"]').val();

      var id;

      if (product.find('input[type="hidden"][name="id"]').length) {
        id = product.find('input[type="hidden"][name="id"]').val();
      } else {
        id = product.attr("data-id");
      }

      if (!id) {
        vex.dialog.alert({
          message: "Please choose how you would like your lock keyed.",
          className: "vex-theme-default"
        });
        return false;
      }

      var data = {};
      data.id = id;
      data.quantity = quantity;

      var properties = get_line_item_properties(product);
      properties = mixin_backorder_quantity_properties(properties, product, quantity);

      if ($.isEmptyObject(properties) == false) {
        data.properties = properties;
      }

      $.ajax({
        url: "/cart/add.js",
        method: "POST",
        data: data,
        dataType: "json",
        beforeSend: function () {
          show_loading(button);
        },
        success: function () {
          show_added(button);
          show_backorder();
          rerender_ajax();
        },
        error: function (xhr) {
          var error = JSON.parse(xhr.responseText);
          console.log(error);
          alert(error.message + ": " + error.description);
          if ( error.description.indexOf("in your cart") !== -1 ) {
            show_added(button);
          } else {
            show_default(button);
          }
        }
      });
    }
  );

  $.ajaxSetup ({
    cache: false
  });

  var $ajax_html;
  function rerender_ajax() {
    var location = window.location.href;
    $.get(window.location.href, function(data) {
      $ajax_html = $(data);
      update_cart_icon($ajax_html.find('[data-ajax-fragment="cart"]').find('.js-ajax-content'));
      if (location.indexOf('/cart') !== -1) {
        var cart_items_table = $ajax_html.find('[data-ajax-fragment="cart-items-table"]').find('.js-ajax-content');
        var cart_items_size = cart_items_table.attr('data-items-size');
        if (cart_items_size === 0 || isNaN(parseFloat(cart_items_size))) {
          window.location.reload();
          return false;
        }
        $('[data-ajax-fragment="cart-items-table"]').find('.js-ajax-loader').html(cart_items_table);

        var cart_summary = $ajax_html.find('[data-ajax-fragment="cart-summary"]').find('.js-ajax-content');
        $('[data-ajax-fragment="cart-summary"]').find('.js-ajax-loader').html(cart_summary);
      }
    });
  }

  function mixin_backorder_quantity_properties(properties, product, quantity) {
    var backorder_status_value = $('[name="Backorder Status"]').first().val(),
      backorder_status_key = "Backorder Status",
      inventory_quantity = parseInt(product.find('.js-inventory-quantity').text()),
      quantity = parseInt(quantity);

    if (quantity > inventory_quantity) {
      properties[backorder_status_key] = backorder_status_value;
    }

    return properties;
  }

  function get_line_item_properties(product) {
    var properties = {};

    product.find('.js-line-item-property').each(function() {
      var raw_name = $(this).attr('name'),
        value = $(this).val();

      // e.g., properties[Backorder Status]
      var name = raw_name.split('[')[1].split(']')[0];

      properties[name] = value;
    });

    return properties;
  }

  function update_cart_icon(html) {
    $('[data-ajax-fragment="cart"]').find('.js-ajax-loader').html(html);
  }

  function show_loading(button) {
    button
      .children()
        .hide()
      .end()
      .find(".js-loading")
        .show();
  }

  function show_added(button) {
    button
      .children()
        .hide()
      .end()
      .addClass("in-cart")
      .find(".js-added-text")
        .show();
  }

  function show_default(button) {
    button
      .children()
        .hide()
      .end()
      .removeClass("in-cart")
      .find(".js-add-text")
        .show();
  }

  function show_backorder() {
    if ($('.js-backorder-message').length) {
      $('.js-backorder-message').show();
    }
  }

  $(document.body).on('click', '.js-quantity-control', function(e) {
      var $that = $(this),
        $container = $that.closest('.js-quantity-container'),
        $input = $container.find('.js-quantity-input');

      var current_quantity = parseInt($input.val());
      var new_quantity = $that.attr('data-control') == "add" ? current_quantity + 1 : current_quantity - 1;
      var max_quantity = parseInt($input.attr("max")) || 9999;

      if ( new_quantity >= 0 && new_quantity <= max_quantity ) {
        $input
          .val(new_quantity);
      }

      if ( new_quantity > max_quantity ) {
        alert("Sorry, that's all we have in stock!");
      } else {
        $input.trigger('change');
      }
    }
  );

  $(document.body).on('change', '.js-quantity-input', function(e) {
    var product = $(this).closest('[data-id]'),
      line_id = product.attr('data-line-id'),
      quantity = $(this).val();

    var data = { line: line_id, quantity: quantity };

    $.ajax({
      url: "/cart/change.js",
      method: "POST",
      data: data,
      dataType: "json",
      success: function () {
        rerender_ajax();
      },
      error: function (xhr) {
        var error = JSON.parse(xhr.responseText);
        alert(error.message + ": " + error.description);
      }
    });
  });

  // if the user changed the quantity on the collection page,
  // pass it through to the product page as well
  $(document.body).on('change', '.js-pass-through-quantity', function(e) {
    var $product = $(this).closest('[data-id]'),
      quantity = $(this).val(),
      $href = $product.find('[href]'),
      old_href = $href.first().attr('href'),
      qty_param = '?q[qty]=';

    if (old_href.indexOf(qty_param) !== -1) {
      // reset the qty parameter
      var new_href = old_href.split(qty_param)[0];
    } else {
      var new_href = old_href;
    }

    new_href = new_href + qty_param + quantity;

    $href.attr('href', new_href);
  });

  $(document.body).on('click', '.js-remove-item', function(e) {
    e.preventDefault();
    var line_id = $(this).attr('data-line-id'),
      product = $(this).closest('[data-id]'),
      product_id = product.attr('data-id'),
      button = $('.js-product[data-id="' + product_id + '"]').find('.js-add-to-cart');

    var data = { line: line_id, quantity: 0 };

    $.ajax({
      url: "/cart/change.js",
      method: "POST",
      data: data,
      dataType: "json",
      success: function () {
        rerender_ajax();
        show_default(button);
      },
      error: function (xhr) {
        var error = JSON.parse(xhr.responseText);
        alert(error.message + ": " + error.description);
      }
    });
  });

});
