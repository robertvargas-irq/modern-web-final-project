import Card from "./Card.js";
import { SuitCount } from "./CardCosmetics.js";

/**
 * Helper class for keeping track of variations
 * of a card and the amount of cards remaining.
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
    constructor({ rank, startingCount }: CardOptions) {
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
     * Check if no more cards remain of a given type.
     * @param variation Card type.
     */
    public variationIsEmpty = (variation: number) => this.cards[variation] <= 0;
    public remove(suit: number) {
        // ensure sleeve slot is not empty
        if (this.variationIsEmpty(suit)) {
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
     * @param variation Card type.
     */
    public pull(variation: number) {
        // null if no cards are left
        if (this.variationIsEmpty(variation)) {
            return null;
        }

        // remove from the deck and resolve into a usable card
        this.remove(variation);
        return new Card(this.rank, variation);
    }

    /**
     * Pull a random card from the sleeve.
     */
    public pullRandom() {
        // if empty return null
        if (this.empty) return null;

        // pull a random card
        const variations = this.cards.length;
        const start = Math.floor(Math.random() * variations);

        // iterate until the first non-empty sleeve is pulled from
        for (let i = 0; i < variations; i++) {
            const card = this.pull((start + i) % variations);
            if (card) return card;
        }
        return null;
    }
}

interface CardOptions {
    rank: number;
    startingCount: number;
}
