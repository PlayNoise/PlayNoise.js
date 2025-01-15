import PN from "../pn.js";
import { LeftChannel, RightChannel } from "../wave/encoder.js";

// Create the stereo output by interleaving two channels (left and right)

// Create the stereo output by interleaving two channels (left and right)
function mono() {
  const c1 = PN.songDataOutput;
  return c1;
}

function foureo() {
  const c1 = PN.songDataOutput;
  return c1;
}

function stereo() {
  let leftChannel = LeftChannel;
  let rightChannel = RightChannel;

  return {
    leftChannel,
    rightChannel,
  };
}

export { mono, stereo, foureo };
