$(document).ready(function() {
  $('#testForm').submit(function(e) {
    e.preventDefault();
    $.ajax({
      url: '/api/stock-prices',
      type: 'get',
      data: $('#testForm').serialize(),
      success: function(data) {
        $('#jsonResult').text(JSON.stringify(data));
      },
    });
  });
  $('#testForm2').submit(function(e) {
    e.preventDefault();
    $.ajax({
      url: '/api/stock-prices',
      type: 'get',
      data: $('#testForm2').serialize(),
      success: function(data) {
        $('#jsonResult').text(JSON.stringify(data));
      },
    });
  });
});
