# Lucifer Bot - Discord.js

A Discord bot built for learning and entertainment purposes, featuring mess menu automation, lyrics fetching, and interactive commands.

## Features

- **Automated meal notifications** - Sends custom reminders based on user-configured schedules
- **Mess menu display** - View today's or complete weekly menu from cloud storage
- **Multi-server support** - Each server can have its own menu and schedule
- **Cloud-based menu storage** - Menus stored on Cloudinary and managed via web interface
- **Lyrics fetching** - Get song lyrics from Genius API
- **CLI chat interface** - Send messages through terminal (local development)
- **Slash commands** - Modern Discord command interface

## Installation & Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with your bot token, MongoDB URI, and API keys
   - `BOT_TOKEN` - Your Discord bot token
   - `MONGO_URI` - MongoDB Atlas connection string
4. Deploy slash commands: `node deployGuildCmds.js` (for immediate server deployment)
5. Start the bot: `node luci.js`

## Commands

### Slash Commands (Work everywhere)

```
/help        - Display help menu
/ping        - Test bot response
/menu        - Show full mess menu for the week
/today       - Show today's complete mess menu
/breakfast   - Show today's breakfast menu
/lunch       - Show today's lunch menu
/snacks      - Show today's snacks menu
/dinner      - Show today's dinner menu
```

### Text Commands (Work everywhere)

```
lyr song artist  - Fetch lyrics from Genius API
```

### Development Commands (Local environment only)

```
node luci.js         - Start main bot
node vc.js           - Connect to voice channel
node deployGuildCmds.js  - Deploy commands to specific server
node deployCmds.js   - Deploy commands globally (takes up to 1 hour)
```

## Menu Management

Menus are now managed through a web interface where users can:
1. Upload Excel files containing the weekly menu
2. Configure reminder channels for each server
3. Set custom reminder times for breakfast, lunch, snacks, and dinner
4. Select roles to ping in notifications

The bot automatically:
- Fetches menu data from Cloudinary
- Sends reminders at configured times
- Pings the selected roles
- Polls the database every 5 minutes for updates
- Updates in real-time when users add or modify configurations on the website
- Automatically sets up notifications when bot joins a new server
- Removes old schedules when configurations are deleted

## Configuration

Menu and notification settings are now configured through the web interface. The bot automatically loads:
- Menu files from Cloudinary URLs stored in MongoDB
- Channel configurations from user uploads
- Reminder schedules from user meal schedules
- Role configurations for pings

Update your Discord server ID in `deployGuildCmds.js` for server-specific command deployment.

## Dependencies

- discord.js
- mongoose
- axios
- node-cron
- genius-lyrics
- dotenv
