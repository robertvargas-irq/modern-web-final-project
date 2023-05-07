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

export type GameManagerActions = "force-stay";

export default class GameManager {
    private readonly interaction: GuildInteractions.ChatInput;
    private readonly dealer: Dealer;
    private readonly deck: CardDeck;
    private roundEnd: number;
    private state: number;
    public readonly players: PlayerManager;

    /**
     * Create a new instance of GameManager.
     * @param interaction The interaction that created the game.
     */
    constructor(interaction: GuildInteractions.ChatInput) {
        this.interaction = interaction;
        this.players = new PlayerManager(this);
        this.dealer = new Dealer();
        this.deck = new CardDeck(CardDecks);
        this.state = 0;
        this.roundEnd = 0;
    }

    /**
     * Get the game's current state.
     */
    get currentState() {
        return GameStates[this.state];
    }

    get timeRemaining() {
        return Math.max(0, this.roundEnd - Date.now() / 1_000);
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
     * Deal a card to a given player from the deck.
     * @param playerId The player to deal to.
     */
    dealCard(playerId: string) {
        const player = this.players.getPlayer(playerId);
        if (!player) return;

        // add a new card to the player's hand
        player.cards.add(this.deck.pullRandomCard());
    }

    /**
     * Have a player stayed.
     * @param playerId The player to stay.
     */
    stayPlayer(playerId: string) {
        return this.players.setStay(playerId);
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
