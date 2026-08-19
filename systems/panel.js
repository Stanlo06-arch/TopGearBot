const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} = require('discord.js');

const {
  PANEL_CHANNEL_ID,
  LOGO,
  BANNER
} = require('../config/ids');

module.exports = (client) => {

  // =====================================
  // PANEL ERSTELLEN
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

      const messages =
        await channel.messages.fetch({
          limit: 100
        });

      for (const message of messages.values()) {

        if (
          message.author.id ===
          client.user.id
        ) {
          await message.delete().catch(() => {});
        }

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
          .setImage(BANNER);

      const row1 =
        new ActionRowBuilder()
          .addComponents(

            new ButtonBuilder()
              .setCustomId('news')
              .setLabel('📰 News')
              .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
              .setCustomId('xenon')
              .setLabel('⚡ Xenon')
              .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
              .setCustomId('stance')
              .setLabel('🚗 Stance')
              .setStyle(ButtonStyle.Primary)

          );

      const row2 =
        new ActionRowBuilder()
          .addComponents(

            new ButtonBuilder()
              .setCustomId('urlaub')
              .setLabel('🌴 Urlaub')
              .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
              .setCustomId('sanktion')
              .setLabel('🔨 Sanktion')
              .setStyle(ButtonStyle.Danger),

            new ButtonBuilder()
              .setCustomId('suche')
              .setLabel('🔍 Suche')
              .setStyle(ButtonStyle.Secondary)

          );

      await channel.send({
        embeds: [embed],
        components: [
          row1,
          row2
        ]
      });

      console.log(
        '✅ TopGear Panel gesendet.'
      );

    } catch (error) {

      console.error(
        '❌ Panel Fehler:',
        error
      );

    }

  });


  // =====================================
  // BUTTONS
  // =====================================

  client.on(
    'interactionCreate',
    async interaction => {

      if (!interaction.isButton()) return;

      console.log(
        `🔘 Button: ${interaction.customId}`
      );


      // =================================
      // NEWS
      // =================================

      if (
        interaction.customId === 'news'
      ) {

        return interaction.reply({
          content:
            '📰 News-System wird geöffnet.',
          ephemeral: true
        });

      }


      // =================================
      // XENON
      // =================================

      if (
        interaction.customId === 'xenon'
      ) {

        const modal =
          new ModalBuilder()
            .setCustomId('xenon_modal')
            .setTitle('⚡ Xenon');

        const nameInput =
          new TextInputBuilder()
            .setCustomId('name')
            .setLabel('Kunden Name')
            .setStyle(
              TextInputStyle.Short
            )
            .setRequired(true);

        const plateInput =
          new TextInputBuilder()
            .setCustomId('plate')
            .setLabel('Kennzeichen')
            .setStyle(
              TextInputStyle.Short
            )
            .setRequired(true);

        modal.addComponents(

          new ActionRowBuilder()
            .addComponents(
              nameInput
            ),

          new ActionRowBuilder()
            .addComponents(
              plateInput
            )

        );

        return interaction.showModal(
          modal
        );

      }


      // =================================
      // STANCE
      // =================================

      if (
        interaction.customId === 'stance'
      ) {

        return interaction.reply({
          content:
            '🚗 Stance-System ist aktiv.',
          ephemeral: true
        });

      }


      // =================================
      // URLAUB
      // =================================

      if (
        interaction.customId === 'urlaub'
      ) {

        return interaction.reply({
          content:
            '🌴 Urlaubs-System wird geöffnet.',
          ephemeral: true
        });

      }


      // =================================
      // SANKTION
      // =================================

      if (
        interaction.customId === 'sanktion'
      ) {

        return interaction.reply({
          content:
            '🔨 Sanktions-System wird geöffnet.',
          ephemeral: true
        });

      }


      // =================================
      // SUCHE
      // =================================

      if (
        interaction.customId === 'suche'
      ) {

        return interaction.reply({
          content:
            '🔍 Suche-System wird geöffnet.',
          ephemeral: true
        });

      }

    }
  );

};
