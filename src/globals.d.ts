import {
    ButtonInteraction,
    CacheType,
    ChatInputApplicationCommandData,
    ChatInputCommandInteraction,
    Guild,
    GuildMember,
    TextBasedChannel,
} from "discord.js";

/**
 * Interface for interactions received within a Guild.
 */
interface GuildInteraction {
    member: GuildMember,
    guild: Guild;
    guildId: string;
    channel: TextBasedChannel;
}

declare global {
    /**
     * Interaction types that originate from Guilds.
     */
    namespace GuildInteractions {
        type ChatInput = ChatInputCommandInteraction & GuildInteraction;
        type Button = ButtonInteraction & GuildInteraction;
    }
    /**
     * Interaction payloads for file-based handlers.
     * - Typically used in files exporting an interaction handler.
     */
    namespace InteractionHandlerPayloads {
        type GuildChatInputCommand = ChatInputApplicationCommandData & {
            execute: (
                interaction: GuildInteractions.ChatInput
            ) => Promise<any>;
        };
    }
}
