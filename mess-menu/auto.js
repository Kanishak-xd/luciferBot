const fs = require("fs");
const path = require("path");
const cron = require("node-cron");

module.exports = (client) => {
  // Configuration: Map channel IDs to user IDs who should be pinged
  const CHANNEL_CONFIG = {
    // Syndicate II Server
    "1115924464518037524": [
      "985981200059478136", // Siege LSF
      "465209208489508866", // Siege WUWA
      "499558025892331522", // Dolith
      "755416213252866199", // Sarabnoor
      "1029428423824789514", // Devansh
      "782231537269080064", // Nikunj
    ],
    // "another_channel_id": [
    //   "user_id_1",
    //   "user_id_2",
    // ],
  };

  // Meal timing configuration (45 minutes before each meal)
  const MEAL_NOTIFICATIONS = [
    {
      meal: "breakfast",
      cronTime: "15 7 * * *", // 7:15 AM (45 min before 8:00 AM)
      mealTime: "8:00 AM - 9:00 AM",
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
    console.log(`auto.js module loaded...`);

    // Check if menu.json exists
    const menuPath = path.join(__dirname, "menu.json");
    if (!fs.existsSync(menuPath)) {
      console.error("menu.json not found! Auto notifications disabled.");
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
          timezone: "Asia/Kolkata", // Change this to your timezone
        }
      );

      console.log(
        `Scheduled ${meal} notification for ${cronTime} (${mealTime})`
      );
    });
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

      // Send to all configured channels
      for (const channelId of Object.keys(CHANNEL_CONFIG)) {
        try {
          const channel = await client.channels.fetch(channelId);
          if (channel) {
            // Create ping string for this channel
            const channelUserIds = CHANNEL_CONFIG[channelId] || [];
            const pings = channelUserIds
              .map((userId) => `<@${userId}>`)
              .join(" ");

            // Create notification message
            const message =
              `Upcoming ${mealDisplay}: ${mealTime}\n` +
              `Today's ${mealDisplay} Menu (${dayDisplay}):\n${items}\n` +
              `${mealDisplay} starts in 45 minutes.` +
              (pings ? `\n${pings}` : "");

            await channel.send(message);
            console.log(`Sent ${meal} notification to channel ${channelId}`);
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

  // Optional: Manual trigger for testing (remove in production)
  client.on("messageCreate", async (msg) => {
    if (msg.author.bot) return;

    // Admin command to test notifications (replace "YOUR_USER_ID" with your Discord user ID)
    if (
      msg.content === ".test-notification" &&
      msg.author.id === "YOUR_USER_ID"
    ) {
      const testMeals = ["breakfast", "lunch", "snacks", "dinner"];
      const randomMeal =
        testMeals[Math.floor(Math.random() * testMeals.length)];
      await sendMealNotification(randomMeal, "Test Time");
      msg.reply(`Test notification sent for ${randomMeal}!`);
    }
  });
};
