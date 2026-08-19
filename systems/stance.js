const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder
} = require('discord.js');

const {
  STANCE_CHANNEL_ID,
  LOGO,
  BANNER
} = require('../config/ids');

const stanceData = new Map();

module.exports = (client) => {

  // =====================================
  // STANCE BUTTON
  // =====================================

  client.on(
    'interactionCreate',
    async interaction => {

      if (
        !interaction.isButton() ||
        interaction.customId !== 'stance'
      ) {
        return;
      }

      const modal =
        new ModalBuilder()
          .setCustomId(
            'stance_modal'
          )
          .setTitle(
            '🚗 Stance'
          );

      const nameInput =
        new TextInputBuilder()
          .setCustomId(
            'customer_name'
          )
          .setLabel(
            'Kunden Name'
          )
          .setStyle(
            TextInputStyle.Short
          )
          .setRequired(true)
          .setMaxLength(100);

      const plateInput =
        new TextInputBuilder()
          .setCustomId(
            'plate'
          )
          .setLabel(
            'Kennzeichen'
          )
          .setStyle(
            TextInputStyle.Short
          )
          .setRequired(true)
          .setMaxLength(20);

      modal.addComponents(

        new ActionRowBuilder()
          .addComponents(
            nameInput
          ),

        new ActionRowBuilder()
          .addComponents(
            plateInput
          )

      );

      return interaction.showModal(
        modal
      );

    }
  );


  // =====================================
  // MODAL
  // =====================================

  client.on(
    'interactionCreate',
    async interaction => {

      if (
        !interaction.isModalSubmit() ||
        interaction.customId !==
        'stance_modal'
      ) {
        return;
      }

      const customerName =
        interaction.fields.getTextInputValue(
          'customer_name'
        );

      const plate =
        interaction.fields.getTextInputValue(
          'plate'
        );

      stanceData.set(
        interaction.user.id,
        {
          customerName,
          plate
        }
      );

      return interaction.reply({

        content:
          '📸 **Bild senden**.',

        ephemeral: true

      });

    }
  );


  // =====================================
  // BILD EMPFANGEN
  // =====================================

  client.on(
    'messageCreate',
    async message => {

      if (
        message.author.bot
      ) {
        return;
      }

      const data =
        stanceData.get(
          message.author.id
        );

      if (!data) {
        return;
      }

      if (
        message.attachments.size === 0
      ) {
        return;
      }

      const attachment =
        message.attachments.first();

      if (
        !attachment.contentType ||
        !attachment.contentType.startsWith(
          'image/'
        )
      ) {

        await message.reply(
          '❌ Bitte sende ein Bild.'
        );

        return;
      }

      const channel =
        message.guild.channels.cache.get(
          STANCE_CHANNEL_ID
        );

      if (!channel) {

        await message.reply(
          '❌ Stance-Channel nicht gefunden.'
        );

        return;
      }

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
            '#7CFF00'
          )

          .setAuthor({
            name:
              'Top Gear Performance'
          })

          .setTitle(
            '🚗 Stance'
          )

          .setDescription(
            `👤 **Kunden Name**\n` +
            `${data.customerName}\n\n` +

            `🔢 **Kennzeichen**\n` +
            `${data.plate}`
          )

          .setThumbnail(
            LOGO
          )

          .setImage(
            attachment.url
          )

          .setFooter({

            text:
              `Erstellt von @${message.author.username} ${date} | Hostet by 𝓘𝓽𝓼  𝓢𝓽𝓪𝓷𝔃𝔂 ♕`,

            iconURL:
              message.author.displayAvatarURL({
                extension: 'png',
                size: 64
              })

          });


      await channel.send({
        embeds: [
          embed
        ]
      });


      // Daten löschen
      stanceData.delete(
        message.author.id
      );


      await message.reply(
        '✅ Stance wurde erstellt.'
      );

    }
  );

};
