import mongoose, { Schema, Document } from "mongoose";

export interface ISetting extends Document {
  siteName: string;
  email: string;
  phone: string;
  address: string;
  footerDescription: string;
  socialLinks: {
    platform: string;
    url: string;
    icon: string;
  }[];
}

const SettingSchema = new Schema<ISetting>(
  {
    siteName: { type: String, default: "YPL" },
    email: { type: String, default: "info@ypl.com" },
    phone: { type: String, default: "+44 (0) 20 1234 5678" },
    address: { type: String, default: "123 Business Street, London, EC1A 1BB, United Kingdom" },
    footerDescription: { type: String, default: "Supporting the full talent lifecycle with expert recruitment and career management services." },
    socialLinks: [
      {
        platform: String,
        url: String,
        icon: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Setting || mongoose.model<ISetting>("Setting", SettingSchema);
