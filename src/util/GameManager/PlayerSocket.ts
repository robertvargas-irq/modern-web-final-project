import { Player } from "../Player/Player.js";
import PlayerManager from "../Player/PlayerManager.js";
import { PlayerMenuAction } from "../PlayerMenu/PlayerMenu.js";
import GameManager, { GameManagerActions } from "./GameManager.js";

/**
 * Establishes a two-way connection between
 * a player and a game.
 */
export default class PlayerSocket {
    private g: GameManager;
    private p: Player;
    constructor(gameManager: GameManager, player: Player) {
        this.g = gameManager;
        this.p = player;
    }

    /**
     * Emit an action to the GameManager from the Player.
     * @param action Player action performed.
     */
    playerEmit(action: PlayerMenuAction) {
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