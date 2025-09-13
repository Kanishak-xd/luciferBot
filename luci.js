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
  console.log(`Lucifer Bot is online!`);
  console.log(`Serving ${client.guilds.cache.size} servers`);

  // Set bot status
  client.user.setPresence({
    status: "idle",
    activities: [{ name: "your requests", type: 2 }],
  });

  console.log(`Bot status set to: Listening to your requests`);
  console.log(`─────────────────────────────────────────────────`);
});

// Import modules
require("./mess-menu/menu-cmds.js")(client);
require("./mess-menu/auto.js")(client);
require("./lyri")(client);
require("./slash")(client);
require("./chat")(client);

client.login(token);
