import mongoose, {Model} from "mongoose";

export interface IUser {
    name: string;
    password: string;
    email: string;
}

export interface IUserDocument extends IUser, mongoose.Document {}

const schema = new mongoose.Schema<IUser, Model<IUserDocument>>({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
}, {
    timestamps: true
});

const User = mongoose.model<IUser, Model<IUserDocument>>('User', schema);

export default User;