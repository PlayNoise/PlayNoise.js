// dom.js

/**
 * Array to store references to dynamically created canvas elements.
 * This helps in managing and accessing them efficiently.
 */
export const canvasElements = [];

/**
 * Array to store references to dynamically created audio elements.
 * Useful for controlling and manipulating audio playback.
 */
export const audioElements = [];

/**
 * Array to store references to dynamically created progress bar elements.
 * Helps in tracking and updating progress bars in the UI.
 */
export const progressBarElements = [];

/**
 * Stores the most recently assigned progress bar ID.
 * Helps in tracking the latest progress bar created.
 */
export var ProgressID = 0;

/**
 * Creates and appends a new canvas element to the DOM.
 * Stores a reference to the created canvas in the `canvasElements` array.
 *
 * @param {Object} options - Configuration options for the canvas.
 * @param {number} options.width - The width of the canvas (default: 800px).
 * @param {number} options.height - The height of the canvas (default: 600px).
 * @returns {HTMLCanvasElement} The created canvas element.
 */
export function createCanvas(options = { width: 800, height: 600 }) {
  const canvas = document.createElement("canvas");
  canvas.width = options.width;
  canvas.height = options.height;
  document.body.appendChild(canvas);
  canvasElements.push(canvas);
  return canvas;
}

/**
 * Creates and appends a new audio element to the DOM.
 * Stores a reference to the created audio element in the `audioElements` array.
 *
 * @returns {HTMLAudioElement} The created audio element with playback controls.
 */
export function createAudio() {
  const audio = document.createElement("audio");
  audio.controls = true;
  document.body.appendChild(audio);
  audioElements.push(audio);
  return audio;
}

/**
 * Creates and appends a new progress bar element to the DOM.
 * Stores a reference to the created progress bar in the `progressBarElements` array.
 *
 * @param {Object} options - Configuration options for the progress bar.
 * @param {number} options.max - The maximum value of the progress bar (default: 100).
 * @param {number} options.value - The initial value of the progress bar (default: 0).
 * @param {string} options.id - Optional ID for the progress bar.
 * @returns {HTMLDivElement} The created progress bar element.
 */
export function createProgressBar(options = { max: 100, value: 0, id: "" }) {
  const progressBarContainer = document.createElement("div");
  progressBarContainer.style.position = "relative";
  progressBarContainer.style.width = "100%";
  progressBarContainer.style.height = "20px";
  progressBarContainer.style.backgroundColor = "#e0e0e0";

  const progressBar = document.createElement("div");
  progressBar.style.position = "absolute";
  progressBar.style.height = "100%";
  progressBar.style.width = `${options.value}%`;
  progressBar.style.backgroundColor = "#76c7c0";

  if (options.id) {
    progressBar.id = options.id;
    ProgressID = options.id;
  }

  progressBarContainer.appendChild(progressBar);
  document.body.appendChild(progressBarContainer);
  progressBarElements.push(progressBar);
  return progressBar;
}
