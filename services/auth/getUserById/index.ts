import {IMetaDocument, IUserDocument} from "../../../@types/user";
import User from "../../../models/user";
import {Error} from "mongoose";

type GetUserByUserIdReturnType<T extends "meta" | "default"> = T extends "meta" ? IMetaDocument : IUserDocument;

export default async function getUserById<User extends "meta" | "default" = "default">(
    id: IUserDocument["_id"],
    returnPassword: boolean = false
): Promise<GetUserByUserIdReturnType<User>> {
    try {
        const user =  await
            User
                .findById(id)
                .select(returnPassword ? "+password" : "-password") as GetUserByUserIdReturnType<User>;

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