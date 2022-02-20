const { SlashCommandBuilder } = require('@discordjs/builders')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
require('dotenv').config()

const commands = [
    new SlashCommandBuilder().setName('instagram').setDescription('Responde com as informações da conta passada no comando'),
    new SlashCommandBuilder().setName('interação').setDescription('Responde com as informações da interação')
]
    .map(command => command.toJSON())

    const rest = new REST({version: '9'}).setToken(process.env.BOT_TOKEN)

    rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.PPJEG_ID), {body: commands})
        .then(() => console.log('commands set'))
        .catch(err => console.log(err))