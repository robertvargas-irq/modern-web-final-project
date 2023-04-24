import {
    ButtonInteraction,
    CacheType,
    ChatInputApplicationCommandData,
    ChatInputCommandInteraction,
    Guild,
    GuildMember,
    GuildTextBasedChannel,
} from "discord.js";
import BotClient from "./util/BotClient/BotClient.ts";

/**
 * Interface for interactions received within a Guild.
 */
interface GuildInteraction {
    client: BotClient;
    member: GuildMember;
    guild: Guild;
    guildId: string;
    channel: GuildTextBasedChannel;
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
            execute: (interaction: GuildInteractions.ChatInput) => Promise<any>;
        };
    }
}
