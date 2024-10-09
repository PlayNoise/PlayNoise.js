import PN from '../pn.js';
import { Note ,  Tune  } from './encoder.js'; // Assuming Note class exists
import { first } from './harmonic.js'; // Assuming harmonic functions are imported
import { Instruments } from '../instruments/instruments.js'; // Assuming Instruments class is imported
import parseSongInput from '../input/parseStringInput.js';
import pitchFrequencies from '../pitchFrequencies.json';

/**
 * Creates a musical note with the given note name.
 * If no instrument is selected, it defaults to Piano.
 *
 * @param {string} noteName - The name of the musical note (e.g., "C4", "A4").
 * @returns {Note|undefined} - A new Note instance with the specified pitch, or undefined if the note is not found.
 *
 * @example
 * // Select an instrument and create a note
 * PN.instrument('piano');    // Select piano instrument
 * const note = createNote('C4'); // Creates a note with frequency for C4
 * console.log(note);         // Logs the created note
 */
function createNote(noteName) {
  // Set default instrument to piano if no instrument is selected
  if (!PN.currentInstrument) {
    console.log('No instrument selected, defaulting to Piano.');
    PN.currentInstrument = new Instruments().Piano(); // Default to piano
  }

  const frequency = pitchFrequencies[noteName];
  if (!frequency) {
    console.log(`Note ${noteName} not found!`);
    return;
  }

  const note = new Note(
    [frequency], // Frequency for the note
    [0], // No accidentals
    PN.duration, // Use PN's duration
    PN.currentInstrument, // Use the selected instrument's envelope
    PN.harmonic, // Use PN's harmonic function
    PN.volume // Use PN's volume level
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
 *   { duration: 1, notes: ['C4', 'E4', 'G4'] },
 *   { duration: 0.5, notes: ['A4', 'B4'] },
 *   { duration: 2, notes: ['D5'] }
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
    [],  // ch1: Will be filled with notes
    []   // ch2: Will be filled with notes
  );

  const parsedData = parseSongInput(songData);  // Parse the input data
  let songNotes = [];

  // Loop through each parsed entry and create notes using createNote
  parsedData.forEach(entry => {
    const { duration, notes } = entry; // Destructure duration and notes from parsedData

    // Set the duration for this note in PN (optional: use duration overrides)
    PN.duration = duration;

    // Loop through the notes and create each one using createNote
    notes.forEach(noteName => {
      const note = createNote(noteName); // Use createNote for each note
      if (note) {
        myTune.ch1.push(note); // Encode and add it to the song array
      }
    });
  });

  // Concatenate all notes to form the song
  var songDataOutput = myTune.encode();
  PN.songDataOutput = songDataOutput;
  return songDataOutput;
}

export { createNote, createSong };
