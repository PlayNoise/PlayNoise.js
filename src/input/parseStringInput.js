function parseSongInput(songData) {
  const parsedData = {};

  for (let entry of songData) {
    const [channel, songInfo] = entry.split("[");

    // Remove ']' from the songInfo to get the clean song data
    const cleanSongInfo = songInfo.replace("]", "");

    const [durationStr, notesStr] = cleanSongInfo.split(":");
    const duration = parseFloat(durationStr); // Convert to float

    // Split the notes by '-' for multiple notes
    const notesArray = notesStr.split("-");
    if (!parsedData[channel]) {
      parsedData[channel] = [];
    }
    parsedData[channel].push({
      duration: duration,
      notes: notesArray,
    });
  }

  return parsedData;
}

export default parseSongInput;
