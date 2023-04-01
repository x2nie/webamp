/**
    Author: Fathony aka x2nie
    ver 1.0 2023-03-31
*/
#include <lib/std.mi>
#include <lib/application.mi>

Global Timer mainTimer; // pause on around 3000mx
Global Timer tailTimer; //  to pump audio data at last 100ms
Global Timer posTimer;  // show real position of audio
Global Text positionText;
Global Text positionText2;
// Global Slider seekSlider;

Function Int round1000(int i);

System.onScriptLoaded() {
  Group player = getScriptGroup();

  // seekSlider = player.findObject("player.slider.seek");

  Text appTitleText;
  appTitleText = player.findObject("apptitle");
  appTitleText.setText(Application.GetApplicationName());


  Vis playerVis;
  playerVis = player.findObject("vis");
  playerVis.setRealtime(1);

  positionText = player.findObject("position");
  positionText2 = player.findObject("position2");

  posTimer = new Timer;
  posTimer.setDelay(250);
  posTimer.start();

  mainTimer = new Timer;
  mainTimer.setDelay(3000);
  //mainTimer.stop();

  tailTimer = new Timer;
  tailTimer.setDelay(200);
}

System.onScriptUnloading() {
    // mainTimer.stop();
	delete mainTimer;
	delete posTimer;
}


System.onPlay(){
  mainTimer.start();
}

System.onResume(){
  mainTimer.start();
}

mainTimer.onTimer(){
    // System.pause();
    mainTimer.stop();
    // seekSlider.setPosition(integerToString(getPosition()))
    System.seekTo(round1000(getPosition()) - 200);
    tailTimer.start();
}

tailTimer.onTimer(){
    // positionText.setText(integerToString(getPosition()));
    System.pause();
    tailTimer.stop();
    positionText2.setText(integerToString(getPosition())) ;
    System.seekTo(round1000(getPosition()));

}

posTimer.onTimer(){
    positionText.setText(integerToString(getPosition()));
}

Int round1000(int i){
  Float s = i / 1000;
  Int ret = integer(s);

  if (frac(s) > 0.5) {
    ret += 1;
  }

  return ret * 1000;
}