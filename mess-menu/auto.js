const fs = require("fs");
const path = require("path");
const cron = require("node-cron");

module.exports = (client) => {
  // Map channel IDs to role ID that should be pinged
  const CHANNEL_CONFIG = {
    "1115924464518037524": "1416425321632366645", // Channel ID: Role ID
  };

  // Meal timing configuration (45 minutes before each meal)
  const MEAL_NOTIFICATIONS = [
    {
      meal: "breakfast",
      cronTime: "45 6 * * *", // 6:45 AM (45 min before 7:30 AM)
      mealTime: "7:30 AM - 9:00 AM",
    },
    {
      meal: "lunch",
      cronTime: "45 11 * * *", // 11:45 AM (45 min before 12:30 PM)
      mealTime: "12:30 PM - 2:30 PM",
    },
    {
      meal: "snacks",
      cronTime: "15 16 * * *", // 4:15 PM (45 min before 5:00 PM)
      mealTime: "5:00 PM - 6:00 PM",
    },
    {
      meal: "dinner",
      cronTime: "15 19 * * *", // 7:15 PM (45 min before 8:00 PM)
      mealTime: "8:00 PM - 9:00 PM",
    },
  ];

  client.once("ready", () => {
    console.log(`- auto module loaded...`);

    // Check if menu.json exists
    const menuPath = path.join(__dirname, "menu.json");
    if (!fs.existsSync(menuPath)) {
      console.error("menu.json not found!");
      return;
    }

    // Schedule all meal notifications
    MEAL_NOTIFICATIONS.forEach(({ meal, cronTime, mealTime }) => {
      cron.schedule(
        cronTime,
        () => {
          sendMealNotification(meal, mealTime);
        },
        {
          timezone: "Asia/Kolkata",
        }
      );
    });

    console.log(`Scheduled ${MEAL_NOTIFICATIONS.length} meal notifications`);
  });

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

  // Function to send meal notification to all configured channels
  async function sendMealNotification(meal, mealTime) {
    const menuPath = path.join(__dirname, "menu.json");

    try {
      // Read the latest menu data
      const menu = JSON.parse(fs.readFileSync(menuPath, "utf-8"));
      const today = getToday();
      const mealDisplay = formatMealName(meal);
      const dayDisplay = today.charAt(0) + today.slice(1).toLowerCase();

      // Check if meal exists for today
      if (
        !menu[today] ||
        !menu[today][meal] ||
        menu[today][meal].length === 0
      ) {
        console.log(
          `No ${meal} menu found for ${today}, skipping notification.`
        );
        return;
      }

      const items = menu[today][meal].join(", ");

      // Send to all set channels
      for (const channelId of Object.keys(CHANNEL_CONFIG)) {
        try {
          const channel = await client.channels.fetch(channelId);
          if (channel) {
            // Create role ping for this channel
            const roleId = CHANNEL_CONFIG[channelId];
            const rolePing = `<@&${roleId}>`;

            // Create notification message
            const message =
              `Today's ${mealDisplay} Menu (${dayDisplay}):\n\n${items}\n\n` +
              rolePing;

            await channel.send(message);
          } else {
            console.warn(
              `Channel ${channelId} not found or bot doesn't have access`
            );
          }
        } catch (error) {
          console.error(
            `Failed to send ${meal} notification to channel ${channelId}:`,
            error.message
          );
        }
      }
    } catch (error) {
      console.error(`Error sending ${meal} notification:`, error);
    }
  }
};
