require("dotenv").config();
const readline = require("readline");
const { Client, GatewayIntentBits } = require("discord.js");
const { channel } = require("diagnostics_channel");
const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const token = process.env.BOT_TOKEN;

module.exports = (client) => {
  client.once("ready", () => {
    console.log(`nom module loaded.`);

    client.user.setPresence({
      status: "idle",
      activities: [{ name: "over Server", type: 3 }],
    });

    // Set Target Channel
    // let channelId = process.env.CHANNEL_NOX_ID;
    // const channel = client.channels.cache.get(channelId);

    // if (day === "Friday" && time === "8:30 PM") {
    //   let message = `------------gotcha-----------`;
    //   channel.send(message);
    // }

    const now = new Date();
    const day = now.toLocaleString("en-US", { weekday: "long" }).toLowerCase();

    const time = now
      .toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .trim();

    const filePath = "tables/mess.json";
    fs.readFile(filePath, "utf8", (err, data) => {
      const jsonData = JSON.parse(data);
      console.log(jsonData[day][time]);
    });
  });
};

client.login(token);
