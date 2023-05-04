import { CardRanks, SuitCount } from "./CardCosmetics.js";
import CardVisual from "./CardVisual.js";

/**
 * Minified wrapper for important card data.
 */
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
export function CardData(rank: number, suit: number): CardData {
    // validate ranges for rank and suit
    if (rank < 0 || rank > CardRanks) {
        throw new Error(
            `CardData error: Given card rank [${rank}] is out of rank range: [0, ${
                CardRanks - 1
            }]`
        );
    }
    if (suit < 0 || suit > SuitCount) {
        throw new Error(
            `CardData error: Given card suit [${suit}] is out of suit range: [0, ${
                SuitCount - 1
            }]`
        );
    }

    // augment card data and return
    return {
        rank,
        suit,
        resolve() {
            return new CardVisual(this);
        },
    };
}
