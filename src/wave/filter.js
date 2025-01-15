//filter
const filters = {};

filters["LpPassEvolvingLead"] = LpPassEvolvingLead;
filters["LpEvolvingLead"] = LpEvolvingLead;
filters["LpThickBass"] = LpThickBass;
filters["LpFunckLead"] = LpFunckLead;
filters["LpPercussiveStaccatoPad"] = LpPercussiveStaccatoPad;
filters["LpOrgan60"] = LpOrgan60;
filters["LpTrumpet"] = LpTrumpet;
filters["LpDefault"] = LpDefault;
filters["LpCello"] = LpCello;
filters["LpAcousticGuitar"] = LpAcousticGuitar;

export function LpDefault(sample, amplitude, sampleRate, prevState) {
  return sample;
}

export function LpPassEvolvingLead(sample, amplitude, sampleRate, prevState) {
  const cutoffFreq = 236;
  const resonance = 0.85;
  return LowPassFilter(
    sample,
    cutoffFreq,
    amplitude,
    sampleRate,
    resonance,
    prevState,
  );
}

export function LpEvolvingLead(sample, amplitude, sampleRate, prevState) {
  const cutoffFreq = 472;
  const resonance = 0.92;
  return LowPassFilter(
    sample,
    cutoffFreq,
    amplitude,
    sampleRate,
    resonance,
    prevState,
  );
}

export function LpThickBass(sample, amplitude, sampleRate, prevState) {
  const cutoffFreq = 170; // Low-pass filter cutoff frequency in Hz
  const resonance = 0.65;
  return LowPassFilter(
    sample,
    cutoffFreq,
    amplitude,
    sampleRate,
    resonance,
    prevState,
  );
}

export function LpFunckLead(sample, amplitude, sampleRate, prevState) {
  const cutoffFreq = 7200; // Low-pass filter cutoff frequency in Hz
  const resonance = 0.9;
  return LowPassFilter(
    sample,
    cutoffFreq,
    amplitude,
    sampleRate,
    resonance,
    prevState,
  );
}

export function LpPercussiveStaccatoPad(
  sample,
  amplitude,
  sampleRate,
  prevState,
) {
  const cutoffFreq = 220; // Low-pass filter cutoff frequency in Hz
  const resonance = 1;
  return LowPassFilter(
    sample,
    cutoffFreq,
    amplitude,
    sampleRate,
    resonance,
    prevState,
  );
}

export function LpOrgan60(sample, amplitude, sampleRate, prevState) {
  const cutoffFreq = 2800; // Low-pass filter cutoff frequency in Hz
  const resonance = 1;
  return LowPassFilter(
    sample,
    cutoffFreq,
    amplitude,
    sampleRate,
    resonance,
    prevState,
  );
}
export function LpTrumpet(sample, amplitude, sampleRate, prevState) {
  const cutoffFreq = 156; // Low-pass filter cutoff frequency in Hz
  const resonance = 0.64;
  return LowPassFilter(
    sample,
    cutoffFreq,
    amplitude,
    sampleRate,
    resonance,
    prevState,
  );
}

export function LpBanjo(sample, amplitude, sampleRate, prevState) {
  const cutoffFreq = 2900; // Low-pass filter cutoff frequency in Hz
  const resonance = 0.00001;
  return LowPassFilter(
    sample,
    cutoffFreq,
    amplitude,
    sampleRate,
    resonance,
    prevState,
  );
}
export function LpBanjo2(sample, amplitude, sampleRate, prevState) {
  const cutoffFreq = 1500; // Low-pass filter cutoff frequency in Hz
  const resonance = 0;
  return LowPassFilter(
    sample,
    cutoffFreq,
    amplitude,
    sampleRate,
    resonance,
    prevState,
  );
}

export function LpCello(sample, amplitude, sampleRate, prevState) {
  const cutoffFreq = 40; // Low-pass filter cutoff frequency in Hz
  const resonance = 1;
  return LowPassFilter(
    sample,
    cutoffFreq,
    amplitude,
    sampleRate,
    resonance,
    prevState,
  );
}

export function LpAcousticGuitar(sample, amplitude, sampleRate, prevState) {
  const cutoffFreq = 380; // Low-pass filter cutoff frequency in Hz
  const resonance = 0.3;
  return LowPassFilter(
    sample,
    cutoffFreq,
    amplitude,
    sampleRate,
    resonance,
    prevState,
  );
}

export function LowPassFilter(
  sample,
  cutoffFreq,
  amplitude,
  sampleRate,
  resonance,
  prevState,
) {
  cutoffFreq = cutoffFreq * amplitude;
  const RC = 1 / (2 * Math.PI * cutoffFreq);
  const alpha = RC / (RC + 1 / sampleRate);
  const filteredSample =
    alpha * (prevState.value + sample - resonance * prevState.resonanceGain);
  prevState.resonanceGain = resonance * (filteredSample - prevState.value);
  prevState.value = filteredSample;
  return filteredSample;
}

export { filters };
