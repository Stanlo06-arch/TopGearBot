const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} = require('discord.js');

module.exports = (client) => {

  client.on('interactionCreate', async interaction => {

    if (!interaction.isButton()) return;

    console.log(
      `🔘 Button gedrückt: ${interaction.customId}`
    );

    // =========================
    // XENON
    // =========================

    if (interaction.customId === 'xenon') {

      const modal = new ModalBuilder()
        .setCustomId('xenon_modal')
        .setTitle('⚡ Xenon');

      const nameInput = new TextInputBuilder()
        .setCustomId('name')
        .setLabel('Kunden Name')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const plateInput = new TextInputBuilder()
        .setCustomId('plate')
        .setLabel('Kennzeichen')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      modal.addComponents(

        new ActionRowBuilder()
          .addComponents(nameInput),

        new ActionRowBuilder()
          .addComponents(plateInput)

      );

      return interaction.showModal(modal);
    }


    // =========================
    // URLAUB
    // =========================

    if (interaction.customId === 'urlaub') {

      const modal = new ModalBuilder()
        .setCustomId('urlaub_modal')
        .setTitle('🌴 Urlaub');

      const nameInput = new TextInputBuilder()
        .setCustomId('name')
        .setLabel('Name')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const reasonInput = new TextInputBuilder()
        .setCustomId('reason')
        .setLabel('Zeitraum / Grund')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      modal.addComponents(

        new ActionRowBuilder()
          .addComponents(nameInput),

        new ActionRowBuilder()
          .addComponents(reasonInput)

      );

      return interaction.showModal(modal);
    }


    // =========================
    // SANKTION
    // =========================

    if (interaction.customId === 'sanktion') {

      const modal = new ModalBuilder()
        .setCustomId('sanktion_modal')
        .setTitle('🔨 Sanktion');

      const nameInput = new TextInputBuilder()
        .setCustomId('name')
        .setLabel('Name')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const reasonInput = new TextInputBuilder()
        .setCustomId('reason')
        .setLabel('Grund')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      modal.addComponents(

        new ActionRowBuilder()
          .addComponents(nameInput),

        new ActionRowBuilder()
          .addComponents(reasonInput)

      );

      return interaction.showModal(modal);
    }


    // =========================
    // SUCHE
    // =========================

    if (interaction.customId === 'suche') {

      const modal = new ModalBuilder()
        .setCustomId('suche_modal')
        .setTitle('🔍 Suche');

      const searchInput = new TextInputBuilder()
        .setCustomId('search')
        .setLabel('Suchbegriff')
        .setPlaceholder('Wonach möchtest du suchen?')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      modal.addComponents(

        new ActionRowBuilder()
          .addComponents(searchInput)

      );

      return interaction.showModal(modal);
    }

  });

};
