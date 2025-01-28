import PN from "../pn.js";
import { Note, Tune } from "./encoder.js";
import { first } from "./harmonic.js";
import { Instruments } from "../instruments/instruments.js";
import parseSongInput from "../input/parseStringInput.js";
import pitchFrequencies from "../pitchFrequencies.json";
import { readWavFile } from "../input/wavProcessor.js";

const pitch = {
  a4: 440,
  c4: 423,
  c5: 523,
  e3: 449,
  e4: 559,
  e5: 659,
  f2: 398,
  f5: 698,
  b4: 494,
  b2: 294,
  b3: 394,
  b5: 988,
  a3: 220,
  a5: 880,
  g5: 784,
  d3: 190,
  d4: 293,
  c3: 131,
  g3: 196,
  g4: 296,
  f3: 174,
  f4: 274,
};

/**
 * Creates a musical note with the given note name.
 * If no instrument is selected, it defaults to Piano.
 *
 * @param {string|number} noteName - The name or number of the musical note (e.g., "A4", "440").
 * @returns {Note|undefined} - A new Note instance with the specified pitch, or undefined if the note is not found.
 *
 * @example
 * // Select an instrument and create a note
 * PN.instrument('cello');    // Select piano instrument
 * const note = createNote('C4'); // Creates a note with frequency for C4
 * console.log(note);         // Logs the created note
 * PN.save();
 */

function createNote(noteName) {
  // Set default instrument to piano if no instrument is selected
  if (!PN.currentInstrument) {
    console.log("No instrument selected, defaulting to Banjo.");
    PN.currentInstrument = new Instruments().Banjo(); // Default to piano
  }

  var frequency = pitchFrequencies[noteName];
  if (!frequency) {
    frequency = parseInt(noteName);
    if (isNaN(frequency)) {
      console.log(`Note ${noteName} not found!`);
      return;
    }
  }

  if (typeof noteName === "number") {
    frequency = noteName;
  }
  if (!frequency) {
    console.log(`Please enter a number or musical note`);
    return;
  }

  const note = new Note(
    [frequency], // Frequency for the note
    [0], // No accidentals
    PN.duration, // Use PN's duration
    PN.currentInstrument, // Use the selected instrument's envelope
    PN.harmonic1,
    PN.harmonic2,
    PN.step,
    PN.filter,
    PN.filter2,
    PN.width1,
    PN.width2,
    PN.filterEnv,
    PN.lfoWave,
    PN.glideTime,
    PN.volume, // Use PN's volume level
    PN.multiplier,
    PN.noiseLevel,
    PN.noiseState,
    PN.ratio,
  );

  console.log(`Created note ${noteName} with frequency ${frequency}`);
  return note;
}

// Function to create a note
function makeNote(noteString, section, score) {
  let length = section.length || score.length;
  let volume = section.volume || score.volume;
  let instrument = section.instrument || score.instrument;
  let harmonic = section.harmonic || score.harmonic;
  let harmonic1 = PN.harmonic1;
  let harmonic2 = PN.harmonic2;
  let step = PN.step;
  let filter = PN.filter;
  let filter2 = PN.filter2;
  let width1 = PN.width1;
  let width2 = PN.width2;
  let filterEnv = PN.filterEnv;
  let lfoWave = PN.lfoWave;
  let glideTime = PN.glideTime;
  let multiplier = PN.multiplier;
  let noiseLevel = PN.noiseLevel;
  let noiseState = PN.noiseState;
  let ratio = PN.ratio;

  const note = new Note(
    pitch,
    [],
    length,
    PN.currentInstrument,
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
  );

  const parts = noteString.split(":");
  const noteLength = parts.length > 1 ? parseFloat(parts[0]) : 1.0;
  const pitches = parts.length > 1 ? parts[1] : parts[0];

  note.length *= noteLength;

  if (pitches.includes("-")) {
    const chords = pitches.split("-");
    chords.forEach((chord) => process(note, chord));
  } else {
    process(note, pitches);
  }

  return note;
}

// Function to process a single note or chord
function process(note, pitchStr) {
  pitchStr = pitchStr.toUpperCase();
  if (pitchStr === "Z") return; // Rest

  if (pitchStr.length < 2 || pitchStr.length > 3) {
    throw new Error(`Invalid note structure: ${pitchStr}`);
  }

  const basePitch = pitchStr.slice(0, 2);
  if (!pitchFrequencies[basePitch]) {
    throw new Error(`Note doesn't exist: ${basePitch}`);
  }

  note.pitch.push(pitchFrequencies[basePitch]);

  const accidental = pitchStr.slice(-1);
  if (accidental === "#") {
    note.accidental.push(1);
  } else if (accidental === "b") {
    note.accidental.push(-1);
  } else {
    note.accidental.push(0);
  }
}

/**
 * Creates a song based on the input data.
 * The song is constructed from a series of note strings and durations.
 * Notes are processed and encoded into a Tune instance.
 *
 * @param {Array} songData - An array of song sections and note data, in string format.
 * @returns {Array} - The encoded song data.
 *
 * @example
 * // Define song data
 * const songData = [
 *  "ch1[1.5:A4-F5]",
 *  "ch2[0.5:C4]",
 *  "ch1[2.0:G3-E4-D4]"
 * ];
 *
 * // Create a song
 * PN.setVolume(0.5); // Set volume level
 * const song = createSong(songData); // Create a song from the input data
 * console.log(song); // Logs the encoded song data
 */

// Helper to create a song
function createSong(songData) {
  const score = parseSongInput(songData);
  const myTune = new Tune(score.key, [], []);

  for (const section of score.sections) {
    for (const n of section.C1) {
      const note = makeNote(n, section, score);
      myTune.ch1.push(note);
    }
    for (const n of section.C2) {
      const note = makeNote(n, section, score);
      myTune.ch2.push(note);
    }
  }

  // Concatenate all notes to form the song
  var songDataOutput = myTune.encodePlane();
  PN.songDataOutput = songDataOutput;
  return songDataOutput;
}

/**
 * Creates a musical note with the given note name.
 * If no instrument is selected, it defaults to Piano.
 *
 * @param {string} noteName - The name of audio file you wish to replicate.
 * @returns {File|undefined} - A new audio file instance with the specified pitch, or undefined if the note is not found.
 *
 * @example
 * // Select an instrument and create a note
 *      // Wrap everything in an async function
 *      async function runPNExample() {
 *          console.log(PN);  // This should print the PN object
 *           PN.instrument('Piano'); // Select the instrument
 *           // PN.setVolume(0.5); // Set volume (optional)
 *
 *           // Wait for PN.singVoice to complete
 *           const song = await PN.singVoice('recording2.wav');
 *
 *           console.log("Song created:", song);
 *           console.log(PN.volume);  // Logs the current volume
 *               setTimeout(() => {
 *                   PN.save(); // Call save after the delay
 *                   saveLogToFile(logMessages);
 *
 *               }, 8000); // Delay in milliseconds (5000ms = 5s)
 *       }
 *
 *       // Run the function
 *       runPNExample();
 */

function singVoice(audioFile) {
  const numChannels = 100;

  readWavFile(audioFile, (voiceFrequencies) => {
    const skeleton = voiceFrequencies;

    const myTune = new Tune(PN.key, ...Array(numChannels).fill([]));
    const channels = Array.from(
      { length: numChannels },
      (_, i) => myTune[`ch${i + 1}`],
    );

    for (var i = 0; i < skeleton.length; i++) {
      console.log(`Voice number ${i + 1}`);

      skeleton[i].forEach((data, index) => {
        const note = new Note(
          [Math.round(data[0])], // Frequency
          [0], // No accidentals
          data[2], // Duration
          PN.currentInstrument, // Oscillators
          PN.harmonic1,
          PN.harmonic2,
          PN.step,
          PN.filter,
          PN.filter2,
          PN.width1,
          PN.width2,
          PN.filterEnv,
          PN.lfoWave,
          PN.glideTime,
          data[1], // Volume
          PN.multiplier,
          PN.noiseLevel,
          PN.noiseState,
          PN.ratio,
        );

        if (note) {
          channels[i].push(note);
        }
      });
    }

    const songDataOutput = myTune.encode();
    PN.songDataOutput = songDataOutput;
    return songDataOutput;
  });
}

export { createNote, createSong, singVoice };
