// Create a web socket to our server
// var browser_socket = io.connect('http://localhost:8080');
var browser_socket = io.connect('jonamckay.com:8080');

// When we get a new image message
browser_socket.on('newImage', function (data) {

	// Change the source attribute of the image in 
	// our client html to the new image url
   	$('#live-photo').attr('src', data.newImage);

});