import { yin } from "../input/yin.js"; // Import the YIN algorithm for frequency analysis

var voiceFrequencies = new Map(); // Map to store voice frequencies for each audio chunk
var volumeDuration = []; // Array to hold volume and duration data (currently unused)

/**
 * Reads a WAV file from the given URL, parses it, and processes the audio data.
 * 
 * @param {string} url - The URL of the WAV file to read.
 * @param {function} callback - A callback function to handle the processed voice frequencies.
 */
function yinReadWavFile(url, callback) {
  fetch(url)
    .then((response) => response.arrayBuffer())
    .then((buffer) => {
      const wavData = yinParseWav(buffer); // Parse the WAV file to extract audio data
      const sampleRate = wavData.sampleRate; // Extract sample rate from parsed data
      const audioData = wavData.samples; // Extract audio samples

      // Debugging output to verify WAV file parsing
      //console.log("WAV file parsed successfully");
      //console.log("Sample Rate: ", sampleRate);
      //console.log("Number of samples: ", audioData.length);

      const voiceFrequencies = yinProcessAudioData(audioData, sampleRate); // Process audio data for frequency analysis
      //console.log("Voice F : ", voiceFrequencies);

      if (callback) {
        callback(voiceFrequencies); // Pass processed voice frequencies to the callback function
      }
    })
    .catch((err) => {
      console.error("Error loading WAV file: ", err); // Handle errors during fetching or processing
    });
}

/**
 * Parses WAV file data from an ArrayBuffer.
 * 
 * @param {ArrayBuffer} buffer - The WAV file buffer.
 * @returns {Object} Parsed WAV data including sample rate and audio samples.
 */
function yinParseWav(buffer) {
  const view = new DataView(buffer); // Create a DataView for reading binary data

  // WAV file parsing: Extract header info and PCM data
  const numChannels = view.getUint16(22, true); // Number of audio channels
  const sampleRate = view.getUint32(24, true); // Sample rate in Hertz
  const bitsPerSample = view.getUint16(34, true); // Bit depth of audio samples
  const dataOffset = 44; // WAV header size (assumes no additional sub-chunks)
  const bytesPerSample = bitsPerSample / 8; // Calculate bytes per sample
  const numSamples = Math.floor(
    (view.byteLength - dataOffset) / (numChannels * bytesPerSample),
  ); // Total number of samples in the audio data

  console.log("Num Channels: ", numChannels);
  console.log("Sample Rate: ", sampleRate);
  console.log("Bits Per Sample: ", bitsPerSample);
  console.log("Number of Samples: ", numSamples);

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
 * Processes audio data in chunks to analyze frequencies using the YIN algorithm.
 * 
 * @param {Float32Array} audioData - The time-domain audio signal samples.
 * @param {number} sampleRate - The sample rate of the audio signal.
 * @returns {Map} A map containing frequency information for each chunk.
 */
function yinProcessAudioData(audioData, sampleRate) {
  let voiceFrequencies = new Map(); // Map to store frequency results for each chunk

  const chunkSize = 216; // Define chunk size for processing
  const numChunks = Math.ceil(audioData.length / chunkSize); // Calculate number of chunks based on chunk size
  var myObj1 = []; // Unused variable (can be removed if not needed)

  console.log("numChunks : " + numChunks); // Log number of chunks being processed
  var currentDuration; // Variable to hold current duration (currently unused)

  for (let i = 0; i < numChunks; i++) {
    const start = i * chunkSize; // Calculate start index for current chunk
    const end = Math.min(start + chunkSize, audioData.length); // Calculate end index ensuring it doesn't exceed bounds
    const chunk = audioData.slice(start, end); // Extract current chunk from audio data

    // Call the analyzeFrequencies function using the YIN algorithm
    const result = yin(chunk, sampleRate);

    if (!isNaN(result.frequency)) {
      console.log(
        `Chunk ${i + 1}: Frequency = ${result.frequency} Hz, Volume = ${result.volume}, Duration = ${result.duration}`,
      );

      voiceFrequencies.set(i, [
        result.frequency,
        result.volume,
        result.duration,
      ]);
    } else {
      console.log(`Chunk ${i + 1}: Frequency could not be determined (NaN)`);
    }
  }

  console.log("Voice F : ", voiceFrequencies); // Log all processed voice frequencies after completion
  return voiceFrequencies; // Return the map of voice frequencies
}

// Export functions and data for CommonJS module system
export { yinReadWavFile, yinParseWav, yinProcessAudioData };
