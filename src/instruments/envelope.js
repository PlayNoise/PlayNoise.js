// envelope.js

// Envelope functions control the shape of the note and how it's played
var envelopes = {};
var defaultParams = {
  g: 1,
  w: "sine",
  t: 1,
  f: 0,
  v: 1,
  a: 1,
  h: 1,
  d: 1,
  s: 1,
  r: 0,
  p: 1,
  q: 1,
  k: 0,
};

// ADSHR Envelope function

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

export function ampEnvelope(
  time,
  attack,
  decay,
  sustain,
  release,
  noteDuration,
) {
  attack = attack / 4;
  decay = decay / 4;
  sustain = sustain / 4;
  release = release / 4;
  if (time < attack) return time / attack; // Attack phase
  if (time < attack + decay)
    return 1 - ((1 - sustain) * (time - attack)) / decay; // Decay phase
  if (time < noteDuration) return sustain; // Sustain phase
  if (time < noteDuration + release)
    return sustain * (1 - (time - noteDuration) / release); // Release phase
  return 0; // After release
}

export function filterEnvelope(
  attack,
  decay,
  sustain,
  release,
  time,
  duration,
) {
  attack = attack / 4;
  decay = decay / 4;
  sustain = sustain / 4;
  release = release / 4;

  const minEnvelopeValue = 0.001; // Minimum envelope value to avoid cutoff = 0
  if (time < attack) return Math.max(time / attack, minEnvelopeValue); // Attack phase
  if (time < attack + decay)
    return Math.max(
      1 - ((1 - sustain) * (time - attack)) / decay,
      minEnvelopeValue,
    ); // Decay phase
  return Math.max(sustain, minEnvelopeValue); // Sustain phase
}

export function EvolvingLead(time, duration) {
  const attack = 2.5;
  const decay = 3.0;
  const sustain = 0.35;
  const release = 0;
  return filterEnvelope(attack, decay, sustain, release, time, duration);
}

export function EvolvingLeadPad(time, duration) {
  const attack = 9; // Attack time in seconds
  const decay = 2.5; // Decay time in seconds
  const sustain = 0.35; // Sustain level (0 to 1)
  const release = duration; // Ful
  return filterEnvelope(attack, decay, sustain, release, time, duration);
}

export function FunckLead(time, duration) {
  const attack = 0; // Attack time in seconds
  const decay = 0.1; // Decay time in seconds
  const sustain = 0; // Sustain level (0%)
  const release = 0;
  return filterEnvelope(attack, decay, sustain, release, time, duration);
}

export function ThickBass(time, duration) {
  const attack = 0.5; // Attack time in seconds
  const decay = 0.5; // Decay time in seconds
  const sustain = 0; // Sustain level (0%)
  const release = 0.4; // Release time in seconds
  return filterEnvelope(attack, decay, sustain, release, time, duration);
}

export function Organ60(time, duration) {
  // Filter Envelope Parameters
  const attack = 0; // Attack time in seconds
  const decay = 0.16; // Decay time in seconds
  const sustain = 0.34; // Sustain level (34%)
  const release = 0; // Release time in seconds

  return filterEnvelope(attack, decay, sustain, release, time, duration);
}

export function PercussiveStaccatoPad(time, duration) {
  const attack = 0; // Attack time in seconds
  const decay = 0.5; // Decay time in seconds
  const sustain = 0.6; // Sustain level (60%)
  const release = 0; // Release time in seconds
  return filterEnvelope(attack, decay, sustain, release, time, duration);
}

export function Trumpet(time, duration) {
  // Filter Envelope Parameters
  const attack = 5.5; // Attack time in seconds
  const decay = 1.7; // Decay time in seconds
  const sustain = 0.18; // Sustain level (18%)
  const release = 0.05; // Release time in seconds
  return filterEnvelope(attack, decay, sustain, release, time, duration);
}

export function Banjo(time, duration) {
  // Filter Envelope Parameters
  const attack = 0; // Attack time in seconds
  const decay = 0.19; // Decay time in seconds
  const sustain = 0; // Sustain level (0%)
  const release = 0.19; // Release time in seconds
  return filterEnvelope(attack, decay, sustain, release, time, duration);
}

export function Cello(time, duration) {
  // Filter Envelope Parameters
  const attack = 0; // Attack time in seconds
  const decay = 3.29; // Decay time in seconds
  const sustain = 0.78; // Sustain level (0%)
  const release = duration; // Release time in seconds
  return filterEnvelope(attack, decay, sustain, release, time, duration);
}

export function AcousticGuitar(time, duration) {
  const attack = 0; // Attack time in seconds
  const decay = 3.35; // Decay time in seconds
  const sustain = 0; // Sustain level (0%)
  const release = 0.29; // Release time in seconds
  return filterEnvelope(attack, decay, sustain, release, time, duration);
}

/*-----------------------------------------------------------------------------*/

export function ampFunckLead(time, duration) {
  // Amplifier Envelope Parameters
  const attack = 0;
  const decay = 0;
  const sustain = 1; // Full sustain
  const release = 0;

  return ampEnvelope(time, attack, decay, sustain, release, duration);
}

export function ampEffectedLeadPad(time, duration) {
  const attack = 0;
  const decay = 0;
  const sustain = 1; // Full sustain
  const release = duration; // Full release time
  return ampEnvelope(time, attack, decay, sustain, release, duration);
}

export function ampThickBass(time, duration) {
  const attack = 0; // Attack time in seconds
  const decay = 0; // Decay time in seconds
  const sustain = 1; // Full sustain
  const release = 0.4; // Release time in seconds
  return ampEnvelope(time, attack, decay, sustain, release, duration);
}

export function ampPercussiveStaccatoPad(time, duration) {
  const attack = 0;
  const decay = 0;
  const sustain = 1;
  const release = 5;

  return ampEnvelope(time, attack, decay, sustain, release, duration);
}

export function ampOrgan60(time, duration) {
  // Amplifier Envelope Parameters
  const attack = 0; // Attack time in seconds
  const decay = 0; // Decay time in seconds
  const sustain = 1; // Full sustain
  const release = 0.17; // Release time in seconds
  return ampEnvelope(time, attack, decay, sustain, release, duration);
}

export function ampTrumpet(time, duration) {
  const attack = 0; // Attack time in seconds
  const decay = 0; // Decay time in seconds
  const sustain = 1; // Full sustain
  const release = 1;
  return ampEnvelope(time, attack, decay, sustain, release, duration);
}

export function ampBanjo(time, duration) {
  const attack = 0; // Attack time in seconds
  const decay = 0.67; // Decay time in seconds
  const sustain = 0; // Sustain level (0%)
  const release = 0.67; // Release time in seconds
  return ampEnvelope(time, attack, decay, sustain, release, duration);
}

export function ampCello(time, duration) {
  const attack = 0.06; // Attack time in seconds
  const decay = duration; // Decay time in seconds
  const sustain = 1; // Sustain level (0%)
  const release = 0.3; // Release time in seconds
  return ampEnvelope(time, attack, decay, sustain, release, duration);
}

export function ampAcousticGuitar(time, duration) {
  const attack = 0; // Attack time in seconds
  const decay = 1.7; // Decay time in seconds
  const sustain = 0; // Sustain level (0%)
  const release = 1.7; // Release time in seconds
  return ampEnvelope(time, attack, decay, sustain, release, duration);
}

export function adsrExpEnvelope(t, duration, params) {
  let { a, d, h, s, r } = params;
  a *= duration;
  d *= duration;
  h *= duration;
  r *= duration;

  const expScale = (x, min, max) =>
    (Math.exp((x - min) / (max - min)) - 1) / (Math.exp(1) - 1);

  let amplitude = 0;
  if (t <= a) {
    // Exponential attack
    amplitude = expScale(t, 0, a);
  } else if (t <= a + d) {
    // Exponential decay
    amplitude = 1 - expScale(t - a, 0, d) * (1 - s);
  } else if (t <= a + d + h) {
    amplitude = s; // Sustain remains constant
  } else if (t <= a + d + h + r) {
    // Exponential release
    amplitude = s * (1 - expScale(t - (a + d + h), 0, r));
  } else {
    amplitude = 0;
  }
  return amplitude;
}

export function ADSRLogEnvelope(t, duration, params) {
  let { a, d, h, s, r } = params;
  a *= duration;
  d *= duration;
  h *= duration;
  r *= duration;
  const logScale = (x, min, max) =>
    Math.log10(1 + (9 * (x - min)) / (max - min));

  let amplitude = 0;
  if (t <= a) {
    // Logarithmic attack
    amplitude = logScale(t, 0, a);
  } else if (t <= a + d) {
    // Logarithmic decay
    amplitude = 1 - logScale(t - a, 0, d) * (1 - s);
  } else if (t <= a + d + h) {
    amplitude = s; // Sustain remains constant
  } else if (t <= a + d + h + r) {
    // Logarithmic release
    amplitude = s * (1 - logScale(t - (a + d + h), 0, r));
  } else {
    amplitude = 0;
  }
  return amplitude;
}

export function ADSRLinearEnvelope(t, duration, params) {
  var { a, d, h, s, r, k, v, g, f } = params;
  a = a / 4;
  d = d / 4;
  s = s / 4;
  r = r / 4;
  a *= duration;
  d *= duration;
  h *= duration;
  r *= duration;

  let amplitude = 0;
  if (t <= a) {
    amplitude = t / a;
  } else if (t <= a + d) {
    amplitude = 1 - ((t - a) / d) * (1 - s);
  } else if (t <= a + d + h) {
    amplitude = s;
  } else if (t <= a + d + h + r) {
    amplitude = s * (1 - (t - (a + d + h)) / r);
  } else {
    amplitude = 0;
  }

  return amplitude * v;
}

envelopes["ampEnvelope"] = ampEnvelope;
envelopes["ampThickBass"] = ampThickBass;
envelopes["ThickBass"] = ThickBass;
envelopes["ampPercussiveStaccatoPad"] = ampPercussiveStaccatoPad;
envelopes["PercussiveStaccatoPad"] = PercussiveStaccatoPad;
envelopes["ampOrgan60"] = ampOrgan60;
envelopes["Organ60"] = Organ60;
envelopes["Trumpet"] = Trumpet;
envelopes["ampTrumpet"] = ampTrumpet;
envelopes["Banjo"] = Banjo;
envelopes["ampBanjo"] = ampBanjo;
envelopes["ampCello"] = ampCello;
envelopes["Cello"] = Cello;
envelopes["AcousticGuitar"] = AcousticGuitar;
envelopes["ampAcousticGuitar"] = ampAcousticGuitar;

export { envelopes };
