import { ComponentType } from "discord.js";
import GameManager from "../util/GameManager/GameManager.js";
import { fetchMember } from "../util/MemberUtil/MemberFetch.js";
import LobbyEmbed from "../util/Embeds/LobbyEmbed.js";

const __lobby: InteractionHandlerPayloads.GuildChatInputCommand = {
    name: "start",
    description: "Start a Black Jack Game",

    async execute(interaction) {
        const gameManager = new GameManager(interaction);
        const lobbyEmbed = new LobbyEmbed(gameManager.players);

        console.log("A lobby has been created");

        // create and display the lobby emebed
        const { embeds: embed, components: actionRow } =
            lobbyEmbed.createMessagePayload();

        const message = await interaction.reply({
            embeds: embed,
            components: actionRow,
        });

        const collector = message.createMessageComponentCollector({
            filter: (i) => i.user.id === interaction.user.id,
            componentType: ComponentType.Button,
            time: 120_000,
        });

        // collector that responds to the buttons
        collector.on("collect", async (i) => {
            await i.deferUpdate();

            if (i.customId === "join-game") {
                // add player if not already in the lobby
                if (gameManager.players.getPlayer(interaction.member.id)) {
                    return;
                }

                gameManager.players.addPlayer(
                    await fetchMember(
                        interaction.guildId,
                        interaction.member.id
                    ),
                    interaction.member
                );
                // update lobby player list
                const { embeds: updatePlayers } =
                    lobbyEmbed.createMessagePayload();
                interaction.editReply({ embeds: updatePlayers });

                console.log(`Added player ${interaction.member.displayName}`);
            }

            if (i.customId === "leave-game") {
                // remove player if in the lobby
                if (!gameManager.players.getPlayer(interaction.member.id)) {
                    return;
                }

                gameManager.players.removePlayer(interaction.member.id);
                // update lobby player list
                const { embeds: updatePlayers } =
                    lobbyEmbed.createMessagePayload();
                interaction.editReply({ embeds: updatePlayers });

                console.log(`Removed player ${interaction.member.displayName}`);
            }

            if (i.customId === "start-game") {
                gameManager.start();
            }
        });

        // starts game in two minutes
        setTimeout(async () => {
            if (gameManager.currentState === "waiting") {
                await gameManager.start();
            }
        }, 120 * 1000);
    },
};

export default __lobby;
