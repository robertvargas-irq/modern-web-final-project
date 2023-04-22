const __pong: InteractionHandlerPayloads.GuildChatInputCommand = {
    name: "pong",
    description: "Replies with ping!",
    async execute(interaction) {
        interaction.reply("Ping!");
    },
};

export default __pong;
