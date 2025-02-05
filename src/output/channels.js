import PN from "../pn.js"; // Import the PN module for song data output
import { LeftChannel, RightChannel } from "../wave/encoder.js"; // Import left and right audio channels

// Create the stereo output by interleaving two channels (left and right)

/**
 * Retrieves the mono audio data from the PN module.
 * 
 * @returns {Array} The mono audio data output from the PN module.
 */
function mono() {
  const c1 = PN.songDataOutput; // Access song data output from the PN module
  return c1; // Return the mono audio data
}

/**
 * Retrieves a specific audio data output (currently identical to mono).
 * 
 * @returns {Array} The audio data output from the PN module.
 */
function foureo() {
  const c1 = PN.songDataOutput; // Access song data output from the PN module
  return c1; // Return the audio data (same as mono for now)
}

/**
 * Creates a stereo audio output by combining left and right channels.
 * 
 * @returns {Object} An object containing left and right audio channel data.
 */
function stereo() {
  let leftChannel = LeftChannel; // Access the left audio channel
  let rightChannel = RightChannel; // Access the right audio channel

  return {
    leftChannel, // Return left channel data
    rightChannel, // Return right channel data
  };
}

// Export functions for use in other modules
export { mono, stereo, foureo };
