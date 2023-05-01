import { CardRanks, SuitCount } from "./CardCosmetics.js";
import CardRankSleeve from "./CardRankSleeve.js";

export class CardDeck {
    private cards: Array<CardRankSleeve>;
    private cardsRemaining: number;

    /**
     * Create a new CardDeck instance.
     * @param cardPacks The number of card decks
     *              mixed into the current hand.
     */
    constructor(cardPacks: number = 1) {
        // validate pack count
        if (cardPacks < 1) {
            throw new Error(
                "Card packs in use must be greater than or equal to 1."
            );
        }

        // populate card sleeves
        this.cards = new Array(CardRanks);
        for (let rank = 0; rank < CardRanks; rank++) {
            this.cards[rank] = new CardRankSleeve({
                rank,
                startingCount: cardPacks,
            });
        }

        // cache remaining cards
        this.cardsRemaining = CardRanks * SuitCount * cardPacks;
    }
}
