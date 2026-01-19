// "use client";

// import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// export default function LoginPage() {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");

//   const handleLogin = () => {
//     if (!email || !password) {
//       setError("Please enter email and password");
//       return;
//     }
//     setError("");
//     router.push("/dashboard");
//   };

//   return (
//     <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-black">

//       {/* Dark Background Blobs */}
//       <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-gray-800 rounded-full blur-3xl opacity-40 animate-pulse-slow" />
//       <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-gray-900 rounded-full blur-3xl opacity-30 animate-pulse-slow" />
//       <div className="absolute -bottom-40 left-1/4 w-[500px] h-[500px] bg-gray-700 rounded-full blur-3xl opacity-30 animate-pulse-slow" />

//       {/* Login Card */}
//       <div className="relative w-full max-w-lg bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-10 z-10">

//         {/* Back */}
//         <button
//           onClick={() => router.push("/home")}
//           className="flex items-center gap-2 text-sm text-teal-400 mb-8 hover:text-teal-500"
//         >
//           <ArrowLeft size={18} />
//           Back
//         </button>

//         {/* Title */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-extrabold text-teal-400">
//             CleanConnect
//           </h1>
//           <p className="text-base text-gray-300 mt-2">
//             Welcome back! Please login to continue
//           </p>
//         </div>

//         {/* Error */}
//         {error && (
//           <p className="mb-5 text-sm text-red-500 text-center">
//             {error}
//           </p>
//         )}

//         {/* Email */}
//         <div className="mb-6">
//           <label className="block text-base font-medium text-gray-300 mb-2">
//             Email Address
//           </label>
//           <div className="flex items-center border rounded-xl px-4 py-1 border-gray-600 focus-within:border-teal-400">
//             <Mail size={20} className="text-teal-400" />
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="you@example.com"
//               className="w-full px-4 py-3 outline-none text-white text-base bg-black/20"
//             />
//           </div>
//         </div>

//         {/* Password */}
//         <div className="mb-3">
//           <label className="block text-base font-medium text-gray-300 mb-2">
//             Password
//           </label>
//           <div className="flex items-center border rounded-xl px-4 py-1 border-gray-600 focus-within:border-teal-400">
//             <Lock size={20} className="text-teal-400" />
//             <input
//               type={showPassword ? "text" : "password"}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="••••••••"
//               className="w-full px-4 py-3 outline-none text-white text-base bg-black/20"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="ml-2 text-gray-400 hover:text-gray-200"
//             >
//               {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//             </button>
//           </div>
//         </div>

//         {/* Forgot Password */}
//         <div className="text-right mb-8">
//           <span
//             onClick={() => router.push("/forgot-password")}
//             className="text-sm text-teal-500 cursor-pointer hover:underline"
//           >
//             Forgot password?
//           </span>
//         </div>

//         {/* Sign In Button */}
//         <button
//           onClick={handleLogin}
//           className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white py-4 rounded-xl text-lg font-semibold hover:opacity-90 transition shadow-lg"
//         >
//           Sign In
//         </button>

//         {/* Register */}
//         <p className="text-center text-base text-gray-300 mt-6">
//           Don&apos;t have an account?{" "}
//           <span
//             onClick={() => router.push("/register")}
//             className="text-teal-400 font-semibold cursor-pointer hover:underline"
//           >
//             Sign up
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// }


"use client";

import { Mail, Lock, Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

// Importing your logic from Code 1
import { LoginData, loginSchema } from "../schema";
import { handleLogin } from "@/lib/actions/auth-action";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Setup React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (values: LoginData) => {
    setError(null);

    startTransition(async () => {
      try {
        const response = await handleLogin(values);
        
        if (!response.success) {
          setError(response.message || "Invalid credentials");
          return;
        }

        router.push("/user/dashboard");
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      }
    });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-black text-white">
      
      {/* Background Decorative Blobs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-gray-800 rounded-full blur-3xl opacity-40 animate-pulse" />
      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-gray-900 rounded-full blur-3xl opacity-30 animate-pulse" />

      {/* Login Card */}
      <div className="relative w-full max-w-lg bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-10 z-10 border border-white/10">
        
        {/* Back Button */}
        <Link
          href="/home"
          className="flex items-center gap-2 text-sm text-teal-400 mb-8 hover:text-teal-500 transition-colors w-fit"
        >
          <ArrowLeft size={18} />
          Back
        </Link>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-teal-400 tracking-tight">
            CleanConnect
          </h1>
          <p className="text-base text-gray-300 mt-2">
            Welcome back! Please login to continue
          </p>
        </div>

        {/* Global Error Message */}
        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-sm text-red-500 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="email">
              Email Address
            </label>
            <div className={`flex items-center border rounded-xl px-4 bg-black/20 transition-colors focus-within:border-teal-400 ${errors.email ? 'border-red-500' : 'border-gray-600'}`}>
              <Mail size={20} className="text-teal-400" />
              <input
                {...register("email")}
                id="email"
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 outline-none text-white text-base bg-transparent"
              />
            </div>
            {errors.email?.message && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="password">
              Password
            </label>
            <div className={`flex items-center border rounded-xl px-4 bg-black/20 transition-colors focus-within:border-teal-400 ${errors.password ? 'border-red-500' : 'border-gray-600'}`}>
              <Lock size={20} className="text-teal-400" />
              <input
                {...register("password")}
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full px-4 py-3 outline-none text-white text-base bg-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-gray-400 hover:text-gray-200"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password?.message && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-teal-500 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white py-4 rounded-xl text-lg font-semibold hover:opacity-90 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center text-base text-gray-300 mt-8">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-teal-400 font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}