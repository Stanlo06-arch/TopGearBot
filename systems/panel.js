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

  // =========================
  // PANEL ERSTELLEN
  // =========================

  client.once('ready', async () => {

    try {

      const channel =
        client.channels.cache.get(
          PANEL_CHANNEL_ID
        );

      if (!channel) {
        console.log(
          '❌ Panel-Channel nicht gefunden.'
        );
        return;
      }

      const messages =
        await channel.messages.fetch({
          limit: 100
        });

      const botMessages =
        messages.filter(
          msg =>
            msg.author.id === client.user.id
        );

      for (const msg of botMessages.values()) {
        await msg.delete().catch(() => {});
      }

      const embed =
        new EmbedBuilder()

          .setColor('#2B65FF')

          .setTitle('⚙️ TOPGEAR PANEL')

          .setDescription(
            '🎨 [Farbkatalog](https://cctuner.sequell.de/index.php)\n\n' +
            'Wähle unten eine Aktion aus.'
          )

          .setThumbnail(LOGO)

          .setImage(BANNER)

          .setTimestamp();

      // =========================
      // REIHE 1
      // =========================

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

      // =========================
      // REIHE 2
      // =========================

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

      await channel.send({
        embeds: [embed],
        components: [
          row1,
          row2
        ]
      });

      console.log(
        '✅ TopGear Panel wurde erstellt.'
      );

    } catch (error) {

      console.error(
        '❌ Fehler beim Panel:',
        error
      );

    }

  });


  // =========================
  // BUTTON TEST HANDLER
  // =========================

  client.on(
    'interactionCreate',
    async interaction => {

      if (!interaction.isButton()) {
        return;
      }

      const buttons = [
        'news',
        'xenon',
        'stance',
        'urlaub',
        'sanktion',
        'suche'
      ];

      if (
        !buttons.includes(
          interaction.customId
        )
      ) {
        return;
      }

      try {

        return interaction.reply({
          content:
            `✅ **${interaction.customId}** wurde gedrückt.`,
          ephemeral: true
        });

      } catch (error) {

        console.error(
          '❌ Button-Fehler:',
          error
        );

      }

    }
  );

};
