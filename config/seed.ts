import Book, {IBook} from "../models/book";

export default async function seed() {
    const books: IBook[] = [
        {
            name: "The Lean Startup",
        },
        {
            name: "Lord of the Rings",
        }
    ]

    const res = await Book.insertMany(books);

    console.log('🚀 Seeded database with ' + res.length + ' books', res);
}