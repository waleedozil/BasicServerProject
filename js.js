$(document).ready(function() {
  $('#b1').on('click', function() {
    var data = $('input').val();
    $('input').val('');
    if (data != '') {
      send(data);
    }

  })

  $('#b2').on('click', function() {
    request();
  })




})






function fetch(data) {
  $('#d1').html('');
  for (var i = 0; i < data.length; i++) {
    if (data[i] != '') {
      var str = JSON.parse(data[i]);
      $('#d1').prepend(`<p> ${str}  </p>`)
    }

  }

}



function request() {
  $.ajax({
    url: 'http://127.0.0.1:3000/message',
    type: 'GET',
    success: function(data) {
      console.log('recived data from serve');
      console.log(data);
      fetch(data);


    },
    error: function(error) {
      console.error('chatterbox: Failed to fetch messages', error);
      console.error('ERROR : ', error.responseText);
    }
  })

}


function send(message) {
  $.ajax({
    url: 'http://127.0.0.1:3000/message',
    type: 'POST',
    data: JSON.stringify(message),
    // if you send the contentType you need to add option method in the server
    //contentType: 'application/json',
    success: function(data) {
      console.log('data send');
      console.log('Report from the server : ' + data);
      request();
    },
    error: function(error) {
      console.error('chatterbox: Failed to send message', error);
    }
  });

}
