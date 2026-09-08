const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder
} = require('discord.js');

const {
  XENON_CHANNEL_ID,
  LOGO
} = require('../config/ids');

const xenonData = new Map();

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
  // XENON BUTTON
  // =====================================

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
          .setCustomId('xenon_modal')
          .setTitle('⚡ Xenon');


      // =====================================
      // KUNDEN NAME
      // =====================================

      const nameInput =
        new TextInputBuilder()
          .setCustomId('customer_name')
          .setLabel('Kunden Name')
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
          .setMaxLength(100);


      // =====================================
      // KENNZEICHEN
      // =====================================

      const plateInput =
        new TextInputBuilder()
          .setCustomId('plate')
          .setLabel('Kennzeichen')
          .setStyle(TextInputStyle.Short)
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


      return interaction.showModal(modal);

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
        interaction.customId !== 'xenon_modal'
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


      xenonData.set(
        interaction.user.id,
        {
          customerName,
          plate
        }
      );


      // =====================================
      // BILD SENDEN
      // =====================================

      await interaction.reply({

        content:
          '📸 **Bild senden**\n\n' +
          'Bitte sende jetzt das Bild als normale Discord-Nachricht.',

        ephemeral: false

      });


      const reply =
        await interaction.fetchReply();


      deleteAfter10Seconds(reply);

    }
  );


  // =====================================
  // BILD EMPFANGEN
  // =====================================

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


      // =====================================
      // KEIN BILD
      // =====================================

      if (
        message.attachments.size === 0
      ) {
        return;
      }


      const attachment =
        message.attachments.first();


      // =====================================
      // NUR BILDER ERLAUBEN
      // =====================================

      if (
        !attachment.contentType ||
        !attachment.contentType.startsWith('image/')
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
      // XENON CHANNEL
      // =====================================

      const channel =
        message.guild.channels.cache.get(
          XENON_CHANNEL_ID
        );


      if (!channel) {

        const errorMessage =
          await message.reply(
            '❌ Xenon-Channel nicht gefunden.'
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
      // DATEINAME FÜR DAS BILD
      // =====================================

      const fileName =
        `xenon-${message.id}.png`;


      // =====================================
      // EMBED
      // =====================================

      const embed =
        new EmbedBuilder()

          .setColor('#7CFF00')

          .setAuthor({
            name: 'Top Gear Performance',
            iconURL: LOGO
          })

          .setTitle('⚡ Xenon')

          .setDescription(

            `👤 **Kunden Name**\n` +
            `${data.customerName}\n\n` +

            `🔢 **Kennzeichen**\n` +
            `${data.plate}`

          )

          .setThumbnail(LOGO)

          // BILD DIREKT AUS DEM ANHANG
          .setImage(
            `attachment://${fileName}`
          )

          .setFooter({

            text:
              `Erstellt von @${message.author.username} ${date} | Hostet by 𝐈𝐭𝐬𝐅𝐥𝐮♕`,

            iconURL:
              message.author.displayAvatarURL({
                extension: 'png',
                size: 64
              })

          });


      // =====================================
      // XENON SENDEN
      // BILD DIREKT MIT ANHÄNGEN
      // =====================================

      await channel.send({

        embeds: [
          embed
        ],

        files: [
          {
            attachment: attachment.url,
            name: fileName
          }
        ]

      });


      // =====================================
      // TEMPORÄRE DATEN LÖSCHEN
      // =====================================

      xenonData.delete(
        message.author.id
      );


      // =====================================
      // BESTÄTIGUNG
      // =====================================

      const successMessage =
        await message.reply(
          '✅ **Xenon wurde erstellt.**'
        );


      // Nach 10 Sekunden löschen
      deleteAfter10Seconds(
        successMessage
      );

    }
  );

};
