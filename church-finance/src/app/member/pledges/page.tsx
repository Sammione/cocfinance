"use client";
import React from "react";
import extraData from "@/data/extra_data.json";

// In a real app, this would filter by the logged-in user's member_id via Supabase RLS.
// For now, we show all pledges as a demo.
const pledgesRaw = ((extraData as any).pledges || []).slice(1);
const pledges = pledgesRaw.filter((r:any) => r[1]).map((r:any) => ({
  sn: r[0] || 0, name: r[1] || "Unknown", description: r[2] || "-", total: r[3] || 0,
  status: r[3] > 0 ? "Completed" : "Pending",
}));

export default function MemberPledgesPage() {
  const totalPledged = pledges.reduce((a:number, p:any) => a + p.total, 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">My Pledges</h1>
        <p className="text-slate-500 text-sm">View your personal pledge records for church programmes.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Total Pledged</h3>
          <p className="text-2xl font-bold text-blue-600">₦{totalPledged.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Pledges Made</h3>
          <p className="text-2xl font-bold text-slate-900">{pledges.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="text-base font-bold text-slate-800">Pledge Records</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
              <th className="py-3 px-4 font-semibold">S/N</th>
              <th className="py-3 px-4 font-semibold">Contributor</th>
              <th className="py-3 px-4 font-semibold text-right">Amount (₦)</th>
              <th className="py-3 px-4 font-semibold text-center">Status</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {pledges.map((p:any, i:number) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-sm text-slate-500">{p.sn}</td>
                  <td className="py-3 px-4 text-sm font-medium text-slate-900">{p.name}</td>
                  <td className="py-3 px-4 text-sm text-right font-bold text-slate-900 tabular-nums">₦{p.total.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.status === "Completed" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>{p.status}</span>
                  </td>
                </tr>
              ))}
              {pledges.length === 0 && <tr><td colSpan={4} className="py-12 text-center text-slate-500">You have no pledge records.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6 text-sm text-amber-800">
        <strong>Note:</strong> When Supabase authentication is connected, this page will show only your personal pledges. Currently displaying all pledges for demonstration purposes.
      </div>
    </div>
  );
}
