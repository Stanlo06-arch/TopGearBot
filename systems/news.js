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
    .filter(c => c.isTextBased())
    .map(c => ({
      label: c.name.slice(0, 100),
      value: c.id
    }));

  const start = page * 25;
  const current =
    channels.slice(
      start,
      start + 25
    );

  return [

    new ActionRowBuilder()
      .addComponents(

        new StringSelectMenuBuilder()
          .setCustomId(
            'select_news_channel'
          )
          .setPlaceholder(
            `📢 Channel | Seite ${page + 1}`
          )
          .addOptions(current)

      ),

    new ActionRowBuilder()
      .addComponents(

        new ButtonBuilder()
          .setCustomId(
            'channel_prev'
          )
          .setLabel('⬅️')
          .setStyle(
            ButtonStyle.Secondary
          ),

        new ButtonBuilder()
          .setCustomId(
            'channel_next'
          )
          .setLabel('➡️')
          .setStyle(
            ButtonStyle.Secondary
          )

      )

  ];

}

module.exports = (client) => {

  // NEWS BUTTON
  client.on('interactionCreate', async interaction => {

    if (
      !interaction.isButton() ||
      interaction.customId !== 'news'
    ) return;

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

    await interaction.showModal(modal);

  });

  // MODAL ABSENDEN
  client.on('interactionCreate', async interaction => {

    if (
      !interaction.isModalSubmit() ||
      interaction.customId !== 'news_modal'
    ) return;

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

        image: null
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

    await interaction.reply({
      content:
        '📸 Bitte ein Bild senden oder überspringen.',
      components: [row],
      ephemeral: true
    });

  });
  // BILD ÜBERSPRINGEN
  client.on('interactionCreate', async interaction => {

    if (
      !interaction.isButton() ||
      interaction.customId !==
      'skip_news_image'
    ) return;

    const data =
      newsData.get(
        interaction.user.id
      );

    if (!data) return;

    data.image = null;

    newsData.set(
      interaction.user.id,
      data
    );

    data.channelPage = 0;

newsData.set(
  interaction.user.id,
  data
);

await interaction.reply({
  content:
    '📢 Channel auswählen:',
  components:
    buildChannelMenu(
      interaction.guild,
      0
    ),
  ephemeral: true
});

  });

    // BILD EMPFANGEN
  client.on('messageCreate', async message => {

    if (message.author.bot) return;

    const data =
      newsData.get(
        message.author.id
      );

    if (!data) return;

    if (
      message.attachments.size === 0
    ) return;

    const attachment =
      message.attachments.first();

    if (
      !attachment.contentType?.startsWith(
        'image'
      )
    ) return;

    data.image = attachment.url;

    newsData.set(
      message.author.id,
      data
    );

    await message.reply({
      content:
        '✅ Bild gespeichert.'
    });

  });

    // BILD EMPFANGEN
  client.on('messageCreate', async message => {

    if (message.author.bot) return;

    const data =
      newsData.get(
        message.author.id
      );

    if (!data) return;

    if (
      message.attachments.size === 0
    ) return;

    const attachment =
      message.attachments.first();

    if (
      !attachment.contentType?.startsWith(
        'image'
      )
    ) return;

    data.image = attachment.url;

    newsData.set(
      message.author.id,
      data
    );

    data.channelPage = 0;

newsData.set(
  message.author.id,
  data
);

await message.reply({
  content:
    '📢 Channel auswählen.'
});

  });
    // CHANNEL PFEILE
  client.on('interactionCreate', async interaction => {

    if (
      !interaction.isButton()
    ) return;

    const data =
      newsData.get(
        interaction.user.id
      );

    if (!data) return;

    if (
      interaction.customId ===
      'channel_next'
    ) {

      data.channelPage =
        (data.channelPage || 0) + 1;

      newsData.set(
        interaction.user.id,
        data
      );

      return interaction.update({
        components:
          buildChannelMenu(
            interaction.guild,
            data.channelPage
          )
      });

    }

    if (
      interaction.customId ===
      'channel_prev'
    ) {

      data.channelPage = Math.max(
        (data.channelPage || 0) - 1,
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
            data.channelPage
          )
      });

    }

  });

    // CHANNEL AUSWAHL
  client.on('interactionCreate', async interaction => {

    if (
      !interaction.isStringSelectMenu() ||
      interaction.customId !==
      'select_news_channel'
    ) return;

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
        '✅ Channel gespeichert.',
      ephemeral: true
    });

  });
  
};
