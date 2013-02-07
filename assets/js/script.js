jQuery(function(){

	// This demo depends on the canvas element
	if(!('getContext' in document.createElement('canvas'))){
		alert('Sorry, it looks like your browser does not support canvas!');
		return false;
	}

	// The URL of your web server (the port is set in app.js)
	//var url = 'http://localhost:3000';
    var url = window.location.hostname;

	var doc = jQuery(document),
		canvas = jQuery('#paper'),
	instructions = jQuery('#instructions');
var color = '#000000';
	// A flag for drawing activity
	var drawing = false;
	var clients = {};
	var cursors = {};
	
	//  funzione richiesta di nick name   
	
	var username = '';

if(!username)
{
	username = prompt("Hey there, insert your nick name, please", "");
}

username = username.substr(0,20);	

	var socket = io.connect(url); 
	
var ctx = canvas[0].getContext('2d');	
var spessore = jQuery('#spessore').value;
var colorem;
    // Force canvas to dynamically change its size to the same width/height
    // as the browser window.
    canvas[0].width = document.body.clientWidth;
    canvas[0].height = document.body.clientHeight;

    // ctx setup
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth =  3;
 ctx.font = "20px Tahoma";

	// Generate an unique ID
	var id = Math.round(jQuery.now()*Math.random());
if (username =='')  {username = id }
jQuery('#scrivi').keypress(function(e){
var code = e.keyCode;
if (code == '13') {
  if (document.getElementById('scrivi').value.length > 0 ) {	
 
 socket.emit('chat',{
				'testochat': document.getElementById('scrivi').value,				
				'id': id,
				'usernamerem' : username
			});
 jQuery('<div class="testochat">ME ' + document.getElementById('scrivi').value +'</div>').appendTo('#testichat');
  document.getElementById('scrivi').value ='';
	
}}

});

jQuery('#paper').dblclick(function (e){

if (document.getElementById('scrivi').value.length > 1 ) {
ctx.fillStyle = $('#minicolore').minicolors('rgbaString');
ctx.fillText(document.getElementById('scrivi').value, e.pageX, e.pageY); 

socket.emit('doppioclick',{
				'x': e.pageX,
				'y': e.pageY,
				'scrivi': document.getElementById('scrivi').value,				
				'color': $('#minicolore').minicolors('rgbaString'),
				'id': id,
				'spessremo' : document.getElementById('spessore').value
			});

document.getElementById('scrivi').value ='';
}	
									
});	
jQuery('#salvafoto').click(function (){
var dataURL = canvas[0].toDataURL();
document.getElementById("canvasimg").src = dataURL;  
window.open(document.getElementById("canvasimg").src, "toDataURL() image", "width=800, height=800");									
										  
});

 jQuery('#cancellalavagna').click(function (){
ctx.clearRect(0, 0, canvas[0].width, canvas[0].height);													  
});
	
 socket.on('doppioclickser', function (data) {
 ctx.fillStyle = data.color;
	ctx.fillText(data.scrivi, data.x, data.y); 
          
	});	
 
  socket.on('chatser', function (data) {
 
	//alert (data.testochat);
jQuery('<div class="testochat">' + data.usernamerem +' '+ data.testochat +'</div>').appendTo('#testichat');         
document.getElementById('frecce').style.backgroundColor ='#ffff00';
	});	
 	
	socket.on('moving', function (data) {
		
		if(! (data.id in clients)){
			// a new user has come online. create a cursor for them
			cursors[data.id] = jQuery('<div class="cursor"><div class="identif">'+ data.usernamerem +'</div>').appendTo('#cursors');
		}
	// Move the mouse pointer
		cursors[data.id].css({
			'left' : data.x,
			'top' : data.y
		});
			
		// Is the user drawing?
		if(data.drawing && clients[data.id]){
			
			// Draw a line on the canvas. clients[data.id] holds
			// the previous position of this user's mouse pointer

            ctx.strokeStyle = data.color;
			drawLinerem(clients[data.id].x, clients[data.id].y, data.x, data.y,data.spessremo,data.color);
		}
		
		// Saving the current client state
		clients[data.id] = data;
		clients[data.id].updated = jQuery.now();
	});

	var prev = {};

    // To manage touch events
    // http://ross.posterous.com/2008/08/19/iphone-touch-events-in-javascript/

  //  document.addEventListener("touchstart", touchHandler, true);
  
 // document.addEventListener("blur", cambiacolore(), true);
		  
   document.addEventListener("change", cambiaspessore, true);
  function cambiaspessore () {
	   ctx.lineWidth = document.getElementById('spessore').value;	   
}  
      
	canvas.on('mousedown', function(e){
		e.preventDefault();
		drawing = true;
		prev.x = e.pageX;
		prev.y = e.pageY;
		
		// Hide the instructions
		instructions.fadeOut();
	});
	
	doc.bind('mouseup mouseleave', function(){
 
		drawing = false;
	});

	var lastEmit = jQuery.now();

	doc.on('mousemove', function(e){
								 
		if(jQuery.now() - lastEmit > 30){
			
//	document.getElementById('risultato').innerHTML = $('#minicolore').minicolors('rgbaString');
			
			socket.emit('mousemove',{
				'x': e.pageX,
				'y': e.pageY,
				'drawing': drawing,
                'color': $('#minicolore').minicolors('rgbaString'),
				'id': id,
				'usernamerem' : username,
				'spessremo' : document.getElementById('spessore').value
			});
			lastEmit = jQuery.now();
		}
		// Draw a line for the current user's movement, as it is
		// not received in the socket.on('moving') event above
		
		if(drawing){

       //     ctx.strokeStyle = document.getElementById('minicolore').value;
			drawLine(prev.x, prev.y, e.pageX, e.pageY);
			prev.x = e.pageX;
			prev.y = e.pageY;
		}
	});
	
	// Remove inactive clients after 10 seconds of inactivity
    setInterval(function(){
        var totalOnline = 0;
        for(var ident in clients){
            if(jQuery.now() - clients[ident].updated > 10000){

                // Last update was more than 10 seconds ago.
                // This user has probably closed the page

                cursors[ident].remove();
                delete clients[ident];
                delete cursors[ident];
            }
            else totalOnline++;
        }
        jQuery('#onlineCounter').html('Players Connected: '+totalOnline);
    },10000);

	function drawLine(fromx, fromy, tox, toy){
		ctx.strokeStyle = $('#minicolore').minicolors('rgbaString');
		ctx.lineWidth = document.getElementById('spessore').value;	
        ctx.beginPath();
		ctx.moveTo(fromx, fromy);
		ctx.lineTo(tox, toy);
		ctx.stroke();
	}
	
	function drawLinerem(fromx, fromy, tox, toy,spessore,colorem){
		ctx.strokeStyle = colorem;
       ctx.lineWidth = spessore;	
        ctx.beginPath();
		ctx.moveTo(fromx, fromy);
		ctx.lineTo(tox, toy);
		ctx.stroke();
	}
	


});

