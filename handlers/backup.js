const { Permissions, MessageEmbed } = require("discord.js");
const path = require('path');
const backup = require("discord-backup");

module.exports = async (client) => {
    let backupStorageFolder = path.join(__dirname,`../backups/`)
    client.backupCreate = async function (interaction, Guild,) {
        backup.setStorageFolder(backupStorageFolder);
        try {
            const user = await interaction.guild.members.cache.get(interaction.user.id);
            if (!user.permissions.has(Permissions.FLAGS.ADMINSTRATOR)){
                throw new Error("You are Missing Permission: ADMINSTRATOR")
            }
            backup.create(Guild, {
                jsonBeautify: true,
            }).then((backupData) => {
                user.send("The backup has been created! To load it, type this command on the server of your choice: `/backup load loadbackupid:"+backupData.id+"` !");
                interaction.editReply(":white_check_mark: Backup successfully created. The backup ID was sent in dm!");
            });
        } catch (e) {
            interaction.editReply(`${e}`)
        }
    }
    client.backupDelete = async function (interaction, backupID) {
        backup.setStorageFolder(backupStorageFolder);
        try {
            backup.remove(backupID).then((backupData) => {
                interaction.editReply(":white_check_mark: Backup successfully deleted.");
            });
        } catch (e) {
            interaction.editReply(`${e}`)
        }
    }
    client.backupLoad = async function (interaction, backupID) {
        backup.setStorageFolder(backupStorageFolder);
        try {
            const user = await interaction.guild.members.cache.get(interaction.user.id);
            if (!user.permissions.has(Permissions.FLAGS.ADMINSTRATOR)){
                throw new Error("You are Missing Permission: ADMINSTRATOR")
            }
            if(!backupID){
                return interaction.editReply(":x: | You must specify a valid backup ID!");
            }
            backup.fetch(backupID, { clearGuildBeforeRestore: true }).then(async () => {
                if(!interaction.guild.me.permissions.has(Permissions.FLAGS.ADMINSTRATOR)) {
                    throw new Error("I am Missing Permission: ADMINSTRATOR")
                } else {
                    interaction.editReply(":white_check_mark: | Start loading the backup!");
                    backup.load(backupID, interaction.guild);
                }
            })
        } catch (e) {
            interaction.editReply(`${e}`)
        }
    }
    client.backupInfo = async function (interaction, backupID) {
        backup.setStorageFolder(backupStorageFolder);
        try {
            if(!backupID){
                return interaction.editReply(":x: | You must specify a valid backup ID!");
            }
            backup.fetch(backupID).then((backupInfos) => {
                const date = new Date(backupInfos.data.createdTimestamp);
                const yyyy = date.getFullYear().toString(), mm = (date.getMonth()+1).toString(), dd = date.getDate().toString();
                const formatedDate = `${yyyy}/${(mm[1]?mm:"0"+mm[0])}/${(dd[1]?dd:"0"+dd[0])}`;
                let embed = new MessageEmbed()
                    .setAuthor("Backup Informations")
                    .addField("Backup ID", backupInfos.id, false)
                    .addField("Server Name", backupInfos.data.name, false)
                    .addField("Server ID", backupInfos.data.guildID, false)
                    .addField("Size", `${backupInfos.size} kb`, false)
                    .addField("Created at", formatedDate, false)
                    .setColor("#FF0000");
                    interaction.editReply({embeds: [embed]});
                }).catch((err) => {
                return interaction.editReply(":x: | No backup found for `"+backupID+"`!");
            });
        } catch (e) {
            interaction.editReply(`${e}`)
        }
    }
}