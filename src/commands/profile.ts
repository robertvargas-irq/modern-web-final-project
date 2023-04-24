import { fetchUser, userModal } from "../util/UserUtil/index.js";

const __profile: InteractionHandlerPayloads.GuildChatInputCommand = {
    name: "profile",
    description: "Edit your user profile!",
    async execute(interaction) {
        // fetch user profile
        const user = await fetchUser(interaction.user.id);

        // generate modal and display
        const modal = userModal(user);
        interaction.showModal(modal);

        // await results and collect

        return;
    },
};

export default __profile;
