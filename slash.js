require("dotenv").config();
const {
  EmbedBuilder,
  REST,
  Routes,
  SlashCommandBuilder,
} = require("discord.js");

const fs = require("fs");

module.exports = (client) => {
  client.once("ready", async () => {
    console.log(`slash module loaded...`);

    // client.user.setPresence({
    //   status: "idle",
    //   activities: [{ name: "over Server", type: 3 }],
    // });

    // Register slash commands once when bot is ready
    const commands = [
      new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!"),

      new SlashCommandBuilder()
        .setName("help")
        .setDescription("Help menu command, provides list of commands."),
    ].map((command) => command.toJSON());

    const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commands,
    });
  });

  // Listen for slash command interactions
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "ping") {
      await interaction.reply("pong");
    }

    if (interaction.commandName === "help") {
      const helpMenu = fs.readFileSync("help.txt", "utf8");

      const helpEmbed = new EmbedBuilder()
        .setColor(0xff6969)
        // .setTitle("Lucifer Help Menu")
        .setDescription(helpMenu)
        .setTimestamp();

      await interaction.reply({ embeds: [helpEmbed] });
    }
  });
};
