export const __ping: InteractionHandlerPayloads.GuildChatInputCommand = {
    name: "ping",
    description: "Testing!",
    async execute(interaction) {
        interaction.reply("Hello there!");
    },
};
