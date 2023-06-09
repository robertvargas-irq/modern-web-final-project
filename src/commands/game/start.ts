import GameManager from "../../util/GameManager/GameManager.js";

const __lobby: InteractionHandlerPayloads.GuildChatInputCommand = {
    name: "start",
    description: "Start a Black Jack Game",

    async execute(interaction) {
        const gameManager = new GameManager(interaction);
        gameManager.initLobby();
    },
};

export default __lobby;
