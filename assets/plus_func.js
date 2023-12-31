window.Plus =  window.Plus || {} ;

Plus.func = function(name, section, callback) {
  switch (section) {
    case 'main':
      section = '[data-step]';
      break;
    case 'discount_form':
      section = '[data-reduction-form]';
      break;
    case 'payment_lines':
      section = '[data-order-summary-section="payment-lines"]';
      break;
    case 'payment_due':
      section = '[data-order-summary-section="payment-due"]';
      break;
    default:
      section = section;
  }

  // checking for a specific class-attribute, else it's been erased by page:change
  if (!$(section).hasClass(name)) {
    if (typeof(callback) === 'function') {
      $(section).addClass(name);
      callback();
    } else {
      console.warn( 'Plus.func requires a function for the callback parameter' );
    }
  }
}
