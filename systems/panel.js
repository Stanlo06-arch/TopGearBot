const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} = require('discord.js');

module.exports = (client) => {

  client.on('interactionCreate', async interaction => {

    if (!interaction.isButton()) return;

    // =========================
    // XENON
    // =========================

    if (interaction.customId === 'xenon') {

      const modal = new ModalBuilder()
        .setCustomId('xenon_modal')
        .setTitle('⚡ Xenon');

      const name = new TextInputBuilder()
        .setCustomId('customer_name')
        .setLabel('Kunden Name')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const plate = new TextInputBuilder()
        .setCustomId('plate')
        .setLabel('Kennzeichen')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      modal.addComponents(
        new ActionRowBuilder().addComponents(name),
        new ActionRowBuilder().addComponents(plate)
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

      const name = new TextInputBuilder()
        .setCustomId('name')
        .setLabel('Name')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const reason = new TextInputBuilder()
        .setCustomId('reason')
        .setLabel('Grund / Zeitraum')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      modal.addComponents(
        new ActionRowBuilder().addComponents(name),
        new ActionRowBuilder().addComponents(reason)
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

      const name = new TextInputBuilder()
        .setCustomId('name')
        .setLabel('Name')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const reason = new TextInputBuilder()
        .setCustomId('reason')
        .setLabel('Grund')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      modal.addComponents(
        new ActionRowBuilder().addComponents(name),
        new ActionRowBuilder().addComponents(reason)
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

      const search = new TextInputBuilder()
        .setCustomId('search')
        .setLabel('Wonach möchtest du suchen?')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      modal.addComponents(
        new ActionRowBuilder().addComponents(search)
      );

      return interaction.showModal(modal);
    }

  });

};
