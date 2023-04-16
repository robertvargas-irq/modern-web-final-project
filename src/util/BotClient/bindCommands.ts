import { Collection } from "discord.js";
import * as fs from "fs";
import * as path from "path";
import BotClient from "./BotClient.js";

function bindCommands(client: BotClient) {
    // populate command files with all available commands
    const commandsPath = path.join(__dirname, "../../commands");
    client.commands = new Collection();
    const commandFiles: (string | string[])[] = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith(".js"));

    // check for nested commands, and populate commandFiles with them
    const commandSubDirectories = fs
        .readdirSync(commandsPath)
        .filter((subdir) =>
            fs.statSync(`${commandsPath}/${subdir}`).isDirectory()
        );
    for (let dir of commandSubDirectories) {
        let files = fs
            .readdirSync(`${commandsPath}/${dir}`)
            .filter((file) => file.endsWith(".js"));
        for (let file of files) commandFiles.push([dir, file]);
    }

    // register each command to the client
    for (let file of commandFiles) {
        let command;
        if (Array.isArray(file))
            command = require(`../../commands/${file[0]}/${file[1]}`).default;
        else command = require(`../../commands/${file}`).default;

        // push command to commands collection
        client.commands.set(command.name, command);
    }
}

export default bindCommands;
