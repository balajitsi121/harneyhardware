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
});

document.addEventListener('DOMContentLoaded', function() {
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
