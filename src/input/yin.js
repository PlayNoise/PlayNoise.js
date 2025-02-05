const DEFAULT_THRESHOLD = 0.07; // Default threshold value for detecting significant changes

/**
 * Calculates the difference function for a given data array.
 * This function measures how much each sample differs from others
 * at various lags (tau).
 * 
 * @param {Float32Array} data - The input data array.
 * @returns {Float32Array} - An array containing the summation of squared differences.
 */
function difference(data) {
  const n = data.length; // Length of the input data
  const results = new Float32Array(n); // Array to store results
  let difference; // Variable to hold individual differences
  let summation; // Variable to hold summation of squared differences
  const windowSize = Math.floor(n * 0.5); // Define window size as half of the data length

  // Loop through possible lags (tau)
  for (let tau = 0; tau <= windowSize; tau++) {
    summation = 0; // Reset summation for each tau
    for (let j = 0; j < windowSize; j++) {
      difference = data[j] - data[j + tau]; // Calculate difference at lag tau
      summation += difference * difference; // Accumulate squared differences
    }
    results[tau] = summation; // Store result for this tau
  }
  return results; // Return the calculated differences
}

/**
 * Computes the cumulative mean normalized difference for the input data.
 * This function normalizes the differences by dividing each value by 
 * the cumulative mean up to that point.
 * 
 * @param {Float32Array} data - The input data array.
 * @returns {Float32Array} - An array containing normalized differences.
 */
function cumulativeMeanNormalizedDifference(data) {
  const n = data.length; // Length of the input data
  const results = new Float32Array(n); // Array to store results
  let summation; // Variable to hold cumulative sum

  // Loop through each sample in the data
  for (let tau = 0; tau < n; tau++) {
    summation = 0; // Reset summation for each tau
    for (let j = 0; j <= tau; j++) {
      summation += data[j]; // Accumulate sum up to current tau
    }
    results[tau] = data[tau] / (summation / (tau + 1)); // Normalize by mean
  }
  return results; // Return normalized results
}

/**
 * Finds the first index where the value falls below a specified threshold.
 * If no value falls below the threshold, it returns the index of the smallest value.
 * 
 * @param {Float32Array} data - The input data array.
 * @param {number} threshold - The threshold value for comparison.
 * @returns {number} - The index of the first value below the threshold, or index of minimum value.
 */
function absoluteThreshold(data, threshold) {
  let k = Number.POSITIVE_INFINITY; // Initialize k as positive infinity
  let tau; // Variable to store index of minimum value

  // Loop through each sample in the data
  for (let i = 0, n = data.length; i < n; i++) {
    const x = data[i]; // Current sample value
    if (x < threshold) {
      return i; // Return index if below threshold
    }
    if (x < k) {
      k = x; // Update k if current sample is smaller
      tau = i; // Update tau to current index
    }
  }
  return tau; // Return index of minimum value if no values are below threshold
}

/**
 * Estimates the best local estimate of a given lag (tau).
 * It finds the next sample that is less than or equal to the value at tau.
 * 
 * @param {Float32Array} data - The input data array.
 * @param {number} tau - The lag index to refine.
 * @returns {number} - The refined index based on local estimation.
 */
function bestLocalEstimate(data, tau) {
  let i = tau + 1; // Start checking from one position after tau
  const n = data.length;
  let k = data[tau]; // Value at lag tau

  while (i < n && data[i] < k) {
    k = data[i]; // Update k if current sample is smaller than previous k
    i++; // Move to next sample
  }

  return i - 1; // Return last valid index before exceeding k
}

/**
 * Calculates the Root Mean Square (RMS) for volume estimation from audio samples.
 * 
 * @param {Float32Array} data - The input audio samples.
 * @returns {number} - The calculated RMS value representing volume.
 */
function calculateRMS(data) {
  let sumSquares = 0; // Initialize sum of squares

  for (let i = 0; i < data.length; i++) {
    sumSquares += data[i] * data[i]; // Accumulate squares of each sample
  }

  return Math.sqrt(sumSquares / data.length); // Return RMS value
}

/**
 * Enhanced YIN algorithm to estimate fundamental frequency, duration, and volume of an audio signal.
 *
 * @param {Float32Array} data - The time-domain audio signal samples.
 * @param {Number} sampleRate - The sample rate of the audio signal.
 * @param {Number} [aThreshold=DEFAULT_THRESHOLD] - The threshold for detection (default is set).
 * @returns {Object} An object containing estimated frequency, volume, and chunk duration in seconds.
 */
export function yin(data, sampleRate, aThreshold = DEFAULT_THRESHOLD) {

  // Step 1: Calculate the difference function from audio samples
  const diff = difference(data);

  // Step 2: Compute cumulative mean normalized difference from differences calculated above
  const cmnd = cumulativeMeanNormalizedDifference(diff);

  // Step 3: Apply absolute threshold to find first significant dip in cmnd values
  const tau = absoluteThreshold(cmnd, aThreshold);

  if (tau === -1) {
    return { frequency: NaN, duration: 0, volume: 0 }; // Return NaN if no valid tau found
  }

  // Step 4: Refine estimate using local search around identified dip (tau)
  const refinedTau = bestLocalEstimate(cmnd, tau);

  // Step 5: Convert refined lag into frequency using sample rate
  const frequency = sampleRate / refinedTau;

  // Step 6: Calculate volume using RMS method on original audio samples
  const volume = calculateRMS(data);

  // Step 7: Calculate duration based on number of samples and sample rate
  const duration = data.length / sampleRate;

  return { frequency, volume, duration }; // Return an object with frequency, volume, and duration estimates
}
