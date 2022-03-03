const { SlashCommandBuilder, channelMention } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const instagram = require('../web/instagram')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('instagram')
        .setDescription('Responde com os dados do perfil passado')
        .addSubcommand(subcommand =>
            subcommand
                .setName('info')
                .setDescription('Pega as informações de um perfil público')
                .addStringOption(option =>
                    option
                        .setName('usuario')
                        .setDescription('coloque o nome do usuario do instagram')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('explorar')
                .setDescription('Pega um post aleatório')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription('Mostra as opções de comandos instagram')
        ),

    async execute(interaction) {
        const derferreply = await interaction.deferReply();
        const embedResponse = new MessageEmbed()
            .setColor('#65496E')
            .setTimestamp()

        if (interaction.options.getSubcommand() === 'help') {
            derferreply
            const subcommands = this.data.options
            // console.log(subcommands[0].options)

            embedResponse
                .setTitle('Comandos Instagram')
                .setDescription('Comandos relacionados ao instagram')
                .setFooter({
                    text: 'Instagram Help',
                    iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/1200px-Instagram_logo_2016.svg.png'
                })

            for (subcommand of subcommands) {

                if (subcommand.options[0]) {
                    const optionNames = []

                    //showing optins with "<>" 
                    for (option of subcommand.options)
                        optionNames.push(`<${option.name}>`)

                    embedResponse.addField(subcommand.name + ' ' + optionNames.join(' '), subcommand.description)
                }
                else {
                    embedResponse.addField(subcommand.name, subcommand.description)
                }
            }

            interaction.editReply('Aqui os comandos')
            interaction.channel.send({ embeds: [embedResponse] })

        } else if (interaction.options.getSubcommand() === 'info') {
            derferreply

            const option = interaction.options
            const instagramUsernameInputed = option.getString('usuario')

            instagram.getUserInstagramInfo(instagramUsernameInputed).then(data => {
                const privado = data.private? 'Sim' : 'Não'

                embedResponse
                    .setTitle(`Informações do ${data.username}`)
                    .setURL(`https://www.instagram.com/${data.username}`)
                    .setThumbnail(data.hdProfilePicture)
                    .setDescription(`Informações de ${data.fullName} adquiridas através do instagram`)
                    .setFooter({
                        text: 'Instagram info',
                        iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/1200px-Instagram_logo_2016.svg.png'
                    })
                    .addFields(
                        { name: 'Bio', value: data.biography },
                        { name: 'Privado?', value: privado },
                        { name: 'Followers', value: data.followersCount.toString(), inline: true },
                        { name: 'Following', value: data.followingCount.toString(), inline: true },
                        { name: 'Publicações', value: data.publicationsCount.toString(), inline: true },
                        { name: 'Highligh Reels', value: data.highlightsReelsCount.toString(), inline: true },
                        { name: 'Id', value: data.id.toString() }
                    )

                if (data.verified) embedResponse.setAuthor({ name: data.username, iconURL: 'https://i.pinimg.com/736x/3d/a3/e0/3da3e019767446593d6bec8547f57b5d.jpg' })
                if (data.extenalUrl) embedResponse.addField('Link externo', data.extenalUrl)
                //if (data.pronouns !== []) embedResponse.addField('Pronomes', data.pronouns)

                if (data.business) {
                    embedResponse
                        .addFields(
                            { name: '\u200B', value: '\u200B' },
                            { name: 'Informações do negócio', value: '\u200B'},
                            { name: 'Endereço', value: data.businessAdressJson},
                            { name: 'Contato', value: data.businessContactMethod},
                            { name: 'Email', value: data.businessEmail, inline: true},
                            { name: 'Telefone', value: data.businessPhoneNumber, inline: true},
                            { name: 'Categoria', value: data.businessCategoryName},
                            { name: 'Numero de categorias', value: data.categoryEnum, inline: true},
                        )
                }
                interaction.channel.send({ embeds: [embedResponse] })
            })

            interaction.editReply(`Aqui as informações do *${instagramUsernameInputed}*`)

        } else if (interaction.options.getSubcommand() === 'explorar') {
            derferreply

            interaction.editReply({ content: 'NÃO?' })

            interaction.channel.send({ embeds: [embedResponse] })
        }
    }
}