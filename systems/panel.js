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

module.exports = (client) => {

  client.on('interactionCreate', async interaction => {

    // ==========================================
    // STANCE BUTTON
    // ==========================================

    if (
      interaction.isButton() &&
      interaction.customId === 'stance'
    ) {

      const modal = new ModalBuilder()
        .setCustomId('stance_modal')
        .setTitle('🏁 Stance');

      // KUNDEN NAME
      const nameInput =
        new TextInputBuilder()
          .setCustomId('customer_name')
          .setLabel('Name')
          .setPlaceholder('Name des Kunden')
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
          .setMaxLength(100);

      // KENNZEICHEN
      const plateInput =
        new TextInputBuilder()
          .setCustomId('plate')
          .setLabel('Kennzeichen')
          .setPlaceholder('z.B. QVC 922')
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
          .setMaxLength(20);

      modal.addComponents(

        new ActionRowBuilder()
          .addComponents(nameInput),

        new ActionRowBuilder()
          .addComponents(plateInput)

      );

      return interaction.showModal(modal);
    }


    // ==========================================
    // MODAL ABSENDEN
    // ==========================================

    if (
      interaction.isModalSubmit() &&
      interaction.customId === 'stance_modal'
    ) {

      try {

        const customerName =
          interaction.fields.getTextInputValue(
            'customer_name'
          );

        const plate =
          interaction.fields.getTextInputValue(
            'plate'
          );

        // STANCE CHANNEL
        const channel =
          interaction.guild.channels.cache.get(
            STANCE_CHANNEL_ID
          );

        if (!channel) {

          return interaction.reply({
            content:
              '❌ Der Stance-Channel wurde nicht gefunden.',
            ephemeral: true
          });

        }


        // ==========================================
        // STANCE EMBED
        // ==========================================

        const embed =
          new EmbedBuilder()

            // GRÜNE FARBE
            .setColor('#7CFF00')

            // OBEN LINKS
            .setAuthor({
              name: 'Top Gear Performance'
            })

            // TITEL
            .setTitle('🏁 Stance')

            // NAME + KENNZEICHEN
            .setDescription(
              `👤 **Name**\n` +
              `${customerName}\n\n` +

              `🔢 **Kennzeichen**\n` +
              `${plate}`
            )

            // LOGO OBEN RECHTS
            .setThumbnail(LOGO)

            // BILD UNTEN
            .setImage(BANNER)

            // FOOTER
            .setFooter({
              text:
                `Erstellt von @${interaction.user.username} | Hostet by 𝓘𝓽𝓼  𝓢𝓽𝓪𝓷𝔃𝔂 ♕`,
              iconURL:
                interaction.user.displayAvatarURL({
                  extension: 'png',
                  size: 64
                })
            });


        // ==========================================
        // IN STANCE CHANNEL SENDEN
        // ==========================================

        await channel.send({
          embeds: [embed]
        });


        // ==========================================
        // BESTÄTIGUNG
        // ==========================================

        return interaction.reply({
          content:
            '✅ Stance wurde erfolgreich erstellt.',
          ephemeral: true
        });

      } catch (error) {

        console.error(
          '❌ Fehler beim Erstellen der Stance:',
          error
        );

        if (!interaction.replied) {

          return interaction.reply({
            content:
              '❌ Beim Erstellen der Stance ist ein Fehler aufgetreten.',
            ephemeral: true
          });

        }

      }

    }

  });

};
