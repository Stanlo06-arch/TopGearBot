const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} = require('discord.js');

const {
  LOGO,
  BANNER
} = require('../config/ids');

module.exports = (client) => {

  client.on('interactionCreate', async interaction => {

    // BUTTON
    if (
      interaction.isButton() &&
      interaction.customId === 'stance'
    ) {

      const modal = new ModalBuilder()
        .setCustomId('stance_modal')
        .setTitle('🚗 Stance');

      const customerInput =
        new TextInputBuilder()
          .setCustomId('customer_name')
          .setLabel('Kunden Name')
          .setStyle(TextInputStyle.Short)
          .setRequired(true);

      const plateInput =
        new TextInputBuilder()
          .setCustomId('plate')
          .setLabel('Kennzeichen')
          .setStyle(TextInputStyle.Short)
          .setRequired(true);

      modal.addComponents(

        new ActionRowBuilder()
          .addComponents(customerInput),

        new ActionRowBuilder()
          .addComponents(plateInput)

      );

      return interaction.showModal(modal);

    }

    // MODAL
    if (
      interaction.isModalSubmit() &&
      interaction.customId === 'stance_modal'
    ) {

      const customer =
        interaction.fields.getTextInputValue(
          'customer_name'
        );

      const plate =
        interaction.fields.getTextInputValue(
          'plate'
        );

      const embed = {
        color: 0x2B65FF,

        title: '🚗 Stance',

        description:
`👤 **Kunden Name:** ${customer}

📄 **Kennzeichen:** ${plate}`,

        thumbnail: {
          url: LOGO
        },

        image: {
          url: BANNER
        },

        footer: {
          text:
            `Erstellt von ${interaction.user.username} ${new Date().toLocaleString('de-DE')} | Hostet by 𝔖𝔱𝔞𝔫𝔩𝔢𝔶_𝔯𝔪𝔭.06 ♕`,
          iconURL:
            interaction.user.displayAvatarURL()
        }
      };

      return interaction.reply({
        embeds: [embed]
      });

    }

  });

};
