const { SlashCommandBuilder, channelMention } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

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

        const embedResponse = new MessageEmbed()
            .setColor('#65496E')
            .setTimestamp()

        //subCommands handling
        const subcommandName = interaction.options.getSubcommand()
        const subcommandFile = require(`./subcommands/instagram/${subcommandName}`)

        await subcommandFile.execute(interaction, embedResponse)
    }
}