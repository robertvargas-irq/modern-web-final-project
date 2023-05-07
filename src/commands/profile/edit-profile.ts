import { fetchUser, userModal } from "../../util/UserUtil/index.js";

const ModalTime = 240_000;

const __profile: InteractionHandlerPayloads.GuildChatInputCommand = {
    name: "edit-profile",
    description: "Edit your user profile!",
    async execute(interaction) {
        // fetch user profile
        const user = await fetchUser(interaction.user.id);

        // generate modal and display
        const modal = userModal(user);
        interaction.showModal(modal);

        // await results and collect
        const submission = await interaction.awaitModalSubmit({
            time: ModalTime,
        });

        // silly man did not do the submit in time like a mongrel
        if (!submission) {
            console.log("Submission canceled due to timeout.");
            return;
        }
        await submission.deferUpdate();

        try {
            // update info
            const name = submission.fields.getTextInputValue("name");
            const bio = submission.fields.getTextInputValue("bio");
            user.displayName = name;
            user.bio = bio;

            await user.save();

            console.log(
                `User ${interaction.user.username} profile updated in db.`
            );
        } catch (error) {
            submission.followUp({
                content: "There was an error sending in your response",
                ephemeral: true,
            });
            console.error(
                `Ur mom is invalid (error updating database): ${error}`
            );
        }

        return;
    },
};

export default __profile;
