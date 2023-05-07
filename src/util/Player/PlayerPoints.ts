import { GameOverStates } from "./Player.js";

export const MemberPointsMinimum = -9999;

const ClampMin = (val: number) => Math.max(MemberPointsMinimum, val);
export function CalculatePoints(state: GameOverStates, handValue: number) {
    switch (state) {
        case "win":
            return handValue;
        case "dealt-black-jack":
            return Math.round(handValue * 1.5);
        case "black-jack":
            return Math.round(handValue * 1.25);
        case "tie":
            return 0;
        case "loss":
            return -handValue;
        case "bust":
            return ClampMin(-Math.round((handValue * 3) / 4));
    }
}
