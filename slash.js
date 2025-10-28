require("dotenv").config();
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { connectDB, getMenuForServer } = require("./mess-menu/db");

module.exports = (client) => {
  let dbConnected = false;

  client.once("ready", async () => {
    console.log(`- slash module loaded...`);
    
    // Connect to MongoDB on startup
    try {
      await connectDB();
      dbConnected = true;
    } catch (error) {
      console.error("Failed to connect to database:", error);
    }
  });

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

  async function getMenu(serverId) {
    if (!dbConnected) {
      console.error("Database not connected");
      return null;
    }

    try {
      const menuData = await getMenuForServer(serverId);
      if (!menuData || !menuData.menu) {
        return null;
      }
      return menuData.menu;
    } catch (error) {
      console.error(`Error getting menu from database:`, error);
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

      // Full Week Menu
      if (interaction.commandName === "menu") {
        const menu = await getMenu(interaction.guildId);
        if (!menu) {
          return await interaction.reply({
            content: "Menu not found! Please upload a menu file on the website first.",
            ephemeral: true,
          });
        }

        const weekdays = [
          "MONDAY",
          "TUESDAY",
          "WEDNESDAY",
          "THURSDAY",
          "FRIDAY",
          "SATURDAY",
          "SUNDAY",
        ];

        let description = `\n`;

        for (const day of weekdays) {
          if (!menu[day]) continue;

          const meals = [];
          for (const meal of ["breakfast", "lunch", "snacks", "dinner"]) {
            if (menu[day][meal] && menu[day][meal].length > 0) {
              meals.push(
                `**${formatMealName(meal)}**: ${menu[day][meal].join(", ")}`
              );
            }
          }

          if (meals.length > 0) {
            description += `**${day}**\n`;
            description += meals.map((m) => `• ${m}`).join("\n") + "\n\n";
          }
        }

        const embed = new EmbedBuilder()
          .setColor(0xff6969)
          .setTitle("Weekly Mess Menu")
          .setDescription(description)
          .setTimestamp();

        await interaction.reply({ embeds: [embed] });
      }

      // Menu commands
      if (
        ["today", "breakfast", "lunch", "snacks", "dinner"].includes(
          interaction.commandName
        )
      ) {
        const menu = await getMenu(interaction.guildId);
        if (!menu) {
          return await interaction.reply({
            content: "Menu not found! Please upload a menu file on the website first.",
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
