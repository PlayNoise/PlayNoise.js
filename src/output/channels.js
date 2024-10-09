import PN from '../pn.js';

// Create the stereo output by interleaving two channels (left and right)

// Create the stereo output by interleaving two channels (left and right)
function mono() {
  const c1 = PN.songDataOutput ;
  return c1;
}

function stereo() {
  let c1 = PN.songDataOutput ;
  let c2 = PN.songDataOutput;
  const   maxTuneLength  = 6000000;
  const tolerance = 1500;

  // Check if the input arrays exceed the maximum tune length
  if (c1.length > maxTuneLength) {
    throw new Error('Tune too long, use the command line tool instead');
  }

  const minLength = Math.floor(c1.length);

  // Duplicate c1 if c2 is empty
  if (c2.length === 0) {
    c2 = c1.slice();
  }

  // Adjust lengths if they are within the tolerance
  const d1 = c1.length - c2.length;
  const d2 = c2.length - c1.length;

  if (d1 > 0 && d1 < tolerance) {
    c1 = c1.slice(0, c2.length);
  } else if (d2 > 0 && d2 < tolerance) {
    c2 = c2.slice(0, c1.length);
  }

  // Interleave the samples to form stereo data
  const stereoData = [];
  for (let i = 0; i < minLength; i++) {
    stereoData.push(c1[i], c2[i]);
  }

  return stereoData;
}

export {mono , stereo };