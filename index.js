const {
  Client,
  GatewayIntentBits,
  Partials
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel]
});

require('./systems/panel')(client);
require('./systems/news')(client);

client.once('ready', () => {
  console.log(`${client.user.tag} online`);
});

client.login(process.env.TOKEN);
