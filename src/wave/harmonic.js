// harmonic.js

// The harmonic describes the additional harmonics added to the fundamental frequency
const harmonics = {};

// Initialize harmonics
harmonics['first'] = first;
harmonics['second'] = second;
harmonics['third'] = third;
harmonics['stringed'] = stringed;

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
  return Math.sin(base(input)) + Math.sin(base(input) * 2) + Math.sin(base(input) * 3);
}

// Stringed instrument harmonic: complex combination of harmonics
export function stringed(input) {
  return 3 * Math.sin(base(input)) +
         0.5 * Math.sin(base(input) * 0.5) +
         1.5 * Math.sin(base(input) * 2) +
         0.25 * Math.sin(base(input) * 3) +
         0.125 * Math.sin(base(input) * 4);
}

// Export the harmonics object
export { harmonics };
