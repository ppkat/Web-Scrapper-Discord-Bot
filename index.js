const { Client, Intents } = require('discord.js')
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const instagram = require('./web/instagram.js')
require('dotenv').config()

//discord client instance
const client = new Client( {intents: [Intents.FLAGS.GUILDS] })

client.once('ready', () => {
    console.log('Bot on')
})

client.on('interactionCreate', async interation => {
    //console.log(interation)
    if(!interation.isCommand()) return
    if(interation.bot) return

    const { commandName } = interation

    if(commandName === 'interação'){
        await interation.reply(interation.toString())
    }
    else if(commandName == 'instagram'){
        instagram.puppInstagramLogin()
            .then(interation.reply('gramformation'))
        
    }

})


client.login(process.env.BOT_TOKEN)