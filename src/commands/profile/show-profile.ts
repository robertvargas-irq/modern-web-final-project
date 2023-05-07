import { fetchMember } from "../../util/MemberUtil/MemberFetch.js";
import { EmbedBuilder } from "discord.js";

const __showProfile: InteractionHandlerPayloads.GuildChatInputCommand = {
    name: "show-profile",
    description: "Display your profile in a funni embed",
    async execute(interaction) {
        // fetch user profile
        const member = await fetchMember(
            interaction.guild.id,
            interaction.user.id
        );

        // grab all the funni info and throw into a funni embed
        const profileEmbed = new EmbedBuilder({
            color: 0x900c3f,
            title:
                (member.displayName || interaction.member.displayName) +
                "'s Profile",
            thumbnail: {
                url: interaction.member.displayAvatarURL(),
            },
            description: member.bio || undefined,
            fields: [
                {
                    name: "__❇️ Wins__",
                    value: `> \`${member.wins.toString()}\``,
                    inline: true,
                },
                {
                    name: "__🔻 Losses__",
                    value: `> \`${member.losses.toString()}\``,
                    inline: true,
                },
                {
                    name: "__🪙 Points__",
                    value: `> \`${member.points.toString()}\``,
                    inline: true,
                },
            ],
        });
        // send the funni embed
        interaction.reply({ embeds: [profileEmbed] });
    },
};

export default __showProfile;
