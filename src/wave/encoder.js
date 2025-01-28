import {
  rest,
  noteData,
  noteData3,
  concat,
  frequency,
  inKey,
  inNote,
  voiceData,
  getInputInstrument,
} from "./synth.js";
import { EnvelopeAHDSR } from "./synth.js";
let LeftChannel;
let RightChannel;
// Define pitch and keys globally
let pitch = {};
let tuneKey = {};
let sharpKeys = [];
let flatKeys = [];
export var EncoderProgress = 0;
export var InterweaveProgressCH1 = 0;
export var InterweaveProgressCH2 = 0;

// Initialize pitches and keys
setupPitches();
setupKeys();

// Note class representing a musical note
class Note {
  constructor(
    pitch = [],
    accidental = [],
    length,
    env,
    har1,
    har2,
    step,
    fil,
    fil2,
    width1,
    width2,
    filEnv,
    lfoWave,
    glideTime,
    vol,
    multi,
    noiseL,
    noiseS,
    ratio,
  ) {
    this.pitch = Array.isArray(pitch) ? pitch : [];
    this.accidental = accidental.length
      ? accidental
      : Array(this.pitch.length).fill(0);
    this.length = length;
    this.env = env;
    this.har1 = har1;
    this.har2 = har2;
    this.step = step;
    this.fil = fil;
    this.fil2 = fil2;
    this.width1 = width1;
    this.width2 = width2;
    this.filEnv = filEnv;
    this.lfoWave = lfoWave;
    this.glideTime = glideTime;
    this.vol = vol;
    this.multi = multi;
    this.noiseL = noiseL;
    this.noiseS = noiseS;
    this.ratio = ratio;
  }

  encodeNote() {
    if (this.pitch.length === 0) {
      return rest(this.length); // Handle rest
    }

    const noteDataArray = this.pitch.map((p, i) => {
      const adjustedPitch = p + (this.accidental[i] || 0);
      const frequencyValue = adjustedPitch;

      return noteData(
        frequencyValue,
        this.length,
        this.env,
        this.har1,
        this.har2,
        this.step,
        this.fil,
        this.fil2,
        this.width1,
        this.width2,
        this.filEnv,
        this.lfoWave,
        this.glideTime,
        this.vol,
        this.multi,
        this.noiseL,
        this.noiseS,
        this.ratio,
      );
    });
    return concatNotes(...noteDataArray);
  }
  encodeNote3() {
    if (this.pitch.length === 0) {
      return rest(this.length); // Handle rest
    }

    const noteDataArray = this.pitch.map((p, i) => {
      const adjustedPitch = p + (this.accidental[i] || 0);
      const frequencyValue = adjustedPitch;

      return noteData3(
        frequencyValue,
        this.length,
        this.env,
        this.har1,
        this.har2,
        this.step,
        this.fil,
        this.fil2,
        this.width1,
        this.width2,
        this.filEnv,
        this.lfoWave,
        this.glideTime,
        this.vol,
        this.multi,
        this.noiseL,
        this.noiseS,
        this.ratio,
      );
    });
    return concatNotes(...noteDataArray);
  }
}

class Tune {
  constructor(key, ...channels) {
    this.key = key;
    // Assign channels dynamically while maintaining numbered references
    this.channels = channels.map((ch) => this.ensureNotes(ch || []));

    // Optionally assign numbered properties for backward compatibility
    this.channels.forEach((channel, index) => {
      this[`ch${index + 1}`] = channel;
    });
  }

  // Ensure that all items in the array are instances of the Note class
  ensureNotes(notes) {
    return notes.map((note) => {
      if (note instanceof Note) {
        return note;
      } else {
        return new Note(
          note.pitch,
          note.accidental,
          note.length,
          note.env,
          note.har,
          note.vol,
        );
      }
    });
  }

  encode() {
    const acc = inKey(sharpKeys, this.key)
      ? 1
      : inKey(flatKeys, this.key)
        ? -1
        : 0;

    this.channels.forEach((channel) => {
      channel.forEach((note) => adjustAccidentals(note, acc));
    });

    let channelData = []; // Array to hold data for all channels
    const currentInputInstrument = getInputInstrument();

    let numberOfChannels = 100;
    let channels = Array.from(
      { length: numberOfChannels },
      (_, i) => this[`ch${i + 1}`],
    );

    var EncoderProgressCounter = 0;

    for (let i = 0; i < channels.length; i++) {
      const channel = channels[i];
      let channelEncodedData = [];

      for (let j = 0; j < channel.length; j++) {
        const note = channel[j];
        //console.log(`Note ch${i + 1} ${JSON.stringify(note)}`);

        let encoded = note.encodeNote();
        channelEncodedData.push(encoded);
        EncoderProgressCounter++;
        EncoderProgress =
          (EncoderProgressCounter / (channel.length * channel.length)) * 100;
        console.log(`Encoding ch${EncoderProgress} %`);
      }

      channelData.push(channelEncodedData);
    }

    // Flattening all channel data
    let flattenedChannels = channelData.map((data) => data.flat());

    // Dynamically assign flattened data to c1, c2, c3, ...
    const [c1, c2, c3, c4] = flattenedChannels; // Adjust based on the number of channels you expect
    // Calculate maxLength dynamically based on all channels
    const maxLength = Math.max(
      ...flattenedChannels.map((channel) => channel.length),
    );
    const overlaidData = new Array(maxLength).fill(0);
    var InterweaveProgressCounterCH1 = 0;

    // Define offsets dynamically
    const offsets = flattenedChannels.map((_, i) => i * 2205);

    // Overlay data for all channels1
    for (let chanIndex = 0; chanIndex < flattenedChannels.length; chanIndex++) {
      const offset = offsets[chanIndex];
      const channelData = flattenedChannels[chanIndex];

      for (let i = 0; i < channelData.length; i++) {
        overlaidData[i + offset] += channelData[i];
      }
    }

    //return overlaidData;
    LeftChannel = overlaidData;
    RightChannel = overlaidData;
  }

  encodePlane() {
    const acc = inKey(sharpKeys, this.key)
      ? 1
      : inKey(flatKeys, this.key)
        ? -1
        : 0;

    this.ch1.forEach((note) => adjustAccidentals(note, acc));
    this.ch2.forEach((note) => adjustAccidentals(note, acc));

    const ch1Data = [];
    const ch2Data = [];
    const currentInputInstrument = getInputInstrument();
    for (let i = 0; i < this.ch1.length; i++) {
      const note = this.ch1[i];
      console.log(`Note ch1 ${JSON.stringify(note)}`);

      let encoded = note.encodeNote3();
      ch1Data.push(encoded);
      console.log(encoded);
    }

    for (let i = 0; i < this.ch2.length; i++) {
      const note = this.ch2[i];
      console.log(`Note ch2 ${JSON.stringify(note)}`);

      let encoded = note.encodeNote3();
      ch2Data.push(encoded);
    }

    //    return stereo(ch1Data.flat(), ch2Data.flat());

    LeftChannel = ch1Data.flat();
    RightChannel = ch2Data.flat();
    console.log(LeftChannel);
    console.log(RightChannel);
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
      throw new Error("Length of notes are not the same");
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

  note.accidental = note.accidental.map((a) => a + acc);
}

function setupPitches() {
  const notes = ["c", "d", "e", "f", "g", "a", "b"];
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
  tuneKey["C"] = [];

  const sharpKeys = ["G", "D", "A", "E", "B", "F#", "C#"];
  const sharpNotes = [
    pitch["f1"],
    pitch["c1"],
    pitch["g1"],
    pitch["d1"],
    pitch["a1"],
    pitch["e1"],
    pitch["b1"],
  ];

  sharpKeys.forEach((key, i) => {
    let k = [];
    for (let j = 0; j < i + 1; j++) {
      for (let l = 1; l < 6; l++) {
        k.push(sharpNotes[j] + 12 * l);
      }
    }
    tuneKey[key] = k;
  });

  const flatKeys = ["F", "Bb", "Eb", "Ab", "Db", "Gb", "Cb"];
  const flatNotes = [
    pitch["b1"],
    pitch["e1"],
    pitch["a1"],
    pitch["d1"],
    pitch["g1"],
    pitch["c1"],
    pitch["f1"],
  ];

  flatKeys.forEach((key, i) => {
    let k = [];
    for (let j = 0; j < i + 1; j++) {
      for (let l = 1; l < 6; l++) {
        k.push(flatNotes[j] + 12 * l);
      }
    }
    tuneKey[key] = k;
  });
}

export { Note, Tune, LeftChannel, RightChannel };
