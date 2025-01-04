// envelope.js

// Envelope functions control the shape of the note and how it's played
var envelopes = {};
var defaultParams={g:1,w:"sine",t:1,f:0,v:0,a:0,h:0,d:0,s:0,r:0,p:1,q:1,k:0};

// ADSHR Envelope function



// -- .
//     \
//      \
// Drop envelope: cosine decay
/*
Attack (A): 0 (no attack phase)
Decay (D): The entire duration is a decay phase, decaying from 1 to 0.
Sustain (S): 0 (no sustain)
Release (R): The function ends at 0, meaning the release is implicit.
*/

export function drop(input, duration) {
  return Math.cos((Math.PI * input) / (2 * duration));
}

//   . --
//  /
// /
// Rise envelope: sine ramp up
/*
Attack (A): The entire duration is an attack phase, rising smoothly from 0 to 1.
Decay (D): 0 (no decay)
Sustain (S): 0 (no sustain)
Release (R): 0 (no release)
*/
export function rise(input, duration) {
  return Math.sin((Math.PI * input) / (2 * duration));

}

// flute 
//  . -- .
//  /      \
// /        \
// Round envelope: sine wave up and down
/*
Attack (A): The first half of the duration (rising from 0 to 1).
Decay (D): The second half of the duration (falling from 1 to 0).
Sustain (S): 0 (no sustain phase)
Release (R): Implicit (since the function returns to 0).
*/
export function round(input, duration) {
  return Math.sin((Math.PI * input) / duration);
}

//   /\
//  /  \
// /    \

// Triangle envelope: sawtooth wave
/*
Attack (A): The rising part of the triangle (from 0 to 1).
Decay (D): The falling part of the triangle (from 1 to 0).
Sustain (S): 0 (no sustain phase)
Release (R): Implicit (since the function returns to 0).
*/
export function triangle(input, duration) {
  return (2 / Math.PI) * Math.asin(Math.sin((2 * Math.PI * input) / duration));
}

// Drawl envelope: logarithmic decay
export function drawl(input, duration) {
  return 1 / Math.log10((2 * Math.PI * input / duration) + 1.9);
}

// Drawl envelope: logarithmic rise
export function rawl(input, duration) {
  return 1 * Math.log10((2 * Math.PI * input / duration) + 1.9);
}


export function adsrExpEnvelope(t, duration, params) {
    let { a, d, h, s, r } = params;
    a *= duration;
    d *= duration;
    h *= duration;
    r *= duration;

    const expScale = (x, min, max) => (Math.exp((x - min) / (max - min)) - 1) / (Math.exp(1) - 1);

    let amplitude = 0;
    if (t <= a) {
        // Exponential attack
        amplitude = expScale(t, 0, a);
    } else if (t <= a + d) {
        // Exponential decay
        amplitude = 1 - expScale(t - a, 0, d) * (1 - s);
    } else if (t <= a + d + h) {
        amplitude = s; // Sustain remains constant
    } else if (t <= a + d + h + r) {
        // Exponential release
        amplitude = s * (1 - expScale(t - (a + d + h), 0, r));
    } else {
        amplitude = 0;
    }
    return amplitude;
}

export function ADSRLogEnvelope(t, duration, params) {
    let { a, d, h, s, r } = params;
    a *= duration;
    d *= duration;
    h *= duration;
    r *= duration;
    const logScale = (x, min, max) => Math.log10(1 + 9 * (x - min) / (max - min));

    let amplitude = 0;
    if (t <= a) {
        // Logarithmic attack
        amplitude = logScale(t, 0, a);
    } else if (t <= a + d) {
        // Logarithmic decay
        amplitude = 1 - logScale(t - a, 0, d) * (1 - s);
    } else if (t <= a + d + h) {
        amplitude = s; // Sustain remains constant
    } else if (t <= a + d + h + r) {
        // Logarithmic release
        amplitude = s * (1 - logScale(t - (a + d + h), 0, r));
    } else {
        amplitude = 0;
    }
    return amplitude;
}

export function ADSRLinearEnvelope(t, duration, params) {
    var { a, d, h, s, r , k, v, g, f } = params;
    a *= duration;
    d *= duration;
    h *= duration;
    r *= duration;

    let amplitude = 0;
    if (t <= a) {
        amplitude = t / a;
    } else if (t <= a + d) {
        amplitude = 1 - (t - a) / d * (1 - s);
    } else if (t <= a + d + h) {
        amplitude = s;
    } else if (t <= a + d + h + r) {
        amplitude = s * (1 - (t - (a + d + h)) / r);
    } else {
        amplitude = 0;
    }

    return amplitude * v;
}

// Waveform functions

function triangleHarmonics(time, frequency, harmonics) {
    let result = 0;

    for (let n = 1; n <= harmonics; n++) {
        // Odd harmonics only: 1, 3, 5, etc.
        if (n % 2 === 1) {
            const harmonicFrequency = frequency * n; // Harmonic frequency
            const harmonicAmplitude = 1 / (n * n); // Amplitude falls off as 1/n^2 for triangle wave
            result += harmonicAmplitude * triangle(time, harmonicFrequency);
        }
    }

    return result;
}

function sine(time, frequency) {
    return Math.sin(2 * Math.PI * frequency * time);
}

function square(time, frequency) {
    return Math.sign(Math.sin(2 * Math.PI * frequency * time));
}

function sawtooth(time, frequency) {
    return 2 * (time * frequency - Math.floor(time * frequency + 0.5));
}

export function tempered(input, duration) {
  return drop(input, duration) * drawl(input, duration);
}

/* Piano 1-8 */

// CAP (Acoustic Grand Piano) sound
export function AcousticGrandPiano1(time, duration) {
    return round(time*100, duration*100);
}

export function AcousticGrandPiano2(time, duration) {
    return round(time*100,duration*100);
}

export function BrightAcousticPiano1(time, duration) {
    return tempered(time*100,duration*100);
}

export function BrightAcousticPiano2(time, duration) {
    return tempered(time*100,duration*100);
}

export function ElectricGrandPiano1(time, duration){
    return triangle(time*100,duration*100);
}
export function ElectricGrandPiano2(time, duration){
    return round(time*100,duration*100);
}

export function HonkyTonkPiano1(time, duration){
    return drawl(time*100,duration*100);
}
export function HonkyTonkPiano2(time, duration){
    return drawl(time*100,duration*100);
}

export function ElectricPiano11(time, duration){
    const adsrParams = { ...defaultParams,v:0.35,d:0.7}
    return ADSRLinearEnvelope(time, duration, adsrParams);
}
export function ElectricPiano12(time, duration){
    const adsrParams = { ...defaultParams,v:3,t:7,f:1,d:1,s:1,g:1,k:-.7}
    return ADSRLinearEnvelope(time, duration, adsrParams);
}

export function ElectricPiano21(time, duration){
    const adsrParams = { ...defaultParams,v:0.35,d:0.7}
    return ADSRLinearEnvelope(time, duration, adsrParams);
}
export function ElectricPiano22(time, duration){
    const adsrParams = { ...defaultParams,v:8,t:7,f:1,d:0.5,s:1,g:1,k:-.7}
    return ADSRLinearEnvelope(time, duration, adsrParams);
}

export function Harpsichord1(time, duration){
    const adsrParams = { ...defaultParams,v:0.34,d:2}
    return ADSRLinearEnvelope(time, duration, adsrParams);
}
export function Harpsichord2(time, duration){
    const adsrParams = { ...defaultParams,v:8,f:0.1,d:2,s:1,r:2,g:1}
    return ADSRLinearEnvelope(time, duration, adsrParams);
}

export function Clavi1(time, duration){
    const adsrParams = { ...defaultParams,v:0.34,d:1.5}
    return ADSRLinearEnvelope(time, duration, adsrParams);
}
export function Clavi2(time, duration){
    const adsrParams = { ...defaultParams, v:6,f:0.1,d:1.5,s:0.5,r:2,g:1}
    return ADSRLinearEnvelope(time, duration, adsrParams);
}





function generateHarmonics(t, frequency, harmonics, amplitudes, waveformFunction) {
    let result = 0;

    for (let i = 0; i < harmonics.length; i++) {
        var harmonicFrequency = frequency * harmonics[i]; // Calculate harmonic frequency
        var harmonicAmplitude = amplitudes[i]; // Amplitude for the harmonic
        result += harmonicAmplitude * waveformFunction(t, harmonicFrequency);
    }

    return result;
}

// BAP (Bright Acoustic Piano) sound
export function BrightAcousticPiano(time, duration, frequency) {
    var params = {
        a: 0.01,  // Very short attack
        d: 0.05,  // Short decay
        h: 0.05,  // Brief hold
        s: 0.4,   // Lower sustain level
        r: 0.2,   // Slightly longer release
        v: 1.0,   // Volume
        f: frequency, // Fundamental frequency
    };

    var amplitudeEnvelope = envelope(time, duration,'triangleHarmonics', params);

    return amplitudeEnvelope;
}


// Simple reverb function
function reverb(inputSignal, sampleRate, decay = 0.5, delayTime = 0.1) {
    var delaySamples = Math.floor(sampleRate * delayTime); // Delay in samples
    var outputSignal = new Array(inputSignal.length).fill(0);
    var feedback = decay; // Feedback determines how much signal to feed back

    for (let i = 0; i < inputSignal.length; i++) {
        outputSignal[i] = inputSignal[i]; // Original signal
        if (i >= delaySamples) {
            outputSignal[i] += feedback * outputSignal[i - delaySamples]; // Add delayed signal
        }
    }

    return outputSignal;
}

export function triangle0(input, duration) {
  return (2 / Math.PI) * Math.asin(Math.sin((20 * Math.PI * input) / duration));
}


// Export envelopes and reverb
envelopes['drop'] = drop;
envelopes['triangle0'] = triangle0;
envelopes['AcousticGrandPiano1'] = AcousticGrandPiano1;
envelopes['AcousticGrandPiano2'] = AcousticGrandPiano2;
envelopes['BrightAcousticPiano1'] = BrightAcousticPiano1;
envelopes['BrightAcousticPiano2'] = BrightAcousticPiano2;
envelopes['ElectricGrandPiano1'] = ElectricGrandPiano1;
envelopes['ElectricGrandPiano2'] = ElectricGrandPiano2;
envelopes['HonkyTonkPiano1'] = HonkyTonkPiano1;
envelopes['HonkyTonkPiano2'] = HonkyTonkPiano2;
envelopes['ElectricPiano11'] = ElectricPiano11;
envelopes['ElectricPiano12'] = ElectricPiano12;
envelopes['ElectricPiano21'] = ElectricPiano21;
envelopes['ElectricPiano22'] = ElectricPiano22;
envelopes['Harpsichord1'] = Harpsichord1;
envelopes['Harpsichord2'] = Harpsichord2;
envelopes['Clavi1'] = Clavi1;
envelopes['Clavi2'] = Clavi2;




export { envelopes, reverb};
