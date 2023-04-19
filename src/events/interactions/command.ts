export default async (interaction: GuildInteractions.ChatInput) => {
    // ensure the command is registered
    const command = interaction.client.commands.get(
        interaction.commandName as unknown as number
    );
    if (!command) return;

    // extract subcommand information
    const SubcommandGroup =
        interaction.options.getSubcommandGroup(false) || null;
    const Subcommand = interaction.options.getSubcommand(false) || null;

    // log call
    console.log(
        "🏓 COMMAND CALL",
        {
            command: {
                id: interaction.commandId,
                name: interaction.commandName,
                subcommandGroup: SubcommandGroup || "---",
                subcommand: Subcommand || "---",
            },
            called: {
                by: interaction.user.tag + " (" + interaction.user.id + ")",
                on: new Date().toLocaleDateString(),
                at: new Date().toLocaleTimeString(),
            },
            in: {
                guild:
                    interaction.guild.name + " (" + interaction.guild.id + ")",
                channel:
                    interaction.channel.name +
                    " (" +
                    interaction.channel.id +
                    ")",
                type: interaction.channel.type,
            },
        },
        "END CALL ⏹️"
    );

    // execute command
    try {
        await command.execute(interaction).catch(console.error);
    } catch (error) {
        console.error(error);

        console.error(
            `${Date()}\n\n` +
                `Command: ${interaction.commandName}\n` +
                `Subcommand Group: ${SubcommandGroup}\n` +
                `Subcommand: ${Subcommand}\n` +
                `Guild: ${interaction.guild.name} (${interaction.guild.id})\n` +
                `Caller: ${interaction.user.tag} (${interaction.user.id})\n` +
                `${error instanceof Error ? error.stack : error}`
        );

        // send error message as a reply
        if (!interaction.replied)
            await interaction.reply({
                content: "There was an error while executing this command!",
                ephemeral: true,
            });
        else
            await interaction.editReply({
                content: "There was an error while executing this command!",
            });
    }
};
