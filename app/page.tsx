import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black px-4">

      {/* Decorative Dark Background Blobs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-gray-800 rounded-full blur-3xl opacity-40 animate-pulse-slow"></div>
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-gray-900 rounded-full blur-3xl opacity-30 animate-pulse-slow"></div>
      <div className="absolute -top-64 -right-32 w-[400px] h-[400px] bg-gray-700 rounded-full blur-2xl opacity-25 animate-pulse-slow"></div>

      {/* Main Card */}
      <div className="relative bg-white/10 backdrop-blur-md px-14 py-16 rounded-[2.5rem] shadow-2xl text-center w-full max-w-lg z-10">

        {/* Title */}
        <h1 className="text-5xl font-extrabold text-teal-400 mb-4 tracking-tight">
          Clean Connect
        </h1>

        {/* Subtitle */}
        <p className="text-gray-300 mb-12 leading-relaxed text-lg max-w-sm mx-auto">
          Trusted home cleaning for a healthier, happier space.
        </p>

        {/* Buttons */}
        <div className="jutify-center">
          
          <Link href="/login" className="w-1/2">
            <button className="w-full h-14 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 text-white text-lg font-semibold hover:opacity-90 transition shadow-lg">
              Get Started
            </button>
          </Link>

          

        </div>

      </div>
    </div>
  );
}

