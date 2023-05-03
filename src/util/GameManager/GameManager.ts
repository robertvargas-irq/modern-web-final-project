import CardDeck from "../Cards/CardDeck.js";
import PlayerManager from "../Player/PlayerManager.js";
import Dealer from "./Dealer.js";

export default class GameManager {
    private interaction: GuildInteractions.ChatInput;
    private players: PlayerManager;
    private dealer: Dealer;
    private deck: CardDeck;

    /**
     * Create a new instance of GameManager.
     * @param interaction The interaction that created the game.
     */
    constructor(interaction: GuildInteractions.ChatInput) {
        this.interaction = interaction;
        this.players = new PlayerManager();
        this.dealer = new Dealer();
        this.deck = new CardDeck();
    }
}
