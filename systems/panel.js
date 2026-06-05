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

    if (!channel) return;

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

    const embed = new EmbedBuilder()

      .setColor('#2B65FF')

      .setTitle('⚙️ TOPGEAR PANEL')

      .setDescription(`
Verwaltung • Mitarbeiter • Systeme

Wähle unten eine Aktion aus.
`)

      .setThumbnail(LOGO)

      .setImage(BANNER)

      .setTimestamp();

    const row1 =
      new ActionRowBuilder()
        .addComponents(

          new ButtonBuilder()
            .setCustomId('news')
            .setLabel('📢 News')
            .setStyle(
              ButtonStyle.Primary
            ),

          new ButtonBuilder()
            .setCustomId('ticket')
            .setLabel('🎫 Ticket')
            .setStyle(
              ButtonStyle.Success
            ),

          new ButtonBuilder()
            .setCustomId('stance')
            .setLabel('📝 Stance')
            .setStyle(
              ButtonStyle.Secondary
            )

        );

    const row2 =
      new ActionRowBuilder()
        .addComponents(

          new ButtonBuilder()
            .setCustomId('urlaub')
            .setLabel('🌴 Urlaub')
            .setStyle(
              ButtonStyle.Secondary
            ),

          new ButtonBuilder()
            .setCustomId('sanktion')
            .setLabel('⛔ Sanktion')
            .setStyle(
              ButtonStyle.Danger
            ),

          new ButtonBuilder()
            .setCustomId('search')
            .setLabel('🔍 Suche')
            .setStyle(
              ButtonStyle.Secondary
            )

        );

    await channel.send({
      embeds: [embed],
      components: [row1, row2]
    });

  });

};
