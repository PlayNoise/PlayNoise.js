// instrumentSelector.js

import PN from '../pn.js';
import { Instruments } from './instruments.js'; // Assuming you have an Instruments class defined

// Helper to select an instrument
function instrument(instrumentName) {
  switch (instrumentName.toLowerCase()) {
    case 'piano':
      PN.currentInstrument = new Instruments().Piano();
      break;
    case 'organ':
      PN.currentInstrument = new Instruments().Organ();
      break;
    case 'guitar':
      PN.currentInstrument = new Instruments().Guitar();
      break;
    case 'bass':
      PN.currentInstrument = new Instruments().Bass();
      break;
    case 'violin':
      PN.currentInstrument = new Instruments().Violin();
      break;
    case 'trumpet':
      PN.currentInstrument = new Instruments().Trumpet();
      break;
    case 'flute':
      PN.currentInstrument = new Instruments().Flute();
      break;
    case 'drum':
      PN.currentInstrument = new Instruments().Drum();
      break;
    case 'british':  
      PN.currentInstrument = new Instruments().British();
      break;
    case 'xylophone':  
      PN.currentInstrument = new Instruments().Xylophone();
      break;

    default:
      console.log('Instrument not found!');
      return;
  }
  //console.log(`Selected instrument: ${instrumentName}`);
}

export {instrument};