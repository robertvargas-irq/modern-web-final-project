import { ButtonInteraction, GuildMember } from "discord.js";
import { MemberDocument } from "../../models/MemberModel.js";
import CardHand from "../Cards/CardHand.js";
import PlayerMenu from "../PlayerMenu/PlayerMenu.js";
import PlayerSocket from "../GameManager/PlayerSocket.js";
import GameManager from "../GameManager/GameManager.js";

type PlayerState = "playing" | "loss" | "stay" | "force-stay";

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
     * Check if the player is currently staying.
     * - True if the current player state is "stay" or "force-stay".
     */
    get staying() {
        return this.state === "stay" || this.state === "force-stay";
    }

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
     * Connect to a game via PlayerSocket.
     * @param gameManager Game to connect to.
     */
    connect(gameManager: GameManager) {
        this.socket = new PlayerSocket(gameManager, this);
    }

    /**
     * Open a player's PlayerMenu on a given interaction.
     * @param interaction Interaction that prompted the menu open.
     */
    openPlayerMenu(interaction: ButtonInteraction) {
        // error if not connected to the game
        if (!this.socket)
            throw new Error(
                "Player error: Not connected to the game via PlayerSocket."
            );

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
