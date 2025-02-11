require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const readline = require('readline');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
    ],
});

// bot token & channel ID
const token = process.env.BOT_TOKEN;
const channelId = process.env.CHANNEL_ID;

// user IDs to pings
const userMentions = {
    'Sie': `<@${process.env.SIE_ID}>`,
    'Kar': `<@${process.env.KAR_ID}>`,
    'Kel': `<@${process.env.KEL_ID}>`,
    'Dev': `<@${process.env.DEV_ID}>`,
};

// emoji
const emojiMappings = {
    ':pepe_heist:': `<:pepe_heist:${process.env.PEPE_HEIST_EMOJI_ID}>`,
    'kekw': `<:kekw:${process.env.KEKW_EMOJI_ID}>`,
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'enter your message: ',
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    rl.prompt();

    rl.on('line', (input) => {
        let message = input;

        Object.keys(userMentions).forEach((id) => {
            const mention = userMentions[id];
            message = message.replace(id, mention);
        });

        Object.keys(emojiMappings).forEach((emojiKeyword) => {
            const emoji = emojiMappings[emojiKeyword];
            message = message.replace(emojiKeyword, emoji);
        });

        const channel = client.channels.cache.get(channelId);
        if (channel) {
            channel.send(message).catch((err) => {
                console.error('Failed to send message:', err);
            });
        } else {
            console.error('Channel not found!');
        }

        rl.prompt();
    });
});

client.login(token);