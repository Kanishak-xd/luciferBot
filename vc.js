require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

const token = process.env.BOT_TOKEN;
const guildId = process.env.NOX_SERVER_ID;
const voiceChannelId = process.env.NOX_VC_CHANNEL_ID;

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  // client.user.setPresence({
  //   status: "idle", // online, idle, dnd, invisible
  //   activities: [
  //     {
  //       name: "over Server",
  //       type: 3, // 0 = Playing, 1 = Streaming, 2 = Listening, 3 = Watching, 5 = Competing
  //     },
  //   ],
  // });

  const voiceChannel = guild.channels.cache.get(voiceChannelId);

  const connection = joinVoiceChannel({
    channelId: voiceChannelId,
    guildId: guildId,
    adapterCreator: guild.voiceAdapterCreator,
    selfDeaf: false,
  });

  console.log(`Connected to VC: ${voiceChannel.name}`);
});

client.login(token);
