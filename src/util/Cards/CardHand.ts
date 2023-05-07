import { CardData } from "./CardData.js";

/**
 * Wrapper for a player's hand of cards.
 */
export default class CardHand {
    private cards: Array<CardData>;
    private totalValue: number;
    private acesPresent: number;
    constructor() {
        this.cards = [];
        this.totalValue = 0;
        this.acesPresent = 0;
    }

    /**
     * Check if the hand is empty.
     */
    get empty() {
        return this.cards.length <= 0;
    }

    /**
     * Get the total value of the current hand.
     */
    get value() {
        return this.totalValue;
    }

    /**
     * Check if the player has busted their hand.
     */
    get bust() {
        return this.totalValue > 21;
    }

    /**
     * Add a card to the hand.
     * @param card
     */
    add(card: CardData) {
        this.cards.push(card);
        this.totalValue += Math.min(10, card.rank + 1);

        // increment the number of aces present + add missing 10 points for ace
        if (card.rank === 0) {
            this.acesPresent++;
            this.totalValue += 10;
        }

        // if a bust, check if salvagable with an ace
        if (this.bust) {
            while (this.acesPresent > 0 && this.bust) {
                // convert the ace from 11 to 1
                this.totalValue -= 10;
                this.acesPresent--;
            }
        }
    }

    /**
     * Clear the hand of cards.
     */
    clear() {
        this.cards = [];
    }

    /**
     * Resolve all cards held into visual representations.
     * @param reverse Get the most recent card on top.
     * @returns Array of visual card representations.
     */
    resolveAll(reverse: boolean = false) {
        const resolved = this.cards.map((c) => c.resolve());
        if (reverse) resolved.reverse();

        return resolved;
    }
}
