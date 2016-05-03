

class button{

public:
  int numPin;
  boolean isPressed;
  boolean previousState;
  boolean currentState;
  unsigned long timePressed;
  int longPressTime;
  int shortPressTime;

  button(int numPin);
  void init();
  void update();
  int readButton();
  
  //Mode : look for press / look for release ( long press or short press )
  int currentMode;
  void switchMode ( int newMode );
  

};

button::button(int _numPin){
  numPin = _numPin;
  pinMode( numPin ,INPUT_PULLUP );
  
  //constant to set the duration (ms) to consider 'long press'
  longPressTime = 2500;
  shortPressTime = 50;
  currentMode = JUST_PRESS_MODE;
  
  init();
  
}

void button::init(){
 
 isPressed = false;
 timePressed = millis();
 previousState=!digitalRead(numPin);
 currentState = previousState;
  
}

void button::update(){
 
   // Only update currentState & previousState
   previousState = currentState;  
   currentState = !digitalRead(numPin);
  
}

int button::readButton(){
  
  int ret = 0;

  if( !isPressed ){
   
     if( !previousState && currentState  ){
       isPressed = true;
       timePressed = millis();
     } 
    
  }
  
  //Mode looking for the pressing, from Up to low
  if(currentMode == JUST_PRESS_MODE ){
   
    if(isPressed) ret = 1;
    isPressed = false; 
    
  }
  //Mode looking for longPress / shortPress, from low to up
  else{
    
    if(isPressed && (!currentState && previousState) ){
      
       if(millis()-timePressed >  longPressTime){
           //User is pressing for a long time       
          ret = LONG_PRESS;
          isPressed = false;
         
       }
       else if( (millis()- timePressed) <longPressTime && (millis() -timePressed) > shortPressTime){
          // if not, look for a release of pressing
             //release is found, this is a short Press 
             ret = SHORT_PRESS;
             isPressed = false;
         
       }
       else{
         // Probably a mistake, need to re-push again
         isPressed = false;
       }
      
    }
    
  }
  
 return ret; 
}

void button::switchMode( int newMode){
  
  init();
  
  if(newMode == JUST_PRESS_MODE || newMode == LONG_PRESS_MODE ){
   
     currentMode = newMode; 
    
  }
  
  
}

