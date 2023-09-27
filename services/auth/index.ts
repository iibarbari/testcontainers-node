import User, {IUser, IUserDocument} from "../../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "../../config/env";

export async function createUser(user: IUser): Promise<Omit<IUser, "password"> & { token: string }> {
    try {
        // check if user exists
        const existingUser = await getUserByEmail(user.email);

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
        });

        const savedUser = await newUser.save();

        const {password: _, ...rest} = savedUser.toObject();

        const token = createUserToken(rest);

        return {
            ...rest,
            token,
        }
    } catch (error) {
        return Promise.reject(error);
    }
}

export function createUserToken(user: Omit<IUser, "password">): string {
    return jwt.sign({user}, env.tokenSecret, {expiresIn: "1h"});
}
export async function getUserByEmail(email: IUserDocument["email"]): Promise<IUserDocument | null> {
    try {
        return await User.findOne({email});
    } catch (error) {
        throw error;
    }
}
export async function login(anonUser: Omit<IUser, "name">): Promise<Omit<IUser, "password"> & { token: string }> {
    const {email, password} = anonUser;

    try {
        const user = await getUserByEmail(email);

        if (!user) {
            const error = new Error("User not found")

            return Promise.reject(error);
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            const error = new Error("Password is incorrect")

            return Promise.reject(error);
        }

        const {password: _, ...rest} = user.toObject();

        const token = createUserToken(rest);

        return {
            ...rest,
            token,
        }
    } catch (error) {
        return Promise.reject(error);
    }
}