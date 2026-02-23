import { z } from "zod";

export const userSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(4, "Min 4 characters").optional(),
  role: z.enum(["superadmin", "admin", "manager"]).default("manager"),
  isActive: z.boolean().default(true),
});

export type TUserForm = z.infer<typeof userSchema>;
