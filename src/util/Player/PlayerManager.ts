import { GuildMember } from "discord.js";
import { Player } from "./player.js";
import { MemberDocument } from "../../models/MemberModel.js";

class PlayerManager {
    players: Map<string, Player>;

    constructor() {
        this.players = new Map();
    }

    addPlayer(UserDB: MemberDocument, member: GuildMember) {
        //creates instance of player
        const player = new Player(UserDB, member);

        //adds player instance to map with its corresponding id
        this.players.set(member.user.id, player);
    }

    getPlayer(memberId: string): Player | undefined {
        return this.players.get(memberId);
    }

    removePlayer(memberId: string): boolean {
        return this.players.delete(memberId);
    }

    getAllPlayers(): Player[] {
        return Array.from(this.players.values());
    }

    /**
     * @returns true if succesfully or false if player does not exist
     */
    setStay(memberId: string, bool: boolean) {
        const player = this.players.get(memberId);

        //check if player exists
        if (player) {
            player.stay = bool;
            return true;
        } else {
            return false;
        }
    }

    /**
     * @returns true if succesfully or false if player does not exist
     */
    setLoss(memberId: string, bool: boolean) {
        const player = this.players.get(memberId);

        //check if player exists
        if (player) {
            player.loss = bool;
            return true;
        } else {
            return false;
        }
    }

    /**
     * sets stay and loss false for all players
     */
    reset() {
        this.players.forEach((player) => {
            player.stay = false;
            player.loss = false;
        });
    }
}

export { PlayerManager };
