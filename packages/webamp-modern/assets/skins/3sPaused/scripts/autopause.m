/**
    Author: Fathony aka x2nie
    ver 1.0 2023-03-31
*/
#include <lib/std.mi>

Global Timer mainTimer;

System.onScriptLoaded() {
  mainTimer = new Timer;
  mainTimer.setDelay(3000);
  mainTimer.stop();
}

System.onScriptUnloading() {
    // mainTimer.stop();
	delete mainTimer;
}


System.onPlay(){
  mainTimer.start();
}

System.onResume(){
  mainTimer.start();
}

mainTimer.onTimer(){
    mainTimer.stop();
    System.pause();
}