require("dotenv").config();
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = (client) => {
  client.once("ready", () => {
    console.log(`- slash module loaded...`);
  });

  // Menu helper functions
  const getMenuPath = () => path.join(__dirname, "mess-menu", "menu.json");

  function getToday() {
    const days = [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ];
    return days[new Date().getDay()];
  }

  function formatMealName(meal) {
    return meal.charAt(0).toUpperCase() + meal.slice(1);
  }

  function getMenu() {
    const menuPath = getMenuPath();

    if (!fs.existsSync(menuPath)) {
      return null;
    }

    try {
      return JSON.parse(fs.readFileSync(menuPath, "utf-8"));
    } catch (error) {
      console.error(`Error reading menu file:`, error);
      return null;
    }
  }

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    try {
      // Basic commands
      if (interaction.commandName === "ping") {
        await interaction.reply("Pong!");
        return;
      }

      if (interaction.commandName === "help") {
        try {
          const helpMenu = fs.readFileSync("help.txt", "utf8");

          const helpEmbed = new EmbedBuilder()
            .setColor(0xff6969)
            .setTitle("Lucifer Help Menu")
            .setDescription(helpMenu)
            .setTimestamp();

          await interaction.reply({ embeds: [helpEmbed] });
        } catch (error) {
          console.error("Error reading help file:", error);
          await interaction.reply({
            content: "Help file not found!",
            ephemeral: true,
          });
        }
        return;
      }

      // Menu commands
      if (
        ["today", "breakfast", "lunch", "snacks", "dinner"].includes(
          interaction.commandName
        )
      ) {
        const menu = getMenu();
        if (!menu) {
          return await interaction.reply({
            content: "Menu not found! Please contact admin.",
            ephemeral: true,
          });
        }

        const today = getToday();
        const dayDisplay = today.charAt(0) + today.slice(1).toLowerCase();

        if (interaction.commandName === "today") {
          // Handle /today command
          let description = `**Today's Complete Menu (${dayDisplay})**\n\n`;
          let hasAnyMeal = false;

          for (const meal of ["breakfast", "lunch", "snacks", "dinner"]) {
            if (
              menu[today] &&
              menu[today][meal] &&
              menu[today][meal].length > 0
            ) {
              const mealDisplay = formatMealName(meal);
              const mealEmoji = {
                breakfast: "🥞",
                lunch: "🍛",
                snacks: "🍿",
                dinner: "🍽️",
              };

              description += `${mealEmoji[meal]} **${mealDisplay}**\n`;
              description += `${menu[today][meal].join(", ")}\n\n`;
              hasAnyMeal = true;
            }
          }

          if (!hasAnyMeal) {
            description = `No menu found for ${dayDisplay}.`;
          }

          const embed = new EmbedBuilder()
            .setColor(0xff6969)
            .setDescription(description)
            .setTimestamp();

          await interaction.reply({ embeds: [embed] });
        } else {
          // Handle individual meal commands
          const meal = interaction.commandName;
          const mealDisplay = formatMealName(meal);

          if (
            !menu[today] ||
            !menu[today][meal] ||
            menu[today][meal].length === 0
          ) {
            return await interaction.reply({
              content: `No ${mealDisplay} menu found for ${dayDisplay}.`,
              ephemeral: true,
            });
          }

          const items = menu[today][meal].join(", ");
          const mealEmoji = {
            breakfast: "🥞",
            lunch: "🍛",
            snacks: "🍿",
            dinner: "🍽️",
          };

          const embed = new EmbedBuilder()
            .setColor(0xff6969)
            .setTitle(`${mealEmoji[meal]} ${mealDisplay} Menu (${dayDisplay})`)
            .setDescription(items)
            .setTimestamp();

          await interaction.reply({ embeds: [embed] });
        }
      }
    } catch (error) {
      console.error("Error handling interaction:", error);
      const errorMessage = {
        content: "An error occurred while processing the command.",
        ephemeral: true,
      };

      try {
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(errorMessage);
        } else {
          await interaction.reply(errorMessage);
        }
      } catch (followUpError) {
        console.error("Failed to send error message:", followUpError);
      }
    }
  });
};
