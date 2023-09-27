import test from "node:test";
import {closeDatabase, createContainer, getUri} from "../../config/test";
import mongoose from "mongoose";
import {StartedTestContainer} from "testcontainers";
import {IUser, IUserDocument} from "../../models/user";
import {createUser, login} from "./index";
import assert from "node:assert";
import bcrypt from "bcrypt";

test("auth service", async (context) => {
    let container: StartedTestContainer;
    let testUser: Omit<IUser, "password"> & { token: string };

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
        const user: IUser = {
            email: "ilknur@me.me",
            name: "ilknur",
            password: "123456",
        };

        testUser = await createUser(user);

        assert.strictEqual(testUser.email, user.email);
        assert.strictEqual(testUser.name, user.name);
        assert.strictEqual(testUser.token.length > 0, true);
    });

    await context.test("user cannot signup with the same email", async () => {
        const user: IUser = {
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

    await context.test("user can login", async () => {
        const user: Omit<IUser, "name"> = {
            email: "ilknur@me.me",
            password: "123456",
        };

        const res = await login(user);

        assert.strictEqual(res.email, testUser.email);
        assert.strictEqual(res.name, testUser.name);
    });


    await context.test("user cannot login with wrong password", async () => {
        const user: Omit<IUser, "name"> = {
            email: "ilknur@me.me",
            password: "wrongpassword"
        };

        await assert.rejects(async () => {
            await login(user);
        }, {
            message: "Wrong password"
        })
    });

    await context.test("user cannot login with unregistered email", async () => {
        const user: Omit<IUser, "name"> = {
            email: "ilknur@not.me",
            password: "123456"
        };

        await assert.rejects(async () => {
            await login(user);
        }, {
            message: "User not found"
        })
    });
})