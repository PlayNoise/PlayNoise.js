import PN from '../pn.js';

/**
 * Sets the duration for notes in the PN object.
 *
 * @param {number} duration - The duration of the note in seconds.
 *
 * @example
 * // Set the duration of notes to 1 second
 * setDuration(1);
 * console.log(PN.duration);  // Logs: 1
 */
function setDuration(duration) {
  PN.duration = duration;
  console.log(`Duration set to ${duration} seconds`);
}

/**
 * Sets the volume level for notes in the PN object.
 *
 * @param {number} volume - The volume level (e.g., between 0 and 1).
 *
 * @example
 * // Set the volume of notes to 0.75 (75% of max volume)
 * setVolume(0.75);
 * console.log(PN.volume);  // Logs: 0.75
 */
function setVolume(volume) {
  PN.volume = volume;
  console.log(`Volume level set to ${volume}`);
}

/**
 * Sets the harmonic function for notes in the PN object.
 *
 * @param {function} harmonicFunc - The harmonic function to apply to the notes.
 *
 * @example
 * // Set the harmonic function to 'first'
 * setHarmonic(first);
 * console.log(PN.harmonic);  // Logs: [function: first]
 */
function setHarmonic(harmonicFunc) {
  PN.harmonic = harmonicFunc;
  console.log('Harmonic function set');
}

export { setDuration, setVolume, setHarmonic };
