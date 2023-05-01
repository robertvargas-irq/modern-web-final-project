/**
 * In-play faces.
 * - 4 faces total.
 */
const DefaultFaces = 0b1111;
/**
 * In-play cards.
 * Ace -> 2-10 -> Jack -> Queen -> King
 */
const Cards = 13;

export class CardDeck {
    private cards: Array<number>;
    private cardsRemaining: number;

    /**
     * Create a new CardDeck instance.
     * @param decks The number of card decks
     *              mixed into the current hand.
     */
    constructor(decks: number = 1) {
        // populate cards
        this.cards = new Array(Cards);
        for (let card = 0; card < Cards; card++) {
            this.cards[card] = DefaultFaces;
        }

        // cache remaining cards
        this.cardsRemaining = this.cards.length * 4;
    }
}
