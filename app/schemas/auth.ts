import { z } from "zod";

const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

type LoginData = z.infer<typeof loginSchema>;

interface TokenResponse {
    access_token: string;
    token_type: string;
    expires_in?: number; 
}

const registerSchema = z.object({
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    full_name: z.string().min(1, "Full name is required"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
});

type RegisterData = z.infer<typeof registerSchema>;

export { loginSchema, registerSchema };
export type { LoginData, TokenResponse, RegisterData };  