import { Schema, model } from "mongoose";
import User from "../interfaces/User.js";

const userSchema = new Schema<User>({
    userId: {
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

const UserModel = model<User>("User", userSchema);
export default UserModel;
