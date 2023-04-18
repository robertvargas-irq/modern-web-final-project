import { Collection } from "discord.js";
import * as fs from "fs";
import BotClient from "./BotClient.js";

const CommandPath = "./commands";
const CommandPathRel = "../../commands";

async function bindCommands(client: BotClient) {
    // populate command files with all available commands
    client.commands = new Collection();
    const commandFiles: (string | string[])[] = fs
        .readdirSync(CommandPath)
        .filter((file) => file.endsWith(".js"));

    // check for nested commands, and populate commandFiles with them
    const commandSubDirectories = fs
        .readdirSync(CommandPath)
        .filter((subdir) =>
            fs.statSync(`${CommandPath}/${subdir}`).isDirectory()
        );
    for (let dir of commandSubDirectories) {
        let files = fs
            .readdirSync(`${CommandPath}/${dir}`)
            .filter((file) => file.endsWith(".js"));
        for (let file of files) commandFiles.push([dir, file]);
    }

    // register each command to the client
    for (let file of commandFiles) {
        let command;
        if (Array.isArray(file))
            command = (
                await (import(
                    `${CommandPathRel}/${file[0]}/${file[1]}`
                ) as Promise<{
                    default: InteractionHandlerPayloads.GuildChatInputCommand;
                }>)
            ).default;
        else
            command = (
                await (import(`${CommandPathRel}/${file}`) as Promise<{
                    default: InteractionHandlerPayloads.GuildChatInputCommand;
                }>)
            ).default;
        console.log({ command });

        // push command to commands collection; Discord.js is not recognizing string
        client.commands.set(command.name as unknown as number, command);
    }
}

export default bindCommands;
