import { Schema, model, Document, Types } from "mongoose";

export interface IPost extends Document {
  title: string;
  content: string;
  image: string; // Cloudinary / S3 URL
  isPublic: boolean;
  allowedUsers: Types.ObjectId[]; // Optimal permission control
  author: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    isPublic: { type: Boolean, default: false },
    allowedUsers: [{ type: Schema.Types.ObjectId, ref: "User", index: true }],
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// Compound index for fast access queries
postSchema.index({ isPublic: 1, allowedUsers: 1 });

export const PostModel = model<IPost>("Post", postSchema);