//instruments.js
import { drop,rise,round,triangle,tadpole,flat,combi,diamond,drawl,tempered } from './envelope.js'; // Assuming drop is an envelope function
import { first, second, third } from '../wave/harmonic.js';

export class Instruments{

  Piano(){
    return drop;
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
    return flat;

  }

  Flute(){
    return flat;
  }

  Drum(){
    return flat;
  }

}