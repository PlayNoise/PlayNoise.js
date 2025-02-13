[![OpenSSF Best Practices](https://www.bestpractices.dev/projects/9975/badge)](https://www.bestpractices.dev/projects/9975)

# PlayNoise.js
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-5-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

PlayNoise.js is a lightweight JavaScript library that enables music creation directly in the browser using Recorded Speech and YAML-based scores. It allows users to generate stereo audio and export it as WAV files, making it an excellent tool for web-based music and audio projects.
[Try it at  PlayNoise.org](https://playnoise.org/)



https://github.com/user-attachments/assets/8078a2f8-3f5a-4c4b-9f50-6d15f26406ed



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

1. Download the `dist/pn-library.js` file from the repository.
2. Include it in your HTML:

   ```html
   <script type="module" src="path/to/pn-library.js"></script>
   ```
   Load from remote storage
   ```html
   <script t src="https://playnoise.org/pn-library.js"></script>
   ```

---

## Usage

### Example: Create a Simple Tone

1. Include the library in your project:

   ```html
    <!-- Include the pn-library.js script -->
    <script src="pn-library.js"></script>

    <script>
        // Wrap everything in an async function
        async function runPNExample() {
            console.log(PN);  // This should print the PN object

            PN.instrument('Banjo'); // Select the instrument
            // PN.setVolume(0.5); // Set volume (optional)

            // Wait for PN.singVoice to complete
            const song = await PN.singVoice('recording2.wav');

            console.log("Song created:", song);
            console.log(PN.volume);  // Logs the current volume
                setTimeout(() => {
                    PN.save(); // Call save after the delay

                }, 8000); // Delay in milliseconds (5000ms = 5s)
        }

        // Run the function
        runPNExample();

    </script>
   ```

## From YAML to Audio File - Beauty and the Beast 

Here's the CodePen project: https://codepen.io/isles-forcha/pen/KwPBJZO

2. Open the HTML file in your browser, and the WAV file will be generated and available for download.

---

## Scripts

- `build`: Builds the library for the browser using Webpack.
- `lint`: Runs ESLint to ensure code quality.
- `lint-fix`: Automatically fixes code style issues.
- `test`: Runs unit tests using Jest.
- `docs`: Generates documentation using JSDoc.
- `format` : Format linters and maintain code style

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

## 🐛 Reporting Bugs

If you find a bug in PlayNoise.js, please open an issue in our **GitHub Issues Tracker**:

👉 [Report a Bug](https://github.com/PlayNoise/PlayNoise.js/issues/new?template=bug_report.md)

Please follow the bug report template to help us diagnose and fix the issue faster.

----

## Contributing

Contributions are welcome! Here’s how you can contribute:

1. Fork this repository.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m "Add new feature"`.
4. Push to your branch: `git push origin feature-name`.
5. Submit a pull request.

---

##Chats

Join the PlayNoise Discord Community https://discord.gg/g9ERs8jJ

## Dependencies

PlayNoise.js relies on modern browser APIs and lightweight libraries to handle core functionality:

- **[js-yaml](https://github.com/nodeca/js-yaml)**: Parse and serialize YAML.
- **[wav-encoder](https://github.com/mohayonao/wav-encoder)**: Encode WAV files.
- **[fft-js](https://github.com/dntj/jsfft)**: Fast Fourier Transform for audio processing.
- **[yinjs](https://github.com/qiuxiang/yinjs)**: A pitch detection library.

---

## Contributors


<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://www.linkedin.com/in/forcha-pearl/"><img src="https://avatars.githubusercontent.com/u/24577149?v=4?s=100" width="100px;" alt="FORCHA PEARL"/><br /><sub><b>FORCHA PEARL</b></sub></a><br /><a href="https://github.com/PlayNoise/PlayNoise.js/commits?author=Forchapeatl" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/MananPoojara"><img src="https://avatars.githubusercontent.com/u/104253184?v=4?s=100" width="100px;" alt="Manan"/><br /><sub><b>Manan</b></sub></a><br /><a href="https://github.com/PlayNoise/PlayNoise.js/commits?author=MananPoojara" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/BitmapJunior"><img src="https://avatars.githubusercontent.com/u/197013751?v=4?s=100" width="100px;" alt="bjunior"/><br /><sub><b>bjunior</b></sub></a><br /><a href="https://github.com/PlayNoise/PlayNoise.js/commits?author=BitmapJunior" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/TildaDares"><img src="https://avatars.githubusercontent.com/u/63427719?v=4?s=100" width="100px;" alt="Tilda Udufo"/><br /><sub><b>Tilda Udufo</b></sub></a><br /><a href="https://github.com/PlayNoise/PlayNoise.js/commits?author=TildaDares" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/gudangupta"><img src="https://avatars.githubusercontent.com/u/197318468?v=4?s=100" width="100px;" alt="gudangupta"/><br /><sub><b>gudangupta</b></sub></a><br /><a href="https://github.com/PlayNoise/PlayNoise.js/commits?author=gudangupta" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->


## License

This project is licensed under the Apache 2.0 License License. See the [LICENSE][https://opensource.org/license/apache-2-0] file for details.

---


Feel free to open an issue or submit a pull request if you have any questions or suggestions!

--- 

Happy Coding! 🎶
