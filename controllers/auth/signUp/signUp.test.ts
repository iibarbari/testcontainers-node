import test from "node:test";
import {StartedTestContainer} from "testcontainers";
import {closeDatabase, createContainer, getUri} from "../../../config/test";
import mongoose from "mongoose";
import assert from "node:assert";
import {IUserDocument, IUserSignUp} from "../../../@types/user";
import createUser from "../../../services/auth/createUser";

test("auth controller", async (context) => {
    let container: StartedTestContainer;
    let testUser: IUserDocument;

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

    await context.test("user can sign up", async () => {
        const user: IUserSignUp = {
            email: "ilknur@me.me",
            name: "ilknur",
            password: "123456",
        };

        testUser = await createUser(user);

        assert.strictEqual(testUser.email, user.email);
        assert.strictEqual(testUser.name, user.name);
        assert.strictEqual(testUser.isEmailVerified, false);
        assert.notEqual(testUser.token, null);
    });

    await context.test("user cannot signup with the same email", async () => {
        const user: IUserSignUp = {
            email: "ilknur@me.me",
            name: "ilknur",
            password: "123456",
        };

        await assert.rejects(async () => {
            await createUser(user);
        }, {
            message: "User already exists"
        });
    });
})