import mongoose, {Model} from "mongoose";
import {IMetaDocument, IMetaUser} from "../@types/user";
import {MongoError} from "mongodb";

const schema = new mongoose.Schema<IMetaUser, Model<IMetaDocument>>({
    name: {
        type: String,
        required: [true, "Name is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        select: false,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        validate: {
            validator: function (email: string) {
                const emailRegex = /\S+@\S+\.\S+/;

                return emailRegex.test(email);
            }
        }
    },
    token: {
        type: String || null,
        default: null,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true
});
schema.post("save", function (error: any, doc: IMetaDocument, next: Function) {
    if (error instanceof MongoError && error.code === 11000) {
        next(new Error("Email already exists"));
    }

    next(error);
})

const User = mongoose.model<IMetaUser, Model<IMetaDocument>>('User', schema);

export default User;