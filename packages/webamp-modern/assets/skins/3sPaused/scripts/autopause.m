/**
    Author: Fathony aka x2nie
    ver 1.0 2023-03-31
*/
#include <lib/std.mi>
#include <lib/application.mi>

Global Timer mainTimer;
Global Timer posTimer;
Global Text positionText;

System.onScriptLoaded() {
  Group player = getScriptGroup();

  Text appTitleText;
  appTitleText = player.findObject("apptitle");
  appTitleText.setText(Application.GetApplicationName());

  positionText = player.findObject("position");
  posTimer = new Timer;
  posTimer.setDelay(250);
  posTimer.start();

  mainTimer = new Timer;
  mainTimer.setDelay(3000);
  //mainTimer.stop();
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
    System.pause();
    mainTimer.stop();
}

posTimer.onTimer(){
    positionText.setText(integerToString(getPosition()));
}