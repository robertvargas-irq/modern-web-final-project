import { InteractionType } from "discord.js";
import command from "./interactions/command.js";

export default {
    name: "interactionCreate",
    async execute(interaction: GuildInteractions.ChatInput) {
        // route interactions
        try {
            switch (interaction.type) {
                case InteractionType.ApplicationCommand:
                    return command(interaction);
            }
        } catch (e) {
            console.error(e);
        }
    },
};
