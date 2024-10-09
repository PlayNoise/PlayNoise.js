// pn.js
import pitchFrequencies from './pitchFrequencies.json';
import { drop,rise,round,triangle,tadpole,flat,combi,diamond,drawl,tempered } from './instruments/envelope.js'; // Assuming drop is an envelope function
import { first , second, third } from './wave/harmonic.js'; // Import harmonic functions
const PN = {
    currentInstrument: null,
    pitchFrequencies: pitchFrequencies, // Assume pitchFrequencies is loaded from JSON

    // Add properties for duration, volume, and harmonic
    duration: 0.5, // Default duration in seconds
    volume: 0.2, // Default volume level
    harmonic: first, // Default harmonic function
    songDataOutput : null,
    key: 'C5#'
};

export default PN;
