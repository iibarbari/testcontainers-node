import express from "express";
import {getBookById, getBooks} from "../services/books";

const router = express.Router();

router.get("/", async (_, res) => {
    try {
        const books = await getBooks();

        res.json(books);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get("/:id", async (req, res) => {
    const {id} = req.params;

    try {
        const book = await getBookById(id);

        res.json(book);
    } catch (error) {
        res.status(500).json(error);
    }
})

export default router;