import {
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
} from "discord.js";
import { HydratedDocument } from "mongoose";
import User from "../../interfaces/User.js";

/**
 * Common id for components.
 */
const ModalId = "USER_EDIT";

const userModalComponents = (user: HydratedDocument<User>) => [
    new ActionRowBuilder<TextInputBuilder>({
        components: [
            new TextInputBuilder({
                customId: "name",
                label: "Display Name",
                value: user.displayName ?? "",
                style: TextInputStyle.Short,
            }),
        ],
    }),
    new ActionRowBuilder<TextInputBuilder>({
        components: [
            new TextInputBuilder({
                customId: "bio",
                label: "User Bio",
                value: user.bio ?? "",
                style: TextInputStyle.Paragraph,
            }),
        ],
    }),
];

export const userModal = (user: HydratedDocument<User>) => {
    const components = userModalComponents(user);
    return new ModalBuilder({
        components,
        title: "📝 Editing User Profile",
        customId: `${ModalId}:UserEditor`,
    });
};
