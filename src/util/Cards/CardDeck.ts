import { CardRanks, SuitCount } from "./CardCosmetics.js";
import CardRankSleeve from "./CardRankSleeve.js";

/**
 * Class to emulate a card deck of multi-suited cards.
 * - There can be multiple card packs mixed into the deck.
 * - Properly initializes each card rank's suit count based
 *   on the number of mixed in card decks.
 */
export class CardDeck {
    private cardSleeves: Array<CardRankSleeve>;
    private cardsRemaining: number;

    /**
     * Create a new CardDeck instance.
     * @param cardPacks
     * The number of card decks mixed into the current hand.
     */
    constructor(cardPacks: number = 1) {
        // validate pack count
        if (cardPacks < 1) {
            throw new Error(
                "Card packs in use must be greater than or equal to 1."
            );
        }

        // populate card sleeves
        this.cardSleeves = new Array(CardRanks);
        for (let rank = 0; rank < CardRanks; rank++) {
            this.cardSleeves[rank] = new CardRankSleeve({
                rank,
                startingCount: cardPacks,
            });
        }

        // cache remaining cards
        this.cardsRemaining = CardRanks * SuitCount * cardPacks;
    }

    /**
     * Check if the deck is empty.
     */
    public get empty() {
        return this.cardsRemaining <= 0;
    }

    /**
     * Get a random card from the deck.
     * @returns Resolved Card.
     */
    public pullRandomCard() {
        // null if empty
        if (this.empty) return null;

        // get from a random rank sleeve
        const startRank = Math.floor(Math.random() * CardRanks);

        // continue until the first non-empty sleeve is reached
        for (let i = 0; i < CardRanks; i++) {
            // get card sleeve
            const sleeve = this.cardSleeves[(startRank + i) % CardRanks];

            // pull a random card from the sleeve
            const card = sleeve.pullRandom();
            if (!card) continue;

            // card pulled, reduce the remaining count and return resolved
            this.cardsRemaining--;
            return card;
        }

        return null;
    }
}
