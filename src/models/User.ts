import {Schema, model, Document} from "mongoose";

export type Role = "user" | "admin";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  role: Role;
}

const userSchema = new Schema<IUser>(
    {
        username: {type: String, required: true, unique: true, trim: true},
        email: {type: String, required: true, unique: true, trim: true, lowercase: true},
        name: { type: String, required: true, trim: true },
        password: { type: String, required: true},
        role: { type: String, enum: ["user", "admin"], default: "user" },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    }, 
    {timestamps: true}
);

export const UserModel = model<IUser>("User", userSchema);