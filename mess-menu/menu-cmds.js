const fs = require("fs");
const path = require("path");

module.exports = (client) => {
  client.once("ready", () => {
    console.log(`menu-cmds module loaded...`);
  });
  const menuPath = path.join(__dirname, "menu.json");
  if (!fs.existsSync(menuPath)) {
    console.error("menu.json not found! Run menu.js first.");
    return;
  }

  const menu = JSON.parse(fs.readFileSync(menuPath, "utf-8"));

  // Helper: get today's weekday in uppercase (to match JSON keys)
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

  // Helper: format meal name for display
  function formatMealName(meal) {
    return meal.charAt(0).toUpperCase() + meal.slice(1);
  }

  client.on("messageCreate", async (msg) => {
    if (msg.author.bot) return;

    const content = msg.content.toLowerCase().trim();
    const today = getToday();

    if ([".breakfast", ".lunch", ".snacks", ".dinner"].includes(content)) {
      const meal = content.replace(".", ""); // Remove the dot: ".breakfast" → "breakfast"
      const mealDisplay = formatMealName(meal); // "breakfast" → "Breakfast"

      if (
        !menu[today] ||
        !menu[today][meal] ||
        menu[today][meal].length === 0
      ) {
        return msg.reply(
          `No ${mealDisplay} menu found for ${today.toLowerCase()}.`
        );
      }

      const items = menu[today][meal].join(", ");
      const dayDisplay = today.charAt(0) + today.slice(1).toLowerCase(); // "MONDAY" → "Monday"

      msg.reply(`**${mealDisplay} (${dayDisplay})**\n${items}`);
    }

    if (content === ".today") {
      const dayDisplay = today.charAt(0) + today.slice(1).toLowerCase(); // "MONDAY" → "Monday"
      let reply = `**Today's Menu (${dayDisplay})**:\n`;

      for (const meal of ["breakfast", "lunch", "snacks", "dinner"]) {
        if (menu[today] && menu[today][meal] && menu[today][meal].length > 0) {
          const mealDisplay = formatMealName(meal);
          reply += `\n**${mealDisplay}**: ${menu[today][meal].join(", ")}`;
        }
      }
      msg.reply(reply);
    }
  });
};
