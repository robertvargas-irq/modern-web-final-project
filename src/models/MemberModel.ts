import { HydratedDocument, Schema, model } from "mongoose";
import Member from "../interfaces/Member.js";

/**
 * Member Document entry from the database.
 */
export type MemberDocument = HydratedDocument<Member>;

const memberSchema = new Schema<Member>({
    userId: {
        type: String,
        required: true,
    },
    guildId: {
        type: String,
        required: true,
    },
    displayName: {
        type: String,
        default: null,
    },
    bio: {
        type: String,
        default: null,
    },
    wins: {
        type: Number,
        default: 0,
    },
    losses: {
        type: Number,
        default: 0,
    },
    points: {
        type: Number,
        default: 0,
    },
});

const MemberModel = model<Member>("Member", memberSchema);
export default MemberModel;
