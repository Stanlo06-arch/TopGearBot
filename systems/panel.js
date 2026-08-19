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

  // =====================================
  // PANEL BEIM BOT-START ERSTELLEN
  // =====================================

  client.once('ready', async () => {

    try {

      const channel =
        await client.channels.fetch(
          PANEL_CHANNEL_ID
        ).catch(() => null);

      if (!channel) {

        console.log(
          '❌ Panel-Channel nicht gefunden.'
        );

        return;
      }

      // Alte Bot-Nachrichten löschen
      const messages =
        await channel.messages.fetch({
          limit: 100
        });

      for (const message of messages.values()) {

        if (
          message.author.id ===
          client.user.id
        ) {

          await message
            .delete()
            .catch(() => {});

        }

      }

      // =====================================
      // EMBED
      // =====================================

      const embed =
        new EmbedBuilder()

          .setColor('#2B65FF')

          .setTitle(
            '⚙️ TOPGEAR PANEL'
          )

          .setDescription(
            '🎨 [Farbkatalog](https://cctuner.sequell.de/index.php)\n\n' +
            'Wähle unten eine Aktion aus.'
          )

          .setThumbnail(LOGO)

          .setImage(BANNER);


      // =====================================
      // REIHE 1
      // =====================================

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
              )

          );


      // =====================================
      // REIHE 2
      // =====================================

      const row2 =
        new ActionRowBuilder()
          .addComponents(

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
              ),

            new ButtonBuilder()
              .setCustomId('suche')
              .setLabel('🔍 Suche')
              .setStyle(
                ButtonStyle.Secondary
              )

          );


      // =====================================
      // PANEL SENDEN
      // =====================================

      await channel.send({

        embeds: [
          embed
        ],

        components: [
          row1,
          row2
        ]

      });

      console.log(
        '✅ TopGear Panel wurde gesendet.'
      );

    } catch (error) {

      console.error(
        '❌ Panel Fehler:',
        error
      );

    }

  });

};
