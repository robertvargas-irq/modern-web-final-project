import { ButtonInteraction, GuildMember } from "discord.js";
import { MemberDocument } from "../../models/MemberModel.js";
import CardHand from "../Cards/CardHand.js";
import PlayerMenu from "../PlayerMenu/PlayerMenu.js";
import PlayerSocket from "../GameManager/PlayerSocket.js";
import GameManager from "../GameManager/GameManager.js";

type PlayerState =
    | "playing"
    | "stay"
    | "force-stay"
    | "win"
    | "tie"
    | LossStates;
type LossStates = "loss" | "bust";
export type PlayerAction = "hit" | "stay";

/**
 * Wrapper for players in-game.
 */
export class Player {
    public readonly memberDoc: MemberDocument;
    public readonly member: GuildMember;
    public readonly cards: CardHand;
    public state: PlayerState;
    private menu?: PlayerMenu;
    private socket?: PlayerSocket;

    /**
     * Creates a new Player instance.
     * @param memberDoc Member entry in the database.
     * @param member Member snowflake from the guild.
     */
    constructor(memberDoc: MemberDocument, member: GuildMember) {
        this.memberDoc = memberDoc;
        this.member = member;
        this.state = "playing";
        this.cards = new CardHand();
    }

    /**
     * Check if the player is currently playing.
     */
    get playing() {
        return this.state === "playing";
    }

    /**
     * Check if the player has lost.
     * - True if the current player state is "bust" or "loss".
     */
    get lost() {
        return this.state === "bust" || this.state === "loss";
    }

    /**
     * Check if the player is currently staying.
     * - True if the current player state is "stay" or "force-stay".
     */
    get staying() {
        return this.state === "stay" || this.state === "force-stay";
    }

    /**
     * Get the player's id.
     */
    get id() {
        return this.member.id;
    }

    /**
     * Resets stay, loss and cards for player
     */
    reset() {
        this.state = "playing";
        this.cards.clear();
    }

    /**
     * Force a player into staying.
     * - Terminates the player's menu.
     */
    forceStay() {
        this.state = "force-stay";
        if (this.menu) this.menu.terminate("time");
    }

    /**
     * Set a player as win and modify the database
     * entry accordingly.
     * @returns Promise for saving the member document
     * to the database.
     */
    win() {
        this.state = "win";

        // award points based on player's hand

        // increment wins and save
        this.memberDoc.wins++;
        return this.memberDoc.save();
    }

    /**
     * Set a player as loss and modify the database
     * entry accordingly.
     * @param reason Reason for the loss.
     * @returns Promise for saving the member document
     * to the database.
     */
    loss(reason: LossStates) {
        this.state = reason;
        switch (reason) {
            case "bust": {
                break;
            }
            case "loss": {
                break;
            }
        }

        // increment losses and save
        this.memberDoc.losses++;
        return this.memberDoc.save();
    }

    /**
     * Have the player marked as tied with the house.
     */
    tie() {
        this.state = "tie";
    }

    /**
     * Connect to a game via PlayerSocket.
     * @param gameManager Game to connect to.
     */
    connect(gameManager: GameManager) {
        this.socket = new PlayerSocket(gameManager, this);
    }

    /**
     * Request an action to be performed to the GameManager.
     * @param action Action to request from the GameManager.
     */
    request(action: PlayerAction) {
        if (!this.socket) throw new ConnectionError();

        this.socket.playerEmit(action);
    }

    /**
     * Open a player's PlayerMenu on a given interaction.
     * @param interaction Interaction that prompted the menu open.
     */
    openPlayerMenu(interaction: ButtonInteraction) {
        // error if not connected to the game
        if (!this.socket) throw new ConnectionError();

        // terminate previous menu if defined
        if (this.menu) {
            this.menu.terminate("override");
        }

        // create a new menu and open it
        this.menu = new PlayerMenu(
            interaction,
            this,
            this.socket.requestTime()
        );

        // open the menu
        return this.menu.render();
    }
}

/**
 * Helper error for connections.
 */
class ConnectionError extends Error {
    constructor() {
        super(
            "Connection error: Player is not connected to the game via PlayerSocket."
        );
    }
}
