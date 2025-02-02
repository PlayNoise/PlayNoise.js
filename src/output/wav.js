import PN from "../pn.js"; // Import the PN module for accessing current instrument data
import { mono, stereo } from "./channels.js"; // Import mono and stereo functions for audio channel data

/**
 * Creates a WAV header using a Uint8Array.
 * 
 * @param {number} dataLength - The length of the audio data in bytes.
 * @param {number} sampleRate - The sample rate of the audio signal.
 * @param {number} [numChannels=2] - The number of audio channels (default is stereo).
 * @param {number} [bitsPerSample=16] - The bit depth of the audio samples (default is 16 bits).
 * @returns {Uint8Array} - A Uint8Array containing the WAV header.
 */
function writeWaveHeader(dataLength, sampleRate, numChannels = 2, bitsPerSample = 16) {
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8; // Calculate byte rate
  const blockAlign = (numChannels * bitsPerSample) / 8; // Calculate block alignment

  // Create a Uint8Array with a size of 44 bytes for the WAV header
  const buffer = new Uint8Array(44);
  const view = new DataView(buffer.buffer); // Create a DataView for easier manipulation of binary data

  // "RIFF" chunk descriptor
  buffer.set([82, 73, 70, 70], 0); // Set "RIFF" identifier
  view.setUint32(4, 36 + dataLength, false); // Set chunk size (file size minus 8 bytes)
  buffer.set([87, 65, 86, 69], 8); // Set "WAVE" format identifier

  // "fmt " sub-chunk
  buffer.set([102, 109, 116, 32], 12); // Set "fmt " sub-chunk identifier
  view.setUint32(16, 16, true); // Set Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // Set AudioFormat (1 for PCM)
  view.setUint16(22, numChannels, true); // Set NumChannels
  view.setUint32(24, sampleRate, true); // Set SampleRate
  view.setUint32(28, byteRate, true); // Set ByteRate
  view.setUint16(32, blockAlign, true); // Set BlockAlign
  view.setUint16(34, bitsPerSample, true); // Set BitsPerSample

  // "data" sub-chunk
  buffer.set([100, 97, 116, 97], 36); // Set "data" sub-chunk identifier
  view.setUint32(40, dataLength, false); // Set Subchunk2Size (data length)

  return buffer; // Return the constructed WAV header
}

/**
 * Saves the audio data as a WAV file.
 * 
 * @param {string} [fileName=`play-noise-${PN.currentInstrumentName}`] - The name of the file to save.
 * @param {number} [sampleRate=44100] - The sample rate of the audio signal.
 * @param {number} [volume=5000] - The volume level to scale the audio samples.
 */
export function save(fileName = `play-noise-${PN.currentInstrumentName}`, sampleRate = 44100, volume = 5000) {

  const { leftChannel, rightChannel } = stereo(); // Get stereo audio data from channels.js
  const bitsPerSample = 16; // Define bit depth for output WAV file
  const numChannels = 2; // Stereo output

  const maxVolume = 32767; // Maximum volume level for audio samples
  const volumeScale = maxVolume / volume; // Scale factor to adjust volume level

  // Ensure both channels have the same length
  const dataLength = leftChannel.length;

  // Create buffer for audio data (2 bytes per sample per channel)
  const buffer = new Uint8Array(dataLength * numChannels * (bitsPerSample / 8));

  const view = new DataView(buffer.buffer); // Create a DataView for writing audio samples

  for (let i = 0; i < dataLength; i++) {
    const leftSample = Math.max(-1, Math.min(1, leftChannel[i] * volumeScale)); // Scale left channel sample
    const rightSample = Math.max(-1, Math.min(1, rightChannel[i] * volumeScale)); // Scale right channel sample

    const leftIntSample = Math.floor(leftSample * maxVolume); // Convert scaled sample to integer format
    const rightIntSample = Math.floor(rightSample * maxVolume);

    // Write samples for left and right channels into the buffer
    view.setInt16(i * numChannels * (bitsPerSample / 8), leftIntSample, true); // Left channel sample at even index
    view.setInt16(i * numChannels * (bitsPerSample / 8) + (bitsPerSample / 8), rightIntSample, true); // Right channel sample at odd index
  }

  // Create WAV header using the total length of the audio data buffer
  const waveHeader = writeWaveHeader(buffer.length, sampleRate, numChannels, bitsPerSample);

  // Combine header and audio data into one buffer
  const wavFile = new Uint8Array(waveHeader.length + buffer.length);
  wavFile.set(waveHeader, 0); // Copy header into wavFile
  wavFile.set(buffer, waveHeader.length); // Append audio data to wavFile

  // Create a Blob from the WAV data for downloading
  const blob = new Blob([wavFile], { type: "audio/wav" });

  // Create a download link and trigger it programmatically
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${fileName}.wav`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  console.log(`WAV file saved as ${fileName}`); // Log confirmation message after saving the file
}
