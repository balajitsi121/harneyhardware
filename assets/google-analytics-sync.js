$(function() {

  if ($('#google-analytics-sync-order-id').length) {
    var id = $('#google-analytics-sync-order-id').val();
    var url = "https://upsvalidation.harneyhardware.com/upsvalidation/report_ga_revenue.php";
    var data = {
      id: id
    };
    $.ajax({
      url: url,
      data: data,
      method: 'GET',
      success: function() {
        alert('GA revenue successfully reported.');
      },
      error: function(jqXHR, textStatus, errorThrown) {
        alert(jqXHR.responseText);
      }
    });
  }

});
