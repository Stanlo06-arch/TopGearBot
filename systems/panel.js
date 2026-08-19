const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

const {
  PANEL_CHANNEL_ID,
  LOGO,
  BANNER
} = require('../config/ids');

module.exports = (client) => {

  client.once('ready', async () => {

    const channel =
      client.channels.cache.get(
        PANEL_CHANNEL_ID
      );

    if (!channel) {
      console.log('❌ Panel-Channel nicht gefunden.');
      return;
    }

    // Alte Bot-Nachrichten löschen
    const messages =
      await channel.messages.fetch();

    const botMessages =
      messages.filter(
        msg =>
          msg.author.id ===
          client.user.id
      );

    for (const msg of botMessages.values()) {
      await msg.delete().catch(() => {});
    }

    // PANEL EMBED
    const embed = new EmbedBuilder()

      .setColor('#2B65FF')

      .setTitle('⚙️ TOPGEAR PANEL')

      .setDescription(
        '🎨 [Farbkatalog](https://cctuner.sequell.de/index.php)\n\n' +
        'Wähle unten eine Aktion aus.'
      )

      .setThumbnail(LOGO)

      .setImage(BANNER)

      .setTimestamp();

    // ERSTE REIHE
    const row1 =
      new ActionRowBuilder()
        .addComponents(

          new ButtonBuilder()
            .setCustomId('news')
            .setLabel('📰 News')
            .setStyle(
              ButtonStyle.Primary
            ),

          new ButtonBuilder()
            .setCustomId('xenon')
            .setLabel('⚡ Xenon')
            .setStyle(
              ButtonStyle.Primary
            ),

          new ButtonBuilder()
            .setCustomId('stance')
            .setLabel('🚗 Stance')
            .setStyle(
              ButtonStyle.Primary
            ),

          new ButtonBuilder()
            .setCustomId('urlaub')
            .setLabel('🌴 Urlaub')
            .setStyle(
              ButtonStyle.Success
            ),

          new ButtonBuilder()
            .setCustomId('sanktion')
            .setLabel('🔨 Sanktion')
            .setStyle(
              ButtonStyle.Danger
            )

        );

    // ZWEITE REIHE
    const row2 =
      new ActionRowBuilder()
        .addComponents(

          new ButtonBuilder()
            .setCustomId('suche')
            .setLabel('🔍 Suche')
            .setStyle(
              ButtonStyle.Secondary
            )

        );

    // PANEL SENDEN
    await channel.send({
      embeds: [embed],
      components: [
        row1,
        row2
      ]
    });

    console.log('✅ TopGear Panel wurde erstellt.');

  });

};
