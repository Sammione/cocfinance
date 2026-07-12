"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MemberLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "cocmember" && password === "cocmember12") {
      router.push("/member/dashboard");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Member Login</h2>
        <p className="text-slate-400 mb-8">Sign in to view your pledges and church summaries.</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="text" 
            placeholder="Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500" 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500" 
          />
          
          {error && <p className="text-red-400 text-sm">{error}</p>}
          
          <button type="submit" className="block w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-xl transition-colors mt-6">
            Sign In
          </button>
        </form>

        <div className="mt-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-white transition-colors">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
