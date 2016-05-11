

class looper_slave{

public:
  int channel;
  boolean isTempoFixed;
  
  //Led Green and Red
  led *ledG, *ledR;
  //Button
  button *but;

  // List of functions
  looper_slave(int channel, int pinG, int pinR , int pinB);
  void init();
  void update();
  
  //Looper: set the current state
  int actualState;  // -1 by default
  void record();                //0
  void stop_record();           //1
  void ready_to_record();       //2
  void ready_to_stop_record();  //3
  void play();                  //4
  void ready_to_play();         // ...
  void stop();
  void ready_to_stop();
  void delete_loop();
  void ready_to_delete();
  
  //Serial
  void sendMessage(int t);
  void readMessage(int m);
  
  //Be sure the tempo is fixed by channel1 before recording 
  //other channels
  void set_tempo_fixed(boolean v);
  

  

};

looper_slave::looper_slave(int i, int pinG, int pinR, int pinB){
    
  ledG = new led(pinG);
  ledR = new led(pinR);
  but = new button(pinB);
  isTempoFixed = false;
  
  channel = i;
  init();

}

void looper_slave::init(){
  
  
  actualState = -1;
  but->switchMode(JUST_PRESS_MODE);
  ledR->turnOff();
  ledG->turnOff();

}

void looper_slave::update(){
  
  
  //be sure tempo is fixed before sending a record
 if(isTempoFixed){
   
   but->update();
   
   int valueRead = 0;
   
     switch(actualState){
  
       case -1:
           //init state
           valueRead = but->readButton();
           if(valueRead) sendMessage(START_REC);
           break;
        
       case START_REC:
    
          break;
        case READY_TO_RECORD:
           valueRead = but->readButton();
           if(valueRead) sendMessage ( STOP_REC);
    
          break;
        case STOP_REC:
      
          break;
        case READY_TO_STOP_RECORD:
    
          break;
        case PLAY:
    
          break;
        case READY_TO_PLAY:
            valueRead = but->readButton();
           if(valueRead == SHORT_PRESS) sendMessage ( STOP );
           if(valueRead == LONG_PRESS) sendMessage ( DELETE );   
          break;
        case STOP:
    
          break;
        case READY_TO_STOP:
            valueRead = but->readButton();
           if(valueRead == SHORT_PRESS) sendMessage ( PLAY );
           if(valueRead == LONG_PRESS) sendMessage ( DELETE );
    
          break;
        case DELETE:
    
          break;
        case READY_TO_DELETE:
    
          break;
    
    
  }
   
   
   
 }
  
  ledG->update();
  ledR->update();
}


void looper_slave::record(){
  // the channel is not recording yet, waiting until ready_to_record
  ledR->ledBlink();
  ledG->stopBlink();
  actualState = START_REC;
 
}
void looper_slave::ready_to_record(){
  ledR->ledBlink(90);
  ledG->stopBlink(); 
  actualState = READY_TO_RECORD;
  
}
void looper_slave::stop_record(){
  ledR->ledBlink();
  ledG->stopBlink();
  actualState = STOP_REC;

}

void looper_slave::ready_to_stop_record(){
  ledR->turnOn();
  ledG->turnOn();
  actualState = READY_TO_STOP_RECORD;

}
void looper_slave::play(){
//not playing at this point, wait unil ready_to_play
  
  ledR->turnOn();
  ledG->ledBlink();
  actualState = PLAY; 

}
void looper_slave::ready_to_play(){
  ledR->turnOn();
  ledG->turnOn();
  actualState = READY_TO_PLAY;
  but->switchMode( LONG_PRESS_MODE );
  
}
void looper_slave::stop(){
  // not stoping at this point, wait until ready_to_stop
  ledG->ledBlink();
  ledR->turnOn();
  actualState = STOP;

}
void looper_slave::ready_to_stop(){
  ledR->turnOn();
  ledG->turnOff();
  actualState = READY_TO_STOP;
  but->switchMode( LONG_PRESS_MODE );
  
}

void looper_slave::delete_loop(){
  // not deleted at this point, wait until ready_to_delete
  ledR->ledBlink(100);
  ledG->ledBlink(100);
  actualState = DELETE;

}
void looper_slave::ready_to_delete(){
  ledR->turnOff();
  ledG->turnOff();
  actualState = READY_TO_DELETE;
  but->switchMode( JUST_PRESS_MODE );

  init();


}

void looper_slave::set_tempo_fixed(boolean value){
  isTempoFixed = value;
}

void looper_slave::sendMessage(int msg){
  

 Serial.print(char(channel + '0'));
 Serial.print(char(msg + '0'));
 Serial.print(char(14));
  
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
