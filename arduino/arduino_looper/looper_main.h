class looper_main{

public:

  //Led Green and Red
  led *ledG, *ledR;
  //Button
  button *but;

  // List of functions
  looper_main(int pinG, int pinR , int pinB);
  void init();
  void update();
  
  //Looper: set the current state : 
  //looper_main does not have ready_to_record & ready_to_stop_record
  int actualState;  // -1 by default
  void record();                //0
  void stop_record();           //1
  void play();                  //4
  void ready_to_play();         //5
  void stop();                  //6
  void ready_to_stop();
  void delete_loop();
  void ready_to_delete();
  
  //Serial
  void sendMessage(int t);
  void sendMessageGlobal( int t);
  void readMessage(int m);
  

};

looper_main::looper_main( int pinG, int pinR, int pinB){
    
  ledG = new led(pinG);
  ledR = new led(pinR);
  but = new button(pinB);
  
  init();

}

void looper_main::init(){
  
  actualState = -1;
  but->switchMode(JUST_PRESS_MODE);
  ledR->turnOff();
  ledG->turnOff();

}

void looper_main::update(){
   
   but->update();
   
   int valueRead = 0;
   
     switch(actualState){
  
       case -1:
           //init state
           valueRead = but->readButton();
           if(valueRead) sendMessage(START_REC);
           break;
       case START_REC:
           valueRead = but->readButton();
           if(valueRead) sendMessage ( STOP_REC);
  
          break;
        case STOP_REC:
           valueRead = but->readButton();
           if(valueRead == SHORT_PRESS) sendMessage ( STOP );
           if(valueRead == LONG_PRESS) sendMessageGlobal ( CLEAR_ALL );  
      
          break;
        case PLAY:
    
          break;
        case READY_TO_PLAY:
            valueRead = but->readButton();
           if(valueRead == SHORT_PRESS) sendMessage ( STOP );
           if(valueRead == LONG_PRESS) sendMessageGlobal ( CLEAR_ALL );   
          break;
        case STOP:
    
          break;
        case READY_TO_STOP:
            valueRead = but->readButton();
           if(valueRead == SHORT_PRESS) sendMessage ( PLAY );
           if(valueRead == LONG_PRESS) sendMessageGlobal ( CLEAR_ALL );
    
          break;
        case DELETE:
    
          break;
        case READY_TO_DELETE:
    
          break;
    
    
  }
   
  ledG->update();
  ledR->update();
}


void looper_main::record(){
  // the channel is not recording yet, waiting until ready_to_record
  ledR->ledBlink(200);
  ledG->stopBlink(); 
  actualState = START_REC;
 
}
void looper_main::stop_record(){
  ledR->turnOn();
  ledG->turnOn();
  actualState = STOP_REC;
  but->switchMode( LONG_PRESS_MODE );
}

void looper_main::play(){
//not playing at this point, wait unil ready_to_play
  
  ledR->turnOn();
  ledG->ledBlink();
  actualState = PLAY; 

}
void looper_main::ready_to_play(){
  ledR->turnOn();
  ledG->turnOn();
  actualState = READY_TO_PLAY;
  but->switchMode( LONG_PRESS_MODE );
  
}
void looper_main::stop(){
  // not stoping at this point, wait until ready_to_stop
  ledG->ledBlink();
  ledR->turnOn();
  actualState = STOP;

}
void looper_main::ready_to_stop(){
  ledR->turnOn();
  ledG->turnOff();
  actualState = READY_TO_STOP;
  but->switchMode( LONG_PRESS_MODE );
  
}

void looper_main::delete_loop(){
  // not deleted at this point, wait until ready_to_delete
  ledR->ledBlink(200);
  ledG->ledBlink(200);
  actualState = DELETE;

}



void looper_main::sendMessage(int msg){
  

 Serial.print(char(1 + '0'));
 Serial.print(char(msg + '0'));
 Serial.print(char(14));
  
}

void looper_main::sendMessageGlobal(int msg){
  

 Serial.print(char(0 + '0'));
 Serial.print(char(msg + '0'));
 Serial.print(char(14));
  
}

//Translate int into specific message and associated function
void looper_main::readMessage(int  msg){
 
  
  
  switch(msg){
  
    case START_REC:
      record(); 
      break;
    case STOP_REC:
      stop_record();   
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
    
  }
      
  
  
  
}
