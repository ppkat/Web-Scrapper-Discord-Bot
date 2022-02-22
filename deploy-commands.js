const fs = require('fs')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
require('dotenv').config()

const commands = []

const commandFiles = fs.readdirSync('./commands').filter( file => file.endsWith('.js'))

for(file of commandFiles){
    const command = require(`/commands/${file}`)

    commands.push(command.data.toJSON())
}

    const rest = new REST({version: '9'}).setToken(process.env.BOT_TOKEN)

    rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.PPJEG_ID), {body: commands})
        .then(() => console.log('commands set'))
        .catch(err => console.log(err))