import express, {Request} from "express";
import {IUser, IUserDocument} from "../models/user";
import {createUser, login} from "../services/auth";

const router = express.Router();

router.get("/login", async (req: Request<any, any, Omit<IUser, "name">>, res) => {
    const anonUser = req.body;

    try {
        const user = await login(anonUser);

        res.json(user);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({message: error.message});

            return;
        }

        res.status(500).json("Something went wrong");
    }
});

router.post("/sign-up", async (req: Request<any, any, IUser>, res) => {
    const newUser = req.body;

    try {
        const user = await createUser(newUser);

        res.json(user);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.post("/log-out", (req, res) => {

});


export default router;