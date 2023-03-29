#include "..\..\lib/std.mi"

Global Text debugtext;
Global Timer SongStop;
Global int i;

System.onScriptLoaded(){
    Group player = getScriptGroup();
    debugtext = player.findObject("debugtext");
    SongStop = new Timer;
    SongStop.setDelay(0);
}

System.onInfoChange(String info){
    SongStop.start();
}

SongStop.onTimer(){
    if(getPosition() >= 5000){
        System.pause();
        SongStop.stop();
    }
    debugtext.setText(integerToString(getPosition()));
}

