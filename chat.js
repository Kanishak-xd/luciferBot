require("dotenv").config();
const readline = require("readline");

module.exports = (client) => {
  const channelId = process.env.CHANNEL_NOX_ID;

  const userMentions = {
    Sie: `<@${process.env.SIE_ID}>`,
    Kar: `<@${process.env.KAR_ID}>`,
    Kel: `<@${process.env.KEL_ID}>`,
    Dev: `<@${process.env.DEV_ID}>`,
  };

  const emojiMappings = {
    ":pepe_heist:": `<:pepe_heist:${process.env.PEPE_HEIST_EMOJI_ID}>`,
    kekw: `<:kekw:${process.env.KEKW_EMOJI_ID}>`,
  };

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "enter your message: ",
  });

  client.once("ready", () => {
    console.log(`chat module loaded!`);

    // Set bot status
    client.user.setPresence({
      status: "idle", // online, idle, dnd, invisible
      activities: [
        {
          name: "over Server",
          type: 3, // Watching
        },
      ],
    });

    rl.prompt();

    rl.on("line", (input) => {
      let message = input;

      Object.keys(userMentions).forEach((id) => {
        const mention = userMentions[id];
        message = message.replace(id, mention);
      });

      Object.keys(emojiMappings).forEach((emojiKeyword) => {
        const emoji = emojiMappings[emojiKeyword];
        message = message.replace(emojiKeyword, emoji);
      });

      const channel = client.channels.cache.get(channelId);
      if (channel) {
        channel.send(message).catch((err) => {
          console.error("Failed to send message:", err);
        });
      } else {
        console.error("Channel not found!");
      }

      rl.prompt();
    });
  });
};
