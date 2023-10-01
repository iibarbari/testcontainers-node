import test from "node:test";
import {StartedTestContainer} from "testcontainers";
import {closeDatabase, createContainer, getUri} from "../../../config/test";
import mongoose from "mongoose";
import {IMetaDocument, IMetaUser, IUserSignUp} from "../../../@types/user";
import User from "../../../models/user";
import assert from "node:assert";
import bcrypt from "bcrypt";
import updateUser from "./index";

test("getUserByEmail", async (context) => {
    let container: StartedTestContainer;
    let user: IMetaDocument;

    context.before(async () => {
        try {
            container = await createContainer();

            const uri = getUri(container);

            await mongoose.connect(uri);

            // Create dummy user
            const dummyUser: IUserSignUp = {
                email: "test@test.test",
                name: "test",
                password: "test123",
            };

            const addedUser = await new User(dummyUser).save();

            user = await User.findById(addedUser._id).select("+password");
        } catch (e) {
            console.log(e);
        }
    });

    context.after(async () => {
        await closeDatabase(container);
    });

    await context.test("user can be updated", async () => {
        const updatedUserDetails: Partial<IMetaUser> = {
            name: "test2",
        }

        const updatedUser = await updateUser(user._id, updatedUserDetails)

        assert.notEqual(updatedUser.name, user.name);
        assert.strictEqual(updatedUser.name, updatedUserDetails.name);
    })

    await context.test("user password can be updated", async () => {
        const updatedUserDetails: Partial<IMetaUser> = {
            password: "test2",
        }

        const updatedUser = await updateUser(user._id, updatedUserDetails)

        // @ts-ignore
        assert.strictEqual(updatedUser?.password, undefined);

        const foundUser: IMetaDocument = await User.findById(user._id).select("+password");

        const match = await  bcrypt.compare(user.password, foundUser.password);

        assert.notEqual(match, true);
    })

    await context.test("returns error if not found", async () => {
        await assert.rejects(async () => {
            await updateUser(new mongoose.Types.ObjectId(), {
                name: "test"
            })

        }, {
            message: "User not found"
        })
    })
})