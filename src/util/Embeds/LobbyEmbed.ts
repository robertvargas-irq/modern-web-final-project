import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
} from "discord.js";
import PlayerManager from "../Player/PlayerManager.js";

export default class LobbyEmbed {
    startTime: number;
    players: PlayerManager;

    constructor(players: PlayerManager) {
        this.startTime = Math.floor(Date.now() / 1000 + 120);
        this.players = players;
    }

    CreateEmbed(disableButtons: boolean = false) {
        const lobbyEmbed = new EmbedBuilder()
            .setTitle("Lobby")
            .setDescription(`The game will start <t:${this.startTime}:R>`)
            .setImage(
                "https://cdn.discordapp.com/attachments/1098006998429216824/1103403070399987823/istockphoto-915871752-612x612.jpg"
            )
            .setTimestamp(Date.now());

        const playerList = this.players
            .getAllPlayers()
            .map((player) => player.member.displayName)
            .join(", ");

        lobbyEmbed.addFields([
            {
                name: "Players:",
                value: playerList || "None",
            },
        ]);

        // creates the join, leave and start now buttons
        const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("join-game")
                .setLabel("Join")
                .setStyle(ButtonStyle.Success)
                .setDisabled(disableButtons),

            new ButtonBuilder()
                .setCustomId("leave-game")
                .setLabel("Leave")
                .setStyle(ButtonStyle.Danger)
                .setDisabled(disableButtons),

            new ButtonBuilder()
                .setCustomId("start-game")
                .setLabel("Start Now")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(disableButtons)
        );

        return { embeds: lobbyEmbed, components: actionRow };
    }
}
