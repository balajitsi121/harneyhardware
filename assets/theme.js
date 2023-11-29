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
