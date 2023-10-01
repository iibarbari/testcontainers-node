import {IUserDocument, IUserSignUp} from "../../../@types/user";
import User from "../../../models/user";
import getUserById from "../getUserById";

export default async function createUser(user: IUserSignUp, ): Promise<IUserDocument> {
    try {
        const newUser = await new User(user).save();

        return await getUserById(newUser._id);
    } catch (error) {
        return Promise.reject(error);
    }
}