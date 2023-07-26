const fs = require('fs')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
require('dotenv').config()

const commands = []
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js') || file.endsWith('ts'))

for (file of commandFiles) {
    const command = require(`./commands/${file}`)
    commands.push(command.data.toJSON())
}

const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN)

rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.SERVER_ID), { body: commands })
    .then(() => console.log('commands set'))
    .catch(err => console.log(err))