import {
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
    Message,
    RepliableInteraction,
} from "discord.js";

export default abstract class InteractiveMenu {
    protected message?: Message;
    protected interaction: RepliableInteraction;
    protected hideEmbed: boolean;

    /**
     * Creates a new PlayerMenu
     * @param interaction This is the interaction from the command to be able to reply
     */
    constructor(interaction: RepliableInteraction) {
        this.interaction = interaction;
        this.hideEmbed = false;
    }

    /**
     * This will create embeds that will be displayed on the user side
     * @returns embeds for generateMessagePayload
     */
    protected abstract generateEmbeds(): EmbedBuilder[];

    /**
     * This will create the message to display to the play
     * @returns The object to display with the reply.
     */
    protected generateMessagePayload() {
        return {
            embeds: this.generateEmbeds(),
            components: this.generateComponents(),
            ephemeral: this.hideEmbed,
        };
    }

    /**
     * This function will intiialize the collector and reply depending on the buttons pressed.
     */
    protected abstract initCollector(): void;

    /**
     * This will create components that will be displayed on the embed for the user
     * @returns components for generateMessagePayload
     */
    protected abstract generateComponents(): ActionRowBuilder<ButtonBuilder>[];

    /**
     * This function will do all the rendering of the messages
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
