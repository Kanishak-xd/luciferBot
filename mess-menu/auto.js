const cron = require("node-cron");
const {
  connectDB,
  getMenuForServer,
  getMealScheduleForServer,
  parseTimeToCron,
} = require("./db");

module.exports = (client) => {
  // Store scheduled tasks
  const scheduledTasks = new Map();
  let pollingInterval = null;

  client.once("ready", async () => {
    console.log(`- auto module loaded...`);

    try {
      // Connect to MongoDB
      await connectDB();

      // Initial setup for all servers
      await refreshAllServers();

      // Set up periodic polling (every 5 minutes) to check for updates
      pollingInterval = setInterval(async () => {
        console.log("Checking database for configuration updates...");
        await refreshAllServers();
      }, 5 * 60 * 1000); // 5 minutes

      console.log("Database polling enabled (every 5 minutes)");
    } catch (error) {
      console.error("Error setting up meal notifications:", error);
    }
  });

  // Listen for when bot joins a new guild
  client.on("guildCreate", async (guild) => {
    console.log(`Bot joined new guild: ${guild.name}`);
    await setupServerMealNotifications(guild.id, guild);
  });

  // Clean up all tasks for a specific server
  function cleanupServerTasks(serverId) {
    const meals = ["breakfast", "lunch", "snacks", "dinner"];
    for (const meal of meals) {
      const taskKey = `${serverId}-${meal}`;
      const existingTask = scheduledTasks.get(taskKey);
      if (existingTask) {
        existingTask.stop();
        scheduledTasks.delete(taskKey);
      }
    }
  }

  // Refresh configurations for all servers
  async function refreshAllServers() {
    try {
      // Get all servers the bot is in
      const servers = client.guilds.cache;

      // Set up meal notifications for each server
      for (const [serverId, guild] of servers) {
        await setupServerMealNotifications(serverId, guild);
      }

      console.log(`Configuration check complete for ${servers.size} servers`);
    } catch (error) {
      console.error("Error refreshing server configurations:", error);
    }
  }

  // Set up meal notifications for a specific server
  async function setupServerMealNotifications(serverId, guild) {
    try {
      // Get menu data and schedule for this server
      const menuData = await getMenuForServer(serverId);
      const schedule = await getMealScheduleForServer(serverId);

      if (!menuData || !schedule) {
        // If we had tasks for this server but config was removed, stop them
        cleanupServerTasks(serverId);
        return;
      }

      const { channelId, roleId } = {
        channelId: menuData.channelId,
        roleId: schedule.roleId,
      };

      if (!channelId) {
        // If we had tasks for this server but channel was removed, stop them
        cleanupServerTasks(serverId);
        return;
      }

      // Stop any existing tasks for this server
      cleanupServerTasks(serverId);

      // Configure meal notifications based on schedule
      const meals = ["breakfast", "lunch", "snacks", "dinner"];

      for (const meal of meals) {
        const timeString = schedule[meal];
        if (!timeString) continue;

        const cronTime = parseTimeToCron(timeString);
        if (!cronTime) {
          console.log(`Invalid time format for ${meal} in server: ${guild.name}`);
          continue;
        }

        // Schedule the notification
        const task = cron.schedule(
          cronTime,
          () => {
            sendMealNotification(serverId, channelId, roleId, meal);
          },
          {
            timezone: "Asia/Kolkata",
          }
        );

        // Store the task
        const taskKey = `${serverId}-${meal}`;
        scheduledTasks.set(taskKey, task);

        console.log(
          `Scheduled ${meal} notification for server ${guild.name} at ${timeString}`
        );
      }
    } catch (error) {
      console.error(`Error setting up notifications for server: ${serverId}`, error);
    }
  }

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

  // Function to send meal notification
  async function sendMealNotification(serverId, channelId, roleId, meal) {
    try {
      // Fetch fresh menu data
      const menuData = await getMenuForServer(serverId);

      if (!menuData || !menuData.menu) {
        console.log(`No menu data found for server: ${serverId}`);
        return;
      }

      const menu = menuData.menu;
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
          `No ${meal} menu found for ${today} in server ${serverId}, skipping notification.`
        );
        return;
      }

      const items = menu[today][meal].join(", ");

      // Get the channel
      const channel = await client.channels.fetch(channelId);
      if (!channel) {
        console.warn(
          `Channel ${channelId} not found or bot doesn't have access`
        );
        return;
      }

      // Create role ping if roleId exists
      const rolePing = roleId ? `<@&${roleId}>` : "";

      // Create notification message
      const message =
        `Today's ${mealDisplay} Menu (${dayDisplay}):\n\n${items}\n\n` + rolePing;

      await channel.send(message);
      console.log(`Sent ${meal} notification to server: ${serverId}`);
    } catch (error) {
      console.error(`Error sending ${meal} notification:`, error);
    }
  }
};
