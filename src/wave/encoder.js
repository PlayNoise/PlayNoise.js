import { rest, noteData, concat, frequency, inKey, inNote } from './utils.js';

// Define pitch and keys globally
let pitch = {};
let tuneKey = {};
let sharpKeys = [];
let flatKeys = [];

// Initialize pitches and keys
setupPitches();
setupKeys();

// Note class representing a musical note
class Note {
  constructor(pitch = [], accidental = [], length, env, har, vol) {
    this.pitch = Array.isArray(pitch) ? pitch : [];
    this.accidental = accidental.length ? accidental : Array(this.pitch.length).fill(0);
    this.length = length;
    this.env = env;
    this.har = har;
    this.vol = vol;

    //console.log(`Created Note - Pitch: ${this.pitch}, Accidental: ${this.accidental}, Length: ${this.length}, Volume: ${this.vol}`);
  }

  encode() {
    if (this.pitch.length === 0) {
      //console.log(`Rest note - Length: ${this.length}`);
      return rest(this.length); // Handle rest
    }

    // Convert each pitch to its frequency and apply accidental adjustments
    const noteDataArray = this.pitch.map((p, i) => {
      const adjustedPitch = p + (this.accidental[i] || 0); // Apply accidental (sharp or flat)
      //const frequencyValue = frequency(adjustedPitch);
      const frequencyValue = adjustedPitch;

      //console.log(`${i} Encoding Note - Original Pitch: ${p}, Adjusted Pitch: ${adjustedPitch}, Frequency: ${frequencyValue}`);
      //return noteData(441, 0.5, this.env, this.har, 0.2);
      return noteData(frequencyValue, this.length, this.env, this.har, this.vol);
    });
    return concatNotes(...noteDataArray); // Handle both single note and chord

  }
}

class Tune {
  constructor(key, ch1 = [], ch2 = []) {
    this.key = key;
    this.ch1 = this.ensureNotes(ch1); // Ensure that notes are instances of the Note class
    this.ch2 = this.ensureNotes(ch2); // Ensure that notes are instances of the Note class
  }

  // Ensure that all items in the array are instances of the Note class
  ensureNotes(notes) {
    return notes.map(note => {
      if (note instanceof Note) {
        return note;
      } else {
        return new Note(note.pitch, note.accidental,
          note.length, note.env, note.har, note.vol);
      }
    });
  }

  encode() {
    const acc = inKey(sharpKeys, this.key) ? 1 : (inKey(flatKeys, this.key) ? -1 : 0);

    this.ch1.forEach(note => adjustAccidentals(note, acc));
    this.ch2.forEach(note => adjustAccidentals(note, acc));

    const ch1Data = [];
    const ch2Data = [];

    for (let i = 0; i < this.ch1.length; i++) {
      const note = this.ch1[i];
      console.log(`Note ch1 ${JSON.stringify(note)}`);

      const encoded = note.encode();
      ch1Data.push(encoded);
    }

    for (let i = 0; i < this.ch2.length; i++) {
      const note = this.ch2[i];
      console.log(`Note ch2 ${JSON.stringify(note)}`);
      const encoded = note.encode();
      ch2Data.push(encoded);
    }

    //    return stereo(ch1Data.flat(), ch2Data.flat());

    return ch1Data.flat();
  }
}

function concatNotes(...notes) {
  // Check if there are any notes
  if (notes.length === 0) return [];

  // Get the length of the first note (to compare lengths of all notes)
  const length = notes[0].length;

  // Ensure all notes have the same length
  for (let note of notes) {
    if (note.length !== length) {
      throw new Error('Length of notes are not the same');
    }
  }

  // Create an array to hold the concatenated result
  const data = new Array(length).fill(0);

  // Add up all the notes at each index
  for (let i = 0; i < length; i++) {
    for (let note of notes) {
      data[i] += note[i];
    }
  }

  return data;
}

// Adjust accidentals for each note based on key signature
function adjustAccidentals(note, acc) {
  if (!note.pitch || !Array.isArray(note.pitch) || note.pitch.length === 0) {
    note.pitch = [];
  }

  if (!note.accidental || !Array.isArray(note.accidental)) {
    note.accidental = Array(note.pitch.length).fill(0);
  }

  note.accidental = note.accidental.map(a => a + acc);
}

/*
setupPitches();
setupKeys();

console.log(pitch);   // Output the pitch mapping
console.log(tuneKey); // Output the key signature mapping
*/

// Utility function to set up pitches
// Setup pitches

function setupPitches() {
  const notes = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];
  let nums = [-57, -55, -53, -52, -50, -48, -46];

  for (let i = 1; i < 8; i++) {
    notes.forEach((note, j) => {
      nums[j] += 12;
      pitch[`${note}${i}`] = nums[j];
    });
  }
}

// Initialize the tuneKey array, which is used to apply the key signature to notes

function setupKeys() {
  tuneKey['C'] = [];

  const sharpKeys = ['G', 'D', 'A', 'E', 'B', 'F#', 'C#'];
  const sharpNotes = [
    pitch['f1'], pitch['c1'], pitch['g1'], pitch['d1'],
    pitch['a1'], pitch['e1'], pitch['b1']
  ];

  sharpKeys.forEach((key, i) => {
    let k = [];
    for (let j = 0; j < i + 1; j++) {
      for (let l = 1; l < 6; l++) {
        k.push(sharpNotes[j] + (12 * l));
      }
    }
    tuneKey[key] = k;
  });

  const flatKeys = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'];
  const flatNotes = [
    pitch['b1'], pitch['e1'], pitch['a1'], pitch['d1'],
    pitch['g1'], pitch['c1'], pitch['f1']
  ];

  flatKeys.forEach((key, i) => {
    let k = [];
    for (let j = 0; j < i + 1; j++) {
      for (let l = 1; l < 6; l++) {
        k.push(flatNotes[j] + (12 * l));
      }
    }
    tuneKey[key] = k;
  });
}

export { Note, Tune };
