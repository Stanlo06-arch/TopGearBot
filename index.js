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

  partials: [
    Partials.Channel
  ]

});

// ================================
// SYSTEME
// ================================

require('./systems/panel')(client);
require('./systems/stance')(client);
require('./systems/xenon')(client);
require('./systems/urlaub')(client);
require('./systems/sanktion')(client);

// ================================
// READY
// ================================

client.once('ready', () => {

  console.log(
    `✅ ${client.user.tag} online`
  );

});

// ================================
// LOGIN
// ================================

client.login(process.env.TOKEN);
