import { EmbedBuilder, Message } from "discord.js";
import CardDeck from "../Cards/CardDeck.js";
import PlayerManager from "../Player/PlayerManager.js";
import Dealer from "./Dealer.js";

/**
 * Number of card decks to be mixed into
 * the in-play deck.
 */
const CardDecks = 5;
const GameStates = ["waiting", "players", "dealer", "end"] as const;

export default class GameManager {
    private interaction: GuildInteractions.ChatInput;
    private dealer: Dealer;
    private deck: CardDeck;
    private state: number;
    public players: PlayerManager;

    /**
     * Create a new instance of GameManager.
     * @param interaction The interaction that created the game.
     */
    constructor(interaction: GuildInteractions.ChatInput) {
        this.interaction = interaction;
        this.players = new PlayerManager();
        this.dealer = new Dealer();
        this.deck = new CardDeck(CardDecks);
        this.state = 0;
    }

    /**
     * Get the game's current state.
     */
    get currentState() {
        return GameStates[this.state];
    }

    /**
     * Advance to the next game state.
     * - Loops around to the beginning if the final
     *   state is passed.
     */
    advanceGameState() {
        this.state = (this.state + 1) % GameStates.length;
    }

    /**
     * Start the game.
     */
    start() {
        // update lobby embed to say the game has started
        const newDescription = this.LobbyEmbed().setDescription(
            "The Game Has Started!"
        );
        this.interaction.editReply({ embeds: [newDescription] });

        // error if the game is empty
        if (this.players.isEmpty) {
            throw new Error(
                "Unable to start the game; no players are present."
            );
        }

        // advance gamestate
        this.advanceGameState();

        // begin game loop
        // ! IMPLEMENT ME
    }

    LobbyEmbed() {
        const lobbyEmbed = new EmbedBuilder()
            .setTitle("Lobby")
            .setDescription(
                `The game will start <t:${Math.floor(
                    Date.now() / 1000 + 10
                )}:R>`
            )
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
        return lobbyEmbed;
    }
}
