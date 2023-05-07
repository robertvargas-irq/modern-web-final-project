import { ButtonInteraction, GuildMember } from "discord.js";
import { MemberDocument } from "../../models/MemberModel.js";
import CardHand from "../Cards/CardHand.js";

type PlayerState = "playing" | "loss" | "stay" | "force-stay";

/**
 * Wrapper for players in-game.
 */
export class Player {
    public memberDoc: MemberDocument;
    public member: GuildMember;
    public state: PlayerState;
    public cards: CardHand;

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

    /**
     * Resets stay, loss and cards for player
     */
    reset() {
        this.state = "playing";
        this.cards.clear();
    }

    /**
     * Open a player's PlayerMenu on a given interaction.
     * -
     * @param interaction Interaction that prompted the menu open.
     */
    openPlayerMenu(interaction: ButtonInteraction) {}
}
