import CardDeck from "../Cards/CardDeck.js";
import PlayerManager from "../Player/PlayerManager.js";
import InitGameLobby from "./GameLobby.js";
import Dealer from "./Dealer.js";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    Colors,
    ComponentType,
    EmbedBuilder,
    GuildTextBasedChannel,
    InteractionCollector,
    Message,
    TimestampStyles,
    time,
} from "discord.js";
import { formatCardsAsString } from "../Cards/CardCosmetics.js";
import { Player } from "../Player/Player.js";

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
    private collector?: InteractionCollector<ButtonInteraction>;
    private gameDisplayMessage?: Message;
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

                // deal starting cards
                this.dealer.cards.add(this.deck.pullRandomCard());
                this.dealStartingCards();

                // display a menu that prompts users to open their game menus
                this.gameDisplayMessage = await this.channel.send({
                    embeds: [
                        new EmbedBuilder({
                            color: Colors.Aqua,
                            title: "🎴 BlackJack",
                            description: `Game will auto-stay all ${time(
                                Math.floor(this.roundEndMs / 1_000),
                                TimestampStyles.RelativeTime
                            )}`,
                            fields: [
                                {
                                    name: `__🃏 Dealer's Cards: ${this.dealer.cards.value} Total Value / 21__`,
                                    value:
                                        ">>> " +
                                        formatCardsAsString(
                                            this.dealer.cards.resolveAll()
                                        ) +
                                        "\n 🔎 *Hidden card*",
                                },
                            ],
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
                this.collector =
                    this.gameDisplayMessage.createMessageComponentCollector<ComponentType.Button>(
                        {
                            filter: (i) => this.players.playerExists(i.user.id),
                            time: GamePlayerTimeMs,
                        }
                    );

                // on message collect
                this.collector.on("collect", async (collected) => {
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
                    this.collector?.on("end", () => {
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
                        if (player.cards.blackjack) player.win("black-jack");
                        else player.win("win");
                    }

                    // players who have less lose
                    else if (player.cards.value < this.dealer.cards.value) {
                        player.loss("loss");
                    }

                    // players who break-even receive nothing in return
                    else {
                        player.tie();
                    }

                    // terminate player menu early
                    player.terminateMenu();
                }
                break;
            }
            case "end": {
                // based on dealer results, display
                const message = this.gameDisplayMessage as Message;
                const digest = this.players.getPlayerDigest();
                message.edit({
                    embeds: [
                        new EmbedBuilder({
                            title:
                                "🧮 The results are in!" +
                                (this.dealer.cards.bust ? " It's a bust!" : ""),
                            color: this.dealer.cards.bust
                                ? Colors.Fuchsia
                                : Colors.Blue,
                            description:
                                "> " +
                                (this.dealer.cards.bust
                                    ? "It appears the dealer has **busted their hand**! All players who are still standing receive a full win!"
                                    : "Time to tally up your scores! All who are still in the game please check your player menu to view who won!"),
                            fields: [
                                {
                                    name: "__❇️ Winners__",
                                    value: ">>> " + formatPlayers(digest.win),
                                    inline: true,
                                },
                                {
                                    name: "__🔻 Loss (vs. dealer)__",
                                    value: ">>> " + formatPlayers(digest.loss),
                                    inline: true,
                                },
                                {
                                    name: "__🚩 Loss (Bust)__",
                                    value: ">>> " + formatPlayers(digest.bust),
                                    inline: true,
                                },
                                {
                                    name: "__🔹 Tied__",
                                    value: ">>> " + formatPlayers(digest.tie),
                                    inline: true,
                                },
                                {
                                    name: `__🃏 Dealer's Cards: ${this.dealer.cards.value} Total Value / 21__`,
                                    value:
                                        ">>> " +
                                        formatCardsAsString(
                                            this.dealer.cards.resolveAll()
                                        ),
                                },
                            ],
                        }),
                    ],
                });
            }
        }

        // advance to the next game state
        this.advanceGameState();
        this.handleGameLogic();
    }

    /**
     * Advance the game if all players are ready.
     */
    private advanceToDealerIfReady() {
        // check if any players are left
        if (this.players.allReady) {
            // proceed after 5 seconds to give a buffer time
            this.collector?.resetTimer({ time: 5_000 });
        }
    }

    /**
     * Deal a card to a given player from the deck.
     * @param playerId The player to deal to.
     */
    dealCard(playerId: string, cardsToDeal: number = 1) {
        const player = this.players.getPlayer(playerId);
        if (!player) return;

        // add a new card to the player's hand
        for (let i = 0; i < cardsToDeal; i++) {
            player.cards.add(this.deck.pullRandomCard());
        }

        // if they bust, mark as bust
        if (player.cards.bust) {
            player.loss("bust");
            this.advanceToDealerIfReady();
        }
    }

    /**
     * Deal all players their starting cards.
     */
    dealStartingCards() {
        for (const { win, cards, id: pId } of this.players.getPlayerIter()) {
            this.dealCard(pId, 2);
            if (cards.blackjack) {
                win("dealt-black-jack");
            }
        }
    }

    /**
     * Have a player stayed.
     * @param playerId The player to stay.
     */
    stayPlayer(playerId: string) {
        // set a player's stay status
        this.players.setStay(playerId);
        this.advanceToDealerIfReady();
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

/**
 * Get a newline-separated string of players.
 * @param players Players to format.
 * @returns Stringified, newline-separated list of players.
 */
function formatPlayers(players: Player[]) {
    return players.length > 0
        ? players
              .map((p) => `(\`${p.cards.value}\`) ${p.member.displayName}`)
              .join("\n")
        : "None";
}
