import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-cyan-100 via-sky-100 to-teal-200">

      {/* Decorative Background Blobs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-300 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-teal-300 rounded-full blur-3xl opacity-30"></div>

      {/* Main Card */}
      <div className="relative bg-white/95 backdrop-blur-md px-14 py-16 rounded-[2.5rem] shadow-2xl text-center w-full max-w-lg">

        {/* Title */}
        <h1 className="text-5xl font-extrabold text-blue-700 mb-4 tracking-tight">
          Clean <br /> Connect
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 mb-12 leading-relaxed text-base max-w-sm mx-auto">
          Trusted home cleaning for a healthier, happier space.
        </p>

        {/* Buttons */}
        <div className="space-y-6">

          <Link href="/login">
            <button className="w-full h-14 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-lg font-semibold hover:opacity-90 transition shadow-lg">
              Login
            </button>
          </Link>

          <Link href="/register">
            <button className="w-full h-14 rounded-full border-2 border-blue-600 text-blue-600 text-lg font-semibold hover:bg-blue-50 transition shadow-sm">
              Create Account
            </button>
          </Link>

        </div>
      </div>
    </div>
  );
}
