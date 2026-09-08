const { EmbedBuilder } = require('discord.js');

const {
  WELCOME_CHANNEL_ID,
  CUSTOMER_ROLE_ID,
  LOGO,
  BANNER
} = require('../config/ids');

module.exports = (client) => {

  client.on('guildMemberAdd', async (member) => {

    try {

      // 🏷️ Kunden-Rolle geben
      const customerRole = await member.guild.roles.fetch(CUSTOMER_ROLE_ID);

      if (customerRole) {
        await member.roles.add(customerRole);
        console.log(`✅ Kunden-Rolle an ${member.user.tag} vergeben.`);
      }

      // 👋 Willkommenschannel
      const channel = await member.guild.channels.fetch(WELCOME_CHANNEL_ID);

      if (!channel) return;

      const embed = new EmbedBuilder()
        .setColor('#7CFF00')

        .setAuthor({
          name: 'Top Gear Performance',
          iconURL: LOGO
        })

        .setThumbnail(
          member.user.displayAvatarURL({
            extension: 'png',
            size: 256
          })
        )

        .setTitle('👋 Willkommen!')

        .setDescription(
          `Willkommen ${member}!\n\n` +
          `Schön, dass du bei **Top Gear Performance** dabei bist. 🚗\n\n` +
          `Wir wünschen dir viel Spaß bei uns!`
        )

        .setImage(BANNER)

        .setFooter({
          text:
            `Erstellt von @${member.user.username} | Hostet by 𝐈𝐭𝐬𝐅𝐥𝐮♕`
        })

        .setTimestamp();

      await channel.send({
        content: `${member}`,
        embeds: [embed]
      });

    } catch (error) {

      console.error(
        '❌ Fehler bei der Willkommensnachricht/Rollenvergabe:',
        error
      );

    }

  });

};
