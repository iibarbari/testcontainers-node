import mongoose, {Types} from "mongoose";

export interface IBook {
    name: string;
}

export interface IBookDocument extends IBook, mongoose.Document {}

const schema = new mongoose.Schema<IBook>({
    name: String,
}, {
    timestamps: true
});


const Book = mongoose.model<IBook>('Book', schema);

export default Book;