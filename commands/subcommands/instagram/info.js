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
    else {
        const serachUserMessage = await instagram.puppInstagram(async ({ searchForUser }) => {
            const responseMessage = await searchForUser(instagramUsernameInputed).then(async usersNames => {
                if (usersNames === 'Invalid Username') return await interaction.editReply({ content: 'Além do usuário não existir, não faço idéia de quem você quiz dizer' })

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

                return await interaction.editReply({ content: 'Usuário inexistente. Você quis dizer:', components: [row] })
            })

            return responseMessage
        })

        console.log(serachUserMessage)

        if (interaction.customId === 'userOptions') {
            await interaction.deferUpdate()

            await info.createEmbed(interaction.values.toString()).then(async embed => {
                await interaction.editReply({ content: 'Aqui as informações de ' + interaction.values.toString(), components: [] })
                await interaction.channel.send({ embeds: [embed] })
            })
        }
    }
}

async function createEmbed(instagramUsernameInputed) {
    const embedResponse = new MessageEmbed()
        .setColor('#65496E')
        .setTimestamp()

    const userData = await instagram.getUserInstagramInfo(instagramUsernameInputed).then(data => data)
    const privado = userData.private ? 'Sim' : 'Não'

    embedResponse
        .setTitle(`Informações de ${userData.username}`)
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

    //fields that users can have or not
    if (userData.verified) embedResponse.setAuthor({ name: userData.username, iconURL: 'https://i.pinimg.com/736x/3d/a3/e0/3da3e019767446593d6bec8547f57b5d.jpg' })
    if (userData.extenalUrl && userData.extenalUrl !== '') embedResponse.addField('Link externo', userData.extenalUrl)
    if (userData.biography !== '' && userData.biography) embedResponse.addField('Bio', userData.biography)
    if (userData.pronouns.lenght && userData.pronouns) embedResponse.addField('Pronomes', userData.pronouns.join(', '))

    if (userData.business) {
        embedResponse
            .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Informações do negócio', value: '\u200B' },
            )

        if (userData.businessAdressJson && userData.businessAdressJson !== '') embedResponse.addField('Endereço', userData.businessAdressJson)
        if (userData.businessContactMethod && userData.businessContactMethod !== '') embedResponse.addField('Contato', userData.businessContactMethod)
        if (userData.businessEmail && userData.businessEmail !== '') embedResponse.addField('Endereço', userData.businessAdressJson)
        if (userData.businessPhoneNumber && userData.businessPhoneNumber !== '') embedResponse.addField('Telefone', userData.businessPhoneNumber, true)
        if (userData.businessCategoryName && userData.businessCategoryName !== '') embedResponse.addField('Categoria', userData.businessCategoryName, true)
        if (userData.categoryEnum && userData.categoryEnum !== '') embedResponse.addField('Numero de categorias', userData.categoryEnum, true)
    }

    return embedResponse
}

module.exports = { execute }