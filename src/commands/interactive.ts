import { fetchMember } from "../util/MemberUtil/MemberFetch.js";
import { Player } from "../util/Player/Player.js";
import PlayerMenu from "../util/PlayerMenu/PlayerMenu.js";

const __interactive: InteractionHandlerPayloads.GuildChatInputCommand = {
    name: "interactive",
    description: "An interactive menu to start!",
    async execute(interaction) {
        const menu = new PlayerMenu(
            interaction,
            new Player(
                await fetchMember(interaction.guildId, interaction.user.id),
                interaction.member
            )
        );
        menu.render();
    },
};

export default __interactive;
