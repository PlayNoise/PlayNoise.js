// instrumentSelector.js

import PN from "../pn.js";
import { Instruments } from "./instruments.js"; // Assuming you have an Instruments class defined

// Helper to select an instrument
function instrument(instrumentName) {
  switch (instrumentName.toLowerCase()) {
    case "trumpet":
      PN.currentInstrument = new Instruments().Trumpet();
      break;
    case "thickbass":
      PN.currentInstrument = new Instruments().ThickBass();
      break;
    case "funcklead":
      PN.currentInstrument = new Instruments().FunckLead();
      break;
    case "organ60":
      PN.currentInstrument = new Instruments().Organ60();
      break;
    case "banjo":
      PN.currentInstrument = new Instruments().Banjo();
      break;
    case "cello":
      PN.currentInstrument = new Instruments().Cello();
      break;
    case "acousticguitar":
      PN.currentInstrument = new Instruments().AcousticGuitar();
      break;
    default:
      console.log("Instrument not found!");
      return;
  }
  console.log(`Selected instrument: ${instrumentName}`);
}

export { instrument };
