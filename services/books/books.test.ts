import mongoose from "mongoose";
import test from "node:test";
import {StartedTestContainer} from "testcontainers";
import {closeDatabase, createContainer, getUri} from "../../config/test";
import assert from "node:assert";
import {createBook, deleteBook, getBooks, updateBook} from "./index";
import {IBook, IBookDocument} from "../../models/book";

test("book service", async (context) => {
    let container: StartedTestContainer;
    let testBook: IBookDocument;

    context.before(async () => {
        try {
            container = await createContainer();

            const uri = getUri(container);

            await mongoose.connect(uri);
        } catch (e) {
            console.log(e);
        }
    });

    context.after(async () => {
        await closeDatabase(container);
    });

    await context.test("books should be empty", async () => {
        const res = await getBooks()

        assert.strictEqual(res.length, 0);
    });

    await context.test("new book can be added", async () => {
        const book: IBook = {
            name: "The Lord of the Rings",
        }

        testBook = await createBook(book);

        const books = await getBooks()

        assert.strictEqual(books.length, 1);
        assert.strictEqual(books[0].name, testBook.name);
    });

    await context.test("book can be updated", async () => {
        const updatedBook: Partial<IBook> = {
            name: "The Lord of the Rings: The Fellowship of the Ring",
        }

        await updateBook(testBook._id, updatedBook);

        const books = await getBooks()

        assert.strictEqual(books.length, 1);
        assert.strictEqual(books[0].name, updatedBook.name);
    })

    await context.test("book can be deleted", async () => {
        await deleteBook(testBook._id)

        const books = await getBooks()

        assert.strictEqual(books.length, 0);
    });
})