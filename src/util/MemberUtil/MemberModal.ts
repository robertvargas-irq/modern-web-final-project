import {
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
} from "discord.js";
import { MemberDocument } from "../../models/MemberModel.js";

/**
 * Common id for components.
 */
const ModalId = "MEMBER_EDIT";

const memberModalComponents = (member: MemberDocument) => [
    new ActionRowBuilder<TextInputBuilder>({
        components: [
            new TextInputBuilder({
                customId: "name",
                label: "Display Name",
                value: member.displayName ?? "",
                style: TextInputStyle.Short,
            }),
        ],
    }),
    new ActionRowBuilder<TextInputBuilder>({
        components: [
            new TextInputBuilder({
                customId: "bio",
                label: "User Bio",
                value: member.bio ?? "",
                style: TextInputStyle.Paragraph,
            }),
        ],
    }),
];

export const memberModal = (member: MemberDocument) => {
    const components = memberModalComponents(member);
    return new ModalBuilder({
        components,
        title: "📝 Editing User Profile",
        customId: `${ModalId}:MemberEditor`,
    });
};
