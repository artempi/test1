// Based on the tutorial:
// http://tutorialzine.com/2012/08/nodejs-drawing-game/

//Restrictions on HEROKU:
// Doesn't support installing dependencies with npm with node 0.8
// Doesn't support websocekts.
// Including libraries
var knox = require('knox');

var client = knox.createClient({
    key: 'AKIAIDZAMIX2REQZACVA',
	secret: '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'
  , bucket: 'bucket222'
});
var stringafile ='';
var stringaip ='';
/*
var object = { foo: "bar" };
var string = JSON.stringify(object);
var req = client.put('/test/obj.json', {
    'Content-Length': string.length
  , 'Content-Type': 'application/json'
});
req.on('response', function(res){
  if (200 == res.statusCode) {
    console.log('saved to %s', req.url);
  }
});
req.end(string);

*/
var app = require('http').createServer(handler),
	io = require('socket.io').listen(app),
	nstatic = require('node-static'); // for serving files

// This will make all the files in the current folder
// accessible from the web
var fileServer = new nstatic.Server('./');
	
// This is the port for our web server.
// you will need to go to http://localhost:3000 to see it
var port = process.env.PORT || 8080; // Cloud9 + Heroku || localhost
app.listen(port);

// If the URL of the socket server is opened in a browser
function handler (request, response) {
	request.addListener('end', function () {
        fileServer.serve(request, response);
    });
}

// Delete this row if you want to see debug messages
 io.set('log level', 1);

// Heroku doesn't support websockets so...
// Detect if heroku via config vars
// https://devcenter.heroku.com/articles/config-vars
// heroku config:add HEROKU=true --app node-drawing-game
if (process.env.HEROKU === 'true') {
    io.configure(function () {
        io.set("transports", ["xhr-polling"]);
        io.set("polling duration", 20);
    });
}

// Listen for incoming connections from clients
io.sockets.on('connection', function (socket) {
/*									  
client.get('filelog.txt').on('response', function(res){
var miadata =	new Date();											  
stringaip = socket.handshake.address.address  + ' ' + miadata.getDate() +'/' + miadata.getMonth() + '/' + miadata.getYear() 
+ ' ' + miadata.getHours() +':' + miadata.getMinutes() +':' + miadata.getSeconds();
 // console.log(stringaip);
  // console.log(res.headers);
  res.setEncoding('utf8');
  res.on('data', function(chunk){
//    console.log(chunk);
stringafile = stringafile + chunk;
//     console.log(stringafile);
  }); 
}).end();									  

var buffer = new Buffer(stringafile + stringaip + '\n');
var headers = {
  'Content-Type': 'text/plain'
};
client.putBuffer(buffer, '/filelog.txt', headers, function(err, res){
  // Logic
});

*/
	// Start listening for mouse move events
	socket.on('mousemove', function (data) {
		
		// This line sends the event (broadcasts it)
		// to everyone except the originating client.
		socket.broadcast.emit('moving', data);
	});
	
socket.on('salvasulserver', function (data) {
		
	//	var object = { foo: data.dataserver };
	var datidalclient = data.dataserver.replace(/^data:image\/\w+;base64,/, "");
var buf = new Buffer(datidalclient, 'base64');
//var string = 'scrivo qualche cosa';
var req = client.put(data.orario + '.png', {
    'Content-Length': buf.length,
	'Content-Type': 'image/png'
});
req.on('response', function(res){
  if (200 == res.statusCode) {
//    console.log('saved to %s', req.url);
  }
});
req.end(buf);		
		
	});	

socket.on('doppioclick', function (data) {
		
		// This line sends the event (broadcasts it)
		// to everyone except the originating client.
		socket.broadcast.emit('doppioclickser', data);
		
	});	

socket.on('chat', function (data) {
		
		// This line sends the event (broadcasts it)
		// to everyone except the originating client.
		socket.broadcast.emit('chatser', data);
		
	});	
socket.on('fileperaltri', function (data) {
		
		// This line sends the event (broadcasts it)
		// to everyone except the originating client.
		socket.broadcast.emit('fileperaltriser', data);
		
	});	

socket.on('camperaltri', function (data) {
		
		// This line sends the event (broadcasts it)
		// to everyone except the originating client.
		socket.broadcast.emit('camperaltriser', data);		
	});	

	
});