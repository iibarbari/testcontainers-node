import mongoose from "mongoose";

export interface IMetaUser {
    name: string;
    password: string;
    email: string;
    token: string | null;
    isEmailVerified?: boolean;
}
export interface IUser extends Omit<IMetaUser, "password"> {}

export interface IUserLogin extends Pick<IMetaUser, "email" | "password"> {}
export interface IUserSignUp extends Pick<IMetaUser, "email" | "name" | "password"> {}

export interface IMetaDocument extends IMetaUser, mongoose.Document {

}
export interface IUserDocument extends IUser, mongoose.Document {

}