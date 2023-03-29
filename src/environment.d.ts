declare global {
    namespace NodeJS {
        interface ProcessEnv {
            ATLAS_TOKEN: string;
            ATLAS_USER: string;
            DISCORD_TOKEN: string;
        }
    }
}

export {};
