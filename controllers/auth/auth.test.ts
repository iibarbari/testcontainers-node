import test from "node:test";
import {closeDatabase, createContainer, getUri} from "../../config/test";
import mongoose from "mongoose";
import {StartedTestContainer} from "testcontainers";
import {IUserDocument, IUserLogin, IUserSignUp} from "../../models/user";
import {createUser, login} from "./index";
import assert from "node:assert";

test("auth service", async (context) => {
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

    await context.test("user can login", async () => {
        const user: IUserLogin = {
            email: "ilknur@me.me",
            password: "123456",
        };

        const res = await login(user);

        assert.strictEqual(res.email, testUser.email);
        assert.strictEqual(res.name, testUser.name);
        assert.strictEqual(res.isEmailVerified, false);
        assert.notEqual(res.token, null);
        // @ts-ignore
        assert.strictEqual(res?.password, undefined)
    });


    await context.test("user cannot login with wrong password", async () => {
        const user: IUserLogin = {
            email: "ilknur@me.me",
            password: "wrongpassword"
        };

        await assert.rejects(async () => {
            await login(user);
        }, {
            message: "Password is incorrect"
        })
    });

    await context.test("user cannot login with unregistered email", async () => {
        const user: IUserLogin = {
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