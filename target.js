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

client.once("ready", () => {
  console.log(`target module loaded.`);
  let channelId = process.env.CHANNEL_NOX_ID;

  client.user.setPresence({
    status: "idle",
    activities: [{ name: "over Server", type: 3 }],
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: `Set Target Channel: [1] = Syndicate, [2] = Bhutan, [3] = Nox\nTarget Channel: `,
  });
  rl.prompt();

  // First input
  rl.on("line", (input1) => {
    channelId = input1;
    rl.setPrompt(`Target Channel "${input1}" locked in.\nEnter your message: `);
    rl.prompt();

    // Second input
    rl.once("line", (input2) => {
      const channel = client.channels.cache.get(channelId);
      let message = input2;
      if (channel) {
        channel.send(message);
      }
      rl.prompt();
      //   rl.close();
    });
  });

  //   // Set Target Channel
  //   rl = readline.createInterface({
  //     input: process.stdin,
  //     output: process.stdout,
  //     prompt: `Set Target Channel [ 1 = Syndicate, 2 = Bhutan, 3 = Nox ]: `,
  //   });
  //   rl.prompt();
  //   rl.on("line", (inp1) => {
  //     if (inp1 === "1") {
  //       channelId = process.env.CHANNEL_SYN_ID;
  //     } else if (inp1 === "2") {
  //       channelId = process.env.CHANNEL_BHTN_ID;
  //     } else if (inp1 === "3") {
  //       channelId = process.env.CHANNEL_NOX_ID;
  //     }
  //     console.log(`Target Channel set to: ${channelId}`);
  //     rl.on("line", (inp2) => {
  //       let message = inp2;
  //       let channel = channelId;
  //       if (channel) {
  //         channel.send(message);
  //       }
  //     });
  //   });
});

// require("./lyric")(client);
// require("./chat")(client);

client.login(token);
