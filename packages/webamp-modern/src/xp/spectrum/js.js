// taken from: https://codepen.io/nfj525/pen/rVBaab
window.onload = function() {
  
    var file = document.getElementById("thefile");
    var audio = document.getElementById("audio");
    var preview = document.getElementById("preview");

    var context = new AudioContext();
    var src = context.createMediaElementSource(audio);
    var analyser = context.createAnalyser();

    var canvas = document.getElementById("canvas");
    canvas.width = 72;
    canvas.height = 16;
    // var ctx = canvas.getContext("2d");

    src.connect(analyser);
    analyser.connect(context.destination);

    analyser.fftSize = 256;

    var bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);

    var dataArray = new Uint8Array(bufferLength);

    const buttons = document.getElementsByTagName('button');
    // buttons.onclick = (e) => console.log('btn click!');
    // console.log(buttons)
    for(const btn of buttons) {
      btn.onclick = function(e){
        // console.log('btn click', this)
        // audio.stop();
        preview.style.backgroundImage = `url(preview/${this.attributes.media.value}.png)`;
        audio.src = `/assets/audio/check-sound/${this.attributes.media.value}.wav`;
        audio.play();
      }
    };
    
    file.onchange = function() {
      var files = this.files;
      audio.src = URL.createObjectURL(files[0]);
      audio.load();
      audio.play();
    }

    audio.onplay = function (e) {
      // var context = new AudioContext();
      // var src = context.createMediaElementSource(audio);
      // var analyser = context.createAnalyser();
  
      // var canvas = document.getElementById("canvas");
      // canvas.width = window.innerWidth;
      // canvas.height = window.innerHeight;
      var ctx = canvas.getContext("2d");
  
      // src.connect(analyser);
      // analyser.connect(context.destination);
  
      // analyser.fftSize = 256;
  
      // var bufferLength = analyser.frequencyBinCount;
      // console.log(bufferLength);
  
      // var dataArray = new Uint8Array(bufferLength);
  
      var WIDTH = canvas.width;
      var HEIGHT = canvas.height;
  
      var barWidth = (WIDTH / bufferLength) * 2.5;
      var barHeight;
      var x = 0;
  
      function renderFrame() {
        requestAnimationFrame(renderFrame);
  
        
        analyser.getByteFrequencyData(dataArray);
  
        ctx.fillStyle = "rgba(0, 0, 255, 0.2)";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        
        ctx.fillStyle = "#fff";
        
        bufferLength = 32;
        
        x = 0;
        for (var i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i] / 16;
          
          ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
  
          x += barWidth + 1;
        }
      }
  
      // audio.play();
      renderFrame();
    };
  };