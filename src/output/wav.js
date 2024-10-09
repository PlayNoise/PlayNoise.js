import {mono} from './channels.js';

// Function to create WAV header using Uint8Array
function writeWaveHeader(dataLength, sampleRate) {
  const numChannels = 1, bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * bitsPerSample / 8;
  const blockAlign = numChannels * bitsPerSample / 8;

  // Uint8Array with a size of 44 bytes for the header
  const buffer = new Uint8Array(44);
  const view = new DataView(buffer.buffer);

  // "RIFF" chunk descriptor
  buffer.set([82, 73, 70, 70], 0); // "RIFF"
  view.setUint32(4, 36 + dataLength, true); // Chunk size
  buffer.set([87, 65, 86, 69], 8); // "WAVE"

  // "fmt " sub-chunk
  buffer.set([102, 109, 116, 32], 12); // "fmt "
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true);  // AudioFormat (1 for PCM)
  view.setUint16(22, numChannels, true); // NumChannels
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, byteRate, true); // ByteRate
  view.setUint16(32, blockAlign, true); // BlockAlign
  view.setUint16(34, bitsPerSample, true); // BitsPerSample

  // "data" sub-chunk
  buffer.set([100, 97, 116, 97], 36); // "data"
  view.setUint32(40, dataLength, true); // Subchunk2Size (data length)

  return buffer;
}

// Function to save WAV file
export function save(fileName = 'play-noise', sampleRate = 44100, volume = 5000) {
  const data = mono(); // Get the audio data from the mono function (assumed to be between -1 and 1)
  const bitsPerSample = 16;
  const numChannels = 2; // Stereo

  const maxVolume = 32767;
  const volumeScale = maxVolume / volume;

  // Create buffer for audio data (2 bytes per sample per channel)
  const buffer = new Uint8Array(data.length * numChannels * 2);
  const view = new DataView(buffer.buffer);

  for (let i = 0; i < data.length; i++) {
    const sample = Math.max(-1, Math.min(1, data[i] * volumeScale));
    const intSample = Math.floor(sample * 32767);

    // Write sample for both left and right channels
    view.setInt16(i * 4, intSample, true);       // Left channel
    view.setInt16(i * 4 + 2, intSample, true);   // Right channel
  }

  // Create WAV header
  const waveHeader = writeWaveHeader(buffer.length, sampleRate);

  // Combine header and audio data into one buffer
  const wavFile = new Uint8Array(waveHeader.length + buffer.length);
  wavFile.set(waveHeader, 0);
  wavFile.set(buffer, waveHeader.length);

  // Create a Blob from the WAV data
  const blob = new Blob([wavFile], { type: 'audio/wav' });

  // Create a download link and trigger it
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  console.log(`WAV file saved as ${fileName}`);
}
