import { ComponentType } from "discord.js";
import LobbyEmbed from "../Embeds/LobbyEmbed.js";
import GameManager from "./GameManager.js";
import { fetchMember } from "../MemberUtil/MemberFetch.js";

export default async function InitGameLobby(gameManager: GameManager) {
    const interaction = gameManager.interaction;
    const lobbyEmbed = new LobbyEmbed(gameManager.players);

    console.log("A lobby has been created");

    // create and display the lobby emebed
    const { embeds: embed, components: actionRow } =
        lobbyEmbed.createMessagePayload();

    const message = await interaction.reply({
        embeds: embed,
        components: actionRow,
    });

    const collector =
        message.createMessageComponentCollector<ComponentType.Button>({
            filter: (i) => i.user.id === interaction.user.id,
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
            if (!gameManager.players.getPlayer(interaction.member.id)) {
                return;
            }

            gameManager.players.removePlayer(interaction.member.id);
            // update lobby player list
            const { embeds: updatePlayers } = lobbyEmbed.createMessagePayload();
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
            gameManager.start();
        }
    }, 120 * 1000);
}
