// wavProcessor.js
import {
  analyzeFrequencies,
  analyzeSmallChunkFrequencies,
  instantaneousFrequency,
} from "../input/fft.js";
import { ProgressID } from "../dom/dom.js";

let ProcessorProgress = 0; // Global variable to track processing progress

/**
 * Reads a WAV file from the provided URL, parses it, and processes the audio data.
 * @param {string} url - The URL of the WAV file to read.
 * @param {function} callback - A callback function to handle the processed audio data.
 */
function readWavFile(url, callback) {
  fetch(url)
    .then((response) => response.arrayBuffer())
    .then((buffer) => {
      const wavData = parseWav(buffer); // Parse the WAV file
      const sampleRate = wavData.sampleRate; // Extract sample rate
      const audioData = wavData.samples; // Extract audio samples

      // Uncomment for debugging
      //console.log("WAV file parsed successfully");
      //console.log("Sample Rate: ", sampleRate);
      //console.log("Number of samples: ", audioData.length);

      const allVoiceFrequencies = processAudioData(audioData, sampleRate, 2); // Process audio data
      // Uncomment for debugging
      //console.log("Voice Frequencies: ", allVoiceFrequencies);

      if (callback) {
        callback(allVoiceFrequencies); // Pass processed frequencies to the callback
      }
    })
    .catch((err) => {
      console.error("Error loading WAV file: ", err); // Handle errors
    });
}

/**
 * Parses WAV file data from an ArrayBuffer.
 * @param {ArrayBuffer} buffer - The WAV file buffer.
 * @returns {Object} Parsed WAV data including sample rate and audio samples.
 */
function parseWav(buffer) {
  const view = new DataView(buffer); // Create a DataView for reading binary data
  const numChannels = view.getUint16(22, true); // Get number of audio channels
  const sampleRate = view.getUint32(24, true); // Get sample rate
  const bitsPerSample = view.getUint16(34, true); // Get bits per sample
  const dataOffset = 44; // WAV header size (assumes no additional sub-chunks)
  const bytesPerSample = bitsPerSample / 8; // Calculate bytes per sample
  const numSamples = Math.floor(
    (view.byteLength - dataOffset) / (numChannels * bytesPerSample),
  ); // Calculate total number of samples

  // Uncomment for debugging
  //console.log("Num Channels: ", numChannels);
  //console.log("Sample Rate: ", sampleRate);
  //console.log("Bits Per Sample: ", bitsPerSample);
  //console.log("Number of Samples: ", numSamples);

  const samples = new Float32Array(numSamples); // Initialize array for normalized samples

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
 * Processes audio data to analyze frequencies in chunks.
 * @param {Float32Array} audioData - The audio data samples.
 * @param {number} sampleRate - The sample rate of the audio data.
 * @param {number} n - The number of offsets to process.
 * @returns {Array} An array of Maps containing voice frequency analysis results for each chunk.
 */
function processAudioData(audioData, sampleRate, n) {
  const chunkSize = 11025; // Adjusted chunk size for more effective analysis
  const numChunks = Math.ceil(audioData.length / chunkSize);

  const results = []; // Array to store results from each offset processing
  let ProcessorProgressCounter = 0;

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

      console.log(`Processor Progress: ${ProcessorProgress.toFixed(2)}%`);

      if (!isNaN(result.dominantFrequency)) {
        voiceFrequencies.set(i, [
          result.dominantFrequency,
          result.volume,
          result.duration,
        ]);
        // Uncomment for debugging
        //console.log(`Chunk (offset ${offset}): Frequency = ${result.dominantFrequency} Hz, Volume = ${result.volume}, Duration = ${result.duration}`);
      } else {
        // Uncomment for debugging
        //console.log(`Chunk (offset ${offset}): Frequency could not be determined (NaN)`);
      }
    }

    results.push(voiceFrequencies);
  }

  return results;
}

/**
 * Updates the progress bar UI element by its ID with the specified value.
 * @param {string} id - The ID of the progress bar element.
 * @param {number} value - The progress value as a percentage.
 */
function updateProgressBarById(id, value) {
  const progressBar = document.getElementById(id);

  if (progressBar) {
    progressBar.style.width = `${value}%`;
  } else {
    console.error(`Progress bar with ID '${id}' not found.`);
  }
}

// Export functions and data for CommonJS module system
export { readWavFile, parseWav, processAudioData, ProcessorProgress };
