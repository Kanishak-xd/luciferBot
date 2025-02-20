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

  const guild = client.guilds.cache.get(guildId);
  if (!guild) {
    console.error("Guild not found!");
    return;
  }

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
