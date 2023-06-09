import CardVisual from "./CardVisual.js";
import { SuitCount } from "./CardCosmetics.js";
import { CardData } from "./CardData.js";

/**
 * Initializing options for CardRankSleeve.
 */
interface CardRankSleeveOptions {
    rank: number;
    startingCount: number;
}

/**
 * Helper class for keeping track of the count of
 * suits of a card rank.
 */
export default class CardRankSleeve {
    /**
     * Card rank.
     */
    private readonly rank: number;
    /**
     * Cards currently in the sleeve.
     */
    private cards: Array<number>;
    /**
     * Remaining cards in the sleeve.
     */
    private cardCount: number;
    constructor({ rank, startingCount }: CardRankSleeveOptions) {
        // initialize array with starting count
        this.cardCount = SuitCount * startingCount;
        this.cards = new Array(SuitCount);
        for (let i = 0; i < SuitCount; i++) {
            this.cards[i] = startingCount;
        }

        // card rank
        this.rank = rank;
    }

    /**
     * Check if the card sleeve is empty.
     */
    public get empty() {
        return this.cardCount <= 0;
    }

    /**
     * Check if no more cards remain of a given suit.
     * @param suit Card suit.
     */
    public suitIsEmpty = (suit: number) => this.cards[suit] <= 0;
    /**
     * Decrement the count of a card suit.
     * @param suit Card suit to remove from.
     */
    public remove(suit: number) {
        // ensure sleeve slot is not empty
        if (this.suitIsEmpty(suit)) {
            throw new Error(
                `Trying to remove card from empty sleeve slot; Card suit ${suit} is already empty.`
            );
        }

        // remove from the sleeve slot
        this.cards[suit]--;
        this.cardCount--;
    }
    /**
     * Pull and resolve a card from the sleeve.
     * @param suit Card suit.
     */
    public pull(suit: number) {
        // null if no cards are left
        if (this.suitIsEmpty(suit)) {
            return null;
        }

        // remove from the deck and resolve into a usable card
        this.remove(suit);
        return CardData(this.rank, suit);
    }

    /**
     * Pull a random card from the sleeve.
     */
    public pullRandom() {
        // if empty return null
        if (this.empty) return null;

        // pull a card of a random suit
        const start = Math.floor(Math.random() * SuitCount);

        // iterate until the first non-empty suit sleeve is pulled from
        for (let i = 0; i < SuitCount; i++) {
            const card = this.pull((start + i) % SuitCount);
            if (card) return card;
        }
        return null;
    }
}
