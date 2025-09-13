# Lucifer Bot - Discord.js

A Discord bot built for learning and entertainment purposes, featuring mess menu automation, lyrics fetching, and interactive commands.

## Features

- **Automated meal notifications** - Sends reminders 45 minutes before each meal
- **Mess menu display** - View today's or complete weekly menu
- **Lyrics fetching** - Get song lyrics from Genius API
- **CLI chat interface** - Send messages through terminal (local development)
- **Voice channel connection** - Connect to voice channels
- **Slash commands** - Modern Discord command interface

## Installation & Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with your bot token and API keys
4. Deploy slash commands: `node deployGuildCmds.js` (for immediate server deployment)
5. Start the bot: `node luci.js`

## Commands

### Slash Commands (Work everywhere)

```
/help        - Display help menu
/ping        - Test bot response
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

## Automatic Notifications

The bot sends meal reminders 45 minutes before each meal time:

- **Breakfast**: 7:30 AM - 9:00 AM (reminder at 6:45 AM)
- **Lunch**: 12:30 PM - 2:30 PM (reminder at 11:45 AM)
- **Snacks**: 5:00 PM - 6:00 PM (reminder at 4:15 PM)
- **Dinner**: 8:00 PM - 9:00 PM (reminder at 7:15 PM)

## File Structure

```
├── luci.js                 # Main bot file
├── slash.js                # Slash command handler
├── lyri.js                 # Lyrics fetching module
├── chat.js                 # CLI chat interface
├── deployCmds.js           # Global command deployment
├── deployGuildCmds.js      # Server-specific command deployment
├── mess-menu/
│   ├── auto.js             # Automated meal notifications
│   ├── menu.js             # Excel menu parser
│   ├── menu-cmds.js        # Menu command handler
│   └── menu.json           # Parsed menu data
└── help.txt                # Help menu content
```

## Configuration

Configure channel IDs and user IDs in `mess-menu/auto.js` for automated notifications. Update your Discord server ID in `deployGuildCmds.js` for server-specific command deployment.

## Dependencies

- discord.js
- node-cron
- genius-lyrics
- xlsx
- dotenv
