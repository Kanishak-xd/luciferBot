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
    // const now = new Date();
    // const day = now.toLocaleString("en-US", { weekday: "long" });
    // const time = now.toLocaleTimeString("en-US", {
    //   hour: "2-digit",
    //   minute: "2-digit",
    //   hour12: true,
    // });

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

    // Pings
    const userMentions = {
      Sie: `<@${process.env.SIE_ID}>`,
      Kar: `<@${process.env.KAR_ID}>`,
      Kel: `<@${process.env.KEL_ID}>`,
      Dev: `<@${process.env.DEV_ID}>`,
      Dol: `<@${process.env.DOL_ID}>`,
      Lac: `<@${process.env.LAC_ID}>`,
      Ven: `<@${process.env.VEN_ID}>`,
    };

    // EMOJIS
    const emojiMappings = {
      ":lul:": `<:omegalul:${process.env.OMEGALUL_EMO_SYN}>`,
      ":kek:": `<:kekw:${process.env.KEKW_EMO_SYN}>`,
      ":champ:": `<:WeirdChamp:${process.env.WEIRD_CHAMP_EMO_SYN}>`,
      ":thonk:": `<:thonk:${process.env.THONK_EMO_SYN}>`,
      ":swag:": `<:swag:${process.env.SWAG_EMO_SYN}>`,
    };
  });
};

client.login(token);
