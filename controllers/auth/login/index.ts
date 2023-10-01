import bcrypt from "bcrypt";
import {IUser, IUserLogin} from "../../../@types/user";
import getUserByEmail from "../../../services/auth/getUserByEmail";
import updateUser from "../../../services/auth/updateUser";
import createAuthToken from "../../../services/auth/createAuthToken";

export default async function login(anonUser: IUserLogin): Promise<IUser> {
    const {email, password} = anonUser;

    try {
        const user = await getUserByEmail<"meta">(email, true)

        if (!user) {
            const error = new Error("User not found")

            return Promise.reject(error);
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            const error = new Error("Password is incorrect")

            return Promise.reject(error);
        }

        return await updateUser(user._id, {
            token: createAuthToken({
                email: user.email,
                name: user.name,
            })
        });
    } catch (error) {
        return Promise.reject(error);
    }
}