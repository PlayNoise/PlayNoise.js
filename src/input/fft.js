/**
 * Pads the input data array to the next power of 2.
 * This ensures optimal performance for FFT calculations.
 *
 * @param {number[]} data - The input data array.
 * @returns {number[]} The padded data array with zero-padding.
 */
function padToPowerOfTwo(data) {
  const nextPowerOfTwo = Math.pow(2, Math.ceil(Math.log2(data.length)));
  const paddedData = new Array(nextPowerOfTwo).fill(0);
  for (let i = 0; i < data.length; i++) {
    paddedData[i] = data[i];
  }
  return paddedData;
}

/**
 * Performs the Fast Fourier Transform (FFT) using a recursive implementation.
 *
 * @param {Array<[number, number]>} data - The complex input data array.
 * @returns {Array<[number, number]>} The transformed data in the frequency domain.
 */
function fft(data) {
  const n = data.length;
  if (n <= 1) return data;

  // Separate even and odd indexed elements
  const even = fft(data.filter((_, i) => i % 2 === 0));
  const odd = fft(data.filter((_, i) => i % 2 !== 0));

  const results = new Array(n).fill(0).map(() => [0, 0]);
  for (let k = 0; k < n / 2; k++) {
    const expTerm = (-2 * Math.PI * k) / n;
    const cosine = Math.cos(expTerm);
    const sine = Math.sin(expTerm);

    // Compute real and imaginary components
    const real = cosine * odd[k][0] - sine * odd[k][1];
    const imag = sine * odd[k][0] + cosine * odd[k][1];

    results[k] = [even[k][0] + real, even[k][1] + imag];
    results[k + n / 2] = [even[k][0] - real, even[k][1] - imag];
  }
  return results;
}

/**
 * Computes the magnitude of each complex number in the FFT result.
 *
 * @param {Array<[number, number]>} fftData - The FFT output data.
 * @returns {number[]} The computed magnitudes.
 */
function computeMagnitudes(fftData) {
  return fftData.map(([real, imag]) => Math.sqrt(real ** 2 + imag ** 2));
}

/**
 * Calculates the Root Mean Square (RMS) value for volume estimation.
 *
 * @param {number[]} data - The input signal data.
 * @returns {number} The computed RMS value.
 */
function calculateRMS(data) {
  let sumSquares = 0;
  for (let i = 0; i < data.length; i++) {
    sumSquares += data[i] * data[i];
  }
  return Math.sqrt(sumSquares / data.length);
}

/**
 * Analyzes frequency and volume from audio data.
 *
 * @param {number[]} data - The input audio signal data.
 * @param {number} sampleRate - The sample rate of the audio signal.
 * @returns {Object} An object containing dominant frequency, volume, and duration.
 */
export function analyzeFrequencies(data, sampleRate) {
  // Step 1: Pad data to the next power of 2
  const paddedData = padToPowerOfTwo(data);

  // Step 2: Convert padded data to complex format (real, imaginary) for FFT
  const complexData = paddedData.map((value) => [value, 0]);

  // Step 3: Perform FFT on the complex data
  const fftData = fft(complexData);

  // Step 4: Calculate magnitudes
  const magnitudes = computeMagnitudes(fftData);

  // Step 5: Compute frequencies
  const frequencies = magnitudes.map(
    (_, index) => (index * sampleRate) / paddedData.length
  );

  // Step 6: Find the dominant frequency
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
