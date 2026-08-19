const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder
} = require('discord.js');

const {
  URLAUB_CHANNEL_ID,
  LOGO,
  BANNER
} = require('../config/ids');

module.exports = (client) => {

  client.on(
    'interactionCreate',
    async interaction => {

      if (
        !interaction.isButton() ||
        interaction.customId !== 'urlaub'
      ) {
        return;
      }

      const modal =
        new ModalBuilder()
          .setCustomId(
            'urlaub_modal'
          )
          .setTitle(
            '🌴 Urlaub'
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

      const dateInput =
        new TextInputBuilder()
          .setCustomId(
            'zeitraum'
          )
          .setLabel(
            'Zeitraum'
          )
          .setPlaceholder(
            'z.B. 01.09.2026 - 10.09.2026'
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

      modal.addComponents(

        new ActionRowBuilder()
          .addComponents(
            nameInput
          ),

        new ActionRowBuilder()
          .addComponents(
            dateInput
          ),

        new ActionRowBuilder()
          .addComponents(
            reasonInput
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
        'urlaub_modal'
      ) {
        return;
      }

      const channel =
        interaction.guild.channels.cache.get(
          URLAUB_CHANNEL_ID
        );

      if (!channel) {

        return interaction.reply({

          content:
            '❌ Urlaub-Channel nicht gefunden.',

          ephemeral: true

        });

      }

      const name =
        interaction.fields.getTextInputValue(
          'name'
        );

      const zeitraum =
        interaction.fields.getTextInputValue(
          'zeitraum'
        );

      const grund =
        interaction.fields.getTextInputValue(
          'grund'
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
            '#2B65FF'
          )

          .setAuthor({
            name:
              'Top Gear Performance'
          })

          .setTitle(
            '🌴 Urlaub'
          )

          .setDescription(
            `👤 **Name**\n` +
            `${name}\n\n` +

            `📅 **Zeitraum**\n` +
            `${zeitraum}\n\n` +

            `📝 **Grund**\n` +
            `${grund}`
          )

          .setThumbnail(
            LOGO
          )

          .setImage(
            BANNER
          )

          .setFooter({

            text:
              `Erstellt von @${interaction.user.username} ${date} | Hostet by 𝓘𝓽𝓼  𝓢𝓽𝓪𝓷𝔃𝔂 ♕`,

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
          '✅ Urlaub wurde erstellt.',

        ephemeral: true

      });

    }
  );

};
