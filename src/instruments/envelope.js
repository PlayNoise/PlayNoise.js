// envelope.js

// Envelopes control the shape of the note and how it's played
const envelopes = {};

// Initialize envelopes
envelopes['drop'] = drop;
envelopes['rise'] = rise;
envelopes['round'] = round;
envelopes['triangle'] = triangle;
envelopes['tadpole'] = tadpole;
envelopes['flat'] = flat;
envelopes['combi'] = combi;
envelopes['diamond'] = diamond;
envelopes['drawl'] = drawl;
envelopes['tempered'] = tempered;

// Envelope Functions

//
// -----
//
// Flat envelope: constant amplitude
/*
Attack (A): 0 (instant)
Decay (D): 0 (no decay)
Sustain (S): 1 (constant sustain level)
Release (R): 0 (no release)
*/
export function flat(input, duration) {
  return 1;
}

// -- .
//     \
//      \
// Drop envelope: cosine decay
/*
Attack (A): 0 (no attack phase)
Decay (D): The entire duration is a decay phase, decaying from 1 to 0.
Sustain (S): 0 (no sustain)
Release (R): The function ends at 0, meaning the release is implicit.
*/

export function drop(input, duration) {
  return Math.cos((Math.PI * input) / (2 * duration));
}

//   . --
//  /
// /
// Rise envelope: sine ramp up
/*
Attack (A): The entire duration is an attack phase, rising smoothly from 0 to 1.
Decay (D): 0 (no decay)
Sustain (S): 0 (no sustain)
Release (R): 0 (no release)
*/
export function rise(input, duration) {
  return Math.sin((Math.PI * input) / (2 * duration));
}

//   . -- .
//  /      \
// /        \
// Round envelope: sine wave up and down
/*
Attack (A): The first half of the duration (rising from 0 to 1).
Decay (D): The second half of the duration (falling from 1 to 0).
Sustain (S): 0 (no sustain phase)
Release (R): Implicit (since the function returns to 0).
*/
export function round(input, duration) {
  return Math.sin((Math.PI * input) / duration);
}

//   /\
//  /  \
// /    \

// Triangle envelope: sawtooth wave
/*
Attack (A): The rising part of the triangle (from 0 to 1).
Decay (D): The falling part of the triangle (from 1 to 0).
Sustain (S): 0 (no sustain phase)
Release (R): Implicit (since the function returns to 0).
*/

export function triangle(input, duration) {
  return (2 / Math.PI) * Math.asin(Math.sin((2 * Math.PI * input) / duration));
}

// Tadpole-shaped envelope
export function tadpole(input, duration) {
  return Math.sin((Math.PI * input) / duration) -
    0.5 * Math.sin((2 * Math.PI * input) / duration) +
    0.333 * Math.sin((3 * Math.PI * input) / duration) -
    0.25 * Math.sin((4 * Math.PI * input) / duration);
}

// Combi envelope: combination of sine and cosine
export function combi(input, duration) {
  return (Math.sin((Math.PI * input) / duration) / 2) +
    (Math.cos((Math.PI * input) / (2 * duration)) / 3);
}

// Diamond envelope: multiple sine waves combined
export function diamond(input, duration) {
  return ((2 / Math.PI) *
    Math.asin(Math.sin((Math.PI * input) / duration)) / 4) +
    ((2 / Math.PI) * Math.asin(Math.sin((2 * Math.PI * input) / duration)) / 4);
}

// Drawl envelope: logarithmic decay
export function drawl(input, duration) {
  return 1 / Math.log10((2 * Math.PI * input / duration) + 1.9);
}

// Tempered envelope: combines drop and drawl
export function tempered(input, duration) {
  return drop(input, duration) * drawl(input, duration);
}

export function ahdsr(input, duration, attack, hold, decay, sustainLevel, release) {
  if (input < attack) {
    // Attack phase: rise from 0 to 1
    return Math.sin((Math.PI * input) / (2 * attack));
  } else if (input < attack + hold) {
    // Hold phase: maintain maximum amplitude
    return 1;
  } else if (input < attack + hold + decay) {
    // Decay phase: fall from 1 to sustain level
    return Math.cos((Math.PI * (input - (attack + hold)))
     / (2 * decay)) * (1 - sustainLevel) + sustainLevel;
  } else if (input < duration - release) {
    // Sustain phase: maintain sustain level
    return sustainLevel;
  } else {
    // Release phase: fall from sustain level to 0
    return Math.cos((Math.PI * (input - (duration - release)))
     / (2 * release)) * sustainLevel;
  }
}

// Export the envelopes object
export { envelopes };
