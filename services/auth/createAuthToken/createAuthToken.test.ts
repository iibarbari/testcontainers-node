import test from "node:test";
import {StartedTestContainer} from "testcontainers";
import {closeDatabase, createContainer, getUri} from "../../../config/test";
import mongoose from "mongoose";
import assert from "node:assert";
import createAuthToken from "./index";

type TDetails = {
    email: string,
    name: string,
}

test("auth service can create auth token", async (context) => {
    let container: StartedTestContainer;
    let token: string;
    const details: TDetails = {
        email: "test@test.com",
        name: "test",
    }

    context.before(async () => {
        try {
            container = await createContainer();

            const uri = getUri(container);

            await mongoose.connect(uri);
        } catch (e) {
            console.log(e);
        }
    });

    context.after(async () => {
        await closeDatabase(container);
    });

    await context.test("auth token can be generated", async () => {
        token = createAuthToken(details)

        assert.notEqual(token, null);
        assert.strictEqual(typeof token, "string");
    });
})