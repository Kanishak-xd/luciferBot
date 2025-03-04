require("dotenv").config();
const readline = require("readline");
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const token = process.env.BOT_TOKEN;

require("./nom")(client);

client.once("ready", () => {
  console.log(`luci module loaded..`);

  // Set bot status here so it's applied to all modules
  client.user.setPresence({
    status: "idle",
    activities: [{ name: "over Server", type: 3 }],
  });
});

// Import chat and lyri modules
require("./lyri")(client);
require("./slash")(client);
require("./chat")(client);

client.login(token);
