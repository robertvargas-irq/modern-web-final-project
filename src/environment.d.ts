declare global {
    namespace NodeJS {
        interface ProcessEnv {
            /**
             * Atlas database user username.
             */
            ATLAS_USER: string;
            /**
             * Atlas database user password.
             */
            ATLAS_TOKEN: string;
            /**
             * Discord bot login token.
             */
            DISCORD_TOKEN: string;
            /**
             * Comma-separated guild ids for
             * commands to be registered to.
             * @example "100031,100032,100033"
             */
            GUILDS: string;
        }
    }
}

export {};
