import { GuildMember } from "discord.js";
import { MemberDocument } from "../../models/MemberModel.js";
import CardHand from "../Cards/CardHand.js";

/**
 * Wrapper for players in-game.
 */
export class Player {
    public memberDoc: MemberDocument;
    public member: GuildMember;
    public cards: CardHand;
    public loss: boolean;
    public stay: boolean;

    /**
     * Creates a new Player instance.
     * @param memberDoc Member entry in the database.
     * @param member Member snowflake from the guild.
     */
    constructor(memberDoc: MemberDocument, member: GuildMember) {
        this.memberDoc = memberDoc;
        this.member = member;
        this.loss = false;
        this.stay = false;
        this.cards = new CardHand();
    }

    /**
     * Resets stay, loss and cards for player
     */
    reset() {
        this.stay = false;
        this.loss = false;
        this.cards.clear();
    }
}
