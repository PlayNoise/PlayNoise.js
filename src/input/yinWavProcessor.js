import { yin } from "../input/yin.js";

var voiceFrequencies = new Map();
var volumeDuration = [];

function yinReadWavFile(url, callback) {
  fetch(url)
    .then((response) => response.arrayBuffer())
    .then((buffer) => {
      const wavData = yinParseWav(buffer); // Parse the WAV file
      const sampleRate = wavData.sampleRate;
      const audioData = wavData.samples;

      //console.log("WAV file parsed successfully");
      //console.log("Sample Rate: ", sampleRate);
      //console.log("Number of samples: ", audioData.length);

      const voiceFrequencies = yinProcessAudioData(audioData, sampleRate);
      //console.log("Voice F : ", voiceFrequencies);

      if (callback) {
        callback(voiceFrequencies); // Pass voiceFrequencies to the callback
      }
    })
    .catch((err) => {
      console.error("Error loading WAV file: ", err);
    });
}

function yinParseWav(buffer) {
  const view = new DataView(buffer);

  // WAV file parsing: Extract header info and PCM data
  const numChannels = view.getUint16(22, true);
  const sampleRate = view.getUint32(24, true);
  const bitsPerSample = view.getUint16(34, true);
  const dataOffset = 44; // WAV header size (assumes no additional sub-chunks)
  const bytesPerSample = bitsPerSample / 8;
  const numSamples = Math.floor(
    (view.byteLength - dataOffset) / (numChannels * bytesPerSample),
  );

  console.log("Num Channels: ", numChannels);
  console.log("Sample Rate: ", sampleRate);
  console.log("Bits Per Sample: ", bitsPerSample);
  console.log("Number of Samples: ", numSamples);

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

function yinProcessAudioData(audioData, sampleRate) {
  let voiceFrequencies = new Map();

  const chunkSize = 216; // Use 11025 samples for each chunk
  const numChunks = Math.ceil(audioData.length / chunkSize);
  var myObj1 = [];

  console.log("numChunks : " + numChunks);
  var currentDuration;

  for (let i = 0; i < numChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, audioData.length);
    const chunk = audioData.slice(start, end);

    // Call the analyzeFrequencies function
    // Use the enhanced YIN algorithm to get frequency, duration, and volume
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

  console.log("Voice F : ", voiceFrequencies); // This will log after processing is complete
  return voiceFrequencies;
}

// Export functions and data for CommonJS
export { yinReadWavFile, yinParseWav, yinProcessAudioData };
