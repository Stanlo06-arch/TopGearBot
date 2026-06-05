const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder
} = require('discord.js');

const newsData = new Map();

function buildChannelMenu(guild, page = 0) {

  const channels = guild.channels.cache
    .filter(channel => channel.isTextBased())
    .map(channel => ({
      label: channel.name.slice(0, 100),
      value: channel.id
    }));

  const start = page * 25;
  const end = start + 25;

  const currentChannels =
    channels.slice(start, end);

  return [

    new ActionRowBuilder().addComponents(

      new StringSelectMenuBuilder()
        .setCustomId('select_news_channel')
        .setPlaceholder(
          `📢 Channel auswählen | Seite ${page + 1}`
        )
        .addOptions(currentChannels)

    ),

    new ActionRowBuilder().addComponents(

      new ButtonBuilder()
        .setCustomId('news_prev')
        .setLabel('⬅️')
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId('news_next')
        .setLabel('➡️')
        .setStyle(ButtonStyle.Secondary)

    )

  ];

}

module.exports = (client) => {

  // BUTTON
  client.on('interactionCreate', async interaction => {

    // NÄCHSTE SEITE
client.on('interactionCreate', async interaction => {

  if (
    interaction.isButton() &&
    interaction.customId === 'news_next'
  ) {

    const data =
      newsData.get(
        interaction.user.id
      );

    if (!data) return;

    data.page =
      (data.page || 0) + 1;

    newsData.set(
      interaction.user.id,
      data
    );

    return interaction.update({
      components:
        buildChannelMenu(
          interaction.guild,
          data.page
        )
    });

  }

});

// VORHERIGE SEITE
client.on('interactionCreate', async interaction => {

  if (
    interaction.isButton() &&
    interaction.customId === 'news_prev'
  ) {

    const data =
      newsData.get(
        interaction.user.id
      );

    if (!data) return;

    data.page =
      Math.max(
        (data.page || 0) - 1,
        0
      );

    newsData.set(
      interaction.user.id,
      data
    );

    return interaction.update({
      components:
        buildChannelMenu(
          interaction.guild,
          data.page
        )
    });

  }

});

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

      await interaction.reply({
  content:
    '✅ Banner wird automatisch verwendet.',
  ephemeral: true
});

return interaction.followUp({
  content: '📢 Channel auswählen:',
  components: buildChannelMenu(
    interaction.guild,
    0
  ),
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

waitingImage: true,

page: 0

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

// CHANNEL AUSWAHL
client.on('interactionCreate', async interaction => {

  if (
    interaction.isStringSelectMenu() &&
    interaction.customId ===
      'select_news_channel'
  ) {

    const data =
      newsData.get(
        interaction.user.id
      );

    if (!data) return;

    data.channelId =
      interaction.values[0];

    newsData.set(
      interaction.user.id,
      data
    );

    return interaction.reply({
      content:
        '✅ Channel ausgewählt.',
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
