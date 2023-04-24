const __bing: InteractionHandlerPayloads.GuildChatInputCommand = {
    name: "bing",
    description: "replies with bing-bong meme",

    async execute(interaction) {
        interaction.reply(
            "https://tenor.com/view/sidetalk-sidetalknyc-bing-bong-bing-bong-coney-island-coney-island-gif-24203600"
        );
    },
};

export default __bing;
