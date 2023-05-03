import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import GameManager from "../util/GameManager/GameManager.js";
import { fetchMember } from "../util/MemberUtil/MemberFetch.js";

const __lobby: InteractionHandlerPayloads.GuildChatInputCommand = {
    name: "lobby",
    description: "ahhhhhhhhHHHHHhh",

    async execute(interaction) {
        const gameManager = new GameManager(interaction);

        //test add player
        gameManager.players.addPlayer(
            await fetchMember(interaction.guildId, interaction.member.id),
            interaction.member
        );

        const embed = new EmbedBuilder()
            .setTitle("Lobby")
            .setDescription("Waiting for game to start...")
            .setImage(
                "https://cdn.discordapp.com/attachments/1098006998429216824/1103403070399987823/istockphoto-915871752-612x612.jpg"
            )
            .setTimestamp();

        const playerList = gameManager.players
            .getAllPlayers()
            .map((player) => player.member.displayName)
            .join(", ");

        embed.addFields([
            {
                name: "Players:",
                value: playerList || "None",
            },
        ]);

        /** idk wht this dont work
        const joinButton = new ButtonBuilder()
            .setCustomId("join-game")
            .setLabel("Join")
            .setStyle(ButtonStyle.Success);

        const actionRow = new ActionRowBuilder().addComponents(joinButton)
        */

        await interaction.reply({
            embeds: [embed],
            // components: [actionRow] //this line has errors
        });
    },
};

export default __lobby;
