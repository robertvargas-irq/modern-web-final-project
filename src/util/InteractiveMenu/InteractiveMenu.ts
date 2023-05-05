import {
    ActionRowBuilder,
    ButtonBuilder,
    ComponentType,
    EmbedBuilder,
    Message,
    RepliableInteraction,
} from "discord.js";
import { Player } from "../Player/Player.js";

export default abstract class InteractiveMenu {
    protected message?: Message;
    protected interaction: RepliableInteraction;

    /**
     * Creates a new PlayerMenu
     * @param interaction This is the interaction from the command to be able to reply
     * @param player This is a player object to be able to access stuff within player.
     */
    constructor(interaction: RepliableInteraction) {
        this.interaction = interaction;
    }

    /**
     * This will create embeds that will be displayed on the user side
     * @returns embeds for generateMessagePayload
     */
    protected abstract generateEmbeds(): [EmbedBuilder];

    /**
     * This will create the message to display to the play
     * @param hideButtons This is to konw if we are hiding the buttons, only will happen if player stays
     * @returns The object to display with the reply.
     */
    protected abstract generateMessagePayload(): {};

    /**
     * This function will intiialize the collector and reply depending on the buttons pressed.
     */
    protected abstract initCollector(): void;

    /**
     * This will create components that will be displayed on the embed for the user
     * @returns components for generateMessagePayload
     */
    protected abstract generateComponents(): [ActionRowBuilder<ButtonBuilder>];

    /**
     * This function will do all the rendering of the messages
     * @param hideButtons Checks for hiding buttons, off by default since we start with all buttons available
     * @returns Once the interaction has not be replied to
     */
    async render() {
        //Intitial Render
        if (!this.interaction.replied) {
            this.generateEmbeds();
            this.message = await this.interaction.reply({
                ...this.generateMessagePayload(),
                fetchReply: true,
            });
            this.initCollector();
            return;
        }

        this.interaction.editReply(this.generateMessagePayload());
    }
}
