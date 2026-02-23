import mongoose, { Schema, Document } from "mongoose";

export interface IHero extends Document {
  badgeText: string;
  title: string;
  highlightText: string;
  description: string;
  image: string;
  primaryBtnText?: string;
  primaryBtnLink?: string;
  secondaryBtnText?: string;
  secondaryBtnLink?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HeroSchema = new Schema<IHero>(
  {
    badgeText: { type: String, required: true },
    title: { type: String, required: true },
    highlightText: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    primaryBtnText: { type: String },
    primaryBtnLink: { type: String },
    secondaryBtnText: { type: String },
    secondaryBtnLink: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Hero || mongoose.model<IHero>("Hero", HeroSchema);
