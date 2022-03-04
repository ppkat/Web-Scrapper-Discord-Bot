async function execute(interaction, embedResponse) {
    await interaction.deferReply();

    interaction.editReply({ content: 'NÃO?' })
    interaction.channel.send({ embeds: [embedResponse] })

}

module.exports = { execute }