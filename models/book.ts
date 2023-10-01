import mongoose, {Model} from "mongoose";

export interface IBook {
    name: string;
}

export interface IBookDocument extends IBook, mongoose.Document {}

const schema = new mongoose.Schema<IBook, Model<IBook>>({
    name: {type: String, required: true},
}, {
    timestamps: true
});

// export type TBook = mongoose.InferSchemaType<typeof schema>;

const Book = mongoose.model<IBook, Model<IBook>>('Book', schema);

export default Book;