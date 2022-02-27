const { SlashCommandBuilder } = require('@discordjs/builders')
const instagram = require('../web/instagram')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('instagram')
        .setDescription('Responde com os dados do perfil passado')
        .addSubcommand(subcommand =>
            subcommand
                .setName('info')
                .setDescription('Pega as informações de um perfil público')
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

    async execute(interation) {
        await interation.deferReply();

        if (interation.options.getSubcommand() === 'help') {

            const subcommands = this.data.options
            // console.log(subcommands)
            const subcommandsName = []
            for( subcommand of subcommands){
                subcommandsName.push(subcommand.name)
            }

            await interation.editReply(subcommandsName.join(', '))

        } else if (interation.options.getSubcommand() === 'info'){

            

        } else if (interation.options.getSubcommand() === 'explorar'){

        }
    }
}