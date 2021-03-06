const { Collection } = require('discord.js')
const fs = require('fs')

module.exports = {
    name: 'interactionCreate',
    once: false,
    listen: async (client, interaction) => {
        if (interaction.isCommand()) {

            //command handling
            client.commands = new Collection()
            const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

            for (file of commandFiles) {
                const command = require(`../commands/${file}`)
                client.commands.set(command.data.name, command)
            }

            const command = client.commands.get(interaction.commandName)
            try {
                await command.execute(interaction)
            }
            catch (err) {
                console.log(err)
                await interaction.editReply({ content: 'Houve um erro ao executar o comando', ephemeral: true })
            }
        }else if (interaction.isSelectMenu()){
            const info = require('../commands/subcommands/instagram/info')
            if(interaction.customId === 'userOptions'){
                await interaction.deferUpdate()

                await info.createEmbed(interaction.values.toString()).then(async embed => {
                    await interaction.editReply({ content: 'Aqui as informações de ' + interaction.values.toString(), components: []})
                    await interaction.channel.send({ embeds: [embed] })
                })
            }
        }
    }
}