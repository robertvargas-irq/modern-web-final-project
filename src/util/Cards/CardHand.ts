import { CardData } from "./CardData.js";

/**
 * Wrapper for a player's hand of cards.
 */
export default class CardHand {
    cards: Array<CardData>;
    constructor() {
        this.cards = [];
    }

    /**
     * Add a card to the hand.
     * @param card
     */
    add(card: CardData) {
        this.cards.push(card);
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
