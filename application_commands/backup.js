const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('backup')
		.setDescription('Create a backup, delete a backup, load a backup and find more information about a backup.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('backup up your guild.')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('delete a backup.')
                .addStringOption(option => 
                    option
                        .setName('deletebackupid')
                        .setDescription('the backupid you will want to use.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('load')
                .setDescription('load a backup in your current guild.')
                .addStringOption(option => 
                    option
                        .setName('loadbackupid')
                        .setDescription('the backupid you will want to use.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('info')
                .setDescription('find more information about a backup.')
                .addStringOption(option => 
                    option
                        .setName('infobackupid')
                        .setDescription('the backupid you will want to use.')
                        .setRequired(true)
                )
        ),
	async execute(interaction, client) {
        if (interaction.options.getSubcommand() === 'create') {
            const user = await interaction.guild.members.cache.get(interaction.user.id);
            if (!user.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)){
                throw new Error("You are Missing Permission: ADMINSTRATOR")
            } else {
                interaction.client.backupCreate(interaction, interaction.guild)
            }
        } else if (interaction.options.getSubcommand() === 'delete') {
            let backupid = interaction.options.getString('deletebackupid')
            interaction.client.backupDelete(interaction, backupid)
        } else if (interaction.options.getSubcommand() === 'load') {
            let backupid = interaction.options.getString('loadbackupid')
            interaction.client.backupLoad(interaction, backupid)
        } else if (interaction.options.getSubcommand() === 'info') {
            let backupid = interaction.options.getString('infobackupid')
            interaction.client.backupInfo(interaction, backupid)
        }
    }
}