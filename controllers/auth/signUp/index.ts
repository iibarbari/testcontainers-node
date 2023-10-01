import User from "../../../models/user";
import bcrypt from "bcrypt";
import {IUserDocument, IUserSignUp} from "../../../@types/user";
import getUserByEmail from "../../../services/auth/getUserByEmail";
import createAuthToken from "../../../services/auth/createAuthToken";

export default async function signUp(user: IUserSignUp): Promise<IUserDocument> {
    try {
        // check if user exists
        const existingUser = await getUserByEmail(user.email, true);

        if (existingUser) {
            const error = new Error("User already exists")

            return Promise.reject(error);
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);

        // create user
        const newUser = new User({
            ...user,
            password: hashedPassword,
            token: createAuthToken({
                email: user.email,
                name: user.name,
            })
        });

        return await newUser.save();
    } catch (error) {
        return Promise.reject(error);
    }
}