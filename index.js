const { Client, Intents } = require('discord.js')
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const instagram = require('./puppteer/instagram.js')
require('dotenv').config()

//obs: se as variaveis de ambiente estiverem com algum problema, instalar a lib cros-env, que garante que as variaveis de ambiente
//sejam declaradas corretamente em todos os sistemas operacionais

// instanceando o client
const client = new Client( {intents: [Intents.FLAGS.GUILDS] })

client.once('ready', () => {
    console.log('Bot on')
})

/*
const commands = [{
    name: 'instagram',
    description: 'scrap instagram user data'
}]

const rest = new REST({version: '9'}).setToken()*/

client.login(process.env.BOT_TOKEN)