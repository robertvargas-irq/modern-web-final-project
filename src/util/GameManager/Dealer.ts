import CardHand from "../Cards/CardHand.js";

export default class Dealer {
    public cards: CardHand;

    /**
     * Create a new instance of Dealer.
     */
    constructor() {
        this.cards = new CardHand();
    }
}
