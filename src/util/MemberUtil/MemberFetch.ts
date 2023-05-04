import MemberModel from "../../models/MemberModel.js";

export const fetchMember = async (guildId: string, userId: string) =>
    (await MemberModel.findOne({ guildId, userId })) ??
    new MemberModel({ guildId, userId });
