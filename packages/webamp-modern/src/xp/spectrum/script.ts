import {
    Vis as IVis,
    VisPaintHandler,
    BarPaintHandler,
    WavePaintHandler,
    NoVisualizerHandler,
    FakeBarPaintHandler,
} from "../../skin/makiClasses/VisPainter";

import { SpectrumPaintHandler } from "../../skin/makiClasses/VisSatan";

// taken from: https://codepen.io/nfj525/pen/rVBaab
window.onload = function () {

    const inputs = document.querySelectorAll('input[type=radio]');
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener("click",
            function (e) {
                // console.log('click', this.attributes.name)
                rebuildVis(this.attributes.name.value, this.value)
            }
        )
    }

    var file = document.getElementById("thefile") as HTMLInputElement;
    var audio1 = document.getElementById("audio") as HTMLMediaElement;
    var preview = document.getElementById("preview");

    var context = new AudioContext();
    var src = context.createMediaElementSource(audio1);
    var analyser = context.createAnalyser();

    // var coloring = document.querySelector('input[name=coloring]:checked').value;
    // console.log('coloring:', coloring)

    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    canvas.width = 76;
    canvas.height = 16;
    // var ctx = canvas.getContext("2d");

    src.connect(analyser);
    analyser.connect(context.destination);
    analyser.smoothingTimeConstant = 0.9;

    analyser.fftSize = 256;
    analyser.fftSize = 512;

    var bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);

    var dataArray = new Uint8Array(bufferLength);

    const buttons = document.querySelectorAll('button');
    for (const btn of buttons) {
        btn.onclick = function (e) {
            preview.style.backgroundImage = `url(preview/${this.attributes.media.value}.png)`;
            audio1.src = `/assets/audio/check-sound/${this.attributes.media.value}.wav`;
            audio1.play();
        }
    };

    file.onchange = function () {
        var files = this.files;
        audio1.src = URL.createObjectURL(files[0]);
        audio1.load();
        audio1.play();
    }

    //? PAINTER ===============================

    const vis: IVis = {
        canvas,
        colors: new Array<string>(24).fill('rgb(255,255,255)'),
        analyser,
        oscStyle: "lines",
        bandwidth: "wide",
        coloring: "normal",
        peaks: true,
    }
    // let painter = new FakeBarPaintHandler(vis);
    let painter: VisPaintHandler
    rebuildVis('skin','classic');

    //? CONFIG ===============================

    function rebuildVis(attr: string, value: string) {
        console.log(attr, value);
        vis[attr] = value;

        const mode = document.querySelector('input[name=mode]:checked') as HTMLInputElement;
        if (mode.value === "spectrum") {
            // painter = new FakeBarPaintHandler(vis);
            // painter = new BarPaintHandler(vis);
            painter = new SpectrumPaintHandler(vis);
        } else {
            painter = new WavePaintHandler(vis);
        }
        painter.prepare();
    }

    var animProgress = 0;
    audio1.onplay = function (e) {
        const NUM_BARS = 20;
        var logged = false;
        //   setTimeout(() => {
        //     console.log(dataArray)
        //   }, 100);
        var ctx = canvas.getContext("2d");

        var WIDTH = canvas.width;
        var HEIGHT = canvas.height;

        var barWidth = 3;
        var barHeight;
        var x = 0;

        function renderFrame() {
            animProgress = requestAnimationFrame(renderFrame);
            painter.paintFrame();
        }
        function renderFrame0() {
            animProgress = requestAnimationFrame(renderFrame);


            analyser.getByteFrequencyData(dataArray);

            ctx.fillStyle = "rgba(0, 0, 255, 0.2)";
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            ctx.fillStyle = "#fff";

            bufferLength = 32;

            x = 0;
            for (var i = 0; i < NUM_BARS; i++) {
                barHeight = dataArray[i] / 16;

                ctx.fillRect(
                    x, HEIGHT - barHeight,
                    barWidth, barHeight);

                x += barWidth + 1;
            }
        }

        if (animProgress != 0) {
            cancelAnimationFrame(animProgress); // stop old loop
        }
        // audio1.play();
        renderFrame();
    };

    audio1.onpause = function (e) {
        if (animProgress != 0) {
            cancelAnimationFrame(animProgress); // stop old loop
        }

    }
};