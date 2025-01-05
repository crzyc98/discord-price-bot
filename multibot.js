const Discord = require('discord.js');
const axios = require('axios');
const fs = require('fs');

// Read configuration file
const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

class PriceBot {
    constructor(botConfig) {
        this.name = botConfig.name;
        this.api_id = botConfig.api_id;
        this.client_token = botConfig.client_token;
        this.status = botConfig.status || 'idle';
        
        // Initialize Discord client
        this.client = new Discord.Client({ 
            partials: ['MESSAGE', 'DIRECT_MESSAGES', 'CHANNEL'],
            intents: [
                Discord.Intents.FLAGS.GUILDS,
                Discord.Intents.FLAGS.GUILD_MESSAGES,
                Discord.Intents.FLAGS.DIRECT_MESSAGES,
                Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS
            ]
        });

        // Set up event handlers
        this.client.on('ready', () => {
            console.log(`${this.name} logged in as ${this.client.user.tag}!`);
            this.client.user.setPresence({ 
                activities: [{ name: 'initializing...' }],
                status: this.status 
            });
            this.startPriceUpdates();
        });

        // Login
        this.client.login(this.client_token);
    }

    async updatePrice() {
        try {
            // Get current price
            const response = await axios({
                url: "https://coins.llama.fi/prices/current/" + this.api_id
            });
            
            // Get 24h change
            const response_24h = await axios({
                url: "https://coins.llama.fi/percentage/" + this.api_id
            });

            const price = response.data.coins[this.api_id].price;
            const change_24h = response_24h.data.coins[this.api_id];
            
            const sign = Math.sign(change_24h) > 0 ? '+' : '';
            const spice = `$${Math.round(price * 10000) / 10000} ${sign}${Math.round(change_24h * 100) / 100}%`;
            
            console.log(`${this.name}: ${spice}`);
            this.client.user.setPresence({
                activities: [{ name: spice }],
                status: 'online'
            });
        } catch (error) {
            console.error(`${this.name} error:`, error.message);
            this.client.user.setPresence({
                activities: [{ name: 'Error fetching price' }],
                status: 'dnd'
            });
        }
    }

    startPriceUpdates() {
        // Initial update
        this.updatePrice();
        // Update every 20 seconds
        setInterval(() => this.updatePrice(), 20 * 1000);
    }
}

// Initialize all bots from config
const bots = config.bots.map(botConfig => new PriceBot(botConfig));

// Handle process termination
process.on('SIGINT', () => {
    console.log('Shutting down bots...');
    bots.forEach(bot => {
        if (bot.client) {
            bot.client.destroy();
        }
    });
    process.exit();
});
