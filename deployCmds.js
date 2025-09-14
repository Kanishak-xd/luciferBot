require("dotenv").config();
const { REST, Routes, SlashCommandBuilder } = require("discord.js");

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
  new SlashCommandBuilder()
    .setName("menu")
    .setDescription("Show the full mess menu for the week"),
].map((command) => command.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    console.log("Starting deployment of application (/) commands.");
    console.log(`Deploying ${commands.length} commands...`);

    // List all commands being deployed
    commands.forEach((cmd, index) => {
      console.log(`${index + 1}. /${cmd.name} - ${cmd.description}`);
    });

    // Clear existing commands first (optional but helps with sync issues)
    console.log("\nClearing existing global commands...");
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: [],
    });
    console.log("Existing commands cleared.");

    // Wait a moment before re-registering
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Registering new commands...");
    const data = await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      {
        body: commands,
      }
    );

    console.log(
      `\nSuccessfully registered ${data.length} global slash commands`
    );
    console.log("Commands may take up to 1 hour to sync globally, or try:");
    console.log("- Restart Discord client");
    console.log("- Leave and rejoin the server");
    console.log(
      "- Use the commands in a different server where the bot is present"
    );
  } catch (error) {
    console.error("Failed to register slash commands:");
    console.error("Error details:", error);

    if (error.code === 50001) {
      console.error("Missing Access - Check bot permissions and CLIENT_ID");
    } else if (error.code === 50013) {
      console.error(
        "Missing Permissions - Bot needs 'applications.commands' scope"
      );
    }
  }
})();
