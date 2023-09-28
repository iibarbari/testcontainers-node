import {GenericContainer, StartedTestContainer} from "testcontainers";
import mongoose from "mongoose";

export async function closeDatabase(container: StartedTestContainer) {
    if (mongoose.connection.readyState === 1) {
        await mongoose.connection.dropDatabase()
        await mongoose.disconnect()
    }
    await container.stop();
}

export async function clearDatabase(container: StartedTestContainer) {
    const collections = mongoose.connection.collections

    for (const key in collections) {
        const collection = collections[key]
        await collection.deleteMany({})
    }
}

export function getUri(container: StartedTestContainer) {
    return `mongodb://${container.getHost()}:${container.getMappedPort(27017)}`
}

export async function createContainer() {
    return await new GenericContainer("mongo")
        .withExposedPorts(27017)
        .withEnvironment({
            PORT: "3000",
            MONGO_INITDB_ROOT_USERNAME: "",
            MONGO_INITDB_ROOT_PASSWORD: "",
            MONGO_URL: "",
            TOKEN_SECRET: ""
        })
        .start()
}