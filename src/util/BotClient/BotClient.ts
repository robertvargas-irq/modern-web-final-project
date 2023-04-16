import { Client, Collection, ClientOptions } from "discord.js";

export default class BotClient extends Client {
    commands: Collection<
        keyof InteractionHandlerPayloads.GuildChatInputCommand["name"],
        InteractionHandlerPayloads.GuildChatInputCommand
    > = new Collection();

    constructor(clientOptions: ClientOptions) {
        super(clientOptions);
        
    }
}
