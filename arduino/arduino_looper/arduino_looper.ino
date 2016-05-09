//looper slave define
#define START_REC 0
#define READY_TO_RECORD 1
#define STOP_REC 2
#define READY_TO_STOP_RECORD 3
#define PLAY 4
#define READY_TO_PLAY 5
#define STOP 6
#define READY_TO_STOP 7
#define DELETE 8
#define READY_TO_DELETE 9

//General settings define
#define CLEAR_ALL 0
#define TEMPO 1
#define TEMPOBAR 2
#define TEMPO_FIXED 3

// button define
#define LONG_PRESS 2
#define SHORT_PRESS 1
#define JUST_PRESS_MODE 1
#define LONG_PRESS_MODE 2


#include "led.h"
#include "button.h"
#include "looper_slave.h"
#include "looper_main.h"


looper_main *channel1;
looper_slave *channel2,*channel3,*channel4;

//---------------------------------------------
void setup(){
  
  channel1 = new looper_main(13, 12, 11 );
  channel2 = new looper_slave(2, 10, 9, 8 );
  channel3 = new looper_slave(3, 6, 7, 5 );
  channel4 = new looper_slave(4, 3, 4, 2 );
  Serial.begin(57600);
  Serial.setTimeout(20);
  delay(20);

}

//----------------------------------------------
void loop(){
  
  //Update part
  channel1->update();
  channel2->update();
  channel3->update();
  channel4->update();
  
  //Serial reading part
  if(Serial.available()>2){
    
    int channel = Serial.read() - '0';
    int msg = Serial.read() - '0';
    char end_of_line = Serial.read();
    
    if(end_of_line == 13 ){
      
         switch(channel){
             case 0:
              //this is the number according to general settings
                readMessage(msg);
              break;
             case 1:
               channel1->readMessage(msg);
                break; 
            case 2: 
               channel2->readMessage(msg);
                break;
            case 3: 
               channel3->readMessage(msg);
                break; 
            case 4: 
               channel4->readMessage(msg);
                break; 
             
             }

      
       
    }
   
   

    
  }
  //TODO ELSE
  //if there is Serial.available>0 && Serial.available=<2
  // Some bytes get lost, and we should delete them
  
  
  
  //Make arduino little bit slower
  //reduce button shake most of all
  delay(10);
}

void readMessage(int m){
 
 switch (m){
  
  case CLEAR_ALL:
  channel1->init();
  channel2->set_tempo_fixed(false);
  channel2->init();
  channel2->set_tempo_fixed(false);
  channel3->init();
  channel3->set_tempo_fixed(false);
  channel4->init();
  channel4->set_tempo_fixed(false);
   break; 
   case TEMPO_FIXED:
  channel2->set_tempo_fixed(true);
  channel3->set_tempo_fixed(true);
  channel4->set_tempo_fixed(true);
   break;
 }
  
  
}
