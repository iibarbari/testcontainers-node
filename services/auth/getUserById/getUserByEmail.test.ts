import test from "node:test";
import {StartedTestContainer} from "testcontainers";
import {closeDatabase, createContainer, getUri} from "../../../config/test";
import mongoose from "mongoose";
import assert from "node:assert";
import {IUserDocument, IUserSignUp} from "../../../@types/user";
import getUserById from "./index";
import User from "../../../models/user";

test("getUserById", async (context) => {
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

    await context.test("user can be found by id without password", async () => {
        const foundUser = await getUserById(user._id);

        assert.strictEqual(foundUser._id, user._id);
        assert.strictEqual(foundUser.email, user.email);
        assert.strictEqual(foundUser.token, null);
        // @ts-ignore
        assert.strictEqual(foundUser?.password, undefined);
    })

    await context.test("user can be found by id with password", async () => {
        const foundUser = await getUserById<"meta">(user._id, true);

        assert.strictEqual(foundUser._id, user._id);
        assert.strictEqual(foundUser.email, user.email);
        assert.strictEqual(foundUser.token, null);
        assert.strictEqual(foundUser.token, null);
        assert.strictEqual(typeof foundUser.password, "string");
    })

    await context.test("returns error if not found", async () => {
        const dummyUser: Pick<IUserDocument, "_id"> = {
            _id: new mongoose.Types.ObjectId(),
        }

        await assert.rejects(async () => {
            await getUserById(dummyUser._id);
        }, {
            message: "User not found"
        })
    })
})