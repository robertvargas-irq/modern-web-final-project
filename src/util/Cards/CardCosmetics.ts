/**
 * Card image URLs.
 */
const ImageURLs = [
    ["", "", "", ""], // Ace
    ["", "", "", ""], // 2
    ["", "", "", ""], // 3
    ["", "", "", ""], // 4
    ["", "", "", ""], // 5
    ["", "", "", ""], // 6
    ["", "", "", ""], // 7
    ["", "", "", ""], // 8
    ["", "", "", ""], // 9
    ["", "", "", ""], // 10
    ["", "", "", ""], // J
    ["", "", "", ""], // K
    ["", "", "", ""], // Q
] as const;

/**
 * Face card names.
 */
const FaceCards = ["Jack", "Queen", "King"] as const;

/**
 * Card suits in play.
 */
const Suits = ["Diamonds", "Clubs", "Hearts", "Spades"] as const;
export type SuitTypes = (typeof Suits)[number];
export const SuitCount = Suits.length;

/**
 * Card ranks in play.
 */
export const CardRanks = 13;

/**
 * Get the associated image URL for a card based
 * on its rank and suit.
 * @param rank Card rank.
 * @param suit Card suit.
 */
export const GetImageURL = (rank: number, suit: number) =>
    ImageURLs[rank][suit];

/**
 * Get the associated name for a card's rank.
 * @param rank Card rank.
 */
export const GetRankName = (rank: number) => {
    // ace card
    if (rank === 0) {
        return "Ace";
    }
    // face cards
    if (rank > 9) {
        return FaceCards[rank - 10];
    }
    // numbered cards
    return `${rank + 1}`;
};

/**
 * Get the string representation of the suit.
 * @param suit Card suit.
 */
export const GetSuitName = (suit: number) => Suits[suit];
