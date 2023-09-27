import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import env from "../config/env";

export default async function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401)

    try {
        req.body.user = jwt.verify(token, env.tokenSecret)

        next();
    } catch (error) {
        return res.sendStatus(403)
    }
}