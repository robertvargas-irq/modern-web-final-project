import { GuildMember } from "discord.js";
import { MemberDocument } from "../../models/MemberModel.js";

export class Player {
    public loss: boolean;
    public stay: boolean;
    public userDB: MemberDocument;
    public member: GuildMember;
    public cards: number[]; //change this to only take card objects

    constructor(userDB: MemberDocument, member: GuildMember) {
        this.loss = false;
        this.stay = false;
        this.cards = [];
        this.userDB = userDB;
        this.member = member;
    }

    /**
     * resets stay, loss and cards for player
     */
    reset() {
        this.stay = false;
        this.loss = false;
        this.cards = [];
    }
}
