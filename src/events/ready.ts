import registerClientCommands from "../config/commands_register.js";
import BotClient from "../util/BotClient/BotClient.js";
import { ActivityType } from "discord.js";

export default {
    name: "ready",
    once: "true",
    execute(client: BotClient) {
        registerClientCommands(client)
            .then(console.log)
            .catch((e) => {
                console.error("Unable to parse client commands.", e);
            });

        client.user.setPresence({
            activities: [
                {
                    name: "v1.0 | Hi!",
                    type: ActivityType.Listening,
                },
            ],
            status: "online",
        });
    },
};
