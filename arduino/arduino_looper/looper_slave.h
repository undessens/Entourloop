
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
  void sendMessage(String t);
  void readMessage(String t);
  
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
        sendMessage("start_rec"); 
      }
   }
   if(!isLoopRecorded && isLoopRecording){
     
       if(but->readJustPressed()){
        sendMessage("stop_rec"); 
      }
   }
   if(isLoopRecorded && !isLoopRecording && !isLoopPlaying){
       if(but->readShortPressed()){
        sendMessage("play"); 
      }
       if(but->readLongPressed()){
        sendMessage("delete"); 
      }
     
   }
   if(isLoopRecorded && !isLoopRecording && isLoopPlaying){
       if(but->readShortPressed()){
        sendMessage("stop"); 
      }
       if(but->readLongPressed()){
        sendMessage("delete"); 
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
  isLoopRecording = true;
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
  isLoopRecording = false;
  isLoopRecorded = false;
  isLoopPlaying = false;

}
void looper_slave::ready_to_stop_record(){
  ledR->turnOn();
  ledG->turnOn();
  isLoopRecording = false;
  isLoopRecorded = true;
  isLoopPlaying = true;

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
}

void looper_slave::delete_loop(){
  // not deleted at this point, wait until ready_to_delete
  ledR->ledBlink(200);
  ledG->ledBlink(200);
  isLoopRecording = false;
  isLoopRecorded = true;

}
void looper_slave::ready_to_delete(){
  ledR->turnOff();
  ledG->turnOff();
  init();


}

void looper_slave::tempo_fixed(){
  isTempoFixed = true;
}

void looper_slave::sendMessage(String msg){
  
 // First letter is the channel, then the msg
 String finalMsg = String(channel) + msg;

 Serial.println(finalMsg);
  
}

void looper_slave::readMessage(String msg){
 
  
  
    if (msg == "start_rec"){
      record(); 
     Serial.println("Victory start-rec");   
    }
    if (msg == "stop_rec"){
        stop_record(); 
       Serial.println("Victory stop-rec");  
    }
    if (msg =="ready_to_record"){
        ready_to_record();    
        Serial.println("Victory ready_to_record"); 
    }
    if (msg =="ready_to_stop_record"){
        ready_to_stop_record();    
    }
    if(msg == "play"){  
      Serial.println("Victory rplay"); 
      play();
    }
    if (msg =="ready_to_play"){
        ready_to_play();
        Serial.println("Victory ready_to_play"); 
    }
    if (msg =="stop"){
        stop();
        Serial.println("Victory stop"); 
    }
    if (msg =="ready_to_stop"){
        ready_to_stop();
        Serial.println("Victory ready_to_stop"); 
    }
    if (msg =="delete"){
        delete_loop();
        Serial.println("Victory delete"); 
    }
    if (msg =="ready_to_delete"){
        ready_to_delete();
        Serial.println("Victory ready_to_delete"); 
    }
      
  
  
  
}
