import User from "../../../models/user";
import {IUserDocument} from "../../../@types/user";

export default async function updateUser(id: IUserDocument["_id"], user: Partial<IUserDocument>): Promise<IUserDocument> {
    try {
        const updatedUser = await User.findByIdAndUpdate(id, user, {new: true});

        if (!updatedUser) {
            const error = new Error("User not found")

            return Promise.reject(error);
        }

        return updatedUser;
    } catch (error) {
        return Promise.reject(error);
    }
}
