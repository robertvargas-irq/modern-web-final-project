import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import GameManager from "../util/GameManager/GameManager.js";
import { fetchMember } from "../util/MemberUtil/MemberFetch.js";

const __lobby: InteractionHandlerPayloads.GuildChatInputCommand = {
    name: "start",
    description: "Start a Black Jack Game",

    async execute(interaction) {
        const gameManager = new GameManager(interaction);

        //test add player
        gameManager.players.addPlayer(
            await fetchMember(interaction.guildId, interaction.member.id),
            interaction.member
        );

        // get the lobby emebed
        const embed = gameManager.LobbyEmbed();

        // creates the join, leave and start now buttons
        const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("join-game")
                .setLabel("Join")
                .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
                .setCustomId("leave-game")
                .setLabel("Leave")
                .setStyle(ButtonStyle.Danger),

            new ButtonBuilder()
                .setCustomId("start-game")
                .setLabel("Start Now")
                .setStyle(ButtonStyle.Primary)
        );

        await interaction.reply({
            embeds: [embed],
            components: [actionRow],
        });

        // starts game in two minutes
        setTimeout(async () => {
            await gameManager.start();
        }, 10 * 1000);
    },
};

export default __lobby;
