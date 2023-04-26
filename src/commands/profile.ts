import { Schema } from "mongoose";
import { fetchUser, userModal } from "../util/UserUtil/index.js";
import User from "../interfaces/User.js";
import UserModel from "../models/UserModel.js";

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
        const submission = await interaction.awaitModalSubmit({
            time: 240000,
        });

        // silly man did not do the submit in time like a mongrel
        if (!submission) {
            console.log(`Submission canceled due to timeout.`);
            return;
        }
        submission.deferUpdate();

        const name = submission.fields.getTextInputValue("name");
        const bio = submission.fields.getTextInputValue("bio");

        try {
            // update info
            user.displayName = name;
            user.bio = bio;

            await user.save();

            console.log(
                `User ${interaction.user.username} profile updated in db.`
            );
        } catch (error) {
            console.error(
                `Ur mom is invalid (error updating database): ${error}`
            );
        }

        return;
    },
};

export default __profile;
