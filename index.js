const { Client, Intents} = require('discord.js')
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs')
require('dotenv').config()

//discord client instance
const client = new Client( {intents: [Intents.FLAGS.GUILDS] })

//event handling
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'))

for(file of eventFiles){
    const event = require(`./events/${file}`)
    if(event.once){
        client.once(event.name, (...args) => event.listen(client, ...args))
    } else {
        client.on(event.name, (...args) => event.listen(client, ...args))
    }
}

//start log
client.once('ready', c => {
    console.log(`Bot on diretamente do ${c.user.id}`)
})

client.login(process.env.BOT_TOKEN)