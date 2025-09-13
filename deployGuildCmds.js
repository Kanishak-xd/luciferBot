require("dotenv").config();
const { REST, Routes, SlashCommandBuilder } = require("discord.js");

// Discord server ID
const GUILD_ID = process.env.SYN_SERVER_ID;

const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  new SlashCommandBuilder()
    .setName("help")
    .setDescription("Help menu command, provides list of commands."),
  new SlashCommandBuilder()
    .setName("today")
    .setDescription("Show today's complete mess menu"),
  new SlashCommandBuilder()
    .setName("breakfast")
    .setDescription("Show today's breakfast menu"),
  new SlashCommandBuilder()
    .setName("lunch")
    .setDescription("Show today's lunch menu"),
  new SlashCommandBuilder()
    .setName("snacks")
    .setDescription("Show today's snacks menu"),
  new SlashCommandBuilder()
    .setName("dinner")
    .setDescription("Show today's dinner menu"),
].map((command) => command.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    if (GUILD_ID === "YOUR_GUILD_ID_HERE") {
      console.error("Please set GUILD_ID in this file first!");
      console.log("To get your Guild ID:");
      console.log(
        "1. Enable Developer Mode in Discord (User Settings > Advanced)"
      );
      console.log("2. Right-click your server name");
      console.log("3. Click 'Copy Server ID'");
      console.log("4. Replace GUILD_ID in this file");
      return;
    }

    console.log(
      `Deploying ${commands.length} commands to guild ${GUILD_ID}...`
    );

    commands.forEach((cmd, index) => {
      console.log(`${index + 1}. /${cmd.name} - ${cmd.description}`);
    });

    const data = await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, GUILD_ID),
      { body: commands }
    );

    console.log(
      `\nSuccessfully registered ${data.length} guild slash commands`
    );
    console.log("Commands should be available immediately in your server!");
  } catch (error) {
    console.error("Failed to register guild slash commands:");
    console.error("Error details:", error);

    if (error.code === 50001) {
      console.error("Missing Access - Check bot permissions and CLIENT_ID");
    } else if (error.code === 50013) {
      console.error(
        "Missing Permissions - Bot needs 'applications.commands' scope"
      );
    } else if (error.code === 10004) {
      console.error("Unknown Guild - Check GUILD_ID is correct");
    }
  }
})();
