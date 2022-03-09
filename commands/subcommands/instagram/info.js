const instagram = require('../../../web/instagram')
const { MessageButton, MessageActionRow, MessageSelectMenu, MessageEmbed } = require('discord.js')

async function execute(interaction) {
    await interaction.deferReply();

    const option = interaction.options
    const instagramUsernameInputed = option.getString('usuario')

    const userExists = await instagram.puppInstagram(async ({ checkIfUserExists }) => {
        return await checkIfUserExists(instagramUsernameInputed).then(bool => bool)
    })

    if (userExists) await createEmbed(instagramUsernameInputed).then(embed => {
        interaction.channel.send({ embeds: [embed] })
        interaction.editReply(`Aqui as informações de *${instagramUsernameInputed}*`)
    })
    else{
        await instagram.puppInstagram(({ searchForUser }) => {
            searchForUser(instagramUsernameInputed).then(async usersNames => {

                const row = new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setCustomId('userOptions')
                        .setPlaceholder('Selecione o usuário')
                )

                usersNames.forEach(element => {
                    row.components[0].addOptions([{
                        label: element,
                        value: element
                    }])
                });

                await interaction.editReply({ content:'Usuário inexistente. Você quis dizer:', components: [row]})
            })
        })
    }
}

async function createEmbed(instagramUsernameInputed) {
    const embedResponse = new MessageEmbed()
            .setColor('#65496E')
            .setTimestamp()

    const userData = await instagram.getUserInstagramInfo(instagramUsernameInputed).then(data => data)
    const privado = userData.private ? 'Sim' : 'Não'

    embedResponse
        .setTitle(`Informações do ${userData.username}`)
        .setURL(`https://www.instagram.com/${userData.username}`)
        .setThumbnail(userData.hdProfilePicture)
        .setDescription(`Informações de ${userData.fullName} adquiridas através do instagram`)
        .setFooter({
            text: 'Instagram info',
            iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/1200px-Instagram_logo_2016.svg.png'
        })
        .addFields(
            { name: 'Privado?', value: privado, inline: true },
            { name: 'Followers', value: userData.followersCount, inline: true },
            { name: 'Following', value: userData.followingCount, inline: true },
            { name: 'Publicações', value: userData.publicationsCount, inline: true },
            { name: 'Highligh Reels', value: userData.highlightsReelsCount, inline: true },
            { name: 'Id', value: userData.id, inline: true }
        )

    if (userData.verified) embedResponse.setAuthor({ name: userData.username, iconURL: 'https://i.pinimg.com/736x/3d/a3/e0/3da3e019767446593d6bec8547f57b5d.jpg' })
    if (userData.extenalUrl) embedResponse.addField('Link externo', userData.extenalUrl)
    if(userData.biography !== '') embedResponse.addField('Bio', userData.biography)
    if (userData.pronouns) embedResponse.addField('Pronomes', userData.pronouns.join(', ') + ' ')

    if (userData.business) {
        embedResponse
            .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Informações do negócio', value: '\u200B' },
                { name: 'Endereço', value: userData.businessAdressJson + ' ' },
                { name: 'Contato', value: userData.businessContactMethod + ' ' },
                { name: 'Email', value: userData.businessEmail + ' ', inline: true },
                { name: 'Telefone', value: userData.businessPhoneNumber + ' ', inline: true },
                { name: 'Categoria', value: userData.businessCategoryName + ' ' },
                { name: 'Numero de categorias', value: userData.categoryEnum + ' ', inline: true },
            )
    }

    return embedResponse
}

module.exports = { execute, createEmbed }