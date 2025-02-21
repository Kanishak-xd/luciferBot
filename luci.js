require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const token = process.env.BOT_TOKEN;

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);

  // Set bot status here so it's applied to all modules
  client.user.setPresence({
    status: "idle",
    activities: [{ name: "over Server", type: 3 }],
  });
});

// Import chat and lyric modules
require("./lyric")(client);
require("./chat")(client);

client.login(token);
