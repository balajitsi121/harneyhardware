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
