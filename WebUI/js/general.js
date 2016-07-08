
Vue.config.delimiters = ['[[', ']]']

//TODO replace by raspberry pi IP
//var socket = io.connect('http://127.0.0.1:8080');
var socket = io.connect(raspberry.local:8080);
socket.on('connect', function()
    {
        log('socket connected');
    });

//-------------------------------------------
// List of OSC Event arriving from PUREDATA
//                SOCKET.ON
//---------------------------------------------



socket.on('tempo', function(socket){
  console.log('Global Loop tempo changed');
  menu.main_tempo = !menu.main_tempo;});   

socket.on('tempoBar', function(socket){
  console.log('Tempo Bar changed');
  menu.main_bar = !menu.main_bar;});   

socket.on('tempo_fixed', function(socket){
  console.log('Tempo is fixed');
  menu.tempo_fixed = true;
  channel2.tempo_fixed();
  channel3.tempo_fixed();
  channel4.tempo_fixed();
  });   

socket.on('clear_all', function(socket){
  console.log('clear_all reset everything !');
  menu.tempo_fixed = false;
  menu.main_tempo = 1;
  menu.main_bar = 1;
  channel1.init();

  //Delete channel even if nothing is recorded
  channel2.isTempoFixed = false;
  channel2.ready_to_delete();
  channel3.isTempoFixed = false;
  channel3.ready_to_delete();
  channel4.isTempoFixed = false;
  channel4.ready_to_delete();
  });

socket.on('play', function(data){
  console.log(' channel %d, want to play ', data);
  switch(data) {
    case 1:
        channel1.play();
        break;
    case 2:
        channel2.play();
        break;
    case 3:
        channel3.play();
        break;
    case 4:
        channel4.play();
        break;
}
  });

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
        channel3.ready_to_play();
        break;
    case 4:
        channel4.ready_to_play();
        break;
}
  });

socket.on('stop', function(data){
  console.log(' channel %d, want to stop ', data);
  switch(data) {
    case 1:
        channel1.stop();
        break;
    case 2:
        channel2.stop();
        break;
    case 3:
        channel3.stop();
        break;
    case 4:
        channel4.stop();
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
        channel3.ready_to_stop();
        break;
    case 4:
        channel4.ready_to_stop();
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
        channel3.ready_to_record();
        break;
    case 4:
        channel4.ready_to_record();
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
        channel3.ready_to_stop_record();
        break;
    case 4:
        channel4.ready_to_stop_record();
        break;
}
  });

socket.on('delete', function(data){
  console.log(' channel %d, want to delete !', data);
  switch(data) {
    case 2:
        channel2.delete();
        break;
    case 3:
        channel3.delete();
        break;
    case 4:
        channel4.delete();
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
        channel3.ready_to_delete();
        break;
    case 4:
        channel4.ready_to_delete();
        break;
}
  });

socket.on('start_rec', function(data){
  console.log(' channel %d, start_rec', data);
  switch(data) {
    case 1:
        channel1.record();
        break;
    case 2:
        channel2.record();
        break;
    case 3:
        channel3.record();
        break;
    case 4:
        channel4.record();
        break;
}
  });

socket.on('stop_rec', function(data){
  console.log(' channel %d, stop_rec', data);
  switch(data) {
    case 1:
        channel1.stop_record();
        break;
    case 2:
        channel2.stop_record();
        break;
    case 3:
        channel3.stop_record();
        break;
    case 4:
        channel4.stop_record();
        break;
}
  });

//------------------------------------------------
// Small menu outside looper channel
//------------------------------------------------

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

        socket.emit('clear_all', 0);



      }, 
      switch_tempo: function(){
        this.main_tempo = !this.main_tempo;
        this.main_bar =!this.main_bar;
      }
    }

});

//---------------------------------------------------------
// MAIN LOOPER CHANNEL
// CHANNEL 1
//---------------------------------------------------------

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
    // The button action has no influence on the webUI
    //Just send info to puredata, and puredata trigger record
    // function on the webUI
    record_button: function(){
      if(!this.isRecording && !this.isLoopRecorded){
          socket.emit('start_rec', this.id);
          console.log('channel1 record');
      }
      if(this.isRecording && !this.isLoopRecorded){
        //send web socket
        socket.emit('stop_rec', this.id)
      }

    },
    record: function(){
      if(!this.isLoopRecorded){
        this.bouton_rec= 'stop record';
        this.isRecording = true;
      }
 
    },
    stop_record: function(){
      if(this.isRecording && !this.isLoopRecorded){
        this.isLoopRecorded = true;
        this.isLoopPlaying = true;
        this.isRecording = false;
        this.bouton_rec ='';
        this.bouton_play = 'mute';        
        }
    },
    //MAIN LOOPER : 
    // The button action has no influence on the webUI
    //Just send info to puredata, and puredata trigger play
    // function on the webUI
    play_button: function(){
      if(this.isLoopRecorded && this.isLoopPlaying){
          socket.emit('stop', this.id);
      }
      if(this.isLoopRecorded && !this.isLoopPlaying){
        socket.emit('play', this.id);
      }

    },
    play: function(){
        this.bouton_play = 'waiting ...';
    },
    stop: function(){
        this.bouton_play = 'waiting ...';
    },
    ready_to_play: function(){
        this.bouton_play = 'mute';
        this.isLoopPlaying = true;
    },
    ready_to_stop: function(){
        this.bouton_play = 'play';
        this.isLoopPlaying = false;
    },
    init: function(){
        this.bouton_rec ='record';
        this.bouton_play = '';
        this.isRecording = false;
        this.isLoopRecorded = false;
        this.isLoopPlaying =false;

    }
  }

});

//----------------------------------------------
// CHANNEL  n°2
//-----------------------------------------------


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
    record_button: function(){
      if(this.isRecording && !this.isLoopRecorded && this.isTempoFixed){

        socket.emit('stop_rec', this.id)

      }
      if(!this.isRecording && !this.isLoopRecorded && this.isTempoFixed){

        socket.emit('start_rec', this.id)
      }
    },
    record: function(){

      if(!this.isLoopRecorded && this.isTempoFixed){
        this.bouton_rec= '... waiting...';
        this.waiting_msg = '...waiting to record...';
      }

    },
    stop_record: function(){
      if(this.isRecording && !this.isLoopRecorded && this.isTempoFixed){
        this.isLoopRecorded = true;
        this.isLoopPlaying = true;
        this.isRecording = true;
        this.waiting_msg = 'waiting to stop record...';
        this.bouton_rec ='...waiting...';

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
        this.isLoopRecorded = true;
        this.bouton_rec= '';
        this.bouton_play = 'stop';
        this.bouton_del = 'delete';
        this.waiting_msg ='';}
  },
  play_button: function(){
      if(this.isLoopRecorded && this.isLoopPlaying && this.isTempoFixed){

        socket.emit('stop', this.id);
      }
      if(this.isLoopRecorded && !this.isLoopPlaying && this.isTempoFixed){
 
        socket.emit('play', this.id);
      }
      
  },
  play: function(){
      if(this.isLoopRecorded && !this.isLoopPlaying){
        this.bouton_play = 'waiting ...';
        this.waiting_msg = 'waiting the end of bar before playing';
      }
  },
  stop: function(){
      if(this.isLoopRecorded && this.isLoopPlaying){
        this.bouton_play = 'waiting ...';
        this.waiting_msg = 'waiting the end of bar before stopping';
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
  },
  delete_button: function(){
    socket.emit('delete', this.id);
  },
  delete: function(){
      if(this.isLoopRecorded ){
        this.bouton_rec = '...waiting...';
        this.bouton_play= '...waiting...';
        this.waiting_msg= ' Clearing the track soon';
        this.bouton_del= '...waiting';
      }
    },
  ready_to_delete: function(){
              
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

}
});

//----------------------------------------------
// CHANNEL  n°3
//-----------------------------------------------


var channel3 = new Vue({
    el : '#channel3',
    data: {
      isTempoFixed : false,
      bouton_rec: '',
      bouton_play: '',
      waiting_msg: '',
      bouton_del: '',
      isRecording: false,
      isLoopRecorded : false,
      isLoopPlaying : false,
      id : 3
      }, 
  methods : {
    record_button: function(){
      if(this.isRecording && !this.isLoopRecorded && this.isTempoFixed){

        socket.emit('stop_rec', this.id)

      }
      if(!this.isRecording && !this.isLoopRecorded && this.isTempoFixed){

        socket.emit('start_rec', this.id)
      }
    },
    record: function(){

      if(!this.isLoopRecorded && this.isTempoFixed){
        this.bouton_rec= '... waiting...';
        this.waiting_msg = '...waiting to record...';
      }

    },
    stop_record: function(){
      if(this.isRecording && !this.isLoopRecorded && this.isTempoFixed){
        this.isLoopRecorded = true;
        this.isLoopPlaying = true;
        this.isRecording = true;
        this.waiting_msg = 'waiting to stop record...';
        this.bouton_rec ='...waiting...';

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
        this.isLoopRecorded = true;
        this.bouton_rec= '';
        this.bouton_play = 'stop';
        this.bouton_del = 'delete';
        this.waiting_msg ='';}
  },
  play_button: function(){
      if(this.isLoopRecorded && this.isLoopPlaying && this.isTempoFixed){

        socket.emit('stop', this.id);
      }
      if(this.isLoopRecorded && !this.isLoopPlaying && this.isTempoFixed){
 
        socket.emit('play', this.id);
      }
      
  },
  play: function(){
      if(this.isLoopRecorded && !this.isLoopPlaying){
        this.bouton_play = 'waiting ...';
        this.waiting_msg = 'waiting the end of bar before playing';
      }
  },
  stop: function(){
      if(this.isLoopRecorded && this.isLoopPlaying){
        this.bouton_play = 'waiting ...';
        this.waiting_msg = 'waiting the end of bar before stopping';
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
  },
  delete_button: function(){
    socket.emit('delete', this.id);
  },
  delete: function(){
      if(this.isLoopRecorded ){
        this.bouton_rec = '...waiting...';
        this.bouton_play= '...waiting...';
        this.waiting_msg= ' Clearing the track soon';
        this.bouton_del= '...waiting';
      }
    },
  ready_to_delete: function(){
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

}
});


//----------------------------------------------
// CHANNEL  n°4
//-----------------------------------------------


var channel4 = new Vue({
    el : '#channel4',
    data: {
      isTempoFixed : false,
      bouton_rec: '',
      bouton_play: '',
      waiting_msg: '',
      bouton_del: '',
      isRecording: false,
      isLoopRecorded : false,
      isLoopPlaying : false,
      id : 4
      }, 
  methods : {
    record_button: function(){
      if(this.isRecording && !this.isLoopRecorded && this.isTempoFixed){

        socket.emit('stop_rec', this.id)

      }
      if(!this.isRecording && !this.isLoopRecorded && this.isTempoFixed){

        socket.emit('start_rec', this.id)
      }
    },
    record: function(){

      if(!this.isLoopRecorded && this.isTempoFixed){
        this.bouton_rec= '... waiting...';
        this.waiting_msg = '...waiting to record...';
      }

    },
    stop_record: function(){
      if(this.isRecording && !this.isLoopRecorded && this.isTempoFixed){
        this.isLoopRecorded = true;
        this.isLoopPlaying = true;
        this.isRecording = true;
        this.waiting_msg = 'waiting to stop record...';
        this.bouton_rec ='...waiting...';

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
        this.isLoopRecorded = true;
        this.bouton_rec= '';
        this.bouton_play = 'stop';
        this.bouton_del = 'delete';
        this.waiting_msg ='';}
  },
  play_button: function(){
      if(this.isLoopRecorded && this.isLoopPlaying && this.isTempoFixed){

        socket.emit('stop', this.id);
      }
      if(this.isLoopRecorded && !this.isLoopPlaying && this.isTempoFixed){
 
        socket.emit('play', this.id);
      }
      
  },
  play: function(){
      if(this.isLoopRecorded && !this.isLoopPlaying){
        this.bouton_play = 'waiting ...';
        this.waiting_msg = 'waiting the end of bar before playing';
      }
  },
  stop: function(){
      if(this.isLoopRecorded && this.isLoopPlaying){
        this.bouton_play = 'waiting ...';
        this.waiting_msg = 'waiting the end of bar before stopping';
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
  },
  delete_button: function(){
    socket.emit('delete', this.id);
  },
  delete: function(){
      if(this.isLoopRecorded ){
        this.bouton_rec = '...waiting...';
        this.bouton_play= '...waiting...';
        this.waiting_msg= ' Clearing the track soon';
        this.bouton_del= '...waiting';
      }
    },
  ready_to_delete: function(){

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

}
});
