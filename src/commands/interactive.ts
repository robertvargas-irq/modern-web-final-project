import { Player } from "../util/Player/Player.js";
import PlayerMenu from "../util/PlayerMenu/PlayerMenu.js";


const __interactive: InteractionHandlerPayloads.GuildChatInputCommand = {
    name: "interactive",
    description: "An interactive menu to start!",
    async execute(interaction) {
        const menu = new PlayerMenu());
    },
};

export default __interactive;
