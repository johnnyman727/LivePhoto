  // var browser_socket = io.connect('http://localhost:8080');
  var browser_socket = io.connect('jonamckay.com:8080');
  console.log("Starting socket client side");
  browser_socket.on('newImage', function (data) {

    $('#live-image').attr('src', data.newImage);

  });