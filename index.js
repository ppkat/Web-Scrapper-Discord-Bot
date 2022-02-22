const { Client, Intents, Collection } = require('discord.js')
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs')
require('dotenv').config()

//discord client instance
const client = new Client( {intents: [Intents.FLAGS.GUILDS] })

client.once('ready', () => {
    console.log('Bot on')
})

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
//console.log(commandFiles)

for(file of commandFiles) {
    const command = require(`./commands/${file}`)
    client.command.set(command.data.name, command)
}

client.on('interactionCreate', async interation => {
    if(!interation.isCommand()) return
    if(interation.bot) return

    const command = client.command.get(interation.commandName)

    if(!command) return

    try{
        await command.execute(interation)
    }
    catch(err){
        console.log(err)
        await interation.reply({content: 'Houve um erro ao executar o comando', ephemeral: true})
    }

})

client.login(process.env.BOT_TOKEN)