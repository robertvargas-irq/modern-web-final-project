import { GuildMember } from "discord.js";
import { Player } from "./Player.js";
import { MemberDocument } from "../../models/MemberModel.js";

type UserId = string;

/**
 * Manager class for Players in a given game.
 */
export default class PlayerManager {
    /**
     * Joined players mapped by their Discord user id.
     */
    private players: Map<UserId, Player>;

    /**
     * Creates a new instance of PlayerManager.
     */
    constructor() {
        this.players = new Map();
    }

    /**
     * Check to see if there are no players
     * in the current manager.
     */
    get isEmpty() {
        return this.players.size <= 0;
    }

    /**
     * Add a player to the game.
     * @param UserDB Member database entry.
     * @param member Discord member snowflake.
     */
    addPlayer(UserDB: MemberDocument, member: GuildMember) {
        // creates instance of player
        const player = new Player(UserDB, member);

        // adds player instance to map with its corresponding id
        this.players.set(member.user.id, player);
    }

    /**
     * Get a player from the manager.
     * @param memberId Player id to fetch.
     * @returns
     * - Player if found.
     * - Undefined if not in the game.
     */
    getPlayer(memberId: string): Player | undefined {
        return this.players.get(memberId);
    }

    /**
     * Remove a player from the manager.
     * @param memberId Player id to remove.
     * @returns
     * - True if a player was removed.
     * - False if the player never existed.
     */
    removePlayer(memberId: string): boolean {
        return this.players.delete(memberId);
    }

    /**
     * Get all joined players in an array.
     * @returns Array of all current players.
     */
    getAllPlayers(): Player[] {
        return Array.from(this.players.values());
    }

    /**
     * Set a player's stay status.
     * @returns
     * - True if succesful.
     * - False if player does not exist.
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
     * Set a player's loss status.
     * @returns
     * - True if succesful.
     * - False if player does not exist.
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
     * Resets stay, loss, and cards for all players.
     */
    resetAll() {
        this.players.forEach((player) => {
            player.reset();
        });
    }
}
