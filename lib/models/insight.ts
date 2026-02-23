import mongoose, { Schema, Document } from "mongoose";

export interface IInsight extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  image: string;
  order: number;
  isActive: boolean;
  publishedAt: Date;
}

const InsightSchema = new Schema<IInsight>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, default: "" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Insight || mongoose.model<IInsight>("Insight", InsightSchema);
