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
    canvas.height = 256;
    // var ctx = canvas.getContext("2d");

    src.connect(analyser);
    analyser.connect(context.destination);
    analyser.smoothingTimeConstant = 0.4;

    analyser.fftSize = 256;
    analyser.fftSize = 512;
    analyser.fftSize = 1024;
    // analyser.fftSize = 2048;
    analyser.minDecibels = -100;
    // analyser.minDecibels = -80;
    analyser.maxDecibels = 0;
    // analyser.maxDecibels = -15;

    var bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);

    var dataArray = new Uint8Array(bufferLength);
    var fdataArray = new Float32Array(bufferLength);

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

    // note that the magic value 576 is used everywhere, it's really a bar count limit
    const MAX_BARS = 576;
    // logaritmic
    const nFftFrequencies = analyser.fftSize; // 512
    const bands = 20;
    let naBarTable: number[];
    naBarTable = new Array(MAX_BARS).fill(0); // mendefinisikan array dengan ukuran MAX_BARS, diisi dengan nilai 0
    LogBarValueTable(nFftFrequencies, 44100, 16000, bands, naBarTable);
    // LogBarValueTable(MAX_BARS, 44100, 16000, bands, naBarTable);
    // LogBarValueTable(nFftFrequencies, 44100, 11025, bands, naBarTable);
    // LogBarValueTable(MAX_BARS, 44100, 16000, bands+1, naBarTable);
    // naBarTable: number[] = [3,3,3, 3,3,  4,5,6, 6,9,  14,17,21,35,42, 42,42,42, 42,  72,104,149,182,214,214,214,256,308,0,0,0,0]
    
    // const naBarTable = [2,2,2,2,3,4,5,6,9,13,18,25,35,51,72,104,149,214,308,0,0,0,0]
    // console.log('naBarTable:', JSON.stringify(naBarTable).substring(0,130));

    console.log('new formula:', bandsRange(nFftFrequencies, bands))

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
        console.log('sampleRate:', context.sampleRate, context.baseLatency)
        // const NUM_BARS = 20;
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

        function renderFrame0() {
            animProgress = requestAnimationFrame(renderFrame);
            painter.paintFrame();
        }
        function renderFrame() {
            animProgress = requestAnimationFrame(renderFrame);


            analyser.getByteFrequencyData(dataArray);
            // console.log('dataArray:', JSON.stringify(dataArray).substring(0,100));
            
            console.log('dataArray:', JSON.stringify(Array.from(dataArray)).substring(0,200));

            analyser.getFloatFrequencyData(fdataArray);
            let floats = Array.from(fdataArray);
            floats = floats.map(f => Math.floor(f))
            console.log('fdataArray:', JSON.stringify(floats).substring(0,200));
            // console.log('dataArray:', JSON.stringify(dataArray).substring(0,100));
            const fFftScale = 3.0;
            // scaleFFT(dataArray, fFftScale)

            const level: number[] = new Array(bands);

            for (let i = 0, nLow = 0; i < bands; i++) {
                let nHigh = nLow + naBarTable[i+1];
                // _ASSERT((unsigned int)nLow < nFftFrequencies);
                // _ASSERT((unsigned int)nHigh <= nFftFrequencies);
                const newlevel = AverageLevelCalcMono(nLow, nHigh, dataArray);
                nLow = nHigh;
                // volume += volume_func[newlevel];
        
                // level[i] = Math.round(newlevel / fFftScale);
                level[i] = newlevel - 35;
                // if (newlevel > (level[x] -= falloffrate)) {
                //     level[x] = newlevel;
                // }
        
                // if (!(peakchange[x]--) || peaklevel[x] <= level[x]) {
                //     peakchange[x] = peak_level_length[level[x]];
                //     if (peakchangerate) {
                //         peakreferencelevel[x] = level[x];
                //         peaklevel[x] = peak_level_lookup[level[x]][peakchange[x]];
                //     } else
                //         peakreferencelevel[x] = 0;
                // } else
                //     peaklevel[x] = peak_level_lookup[peakreferencelevel[x]][peakchange[x]];
            }
            // console.log('levele:', JSON.stringify(level).substring(0,100));

            // ctx.fillStyle = "rgba(0, 0, 255, 0.2)";
            // ctx.fillRect(0, 0, WIDTH, HEIGHT);
            ctx.clearRect(0, 0, WIDTH, HEIGHT);

            ctx.fillStyle = "#fff";

            bufferLength = 32;

            x = 0;
            const Yscale = 256 / canvas.height
            for (var i = 0; i < bands; i++) {
                // barHeight = dataArray[i] / 16;
                barHeight = level[i] / Yscale;

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


// returns the average level (mono)
function AverageLevelCalcMono(low: number, high: number, spectrumData: Uint8Array): number {
    let newlevel = 0;

    for (let i = low; i < high; i++) {
        // newlevel += spectrumDataLeft[i];
        // newlevel += spectrumDataRight[i];
        // newlevel += spectrumData[i];
        newlevel += (spectrumData[i] || 0) * 2;
    }

    // return newlevel / (/* 2 * */ (high - low));
    return Math.floor(newlevel / ( 2 * (high - low)));
}

/**
    see: https://hotmart.com/en/blog/audio-quality
    Each time the frequency doubles, that sounds like going up an octave.
    That means that: 
        the difference between 200 and 300 Hz 
            is FAR more than 
        the difference between 5000 and 5100, for example!
        
    So, when trying to analyze, you'll want to look at (probably):
          BASS   : 200 - 800 Hz range;           
          TREBLE : 1,400 - 11,025 Hz range ; , you'll want the

    If you want to get 3 bands, try it this way:
          a) 11,025 / 200 = 55.125
          b) to get the number of octaves between 200 and 11,025 Hz, solve for n:
                 2^n = 55.125
                 n = log 55.125 / log 2
                 n = 5.785
          c) so each band should represent 5.785/3 = 1.928 octaves; the ranges are:
                 1) 200 - 200*2^1.928                    or  200  - 761   Hz
                 2) 200*2^1.928 - 200*2^(1.928*2)        or  761  - 2897  Hz
                 3) 200*2^(1.928*2) - 200*2^(1.928*3)    or  2897 - 11025 Hz

 */
function bandsRange(nData:number, nBars:number): number[][] {
    const ret: number[][] = Array.from({ length: nBars }, () => new Array(2));
    const a = 16000 / 200;
    const n = a / nBars +1;
    const b = Math.log(n) / Math.log(2)
    let z = a
    console.log(`a:${a} n=${n} b:${b}`)
    for (let i = 0; i < ret.length; i++) {
        const start = 2**(i) 
        const end   = 2**( b* i)
        
        // const bar = ret[i]; 
        ret[i] = [start, end]        
    }

    return ret;
}

// calculate number of bins to assign, will be at least 1
// nNotAssigned - count of bins not yet assigned
// fDiv - divisor
function AssignCount(nNotAssigned: number, fDiv: number): number {
    let nAssign = Math.floor(nNotAssigned - nNotAssigned / fDiv + 0.5);
    if (nAssign <= 0) {
        nAssign = 1;
    }
    return nAssign;
}

// make logarithmic table, or real close to it
// nFftSize - number of elements in frequency data
// nSampleRate - sample rate
// nLastBarCutHz - cut off frequency for last bar
// nBars - number of bars
// pnBarTable - bars array, each element will have a count of the number of FFT elements to use
function LogBarValueTable(nFftSize: number, nSampleRate: number, nLastBarCutHz: number, nBars: number, pnBarTable: number[]) {
    // pre-assign each bar to draw with at least 1 element from the spec data
    for (var i = 0; i < nBars; i++)
    {
        pnBarTable[i] = 1;
    }

    // assigned 1 to each bar
    let nNotAssigned = nFftSize - nBars;
    // start with last bar
    let nLastAssign = nBars - 1;

    // now assign the rest of the spec data bars to the bars to draw
    // don't ask how I came up with this Div formula cuz it was trial & error till
    // something looked good.

    // now assign the rest of the spec data bars to the bars to draw
    // get the <number of spectrum bars> root of the remaining bins to assign
    let fDiv = Math.pow(nNotAssigned, 1.0 / nBars);

    if (nLastBarCutHz > nSampleRate / 10000) {
        // make last bar cut off at no higher than 16000Hz since not much happens there anyway
        let nHalfSample = nSampleRate / 2;
        if (nHalfSample > nLastBarCutHz) {
            let fHighBinDiv = nHalfSample / (nHalfSample - nLastBarCutHz);	// number of bins for 16000+ range
            // if last bar will start at a frequency higher than 16000
            if (1 + nNotAssigned - nNotAssigned / fDiv < nFftSize / fHighBinDiv) {
                // make last bar cover 16000+
                pnBarTable[nBars - 1] = Math.floor(nFftSize / fHighBinDiv);
                // not assigned is now nBars less 1 minus the number just assigned
                nNotAssigned = nFftSize - (nBars - 1);
                nNotAssigned -= pnBarTable[nBars - 1];
                // last bar is done, start with second last
                nLastAssign = nBars - 2;
            }
        }
    }

    // assign bars from high to low frequencies
    while (nNotAssigned > 0) {
        // get starting bin count to assign
        let nAssign = AssignCount(nNotAssigned, fDiv);
        // iterate bars from high (right) to low (left)
        for (var nW = nLastAssign; nW >= 0 && nNotAssigned > 0; nW--) {
            // assign the bins to a bar
            pnBarTable[nW] += nAssign;
            // update not assigned count
            nNotAssigned -= nAssign;
            //if(nNotAssigned > (int)fDiv)
            //	nAssign = nNotAssigned / fDiv;
            //else
            //	nAssign = 1;
            // get new bin count to assign
            nAssign = AssignCount(nNotAssigned, fDiv);
        }
    }
}
function scaleFFT(dataArray: Uint8Array, fDiv: number) {
    for (let i = 0; i < dataArray.length; i++) {
        dataArray[i] = Math.floor(dataArray[i] / fDiv);
    }
}

