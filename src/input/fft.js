// Function to pad data to the next power of 2
function padToPowerOfTwo(data) {
  const nextPowerOfTwo = Math.pow(2, Math.ceil(Math.log2(data.length)));
  const paddedData = new Array(nextPowerOfTwo).fill(0);
  for (let i = 0; i < data.length; i++) {
    paddedData[i] = data[i];
  }
  return paddedData;
}

// Function to perform FFT (recursive implementation)
function fft(data) {
  const n = data.length;
  if (n <= 1) return data;

  // Separate even and odd terms
  const even = fft(data.filter((_, i) => i % 2 === 0));
  const odd = fft(data.filter((_, i) => i % 2 !== 0));

  const results = new Array(n).fill(0).map(() => [0, 0]);
  for (let k = 0; k < n / 2; k++) {
    const expTerm = (-2 * Math.PI * k) / n;
    const cosine = Math.cos(expTerm);
    const sine = Math.sin(expTerm);

    // Calculate the real and imaginary parts
    const real = cosine * odd[k][0] - sine * odd[k][1];
    const imag = sine * odd[k][0] + cosine * odd[k][1];

    results[k] = [even[k][0] + real, even[k][1] + imag];
    results[k + n / 2] = [even[k][0] - real, even[k][1] - imag];
  }

  return results;
}

// Function to compute magnitudes from FFT output
function computeMagnitudes(fftData) {
  return fftData.map(([real, imag]) => Math.sqrt(real ** 2 + imag ** 2));
}

// Function to calculate RMS for volume estimation
function calculateRMS(data) {
  let sumSquares = 0;
  for (let i = 0; i < data.length; i++) {
    sumSquares += data[i] * data[i];
  }
  return Math.sqrt(sumSquares / data.length);
}

// Function to analyze frequencies and volume in audio data
export function analyzeFrequencies(data, sampleRate) {
  // Step 1: Pad data to the next power of 2
  const paddedData = padToPowerOfTwo(data);

  // Step 2: Convert padded data to complex format (real, imaginary) for FFT
  const complexData = paddedData.map((value) => [value, 0]);

  // Step 3: Perform FFT on the complex data
  const fftData = fft(complexData);

  // Step 4: Calculate magnitudes
  const magnitudes = computeMagnitudes(fftData);

  // Step 5: Calculate frequencies
  const frequencies = magnitudes.map(
    (_, index) => (index * sampleRate) / paddedData.length,
  );

  // Step 6: Find the frequency with the highest magnitude (dominant frequency)
  let maxIndex = 0;
  for (let i = 1; i < magnitudes.length; i++) {
    if (magnitudes[i] > magnitudes[maxIndex]) {
      maxIndex = i;
    }
  }
  const dominantFrequency = frequencies[maxIndex];

  // Step 7: Calculate the volume using RMS
  const volume = calculateRMS(data);

  // Step 8: Calculate the chunk duration in seconds
  const duration = data.length / sampleRate;

  return { dominantFrequency, volume, duration };
}
