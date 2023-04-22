const __bong: InteractionHandlerPayloads.GuildChatInputCommand = {
    name: "bong",
    description: "Replies with bong!",
    async execute(interaction) {
        interaction.reply("Bing!");
    },
};

export default __bong;
