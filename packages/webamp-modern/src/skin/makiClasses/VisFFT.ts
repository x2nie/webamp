// taken from fft.cpp
/*
  LICENSE
  -------
  Copyright (C) 1999-2002 Nullsoft, Inc.

  This source code is provided 'as-is', without any express or implied
  warranty.  In no event will the authors be held liable for any damages
  arising from the use of this source code or the software it produces.

  Permission is granted to anyone to use this source code for any purpose,
  including commercial applications, and to alter it and redistribute it
  freely, subject to the following restrictions:

  1. The origin of this source code must not be misrepresented; you must not
     claim that you wrote the original source code.  If you use this source code
     in a product, an acknowledgment in the product documentation would be
     appreciated but is not required.
  2. Altered source versions must be plainly marked as such, and must not be
     misrepresented as being the original source code.
  3. This notice may not be removed or altered from any source distribution.
*/

// #include <math.h>
// #include <memory.h>
// #include "fft.h"

const PI = 3.141592653589793238462643383279502884197169399;

// const safeDeleteArray = (x) => { if (x) { delete [] x; x = 0; } }
const safeDeleteArray = (arr: any[]) => {
    if (arr) {
        arr.length = 0;
        arr = undefined;
    }
}

/*****************************************************************************/

export class FFT {
    static GUID: "OFFICIALLY-NO-GUID"
    m_samples_in = 0;
    NFREQ: number = 0;
    bitrevtable: number[];
    envelope: number[];
    equalize: number[];
    temp1: number[];
    temp2: number[];
    cossintable: number[][];


    /*****************************************************************************/

    // FFT::~FFT()
    // {
    // 	CleanUp();
    // }

    /*****************************************************************************/

    Init(samples_in: number, samples_out: number, bEqualize: number, envelope_power: number) {
        // samples_in: # of waveform samples you'll feed into the FFT
        // samples_out: # of frequency samples you want out; MUST BE A POWER OF 2.
        // bEqualize: set to 1 if you want the magnitude of the basses and trebles
        //   to be roughly equalized; 0 to leave them untouched.
        // envelope_power: set to -1 to disable the envelope; otherwise, specify
        //   the envelope power you want here.  See InitEnvelopeTable for more info.

        this.CleanUp();

        this.m_samples_in = samples_in;
        this.NFREQ = samples_out * 2;

        this.InitBitRevTable();
        this.InitCosSinTable();
        if (envelope_power > 0)
            this.InitEnvelopeTable(envelope_power);
        if (bEqualize)
            this.InitEqualizeTable();
        this.temp1 = new Array(this.NFREQ);
        this.temp2 = new Array(this.NFREQ);
    }

    /*****************************************************************************/

    CleanUp() {
        safeDeleteArray(this.envelope);
        safeDeleteArray(this.equalize);
        safeDeleteArray(this.bitrevtable);
        safeDeleteArray(this.cossintable);
        safeDeleteArray(this.temp1);
        safeDeleteArray(this.temp2);
    }

    /*****************************************************************************/

    InitEqualizeTable() {
        // Setup a log table
        // the part of a log curve to use is from 1 to <log base>
        // a bit of an adjustment is added to 1 to account for the sharp drop off at the low end
        // inverse half is (<base> - 1) / <elements>
        // equalize table will have values from > ~0 to <= 1

        this.equalize = new Array(this.NFREQ / 2);
        // equalize on natural log (brown noise will have a flat spectrum graph)
        //float inv_half_nfreq = 1.70828f / (float)(this.NFREQ / 2);
        //for(int i = 0; i < this.NFREQ / 2; i++)
        //equalize[i] = logf(1.01f + (float)(i + 1) * inv_half_nfreq);

        // equalize on log base 10 (pink noise will have a flat spectrum graph)
        //float inv_half_nfreq = 8.96f / (float)(this.NFREQ / 2);
        //for(int i = 0; i < this.NFREQ / 2; i++)
        //equalize[i] = log10(1.04f + (float)(i + 1) * inv_half_nfreq);

        // equalize on log base 10 (pink noise will have a flat spectrum graph)
        let bias = 0.04;
        for (var i = 0; i < this.NFREQ / 2; i++) {
            const inv_half_nfreq = (9.0 - bias) / (this.NFREQ / 2.0);
            this.equalize[i] = Math.log10(1.0 + bias + (i + 1.0) * inv_half_nfreq);
            //if(bias > 0.0001f)
            bias /= 1.0025;
        }
    }

    /*****************************************************************************/

    InitEnvelopeTable(power: number) {
        // this precomputation is for multiplying the waveform sample 
        // by a bell-curve-shaped envelope, so we don't see the ugly 
        // frequency response (oscillations) of a square filter.

        // a power of 1.0 will compute the FFT with exactly one convolution.
        // a power of 2.0 is like doing it twice; the resulting frequency
        //   output will be smoothed out and the peaks will be "fatter".
        // a power of 0.5 is closer to not using an envelope, and you start
        //   to get the frequency response of the square filter as 'power'
        //   approaches zero; the peaks get tighter and more precise, but
        //   you also see small oscillations around their bases.

        const mult = 1.0 / this.m_samples_in * 6.2831853;

        this.envelope = new Array(this.m_samples_in);

        if (power == 1.0)
            for (var i = 0; i < this.m_samples_in; i++)
                this.envelope[i] = 0.5 + 0.5 * Math.sin(i * mult - 1.5707963268);
        else
            for (var i = 0; i < this.m_samples_in; i++)
                this.envelope[i] = Math.pow(0.5 + 0.5 * Math.sin(i * mult - 1.5707963268), power);
    }

    /*****************************************************************************/

    InitBitRevTable() {
        this.bitrevtable = new Array(this.NFREQ);

        for (var i = 0; i < this.NFREQ; i++)
            this.bitrevtable[i] = i;

        for (var i = 0, j = 0; i < this.NFREQ; i++) {
            if (j > i) {
                let temp = this.bitrevtable[i];
                this.bitrevtable[i] = this.bitrevtable[j];
                this.bitrevtable[j] = temp;
            }

            let m = this.NFREQ >> 1;

            while (m >= 1 && j >= m) {
                j -= m;
                m = m >> 1;
            }

            j += m;
        }
    }

    /*****************************************************************************/

    InitCosSinTable() {
        let dftsize = 2;
        let tabsize = 0;
        while (dftsize <= this.NFREQ) {
            tabsize++;
            dftsize = dftsize << 1;
        }

        // this.cossintable = new float[tabsize][2];
        this.cossintable = new Array(tabsize).fill(null).map(() => new Array(2).fill(0));

        dftsize = 2;
        let i = 0;
        while (dftsize <= this.NFREQ) {
            let theta = (-2.0 * PI / dftsize);
            this.cossintable[i][0] = Math.cos(theta);
            this.cossintable[i][1] = Math.sin(theta);
            i++;
            dftsize = dftsize << 1;
        }
    }

    /*****************************************************************************/

    time_to_frequency_domain(in_wavedata:number[], out_spectraldata: number[]) {
        // Converts time-domain samples from in_wavedata[]
        //   into frequency-domain samples in out_spectraldata[].
        // The array lengths are the two parameters to Init().

        // The last sample of the output data will represent the frequency
        //   that is 1/4th of the input sampling rate.  For example,
        //   if the input wave data is sampled at 44,100 Hz, then the last 
        //   sample of the spectral data output will represent the frequency
        //   11,025 Hz.  The first sample will be 0 Hz; the frequencies of 
        //   the rest of the samples vary linearly in between.
        // Note that since human hearing is limited to the range 200 - 20,000
        //   Hz.  200 is a low bass hum; 20,000 is an ear-piercing high shriek.
        // Each time the frequency doubles, that sounds like going up an octave.
        //   That means that the difference between 200 and 300 Hz is FAR more
        //   than the difference between 5000 and 5100, for example!
        // So, when trying to analyze bass, you'll want to look at (probably)
        //   the 200-800 Hz range; whereas for treble, you'll want the 1,400 -
        //   11,025 Hz range.
        // If you want to get 3 bands, try it this way:
        //   a) 11,025 / 200 = 55.125
        //   b) to get the number of octaves between 200 and 11,025 Hz, solve for n:
        //          2^n = 55.125
        //          n = log 55.125 / log 2
        //          n = 5.785
        //   c) so each band should represent 5.785/3 = 1.928 octaves; the ranges are:
        //          1) 200 - 200*2^1.928                    or  200  - 761   Hz
        //          2) 200*2^1.928 - 200*2^(1.928*2)        or  761  - 2897  Hz
        //          3) 200*2^(1.928*2) - 200*2^(1.928*3)    or  2897 - 11025 Hz

        // A simple sine-wave-based envelope is convolved with the waveform
        //   data before doing the FFT, to emeliorate the bad frequency response
        //   of a square (i.e. nonexistent) filter.

        // You might want to slightly damp (blur) the input if your signal isn't
        //   of a very high quality, to reduce high-frequency noise that would
        //   otherwise show up in the output.

        // code should be smart enough to call Init before this function
        //if (!this.bitrevtable) return;
        //if (!this.temp1) return;
        //if (!this.temp2) return;
        //if (!this.cossintable) return;

        // 1. set up input to the fft
        if (this.envelope) {
            for (var i = 0; i < this.NFREQ; i++) {
                let idx = this.bitrevtable[i];
                if (idx < this.m_samples_in)
                    this.temp1[i] = in_wavedata[idx] * this.envelope[idx];
                else
                    this.temp1[i] = 0;
            }
        }
        else {
            for (var i = 0; i < this.NFREQ; i++) {
                let idx = this.bitrevtable[i];
                if (idx < this.m_samples_in)
                    this.temp1[i] = in_wavedata[idx];// * this.envelope[idx];
                else
                    this.temp1[i] = 0;
            }
        }
        // memset(this.temp2, 0, sizeof(float) * this.NFREQ);

        // 2. perform FFT
        let real = this.temp1;
        let imag = this.temp2;
        let dftsize = 2;
        let t = 0;
        while (dftsize <= this.NFREQ) {
            let wpr = this.cossintable[t][0];
            let wpi = this.cossintable[t][1];
            let wr = 1.0;
            let wi = 0.0;
            let hdftsize = dftsize >> 1;

            for (var m = 0; m < hdftsize; m += 1) {
                for (var i = m; i < this.NFREQ; i += dftsize) {
                    let j = i + hdftsize;
                    let tempr = wr * real[j] - wi * imag[j];
                    let tempi = wr * imag[j] + wi * real[j];
                    real[j] = real[i] - tempr;
                    imag[j] = imag[i] - tempi;
                    real[i] += tempr;
                    imag[i] += tempi;
                }

                let wtemp = wr;
                wr = wr * wpr - wi * wpi;
                wi = wi * wpr + wtemp * wpi;
            }

            dftsize = dftsize << 1;
            t++;
        }

        // 3. take the magnitude & equalize it (on a log10 scale) for output
        // #ifdef _DEBUG
        //     if (equalize)
        // 		for (int i=0; i<this.NFREQ/2; i++)
        // 		{
        // 			float f = sqrtf(this.temp1[i]*this.temp1[i] + this.temp2[i]*this.temp2[i]);
        //             out_spectraldata[i] = equalize[i] * f;
        // 		}
        //     else
        //         for (int i=0; i<this.NFREQ/2; i++) 
        //             out_spectraldata[i] = sqrtf(this.temp1[i]*this.temp1[i] + this.temp2[i]*this.temp2[i]);
        // #else
            if (this.equalize)
                for (var i=0; i<this.NFREQ/2; i++) 
                    out_spectraldata[i] = this.equalize[i] * Math.sqrt(this.temp1[i]*this.temp1[i] + this.temp2[i]*this.temp2[i]);
            else
                for (var i=0; i<this.NFREQ/2; i++) 
                    out_spectraldata[i] = Math.sqrt(this.temp1[i]*this.temp1[i] + this.temp2[i]*this.temp2[i]);
        // #endif
    } 

}
/*****************************************************************************/
