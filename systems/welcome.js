const { EmbedBuilder } = require('discord.js');

const {
  WELCOME_CHANNEL_ID,
  LOGO,
  BANNER
} = require('../config/ids');

module.exports = (client) => {

  client.on('guildMemberAdd', async (member) => {

    try {

      const channel =
        await member.guild.channels.fetch(
          WELCOME_CHANNEL_ID
        );

      if (!channel) return;

      const embed = new EmbedBuilder()

        // Grüner Balken
        .setColor('#7CFF00')

        // Oben: kleines Logo + Top Gear Performance
        .setAuthor({
          name: 'Top Gear Performance',
          iconURL: LOGO
        })

        // Profilbild oben links
        .setThumbnail(
          member.user.displayAvatarURL({
            extension: 'png',
            size: 256
          })
        )

        // Überschrift
        .setTitle(
          '👋 Willkommen!'
        )

        // Text
        .setDescription(
          `Willkommen ${member}!\n\n` +
          `Schön, dass du bei **Top Gear Performance** dabei bist. 🚗\n\n` +
          `Wir wünschen dir viel Spaß bei uns!`
        )

        // Banner ganz unten
        .setImage(BANNER)

        // Kleiner Text unten
        .setFooter({
          text:
            `Erstellt von @${member.user.username} | Hostet by 𝓘𝓽𝓼  𝓢𝓽𝓪𝓷𝔃𝔂 ♕`
        })

        .setTimestamp();


      await channel.send({
        content: `${member}`,
        embeds: [embed]
      });


      console.log(
        `👋 Willkommen: ${member.user.tag}`
      );

    } catch (error) {

      console.error(
        '❌ Fehler bei der Willkommensnachricht:',
        error
      );

    }

  });

};
