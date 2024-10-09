// parseStringInput.js

// Helper function to parse song input
function parseSongInput(songData) {
  const parsedData = [];

  for (let entry of songData) {
    // Split by colon to separate duration and notes
    const [durationStr, notesStr] = entry.split(':');
    const duration = parseFloat(durationStr); // Convert the duration to a float

    // Split the notes by '-' for multiple notes
    const notesArray = notesStr.split('-');

    parsedData.push({
      duration: duration,  // Parsed duration
      notes: notesArray    // Array of note names (e.g., ["a4", "f5"])
    });
  }

  return parsedData;
}

export default parseSongInput;
