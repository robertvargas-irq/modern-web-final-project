import { HydratedDocument, Schema, model } from "mongoose";
import Member from "../interfaces/Member.js";
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
});

const MemberModel = model<Member>("User", memberSchema);
export default MemberModel;
