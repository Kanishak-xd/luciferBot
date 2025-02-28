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
    const day = now.toLocaleString("en-US", { weekday: "long" });

    if (day === "Friday") {
      const filePath = "tables/mess.json";
      fs.readFile(filePath, "utf8", (err, data) => {
        const jsonData = JSON.parse(data);
        console.log(`
            Breakfast: ${jsonData["friday"]["breakfast"]}\n
            Lunch: ${jsonData["friday"]["lunch"]}\n
            Snacks: ${jsonData["friday"]["snacks"]}\n
            Dinner: ${jsonData["friday"]["dinner"]}
          `);
      });
    } else if (day === "Saturday") {
      const filePath = "tables/mess.json";
      fs.readFile(filePath, "utf8", (err, data) => {
        const jsonData = JSON.parse(data);
        console.log(`
          Breakfast: ${jsonData["saturday"]["breakfast"]}\n
          Lunch: ${jsonData["saturday"]["lunch"]}\n
          Snacks: ${jsonData["saturday"]["snacks"]}\n
          Dinner: ${jsonData["saturday"]["dinner"]}
        `);
      });
    }
  });
};

client.login(token);
