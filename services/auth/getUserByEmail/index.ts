import {IMetaDocument, IUserDocument} from "../../../@types/user";
import User from "../../../models/user";
import {Error} from "mongoose";

type GetUserByEmailReturnType<T extends "meta" | "default"> = T extends "meta" ? IMetaDocument : IUserDocument;

export default async function getUserByEmail<User extends "meta" | "default" = "default">(
    email: IUserDocument["email"],
    returnPassword: boolean = false
): Promise<GetUserByEmailReturnType<User>> {
    try {
        const user =  await
            User
                .findOne({email})
                .select(returnPassword ? "+password" : "-password") as GetUserByEmailReturnType<User>;

        if (!user) {
            const error = new Error("User not found");

            return Promise.reject(error);
        }

        return user;
    } catch (error) {
        if (error instanceof Error) {
            return Promise.reject(error.message);
        }

        return Promise.reject(error);
    }
}