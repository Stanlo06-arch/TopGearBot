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
  // HILFSFUNKTION
  // NACHRICHT NACH 10 SEKUNDEN LÖSCHEN
  // =====================================

  const deleteAfter10Seconds = (message) => {

    setTimeout(() => {

      message.delete().catch(() => {});

    }, 10000);

  };


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


      // KUNDEN NAME
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


      // KENNZEICHEN
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
  // MODAL ABSENDEN
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


      // NORMALE NACHRICHT
      // NICHT EPHEMERAL

      await interaction.reply({

        content:
          '📸 **Bild senden**\n\nBitte sende jetzt das Bild als normale Discord-Nachricht.',

        ephemeral: false

      });


      // Antwort holen
      const reply =
        await interaction.fetchReply();


      // Nach 10 Sekunden löschen
      deleteAfter10Seconds(
        reply
      );

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


      // Keine Datei
      if (
        message.attachments.size === 0
      ) {
        return;
      }


      const attachment =
        message.attachments.first();


      // Nur Bilder
      if (
        !attachment.contentType ||
        !attachment.contentType.startsWith(
          'image/'
        )
      ) {

        const errorMessage =
          await message.reply(
            '❌ Bitte sende ein Bild.'
          );

        deleteAfter10Seconds(
          errorMessage
        );

        return;
      }


      // =====================================
      // STANCE CHANNEL
      // =====================================

      const channel =
        message.guild.channels.cache.get(
          STANCE_CHANNEL_ID
        );


      if (!channel) {

        const errorMessage =
          await message.reply(
            '❌ Stance-Channel nicht gefunden.'
          );

        deleteAfter10Seconds(
          errorMessage
        );

        return;
      }


      // =====================================
      // DATUM + UHRZEIT
      // =====================================

      const date =
        new Date().toLocaleString(
          'de-DE',
          {
            dateStyle: 'short',
            timeStyle: 'short'
          }
        );


      // =====================================
      // EMBED
      // =====================================

      const embed =
        new EmbedBuilder()

          // GRÜNE LINIE
          .setColor(
            '#7CFF00'
          )

          .setAuthor({
            name:
              'Top Gear Performance',
            iconURL:
              LOGO
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

          // HOCHGELADENES BILD
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


      // =====================================
      // STANCE SENDEN
      // =====================================

      await channel.send({

        embeds: [
          embed
        ]

      });


      // Temporäre Daten löschen
      stanceData.delete(
        message.author.id
      );


      // =====================================
      // BESTÄTIGUNG
      // =====================================

      const successMessage =
        await message.reply(
          '✅ **Stance wurde erstellt.**'
        );


      // Nach 10 Sekunden löschen
      deleteAfter10Seconds(
        successMessage
      );

    }
  );

};
