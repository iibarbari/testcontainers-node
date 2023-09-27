import Book, {IBook, IBookDocument} from "../../models/book";

export async function getBooks(): Promise<Array<IBookDocument>> {
    try {
        return await Book.find();
    } catch (error) {
        throw error;
    }
}

export async function getBookById(id: string): Promise<IBookDocument | null> {
    try {
        return await Book.findById(id);
    } catch (error) {
        throw error;
    }
}

export async function createBook(book: IBook): Promise<IBookDocument> {
    try {
        const newBook = new Book(book);

        return await newBook.save();
    } catch (error) {
        throw error;
    }
}

export async function updateBook(id: IBookDocument["_id"], book: Partial<IBook>): Promise<IBookDocument | null> {
    try {
        return await Book.findByIdAndUpdate(id, book);
    } catch (error) {
        throw error;
    }
}

export async function deleteBook(id: IBookDocument["_id"]): Promise<IBookDocument | null> {
    try {
        return await Book.findByIdAndRemove(id);
    } catch (error) {
        throw error;
    }
}