const fs = require("fs");
const path = require("path");

module.exports = (client) => {
  client.once("ready", () => {
    console.log(`- menu-cmds module loaded...`);
  });

  const menuPath = path.join(__dirname, "menu.json");
  if (!fs.existsSync(menuPath)) {
    console.error("menu.json not found! Parse menu.js first.");
    return;
  }

  // Just verify menu exists, all commands now handled by slash.js
  console.log(`Menu file loaded successfully`);
};
