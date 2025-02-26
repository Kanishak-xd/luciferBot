require("dotenv").config();
const Genius = require("genius-lyrics");

module.exports = (client) => {
  const genius = new Genius.Client(process.env.GENIUS_API_KEY);

  client.once("ready", () => {
    console.log(`lyri module loaded..`);

    // Set bot status
    client.user.setPresence({
      status: "idle",
      activities: [{ name: "over Server", type: 3 }],
    });
  });

  client.on("messageCreate", async (message) => {
    if (!message.content.startsWith(".l ")) return;

    const query = message.content.slice(3).trim();

    try {
      const searches = await genius.songs.search(query);
      if (!searches.length) {
        message.reply("No lyrics found for this song.");
        return;
      }

      const song = searches[0];
      const lyrics = await song.lyrics();

      // Split long lyrics
      const chunks = lyrics.match(/[\s\S]{1,1900}/g);
      for (const chunk of chunks) {
        await message.channel.send(chunk);
      }
    } catch (error) {
      console.error("Error fetching lyrics:", error);
      message.reply("Couldn't fetch lyrics.");
    }
  });
};
