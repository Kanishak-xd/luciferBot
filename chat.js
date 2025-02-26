require("dotenv").config();
const readline = require("readline");
const { Client, GatewayIntentBits } = require("discord.js");
const { channel } = require("diagnostics_channel");

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
    console.log(`chat module loaded...`);
    let channelId = null;

    client.user.setPresence({
      status: "idle",
      activities: [{ name: "over Server", type: 3 }],
    });

    // Define Target Channel
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: `Set Target Channel: [1] = Syndicate, [2] = Bhutan, [3] = Nox\nTarget Channel: `,
    });
    rl.prompt();

    // Set Target Channel
    rl.once("line", (input1) => {
      if (input1 === "1") {
        channelId = process.env.CHANNEL_SYN_ID;
      } else if (input1 === "2") {
        channelId = process.env.CHANNEL_BHTN_ID;
      } else if (input1 === "3") {
        channelId = process.env.CHANNEL_NOX_ID;
      }
      const channel = client.channels.cache.get(channelId);
      rl.setPrompt(`Send to ${channel.name} chat: `);
      rl.prompt();

      // Define Message
      rl.on("line", async (input2) => {
        let message = input2;

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

        // Ping Conversion
        Object.keys(userMentions).forEach((id) => {
          const mention = userMentions[id];
          message = message.replace(id, mention);
        });

        // Emoji Conversion
        Object.keys(emojiMappings).forEach((emojiKeyword) => {
          const emoji = emojiMappings[emojiKeyword];
          message = message.replace(emojiKeyword, emoji);
        });

        // Send Message
        rl.setPrompt(`Send to ${channel.name} chat: `);
        await channel.send(message);
        rl.prompt();
      });
    });
  });
};

client.login(token);
