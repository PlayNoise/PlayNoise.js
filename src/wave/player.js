import PN from '../pn.js';
import { Note ,  Tune  } from './encoder.js'; 
import { first } from './harmonic.js'; 
import { Instruments } from '../instruments/instruments.js';
import parseSongInput from '../input/parseStringInput.js';
import pitchFrequencies from '../pitchFrequencies.json';
import {readWavFile} from '../input/wavProcessor.js';
import {setInputInstrument} from './utils.js'

/**
 * Creates a musical note with the given note name.
 * If no instrument is selected, it defaults to Piano.
 *
 * @param {string|number} noteName - The name or number of the musical note (e.g., "A4", "440").
 * @returns {Note|undefined} - A new Note instance with the specified pitch, or undefined if the note is not found.
 *
 * @example
 * // Select an instrument and create a note
 * PN.instrument('piano');    // Select piano instrument
 * const note = createNote('C4'); // Creates a note with frequency for C4
 * console.log(note);         // Logs the created note
 * PN.save();
 */

function createNote(noteName) {
  // Set default instrument to piano if no instrument is selected
  if (!PN.currentInstrument) {
    console.log('No instrument selected, defaulting to Piano.');
    PN.currentInstrument = new Instruments().Piano(); // Default to piano
  }

  var frequency = pitchFrequencies[noteName];
  if (!frequency) {
    frequency = parseInt(noteName);
    if (isNaN(frequency)){
      console.log(`Note ${noteName} not found!`);
      return;      
    }
  }

  if (typeof noteName === 'number'){
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
  
  setInputInstrument('note')
  
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

function closestPianoFrequency(frequency) {
    if (frequency <= 0) {
        return  0;
    }

    // Calculate the closest piano key number
    const keyNumber = 49 + 12 * Math.log2(frequency / 440);
    const closestKey = Math.round(keyNumber);

    // Calculate the frequency of the closest piano key
    const closestFrequency = 440 * Math.pow(2, (closestKey - 49) / 12);
    //console.log(`closestFrequency ${closestFrequency} and original ${frequency}!`)

    return  convertToOctave(closestFrequency, 4);
    //return  closestFrequency;

}

function convertToOctave(frequency, targetOctave) {
    if (frequency <= 0) return null;

    // Determine the original octave
    const originalOctave = Math.floor(Math.log2(frequency / 440) * 12 / 12 + 4);

    // Shift the frequency to the target octave
    const scaledFrequency = frequency * Math.pow(2, targetOctave - originalOctave);
        console.log(`scaledFrequency ${scaledFrequency} and original ${frequency}!`);

    return scaledFrequency;
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
 *           PN.instrument('British'); // Select the instrument
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

  readWavFile(audioFile, (voiceFrequencies) => {

        const skeleton = voiceFrequencies; // Assign voiceFrequencies to skeleton

        const myTune = new Tune(
          PN.key,
            [],  // ch1: Will be filled with notes
            []   // ch2: Will be filled with notes
            );

        // Iterate over each entry in the `skeleton` Map
        skeleton.forEach((data, index) => {
          var frequency;
          if ((data[0] / 1000 >= 1) || (data[0] < 80)){
              frequency = closestPianoFrequency(87);
          }else{
            frequency = closestPianoFrequency(data[0]);
          }

            const note = new Note(

                //[Math.round(frequency)],             // Frequency
                [Math.round(frequency)],
                [0],                 // No accidentals
                data[2]/2,            // Duration
                PN.currentInstrument, // oscillators
                PN.harmonic,         // Harmonic function
                data[1]/2,      // Volume
            );
            if (note) {
                myTune.ch1.push(note);
            }
        });
        


        // Concatenate all notes to form the song
const songDataOutput = myTune.encode();
PN.songDataOutput = songDataOutput;
return songDataOutput;
});
}

export { createNote, createSong , singVoice};
