//instruments.js
import PN from "../pn.js";
import {
  ThickBass,
  ampThickBass,
  FunckLead,
  ampFunckLead,
  PercussiveStaccatoPad,
  ampPercussiveStaccatoPad,
  Organ60,
  ampOrgan60,
  Trumpet,
  ampTrumpet,
  Banjo,
  ampBanjo,
  Cello,
  ampCello,
  ampAcousticGuitar,
  AcousticGuitar,
} from "./envelope.js"; // Assuming drop is an envelope function
import { triangle, sawtooth, square, pulseWave } from "../wave/harmonic.js";
import {
  LpThickBass,
  LpFunckLead,
  LpPercussiveStaccatoPad,
  LpOrgan60,
  LpTrumpet,
  LpBanjo,
  LpBanjo2,
  LpDefault,
  LpCello,
  LpAcousticGuitar,
} from "../wave/filter.js";
import {
  LfThickBass,
  LfFunckLead,
  LfPercussiveStaccatoPad,
  LfOrgan60,
  LfTrumpet,
  LfBanjo,
  LfCello,
  LfDefault,
} from "../wave/lowFrequency.js";

export class Instruments {
  ThickBass() {
    PN.frequency = 110;
    PN.harmonic1 = sawtooth;
    PN.harmonic2 = square;
    PN.step = -12;
    PN.filter = LpThickBass;
    PN.filterEnv = ThickBass;
    PN.lfoWave = LfThickBass;
    PN.glideTime = 0.08;
    PN.multiplier = 1;
    PN.currentInstrumentName = "ThickBass";

    return ampThickBass;
  }

  FunckLead() {
    PN.frequency = 440;
    PN.harmonic1 = sawtooth;
    PN.harmonic2 = sawtooth;
    PN.step = 5;
    PN.filter = LpFunckLead;
    PN.filterEnv = FunckLead;
    PN.lfoWave = LfFunckLead;
    PN.glideTime = 0.1;
    PN.multiplier = 1;
    PN.currentInstrumentName = "FunckLead";

    return ampFunckLead;
  }

  PercussiveStaccatoPad() {
    PN.frequency = 440;
    PN.harmonic1 = sawtooth;
    PN.harmonic2 = square;
    PN.step = -12;
    PN.filter = LpPercussiveStaccatoPad;
    PN.filterEnv = PercussiveStaccatoPad;
    PN.lfoWave = LfPercussiveStaccatoPad;
    PN.glideTime = 0.00001;
    PN.multiplier = 1;
    PN.noiseLevel = 0.02;
    PN.noiseState = true;
    PN.currentInstrumentName = "PercussiveStaccatoPad";

    return ampPercussiveStaccatoPad;
  }

  Organ60() {
    PN.frequency = 440;
    PN.harmonic1 = triangle;
    PN.harmonic2 = triangle;
    PN.step = -12;
    PN.filter = LpOrgan60;
    PN.filterEnv = Organ60;
    PN.lfoWave = LfOrgan60;
    PN.glideTime = 0.00001;
    PN.multiplier = 1;
    PN.noiseLevel = 0.02;
    PN.noiseState = true;
    PN.currentInstrumentName = "Organ60";

    return ampOrgan60;
  }

  Trumpet() {
    PN.frequency = 440;
    PN.harmonic1 = sawtooth;
    PN.harmonic2 = sawtooth;
    PN.step = 7;
    PN.filter = LpTrumpet;
    PN.filterEnv = Trumpet;
    PN.lfoWave = LfTrumpet;
    PN.glideTime = 0.00001;
    PN.multiplier = 1;
    PN.noiseLevel = 0;
    PN.noiseState = false;
    PN.currentInstrumentName = "Trumpet";

    return ampTrumpet;
  }

  Banjo() {
    PN.frequency = 440;
    PN.harmonic1 = pulseWave;
    PN.harmonic2 = pulseWave;
    PN.step = 5;
    PN.filter = LpDefault;
    PN.filter2 = LpDefault;
    PN.width1 = 0.2;
    PN.width2 = 0.1;
    PN.filterEnv = Banjo;
    PN.lfoWave = LfBanjo;
    PN.glideTime = 0.00001;
    PN.multiplier = 1;
    PN.noiseLevel = 0;
    PN.noiseState = false;
    PN.ratio = [1, 0.8, 1];
    PN.currentInstrumentName = "Banjo";

    return ampBanjo;
  }

  Cello() {
    PN.frequency = 440;
    PN.harmonic1 = sawtooth;
    PN.harmonic2 = square;
    PN.step = 5;
    PN.filter = LpDefault;
    PN.filter2 = LpDefault;
    PN.width1 = 0.2;
    PN.width2 = 0.1;
    PN.filterEnv = Cello;
    PN.lfoWave = LfCello;
    PN.glideTime = 0.00001;
    PN.multiplier = 1;
    PN.noiseLevel = 0;
    PN.noiseState = false;
    PN.ratio = [1, 1, 1];
    PN.currentInstrumentName = "Cello";

    return ampCello;
  }

  AcousticGuitar2() {
    PN.frequency = 440;
    PN.harmonic1 = pulseWave;
    PN.harmonic2 = pulseWave;
    PN.step = 10;
    PN.filter = LpCello;
    PN.filter2 = LpCello;
    PN.width1 = 0.25;
    PN.width2 = 0.1;
    PN.filterEnv = Cello;
    PN.lfoWave = LfDefault;
    PN.glideTime = 0.00001;
    PN.multiplier = 1;
    PN.noiseLevel = 0;
    PN.noiseState = false;
    PN.ratio = [1, 0.9, 1];
    PN.currentInstrumentName = "AcousticGuitar";

    return ampAcousticGuitar;
  }

  AcousticGuitar() {
    PN.frequency = 440;
    PN.harmonic1 = pulseWave;
    PN.harmonic2 = pulseWave;
    PN.step = 10;
    PN.filter = LpDefault;
    PN.filter2 = LpDefault;
    PN.width1 = 0.25;
    PN.width2 = 0.1;
    PN.filterEnv = AcousticGuitar;
    PN.lfoWave = LfDefault;
    PN.glideTime = 0.00001;
    PN.multiplier = 1;
    PN.noiseLevel = 0;
    PN.noiseState = false;
    PN.ratio = [1, 0.9, 1];
    PN.currentInstrumentName = "AcousticGuitar";

    return ampAcousticGuitar;
  }
}
