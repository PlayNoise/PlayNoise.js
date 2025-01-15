// dom.js

export const canvasElements = [];
export const audioElements = [];
export const progressBarElements = [];
export var ProgressID = 0;
/**
 * Create a new canvas element and append it to the DOM.
 * Maintain a reference to the created canvas.
 * @param {Object} options - Options for the canvas (width, height, etc.)
 * @returns {HTMLCanvasElement} The created canvas element
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
 * Create a new audio input element and append it to the DOM.
 * Maintain a reference to the created audio input.
 * @returns {HTMLAudioElement} The created audio element
 */
export function createAudio() {
  const audio = document.createElement("audio");
  audio.controls = true;
  document.body.appendChild(audio);
  audioElements.push(audio);
  return audio;
}

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
