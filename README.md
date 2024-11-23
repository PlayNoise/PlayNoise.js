# PlayNoise.js

PlayNoise.js is a lightweight JavaScript library that enables music creation directly in the browser using Recorded Voices and YAML-based scores. It allows users to generate stereo audio and export it as WAV files, making it an excellent tool for web-based music and audio projects.

---

## Features

- **Voice-to-Instrument Conversion**: Convert recorded voice audio into musical instrument tones for unique and creative sound generation.
- **YAML-Based Scores**: Write music effortlessly with simple YAML syntax.
- **Browser-Compatible**: Fully functional in modern web browsers.
- **Stereo Audio**: Supports stereo audio generation.
- **WAV File Export**: Export audio as downloadable WAV files.
- **Customizable Sound Properties**: Control tempo, frequency, amplitude, and more.

---

## Installation

Add PlayNoise.js to your project via a `<script>` tag. 

1. Download the `dist/index.js` file from the repository.
2. Include it in your HTML:

   ```html
   <script type="module" src="path/to/index.js"></script>
   ```

---

## Usage

### Example: Create a Simple Tone

1. Include the library in your project:

   ```html
   <script type="module">
       import { parseYAML, generateWAV } from './dist/index.js';

       // Define YAML data
       const yamlData = `
       tempo: 120
       tracks:
         - instrument: sine
           notes:
             - frequency: 440
               duration: 1
             - frequency: 660
               duration: 1
       `;

       // Parse the YAML
       const score = parseYAML(yamlData);

       // Generate WAV data
       const wavBuffer = generateWAV(score);

       // Create a downloadable WAV file
       const blob = new Blob([wavBuffer], { type: 'audio/wav' });
       const link = document.createElement('a');
       link.href = URL.createObjectURL(blob);
       link.download = 'output.wav';
       link.textContent = 'Download Generated Audio';
       document.body.appendChild(link);
   </script>
   ```

2. Open the HTML file in your browser, and the WAV file will be generated and available for download.

---

## Scripts

- `build`: Builds the library for the browser using Webpack.
- `lint`: Runs ESLint to ensure code quality.
- `lint-fix`: Automatically fixes code style issues.
- `test`: Runs unit tests using Jest.
- `docs`: Generates documentation using JSDoc.

Run these scripts using npm:

```bash
npm run <script-name>
```

---

## Documentation

Generate the documentation using:

```bash
npm run docs
```

This will output documentation in the `docs/` directory.

---

## Contributing

Contributions are welcome! Here’s how you can contribute:

1. Fork this repository.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m "Add new feature"`.
4. Push to your branch: `git push origin feature-name`.
5. Submit a pull request.

---

## Dependencies

PlayNoise.js relies on modern browser APIs and lightweight libraries to handle core functionality:

- **[js-yaml](https://github.com/nodeca/js-yaml)**: Parse and serialize YAML.
- **[wav-encoder](https://github.com/mohayonao/wav-encoder)**: Encode WAV files.
- **[fft-js](https://github.com/dntj/jsfft)**: Fast Fourier Transform for audio processing.
- **[yinjs](https://github.com/qiuxiang/yinjs)**: A pitch detection library.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Author

Developed by **Forcha Glen Beloa**.

Feel free to open an issue or submit a pull request if you have any questions or suggestions!

--- 

Happy Coding! 🎶
