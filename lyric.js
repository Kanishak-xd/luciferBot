require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const Genius = require("genius-lyrics");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const token = process.env.BOT_TOKEN;
const geniusApiKey = process.env.GENIUS_API_KEY;

const genius = new Genius.Client(geniusApiKey);

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (message) => {
  if (!message.content.startsWith(".l ")) return;

  // Extract song name & artist
  const query = message.content.slice(3).trim();

  try {
    const song = await genius.songs.search(query);
    const lyrics = await song[0].lyrics();

    // Split lyrics into multiple messages if too long
    const chunks = lyrics.match(/[\s\S]{1,1900}/g);
    for (const chunk of chunks) {
      await message.channel.send(chunk);
    }
  } catch (error) {
    console.error("Error fetching lyrics:", error);
    message.reply("Couldn't fetch lyrics.");
  }
});

client.login(token);
