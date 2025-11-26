import Twin from "@/components/twin";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-slate-200 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-center mb-2 bg-gradient-to-r from-slate-700 via-slate-600 to-blue-600 bg-clip-text text-transparent">
            AI in Production
          </h1>
          <p className="text-center text-gray-600 mb-8 text-lg font-medium">
            Deploy your Digital Twin to the cloud ✨
          </p>

          <div className="h-[600px]">
            <Twin />
          </div>

          <footer className="mt-8 text-center text-sm text-gray-500 font-medium">
            <p>Week 2: Building Your Digital Twin 🚀</p>
          </footer>
        </div>
      </div>
    </main>
  );
}
