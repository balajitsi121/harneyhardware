$(function() {
  $(document).on('click','.js-product-list-item',function(e) {
    e.preventDefault();
    let list = $(e.currentTarget).parents('ul');
    let selectName = list.attr('id');
    let selectedBtnValue = $(this).data('value');
    $('select[name="'+selectName+'"]').val(selectedBtnValue);
    $('select[name="'+selectName+'"]').trigger("change");
    $(this).addClass('active');
    $('.js-product-list-item').not(this).removeClass('active');
  });

  $(document).on('click','.js-product-image-thumbnail-container',function(){
    $(this).addClass('active-thumb');
    $('.js-product-image-thumbnail-container').not(this).removeClass('active-thumb');
  });

  /* it seems javascript..*/
  var topLimit = $('#product-thumb-wrap').offset().top;
  $(window).scroll(function() {
    //console.log(topLimit <= $(window).scrollTop())
    if (topLimit <= $(window).scrollTop()) {
      $('#product-thumb-wrap').addClass('stickIt')
    } else {
      $('#product-thumb-wrap').removeClass('stickIt')
    }
  });

});

document.addEventListener('DOMContentLoaded', function() {

  if($('.product-gallery-thumbnails-section ul li.js-product-image-thumbnail-container').length){
    $('.product-gallery-thumbnails-section ul li.js-product-image-thumbnail-container:first-child').addClass('active-thumb');
  }

  const input = document.querySelector('.custom-number-input input');
  const decrementButton = document.querySelector('.custom-number-input .decrement');
  const incrementButton = document.querySelector('.custom-number-input .increment');

  decrementButton.addEventListener('click', function() {
    input.stepDown();
  });

  incrementButton.addEventListener('click', function() {
    input.stepUp();
  });
});
