import CardDeck from "../Cards/CardDeck.js";
import PlayerManager from "../Player/PlayerManager.js";
import InitGameLobby from "./GameLobby.js";
import Dealer from "./Dealer.js";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    EmbedBuilder,
    GuildTextBasedChannel,
    TimestampStyles,
    time,
} from "discord.js";

/**
 * Number of card decks to be mixed into
 * the in-play deck.
 */
const CardDecks = 5;
const GameStates = ["waiting", "players", "dealer", "end"] as const;

/**
 * How much time players have to play during the "players" phase.
 */
const GamePlayerTimeMs = 60_000;

/**
 * The minimum hand value a dealer must have
 * before staying.
 */
const DealerMin = 17;

export type GameManagerActions = "force-stay";

export default class GameManager {
    private readonly dealer: Dealer;
    private readonly deck: CardDeck;
    public readonly interaction: GuildInteractions.ChatInput;
    public readonly channel: GuildTextBasedChannel;
    public readonly players: PlayerManager;
    private roundEndMs: number;
    private state: number;

    /**
     * Create a new instance of GameManager.
     * @param interaction The interaction that created the game.
     */
    constructor(interaction: GuildInteractions.ChatInput) {
        this.interaction = interaction;
        this.channel = interaction.channel;
        this.players = new PlayerManager(this);
        this.dealer = new Dealer();
        this.deck = new CardDeck(CardDecks);
        this.state = 0;
        this.roundEndMs = 0;
    }

    /**
     * Get the game's current state.
     */
    get currentState() {
        return GameStates[this.state];
    }

    get timeRemaining() {
        return Math.max(0, this.roundEndMs - Date.now());
    }

    /**
     * Advance to the next game state.
     */
    private advanceGameState() {
        this.state++;
    }

    /**
     * Perform game logic for the current state.
     */
    private async handleGameLogic() {
        // game is over
        if (this.state >= GameStates.length) return;

        // route to proper logic
        switch (this.currentState) {
            case "waiting": {
                // display the lobby menu to users
                return this.initLobby();
            }
            case "players": {
                // initialize round end time
                this.roundEndMs = Date.now() + GamePlayerTimeMs;

                // display a menu that prompts users to open their game menus
                const message = await this.channel.send({
                    embeds: [
                        new EmbedBuilder({
                            title: "Debug",
                            description: `Game will end ${time(
                                Math.floor(this.roundEndMs / 1_000),
                                TimestampStyles.RelativeTime
                            )}`,
                        }),
                    ],
                    components: [
                        new ActionRowBuilder<ButtonBuilder>({
                            components: [
                                new ButtonBuilder({
                                    customId: "gm:open-player-menu",
                                    style: ButtonStyle.Primary,
                                    label: "Open Player Menu",
                                    emoji: "🎮",
                                }),
                            ],
                        }),
                    ],
                });

                // init collector for game button
                const collector =
                    message.createMessageComponentCollector<ComponentType.Button>(
                        {
                            filter: (i) => this.players.playerExists(i.user.id),
                            time: GamePlayerTimeMs,
                        }
                    );

                // on message collect
                collector.on("collect", async (collected) => {
                    const player = this.players.getPlayer(collected.user.id);
                    if (!player) {
                        console.log(
                            `Unable to locate player ${collected.user.tag}.`
                        );
                        return;
                    }

                    // open player menu for the player
                    console.log({ collectedId: collected.id });
                    return player.openPlayerMenu(collected);
                });

                // await the end of the collector
                await new Promise<void>((res) => {
                    // resolve on collector end
                    collector.on("end", () => {
                        console.log("Game is now proceeding.");
                        res();
                    });
                });
                break;
            }
            case "dealer": {
                // dealer draws until the minimum stated value
                while (this.dealer.cards.value < DealerMin) {
                    this.dealer.cards.add(this.deck.pullRandomCard());
                }

                // check each player that is still in the game against the dealer's hand
                for (const player of this.players.getAllPlayers()) {
                    // skip players who already busted
                    if (player.lost) continue;

                    // win if the dealer has busted or if the player has higher hand value
                    if (
                        this.dealer.cards.bust ||
                        player.cards.value > this.dealer.cards.value
                    ) {
                        player.win();
                        continue;
                    }

                    // players who have less lose
                    if (player.cards.value < this.dealer.cards.value) {
                        player.loss("loss");
                        continue;
                    }

                    // players who break-even receive nothing in return
                    player.tie();
                }
                break;
            }
            case "end": {
                // based on dealer results, display
            }
        }

        // advance to the next game state
        this.advanceGameState();
        this.handleGameLogic();
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

        // if they bust, mark as bust
        if (player.cards.bust) {
            player.loss("bust");
        }
    }

    /**
     * Have a player stayed.
     * @param playerId The player to stay.
     */
    stayPlayer(playerId: string) {
        return this.players.setStay(playerId);
    }

    /**
     * Initialize the lobby for players to join.
     */
    initLobby() {
        // error if game is already in progress
        if (this.currentState !== "waiting") {
            throw new Error(
                "GameManager error: Cannot initialize lobby when the game is in progress!"
            );
        }

        // open a new lobby
        return InitGameLobby(this);
    }

    /**
     * Start the game.
     */
    start() {
        // update lobby embed to say the game has started and disable the buttons
        this.interaction.editReply({
            content: "The game has started!",
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

        // advance gamestate and handle logic
        this.advanceGameState();
        this.handleGameLogic();
    }
}
