import CardVisual from "./CardVisual.js";

export interface CardData {
    /**
     * The card's rank.
     * - Range: [0,12]
     */
    rank: number;
    /**
     * The card's suit.
     * - Range: [0,3]
     */
    suit: number;
    /**
     * Resolve the card data into a Card Visual
     * for front-end use.
     * @returns Card Visual wrapper.
     */
    resolve: () => CardVisual;
}

/**
 * Generate a card data wrapper.
 * @param rank Card rank.
 * @param suit Card suit.
 * @returns Card data object.
 */
export const CardData = (rank: number, suit: number): CardData => ({
    rank,
    suit,
    resolve() {
        return new CardVisual(this);
    },
});
