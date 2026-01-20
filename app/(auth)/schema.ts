import z from "zod";

export const loginSchema = z.object({
    email: z.email({ message: "Enter a valid email"}),
    password: z.string().min(6,{message:"Enter a password"}),
});

export type LoginData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Enter a valid email address"),
  phoneNumber: z.string()
    .min(8, "Phone number must be at least 8 digits")
    .max(10, "Phone number too long"),
  address: z.string().min(2, "Address is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  terms: z.boolean().refine((val) => val === true, "You must accept terms"),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // This sets the error specifically on the confirmPassword field
});

export type RegisterData = z.infer<typeof registerSchema>;