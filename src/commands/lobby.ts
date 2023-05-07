import { ComponentType } from "discord.js";
import GameManager from "../util/GameManager/GameManager.js";
import { fetchMember } from "../util/MemberUtil/MemberFetch.js";
import LobbyEmbed from "../util/Embeds/LobbyEmbed.js";

const __lobby: InteractionHandlerPayloads.GuildChatInputCommand = {
    name: "start",
    description: "Start a Black Jack Game",

    async execute(interaction) {
        const gameManager = new GameManager(interaction);
        gameManager.initLobby();
    },
};

export default __lobby;
