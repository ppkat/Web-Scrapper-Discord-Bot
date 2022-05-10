const { puppInstagram } = require('../../../web/instagram')
const { MessageEmbed } = require('discord.js')

async function execute(interaction) {

    const options = interaction.options
    const quantityInputed = options.getNumber('quantidade')
    const initialEmbedResponse = new MessageEmbed()
        .setColor('#65496E')
        .setTimestamp()
        .setTitle('Posts Aleatórios')
        .setDescription('Quem precisa ir até o instagram para ver alguns posts?')
        .setURL('https://www.instagram.com/explore/')
        .setFooter({
            text: 'Instagram explorar',
            iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/1200px-Instagram_logo_2016.svg.png'
        })

    await interaction.channel.send({ embeds: [initialEmbedResponse] })
    interaction.deferReply()

    const { images, postURL } = await puppInstagram(async ({ exploreImages }) => await exploreImages(quantityInputed))
    console.log(images, postURL)

    images.forEach((item, index) => {

        const imagesEmbed = new MessageEmbed()
            .setColor('#65496E')
            .setTimestamp()
            .setTitle('Post ' + (index + 1).toString())
            .setURL(postURL[index])

        if (typeof item === 'object') { //case the post is a collection
            imagesEmbed.setImage(item[0])
            item.forEach((url, index, arr) => index === 0 ? interaction.channel.send({ embeds: [imagesEmbed] }) : interaction.channel.send(arr[index]))
            return
        }
        imagesEmbed.setImage(item)

        interaction.channel.send({ embeds: [imagesEmbed] })
    })

    interaction.deleteReply()
}

module.exports = { execute }