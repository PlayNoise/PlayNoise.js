const lowFrequency = {};

lowFrequency["LfEvolvingLead"] = LfEvolvingLead;
lowFrequency["LfEvolvingLeadPad"] = LfEvolvingLeadPad;
lowFrequency["LfFunckLead"] = LfFunckLead;
lowFrequency["LfThickBass"] = LfThickBass;
lowFrequency["LfPercussiveStaccatoPad"] = LfPercussiveStaccatoPad;
lowFrequency["LfOrgan60"] = LfOrgan60;
lowFrequency["LfTrumpet"] = LfTrumpet;
lowFrequency["LfBanjo"] = LfBanjo;
lowFrequency["LfCello"] = LfCello;
lowFrequency["LfDefault"] = LfDefault;

export function LfEvolvingLead(time) {
  const frequency = 10;
  const depth = 0.2;
  return Math.sin(2 * Math.PI * frequency * time) * depth;
}

export function LfEvolvingLeadPad(time) {
  const frequency = 35;
  const depth = 0.5;
  return Math.sin(2 * Math.PI * frequency * time) * depth;
}

export function LfFunckLead(time) {
  const frequency = 18;
  const depth = 0.2;
  return Math.sin(2 * Math.PI * frequency * time) * depth;
}

export function LfThickBass(time) {
  const frequency = 15; // LFO frequency in Hz
  const depth = 0.2;
  return Math.sin(2 * Math.PI * frequency * time) * depth;
}

export function LfPercussiveStaccatoPad(time) {
  const frequency = 0.6; // LFO frequency in Hz
  const depth = 0.2;
  return Math.sin(2 * Math.PI * frequency * time) * depth;
}

export function LfOrgan60(time) {
  const frequency = 1; // LFO frequency in Hz
  const depth = 0.08;
  return Math.sin(2 * Math.PI * frequency * time) * depth;
}

export function LfTrumpet(time) {
  const frequency = 15; // LFO frequency in Hz
  const depth = 0.15;
  return Math.sin(2 * Math.PI * frequency * time) * depth;
}

export function LfBanjo(time) {
  const frequency = 10; // LFO frequency in Hz
  const depth = 0.1;

  return (
    (2 / Math.PI) * Math.asin(Math.sin(2 * Math.PI * frequency * time)) * depth
  );
}

export function LfCello(time) {
  const frequency = 7.5; // LFO frequency in Hz
  const depth = 0.05;
  return Math.sin(2 * Math.PI * frequency * time) * depth;
}

export function LfDefault(time) {
  const frequency = 7.5; // LFO frequency in Hz
  const depth = 0.05;
  return Math.sin(2 * Math.PI * frequency * time) * depth;
}

export { lowFrequency };
