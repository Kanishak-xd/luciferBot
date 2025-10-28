const { connectDB } = require("./db");

module.exports = (client) => {
  client.once("ready", async () => {
    console.log(`- menu-cmds module loaded...`);
    
    // Connect to MongoDB
    try {
      await connectDB();
      console.log(`Database connection ready for menu commands`);
    } catch (error) {
      console.error("Failed to connect to database:", error);
    }
  });

  // Menu data is now loaded from MongoDB, handled by slash.js
};
