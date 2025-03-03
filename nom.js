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

    client.on("messageCreate", (message) => {
      if (message.author.bot) return; // Ignore bot messages

      now = new Date();
      day = now.toLocaleString("en-US", { weekday: "long" }).toLowerCase();
      time = now
        .toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
        .trim();

      filePath = "tables/mess.json";
      fs.readFile(filePath, "utf8", (err, data) => {
        let jsonData = JSON.parse(data);

        if (message.content.startsWith(".t")) {
          message.reply("```json\n" + JSON.stringify(jsonData[day]) + "\n```");
        } else if (message.content.startsWith(".b")) {
          message.reply(
            "```json\n" + JSON.stringify(jsonData[day]["07:30 AM"]) + "\n```"
          );
        } else if (message.content.startsWith(".l")) {
          message.reply(
            "```json\n" + JSON.stringify(jsonData[day]["11:30 AM"]) + "\n```"
          );
        } else if (message.content.startsWith(".s")) {
          message.reply(
            "```json\n" + JSON.stringify(jsonData[day]["04:30 PM"]) + "\n```"
          );
        } else if (message.content.startsWith(".d")) {
          message.reply(
            "```json\n" + JSON.stringify(jsonData[day]["07:00 PM"]) + "\n```"
          );
        } else if (message.content.startsWith(".m")) {
          message.reply("```json\n" + JSON.stringify(jsonData) + "\n```");
        }
      });
    });
  });
};

client.login(token);
