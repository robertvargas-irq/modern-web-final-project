import * as fs from "fs";
import * as path from "path";
import BotClient from "./BotClient.js";

function bindEvents(client: BotClient) {
    // init events
    const eventPath = path.join(__dirname, "../../events");
    const eventFiles = fs
        .readdirSync(eventPath)
        .filter((file) => file.endsWith(".js"));
    for (const file of eventFiles) {
        const { default: event } = require(`${eventPath}/${file}`);

        if (event.once)
            client.once(event.name, (...args) =>
                event.execute(...args, client)
            );
        else client.on(event.name, (...args) => event.execute(...args, client));
    }
}

export default bindEvents;