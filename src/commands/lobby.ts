import {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} from "discord.js";
import GameManager from "../util/GameManager/GameManager.js";
import { fetchMember } from "../util/MemberUtil/MemberFetch.js";

const __lobby: InteractionHandlerPayloads.GuildChatInputCommand = {
    name: "lobby",
    description: "ahhhhhhhhHHHHHhh",

    async execute(interaction) {
        const gameManager = new GameManager(interaction);

        //test add player
        gameManager.players.addPlayer(
            await fetchMember(interaction.guildId, interaction.member.id),
            interaction.member
        );

        const embed = new EmbedBuilder()
            .setTitle("Lobby")
            .setDescription("Waiting for game to start...")
            .setImage(
                "https://cdn.discordapp.com/attachments/1098006998429216824/1103403070399987823/istockphoto-915871752-612x612.jpg"
            )
            .setTimestamp();

        const playerList = gameManager.players
            .getAllPlayers()
            .map((player) => player.member.displayName)
            .join(", ");

        embed.addFields([
            {
                name: "Players:",
                value: playerList || "None",
            },
        ]);

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
    },
};

export default __lobby;
