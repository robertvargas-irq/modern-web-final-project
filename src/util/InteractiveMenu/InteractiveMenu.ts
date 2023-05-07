import {
    ActionRowBuilder,
    CollectedMessageInteraction,
    EmbedBuilder,
    InteractionCollector,
    Message,
    MessageActionRowComponentBuilder,
    RepliableInteraction,
} from "discord.js";

interface InteractiveMenuOptions {
    ephemeral: boolean;
}

export type InteractiveMenuOptionsPartial = Partial<InteractiveMenuOptions>;

export default abstract class InteractiveMenu {
    protected message?: Message;
    protected interaction: RepliableInteraction;
    protected options: InteractiveMenuOptions;
    private collectors: InteractionCollector<CollectedMessageInteraction>[];

    /**
     * Creates a new PlayerMenu
     * @param interaction This is the interaction from the command to be able to reply
     */
    constructor(
        interaction: RepliableInteraction,
        menuOptions: InteractiveMenuOptionsPartial
    ) {
        this.interaction = interaction;
        this.options = {
            ephemeral: menuOptions.ephemeral ?? false,
        };
        this.collectors = [];
    }

    /**
     * This will create embeds that will be displayed on the user side
     * @returns embeds for generateMessagePayload
     */
    protected abstract generateEmbeds(): EmbedBuilder[];

    /**
     * This will create components that will be displayed on the embed for the user
     * @returns components for generateMessagePayload
     */
    protected abstract generateComponents(): ActionRowBuilder<MessageActionRowComponentBuilder>[];

    /**
     * This will create the message to display to the play
     * @returns The object to display with the reply.
     */
    protected generateMessagePayload() {
        return {
            embeds: this.generateEmbeds(),
            components: this.generateComponents(),
            ephemeral: this.options.ephemeral,
        };
    }

    /**
     * This function will intiialize the collector and reply depending on the buttons pressed.
     */
    protected abstract initCollectors(): void;

    /**
     * Register a message component collector.
     * @param collector The collector to register.
     */
    protected registerCollector<T extends CollectedMessageInteraction>(
        collector: InteractionCollector<T>
    ) {
        // workaround for multi-type
        this.collectors.push(
            collector as unknown as InteractionCollector<CollectedMessageInteraction>
        );
        return collector;
    }

    /**
     * Terminate the menu, ending all collectors.
     * @param reason Termination reason.
     */
    public terminate(reason: string = "No reason given.") {
        for (const collector of this.collectors) {
            if (collector.ended) continue;
            collector.stop(reason);
        }
    }

    /**
     * This function will do all the rendering of the messages
     * @returns Once the interaction has not be replied to
     */
    async render() {
        // initial Render
        if (!this.interaction.replied) {
            this.message = await this.interaction.reply({
                ...this.generateMessagePayload(),
                fetchReply: true,
            });
            this.initCollectors();
            return;
        }

        // subsequent re-renders
        this.interaction.editReply(this.generateMessagePayload());
    }
}
