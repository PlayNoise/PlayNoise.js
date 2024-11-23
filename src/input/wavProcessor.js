// wavProcessor.js
import {analyzeFrequencies , analyzeSmallChunkFrequencies, instantaneousFrequency } from '../input/fft.js';

/**
 * Reads a WAV file from the provided URL, parses it, and processes the audio data.
 * @param {string} url - The URL of the WAV file to read.
 */
function readWavFile(url, callback) {
  fetch(url)
      .then(response => response.arrayBuffer())
      .then(buffer => {
          const wavData = parseWav(buffer); // Parse the WAV file
          const sampleRate = wavData.sampleRate;
          const audioData = wavData.samples;

          //console.log("WAV file parsed successfully");
          //console.log("Sample Rate: ", sampleRate);
          //console.log("Number of samples: ", audioData.length);

          const voiceFrequencies = processAudioData(audioData, sampleRate);
          //console.log("Voice F : ", voiceFrequencies);


          if (callback) {
              callback(voiceFrequencies); // Pass voiceFrequencies to the callback
          }
      })
      .catch(err => {
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
  const numSamples = Math.floor((view.byteLength - dataOffset) / (numChannels * bytesPerSample));

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
function processAudioData(audioData, sampleRate) {
  let voiceFrequencies = new Map();
  const chunkSize = 8; // Adjusted chunk size for more effective analysis
  const numChunks = Math.ceil(audioData.length / chunkSize);

  //console.log("Number of Chunks:", numChunks);

  for (let i = 0; i < numChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, audioData.length);
    const chunk = audioData.slice(start, end);

    // Call the analyzeFrequencies function
    const result = analyzeFrequencies(chunk, sampleRate);

    if (!isNaN(result.dominantFrequency)) {
      console.log(`Chunk ${i + 1}: Frequency = ${result.dominantFrequency} Hz, Volume = ${result.volume}, Duration = ${result.duration}`);
      voiceFrequencies.set(i, [result.dominantFrequency, result.volume, result.duration]);
    } else {
      console.log(`Chunk ${i + 1}: Frequency could not be determined (NaN)`);
    }
  }

  //console.log("Processed Voice Frequencies:", voiceFrequencies); // Log all voice frequencies
  return voiceFrequencies;
}

// Export functions and data for CommonJS
export {
  readWavFile,
  parseWav,
  processAudioData,
};