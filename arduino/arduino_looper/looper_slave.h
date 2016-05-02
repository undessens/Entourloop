
class looper_slave{

public:
  int channel;
  boolean isTempoFixed;
  
  //Scenario
  boolean isLoopRecorded;
  boolean isLoopRecording;
  boolean isLoopPlaying;
  
  //Led Green and Red
  led *ledG, *ledR;
  //Button
  button *but;

  // List of functions
  looper_slave(int channel, int pinG, int pinR , int pinB);
  void init();
  void update();
  
  //Looper: set the current state
  void record();
  void stop_record();
  void ready_to_record();
  void ready_to_stop_record();
  void play();
  void ready_to_play();
  void stop();
  void ready_to_stop();
  void delete_loop();
  void ready_to_delete();
  
  //Serial
  void sendMessage(int t);
  void readMessage(int m);
  
  //Be sure the tempo is fixed by channel1 before recording 
  //other channels
  void tempo_fixed();
  

  

};

looper_slave::looper_slave(int i, int pinG, int pinR, int pinB){
    
  ledG = new led(pinG);
  ledR = new led(pinR);
  but = new button(pinB);
  
  channel = i;
  init();

}

void looper_slave::init(){
  
  //Todo false by default
  isTempoFixed = true;
  isLoopRecorded = false;
  isLoopRecording = false;
  isLoopPlaying = false;

}

void looper_slave::update(){
  
  
  //be sure tempo is fixed before sending a record
 if(isTempoFixed){
   
   but->update();
   
   if(!isLoopRecorded && !isLoopRecording){
      if(but->readJustPressed()){
        sendMessage(START_REC); 
      }
   }
   if(!isLoopRecorded && isLoopRecording){
     
       if(but->readJustPressed()){
        sendMessage(STOP_REC); 
      }
   }
   if(isLoopRecorded && !isLoopRecording && !isLoopPlaying){
       if(but->readShortPressed()){
        sendMessage(PLAY); 
      }
       if(but->readLongPressed()){
        sendMessage(DELETE); 
      }
     
   }
   if(isLoopRecorded && !isLoopRecording && isLoopPlaying){
       if(but->readShortPressed()){
        sendMessage(STOP); 
      }
       if(but->readLongPressed()){
        sendMessage(DELETE); 
      }
     
   }
 
   
   
 }
  
  ledG->update();
  ledR->update();
}


void looper_slave::record(){
  // the channel is not recording yet, waiting until ready_to_record
  ledR->ledBlink();
  ledG->stopBlink();
  
  isLoopRecording = false;
  isLoopRecorded = false;
  isLoopPlaying = false;

}
void looper_slave::stop_record(){
  ledR->ledBlink();
  ledG->stopBlink();
  isLoopRecording = true;
  isLoopRecorded = false;
  isLoopPlaying = false;

}
void looper_slave::ready_to_record(){
  ledR->ledBlink(200);
  ledG->stopBlink();
  isLoopRecording = true;
  isLoopRecorded = false;
  isLoopPlaying = false;
  but->init();

}
void looper_slave::ready_to_stop_record(){
  ledR->turnOn();
  ledG->turnOn();
  isLoopRecording = false;
  isLoopRecorded = true;
  isLoopPlaying = true;
  but->init();

}
void looper_slave::play(){
//not playing at this point, wait unil ready_to_play
  
  ledR->turnOn();
  ledG->ledBlink();
  isLoopRecording = false;
  isLoopRecorded = true;
  isLoopPlaying = false;
  

}
void looper_slave::ready_to_play(){
  ledR->turnOn();
  ledG->turnOn();
  isLoopRecording = false;
  isLoopRecorded = true;
  isLoopPlaying = true;
  but->init();
  
}
void looper_slave::stop(){
  // not stoping at this point, wait until ready_to_stop
  ledG->ledBlink();
  ledR->turnOn();
  isLoopRecording = false;
  isLoopRecorded = true;
  isLoopPlaying = true;

}
void looper_slave::ready_to_stop(){
  ledR->turnOn();
  ledG->turnOff();
  isLoopRecording = false;
  isLoopRecorded = true;
  isLoopPlaying = false;
  but->init();
}

void looper_slave::delete_loop(){
  // not deleted at this point, wait until ready_to_delete
  ledR->ledBlink(200);
  ledG->ledBlink(200);
  isLoopRecording = false;
  //TODO
  isLoopRecorded = false;

}
void looper_slave::ready_to_delete(){
  ledR->turnOff();
  ledG->turnOff();
  but->init();
  init();


}

void looper_slave::tempo_fixed(){
  isTempoFixed = true;
}

void looper_slave::sendMessage(int msg){
  

 Serial.print(char(channel + '0'));
 Serial.println(char(msg + '0'));
  
}

//Translate int into specific message and associated function
void looper_slave::readMessage(int  msg){
 
  
  
  switch(msg){
  
    case START_REC:
      record(); 
      break;
    case READY_TO_RECORD:
      ready_to_record(); 
      break;
    case STOP_REC:
      stop_record();   
      break;
    case READY_TO_STOP_RECORD:
      ready_to_stop_record();   
      break;
    case PLAY:
      play();
      break;
    case READY_TO_PLAY:
      ready_to_play();
      break;
    case STOP:
      stop(); 
      break;
    case READY_TO_STOP:
      ready_to_stop();
      break;
    case DELETE:
      delete_loop();
      break;
    case READY_TO_DELETE:
      ready_to_delete();
      break;
    
    
  }
      
  
  
  
}
