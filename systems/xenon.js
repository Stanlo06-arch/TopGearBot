const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder
} = require('discord.js');

const {
  XENON_CHANNEL_ID,
  LOGO,
  BANNER
} = require('../config/ids');

const xenonData = new Map();

module.exports = (client) => {

  client.on(
    'interactionCreate',
    async interaction => {

      if (
        !interaction.isButton() ||
        interaction.customId !== 'xenon'
      ) {
        return;
      }

      const modal =
        new ModalBuilder()
          .setCustomId(
            'xenon_modal'
          )
          .setTitle(
            '⚡ Xenon'
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
          .setRequired(true);

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
          .setRequired(true);

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


  client.on(
    'interactionCreate',
    async interaction => {

      if (
        !interaction.isModalSubmit() ||
        interaction.customId !==
        'xenon_modal'
      ) {
        return;
      }

      xenonData.set(
        interaction.user.id,
        {
          customerName:
            interaction.fields.getTextInputValue(
              'customer_name'
            ),

          plate:
            interaction.fields.getTextInputValue(
              'plate'
            )
        }
      );

      return interaction.reply({

        content:
          '📸 **Bild senden**.',

        ephemeral: true

      });

    }
  );


  client.on(
    'messageCreate',
    async message => {

      if (message.author.bot) {
        return;
      }

      const data =
        xenonData.get(
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
        !attachment.contentType?.startsWith(
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
          XENON_CHANNEL_ID
        );

      if (!channel) {

        await message.reply(
          '❌ Xenon-Channel nicht gefunden.'
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
            '#2B65FF'
          )

          .setAuthor({
            name:
              'Top Gear Performance'
          })

          .setTitle(
            '⚡ Xenon'
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

      xenonData.delete(
        message.author.id
      );

      await message.reply(
        '✅ Xenon wurde erstellt.'
      );

    }
  );

};
