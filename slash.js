require("dotenv").config();
const { REST, Routes, SlashCommandBuilder } = require("discord.js");

module.exports = (client) => {
  client.once("ready", async () => {
    console.log(`slash module loaded...`);

    client.user.setPresence({
      status: "idle",
      activities: [{ name: "over Server", type: 3 }],
    });

    // Register slash commands once when bot is ready
    const commands = [
      new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!"),
    ].map((command) => command.toJSON());

    const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.NOX_SERVER_ID
      ),
      { body: commands }
    );
  });

  // Listen for slash command interactions
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "ping") {
      await interaction.reply("🏓 Pong!");
    }
  });
};
