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

require("./lyric")(client);

const token = process.env.BOT_TOKEN;

client.once("ready", () => {
  console.log(`target module loaded..`);
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

    // Message Input
    rl.on("line", async (input2) => {
      rl.setPrompt(`Send to ${channel.name} chat: `);
      await channel.send(input2);
      rl.prompt();
    });
  });
});

client.login(token);
