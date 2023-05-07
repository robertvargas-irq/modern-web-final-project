import { fetchUser } from "../../util/UserUtil/index.js";
import { EmbedBuilder } from "discord.js";

const __showProfile: InteractionHandlerPayloads.GuildChatInputCommand = {
    name: "show-profile",
    description: "Display your profile in a funni embed",
    async execute(interaction) {
        // fetch user profile
        const user = await fetchUser(interaction.user.id);

        // grab all the funni info and throw into a funni embed
        const profileEmbed = new EmbedBuilder({
            color: 0x900c3f,
            title: user.displayName + "'s Profile",
            thumbnail: {
                url: interaction.member.displayAvatarURL(),
            },
            fields: [
                {
                    name: "Bio:",
                    value: user.bio,
                },
                {
                    name: "Wins:",
                    value: user.wins.toString(),
                },
                {
                    name: "Losses:",
                    value: user.losses.toString(),
                },
                {
                    name: "Points:",
                    value: user.points.toString(),
                },
            ],
        });
        // send the funni embed
        interaction.reply({ embeds: [profileEmbed] });
    },
};

export default __showProfile;
