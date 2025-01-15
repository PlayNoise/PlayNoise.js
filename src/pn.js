// pn.js
import pitchFrequencies from "./pitchFrequencies.json";
import {
  drop,
  rise,
  round,
  triangle,
  tadpole,
  flat,
  combi,
  diamond,
  drawl,
  tempered,
} from "./instruments/envelope.js";
import {
  first,
  second,
  third,
  stringed,
  sine,
  square,
  sawtooth,
} from "./wave/harmonic.js";

import {
  EvolvingLead,
  EvolvingLeadPad,
  FunkLead,
  ThickBass,
} from "./wave/lowFrequency.js";
import {
  LpPassEvolvingLead,
  LpEvolvingLead,
  LpThickBass,
  LpDefault,
} from "./wave/filter.js";

const PN = {
  currentInstrument: null,
  pitchFrequencies: pitchFrequencies,
  duration: 0.5, // Default duration in seconds
  volume: 0.2, // Default volume level
  harmonic1: sine, // Default harmonic function
  harmonic2: sine,
  songDataOutput: null,
  key: "C5#",
  step: 1,
  filter: null,
  filter2: LpDefault,
  width1: 0,
  width2: 0,
  filterEnv: null,
  lfoWave: null,
  glideTime: null,
  semiTone: null,
  multipliyer: 1,
  noiseLevel: 0,
  noiseState: false,
  ratio: [1, 1, 2],
  currentInstrumentName: null,
};

export default PN;
