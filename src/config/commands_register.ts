import { Routes, REST } from "discord.js";
import BotClient from "../util/BotClient/BotClient.js";

/**
 * Registers all slash commands from the client.
 */
async function registerClientCommands(client: BotClient) {
    const commands = client.commands.map(({ execute, ...data }) => data);
    const Rest = new REST({ version: "10" }).setToken(
        process.env.DISCORD_TOKEN
    );
    const queue = [];

    // ensure guilds are defined
    const guilds = process.env.GUILDS.split(",");
    if (!guilds.length)
        throw new Error(
            "ENV DOES NOT HAVE TOKEN [GUILDS] DEFINED." +
                "\nEnsure that the field is defined and contains all guild ids as a comma-separated string."
        );

    // register commands
    console.log("🧩 Reloading all application commands...");
    for (let g of guilds) {
        console.log(`🔄️ Reloading Guild ID: [${g}]`);
        queue.push(client.guilds.cache.get(g)?.commands.set(commands));
        queue.push(
            Rest.put(Routes.applicationGuildCommands(client.user.id, g), {
                body: commands,
            })
        );
    }

    // ensure all items in queue complete
    await Promise.all(queue);
    return Promise.resolve(
        "✅ Successfully reloaded all application commands."
    );
}

export default registerClientCommands;
