// taken from Vis_Satan.cpp

import { FFT } from "./VisFFT";
import { VisPaintHandler } from "./VisPainter";

export class SpectrumPaintHandler extends VisPaintHandler {
    _analyser: AnalyserNode;
    _dataArray: Uint8Array;
    _dataFloatArray: Float32Array;

    prepare() {
        this._analyser = this._vis.analyser!;
        const bufferLength = this._analyser.fftSize;
        // this._octaveBuckets = octaveBucketsForBufferLength(this._bufferLength);
        this._dataArray = new Uint8Array(bufferLength);
        this._dataFloatArray = new Float32Array(bufferLength);
    }

    paintFrame() {
        if (!this._ctx) return;
        this._vis.analyser.getByteTimeDomainData(this._dataArray);
        const levels = AtAnStDirectRender(this._dataArray);
        //   this._vis.analyser.getFloatTimeDomainData(this._dataFloatArray);
        //   const levels = AtAnStDirectRender(this._dataFloatArray);
        console.log(JSON.stringify(levels).substring(0,100))

        const ctx = this._ctx;
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        ctx.clearRect(0, 0, width, height);


        this.RenderWideBars();
        return;
        ctx.lineWidth = 5;
        for (let i = 0; i < 30; i += 1) {
            const r = Math.floor(Math.random() * 255);
            const g = Math.floor(Math.random() * 255);
            const b = Math.floor(Math.random() * 255);

            ctx.beginPath();
            ctx.moveTo(Math.random() * width, Math.random() * height);
            ctx.lineTo(Math.random() * width, Math.random() * height);
            ctx.strokeStyle = `rgba(${r},${g},${b},1)`;
            ctx.stroke();
        }
    }

    RenderWideBars() {
        //static int trippycolourbase = 0, trippycolour;
        //   COLORREF copycolour;
        //trippycolour = trippycolourbase;

        this._ctx.fillStyle = '#fff';

        y_spacing = 1;
        let draw_height = 16;
	    let level_height_scaler = (255.0 / draw_height); // scale level height to the draw height
        let image_width = 76;

        for (var i = 0; i < bands; i++) {
            var x = i * total_width;
            var x_stop = i * total_width + band_width;
            for (var y = 0; y < (level[i] / level_height_scaler); y += y_spacing) {
                //   _ASSERT(y < 255);
                //   copycolour = FreqBarColour[colour_lookup[level[i]][y]];
                var temp = y * image_width;
                // for (var tx = x; tx < x_stop; tx++){

                    // rgbbuffer[temp + tx] = copycolour;
                // }
            }
            this._ctx.fillRect(
                x, level[i] / level_height_scaler * draw_height, 
                band_width, 1)
            //trippycolour = (trippycolour + (576 / bands)) % 576;


            // if(peaklevel[i]) {
            //   copycolour = PeakColour[peak_lookup[peakreferencelevel[i]][peakchange[i]]];
            //   int temp = (int)(peaklevel[i] / draw_height_scaler / y_spacing) * y_spacing * image_width;
            //   do{
            //     rgbbuffer[temp + x] = copycolour;
            //   }while(++x < x_stop);
            // }
        }

        //++trippycolourbase %= 576;
    }
}

// note that the magic value 576 is used everywhere, it's really a bar count limit
const MAX_BARS = 576;
const bands = 19;   // at bandwidth = wide
const mono = true;
// let band_width = 3
// let x_spacing = 1;
// let total_width = band_width + x_spacing;  // this is commonly used

// analyzer
let falloffrate = 12;
let peakchangerate = 80;
let requested_band_width = 3, x_spacing = 1, y_spacing = 2;
let band_width = requested_band_width;  // bar width
let total_width = band_width + x_spacing;  // this is commonly used

// let levelbase = LEVEL_AVERAGE;
let reverseleft = true, reverseright = false;

// flash function
let volume_func = new Array(256).fill(0);

// style
let backgrounddraw = 0, barcolourstyle = 0, peakcolourstyle = 0,
    effect = 0, peakleveleffect = 0, peakfalloffmode = 0;

let peakchange = new Array(576 * 2).fill(0);
//* short int peakreferencelevel[576 * 2] = {0};
let peakreferencelevel = new Array(576 * 2).fill(0);

//* int peaklevelbuffer[3][576 * 2] = {0};
// Mendeklarasikan dan menginisialisasi array dua dimensi peaklevelbuffer dengan tipe data number dan ukuran 3x1152
const peaklevelbuffer: number[][] = Array.from({ length: 3 }, () => new Array(576 * 2).fill(0));

//* int *peaklevel = peaklevelbuffer[0];
// Mendeklarasikan pointer peaklevel yang menunjuk ke elemen pertama dari peaklevelbuffer
const peaklevel: number[] = peaklevelbuffer[0];

const peak_lookup: number[] = new Array(256).fill(0)
// Mendeklarasikan dan menginisialisasi array dua dimensi peak_level_lookup dengan tipe data number dan ukuran 256x256
const peak_level_lookup: number[][] = Array.from({ length: 256 }, () => new Array(256).fill(0));
let peak_level_length = new Array(256).fill(0);

function PeakLevelNormal() {
    for (var level = 1; level < 256; level++) {
        peak_level_length[level] = peakchangerate;
        for (var i = 0; i <= peakchangerate; i++)
            peak_level_lookup[level][i] = level;
    }
}
PeakLevelNormal();

function UpdatePeakColourLookup() {
    if (peakchangerate) {
        // PeakLevelEffect();  // calculate Peak leveling effect table


        // calculate the colour lookup table for the peaks
        if (peak_lookup[1])  // check to make sure memory is allocated
            for (var i = 1; i < 256; i++)
                for (var y = 0; y <= peak_level_length[i]; y++)
                    peak_lookup[i][y] = /* PeakColourScheme */(peak_level_lookup[i][y], Math.floor(y * 255.0 / peak_level_length[i]));
    }

    // calculate the colour lookup table for the peaks
    //if(peak_lookup[1])  // check to make sure memory is allocated
    //  for(int i = 1; i < 256; i++)
    //    //for(int y = 0; y < (int)(i / (255.0f / draw_height)); y += y_spacing)
    //    for(int y = 0; y <= peakchangerate; y++)
    //      peak_lookup[i][y] = PeakColourScheme(i, (int)(y * peak_fade_scaler));

}
UpdatePeakColourLookup()

// FFT
let m_fft: FFT = new FFT();
let nFftFrequencies = 0;
// unsigned char *caSpectrumData[2] = {0};
// unsigned int naBarTable[MAX_BARS] = {0};
// let caSpectrumData: Array<Uint8Array> = [null, null]; // mendefinisikan array dengan 2 elemen yang masing-masing elemennya adalah null, tipe data Uint8Array
let caSpectrumData: Uint8Array; // mendefinisikan array dengan 2 elemen yang masing-masing elemennya adalah null, tipe data Uint8Array
let naBarTable: number[] = new Array(MAX_BARS).fill(0); // mendefinisikan array dengan ukuran MAX_BARS, diisi dengan nilai 0
let bFftEqualize = true;
let fFftEnvelope = 0.2;
let fFftScale = 2.0;


// int levelbuffer[3][576 * 2] = {0};
// Mendeklarasikan dan menginisialisasi array dua dimensi levelbuffer dengan tipe data number dan ukuran 3x1152
const levelbuffer: number[][] = Array.from({ length: 3 }, () => new Array(576 * 2).fill(0));

// int *level = levelbuffer[0];
// Mendeklarasikan pointer level yang menunjuk ke elemen pertama dari levelbuffer
const level: number[] = levelbuffer[0];

// various default settings
function DefaultSettings() {
    // profile name
    // wcsncpy(szCurrentProfile, cszDefaultSettingsName, ARRAYSIZE(szCurrentProfile));

    // set colours
    // for(var i = 0; i < 256; i++) {
    // 	FreqBarColour[i] = bmpRGB(204 + i/5, i, 0);
    // 	VolumeColour[i] = bmpRGB(i/1.8, i/1.6, i/1.45);
    // 	if(i < 128)
    // 		PeakColour[i] = bmpRGB(92 + (int)(i * 1.2835), i * 2, i * 2);
    // 	else
    // 		PeakColour[i] = bmpRGB(255,255,255);
    // }

    // set up level functions... er lookup tables
    for (var i = 0; i < 256; i++) {
        //level_func[i] = (int)(log10(1.0 + (double)i / 28.3334) * 256.0); // log base 10
        volume_func[i] = 256 - 256 / (i + 1);  // 1/x function
    }

    falloffrate = 12; // falloff rate for frequency level bars
    peakchangerate = 80;  // changerate for peak level indicators val 1 to 255
    requested_band_width = 3; // thickness of bands in pixels
    x_spacing = 1;    // spacing between bands in pixels, lowest val = 0
    y_spacing = 2;  // lowest value = 1
    reverseleft = true;
    reverseright = false;
    // mono = true;
    // backgrounddraw = BACKGROUND_BLACK;
    // barcolourstyle = BAR_FIRE;
    // peakcolourstyle = PEAK_FADE;
    // effect = EFFECT_FADESHADOW;
    // peakleveleffect = PEAK_EFFECT_FALL;
    peakfalloffmode = 0;
    // levelbase = LEVEL_AVERAGE;
    bFftEqualize = true;
    fFftEnvelope = 0.2;
    fFftScale = 3.0;
}
DefaultSettings();

function FFTInit(nNewFft: number) {
    if (nNewFft > 0 && nNewFft != nFftFrequencies) {
        nFftFrequencies = nNewFft;
        // caSpectrumData[0] = null;
        // caSpectrumData[1] = null;
        // caSpectrumData[0] = new unsigned char[nFftFrequencies];
        // caSpectrumData[1] = new unsigned char[nFftFrequencies];
        // caSpectrumData[0] = new Uint8Array(nFftFrequencies);
        // caSpectrumData[1] = new Uint8Array(nFftFrequencies);
        caSpectrumData = new Uint8Array(nFftFrequencies);
    }
    m_fft.Init(576, nFftFrequencies, bFftEqualize ? 1 : 0, fFftEnvelope);
}

function CalculateFFTVariables() {
    const bar_usage = mono ? bands : (bands + 1) / 2;
    let nNewFft = 512;
    while (nNewFft < 0x10000 && bar_usage > nNewFft / 2) {
        nNewFft = nNewFft << 1;
    }

    // always re-init FFT since profile settings may have changed
    FFTInit(nNewFft);

    if (!mono) {
        // TODO: sample rate should update for each song change
        // LogBarValueTable(nFftFrequencies, 44100, 16000, bands / 2, naBarTable);
        // LogBarValueTable(nFftFrequencies, 44100, 16000, bands - (bands / 2), &naBarTable[bands / 2]);
    } else
        LogBarValueTable(nFftFrequencies, 44100, 16000, bands, naBarTable);

    // #ifdef _DEBUG
    // 	if(!mono) {
    // 		unsigned int nBinCount = 0;
    // 		for(int i = 0; i < bands / 2; i++)
    // 			nBinCount += naBarTable[i];
    // 		_ASSERT(nBinCount == nFftFrequencies);
    // 		nBinCount = 0;
    // 		for(int i = bands / 2; i < bands; i++)
    // 			nBinCount += naBarTable[i];
    // 		_ASSERT(nBinCount == nFftFrequencies);
    // 	} else {
    // 		unsigned int nBinCount = 0;
    // 		for(int i = 0; i < bands; i++)
    // 			nBinCount += naBarTable[i];
    // 		_ASSERT(nBinCount == nFftFrequencies);
    // 	}
    // #endif
}
CalculateFFTVariables()

// returns the average level (mono)
function AverageLevelCalcMono(low: number, high: number, spectrumData: Uint8Array): number {
    let newlevel = 0;

    for (let i = low; i < high; i++) {
        // newlevel += spectrumDataLeft[i];
        // newlevel += spectrumDataRight[i];
        newlevel += spectrumData[i];
    }

    return newlevel / (/* 2 * */ (high - low));
}

function FFTAnalyze(waveformData: Uint8Array) {
    // we get 576 samples in from winamp.
    // the output of the fft has 'num_frequencies' samples,
    //   and represents the frequency range 0 hz - 22,050 hz.

    // for(var c = 0; c < this_mod.waveformNch; c++) {
    let fWaveform = new Array(576);

    for (var i = 0; i < 576; i++)
        fWaveform[i] = ((waveformData[i] ^ 128) - 128);

    // float *fSpectrum = (float *)_alloca(sizeof(float) * nFftFrequencies);
    let fSpectrum = new Array(nFftFrequencies).fill(0)
    m_fft.time_to_frequency_domain(fWaveform, fSpectrum);
    for (var i = 0; i < nFftFrequencies; i++) {
        let h = (fSpectrum[i] / fFftScale);
        if (h > 255.0) {
            h = 255;
        }
        caSpectrumData[i] = Math.round(h);
    }
    // }
}

//? fast rendering of DIBbits (stereo)
function AtAnStDirectRender(waveformData: Uint8Array): number[] {
    FFTAnalyze(waveformData);
    let volume = 0;

    // if(!mono){} else {
    for (let i = 0, nLow = 0, x = 0, nDir = 1; i < bands; i++, x += nDir) {
        let nHigh = nLow + naBarTable[i];
        // _ASSERT((unsigned int)nLow < nFftFrequencies);
        // _ASSERT((unsigned int)nHigh <= nFftFrequencies);
        const newlevel = AverageLevelCalcMono(nLow, nHigh, caSpectrumData);
        nLow = nHigh;
        volume += volume_func[newlevel];

        if (newlevel > (level[x] -= falloffrate))
            level[x] = newlevel;

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
    // } //if(!mono)

    if (bands) {
        volume /= bands;  // make volume average of all bands calculated
    }

    return level

    // BackgroundDraw((unsigned char)volume);  // clear (draw) the background

    // RenderBars(); // call the drawing function

    //? now blt the generated mess to the window
    // HDC hdc = GetDC(hatan);
    // if (hdc != NULL) {
    //     SetDIBitsToDevice(hdc, draw_x_start, draw_y_start, draw_width, draw_height, 0, 0, 0, draw_height, rgbbuffer, & bmi, DIB_RGB_COLORS);
    //     ReleaseDC(hatan, hdc);
    // }
    // return 0;
}

// calculate number of bins to assign, will be at least 1
// nNotAssigned - count of bins not yet assigned
// fDiv - divisor
function AssignCount(nNotAssigned: number, fDiv: number): number {
    let nAssign = Math.floor(nNotAssigned - nNotAssigned / fDiv + 0.5);
    if (nAssign <= 0)
        nAssign = 1;
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
        pnBarTable[i] = 1;

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