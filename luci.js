require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

app.get("/", (req, res) => res.send("Lucifer is running"));

app.listen(port, () => {
  console.log(`Web server running on port ${port}`);
});

const token = process.env.BOT_TOKEN;

require("./nom")(client);

client.once("ready", () => {
  console.log(`luci module loaded..`);

  // Set bot status here so it's applied to all modules
  client.user.setPresence({
    status: "idle",
    activities: [{ name: "your requests", type: 2 }],
  });
});

// Import the modules
// require("./lyri")(client);
require("./slash")(client);
// require("./chat")(client);

client.login(token);
