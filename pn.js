// pn.js
import pitchFrequencies from './pitchFrequencies.json';
import { drop, rise, round, triangle, tadpole, flat, combi, diamond, drawl, tempered } from './instruments/envelope.js'; 
import { first, second, third } from './wave/harmonic.js';

const PN = {
    currentInstrument: null,
    pitchFrequencies: pitchFrequencies,
    duration: 0.5, // Default duration in seconds
    volume: 0.2, // Default volume level
    harmonic: first, // Default harmonic function
    songDataOutput: null,
    key: 'C5#',


};

export default PN;
