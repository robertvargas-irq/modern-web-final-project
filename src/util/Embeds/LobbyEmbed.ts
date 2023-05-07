import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    TimestampStyles,
    time,
} from "discord.js";
import PlayerManager from "../Player/PlayerManager.js";

const LOBBY_IMAGE_URL =
    "https://cdn.discordapp.com/attachments/1098006998429216824/1103403070399987823/istockphoto-915871752-612x612.jpg";

export default class LobbyEmbed {
    startTime: number;
    players: PlayerManager;

    constructor(players: PlayerManager, collectionTime: number) {
        this.startTime = Math.floor((Date.now() + collectionTime) / 1000);
        this.players = players;
    }

    createMessagePayload(disableButtons: boolean = false) {
        const lobbyEmbed = new EmbedBuilder()
            .setTitle("🛋️ BlackJack Lobby")
            .setDescription(
                "> Hello there, and welcome to **BlackJack**!" +
                    "\n> Please use the buttons below to join the game, and host, you may start the game at any time!" +
                    `\n> **The game will start ${time(
                        this.startTime,
                        TimestampStyles.RelativeTime
                    )}.**`
            )
            .setImage(LOBBY_IMAGE_URL)
            .setColor("#3494fa")
            .setTimestamp(Date.now());

        const playerList = this.players
            .getAllPlayers()
            .map((player) => `→ ${player.member.displayName}`)
            .join("\n");

        lobbyEmbed.addFields({
            name: "🎲 __Players__",
            value: ">>> " + (playerList || "None yet."),
        });

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

        return { embeds: [lobbyEmbed], components: [actionRow] };
    }
}
