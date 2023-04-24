import UserModel from "../../models/UserModel.js";

export const fetchUser = async (userId: string) =>
    (await UserModel.findOne({ userId })) ?? new UserModel({ userId });
