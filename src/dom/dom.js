// domElements.js

export const canvasElements = [];
export const audioElements = [];
/**
 * Create a new canvas element and append it to the DOM.
 * Maintain a reference to the created canvas.
 * @param {Object} options - Options for the canvas (width, height, etc.)
 * @returns {HTMLCanvasElement} The created canvas element
 */
export function createCanvas(options = { width: 800, height: 600 }) {
  const canvas = document.createElement('canvas');
  canvas.width = options.width;
  canvas.height = options.height;
  document.body.appendChild(canvas);
  canvasElements.push(canvas);
  return canvas;
}

/**
 * Create a new audio input element and append it to the DOM.
 * Maintain a reference to the created audio input.
 * @returns {HTMLAudioElement} The created audio element
 */
export function createAudio() {
  const audio = document.createElement('audio');
  audio.controls = true;
  document.body.appendChild(audio);
  audioElements.push(audio);
  return audio;
}
