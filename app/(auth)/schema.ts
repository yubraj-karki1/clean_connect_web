import z from "zod";

export const loginSchema = z.object({
    email: z.email({ message: "Enter a valid email"}),
    password: z.string().min(6,{message:"Enter a password"}),
});

export type LoginData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    fullName: z.string().min(2, { message: "Enter a password" }),
    email: z.email({ message: "Enter a valid email" }),
    address: z.string().min(5, { message: "Enter a address" }),
    password: z.string().min(6, { message: "Enter a password " }),
    confirmPassword: z.string().min(6, { message: "Enter a password" }),
}).refine((v) => v.password === v.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
});

export type RegisterData = z.infer<typeof registerSchema>;