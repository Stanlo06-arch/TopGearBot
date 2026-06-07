const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder
} = require('discord.js');

const {
  LOGO,
  BANNER
} = require('../config/ids');

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

page: 0,

roles: [],

users: []

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

  // SEITEN BUTTONS
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
    'news_next'
  ) {

    const maxPage = Math.ceil(
  interaction.guild.channels.cache
    .filter(c => c.isTextBased())
    .size / 25
) - 1;

data.page = Math.min(
  (data.page || 0) + 1,
  maxPage
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

  if (
    interaction.customId ===
    'news_prev'
  ) {

    data.page = Math.max(
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
    '🎭 Rollen auswählen:',
  components:
    buildRoleMenu(
      interaction.guild,
      0
    ),
  ephemeral: true
});

  }

});


  function buildRoleMenu(guild, page = 0) {

  const roles = guild.roles.cache
    .filter(role => !role.managed)
    .map(role => ({
      label: role.name.slice(0, 100),
      value: role.id
    }));

  const start = page * 25;
  const end = start + 25;

  const currentRoles =
    roles.slice(start, end);

  return [

    new ActionRowBuilder().addComponents(

      new StringSelectMenuBuilder()
        .setCustomId('select_news_roles')
        .setPlaceholder(
          `🎭 Rollen auswählen | Seite ${page + 1}`
        )
        .setMinValues(1)
        .setMaxValues(
          Math.min(
            currentRoles.length,
            25
          )
        )
        .addOptions(currentRoles)

    ),

    new ActionRowBuilder().addComponents(

      new ButtonBuilder()
        .setCustomId('roles_prev')
        .setLabel('⬅️')
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId('roles_next')
        .setLabel('➡️')
        .setStyle(ButtonStyle.Secondary)

    )

  ];

}

  function buildUserMenu(guild, page = 0) {

  const users = [...guild.members.cache.values()]
    .filter(member => !member.user.bot)
    .map(member => ({
      label: member.displayName.slice(0, 100),
      value: member.id
    }));

  const start = page * 25;
  const end = start + 25;

  const currentUsers =
    users.slice(start, end);

  return [

    new ActionRowBuilder().addComponents(

      new StringSelectMenuBuilder()
        .setCustomId('select_news_users')
        .setPlaceholder(
          `👤 Benutzer | Seite ${page + 1}`
        )
        .setMinValues(1)
        .setMaxValues(
          Math.min(currentUsers.length, 2)
        )
        .addOptions(currentUsers)

    ),

    new ActionRowBuilder().addComponents(

      new ButtonBuilder()
        .setCustomId('users_prev')
        .setLabel('⬅️')
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId('users_next')
        .setLabel('➡️')
        .setStyle(ButtonStyle.Secondary)

    )

  ];

  }

  if (
  interaction.customId ===
  'users_next'
) {

  data.userPage =
    (data.userPage || 0) + 1;

  newsData.set(
    interaction.user.id,
    data
  );

  return interaction.update({
    components:
      buildUserMenu(
        interaction.guild,
        data.userPage
      )
  });

}

if (
  interaction.customId ===
  'users_prev'
) {

  data.userPage = Math.max(
    (data.userPage || 0) - 1,
    0
  );

  newsData.set(
    interaction.user.id,
    data
  );

  return interaction.update({
    components:
      buildUserMenu(
        interaction.guild,
        data.userPage
      )
  });

}
  
  // USER AUSWAHL
client.on('interactionCreate', async interaction => {

  if (
    interaction.isStringSelectMenu() &&
    interaction.customId ===
      'select_news_roles'
  ) {

    const data =
      newsData.get(
        interaction.user.id
      );

    if (!data) return;

    data.roles =
      interaction.values;

    newsData.set(
      interaction.user.id,
      data
    );

   data.userPage = 0;

newsData.set(
  interaction.user.id,
  data
);

return interaction.reply({
  content:
    '👤 Benutzer auswählen:',
  components:
    buildUserMenu(
      interaction.guild,
      0
    ),
  ephemeral: true
});
    return interaction.reply({
  content:
    '👤 Benutzer auswählen:',
      components: [

        new ActionRowBuilder()
          .addComponents(

            new StringSelectMenuBuilder()
              .setCustomId(
                'select_news_users'
              )
              .setPlaceholder(
                '👤 Benutzer auswählen'
              )
              .setMinValues(1)
              .setMaxValues(
                options.length
              )
              .addOptions(options)

          )

      ],
      ephemeral: true
    });

  }

});

  // USER SPEICHERN
client.on('interactionCreate', async interaction => {

  if (
    interaction.isStringSelectMenu() &&
    interaction.customId ===
      'select_news_users'
  ) {

    const data =
      newsData.get(
        interaction.user.id
      );

    if (!data) return;

    data.users =
      interaction.values;

    newsData.set(
      interaction.user.id,
      data
    );

    const embed = {
  color: 0x2B65FF,
  title: data.title,
  description: `${data.text}

${mentions}`,
  thumbnail: {
    url: LOGO
  },
  image: {
    url: data.image || BANNER
  }
};

const row =
  new ActionRowBuilder()
    .addComponents(

      new ButtonBuilder()
        .setCustomId(
          'send_news'
        )
        .setLabel(
          '📢 News senden'
        )
        .setStyle(
          ButtonStyle.Success
        )

    );

return interaction.reply({
  content:
    '👀 Vorschau:',
  embeds: [previewEmbed],
  components: [row],
  ephemeral: true
});

  }

});

  client.on('interactionCreate', async interaction => {

  if (!interaction.isButton()) return;

  if (
    interaction.customId !==
    'send_news'
  ) return;

  const data =
    newsData.get(
      interaction.user.id
    );

  if (!data) return;

  const channel =
    interaction.guild.channels.cache.get(
      data.channelId
    );

  if (!channel) {
    return interaction.reply({
      content:
        '❌ Channel nicht gefunden.',
      ephemeral: true
    });
  }

  const mentions = [

    ...(data.roles || [])
      .map(id => `<@&${id}>`),

    ...(data.users || [])
      .map(id => `<@${id}>`)

  ].join(' ');

  const embed = {
    color: 0x2B65FF,
    title: data.title,
    description: data.text,
    thumbnail: {
      url: LOGO
    },
    image: {
      url: data.image || BANNER
    }
  };

  await channel.send({
  embeds: [embed]
});

  newsData.delete(
    interaction.user.id
  );

  return interaction.reply({
    content:
      '✅ News gesendet.',
    ephemeral: true
  });

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
