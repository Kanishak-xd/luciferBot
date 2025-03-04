require("dotenv").config();
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = (client) => {
  client.once("ready", () => {
    console.log(`slash module loaded...`);
  });

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "ping") {
      await interaction.reply("pong");
    }

    if (interaction.commandName === "help") {
      const helpMenu = fs.readFileSync("help.txt", "utf8");

      const helpEmbed = new EmbedBuilder()
        .setColor(0xff6969)
        .setDescription(helpMenu)
        .setTimestamp();

      await interaction.reply({ embeds: [helpEmbed] });
    }
  });
};
