// utils.js

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
    //    const amplitude = envelope(time, duration) * harmonic(frequency * i) *volume;

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

function sineWaveAt(sampleNumber, tone) {
  var sampleFreq = sampleRate / tone;
  return Math.sin(sampleNumber / (sampleFreq / (Math.PI * 2)));
}

// Returns the note data based on frequency, duration, envelope, harmonic, and volume
/*export function noteData(frequency, duration, envelope, harmonic, volume) {
  const arr = [];

  volume = 0.2;
  const seconds = 0.5;
  const tone = 441;

  for (var i = 0; i < sampleRate * seconds; i++) {
    arr[i] = sineWaveAt(i, tone) * volume
  }
  return arr;
}
*/

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
