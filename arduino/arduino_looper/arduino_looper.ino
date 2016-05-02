
#include "led.h"
#include "button.h"
#include "looper_slave.h"

looper_slave *channel1,*channel2,*channel3,*channel4;

//---------------------------------------------
void setup(){
  
  channel1 = new looper_slave(1, A4, A5, A0 );
  channel2 = new looper_slave(2, 3, 4, 5 );
  channel3 = new looper_slave(3, 3, 4, 5 );
  channel4 = new looper_slave(4, 3, 4, 5 );
  Serial.begin(57600);
  // Set value used in Serial.readString() or Serial.readStringUntil('\n');
  Serial.setTimeout(20);
  
}

//----------------------------------------------
void loop(){
  
  //Update part
  channel1->update();
  //channel2->update();
  //channel3->update();
  //channel4->update();
  
  //Serial reading part
  if(Serial.available()>0){
   String msg = Serial.readStringUntil(13); 
   int channel =int( msg.charAt(0) - '0');
   // substring a 2, because the first is the channel
   // and the second is a space from puredata
   Serial.print("main msg :-");
  Serial.print(msg);
  Serial.println("-");
   
   String m = msg.substring(2);
   
   
   switch(channel){
     case 0:
      //this is the number according to general settings
        readMessage(m);
      break;
     case 1:
       
       channel1->readMessage(m);
        break; 
    case 2: 
       channel2->readMessage(m);
        break;
    case 3: 
       channel3->readMessage(m);
        break; 
    case 4: 
       channel4->readMessage(m);
        break; 
     
   }
    
  }
  
}

void readMessage(String m){
 
 //probably have to convert String into char* 
  
  
}
