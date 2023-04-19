const __ping: InteractionHandlerPayloads.GuildChatInputCommand = {
    name: "ping",
    description: "Replies with pong!",
    async execute(interaction) {
        interaction.reply("Pong!");
    },
};

export default __ping;
