// "use client";

// import { useState } from "react";
// import { Eye, EyeOff } from "lucide-react";
// import { useRouter } from "next/navigation";

// export default function RegisterPage() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [address, setAddress] = useState("");
//   const [password, setPassword] = useState("");
//   const [termsChecked, setTermsChecked] = useState(false);
//   const [error, setError] = useState("");

//   const router = useRouter();

//   const handleRegister = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!fullName || !email || !password) {
//       setError("Please enter all required fields");
//       return;
//     }

//     if (!termsChecked) {
//       setError("You must accept the terms and conditions");
//       return;
//     }

//     setError("");
//     router.push("/dashboard");
//   };

//   return (
//     <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black px-4">

//       {/* Background Blobs */}
//       <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-gray-800 rounded-full blur-3xl opacity-40 animate-pulse-slow" />
//       <div className="absolute -bottom-40 -right-24 w-[500px] h-[500px] bg-gray-900 rounded-full blur-3xl opacity-30 animate-pulse-slow" />
//       <div className="absolute -top-64 -right-48 w-[400px] h-[400px] bg-gray-700 rounded-full blur-2xl opacity-25 animate-pulse-slow" />
//       <div className="absolute -bottom-64 -left-24 w-[400px] h-[400px] bg-gray-800 rounded-full blur-2xl opacity-30 animate-pulse-slow" />

//       {/* Form Card */}
//       <div className="relative w-full max-w-md bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-8 z-10">

//         {/* Title */}
//         <h1 className="text-3xl font-bold text-center text-teal-400 mb-2">
//           Create Account
//         </h1>

//         <p className="text-sm text-center text-gray-300 mb-6">
//           Already have an account?{" "}
//           <button
//             onClick={() => router.push("/login")}
//             className="text-teal-500 hover:underline font-semibold"
//           >
//             Login
//           </button>
//         </p>

//         {/* Error Message */}
//         {error && (
//           <p className="mb-4 text-sm text-red-500 text-center">{error}</p>
//         )}

//         {/* Form */}
//         <form className="space-y-5" onSubmit={handleRegister}>
//           {/* Full Name */}
//           <div>
//             <label className="block text-sm font-medium text-gray-300 mb-1">
//               Full Name
//             </label>
//             <input
//               type="text"
//               value={fullName}
//               onChange={(e) => setFullName(e.target.value)}
//               placeholder="Enter your full name"
//               className="w-full rounded-lg border border-gray-600 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-400 text-white placeholder-gray-400 shadow-sm bg-black/20"
//             />
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block text-sm font-medium text-gray-300 mb-1">
//               Email ID
//             </label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="example@email.com"
//               className="w-full rounded-lg border border-gray-600 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-400 text-white placeholder-gray-400 shadow-sm bg-black/20"
//             />
//           </div>

//           {/* Address */}
//           <div>
//             <label className="block text-sm font-medium text-gray-300 mb-1">
//               Address
//             </label>
//             <input
//               type="text"
//               value={address}
//               onChange={(e) => setAddress(e.target.value)}
//               placeholder="Enter your address"
//               className="w-full rounded-lg border border-gray-600 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-400 text-white placeholder-gray-400 shadow-sm bg-black/20"
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-sm font-medium text-gray-300 mb-1">
//               Password
//             </label>
//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter password"
//                 className="w-full rounded-lg border border-gray-600 px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-teal-400 text-white placeholder-gray-400 shadow-sm bg-black/20"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300"
//               >
//                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//               </button>
//             </div>
//           </div>

//           {/* Terms */}
//           <div className="flex items-center gap-2 text-sm text-gray-300">
//             <input
//               type="checkbox"
//               className="w-4 h-4 accent-teal-500"
//               checked={termsChecked}
//               onChange={(e) => setTermsChecked(e.target.checked)}
//             />
//             <span>I accept the terms and conditions</span>
//           </div>

//           {/* Sign Up Button */}
//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold py-3 rounded-lg text-lg transition shadow-md hover:opacity-90"
//           >
//             Sign Up
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useTransition } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

// Ensure your schema includes: firstname, email, address, password
import { RegisterData, registerSchema } from "../schema";
import { handleRegister } from "@/lib/actions/auth-action";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (values: RegisterData) => {
    setError(null);
    startTransition(async () => {
      try {
        const response = await handleRegister(values);
        if (!response.success) {
          throw new Error(response.message || "Registration failed");
        }
        router.push("/login");
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 py-10">
      {/* Main Card Wrapper */}
      <div className="w-full max-w-[480px] bg-[#161616] rounded-[40px] p-10 shadow-2xl">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#00f2ea] mb-2 tracking-tight">
            Create Account
          </h1>
          <p className="text-sm text-gray-300 font-medium">
            Already have an account?{" "}
            <Link href="/login" className="text-[#00c9c2] hover:underline">
              Login
            </Link>
          </p>
        </div>

        {/* Form Container */}
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          
          {/* Full Name Field */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-200 ml-1">
              Full Name
            </label>
            <input
              {...register("fullName")}
              placeholder="Enter your full name"
              className={`w-full rounded-2xl border bg-transparent px-5 py-4 text-white placeholder-gray-500 outline-none transition-all ${
                errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-[#00f2ea]'
              }`}
            />
            {errors.fullName?.message && (
              <p className="text-xs text-red-500 font-medium ml-1">Enter your full name</p>
            )}
          </div>

          {/* Email ID Field */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-200 ml-1">
              Email ID
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="example@email.com"
              className={`w-full rounded-2xl border bg-transparent px-5 py-4 text-white placeholder-gray-500 outline-none transition-all ${
                errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-[#00f2ea]'
              }`}
            />
            {errors.email?.message && (
              <p className="text-xs text-red-500 font-medium ml-1">Enter a valid email</p>
            )}
          </div>

          {/* Address Field - Now with error handling */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-200 ml-1">
              Address
            </label>
            <input
              {...register("address")} // Ensure your schema has an 'address' or 'username' field
              placeholder="Enter your address"
              className={`w-full rounded-2xl border bg-transparent px-5 py-4 text-white placeholder-gray-500 outline-none transition-all ${
                errors.address ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-[#00f2ea]'
              }`}
            />
            {errors.address?.message && (
              <p className="text-xs text-red-500 font-medium ml-1">Enter a address</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-200 ml-1">
              Password
            </label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className={`w-full rounded-2xl border bg-transparent px-5 py-4 pr-14 text-white placeholder-gray-500 outline-none transition-all ${
                  errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-[#00f2ea]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
            {errors.password?.message && (
              <p className="text-xs text-red-500 font-medium ml-1">Enter a password</p>
            )}
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-center gap-3 py-2">
            <input
              type="checkbox"
              id="terms"
              required
              className="w-5 h-5 accent-[#00f2ea] bg-transparent border-gray-600 rounded cursor-pointer"
            />
            <label htmlFor="terms" className="text-sm text-gray-200 cursor-pointer select-none">
              I accept the terms and conditions
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center justify-center w-full bg-gradient-to-r from-[#00c5bc] to-[#2c8eff] text-white font-bold py-4 rounded-2xl text-xl shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50 mt-4"
          >
            {isPending ? (
              <Loader2 className="animate-spin" size={26} />
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}