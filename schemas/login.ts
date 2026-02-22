import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(4, "Password is required"),
});

export type TLoginForm = z.infer<typeof loginSchema>;
