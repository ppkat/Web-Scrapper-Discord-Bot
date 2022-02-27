const { Collection } = require('discord.js')
const fs = require('fs')

module.exports = {
    name: 'interactionCreate',
    once: false,
    listen: async (client, interation) => {
        if(!interation.isCommand()) return;
        
        //command handling
        client.commands = new Collection()
        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

        for (file of commandFiles) {
            const command = require(`../commands/${file}`)
            client.commands.set(command.data.name, command)
        }

        const command = client.commands.get(interation.commandName)
        try {
            await command.execute(interation)
        }
        catch (err) {
            console.log(err)
            await interation.reply({ content: 'Houve um erro ao executar o comando', ephemeral: true })
        }
    }
}