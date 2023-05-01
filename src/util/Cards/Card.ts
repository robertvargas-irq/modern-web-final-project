import { GetImageURL, GetRankName, GetSuitName } from "./CardCosmetics.js";

/**
 * Front-facing card wrapper for displaying
 * a card visually to the user.
 * - Resolves a rank and suit to a visual for the user.
 */
export default class Card {
    public readonly rankName;
    public readonly suitName;
    public readonly imageURL;
    constructor(rank: number, suit: number) {
        // assign cosmetic information
        this.rankName = GetRankName(rank);
        this.suitName = GetSuitName(suit);
        this.imageURL = GetImageURL(rank, suit);
    }
}
