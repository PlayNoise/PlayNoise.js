// wavProcessor.js
import {
  analyzeFrequencies,
  analyzeSmallChunkFrequencies,
  instantaneousFrequency,
} from "../input/fft.js";
import { ProgressID } from "../dom/dom.js";
var ProcessorProgress = 0;
/**
 * Reads a WAV file from the provided URL, parses it, and processes the audio data.
 * @param {string} url - The URL of the WAV file to read.
 */
function readWavFile(url, callback) {
  fetch(url)
    .then((response) => response.arrayBuffer())
    .then((buffer) => {
      const wavData = parseWav(buffer); // Parse the WAV file
      const sampleRate = wavData.sampleRate;
      const audioData = wavData.samples;

      //console.log("WAV file parsed successfully");
      //console.log("Sample Rate: ", sampleRate);
      //console.log("Number of samples: ", audioData.length);

      const allVoiceFrequencies = processAudioData(audioData, sampleRate, 2);
      //console.log("Voice F : ", voiceFrequencies);

      if (callback) {
        callback(allVoiceFrequencies); // Pass voiceFrequencies to the callback
      }
    })
    .catch((err) => {
      console.error("Error loading WAV file: ", err);
    });
}

/**
 * Parses WAV file data from an ArrayBuffer.
 * @param {ArrayBuffer} buffer - The WAV file buffer.
 * @returns {Object} Parsed WAV data including sample rate and audio samples.
 */
function parseWav(buffer) {
  const view = new DataView(buffer);
  const numChannels = view.getUint16(22, true);
  const sampleRate = view.getUint32(24, true);
  const bitsPerSample = view.getUint16(34, true);
  const dataOffset = 44; // WAV header size (assumes no additional sub-chunks)
  const bytesPerSample = bitsPerSample / 8;
  const numSamples = Math.floor(
    (view.byteLength - dataOffset) / (numChannels * bytesPerSample),
  );

  //console.log("Num Channels: ", numChannels);
  //console.log("Sample Rate: ", sampleRate);
  //console.log("Bits Per Sample: ", bitsPerSample);
  //console.log("Number of Samples: ", numSamples);

  const samples = new Float32Array(numSamples);

  for (let i = 0; i < numSamples; i++) {
    let sample = 0;
    const sampleIndex = dataOffset + i * numChannels * bytesPerSample;

    // Ensure we are not reading beyond the available buffer length
    if (sampleIndex >= buffer.byteLength) {
      console.error("Sample index exceeds buffer length at sample", i);
      break;
    }

    // If stereo, take only the left channel (instead of averaging)
    if (numChannels === 2) {
      const left = view.getInt16(sampleIndex, true);
      sample = left;
    } else {
      sample = view.getInt16(sampleIndex, true);
    }

    // Normalize to [-1, 1] range
    samples[i] = sample / 32768;
  }

  return {
    sampleRate: sampleRate,
    samples: samples,
  };
}

/**
 * @param {Float32Array} audioData - The audio data samples.
 * @param {number} sampleRate - The sample rate of the audio data.
 */
function processAudioData(audioData, sampleRate, n) {
  const chunkSize = 11025; // Adjusted chunk size for more effective analysis
  const numChunks = Math.ceil(audioData.length / chunkSize);

  // First loop: Process chunks from 0, 44100, 88200, ...
  const results = [];
  var ProcessorProgressCounter = 0;

  for (let offsetMultiplier = 0; offsetMultiplier < n; offsetMultiplier++) {
    const offset = 4410 * offsetMultiplier;
    const voiceFrequencies = new Map();

    for (let i = 0; i < Math.ceil(audioData.length / chunkSize); i++) {
      const start = i * chunkSize + offset;
      const end = Math.min(start + chunkSize, audioData.length);
      const chunk = audioData.slice(start, end);

      const result = analyzeFrequencies(chunk, sampleRate);
      ProcessorProgressCounter++;
      ProcessorProgress =
        (ProcessorProgressCounter /
          (n * Math.ceil(audioData.length / chunkSize))) *
        100;
      console.log(`Processor P ${ProcessorProgress}`);
      if (!isNaN(result.dominantFrequency)) {
        //console.log(`Chunk (offset ${offset}): Frequency = ${result.dominantFrequency} Hz, Volume = ${result.volume}, Duration = ${result.duration}`);
        voiceFrequencies.set(i, [
          result.dominantFrequency,
          result.volume,
          result.duration,
        ]);
      } else {
        //console.log(`Chunk (offset ${offset}): Frequency could not be determined (NaN)`);
      }
    }
    results.push(voiceFrequencies);
  }
  return results;
}

function updateProgressBarById(id, value) {
  const progressBar = document.getElementById(id);
  progressBar.style.width = `${value}%`;
}

// Export functions and data for CommonJS
export { readWavFile, parseWav, processAudioData, ProcessorProgress };
