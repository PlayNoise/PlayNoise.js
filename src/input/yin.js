const DEFAULT_THRESHOLD = 0.07;

function difference(data) {
  const n = data.length;
  const results = new Float32Array(n);
  let difference;
  let summation;
  const windowSize = Math.floor(n * 0.5);

  for (let tau = 0; tau <= windowSize; tau++) {
    summation = 0;
    for (let j = 0; j < windowSize; j++) {
      difference = data[j] - data[j + tau];
      summation += difference * difference;
    }
    results[tau] = summation;
  }
  return results;
}

function cumulativeMeanNormalizedDifference(data) {
  const n = data.length;
  const results = new Float32Array(n);
  let summation;

  for (let tau = 0; tau < n; tau++) {
    summation = 0;
    for (let j = 0; j <= tau; j++) {
      summation += data[j];
    }
    results[tau] = data[tau] / (summation / tau);
  }
  return results;
}

function absoluteThreshold(data, threshold) {
  let k = Number.POSITIVE_INFINITY;
  let tau;

  for (let i = 0, n = data.length; i < n; i++) {
    const x = data[i];
    if (x < threshold) {
      return i;
    }
    if (x < k) {
      k = x;
      tau = i;
    }
  }
  return tau;
}

function bestLocalEstimate(data, tau) {
  let i = tau + 1;
  const n = data.length;
  let k = data[tau];

  while (i < n && data[i] < k) {
    k = data[i];
    i++;
  }
  return i - 1;
}

// Function to calculate RMS for volume estimation
function calculateRMS(data) {
  let sumSquares = 0;
  for (let i = 0; i < data.length; i++) {
    sumSquares += data[i] * data[i];
  }
  return Math.sqrt(sumSquares / data.length);
}

/**
 * Enhanced YIN algorithm to estimate fundamental frequency, duration, and volume of audio signal
 * @param {Float32Array} data The time-domain data for the audio signal
 * @param {Number} sampleRate The sample rate
 * @param {Number} [threshold = 0.07] The threshold
 * @returns {Object} An object with frequency, volume, and chunk duration
 */
export function yin(data, sampleRate, aThreshold = DEFAULT_THRESHOLD) {
  // Step 1: Calculate the difference function
  const diff = difference(data);

  // Step 2: Calculate the cumulative mean normalized difference function
  const cmnd = cumulativeMeanNormalizedDifference(diff);

  // Step 3: Apply the threshold to find the first dip
  const tau = absoluteThreshold(cmnd, aThreshold);

  if (tau === -1) {
    return { frequency: NaN, duration: 0, volume: 0 }; // If no valid tau is found, return NaN
  }

  // Step 4: Refine the estimate using parabolic interpolation
  const refinedTau = bestLocalEstimate(cmnd, tau);

  // Step 5: Convert the refined lag into a frequency
  const frequency = sampleRate / refinedTau;

  // Step 6: Calculate the chunk's volume using RMS
  const volume = calculateRMS(data);

  // Step 7: Calculate the chunk duration in seconds
  const duration = data.length / sampleRate;

  return { frequency, volume, duration };
}
