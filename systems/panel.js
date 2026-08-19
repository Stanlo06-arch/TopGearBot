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

    // =========================
    // STANCE BUTTON
    // =========================

    if (
      interaction.isButton() &&
      interaction.customId === 'stance'
    ) {

      const modal =
        new ModalBuilder()
          .setCustomId('stance_modal')
          .setTitle('🚗 Stance');

      const customerInput =
        new TextInputBuilder()
          .setCustomId('customer_name')
          .setLabel('Kunden Name')
          .setPlaceholder('Name des Kunden')
          .setStyle(
            TextInputStyle.Short
          )
          .setRequired(true)
          .setMaxLength(100);

      const plateInput =
        new TextInputBuilder()
          .setCustomId('plate')
          .setLabel('Kennzeichen')
          .setPlaceholder('z.B. M-AB 1234')
          .setStyle(
            TextInputStyle.Short
          )
          .setRequired(true)
          .setMaxLength(20);

      modal.addComponents(

        new ActionRowBuilder()
          .addComponents(
            customerInput
          ),

        new ActionRowBuilder()
          .addComponents(
            plateInput
          )

      );

      return interaction.showModal(modal);
    }


    // =========================
    // STANCE MODAL
    // =========================

    if (
      interaction.isModalSubmit() &&
      interaction.customId === 'stance_modal'
    ) {

      const customer =
        interaction.fields.getTextInputValue(
          'customer_name'
        );

      const plate =
        interaction.fields.getTextInputValue(
          'plate'
        );

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


      // =========================
      // EMBED
      // =========================

      const embed =
        new EmbedBuilder()

          .setColor('#2B65FF')

          .setTitle('🚗 Stance')

          .setDescription(
            `👤 **Kunden Name:** ${customer}\n\n` +
            `📄 **Kennzeichen:** ${plate}`
          )

          .setThumbnail(LOGO)

          .setImage(BANNER)

          .setFooter({
            text:
              `Erstellt von ${interaction.user.username} ${new Date().toLocaleString('de-DE')} | Hostet by 𝔖𝔱𝔞𝔫𝔩𝔢𝔶_𝔯𝔪𝔭.06 ♕`,
            iconURL:
              interaction.user.displayAvatarURL({
                extension: 'png',
                size: 64
              })
          });


      // =========================
      // IN STANCE-CHANNEL SENDEN
      // =========================

      await channel.send({
        embeds: [embed]
      });


      // =========================
      // BESTÄTIGUNG
      // =========================

      return interaction.reply({
        content:
          '✅ Stance wurde erfolgreich erstellt.',
        ephemeral: true
      });

    }

  });

};
