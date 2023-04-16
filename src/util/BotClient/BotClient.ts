import { Client, Collection, ClientOptions, ClientUser } from "discord.js";
import bindEvents from "./bindEvents.js";
import bindCommands from "./bindCommands.js";

export default class BotClient extends Client {
    commands: Collection<
        keyof InteractionHandlerPayloads.GuildChatInputCommand["name"],
        InteractionHandlerPayloads.GuildChatInputCommand
    > = new Collection();
    declare user: ClientUser;

    constructor(clientOptions: ClientOptions) {
        super(clientOptions);
        bindCommands(this);
        bindEvents(this);
    }
}
