
Vue.config.delimiters = ['[[', ']]']

var socket = io.connect('http://0.0.0.0:8080');


socket.on('tempo', function(socket){
  console.log('menu victory ');
  menu.switch_tempo();

});   

socket.on('truc', function(socket){
  console.log('truc victory ');

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
        console.log('emit delete_all');
        socket.emit('menu', this.id)
        console.log('emited');


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
        this.bouton_play = 'stop';
        //send OSC 
        console.log('emit stop_rec');
        socket.emit('stop_rec', this.id)
        console.log('emited');
        // Set that the tempo is now fixed
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
          this.bouton_play = 'play';
          value = false;
          console.log('fonction play : play');
          socket.emit('stop', this.id);
          console.log('emited');
      }
      if(this.isLoopRecorded && !this.isLoopPlaying){
        this.bouton_play = 'stop';
        value = true;
        console.log('fonction play : stop');
        socket.emit('play', this.id);
        console.log('fonction play : emited');
      }

      this.isLoopPlaying = value;

      
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
      id : 1
      }, 
  methods : {
    record: function(){

      if(this.isRecording && !this.isLoopRecorded && this.isTempoFixed){
        this.isLoopRecorded = true;
        this.isLoopPlaying = true;
        this.isRecording = false;
        this.bouton_rec ='';
        this.bouton_play = 'stop';
        this.bouton_del = 'delete';
        //send OSC
        socket.emit('stop_record', id)

      }
      if(!this.isLoopRecorded && this.isTempoFixed){
        this.bouton_rec= '... waiting...';
        this.waiting_msg = '...waiting to record...';
        //send OSC
        socket.emit('record', id)
      }

      
    
    },
  ready_to_record: function(){
        this.isRecording = true;
        this.bouton_rec= 'stop record';

  },

  delete: function(){
      socket.emit('delete', id)
    },
  play: function(){
      socket.emit('play', id)
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

