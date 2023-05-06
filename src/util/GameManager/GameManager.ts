import CardDeck from "../Cards/CardDeck.js";
import PlayerManager from "../Player/PlayerManager.js";
import Dealer from "./Dealer.js";
import LobbyEmbed from "../Embeds/LobbyEmbed.js";

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
        // update lobby embed to say the game has started and disable the buttons
        const lobbyEmbed = new LobbyEmbed(this.players);
        const { embeds: lobby, components: actionRow } =
            lobbyEmbed.createMessagePayload(true);

        lobby[0].setDescription("The Game Has Started!");

        this.interaction.editReply({
            embeds: lobby,
            components: actionRow,
        });

        // error if the game is empty
        if (this.players.isEmpty) {
            throw new Error(
                "Unable to start the game; no players are present."
            );
        }

        console.log(
            `A game has started!\nPlayers: ${this.players
                .getAllPlayers()
                .map((player) => player.member.displayName)
                .join(", ")}`
        );

        // advance gamestate
        this.advanceGameState();

        // begin game loop
        // ! IMPLEMENT ME
    }
}
