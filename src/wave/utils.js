// utils.js
import { EnvelopeAHDSR } from '../instruments/envelope.js';

let instrument; 

// Sample rate is assumed to be constant
const sampleRate = 44100,
  bitDepth = 16 ,
  numChannels = 2 ,
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
export function frequency(step) {
  return 440.0 * Math.pow(2, step / 12.0); // A440 standard
}

// Returns the note data based on frequency, duration, envelope, harmonic, and volume
export function noteData(frequency, duration, envelope, harmonic, volume) {
  const data = [];

  for (let i = 0.0; i < duration; i = i+ (1.0 / (sampleRate))) {

    const x = volume * envelope(i, duration) * harmonic(frequency * i) ;

    data.push(x);
  }
  return data;
}

function frequencyScale(step ) {
  return 440.0 * (Math.pow(2, ((step) / 12.0)));
}

function floorTowardsZero(num) {
  console.log(Math.floor(num));
  return Math.floor(num) ;
}
export function noteData2(frequency, duration, envelope, harmonic, volume) {
  let data = [];

  for (let i = 0; i < duration; i += 1.0 / sampleRate) {
    const x = Math.floor(volume * envelope(i, duration) * harmonic(frequency * i));
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
    'C': -9, 'C#': -8, 'D': -7, 'D#': -6, 'E': -5,
    'F': -4, 'F#': -3, 'G': -2, 'G#': -1, 'A': 0,
    'A#': 1, 'B': 2
  };

  const noteUpper = note.toUpperCase();
  const parsedNote = noteUpper.match(/^([A-G]#?)(\d)$/);
  if (!parsedNote) throw new Error(`Invalid note format: ${note}`);

  const [, noteName, octave] = parsedNote;
  const semitoneDistance = noteMap[noteName] + (parseInt(octave) - 4) * 12;
  return 440 * Math.pow(2, semitoneDistance / 12); // Frequency calculation
}

// Generate sample data with AHDSR envelope and multiple oscillators
export function voiceData(frequency, duration, volume , oscillators, sampleRate = 44100) {
  const data = [];
  const totalSamples = Math.floor(sampleRate * duration);

  for (let i = 0; i < totalSamples; i++) {
    const time = i / sampleRate; // Current time in seconds
    const envelopeValue = EnvelopeAHDSR(time, duration); // Get envelope amplitude

    // Combine contributions from all oscillators
    let harmonicValue = 0;
    oscillators.forEach(osc => {
      const freq = frequency * (osc.k ? Math.pow(2, osc.k / 12) : 1); // Adjust for detuning
      const waveValue = generateWaveValue(osc.w, freq, time); // Generate wave based on type
      harmonicValue += osc.v * waveValue; // Scale by volume multiplier
    });

    const sample = volume * envelopeValue * harmonicValue; // Apply envelope to combined harmonic
    data.push(sample);
  }
  console.log(`Generated Data : ${data}`);

  return data;
}

// Generate wave value based on oscillator type
function generateWaveValue(type, frequency, time) {
  const phase = 2 * Math.PI * frequency * time;
  switch (type) {
    case 'sine':
      return Math.sin(phase);
    case 'triangle':
      return 2 * Math.abs(2 * (time * frequency - Math.floor(time * frequency + 0.5))) - 1;
    case 'square':
      return Math.sign(Math.sin(phase));
    case 'sawtooth':
      return 2 * (time * frequency - Math.floor(time * frequency + 0.5));
    case 'w9999':
      // Custom wave: blend of sine and triangle
      const sine = Math.sin(phase);
      const triangle = 2 * Math.abs(2 * (time * frequency - Math.floor(time * frequency + 0.5))) - 1;
      return 0.5 * sine + 0.5 * triangle; // 50/50 blend
    case 'n0':
      // Noise oscillator: random values between -1 and 1
      return Math.random() * 2 - 1;
    default:
      return 0; // Default to no contribution if unknown wave type
  }
}


export function setInputInstrument(newInstrument) {
  instrument = newInstrument;
}

export function getInputInstrument() {
  if (instrument === 'voice') {
    return 'voice';
  } else {
    return 'note';
  }
}