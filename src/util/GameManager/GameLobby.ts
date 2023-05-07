import { Colors, ComponentType } from "discord.js";
import LobbyEmbed from "../Embeds/LobbyEmbed.js";
import GameManager from "./GameManager.js";
import { fetchMember } from "../MemberUtil/MemberFetch.js";

const CollectionTime = 120_000;

export default async function InitGameLobby(gameManager: GameManager) {
    const interaction = gameManager.interaction;
    const lobbyEmbed = new LobbyEmbed(gameManager.players, CollectionTime);

    console.log("A lobby has been created");

    // create and display the lobby emebed
    const { embeds, components } = lobbyEmbed.createMessagePayload();

    const message = await interaction.reply({
        embeds,
        components,
    });

    const collector =
        message.createMessageComponentCollector<ComponentType.Button>({
            time: CollectionTime,
        });

    // collector that responds to the buttons
    collector.on("collect", async (i) => {
        await i.deferUpdate();

        if (i.customId === "join-game") {
            // add player if not already in the lobby
            if (gameManager.players.playerExists(interaction.member.id)) {
                return;
            }

            gameManager.players.addPlayer(
                await fetchMember(interaction.guildId, interaction.member.id),
                interaction.member
            );
            // update lobby player list
            const { embeds: updatePlayers } = lobbyEmbed.createMessagePayload();
            interaction.editReply({ embeds: updatePlayers });

            console.log(`Added player ${interaction.member.displayName}`);
        }

        if (i.customId === "leave-game") {
            // remove player if in the lobby
            if (!gameManager.players.playerExists(interaction.member.id)) {
                return;
            }

            gameManager.players.removePlayer(interaction.member.id);
            // update lobby player list
            const { embeds: updatePlayers } = lobbyEmbed.createMessagePayload();
            interaction.editReply({ embeds: updatePlayers });

            console.log(`Removed player ${interaction.member.displayName}`);
        }

        // end the collector to start the game if the host presses it
        if (i.customId === "start-game" && i.user.id === interaction.user.id) {
            collector.stop();
        }
    });

    collector.on("end", () => {
        // start game if waiting
        if (gameManager.currentState === "waiting") {
            // if game is empty, inform and stop
            if (gameManager.players.isEmpty) {
                embeds[0]
                    .setFields([])
                    .setColor(Colors.NotQuiteBlack)
                    .setDescription("> It appears no one has joined :(");
                message.edit({
                    embeds,
                    components: [],
                });
                return;
            }

            // update lobby embed to say the game has started and disable the buttons
            embeds[0]
                .setFields([])
                .setColor(Colors.Navy)
                .setDescription("> The game has begun!");
            message.edit({
                embeds,
                components: [],
            });

            // start the game
            gameManager.start();
        }
    });
}
