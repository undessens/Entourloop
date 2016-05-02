#include "Arduino.h"

class led{

public:
  int numPin;
  boolean currentState;
  unsigned long previous_change;
  int blink_period;
  boolean is_blinking;

  led(int numPin);
  void init();
  void changeState(boolean);
  void turnOn();
  void turnOff();
  void update();
 
  void ledBlink(int );
  void updateBlink();
  void stopBlink();
  //TODO blink Once
  
  

};

led::led(int _numPin){
  
  numPin = _numPin;
  pinMode(numPin, OUTPUT);
  init();

}

void led::init(){
   
  currentState = false;
  // blink periiod in ms 
  blink_period = 500;
  is_blinking = false;
  
}

void led::changeState(boolean newState){
  
   digitalWrite(numPin, newState);
   currentState = newState;
}

void led::update(){
 //Here is the most important function, called every frame
  if(is_blinking){
    updateBlink();
  } 
  
}

void led::ledBlink(int new_blink_period= 500){
  
  //new blink period is optionnal, if you want to change the speed
  blink_period = new_blink_period;
  is_blinking = true;
  previous_change = millis();
  //Here is the way to invert led state
  changeState(!currentState);
  
}

void led::updateBlink(){
 
 if(millis()-previous_change > blink_period){
  changeState(!currentState);
  previous_change=millis();
 } 
 // else : do nothing
  
}

void led::stopBlink(){
 
 is_blinking = false;
 // Turn off the light
 changeState(false); 
  
}

void led::turnOn(){
 is_blinking = false;
 digitalWrite(numPin, HIGH);
 currentState = true;
 
}

void led::turnOff(){
 is_blinking = false;
 digitalWrite(numPin, LOW);
 currentState = false;
 
}



