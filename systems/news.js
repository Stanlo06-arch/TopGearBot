const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

const newsData = new Map();

module.exports = (client) => {

  // BUTTON
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
          .setStyle(TextInputStyle.Short)
          .setRequired(true);

      const textInput =
        new TextInputBuilder()
          .setCustomId('text')
          .setLabel('Text')
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true);

      modal.addComponents(

        new ActionRowBuilder()
          .addComponents(titleInput),

        new ActionRowBuilder()
          .addComponents(textInput)

      );

      return interaction.showModal(modal);
    }

    // BILD ÜBERSPRINGEN
    if (
      interaction.isButton() &&
      interaction.customId === 'skip_news_image'
    ) {

      const data =
        newsData.get(interaction.user.id);

      if (!data) return;

      data.image = null;
      data.waitingImage = false;

      newsData.set(
        interaction.user.id,
        data
      );

      return interaction.reply({
        content:
          '✅ Banner wird automatisch verwendet.',
        ephemeral: true
      });
    }

  });

  // MODAL
  client.on('interactionCreate', async interaction => {

    if (
      interaction.isModalSubmit() &&
      interaction.customId === 'news_modal'
    ) {

      newsData.set(
        interaction.user.id,
        {
          title:
            interaction.fields.getTextInputValue(
              'title'
            ),

          text:
            interaction.fields.getTextInputValue(
              'text'
            ),

          image: null,

          waitingImage: true
        }
      );

      const row =
        new ActionRowBuilder()
          .addComponents(

            new ButtonBuilder()
              .setCustomId(
                'skip_news_image'
              )
              .setLabel(
                '⏭️ Bild überspringen'
              )
              .setStyle(
                ButtonStyle.Secondary
              )

          );

      return interaction.reply({
        content:
          '📸 Bitte ein Bild senden oder überspringen.',
        components: [row],
        ephemeral: true
      });
    }

  });

  // BILD EMPFANGEN
  client.on('messageCreate', async message => {

    if (message.author.bot) return;

    const data =
      newsData.get(message.author.id);

    if (!data) return;

    if (!data.waitingImage) return;

    if (
      message.attachments.size === 0
    ) return;

    const attachment =
      message.attachments.first();

    if (
      !attachment.contentType?.startsWith(
        'image'
      )
    ) {
      return;
    }

    data.image = attachment.url;

    data.waitingImage = false;

    newsData.set(
      message.author.id,
      data
    );

    return message.reply({
      content:
        '✅ Bild gespeichert.'
    });

  });

};
