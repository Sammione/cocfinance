import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* Dynamic Animated Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full mix-blend-screen filter blur-[120px] opacity-40 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-500 rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-emerald-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob animation-delay-4000"></div>

      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

      <main className="z-10 flex flex-col items-center max-w-5xl w-full px-6 py-12">
        {/* Header/Logo Area */}
        <div className="mb-16 text-center flex flex-col items-center">
          <div className="w-24 h-24 mb-8 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-400 to-amber-200 rounded-2xl shadow-[0_0_40px_rgba(251,191,36,0.4)] rotate-3"></div>
            <div className="absolute inset-0 bg-slate-900 rounded-2xl -rotate-3 border border-slate-700 backdrop-blur-sm"></div>
            <svg className="w-12 h-12 text-amber-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
            Church Finance <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-500">System</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-2xl max-w-3xl mx-auto font-light leading-relaxed">
            A secure, transparent, and modern platform for managing church finances, offerings, and pledges.
          </p>
        </div>

        {/* Portals */}
        <div className="grid md:grid-cols-2 gap-8 w-full">
          {/* Admin Portal Card - Glassmorphism */}
          <div className="group relative bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-[2rem] p-8 hover:bg-slate-800/60 transition-all duration-500 overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-8 border border-blue-500/30 group-hover:scale-110 transition-transform duration-500">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Admin Portal</h2>
              <p className="text-slate-400 mb-10 text-lg leading-relaxed min-h-[80px]">
                For treasurers, finance officers, and church leaders to manage transactions and approve records.
              </p>
              
              <Link href="/admin/login" className="inline-flex items-center justify-center w-full py-4 px-6 bg-blue-600 hover:bg-blue-500 text-white text-lg font-semibold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] group-hover:translate-y-[-2px]">
                Access Admin Portal
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </Link>
            </div>
          </div>

          {/* Member Portal Card - Glassmorphism */}
          <div className="group relative bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-[2rem] p-8 hover:bg-slate-800/60 transition-all duration-500 overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center mb-8 border border-amber-500/30 group-hover:scale-110 transition-transform duration-500">
                <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Member Portal</h2>
              <p className="text-slate-400 mb-10 text-lg leading-relaxed min-h-[80px]">
                For church members to view public summaries, announcements, and their personal pledges.
              </p>
              
              <Link href="/member/login" className="inline-flex items-center justify-center w-full py-4 px-6 bg-amber-500 hover:bg-amber-400 text-slate-900 text-lg font-semibold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] group-hover:translate-y-[-2px]">
                Access Member Portal
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
