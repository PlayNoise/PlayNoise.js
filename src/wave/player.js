import PN from "../pn.js";
import { Note, Tune } from "./encoder.js";
import { first } from "./harmonic.js";
import { Instruments } from "../instruments/instruments.js";
import parseSongInput from "../input/parseStringInput.js";
import pitchFrequencies from "../pitchFrequencies.json";
import { readWavFile } from "../input/wavProcessor.js";
import { setInputInstrument } from "./synth.js";

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
  const myTune = new Tune(
    PN.key,
    [], // ch1: Will be filled with notes
    [], // ch2: Will be filled with notes
  );

  const parsedData = parseSongInput(songData);
  for (let channel in parsedData) {
    const channelData = parsedData[channel];

    if (channel === "ch1") {
      channelData.forEach((entry) => {
        const { duration, notes } = entry;
        PN.duration = duration;
        notes.forEach((noteName) => {
          const note = createNote(noteName);
          if (note) {
            myTune.ch1.push(note);
          }
        });
      });
    } else if (channel === "ch2") {
      channelData.forEach((entry) => {
        const { duration, notes } = entry;
        PN.duration = duration;
        notes.forEach((noteName) => {
          const note = createNote(noteName);
          if (note) {
            myTune.ch2.push(note);
          }
        });
      });
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
