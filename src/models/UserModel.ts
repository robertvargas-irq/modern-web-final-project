import { Schema, model } from "mongoose";
import User from "../interfaces/User.js";

const userSchema = new Schema<User>({
    userId: {
        type: String,
        required: true,
    },
});

const UserModel = model<User>("User", userSchema);
export default UserModel;
