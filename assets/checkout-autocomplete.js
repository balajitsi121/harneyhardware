var ShopifyCheckoutAutocomplete = (function() {
  function ShopifyCheckoutAutocomplete() {
    this.enableGeolocate = false;
    this.countryError = 'Please select valid country';
    this.addressInput = 'shipping_address';
    this.address1ErrorPlaceholder = 'Address';
    this.authFailure = false;
    this.googleMapsCircle = {};
    this.boundsInterval = {};
    this.componentForm = {};
    this.autocomplete = {};
    this.$addressInput = {};
  }

  ShopifyCheckoutAutocomplete.prototype.init = function(options) {
    var _this = this;

    var geolocate = options.geolocate;
    var countryError = options.countryError;
    var addressInput = options.addressInput;
    var address1ErrorPlaceholder = options.address1ErrorPlaceholder;

    this.enableGeolocate = geolocate || this.enableGeolocate;
    this.countryError = countryError || this.countryError;
    this.addressInput = addressInput || this.addressInput;
    this.address1ErrorPlaceholder = address1ErrorPlaceholder || this.address1ErrorPlaceholder;
    this.$addressInput = $('[name="checkout[' + addressInput + '][address1]"]');

    this.setComponentForm(this.addressInput);

    this.$addressInput.one('focus', function() {
      _this.setAutocomplete();

      if (_this.enableGeolocate) {
        _this.geolocate();
      }
    });

    // prevent accidential form submission if return key has been pressed
    this.$addressInput.on('keydown', function(evt) {
      var x = evt.which;

      if (x === 13) {
        evt.preventDefault();
      }
    });

    window.gm_authFailure = function() {
      _this.resetAuthFailure();
    };
  };

  ShopifyCheckoutAutocomplete.prototype.setComponentForm = function(addressInput) {
    this.componentForm = {
      route: {
        name: 'checkout[' + addressInput + '][address1]',
        format: 'long_name',
        content: ''
      },
      subpremise: {
        name: 'checkout[' + addressInput + '][address2]',
        format: 'long_name',
        content: ''
      },
      country: {
        name: 'checkout[' + addressInput + '][country]',
        format: 'long_name',
        content: ''
      },
      sublocality_level_1: {
        name: 'checkout[' + addressInput + '][city]',
        format: 'long_name',
        content: ''
      },
      locality: {
        name: 'checkout[' + addressInput + '][city]',
        format: 'long_name',
        content: ''
      },
      administrative_area_level_1: {
        name: 'checkout[' + addressInput + '][province]',
        format: 'long_name',
        content: ''
      },
      postal_code: {
        name: 'checkout[' + addressInput + '][zip]',
        format: 'short_name',
        content: ''
      }
    };
  };

  ShopifyCheckoutAutocomplete.prototype.setAutocomplete = function() {
    var _this = this;

    console.info('Google Places autocomplete initialized');

    // Create the autocomplete object, restricting the search to geographical location types.
    this.autocomplete = new google.maps.places.Autocomplete(
      /** @type {HTMLInputElement} */
      (document.getElementsByName(this.componentForm.route.name)[0]), {
        types: ['address']
      });

    // When the user selects an address from the dropdown, populate the address fields in the form.
    google.maps.event.addListener(this.autocomplete, 'place_changed', function() {
      _this.fillInAddress();
    });
  };

  ShopifyCheckoutAutocomplete.prototype.fillInAddress = function() {
    var _this = this;

    // Get the place details from the autocomplete object.
    var place = this.autocomplete.getPlace();
    var placeComponents = place.address_components;

    // Reconcile the Google results with Shopify's hardcoded values for provinces/states
    var provinceExceptions = {
      'Québec': 'Quebec',
      'District of Columbia': 'Washington DC'
    };

    var addressType = '';
    var val = '';

    // Store the contents of every placeComponent that matches one of our set options
    // at the top of the file. Store it in the empty 'content' key.
    for (var i = 0; i < placeComponents.length; i++) {
      addressType = placeComponents[i].types[0];

      if (this.componentForm[addressType]) {
        val = place.address_components[i][this.componentForm[addressType].format];

        // Store value to overwrite the street address, which is currently being used as the autocomplete input
        var streetNumberIndex = false;

        for (var x = 0; x < placeComponents.length; x++) {
          if (placeComponents[x].types[0] === 'street_number') {
            streetNumberIndex = x;
            break;
          }
        }

        if (addressType === 'route' && streetNumberIndex !== false) {
          this.componentForm[addressType].content = placeComponents[streetNumberIndex].long_name + " " + val;
        } else {
          this.componentForm[addressType].content = val;
        }

        // Use list of province exceptions to overwrite the stored values
        if (addressType === 'administrative_area_level_1' && provinceExceptions[this.componentForm[addressType].content]) {
          this.componentForm[addressType].content = provinceExceptions[this.componentForm[addressType].content];
        }
      }
    }

    // The loop will happen in the order set at the top of the file. So, country
    // will always be the second value set, ensuring there are no issues with
    // the 'province' select field not finding an appropriate value
    for (var key in this.componentForm) {
      if (_this.componentForm.hasOwnProperty(key)) {
        document.getElementsByName(_this.componentForm[key].name)[0].value = '';
        document.getElementsByName(_this.componentForm[key].name)[0].disabled = false;

        // If the component's content is empty, ignore it.
        // To catch 'sublocality_level_1' as a fallback for 'locality', the sub is
        // set first, according to the order set at the top of the script.
        // So, if the 'locality' is also present, it will overwrite it to be used
        // as the city name.
        if (_this.componentForm[key].content !== '') {
          var items = document.getElementsByName(_this.componentForm[key].name);

          for (var y = 0; y < items.length; y++) {
            // Set the value for every matching input. This is used to make sure
            // hidden inputs are not the only ones changed.
            items[y].value = _this.componentForm[key].content;
          }

          if (key === 'country') {
            var country = '[name="' + _this.componentForm.country.name + '"]';
            var $country = $(country);

            // Trigger the change event on 'Country' manually to make sure the
            // 'province' select pulls the correct options.
            // rickm this throws an error but doesn't matter, we're only using US
            // Checkout.$(country).trigger('change');

            // Display error if 'Country' is null. The country select has been
            // limited to display specific countries and the country from
            // autocomplete is not an option.
            if ($country.val() === null) {
              $country.closest('.field').addClass('field--error');

              Plus.func('ce-address-autocomplete', 'main', function() {
                $country.after('<p class="field__message field__message--error field__message--plus-error">' + _this.countryError + '</p>');
              });
            }
          }
        }
      }
    }
  };

  ShopifyCheckoutAutocomplete.prototype.geolocate = function() {
    var _this = this;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var geolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        var googleMapsCircle = new google.maps.Circle({
          center: geolocation,
          radius: position.coords.accuracy
        });

        _this.autocomplete.setBounds(googleMapsCircle.getBounds());

        // Console log when response from Google Maps is recevied just for dev info.
        console.info('Google Places autocomplete geolocation bounds set');
      }, function() {
        // User refused to share location
        _this.enableGeolocate = false;
      });
    } else {
      this.enableGeolocate = false;
    }
  };

  ShopifyCheckoutAutocomplete.prototype.resetAuthFailure = function() {
    // Override the attribute modifications on address line 1 when the JavaScript API fails to authenticate.
    // Note: Default callback adds class gm-err-autocomplete
    this.authFailure = true;

    this.$addressInput
      .css('background-image', 'none')
      .attr('disabled', false)
      .attr('autocomplete', 'shipping address-line1')
      .attr('placeholder', this.address1ErrorPlaceholder);
  };

  return ShopifyCheckoutAutocomplete;
}());
