import MemberModel, { MemberDocument } from "../../models/MemberModel.js";

export const fetchMember = async (
    guildId: string,
    userId: string
): Promise<MemberDocument> =>
    (await MemberModel.findOne({ guildId, userId })) ??
    new MemberModel({ guildId, userId });
