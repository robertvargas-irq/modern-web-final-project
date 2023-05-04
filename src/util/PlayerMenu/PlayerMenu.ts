import {
    ComponentType,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    Message,
    ComponentBuilder,
    RepliableInteraction,
} from "discord.js";

import { fetchUser } from "../UserUtil/UserFetch.js";
import { Player } from "../Player/Player.js";

const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
        .setCustomId("stay")
        .setLabel("Stay")
        .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
        .setCustomId("hit")
        .setLabel("Hit")
        .setStyle(ButtonStyle.Success)
);

export default class PlayerMenu {
    private message?: Message;
    private interaction: RepliableInteraction;
    private player: Player;

    constructor(interaction: RepliableInteraction, player: Player) {
        this.interaction = interaction;
        this.player = player;
    }

    private generateEmbeds() {
        const embed = new EmbedBuilder()
            .setTitle("Welcome to BlackJack bot")
            .setDescription(
                `Welcome ${this.player.member.displayName} to your BlackJack game!`
            )
            .setColor(0x32cd32)
            .setThumbnail(this.interaction.user.displayAvatarURL())
            .setImage(
                "https://media.discordapp.net/attachments/1090471775768428627/1099094479903928330/bpt24i98nsp41.jpg?width=554&height=543"
            )
            .setTimestamp()
            .addFields([
                {
                    name: "Hit",
                    value: "Hitting will get you a new card, be weary to not go over 21 or you lose!",
                    inline: true,
                },
                {
                    name: "Stay",
                    value: "If you stay, you will stick with the hand that you've got until all players have stayed.",
                    inline: true,
                },
            ]);

        return [embed];
    }

    private generateMessagePayload() {
        return {
            embeds: this.generateEmbeds(),
            components: [buttons],
        };
    }

    private initCollector() {
        if (!this.message) {
            throw new Error(
                "PlayerMenu error: Did not generate message correctly"
            );
        }

        const collector = this.message.createMessageComponentCollector({
            filter: (i) => i.user.id === this.interaction.user.id,
            componentType: ComponentType.Button,
            time: 1000 * 10,
        });

        collector.on("collect", (i) => {
            if (i.customId === "stay") {
                i.deferUpdate;
                return;
            }
            return;
        });

        collector.on("end", (collected) => {
            console.log(`Collected ${collected.size} interactions`);
        });
    }

    async render() {
        //Intitial Render
        if (!this.interaction.replied) {
            this.generateEmbeds();
            this.message = await this.interaction.reply({
                ...this.generateMessagePayload(),
                fetchReply: true,
            });
            return;
        }

        this.interaction.editReply(this.generateMessagePayload());
    }

    rerender() {}
}
