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

const catHoldingCard = "https://media.discordapp.net/attachments/1090471775768428627/1099094479903928330/bpt24i98nsp41.jpg?width=554&height=543";
const catBeingCardDisposal = "https://media.discordapp.net/attachments/1090471775768428627/1099093963991961630/8IBKHtg0E484QKeXMPx4vyxD1czPK_ZzFtTQlMxm_c8.jpg?width=407&height=543";
/**
 * Wrapper for Player Menus
 */
export default class PlayerMenu {
    private message?: Message;
    private interaction: RepliableInteraction;
    private player: Player;
    private forceStay: boolean;

    /**
     * Creates a new PlayerMenu
     * @param interaction This is the interaction from the command to be able to reply
     * @param player This is a player object to be able to access stuff within player.
     */
    constructor(interaction: RepliableInteraction, player: Player) {
        this.interaction = interaction;
        this.player = player;
        this.forceStay = false;
    }

    /**
     * This will create embeds that will be displayed on the user side
     * @returns embeds for generateMessagePayload
     */
    private generateEmbeds() {
        //The intial embed
        const embed = new EmbedBuilder()
            .setTitle("Welcome to BlackJack bot")
            .setDescription(
                `Welcome ${
                    this.player.member.displayName
                } to your BlackJack game!\n
                 You will force stay <t:${Math.floor(Date.now() / 1000 + 10)}:R>
                `
            )
            .setColor(0x32cd32)
            .setThumbnail(this.interaction.user.displayAvatarURL())
            .setImage(
                catHoldingCard
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

        //If the player stays, we are going to remove the buttons and Give them a message to wait patiently
        if (this.player.stay) {
            embed
                .setFields([])
                .setImage(
                    catBeingCardDisposal
                )
                .setDescription(
                    `You have chosen to stay! \n\nWaiting for other players now! \n\nGood luck ${this.player.member.displayName}`
                );
        }

        if (this.forceStay) {
            embed
                .setFields([])
                .setDescription(
                    `You have been forced to stay with the hand you had because you took too long to choose. \n\nGood luck ${this.player.member.displayName}`
                )
                .setImage(
                    catBeingCardDisposal
                );
        }

        return [embed];
    }

    /**
     * This will create the message to display to the play
     * @param hideButtons This is to konw if we are hiding the buttons, only will happen if player stays
     * @returns The object to display with the reply.
     */
    private generateMessagePayload(hideButtons: boolean) {
        return {
            embeds: this.generateEmbeds(),
            components: hideButtons ? [] : [buttons],
            ephemeral: true,
        };
    }

    /**
     * This function will intiialize the collector and reply depending on the buttons pressed.
     */
    private initCollector() {
        if (!this.message) {
            throw new Error(
                "PlayerMenu error: initCollector was not able to properly initialize the message property. Variable 'message' is left undefined."
            );
        }

        //initializer ofcollector
        const collector = this.message.createMessageComponentCollector({
            filter: (i) => i.user.id === this.interaction.user.id,
            componentType: ComponentType.Button,
            time: 10_000,
        });

        //The responses once buttons are pressed
        collector.on("collect", (i) => {
            i.deferUpdate();

            if (i.customId === "stay") {
                this.player.stay = true;
                console.log(`Player ${this.player.member.displayName} has stayed`);
                this.render(true);
                return;
            } 
            
            console.log(`Player ${this.player.member.displayName} has hit`);

            this.render();
        });

        //At this point the timer has run out for the buttons
        collector.on("end", (collected) => {
            if (collector.endReason === "time") {
                this.player.stay = true;
                this.forceStay = true;
                this.render(true);
                console.log(`Player ${this.player.member.displayName} has taken too long to make a choice and was timed out.`);
            }
            console.log(`Collected ${collected.size} interactions`);
        });
    }

    /**
     * This function will do all the rendering of the messages
     * @param hideButtons Checks for hiding buttons, off by default since we start with all buttons available
     * @returns Once the interaction has not be replied to
     */
    async render(hideButtons: boolean = false) {
        //Intitial Render
        if (!this.interaction.replied) {
            this.generateEmbeds();
            this.message = await this.interaction.reply({
                ...this.generateMessagePayload(hideButtons),
                fetchReply: true,
            });
            this.initCollector();
            return;
        }

        this.interaction.editReply(this.generateMessagePayload(hideButtons));
    }
}
