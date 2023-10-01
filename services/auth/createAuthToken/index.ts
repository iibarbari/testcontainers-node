import jwt from "jsonwebtoken";
import env from "../../../config/env";

export default function createAuthToken<T extends string | Buffer | object>(details: T): string {
    return jwt.sign(details, env.tokenSecret, {expiresIn: "1h"});
}
