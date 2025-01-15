// synth.js

import { pulseWave } from "./harmonic.js";

let instrument;

// Sample rate is assumed to be constant
const sampleRate = 44100,
  bitDepth = 16,
  numChannels = 2,
  wavAudioFormat = 1,
  tolerance = 1500;

// Generate rest (silence) data for the specified duration
export function rest(duration) {
  const restData = [];
  const totalSamples = Math.floor(duration * sampleRate);
  for (let i = 0; i < totalSamples; i++) {
    restData.push(0); // Silence
  }
  return restData;
}

// Concatenates an array of note arrays
export function concat(...notes) {
  return notes.flat(); // Flatten all note arrays into one
}

// Calculate frequency from pitch step
function semitone(frequency, step) {
  return frequency * Math.pow(2, step / 12.0); // A440 standard
}

function applyGlide(targetFreq, currentFreq, glideTime, timeStep) {
  const glideStep = (targetFreq - currentFreq) * (timeStep / glideTime);
  return currentFreq + glideStep;
}

export function whiteNoise(bool) {
  if (bool === true) {
    return Math.random() * 2 - 1;
  }
  return 1;
}

function mixing(osc1, osc2, a, b, c) {
  return (osc1 * a + osc2 * b) / c;
}

// Returns the note data based on frequency, duration, envelope, harmonic, and volume
export function noteData(
  frequency,
  duration,
  envelope,
  harmonic1,
  harmonic2,
  step,
  filter,
  filter2,
  width1,
  width2,
  filterEnv,
  lfoWave,
  glideTime,
  volume,
  multiplier,
  noiseLevel,
  noiseState,
  ratio,
) {
  const length = duration * sampleRate * multiplier;
  let filterState = { value: 0, resonanceGain: 0 }; // Initial filter state

  const data = Array.apply(null, Array(length)).map(function () {
    return 0;
  });

  for (let i = 0; i < length; i++) {
    const time = i / sampleRate;
    //const x = volume * envelope(t , duration )* harmonic(frequency * t);
    let frequency2 = semitone(frequency, step);
    frequency = applyGlide(frequency, frequency, glideTime, 1 / sampleRate);
    frequency2 = applyGlide(frequency2, frequency2, glideTime, 1 / sampleRate);

    var oscillator1 = 0,
      oscillator2 = 0;
    if (harmonic1 == pulseWave) {
      oscillator1 = harmonic1(frequency, time, width1);
    } else {
      oscillator1 = harmonic1(frequency * time);
    }
    var oscillator2 = 0;
    if (harmonic2 == pulseWave) {
      oscillator1 = harmonic2(frequency, time, width2);
    } else {
      oscillator2 = harmonic2(frequency2 * time);
    }

    // Mix the oscillators
    let sample =
      mixing(oscillator1, oscillator2, ratio[0], ratio[1], ratio[2]) +
      noiseLevel * whiteNoise(noiseState);
    // Apply LFO for vibrato
    sample *= 1 + lfoWave(time);

    const amplitude = filterEnv(time);
    // Apply amlitude envelope to the cutoff frequency

    sample = filter(sample, amplitude, sampleRate, filterState);
    sample = filter2(sample, amplitude, sampleRate, filterState);

    const amp = envelope(time, duration);
    //console.log(sample,volume);
    sample *= amp;
    data[i] = sample * volume;
  }

  return data;
}

function frequencyScale(step) {
  return 440.0 * Math.pow(2, step / 12.0);
}

function floorTowardsZero(num) {
  console.log(Math.floor(num));
  return Math.floor(num);
}
export function noteData2(frequency, duration, envelope, harmonic, volume) {
  let data = [];

  for (let i = 0; i < duration; i += 1.0 / sampleRate) {
    const x = Math.floor(
      volume * envelope(i, duration) * harmonic(frequency * i),
    );
    data.push(x);
  }

  return data;
}

// Check if the given note is in the key signature
export function inKey(keys, note) {
  return keys.includes(note);
}

// Check if the note is part of the specified key
export function inNote(notes, note) {
  return notes.includes(note);
}

// utils.js

/**
 * Get the frequency of a note based on its distance from A4 (440 Hz).
 * @param {string} note - The note (e.g., 'C4', 'A4', 'G#5').
 * @returns {number} - The frequency of the note in Hz.
 */
export function calculateFrequency(note) {
  const noteMap = {
    C: -9,
    "C#": -8,
    D: -7,
    "D#": -6,
    E: -5,
    F: -4,
    "F#": -3,
    G: -2,
    "G#": -1,
    A: 0,
    "A#": 1,
    B: 2,
  };

  const noteUpper = note.toUpperCase();
  const parsedNote = noteUpper.match(/^([A-G]#?)(\d)$/);
  if (!parsedNote) throw new Error(`Invalid note format: ${note}`);

  const [, noteName, octave] = parsedNote;
  const semitoneDistance = noteMap[noteName] + (parseInt(octave) - 4) * 12;
  return 440 * Math.pow(2, semitoneDistance / 12); // Frequency calculation
}

// Generate wave value based on oscillator type
function generateWaveValue(type, frequency, time) {
  const phase = 2 * Math.PI * frequency * time;
  switch (type) {
    case "sine":
      return Math.sin(phase);
    case "triangle":
      return (
        2 *
          Math.abs(
            2 * (time * frequency - Math.floor(time * frequency + 0.5)),
          ) -
        1
      );
    case "square":
      return Math.sign(Math.sin(phase));
    case "sawtooth":
      return 2 * (time * frequency - Math.floor(time * frequency + 0.5));
    case "n0": // White noise
      return Math.random() * 2 - 1;
    default:
      return 0; // Default to no contribution if unknown wave type
  }
}

// Calculate AHDSR envelope value
function calculateDynamicADSR(time, duration, a, d, s, r, h) {
  const attackEnd = a;
  const holdEnd = a + h;
  const decayEnd = holdEnd + d;
  const releaseStart = duration - r;

  if (time < attackEnd) {
    return time / a; // Attack phase (linear ramp)
  } else if (time < holdEnd) {
    return 1; // Hold phase (constant at peak)
  } else if (time < decayEnd) {
    return 1 - ((time - holdEnd) / d) * (1 - s); // Decay phase
  } else if (time < releaseStart) {
    return s; // Sustain phase
  } else if (time <= duration) {
    return s * (1 - (time - releaseStart) / r); // Release phase
  } else {
    return 0; // Beyond duration
  }
}

export function setInputInstrument(newInstrument) {
  instrument = newInstrument;
}

export function getInputInstrument() {
  if (instrument === "voice") {
    return "voice";
  } else {
    return "note";
  }
}
