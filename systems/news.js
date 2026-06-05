const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} = require('discord.js');

module.exports = (client) => {

  client.on('interactionCreate', async interaction => {

    if (
      interaction.isButton() &&
      interaction.customId === 'news'
    ) {

      const modal = new ModalBuilder()
        .setCustomId('news_modal')
        .setTitle('📢 News erstellen');

      const titleInput =
        new TextInputBuilder()
          .setCustomId('title')
          .setLabel('Titel')
          .setStyle(
            TextInputStyle.Short
          )
          .setRequired(true);

      const textInput =
        new TextInputBuilder()
          .setCustomId('text')
          .setLabel('Text')
          .setStyle(
            TextInputStyle.Paragraph
          )
          .setRequired(true);

      modal.addComponents(

        new ActionRowBuilder()
          .addComponents(titleInput),

        new ActionRowBuilder()
          .addComponents(textInput)

      );

      return interaction.showModal(modal);

    }

  });

};
