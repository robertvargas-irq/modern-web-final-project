const __bing: InteractionHandlerPayloads.GuildChatInputCommand = {
    name: "bing",
    description: "replies with bong",

    async execute(interaction) {
        interaction.reply("Bong!!!")
    }
};

export default __bing