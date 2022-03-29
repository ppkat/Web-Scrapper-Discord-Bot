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
                .addNumberOption(option =>
                    option
                        .setName('quantidade')
                        .setDescription('quantidade de posts a serem pegos')
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription('Mostra as opções de comandos instagram')
        ),

    async execute(interaction) {

        //subCommands handling
        const subcommandName = interaction.options.getSubcommand()
        const subcommandFile = require(`./subcommands/instagram/${subcommandName}`)

        await subcommandFile.execute(interaction)
    }
}