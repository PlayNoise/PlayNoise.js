// Declare global variables for audio context and media recorder
let audioContext;
let mediaRecorder;
let audioChunks = [];

// Function to generate a WAV file header
// The header is crucial for proper WAV file formatting and playback
function writeWaveHeader(dataLength, sampleRate) {
  const numChannels = 1, // Mono audio
    bitsPerSample = 16, // Audio quality (16 bits per sample)
    byteRate = (sampleRate * numChannels * bitsPerSample) / 8, // Byte rate calculation for audio format
    blockAlign = (numChannels * bitsPerSample) / 8; // Block alignment for audio data

  // Initialize a buffer of 44 bytes (standard size for WAV headers)
  const buffer = new Uint8Array(44);
  const view = new DataView(buffer.buffer);

  // RIFF chunk descriptor (identifies file type)
  buffer.set([82, 73, 70, 70], 0); // "RIFF"
  view.setUint32(4, 36 + dataLength, true); // Total chunk size
  buffer.set([87, 65, 86, 69], 8); // "WAVE"

  // Format sub-chunk for audio details
  buffer.set([102, 109, 116, 32], 12); // "fmt "
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM format)
  view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
  view.setUint16(22, numChannels, true); // Number of audio channels (Mono)
  view.setUint32(24, sampleRate, true); // Audio sample rate
  view.setUint32(28, byteRate, true); // Byte rate (samples per second * bytes per sample)
  view.setUint16(32, blockAlign, true); // Block alignment (data per sample)
  view.setUint16(34, bitsPerSample, true); // Bits per sample (16 bits)

  // Data sub-chunk (actual audio data)
  buffer.set([100, 97, 116, 97], 36); // "data"
  view.setUint32(40, dataLength, true); // Data size (length of audio data)

  return buffer;
}

// Function to save audio data as a WAV file
function saveWavFile(audioBuffer, sampleRate, fileName) {
  const bitsPerSample = 16; // Standard 16-bit audio
  const numChannels = 1; // Mono audio (1 channel)
  const maxVolume = 32767; // Maximum possible value for 16-bit audio

  // Initialize an array to hold the audio data in WAV format
  const buffer = new Uint8Array(audioBuffer.length * numChannels * 2);
  const view = new DataView(buffer.buffer);

  // Loop through the audio buffer and convert each sample to the correct format
  for (let i = 0; i < audioBuffer.length; i++) {
    const sample = Math.max(-1, Math.min(1, audioBuffer[i])); // Ensure sample is between -1 and 1
    const intSample = Math.floor(sample * maxVolume); // Convert to 16-bit PCM format

    // Write the sample as a 16-bit integer (for mono channel)
    view.setInt16(i * 2, intSample, true); // Little-endian format
  }

  // Generate the WAV file header
  const waveHeader = writeWaveHeader(buffer.length, sampleRate);

  // Combine the header and audio data into a single buffer
  const wavFile = new Uint8Array(waveHeader.length + buffer.length);
  wavFile.set(waveHeader, 0); // Add the header at the beginning
  wavFile.set(buffer, waveHeader.length); // Add the audio data

  // Create a Blob containing the WAV file data
  const blob = new Blob([wavFile], { type: "audio/wav" });

  // Generate a download link for the WAV file and trigger the download
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); // Create a temporary URL for the blob
  a.download = fileName + ".wav"; // Name the file with the given fileName
  document.body.appendChild(a); // Append the link to the document body
  a.click(); // Simulate a click to trigger the download
  document.body.removeChild(a); // Remove the link after downloading

  // Log success message to console
  console.log(`WAV file saved as ${fileName}.wav`);
}

// Function to start recording audio and save it as a WAV file
function startRecording(fileName) {
  // Access the user's microphone using the Web Audio API
  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    // Create an AudioContext to process the audio stream
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const input = audioContext.createMediaStreamSource(stream);

    // Set up a script processor for audio processing
    const recorder = audioContext.createScriptProcessor(4096, 1, 1);
    input.connect(recorder);
    recorder.connect(audioContext.destination); // Connect to the audio context's destination (speakers)

    // Handle audio processing events
    recorder.onaudioprocess = function (e) {
      const audioData = e.inputBuffer.getChannelData(0); // Get the audio data from the first channel (mono)
      audioChunks.push(...audioData); // Add the audio data to the global array
    };

    // Define the mediaRecorder object with a stop method for stopping the recording
    mediaRecorder = {
      stop: () => {
        // Stop recording and disconnect all audio nodes
        recorder.disconnect();
        input.disconnect();
        stream.getTracks().forEach((track) => track.stop()); // Stop all media tracks

        // Save the recorded audio as a WAV file
        saveWavFile(audioChunks, audioContext.sampleRate, fileName);
        audioChunks = []; // Clear the audio chunks array after saving
      },
    };
  });
}
