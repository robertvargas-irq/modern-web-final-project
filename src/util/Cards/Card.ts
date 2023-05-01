import { GetImageURL, GetRankName, GetSuitName } from "./CardCosmetics.js";

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
