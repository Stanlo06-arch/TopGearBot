const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder
} = require('discord.js');

const {
  SANKTION_CHANNEL_ID,
  LOGO,
  BANNER
} = require('../config/ids');

module.exports = (client) => {

  client.on(
    'interactionCreate',
    async interaction => {

      if (
        !interaction.isButton() ||
        interaction.customId !== 'sanktion'
      ) {
        return;
      }

      const modal =
        new ModalBuilder()
          .setCustomId(
            'sanktion_modal'
          )
          .setTitle(
            '🔨 Sanktion'
          );

      const nameInput =
        new TextInputBuilder()
          .setCustomId(
            'name'
          )
          .setLabel(
            'Name'
          )
          .setStyle(
            TextInputStyle.Short
          )
          .setRequired(true);

      const reasonInput =
        new TextInputBuilder()
          .setCustomId(
            'grund'
          )
          .setLabel(
            'Grund'
          )
          .setStyle(
            TextInputStyle.Paragraph
          )
          .setRequired(true);

      const punishmentInput =
        new TextInputBuilder()
          .setCustomId(
            'sanktion'
          )
          .setLabel(
            'Sanktion'
          )
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
            reasonInput
          ),

        new ActionRowBuilder()
          .addComponents(
            punishmentInput
          )

      );

      return interaction.showModal(
        modal
      );

    }
  );


  client.on(
    'interactionCreate',
    async interaction => {

      if (
        !interaction.isModalSubmit() ||
        interaction.customId !==
        'sanktion_modal'
      ) {
        return;
      }

      const channel =
        interaction.guild.channels.cache.get(
          SANKTION_CHANNEL_ID
        );

      if (!channel) {

        return interaction.reply({

          content:
            '❌ Sanktions-Channel nicht gefunden.',

          ephemeral: true

        });

      }

      const name =
        interaction.fields.getTextInputValue(
          'name'
        );

      const grund =
        interaction.fields.getTextInputValue(
          'grund'
        );

      const sanktion =
        interaction.fields.getTextInputValue(
          'sanktion'
        );

      const date =
        new Date().toLocaleString(
          'de-DE',
          {
            dateStyle: 'short',
            timeStyle: 'short'
          }
        );

      const embed =
        new EmbedBuilder()

          .setColor(
            '#FF0000'
          )

          .setAuthor({
            name:
              'Top Gear Performance'
          })

          .setTitle(
            '🔨 Sanktion'
          )

          .setDescription(
            `👤 **Name**\n` +
            `${name}\n\n` +

            `📋 **Grund**\n` +
            `${grund}\n\n` +

            `🔨 **Sanktion**\n` +
            `${sanktion}`
          )

          .setThumbnail(
            LOGO
          )

          .setImage(
            BANNER
          )

          .setFooter({

            text:
              `Erstellt von @${interaction.user.username} ${date} | Hostet by 𝐈𝐭𝐬𝐅𝐥𝐮♕`,

            iconURL:
              interaction.user.displayAvatarURL({
                extension: 'png',
                size: 64
              })

          });

      await channel.send({
        embeds: [
          embed
        ]
      });

      return interaction.reply({

        content:
          '✅ Sanktion wurde erstellt.',

        ephemeral: true

      });

    }
  );

};
