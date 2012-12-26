LivePhoto
=========

LivePhoto is a very simple Express JS server that will automatically display photos to any connected browser as soon as the photo is taken with a digital camera. It utilizes an Eye-Fi card
to send images to the server's file system, then sends the image URLs to clients via web sockets.

The entire creation of the project can be followed on [this instructable](http://www.instructables.com/id/EOKPWBTHAQ398GD/).

To switch between localhost and the live server web sockets, change the uncommented socket connect line in [livePhoto-client.js](https://github.com/johnnyman727/LivePhoto/blob/master/public/livePhoto-client.js).