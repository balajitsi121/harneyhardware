define('google-analytics-load',[],function () {
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

define('url-params',[],function () {
  return function(str){var str=str||document.location.search;return""==str?{}:str.replace(/(^\?)/,"").split("&").map(function(n){return n=n.split("="),this[decodeURIComponent(n[0])]=decodeURIComponent(n[1]),this}.bind({}))[0]}
});

define('collection-sort',["url-params"], function (url_params) {
  $(".js-collection-sort").change(function () {
    var params = url_params();
    params.sort_by = this.value;
    location.search = $.param(params);
  });
});

define('collection-products-per-page',["url-params"], function (url_params) {
  $(".js-collection-products-per-page").change(function () {
    var params = url_params();
    params.limit = this.value;
    location.search = $.param(params);
  });
});

define('customer-login',[],function () {
  var forms = $(".js-form-container");

  $(".js-toggle-forms").click(function (e) {
    e.preventDefault();
    forms.toggle();
  });

  if ( window.location.hash == "#recover" ) {
    forms.toggle();
  }
});

/*!
  Zoom 1.7.14
  license: MIT
  http://www.jacklmoore.com/zoom
*/
(function($){var defaults={url:false,callback:false,target:false,duration:120,on:"mouseover",touch:true,onZoomIn:false,onZoomOut:false,magnify:1};$.zoom=function(target,source,img,magnify){var targetHeight,targetWidth,sourceHeight,sourceWidth,xRatio,yRatio,offset,$target=$(target),position=$target.css("position"),$source=$(source);$target.css("position",/(absolute|fixed)/.test(position)?position:"relative");$target.css("overflow","hidden");img.style.width=img.style.height="";$(img).addClass("zoomImg").css({position:"absolute",top:0,left:0,opacity:0,width:img.width*magnify,height:img.height*magnify,border:"none",maxWidth:"none",maxHeight:"none"}).appendTo(target);return{init:function(){targetWidth=$target.outerWidth();targetHeight=$target.outerHeight();if(source===$target[0]){sourceWidth=targetWidth;sourceHeight=targetHeight}else{sourceWidth=$source.outerWidth();sourceHeight=$source.outerHeight()}xRatio=(img.width-targetWidth)/sourceWidth;yRatio=(img.height-targetHeight)/sourceHeight;offset=$source.offset()},move:function(e){var left=e.pageX-offset.left,top=e.pageY-offset.top;top=Math.max(Math.min(top,sourceHeight),0);left=Math.max(Math.min(left,sourceWidth),0);img.style.left=left*-xRatio+"px";img.style.top=top*-yRatio+"px"}}};$.fn.zoom=function(options){return this.each(function(){var settings=$.extend({},defaults,options||{}),target=settings.target||this,source=this,$source=$(source),$target=$(target),img=document.createElement("img"),$img=$(img),mousemove="mousemove.zoom",clicked=false,touched=false,$urlElement;if(!settings.url){$urlElement=$source.find("img");if($urlElement[0]){settings.url=$urlElement.data("src")||$urlElement.attr("src")}if(!settings.url){return}}(function(){var position=$target.css("position");var overflow=$target.css("overflow");$source.one("zoom.destroy",function(){$source.off(".zoom");$target.css("position",position);$target.css("overflow",overflow);$img.remove()})})();img.onload=function(){var zoom=$.zoom(target,source,img,settings.magnify);function start(e){zoom.init();zoom.move(e);$img.stop().fadeTo($.support.opacity?settings.duration:0,1,$.isFunction(settings.onZoomIn)?settings.onZoomIn.call(img):false)}function stop(){$img.stop().fadeTo(settings.duration,0,$.isFunction(settings.onZoomOut)?settings.onZoomOut.call(img):false)}if(settings.on==="grab"){$source.on("mousedown.zoom",function(e){if(e.which===1){$(document).one("mouseup.zoom",function(){stop();$(document).off(mousemove,zoom.move)});start(e);$(document).on(mousemove,zoom.move);e.preventDefault()}})}else if(settings.on==="click"){$source.on("click.zoom",function(e){if(clicked){return}else{clicked=true;start(e);$(document).on(mousemove,zoom.move);$(document).one("click.zoom",function(){stop();clicked=false;$(document).off(mousemove,zoom.move)});return false}})}else if(settings.on==="toggle"){$source.on("click.zoom",function(e){if(clicked){stop()}else{start(e)}clicked=!clicked})}else if(settings.on==="mouseover"){zoom.init();$source.on("mouseenter.zoom",start).on("mouseleave.zoom",stop).on(mousemove,zoom.move)}if(settings.touch){$source.on("touchstart.zoom",function(e){e.preventDefault();if(touched){touched=false;stop()}else{touched=true;start(e.originalEvent.touches[0]||e.originalEvent.changedTouches[0])}}).on("touchmove.zoom",function(e){e.preventDefault();zoom.move(e.originalEvent.touches[0]||e.originalEvent.changedTouches[0])})}if($.isFunction(settings.callback)){settings.callback.call(img)}};img.src=settings.url})};$.fn.zoom.defaults=defaults})(window.jQuery);

define('product-gallery',[],function () {

  var $image = $("#product-image");
  var thumbnail = $(".js-product-image-thumbnail");

  if (matchMedia("(min-width: 769px)").matches) {
    $image
      .wrap('<span style="display:inline-block"></span>')
      .css('display', 'block')
      .parent()
      .zoom({ url: $image.attr('data-zoom') });
  }

  thumbnail.on('click', function(e) {
    e.preventDefault();

    $image.attr("src", this.href);
    $image.attr('data-zoom', $(this).attr('data-zoom'));

    if (matchMedia("(min-width: 769px)").matches) {
      var img = new Image();
      img.onload = function() {
        window.setTimeout(function() {
          $('#product-image').trigger('zoom.destroy');
          $('#product-image')
            .wrap('<span style="display:inline-block"></span>')
            .css('display', 'block')
            .parent()
            .zoom({ url: $('#product-image').attr('data-zoom') });
        }, 100);
      };
      console.log($('#product-image').attr('src'));
      img.src = $('#product-image').attr('src');
    }
  });

  thumbnail.each(function() {
    preload_image($(this).attr('data-zoom'));
  });

  function preload_image(url) {
    var img = new Image();
    img.src = url;
  }

});

define('money',[],function () {
  return function (cents, format) {

    if (typeof cents == 'string') cents = cents.replace('.','');
    var value = '';
    var patt = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = (format || "${{amount}}");

    function addCommas(moneyString) {
      return moneyString.replace(/(\d+)(\d{3}[\.,]?)/,'$1,$2');
    }

    function floatToString(numeric, decimals) {
      var amount = numeric.toFixed(decimals).toString();

      if ( amount.match(/^\.\d+/) ) {
        return "0"+amount;
      } else {
        return amount;
      }
    };

    switch ( formatString.match(patt)[1] ) {
      case 'amount':
        value = addCommas(floatToString(cents/100.0, 2));
        break;
      case 'amount_no_decimals':
        value = addCommas(floatToString(cents/100.0, 0));
        break;
      case 'amount_with_comma_separator':
        value = floatToString(cents/100.0, 2).replace(/\./, ',');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = addCommas(floatToString(cents/100.0, 0)).replace(/\./, ',');
        break;
    }

    return formatString.replace(patt, value);
  }
});

define('shopify-image',[],function () {
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

define('product-options',["money", "shopify-image"], function (money, ShopifyImage) {

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
;
/*!
 * Simple jQuery Equal Heights
 *
 * Copyright (c) 2013 Matt Banks
 * Dual licensed under the MIT and GPL licenses.
 * Uses the same license as jQuery, see:
 * http://docs.jquery.com/License
 *
 * @version 1.5.1
 */
!function(a){a.fn.equalHeights=function(){var b=0,c=a(this);return c.each(function(){var c=a(this).innerHeight();c>b&&(b=c)}),c.css("height",b)},a("[data-equal]").each(function(){var b=a(this),c=b.data("equal");b.find(c).css('height', '').equalHeights()})}(jQuery);

define('equal-heights',[], function (EqualHeights) {
  return function () {
    // all
    $('.js-collection-product-title').css('height', '').equalHeights();
    $('.js-terms-of-sale-header').css('height', '').equalHeights();
    $('.js-product-thumbnail-container').css('height', '').equalHeights();
    $('.js-collection-finish').css('height', '').equalHeights();

    // phone
    if (matchMedia("(max-width: 767px)").matches) {
      $('.js-product-image-thumbnail-container').css('height', '').equalHeights();
    }
    // tablet
    if (matchMedia("(min-width: 767px)").matches) {
      $('.js-homepage-section-link-container-1').css('height', '').equalHeights();
      $('.js-homepage-section-link-container-2').css('height', '').equalHeights();
      $('.js-homepage-section-link-container-3').css('height', '').equalHeights();
      $('.js-homepage-section-link-container-4').css('height', '').equalHeights();
      $('.js-homepage-section-link-container-5').css('height', '').equalHeights();
      $('.js-homepage-section-link-container-6').css('height', '').equalHeights();
    }
    if (matchMedia("(min-width: 768px)").matches) {
      $('.js-returns-image-container').css('height', '').equalHeights();
      $('.js-privacy-policy-copy').css('height', '').equalHeights();
    }
    // full desktop
    if (matchMedia("(max-width: 1365px)").matches) {
      console.log('should resize js-footer-information-box');
      $('.js-footer-information-box').css('height', '').equalHeights();
    }
  }
});

define('ajax-cart',[],function () {
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

define('throttle',[],function () {
  return function (fn, threshhold, scope) {
    threshhold || (threshhold = 100);

    var last = null;;
    var deferTimer = null;

    return function () {
      var context = scope || this;
      var now = +new Date;
      var args = arguments;

      if ( last && now < last + threshhold ) {
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function () {
          last = now;
          fn.apply(context, args);
        }, threshhold);
      } else {
        last = now;
        fn.apply(context, args);
      }
    };
  }
});

define('window',[],function () {
  var w = window;
  var d = document.documentElement;

  return {
    scroll_top: function () {
      return w.pageYOffset || d.scrollTop;
    },
    width: function () {
      return w.innerWidth || d.clientWidth;
    },
    height: function () {
      return w.innerHeight || d.clientHeight;
    },
    inview: function (element, offset) {
      var offset = offset || 200;
      var window_top = this.scroll_top();
      var window_bottom = window_top + w.innerHeight;
      var box = element.getBoundingClientRect();
      var box_top = box.top + window_top;
      var box_bottom = box.bottom + window_top;

      return box_bottom >= window_top - offset && box_top <= window_bottom + offset;
    }
  }
});

define('breakpoint',["throttle"], function (throttle) {
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

define('responsive-image',["breakpoint", "shopify-image"], function (Breakpoint, ShopifyImage) {

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

define('load-images',["window", "breakpoint", "responsive-image"], function (W, Breakpoint, ResponsiveImage) {

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

/*!
 * JavaScript Cookie v2.1.0
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
(function(factory){if(typeof define==="function"&&define.amd){define('cookie',factory)}else if(typeof exports==="object"){module.exports=factory()}else{var _OldCookies=window.Cookies;var api=window.Cookies=factory();api.noConflict=function(){window.Cookies=_OldCookies;return api}}})(function(){function extend(){var i=0;var result={};for(;i<arguments.length;i++){var attributes=arguments[i];for(var key in attributes){result[key]=attributes[key]}}return result}function init(converter){function api(key,value,attributes){var result;if(arguments.length>1){attributes=extend({path:"/"},api.defaults,attributes);if(typeof attributes.expires==="number"){var expires=new Date;expires.setMilliseconds(expires.getMilliseconds()+attributes.expires*864e5);attributes.expires=expires}try{result=JSON.stringify(value);if(/^[\{\[]/.test(result)){value=result}}catch(e){}if(!converter.write){value=encodeURIComponent(String(value)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent)}else{value=converter.write(value,key)}key=encodeURIComponent(String(key));key=key.replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent);key=key.replace(/[\(\)]/g,escape);return document.cookie=[key,"=",value,attributes.expires&&"; expires="+attributes.expires.toUTCString(),attributes.path&&"; path="+attributes.path,attributes.domain&&"; domain="+attributes.domain,attributes.secure?"; secure":""].join("")}if(!key){result={}}var cookies=document.cookie?document.cookie.split("; "):[];var rdecode=/(%[0-9A-Z]{2})+/g;var i=0;for(;i<cookies.length;i++){var parts=cookies[i].split("=");var name=parts[0].replace(rdecode,decodeURIComponent);var cookie=parts.slice(1).join("=");if(cookie.charAt(0)==='"'){cookie=cookie.slice(1,-1)}try{cookie=converter.read?converter.read(cookie,name):converter(cookie,name)||cookie.replace(rdecode,decodeURIComponent);if(this.json){try{cookie=JSON.parse(cookie)}catch(e){}}if(key===name){result=cookie;break}if(!key){result[name]=cookie}}catch(e){}}return result}api.get=api.set=api;api.getJSON=function(){return api.apply({json:true},[].slice.call(arguments))};api.defaults={};api.remove=function(key,attributes){api(key,"",extend(attributes,{expires:-1}))};api.withConverter=init;return api}return init(function(){})});
define('shopify-history',["cookie"], function (Cookie) {

  var storage_key = "shopify-theme-history";
  var max = 10;

  return {
    get all() {
      var cookie = Cookie.get(storage_key);
      return cookie ? cookie.split(",") : [];
    },
    set all(urls) {
      Cookie.set(storage_key, urls.join(","), { path: "/" });
    },
    get previous_url() {
      return this.all[1];
    },
    get previous_collection_urls() {
      var collections = [];
      this.all.slice(1).forEach(function (url) {
        if ( url.match("/collections/") && !url.match("/products/") ) {
          collections.push(url);
        }
      });
      return collections;
    },
    get previous_product_urls() {
      var products = [];
      this.all.slice(1).forEach(function (url) {
        if ( url.match("/products/") ) {
          products.push(url);
        }
      });
      return products;
    },
    save: function (url) {
      var url = url.replace(/\/$/,"");
      var urls = this.all;

      if ( url == this.previous_page ) {
        return false;
      }

      if ( urls.length == max ) {
        urls.pop();
      }

      urls.unshift(url);

      this.all = urls;
    }
  };
});

require(["google-analytics-load"]);
require(["collection-sort"]);
require(["collection-products-per-page"]);
require(["customer-login"]);
require(["product-gallery"]);
require(["product-options"]);
require(["equal-heights"]);
require(["ajax-cart"]);

require(["throttle", "load-images"], function(throttle, LoadImages) {
  LoadImages();

  window.addEventListener("scroll", throttle(function () {
    LoadImages();
  }));
});

require(["equal-heights", "throttle"], function(EqualHeights, throttle) {
  EqualHeights();

  window.addEventListener("orientationchange", throttle(function() {
    EqualHeights();
    $(window).trigger('scroll');
  }));

  window.addEventListener("resize", throttle(function() {
    EqualHeights();
    $(window).trigger('scroll');
  }));
});

require(["shopify-history"], function (ShopifyHistory) {
  ShopifyHistory.save(window.location.pathname);
});

$(function() {
  $('.js-read-more-trigger').on('click', function(e) {
    e.preventDefault();

    $(this).hide();
    $('.js-read-more').show();
  });

  $('.js-mobile-menu-trigger').on('click', function(e) {
    e.preventDefault();
    $(this).toggleClass('menu-opened');
    $('.js-mobile-menu').toggle();
  });

  $('.js-mobile-menu .js-dropdown-trigger, .js-mobile-utility-menu .js-dropdown-trigger').on('click', function(e) {
    if ($(this).hasClass('text-accent')) {
      e.preventDefault();
    } else {
      var href = $(this).attr('data-href');
      window.location.href = href;
    }
    $(this).toggleClass('text-primary').toggleClass('text-accent');
    $(this).find('.js-dropdown').toggle();
  });

  // stamped.io adds an excess font awesome stylesheet which overwrites font sizes for some reason.  don't let it exist.  we already include font awesome.
  var excess_font_awesome_timer = window.setInterval(function() {
    var $spreadsheet = $('link[rel=stylesheet][href*="maxcdn.bootstrapcdn.com\\/font-awesome\\/4.5.0\\/css\\/font-awesome"]');
    if ($spreadsheet.length) {
      $spreadsheet.remove();
      clearInterval(excess_font_awesome_timer);
    }
  }, 200);

  $('.js-collection-filter-mobile').on('change', function() {
    var href = $(this).find(':selected').val();
    window.location.href = href;
  });

  $('select').change(function(){
    if (/Android/.test(navigator.userAgent)){
      $(this).blur();
    }
  });

});

$(window).bind('load', function() {
  $('img.js-data-sheet-image').each(function() {
    if((typeof this.naturalWidth != "undefined" &&
      this.naturalWidth == 0 )
      || this.readyState == 'uninitialized' ) {
      $(this).closest('.js-accordion-container').hide();
      $('.js-accordion').each(function() {
        if ($(this).find('.js-accordion-container').filter(':visible').length == 0) {
          $(this).hide();
        }
      });
    }
  });

  window.setTimeout(function() {
    $('form[role="search"]').each(function() {
      $(this).attr('action', '/search').attr('method', '');
      $(this).find('input').removeAttr('id').removeAttr('onsubmit').removeAttr('isp_ac').removeClass('ui-autocomplete-input');
    });
  }, 1000);


});

define("theme", function(){});

