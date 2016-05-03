var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var osc = require('osc-min');
var dgram = require('dgram');
var vue = require('vue');
var remote_osc_ip;

app.listen(8080);
console.log('Starting HTTP server on TCP port 8080');


function handler (req, res){

  fs.readFile(__dirname + '/index.html', function(err, data) {

    if(err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);

  });

}

//Creation of OSC server - with list of OSC message received
var udp_server = dgram.createSocket('udp4', function(msg, rinfo) {

  var osc_message;
  try {
    osc_message = osc.fromBuffer(msg);
  } catch(err) {
    return console.log('Could not decode OSC message');
  }

  /*
            GENERAL SETTINGS FROM OSC
  */
  if(osc_message.address == '/clear_all') {
    //console.log('OSC Message : clear all');
    io.emit('clear_all', 1);
  }

  if(osc_message.address == '/tempo_fixed') {
    //console.log('OSC Message : tempo fixed');
    io.emit('tempo_fixed', 0);
  }

  if(osc_message.address == '/tempo') {
    //console.log('OSC Message : tempo');
  	io.emit('tempo', 1);
  }

  if(osc_message.address == '/tempoBar') {
    //console.log('OSC Message : tempoBar');
  	io.emit('tempoBar', 1);
  }
  /*
              SETTINGS TO CHANNELS
  */

  if(osc_message.address == '/ready_to_record') {
    console.log('OSC Message : channel %d ready_to_record', osc_message.args[0].value);
  	io.emit('ready_to_record', osc_message.args[0].value);
  }

    if(osc_message.address == '/ready_to_stop_record') {
    console.log('OSC Message : channel %d ready to stop record', osc_message.args[0].value);
  	io.emit('ready_to_stop_record', osc_message.args[0].value);
  }

    if(osc_message.address == '/ready_to_play') {
    console.log('OSC Message : channel %d ready_to_play', osc_message.args[0].value);
  	io.emit('ready_to_play', osc_message.args[0].value);
  }

    if(osc_message.address == '/ready_to_stop') {
    console.log('OSC Message : channel %d ready_to_stop', osc_message.args[0].value);
  	io.emit('ready_to_stop', osc_message.args[0].value);
  }
    if(osc_message.address == '/ready_to_delete') {
    console.log('OSC Message : channel %d ready_to_delete', osc_message.args[0].value);
  	io.emit('ready_to_delete', osc_message.args[0].value);
  }
    
    if(osc_message.address == '/start_rec') {
    console.log('OSC Message : channel %d start_rec', osc_message.args[0].value);
  	io.emit('start_rec', osc_message.args[0].value);
  }
     
    if(osc_message.address == '/stop_rec') {
    console.log('OSC Message : channel %d stop_rec', osc_message.args[0].value);
  	io.emit('stop_rec', osc_message.args[0].value);
  }
    
    if(osc_message.address == '/stop') {
    console.log('OSC Message : channel %d stop', osc_message.args[0].value);
  	io.emit('stop', osc_message.args[0].value);
  }
    
    if(osc_message.address == '/play') {
    console.log('OSC Message : channel %d play', osc_message.args[0].value);
  	io.emit('play', osc_message.args[0].value);
  }

    if(osc_message.address == '/delete') {
    console.log('OSC Message : channel %d delete', osc_message.args[0].value);
  	io.emit('delete', osc_message.args[0].value);
  }

  remote_osc_ip = rinfo.address;
  

});

io.on('connection', function(socket) {

// if(! remote_osc_ip) {
//       return;
//     }

  	socket.on('browser', function(data) {

    

    var osc_msg = osc.toBuffer({
      oscType: 'message',
      address: '/socketio',
      args:[{ 
        type: 'integer',
        value: parseInt(data.x) || 0
      },
      {
        type: 'integer',
        value: parseInt(data.y) || 0
      }]
    });

    udp_server.send(osc_msg, 0, osc_msg.length, 9999, remote_osc_ip);
    console.log('Sent OSC message to %s:9999', remote_osc_ip);

  });

  socket.on('clear_all', function(data){
    console.log('socketio.js on :delete all %d', data);
    var osc_msg = osc.toBuffer({
      oscType: 'message',
      address: '/'+data.toString()+'/clear_all'
    });
    udp_server.send(osc_msg, 0, osc_msg.length, 9999, remote_osc_ip);

  });

  socket.on('start_rec', function(data){
  	console.log('socketio.js on : record channel: %d', data);
  	var osc_msg = osc.toBuffer({
      oscType: 'message',
      address: '/'+data.toString()+'/start_rec'
    });
    udp_server.send(osc_msg, 0, osc_msg.length, 9999, remote_osc_ip);
  });

  socket.on('stop_rec', function(data){
  	console.log('socketio.js on : stop record channel: %d', data);
  	var osc_msg = osc.toBuffer({
      oscType: 'message',
      address: '/'+data.toString()+'/stop_rec'
    });
    udp_server.send(osc_msg, 0, osc_msg.length, 9999, remote_osc_ip);
  });

   socket.on('stop', function(data){
  	console.log('socketio.js on : stop channel: %d', data);
  	var osc_msg = osc.toBuffer({
      oscType: 'message',
      address: '/'+data.toString()+'/stop'
    });
    udp_server.send(osc_msg, 0, osc_msg.length, 9999, remote_osc_ip);
  });

   socket.on('play', function(data){
  	console.log('socketio.js on : play channel: %d', data);
  	var osc_msg = osc.toBuffer({
      oscType: 'message',
      address: '/'+data.toString()+'/play'
    });
    udp_server.send(osc_msg, 0, osc_msg.length, 9999, remote_osc_ip);
  });

   socket.on('delete', function(data){
  	console.log('socketio.js on : delete channel: %d', data);
  	var osc_msg = osc.toBuffer({
      oscType: 'message',
      address: '/'+data.toString()+'/delete'
    });
    udp_server.send(osc_msg, 0, osc_msg.length, 9999, remote_osc_ip);
  });

});



udp_server.bind(9998);
console.log('Starting UDP server on UDP port 9998');

