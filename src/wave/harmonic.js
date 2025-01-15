// harmonic.js

// The harmonic describes the additional harmonics added to the fundamental frequency
const harmonics = {};

// Initialize harmonics
harmonics["first"] = first;
harmonics["second"] = second;
harmonics["third"] = third;
harmonics["stringed"] = stringed;
harmonics["triangle"] = triangle;
harmonics["sine"] = sine;
harmonics["square"] = square;
harmonics["sawtooth"] = sawtooth;
harmonics["pulseWave"] = pulseWave;

// Waveform functions
export function triangle(input) {
  return 2 * Math.abs(2 * (input % 1) - 1) - 1;
}

export function sine(input) {
  return Math.sin(2 * Math.PI * input);
}

export function square(input) {
  return 2 * (input % 1) - 1;
}

export function sawtooth(input) {
  return 2 * (input % 1) - 1;
}

export function pulseWave(frequency, time, pulseWidth) {
  const period = 1 / frequency;
  const phase = time % period;
  return phase < pulseWidth * period ? 1 : -1;
}

// Base function to calculate the base frequency
export function base(input) {
  return 2 * Math.PI * input;
}

// First harmonic: fundamental frequency
export function first(input) {
  return Math.sin(base(input));
}

// Second harmonic: adds the second harmonic (double the base frequency)
export function second(input) {
  return Math.sin(base(input)) + Math.sin(base(input) * 2);
}

// Third harmonic: adds the third harmonic (triple the base frequency)
export function third(input) {
  return (
    Math.sin(base(input)) +
    Math.sin(base(input) * 2) +
    Math.sin(base(input) * 3)
  );
}

function triangleHarmonics(time, frequency, harmonics) {
  let result = 0;

  for (let n = 1; n <= harmonics; n++) {
    // Odd harmonics only: 1, 3, 5, etc.
    if (n % 2 === 1) {
      const harmonicFrequency = frequency * n; // Harmonic frequency
      const harmonicAmplitude = 1 / (n * n); // Amplitude falls off as 1/n^2 for triangle wave
      result +=
        harmonicAmplitude * Math.sin(2 * Math.PI * harmonicFrequency * time);
    }
  }

  return (result * 8) / Math.PI ** 2; // Normalize for triangle wave
}

// Stringed instrument harmonic: complex combination of harmonics
export function stringed(input) {
  return Math.sin(input) + Math.sign(Math.sin(input * 2)) * 0.5;
}

// Export the harmonics object
export { harmonics };
