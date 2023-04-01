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
// Global Slider seekSlider;

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
    System.seekTo(integer(getPosition() / 1000) * 1000 - 200);
    tailTimer.start();
}

tailTimer.onTimer(){
    // positionText.setText(integerToString(getPosition()));
    System.pause();
    tailTimer.stop();
    System.seekTo(integer(getPosition() / 1000) * 1000);

}

posTimer.onTimer(){
    positionText.setText(integerToString(getPosition())) ;
}