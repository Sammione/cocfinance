import Link from "next/link";

export default function MemberLogin() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Member Login</h2>
        <p className="text-slate-400 mb-8">Sign in to view your pledges and church summaries.</p>
        
        {/* Placeholder for future Supabase Auth */}
        <div className="space-y-4">
          <input type="email" placeholder="Email Address" className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
          <input type="password" placeholder="Password" className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
          
          {/* Member portal doesn't exist yet, we'll link back to home for the demo */}
          <Link href="/member/dashboard" className="block w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-xl transition-colors mt-6">
            Sign In (Demo)
          </Link>
        </div>

        <div className="mt-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-white transition-colors">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
