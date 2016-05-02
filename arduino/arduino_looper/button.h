

class button{

public:
  int numPin;
  boolean currentState;
  boolean justPressed;
  boolean shortPressed;
  boolean longPressed;
  unsigned long previous_change;
  int longPressTime;

  button(int numPin);
  void init();
  void update();
  boolean readJustPressed();
  boolean readShortPressed();
  boolean readLongPressed();

};

button::button(int _numPin){
  numPin = _numPin;
  pinMode( numPin ,INPUT_PULLUP );
  
  //constant to set the duration (ms) to consider 'long press'
  longPressTime = 2500;
  
  init();
  
}

void button::init(){
 
 justPressed = false;
 shortPressed = false;
 longPressed= false;
 previous_change = millis();
 currentState=!digitalRead(numPin);
  
}

void button::update(){
 
 //Invert digitalRead, because pull_up mode force HIGH when button is not pressed
  boolean newCurrentState = !digitalRead(numPin);
  int previous_change_duration = millis() -previous_change ;
  int avoid_repet = 30;
 
 if(newCurrentState && !currentState && previous_change_duration > avoid_repet){
 // button just become pressed
    justPressed = true;
    currentState = true;
    previous_change = millis();
 }
 if(newCurrentState && currentState && previous_change_duration > avoid_repet*100 ){
    //keep pressing
    //A long press is "activated" before release of the pressing
    // in order to make the user "aware" that's the operation succeded.
    // Once leds are blinking, the user know he can release the foot.
   if(millis() - previous_change > longPressTime ){
      longPressed = true;
      previous_change = millis();
   } 
 }
  if(!newCurrentState && currentState && previous_change_duration > avoid_repet){
    //from Pressed to released
    if(millis() - previous_change <= longPressTime){
       shortPressed = true;
       previous_change = millis();
    }else{
       //End of a long press
       // init() is supposed to have been already called . By security, call it again
       init();
       
    }
   
 }
   //update current state
   currentState = newCurrentState;
  
}

boolean button::readJustPressed(){
  
  boolean ret = justPressed;
  if(justPressed){
   //clear value once it is read
    init();
  }
 return ret; 
}

boolean button::readShortPressed(){
  
  boolean ret = shortPressed;
  if(shortPressed){
   //clear value once it is read
    init();
  }
 return ret; 
}

boolean button::readLongPressed(){
  
  boolean ret = longPressed;
  if(longPressed){
   //clear value once it is read
    init();
  }

 return ret; 
}
