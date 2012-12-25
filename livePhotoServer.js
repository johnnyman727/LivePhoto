var fs = require('fs');
var http = require('http');
var express = require('express'),
 app = express();
var watch = require('node-watch');
app.set('views', __dirname + '/views');
//set path to static files
app.use(express.static(__dirname + '/public'));
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var images = ['test.png'];
var sockets = [];
var intervalID;

watch('public/images', function(filename) {
  console.log(filename, ' changed.');
  var newImg =findNewImageName();
  if (newImg) {
    clearInterval(intervalID);

    intervalID = setInterval(sendImgToClients, 500, "/image/" + newImg);
  } 
});

app.get('/', function(req, res) {
      console.log("Somebody has hit the server here!");
      fs.readFile(__dirname + '/livePhoto.html', 'utf8', function(err, text){
       res.send(text);
   });
})


// Figure out what the new file was
function findNewImageName() {
	var newImgName;

	var files = fs.readdirSync('public/images');

	for (var i = 0; i < files.length; i++) {
		if (images.indexOf(files[i]) == -1  && files[i].indexOf('.DS') == -1) {
			newImgName = files[i];
			break;
		} 
	}

	return newImgName;
}

function logExistingImages() {
  var files = fs.readdirSync('public/images');

  for (var i = 0; i < files.length; i++) {
    images.push(files[i]);
  }
}

function sendImgToClients(newImg) {
  for (var i = 0; i < sockets.length; i++) {
       sockets[i].emit('newImage', {newImage : "/images/" + newImg});
    }
    images.push(newImg);
}

// When we get a connection from the browser
io.sockets.on('connection', function (socket) {

  // If there is a socket
  if (socket) {

    // Set our global socket to it for later
    sockets.push(socket);
  }

  socket.on('disconnect', function () {
    delete sockets[socket];
  });
});

logExistingImages();
server.listen(8080);
console.log("listening on port 8080");
