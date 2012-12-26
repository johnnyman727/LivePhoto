// Include the http module (built-in to NodeJS)
var http = require('http');

// Include Express to pick up web requests
var express = require('express'),

// Start Express up
app = express();

// Create a new server using our express app
var server = http.createServer(app);

//set path to static files
app.use(express.static(__dirname + '/public'));

// Include File System Module
var fs = require('fs');

// Start a new websocket on the server's address
var io = require('socket.io').listen(server);

// Create an array to store open socket connections with
var sockets = [];

// Create an array to store the name of images we've already displayed
var images = [];

// Import the directory watching module
var watch = require('node-watch');

// An interval to make sure we don't send out the link prior to upload completion
var checkCompletionInterval;

/*
* Start watching the image directory for changes.
* When we detect a change, notify the clients
*/
watch('public/images', function(filename) {

  // Find the new image that triggered this
  var newImg = findNewImageName();

  // If we do have a new image (and it was just deleted or something)
  if (newImg) {

    // Print out its name to the terminal
    console.log("New Image Name: " + newImg);

    // If we have an interval going, cancel it
    if (checkCompletionInterval) clearInterval(checkCompletionInterval);
    
    // Send the image out to all of the clients in 500 ms
      checkCompletionInterval = setInterval(sendImgToClients, 500, newImg);

    // Add it to the list of displayed images
    images.push(newImg);
  }
});

/*
Send the image to each client web socket
*/
function sendImgToClients(newImg) {

  // For each open socket
    for (var i = 0; i < sockets.length; i++) {

      // Send the message to the socket
        sockets[i].emit('newImage', {newImage : "/images/" + newImg});
    }

    // Clear the completion interval
    clearInterval(checkCompletionInterval);
}

/*
* If we get a request to our root route, send the html page back
*/
app.get('/', function(req, res) {

  // Read the html file into a text buffer
    fs.readFile(__dirname + '/public/livePhoto.html', 'utf8', function(err, text){

      // Send out the buffer
      res.send(text);
   });
})

/*
* Create new socket connections
* and handle teardowns
*/
io.sockets.on('connection', function (socket) {

  // If there is a socket
  if (socket) {

    // Set our global socket to it for later
    sockets.push(socket);
  }

  // When a socket disconnects
  socket.on('disconnect', function () {

    // Remove that socket from our array
    delete sockets[socket];
  });
});

/*
Scan the array of images until we
find one we haven't accounted for yet.
*/
function findNewImageName() {

  // Grab the list if images in the directory
  var files = fs.readdirSync('public/images');

  // Iterate through the images
  for (var i = 0; i < files.length; i++) {

    // If the image name isn't in our array of account for images
    // it's the new one, so return it.
    if (images.indexOf(files[i]) == -1  && files[i].indexOf('.DS') == -1) {
      return files[i];
    } 
  }
}

/* 
Add the pre-existing images
to our image array so that
we don't confuse it with a new one. 
*/
function logExistingImages() {

  // Grab all the current images
    var files = fs.readdirSync('public/images');

    // For each file in the directory
    for (var i = 0; i < files.length; i++) {

      // Add it to the array
      images.push(files[i]);
    }
}

// Catalog all existing images
logExistingImages();

// Start the server on port 8080
server.listen(8080);

//Write out the port just for fun
console.log("listening on port 8080");