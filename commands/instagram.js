const { SlashCommandBuilder } = require('@discordjs/builders')
const instagram = require('../web/instagram')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('instagram')
        .setDescription('Responde com os dados do perfil passado'),
    async execute(interation) {
        await instagram.pupinstagramlogin()
    }
}