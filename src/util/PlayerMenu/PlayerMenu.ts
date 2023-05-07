import {
    ComponentType,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    RepliableInteraction,
} from "discord.js";

import { Player } from "../Player/Player.js";
import InteractiveMenu from "../InteractiveMenu/InteractiveMenu.js";

const catHoldingCard =
    "https://media.discordapp.net/attachments/1090471775768428627/1099094479903928330/bpt24i98nsp41.jpg?width=554&height=543";
const catBeingCardDisposal =
    "https://media.discordapp.net/attachments/1090471775768428627/1099093963991961630/8IBKHtg0E484QKeXMPx4vyxD1czPK_ZzFtTQlMxm_c8.jpg?width=407&height=543";

/**
 * Wrapper for Player Menus
 */
export default class PlayerMenu extends InteractiveMenu {
    private player: Player;
    private collectionTime: number;

    /**
     * Creates a new PlayerMenu
     * @param interaction This is the interaction from the command to be able to reply
     * @param player This is a player object to be able to access stuff within player.
     */
    constructor(
        interaction: RepliableInteraction,
        player: Player,
        collectionTime: number
    ) {
        super(interaction, {
            ephemeral: true,
        });
        this.player = player;
        this.collectionTime = collectionTime;
    }

    /**
     * This will create embeds that will be displayed on the user side
     * @returns embeds for generateMessagePayload
     */
    protected generateEmbeds() {
        //The intial embed
        const embed = new EmbedBuilder()
            .setTitle("Welcome to BlackJack bot")
            .setDescription(
                `Welcome ${
                    this.player.member.displayName
                } to your BlackJack game!\n
                 You will force stay <t:${Math.floor(
                     Date.now() / 1000 + 10
                 )}:R>`
            )
            .setColor(0x32cd32)
            .setThumbnail(this.interaction.user.displayAvatarURL())
            .setImage(catHoldingCard)
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

        switch (this.player.state) {
            // if the player stays, we are going to remove the buttons and give them a message to wait patiently.
            case "stay":
                embed
                    .setFields([])
                    .setImage(catBeingCardDisposal)
                    .setDescription(
                        `You have chosen to stay! \n\nWaiting for other players now! \n\nGood luck ${this.player.member.displayName}`
                    );
                break;
            // inform the player if they were forced to stay
            case "force-stay":
                embed
                    .setFields([])
                    .setDescription(
                        `You have been forced to stay with the hand you had because you took too long to choose. \n\nGood luck ${this.player.member.displayName}`
                    )
                    .setImage(catBeingCardDisposal);
                break;
        }

        return [embed];
    }

    /**
     * Creates the components for the embed
     * @returns A row of components for the embed
     */
    protected generateComponents() {
        /**
         * Buttons constant just creates the current buttons for hit and stay.
         */
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

        if (this.player.staying) {
            buttons.setComponents(
                new ButtonBuilder()
                    .setCustomId("stay")
                    .setLabel("Stay")
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId("hit")
                    .setLabel("Hit")
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(true)
            );
        }

        return [buttons];
    }

    /**
     * This function will intiialize the collector and reply depending on the buttons pressed.
     */
    protected initCollectors() {
        if (!this.message) {
            throw new Error(
                "PlayerMenu error: initCollector was not able to properly initialize the message property. Variable 'message' is left undefined."
            );
        }

        // initialize button collector
        const collector = this.registerCollector(
            this.message.createMessageComponentCollector<ComponentType.Button>({
                filter: (i) => i.user.id === this.interaction.user.id,
                time: this.collectionTime,
            })
        );

        // handle button presses for hit and stay
        collector.on("collect", (i) => {
            i.deferUpdate();

            // route to proper action
            switch (i.customId) {
                case "stay": {
                    // request the game manager to have the player stay
                    this.player.request("stay");
                    console.log(
                        `Player ${this.player.member.displayName} has stayed`
                    );
                    break;
                }
                case "hit": {
                    // request the game manager to deal a card
                    this.player.request("hit");
                    console.log(
                        `Player ${this.player.member.displayName} has hit`
                    );
                    break;
                }
            }

            // re-render the menu
            this.render();
        });

        // handle collector end
        collector.on("end", (collected) => {
            // if time has run out and the player is not staying, re-render the menu
            if (!this.player.staying && collector.endReason === "time") {
                this.render();
                console.log(
                    `Player ${this.player.member.displayName} has taken too long to make a choice and was timed out.`
                );
            }
            console.log(`Collected ${collected.size} interactions`);
        });
    }
}
