#include <lib/std.mi>

Global Text debugtext;
Global Timer SongStop;
Global int i;

System.onScriptLoaded(){
    Group player = getScriptGroup();
    debugtext = player.findObject("debugtext");
    SongStop = new Timer;
    SongStop.setDelay(100);
}

// System.onInfoChange(String info){
System.onPlay(){
    SongStop.start();
}
System.onResume(){
    SongStop.start();
}

SongStop.onTimer(){
    // if(getPosition() >= 5000){
        SongStop.stop();
        System.pause();
    // }
    debugtext.setText(integerToString(getPosition()));
}

