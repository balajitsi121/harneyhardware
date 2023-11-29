$(function() {

  if ($('#ups-validation-order-id').length) {
    var addresses;
    var url = "https://upsvalidation.harneyhardware.com/upsvalidation/ui/customer/harney-hardware/ups_validation.php";
    var id = $('#ups-validation-order-id').val();

    console.log(id);
    // var url = "https://localhost/shopifycustom/apiclient/customer/harney-hardware/ups_validation.php";
    var data = {
      id: id
    };
    var addresses;
    $.ajax({
      url: url,
      data: data,
      method: 'GET',
      success: function(data, textStatus, jqXHR) {
        data = JSON.parse(data);
        addresses = data;
        console.log(data);

        if (data.human.length) {
          var html = [];
          for (i = 0; i < data.human.length; i++) {
             html.push('<option>' + data.human[i] + '</option>');
          }
          $('#validation-selection').append(html.join(''));
          $('[data-original-address]').html(data.original);
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        if (jqXHR.responseText == '{"errors":"No candidates"}') {
          $('#error-ups-found-no-candidates').show();
        } else {
          var error_message = "Error fetching UPS validation: " + jqXHR.responseText;
          $('#error-ups-connection').find('[data-error-placeholder]').html(error_message);
          $('#error-ups-connection').show();
        }
      }
    });

    $(document.body).on('click', '#ups-validation-submit', function() {
      var index = $('#validation-selection')[0].selectedIndex - 1;
      if (index >= 0) {
        var corrected_address = addresses.raw[index];
        console.log(corrected_address);

        var data = {
          id: id,
          address: corrected_address
        };

        $.ajax({
          url: url,
          data: data,
          method: 'POST',
          success: function(data, textStatus, jqXHR) {
            console.log(data);
            $('#success-banner').show();
          },
          error: function(jqXHR, textStatus, errorThrown) {
            $('#error-saving-address-banner').show();
            $('#error-saving-address-banner').find('[data-error-placeholder]').html(error_message);
            $('#error-saving-address-banner').show();
          }
        });
      }
    });

    $(document.body).on('change', '#validation-selection', function() {
      // TODO POST data. get index of selected, match up to index of raw data
      var index = $('#validation-selection')[0].selectedIndex - 1;

    });
  }

});
