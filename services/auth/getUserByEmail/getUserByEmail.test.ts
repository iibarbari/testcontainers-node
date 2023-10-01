import test from "node:test";
import {StartedTestContainer} from "testcontainers";
import {closeDatabase, createContainer, getUri} from "../../../config/test";
import mongoose from "mongoose";
import assert from "node:assert";
import {IMetaDocument, IMetaUser, IUser, IUserDocument, IUserSignUp} from "../../../@types/user";
import getUserByEmail from "./index";
import User from "../../../models/user";

test("getUserByEmail", async (context) => {
    let container: StartedTestContainer;
    let user: IUserDocument;

    context.before(async () => {
        try {
            container = await createContainer();

            const uri = getUri(container);

            await mongoose.connect(uri);

            // Create dummy user
            const dummyUser: IUserSignUp = {
                email: "test@test.com",
                name: "test",
                password: "test123",
            };

            user = await new User(dummyUser).save();
        } catch (e) {
            console.log(e);
        }
    });

    context.after(async () => {
        await closeDatabase(container);
    });

    await context.test("user can be found by email without password", async () => {
        const foundUser = await getUserByEmail(user.email);

        assert.strictEqual(foundUser.email, user.email);
        assert.strictEqual(foundUser.name, user.name);
        assert.strictEqual(foundUser.isEmailVerified, false);
        assert.strictEqual(foundUser.token, null);
        // @ts-ignore
        assert.strictEqual(foundUser?.password, undefined);
    })

    await context.test("user can be found by email with password", async () => {
        const foundUser = await getUserByEmail<"meta">(user.email, true);

        assert.strictEqual(foundUser.email, user.email);
        assert.strictEqual(foundUser.name, user.name);
        assert.strictEqual(foundUser.isEmailVerified, false);
        assert.strictEqual(foundUser.token, null);
        assert.strictEqual(typeof foundUser.password, "string");
    })

    await context.test("returns error if not found", async () => {
        const dummyUser: Pick<IUser, "email"> = {
            email: "nonexisting@mail.com",
        }

        await assert.rejects(async () => {
            await getUserByEmail(dummyUser.email);
        }, {
            message: "User not found"
        })
    })
})