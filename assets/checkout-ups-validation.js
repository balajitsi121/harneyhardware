var UpsValidation = (function() {
  function UpsValidation() {
    this.addressInput = 'shipping_address';
    this.authFailure = false;
    this.componentForm = {};
    this.autocomplete = {};
    this.lastAddressLookup = {
      "address1": "",
      "address2": "",
      "city": "",
      "state": "",
      "country": "",
      "zip_code": ""
    };
    this.doValidation = true;
    this.isAddressValidated = false;
    this.pendingSubmit = false;
    this.selectedAddressIndex = false;
    this.ups_addresses = [];
  }

  UpsValidation.prototype.init = function(options) {
    var _this = this;

    var addressInput = options.addressInput;

    this.addressInput = addressInput || this.addressInput;

    _this.refreshDataCache();
    _this.bindEvents();

    // check at page load. could be logged in / auto filled
    _this.attemptValidation();

  };

  UpsValidation.prototype.bindEvents = function() {
    var _this = this;

    $('#checkout_shipping_address_id').on('change', function(e) {
      _this.selectedAddressIndex = false;
      _this.isAddressValidated = false;
      _this.doValidation = true;
      // we have a race condition and I can't access the Shopify JS
      window.setTimeout(function() {
        _this.attemptValidation();
      }, 200);
    });

    $('[data-step="contact_information"] form input').on('change', function(e) {
      _this.selectedAddressIndex = false;
      _this.isAddressValidated = false;
    });

    $('[data-step="contact_information"] form').on('submit', function(e) {

      if (_this.areRequiredFieldsFilled() == false) {
        return true; // let Shopify handle the errors here
      }
      console.log(_this.isAddressValidated);
      if ( _this.isAddressValidated ) {
        return true;
      } else {
        _this.pendingSubmit = true;
        _this.attemptValidation();
      }

      e.preventDefault();
    });

    $('.modal-overlay').on('click', function() {
      // $(this).hide();
      // $(this).find('.modal-content').hide();
    });

    $('.modal-close').on('click', function() {
      $('.modal-overlay').hide();
      // $('.modal-overlay').find('.modal-content').hide();
    });

    $('.js-accept-address').on('click', function() {
      _this.isAddressValidated = true;
      _this.selectedAddressIndex = $('[name="ups-address"]').filter(':checked').first().val();
      _this.fillInAddress(_this.ups_addresses[_this.selectedAddressIndex]);
      $('.modal-overlay').hide();
      if (_this.pendingSubmit) {
        $('[data-step="contact_information"] form').submit();
      }
    });
  };

  UpsValidation.prototype.refreshDataCache = function() {
    var _this = this;

    this.$address1 = $('[name="checkout[' + _this.addressInput + '][address1]"]');
    this.$address2 = $('[name="checkout[' + _this.addressInput + '][address2]"]');
    this.$country = $('[name="checkout[' + _this.addressInput + '][country]"]');
    this.$city = $('[name="checkout[' + _this.addressInput + '][city]"]');
    this.$state = $('[name="checkout[' + _this.addressInput + '][province]"]').last(); // there's a hidden field by the same name. we're dealing with US only so we don't really care about it switching
    this.$zip_code = $('[name="checkout[' + _this.addressInput + '][zip]"]');
    this.address1 = this.$address1.val();
    this.address2 = this.$address2.val();
    this.country = this.$country.val();
    this.city = this.$city.val();
    this.state = this.$state.val();
    this.zip_code = this.$zip_code.val();
  }

  UpsValidation.prototype.areAddressesEqual = function(address1, address2) {
    return address1.address1.toString().toUpperCase() == address2.address1.toString().toUpperCase() && address1.address2.toString().toUpperCase() == address2.address2.toString().toUpperCase() && address1.country.toString().toUpperCase() == address2.country.toString().toUpperCase() && address1.city.toString().toUpperCase() == address2.city.toString().toUpperCase() && address1.zip_code.toString().toUpperCase() == address2.zip_code.toString().toUpperCase();
  }

  UpsValidation.prototype.areRequiredFieldsFilled = function() {
    var _this = this;

    _this.refreshDataCache();

    if (_this.address1 != '' && _this.country != '' && _this.city != '' && _this.state != '' && _this.zip_code != '') {
      return true;
    }

    return false;
  }

  UpsValidation.prototype.showModal = function() {
    var _this = this;
    var addresses = _this.ups_addresses;

    var address_choice_html = [];
    address_choice_html.push("<ul>");
    for (var i = 0; i < addresses.length; i++) {
      if (i < 1) {
        checked = 'checked="checked"'
      } else {
        checked = '';
      }
      address_choice_html.push('<li style="padding-bottom: 10px;">');
        address_choice_html.push('<input type="radio" name="ups-address" value="' + i + '" id="address-' + (i+1) + '" ' + checked + '"/>');
        address_choice_html.push('<label for="address-' + (i+1) + '" style="padding-left: 20px; display: block">');
          address_choice_html.push(addresses[i].address1 + ' ' + addresses[i].address2 + "<br>");
          address_choice_html.push(addresses[i].city + ', ' + addresses[i].state + " " + addresses[i].zip_code);
        address_choice_html.push('</label>');
      address_choice_html.push('</li>');
    }
    address_choice_html.push("</ul>");
    address_choice_html = address_choice_html.join('');
    $('[data-js-address-container]').html(address_choice_html);

    var last_address = _this.lastAddressLookup;

    var you_entered_html = [];
    you_entered_html.push('<strong style="font-weight: 700">You entered:</strong><br>');
    you_entered_html.push(last_address.address1 + " " + last_address.address2 + "<br>" + last_address.city + ", " + last_address.state + " " + last_address.zip_code);
    you_entered_html.join('');
    $('[data-js-you-entered-container]').html(you_entered_html);

    $('.modal-overlay').show();
  }

  UpsValidation.prototype.attemptValidation = function() {
    var _this = this;

    _this.refreshDataCache();

    // don't validate if we don't have the minimum fields to validate
    if (_this.areRequiredFieldsFilled()) {
      var data = {
        "address1": _this.address1,
        "address2": _this.address2,
        "country": _this.country,
        "city": _this.city,
        "state": _this.state,
        "zip_code": _this.zip_code
      };

      // if (_this.areAddressesEqual(data, _this.lastAddressLookup)) {
      //   console.log('addresses are equal when attempting validation');
      //   // we've already validated this address. don't do it again
      //   _this.doValidation = false;
      // }

      if (_this.isAddressValidated) {
        console.log('apparently we already validated');
        // last shot, do not miss your chance to blow (or abandon)
        _this.doValidation = false;
      }

      // don't do the same request twice
      if (_this.doValidation) {
        console.log('_this.doValidation is true, attempting validation');
        _this.lastAddressLookup = data;
        $.ajax({
          // url: "https://localhost/shopifycustom/harneyhardware/upsvalidation/",
          url: "https://upsvalidation.harneyhardware.com/upsvalidation/",
          dataType: "json",
          data: data,
          type: "POST",
          success: function(data, textStatus, jqXHR) {
            _this.isAddressValidated = true;
            var response_is_same = _this.areAddressesEqual(data[0], _this.lastAddressLookup);
            if (data.errors === undefined && response_is_same === false) {
              _this.ups_addresses = data;
              _this.showModal();
            }
            // if (_this.isAddressValidated && response_is_same) {
            //
            // }
            // if the address validated properly, and this event was triggered due to a submit event, re-submit manually
            if (_this.isAddressValidated && _this.selectedAddressIndex !== false) {
              if (_this.pendingSubmit) {
                $('[data-step="contact_information"] form').submit();
              }
            }
          }
        });
      }
    } else {
      _this.isAddressValidated = false;
    }
  };

  UpsValidation.prototype.fillInAddress = function(placeComponents) {
    var _this = this;

    _this.$address1.val(placeComponents.address1);
    _this.$address2.val(placeComponents.address2);
    _this.$country.val(placeComponents.country);
    _this.$city.val(placeComponents.city);
    _this.$state.find('[data-code="'  + placeComponents.state + '"]').attr('selected', 'selected');
    _this.$zip_code.val(placeComponents.zip_code);
  };

  return UpsValidation;
}());
