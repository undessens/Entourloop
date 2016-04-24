
Vue.config.delimiters = ['[[', ']]']

var socket = io.connect('http://127.0.0.1:8080');

// List of OSC Event arriving from PUREDATA

socket.on('tempo', function(socket){
  console.log('Global Loop tempo changed');
  menu.main_tempo = !menu.main_tempo;});   

socket.on('tempoBar', function(socket){
  console.log('Tempo Bar changed');
  menu.main_bar = !menu.main_bar;});   

// socket.on('tempoFixed', function(socket){
//   console.log('Tempo is fixed');
//   menu.tempo_fixed = True;});   

// socket.on('clear_all', function(socket){
//   console.log('clear_all reset everything !');
//   });

socket.on('ready_to_play', function(data){
  console.log(' channel %d, now is playing ', data);
  switch(data) {
    case 1:
        channel1.ready_to_play();
        break;
    case 2:
        channel2.ready_to_play();
        break;
    case 3:
        
        break;
    case 4:
        
        break;
}
  });

socket.on('ready_to_stop', function(data){
  console.log(' channel %d, now is stopped', data);
  switch(data) {
    case 1:
        channel1.ready_to_stop();
        break;
    case 2:
        channel2.ready_to_stop();
        break;
    case 3:
        
        break;
    case 4:
        
        break;
}
  });

socket.on('ready_to_record', function(data){
  console.log(' channel %d, now is recording', data);
  switch(data) {
    case 2:
        channel2.ready_to_record();
        break;
    case 3:
        
        break;
    case 4:
        
        break;
}
  });

socket.on('ready_to_stop_record', function(data){
  console.log(' channel %d, now ended recording', data);
  switch(data) {
    case 2:
        channel2.ready_to_stop_record();
        break;
    case 3:
        
        break;
    case 4:
        
        break;
}
  });

socket.on('ready_to_delete', function(data){
  console.log(' channel %d, now deleted !', data);
  switch(data) {
    case 2:
        channel2.ready_to_delete();
        break;
    case 3:
        
        break;
    case 4:
        
        break;
}
  });







var menu = new Vue({
    el : '#menu',
    data:{
      bouton_delete: 'clear all',
      tempo_fixed: false, 
      main_tempo : 1,
      main_bar : 1
    },
    methods : {
      delete_all: function(){
        //this.main_tempo = !this.main_tempo;
        //this.main_bar =!this.main_bar;
        console.log('emitt delete_all');
        socket.emit('delete_all', 9);
        console.log('emited delete_all');


      }, 
      switch_tempo: function(){
        this.main_tempo = !this.main_tempo;
        this.main_bar =!this.main_bar;
      }
    }

});

// MAIN LOOPER CHANNEL

var channel1 = new Vue({
    el : '#channel1',
    data: {
      bouton_rec: 'record',
      bouton_play: '',
      isRecording: false,
      isLoopRecorded : false,
      isLoopPlaying : false,
      id : 1
  }, 
  methods : {
    //MAIN LOOPER : button record function
    record: function(){
      if(this.isRecording && !this.isLoopRecorded){
        this.isLoopRecorded = true;
        this.isLoopPlaying = true;
        this.isRecording = false;
        this.bouton_rec ='';
        this.bouton_play = 'mute';
        //send web socket
        socket.emit('stop_rec', this.id)
        // Set that the tempo is now fixed
        //TODO set other channels than channel 2
        channel2.tempo_fixed();
        menu.tempo_fixed = true;

      }
      if(!this.isLoopRecorded){
        this.bouton_rec= 'stop record';
        this.isRecording = true;
        //send OSC
        console.log('emit start_rec');
        socket.emit('start_rec', this.id)
        console.log('emited');
      }

      
    },
    //MAIN LOOPER : button stop / play function
    play: function(){
      value = false;

      if(this.isLoopRecorded && this.isLoopPlaying){
          this.bouton_play = 'waiting ...';
          value = false;
          socket.emit('stop', this.id);
      }
      if(this.isLoopRecorded && !this.isLoopPlaying){
        this.bouton_play = 'waiting ...';
        value = true;
        socket.emit('play', this.id);
      }

   
    },
    ready_to_play: function(){
        this.bouton_play = 'mute';
        this.isLoopPlaying = true;
    },
    ready_to_stop: function(){
        this.bouton_play = 'play';
        this.isLoopPlaying = false;
    },
    delete_all: function(){
      socket.emit('delete_all', 1)

    }
  }

});

// CHANNEL SLAVE (1) : channel n°2



var channel2 = new Vue({
    el : '#channel2',
    data: {
      isTempoFixed : false,
      bouton_rec: '',
      bouton_play: '',
      waiting_msg: '',
      bouton_del: '',
      isRecording: false,
      isLoopRecorded : false,
      isLoopPlaying : false,
      id : 2
      }, 
  methods : {
    record: function(){

      if(this.isRecording && !this.isLoopRecorded && this.isTempoFixed){
        this.isLoopRecorded = true;
        this.isLoopPlaying = true;
        this.isRecording = true;
        this.waiting_msg = 'waiting to stop record...';
        this.bouton_rec ='...waiting...';

        //send OSC
        socket.emit('stop_rec', this.id)

      }
      if(!this.isLoopRecorded && this.isTempoFixed){
        this.bouton_rec= '... waiting...';
        this.waiting_msg = '...waiting to record...';
        //send OSC
        socket.emit('start_rec', this.id)
      }

      
    
    },
  ready_to_record: function(){
        if(!this.isRecording && !this.isLoopRecorded){
        this.isRecording = true;
        this.bouton_rec= 'stop record';
        this.waiting_msg ='';}

  },
  ready_to_stop_record: function(){
        if(this.isRecording){
        this.isRecording = false;
        this.bouton_rec= '';
        this.bouton_play = 'stop';
        this.bouton_del = 'delete';
        this.waiting_msg ='';}
  },
  ready_to_delete: function(){
        if(this.isLoopRecorded){
        this.isRecording = false;
        this.bouton_rec= '';
        this.bouton_play = '';
        this.bouton_del = '';
        this.waiting_msg ='';
        this.isRecording= false;
        this.isLoopRecorded = false;
        this.isLoopPlaying = false;
        if(this.isTempoFixed){
          this.tempo_fixed();
        }

      }
  },

  delete: function(){
      if(this.isLoopRecorded ){
        socket.emit('delete', this.id);
        this.bouton_rec = '...waiting...';
        this.bouton_play= '...waiting...';
        this.waiting_msg= ' Clearing the track soon';
        this.bouton_del= '...waiting';

      }
    },
  play: function(){
      value = false;

      if(this.isLoopRecorded && this.isLoopPlaying){
          this.bouton_play = 'waiting ...';
          this.waiting_msg = 'waiting the end of bar before stopping';
          value = false;
          socket.emit('stop', this.id);
      }
      if(this.isLoopRecorded && !this.isLoopPlaying){
        this.bouton_play = 'waiting ...';
        this.waiting_msg = 'waiting the end of bar before playing';
        value = true;
        socket.emit('play', this.id);
      }
  },
  ready_to_stop: function(){
      if(this.isLoopRecorded){
        this.bouton_play = 'play';
        this.isLoopPlaying = false;
        this.waiting_msg = '';}
    },
  ready_to_play: function(){
      if(this.isLoopRecorded){  
        this.bouton_play = 'stop';
        this.isLoopPlaying = true;
        this.waiting_msg = '';}
    },
  // Called when the tempo is fised from the main channel, and allowed this channel beeing active
  tempo_fixed: function(){
    this.isTempoFixed = true;
    this.bouton_rec = 'record';
    this.bouton_play = '';

  }

}
});


/*
var boxTempo = new  Vue({
  el: '#check-tempo',
  data: {
    isRecording: false
  },
  created: function(){
  	console.log('creation de box')
  }
});

boxTempo.$watch( 'isRecording', function(){
		if (this.isRecording){
			socket.emit('record', 1);}
		else{
			socket.emit('record', 0);}
		
		}
	);


var selectInput = new Vue({
	el: '#selectInput',
	data:{
		choices : [
			{ text : 'Channel 1', value:0},
			{ text : 'Channel 2', value:1},
			{ text : 'Channel 3', value:2},
			{ text : 'Channel 4', value:3}
		],
		selected : 0
	}
});

selectInput.$watch( 'selected', function(){
		socket.emit('channel', this.selected);
		}
	);

*/

