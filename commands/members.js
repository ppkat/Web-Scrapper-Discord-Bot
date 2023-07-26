const { MessageEmbed } = require("discord.js")
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('members')
        .setDescription('Mostra a lista de membros ordenada por ordem de entrada'),

    async execute(interaction) {

        const embed = new MessageEmbed()
            .setTitle('Lista de membros')
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
            .setColor('AQUA')

        const memberList = await interaction.guild.members.fetch()
        const orderedMemberList = memberList.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)

        console.log(orderedMemberList.map(member => member.user.username + ' e ' + member.joinedAt.toString().slice(8, 24)))
        orderedMemberList.forEach(member => embed.addFields({ name: member.user.username, value: member.joinedAt.toString().slice(8, 24) }))

        interaction.channel.send({ embeds: [embed] })
    }
}