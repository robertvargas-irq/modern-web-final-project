import * as fs from "fs";
import BotClient from "./BotClient.js";

const EventPath = "./events";
const EventPathRel = "../../events";

async function bindEvents(client: BotClient) {
    // init events
    const eventFiles = fs
        .readdirSync(EventPath)
        .filter((file) => file.endsWith(".js"));
    for (const file of eventFiles) {
        const { default: event } = await import(`${EventPathRel}/${file}`);

        if (event.once)
            client.once(event.name, (...args) =>
                event.execute(...args, client)
            );
        else client.on(event.name, (...args) => event.execute(...args, client));
    }
}

export default bindEvents;