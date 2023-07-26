const parentCommand = require('../../instagram.js')
const { MessageEmbed } = require('discord.js')

async function execute(interaction) {
    await interaction.deferReply();

    const subcommands = parentCommand.data.options

    const embedResponse = new MessageEmbed()
        .setTitle('Comandos Instagram')
        .setDescription('Comandos relacionados ao instagram')
        .setFooter({
            text: 'Instagram Help',
            iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/1200px-Instagram_logo_2016.svg.png'
        })

    for (subcommand of subcommands) {

        if (subcommand.options[0]) {
            const optionNames = []

            //showing options with "<>" 
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
}

module.exports = { execute }