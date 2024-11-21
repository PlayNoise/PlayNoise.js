//instruments.js
import { drop,rise,round,triangle,tadpole,flat,combi,diamond,drawl,tempered, EnvelopeAHDSR } from './envelope.js'; // Assuming drop is an envelope function
import { first, second, third  , stringed} from '../wave/harmonic.js';

export class Instruments{

  Piano(){

  const oscillators = [
        { w: "sine", v: 0.4, d: 0.7, r: 0.1 },
        { w: "triangle", v: 0.4, d: 0.7, s: 0.1, g: 1, a: 0.01, k: -1.2 }
    ];        
  return oscillators;
  
  }

  Organ(){
    return rise;
  }

  Guitar(){
    return round;
  }

  Bass(){
    return tadpole;
  }

  Violin(){
    return flat;
  }

  Trumpet(){
    return first;

  }

  Flute(){
    return flat;
  }

  Drum(){
    return flat;
  }

}