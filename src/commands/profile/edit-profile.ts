import { fetchMember } from "../../util/MemberUtil/MemberFetch.js";
import { memberModal } from "../../util/MemberUtil/MemberModal.js";

const ModalTime = 240_000;

const __profile: InteractionHandlerPayloads.GuildChatInputCommand = {
    name: "edit-profile",
    description: "Edit your user profile!",
    async execute(interaction) {
        // fetch user profile
        const member = await fetchMember(
            interaction.guild.id,
            interaction.user.id
        );

        // generate modal and display
        const modal = memberModal(member);
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
            member.displayName = name;
            member.bio = bio;

            await member.save();

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
