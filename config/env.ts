import dotenv from "dotenv";

type Env = {
    port: number;
    mongoUrl: string;
}

dotenv.config();

if (!process.env.PORT) {
    console.log('❌ PORT must be defined!');
    process.exit(1);
}

if (!process.env.MONGO_URL) {
    console.log('❌ MONGO_URL must be defined!');
    process.exit(1);
}

const config: Env = {
    port: Number(process.env.PORT),
    mongoUrl: process.env.MONGO_URL,
}

export default config;