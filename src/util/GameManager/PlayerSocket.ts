import { Player, PlayerAction } from "../Player/Player.js";
import GameManager, { GameManagerActions } from "./GameManager.js";

/**
 * Establishes a two-way connection between
 * a player and a game.
 */
export default class PlayerSocket {
    private readonly g: GameManager;
    private readonly p: Player;
    constructor(gameManager: GameManager, player: Player) {
        this.g = gameManager;
        this.p = player;
    }

    /**
     * Emit an action to the GameManager from the Player.
     * @param action Player action performed.
     */
    playerEmit(action: PlayerAction) {
        switch (action) {
            case "hit": {
                // request a new card for the player
                this.g.dealCard(this.p.id);
                break;
            }
            case "stay": {
                // request the player be stayed
                this.g.stayPlayer(this.p.id);
                break;
            }
        }
    }

    /**
     * Get the time remaining in the play phase.
     */
    requestTime() {
        return this.g.timeRemaining;
    }

    /**
     * Emit an action to the Player from the GameManager.
     * @param action Game action performed.
     */
    gameEmit(action: GameManagerActions) {
        switch (action) {
            case "force-stay": {
                // force the player to stay
                this.p.forceStay();
            }
        }
    }
}
