import "dotenv/config";
import db_connect from "./config/db_connect.js";
import BotClient from "./util/BotClient/BotClient.js";
import { GatewayIntentBits as GIB, Partials } from "discord.js";

// connect to the database
await db_connect();

// create client and login
const client = new BotClient({
    intents: [GIB.Guilds, GIB.GuildMembers, GIB.GuildMessages],
    partials: [Partials.Channel]
});
await client.login(process.env.DISCORD_TOKEN);