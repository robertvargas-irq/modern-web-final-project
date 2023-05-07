import { GuildMember } from "discord.js";
import { Player } from "./Player.js";
import { MemberDocument } from "../../models/MemberModel.js";
import GameManager from "../GameManager/GameManager.js";

type UserId = string;

/**
 * Manager class for Players in a given game.
 */
export default class PlayerManager {
    /**
     * Joined players mapped by their Discord user id.
     */
    private readonly players: Map<UserId, Player>;
    /**
     * Reference back to the GameManager.
     */
    private readonly gameManager: GameManager;

    /**
     * Creates a new instance of PlayerManager.
     * @param gameManager The game this player manager is connected to.
     */
    constructor(gameManager: GameManager) {
        this.players = new Map();
        this.gameManager = gameManager;
    }

    /**
     * Check to see if there are no players
     * in the current manager.
     */
    get isEmpty() {
        return this.players.size <= 0;
    }

    /**
     * Check if all players are ready.
     */
    get allReady() {
        const players = this.getAllPlayers();
        for (let i = 0; i < players.length; i++) {
            if (players[i].playing) return false;
        }

        return true;
    }

    /**
     * Add a player to the game.
     * @param UserDB Member database entry.
     * @param member Discord member snowflake.
     */
    addPlayer(UserDB: MemberDocument, member: GuildMember) {
        // if player already present, return existing
        let existing;
        if ((existing = this.getPlayer(member.id))) {
            return existing;
        }

        // creates instance of player
        const player = new Player(UserDB, member);

        // connect the player to the game
        player.connect(this.gameManager);

        // adds player instance to map with its corresponding id
        this.players.set(member.user.id, player);
        return player;
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
     * Check if the player is in the game.
     * @param memberId Player id to check.
     * @returns
     * - True if in the game.
     * - False if not in the game.
     */
    playerExists(memberId: string) {
        return this.players.has(memberId);
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
    setStay(memberId: string) {
        const player = this.players.get(memberId);
        if (!player) return false;

        player.state = "stay";
        return true;
    }

    forceStay(memberId: string) {
        const player = this.players.get(memberId);
        if (!player) return false;

        player.state = "force-stay";
        return true;
    }

    /**
     * Set a player's loss status.
     * @returns
     * - True if succesful.
     * - False if player does not exist.
     */
    setLoss(memberId: string) {
        const player = this.players.get(memberId);
        if (!player) return false;

        player.state = "loss";
        return true;
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
